#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
模块结构图生成器（LLM Wiki v0.3）

读取 wiki 的三份真源，生成自包含的可视化网页：
  structure.json  → section / page / 壳层 / 弹层 / 孤儿
  edges.json      → 边 + issues
  nodes/*/*.md    → 节点 frontmatter 与条目统计

输出：wiki/module-map.html（单文件、零外部依赖、双击即开）

用法：python build_map.py
"""
from __future__ import annotations

import json
import os
import re
import sys
from typing import Any

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WIKI_DIR = os.path.join(REPO_ROOT, "wiki")
NODES_DIR = os.path.join(WIKI_DIR, "nodes")
STRUCTURE_FILE = os.path.join(WIKI_DIR, "structure.json")
EDGES_FILE = os.path.join(WIKI_DIR, "edges.json")
OUT_FILE = os.path.join(WIKI_DIR, "module-map.html")
SITE_DIR = os.path.join(WIKI_DIR, "site")
SITE_INDEX = os.path.join(SITE_DIR, "index.html")

FM_RE = re.compile(r"\A---\r?\n(.*?)\r?\n---\r?\n", re.DOTALL)

# 边类型 → 展示元数据（颜色/中文名）
TYPE_META: dict[str, dict[str, str]] = {
    "navigate": {"label": "跳转", "color": "#6366f1"},
    "navigate-with-payload": {"label": "跳转·带参", "color": "#2563eb"},
    "writeback": {"label": "回写", "color": "#ea580c"},
    "read": {"label": "读", "color": "#0891b2"},
    "reuse": {"label": "复用", "color": "#a855f7"},
    "embed": {"label": "内嵌", "color": "#0d9488"},
}
STATUS_META: dict[str, dict[str, str]] = {
    "implemented": {"label": "已实现", "dash": "0"},
    "intended": {"label": "设计有·未实现", "dash": "7 5"},
    "undefined": {"label": "待确认", "dash": "2 4"},
}
IMPORTANCE_COLOR = {"high": "#2563eb", "medium": "#94a3b8", "low": "#cbd5e1"}


def parse_frontmatter(text: str) -> dict[str, Any] | None:
    """极简 YAML 子集：标量 + `- ` 列表 + `[a, b]` 列表。"""
    m = FM_RE.match(text)
    if not m:
        return None
    data: dict[str, Any] = {}
    key: str | None = None
    for raw in m.group(1).splitlines():
        line = raw.rstrip()
        if not line.strip() or line.strip().startswith("#"):
            continue
        if line.lstrip().startswith("- ") and key:
            data.setdefault(key, [])
            if isinstance(data[key], list):
                data[key].append(line.strip()[2:].strip().strip('"').strip("'"))
            continue
        if ":" in line:
            k, _, v = line.partition(":")
            k, v = k.strip(), v.strip()
            key = k
            if v == "":
                data[k] = []
            elif v.startswith("[") and v.endswith("]"):
                inner = v[1:-1].strip()
                data[k] = [x.strip().strip('"').strip("'") for x in inner.split(",") if x.strip()] if inner else []
            else:
                data[k] = v.strip('"').strip("'")
    return data


def count_section_items(text: str, heading: str, marker: str) -> int:
    """统计某个固定节里的条目数（marker 为 'num' 数编号行，'dash' 数 '- ' 行）。"""
    lines = text.splitlines()
    started = False
    count = 0
    for line in lines:
        if line.startswith("## "):
            if started:
                break
            if heading in line:
                started = True
            continue
        if not started:
            continue
        s = line.strip()
        if marker == "num" and re.match(r"^\d+\.\s", s):
            count += 1
        elif marker == "dash" and s.startswith("- "):
            count += 1
    return count


def load_nodes() -> list[dict[str, Any]]:
    nodes: list[dict[str, Any]] = []
    if not os.path.isdir(NODES_DIR):
        return nodes
    for page_dir in sorted(os.listdir(NODES_DIR)):
        full_dir = os.path.join(NODES_DIR, page_dir)
        if not os.path.isdir(full_dir):
            continue
        for fn in sorted(os.listdir(full_dir)):
            if not fn.endswith(".md"):
                continue
            path = os.path.join(full_dir, fn)
            with open(path, encoding="utf-8") as fh:
                text = fh.read()
            fm = parse_frontmatter(text) or {}
            srcs = fm.get("sources") or []
            if isinstance(srcs, str):
                srcs = [srcs]
            nodes.append({
                "id": fm.get("id", fn[:-3]),
                "title": fm.get("title", ""),
                "page": fm.get("page", ""),
                "kind": fm.get("kind", ""),
                "importance": fm.get("importance", "medium"),
                "file": os.path.relpath(path, REPO_ROOT).replace("\\", "/"),
                "sources": srcs,
                "factCount": count_section_items(text, "事实", "num"),
                "ruleCount": count_section_items(text, "规则与边界", "dash"),
            })
    return nodes


def build_data() -> dict[str, Any]:
    with open(STRUCTURE_FILE, encoding="utf-8") as fh:
        structure = json.load(fh)
    with open(EDGES_FILE, encoding="utf-8") as fh:
        edge_doc = json.load(fh)
    nodes = load_nodes()

    node_by_id = {n["id"]: n for n in nodes}
    page_by_id = {p["id"]: p for p in structure.get("pages", [])}
    modal_by_id = {m["id"]: m for m in structure.get("modals", [])}

    # 解析所有边端点为一个"图节点"
    graph_nodes: dict[str, dict[str, Any]] = {}

    def touch(nid: str) -> None:
        if nid in graph_nodes:
            return
        if nid in node_by_id:
            n = node_by_id[nid]
            graph_nodes[nid] = {
                "id": nid, "label": n["title"], "sub": n["id"],
                "kind": n["kind"], "importance": n["importance"],
                "tier": "node", "page": n["page"],
                "factCount": n["factCount"], "ruleCount": n["ruleCount"],
                "file": n["file"], "sources": n["sources"],
            }
        elif nid in page_by_id:
            p = page_by_id[nid]
            graph_nodes[nid] = {
                "id": nid, "label": p["title"], "sub": nid,
                "kind": "page", "importance": p.get("importance", "medium"),
                "tier": "page", "page": nid,
                "factCount": None, "ruleCount": None,
                "file": p.get("component", ""), "sources": [],
                "note": p.get("description", ""),
            }
        elif nid in modal_by_id:
            m = modal_by_id[nid]
            graph_nodes[nid] = {
                "id": nid, "label": m["title"], "sub": nid,
                "kind": "modal", "importance": "medium",
                "tier": "modal", "page": "",
                "factCount": None, "ruleCount": None,
                "file": m.get("component", ""), "sources": [],
            }
        else:
            graph_nodes[nid] = {
                "id": nid, "label": nid, "sub": nid, "kind": "unknown",
                "importance": "low", "tier": "unknown", "page": "",
                "factCount": None, "ruleCount": None, "file": "", "sources": [],
            }

    for e in edge_doc.get("edges", []):
        touch(e.get("from", ""))
        touch(e.get("to", ""))

    # 列分配：**每个已下钻的页面各占一列**（按 sections 声明的顺序），其余图节点（跨页目标 / 弹层 / 壳层）归入末列。
    # 这样每新增一个下钻页面就自动多一列，不需要改这份生成器。
    page_order: list[str] = []
    for s in structure.get("sections", []):
        for pid in s.get("pages", []):
            if pid in page_by_id and pid not in page_order:
                page_order.append(pid)
    for p in structure.get("pages", []):
        if p["id"] not in page_order:
            page_order.append(p["id"])

    owned_pages = {n["page"] for n in nodes if n.get("page")}
    drilled_pages = [pid for pid in page_order if pid in owned_pages]

    def column_of(nid: str) -> str:
        g = graph_nodes[nid]
        if g["tier"] == "node" and g["page"] in owned_pages:
            return "col-" + g["page"]
        if g["tier"] == "page" and nid in owned_pages:
            return "col-" + nid
        return "col-external"

    col_defs = []
    for pid in drilled_pages:
        p = page_by_id[pid]
        col_defs.append(
            {
                "id": "col-" + pid,
                "title": p.get("title", pid),
                "subtitle": "%s · %s" % (pid, (p.get("description", "") or "")[:28]),
            }
        )
    col_defs.append(
        {
            "id": "col-external",
            "title": "外部模块",
            "subtitle": "其他页面 / 弹层 / 壳层（本批未下钻）",
        }
    )

    for nid, g in graph_nodes.items():
        g["col"] = column_of(nid)

    # 列内排序：节点按 kind 归组，保证语义相邻
    kind_rank = {"nav": 0, "bar": 1, "tab": 2, "list": 3, "panel": 4, "table": 5,
                 "form": 6, "drawer": 7, "modal": 8, "page": 9, "unknown": 10}
    by_col: dict[str, list[str]] = {c["id"]: [] for c in col_defs}
    for nid in graph_nodes:
        cid = graph_nodes[nid]["col"]
        if cid not in by_col:  # 兜底：不该发生
            cid = "col-external"
            graph_nodes[nid]["col"] = cid
        by_col[cid].append(nid)
    for cid in by_col:
        by_col[cid].sort(key=lambda n: (kind_rank.get(graph_nodes[n]["kind"], 99), graph_nodes[n]["label"]))

    # 边：算平行边偏移
    pair_count: dict[tuple[str, str], int] = {}
    for e in edge_doc.get("edges", []):
        k = (e.get("from", ""), e.get("to", ""))
        pair_count[k] = pair_count.get(k, 0) + 1
    pair_seen: dict[tuple[str, str], int] = {}

    edges: list[dict[str, Any]] = []
    for e in edge_doc.get("edges", []):
        k = (e.get("from", ""), e.get("to", ""))
        idx = pair_seen.get(k, 0)
        pair_seen[k] = idx + 1
        total = pair_count[k]
        offset = 0.0 if total == 1 else (idx - (total - 1) / 2) * 26
        tmeta = TYPE_META.get(e.get("type", ""), {"label": e.get("type", ""), "color": "#64748b"})
        smeta = STATUS_META.get(e.get("status", ""), {"label": e.get("status", ""), "dash": "0"})
        edges.append({
            "id": e.get("id", ""),
            "from": e.get("from", ""),
            "to": e.get("to", ""),
            "type": e.get("type", ""),
            "typeLabel": tmeta["label"],
            "color": tmeta["color"],
            "status": e.get("status", ""),
            "statusLabel": smeta["label"],
            "dash": smeta["dash"],
            "trigger": e.get("trigger", ""),
            "payload": e.get("payload", ""),
            "logic": e.get("logic", ""),
            "note": e.get("note", ""),
            "designRef": e.get("designRef", ""),
            "expected": e.get("expected", ""),
            "blockedBy": e.get("blockedBy", ""),
            "issue": e.get("issue", ""),
            "severity": e.get("severity", ""),
            "evidenceChain": e.get("evidenceChain", ""),
            "sources": e.get("sources") or [],
            "offset": offset,
        })

    return {
        "meta": {
            "title": structure.get("title", "结构知识库"),
            "baseline": structure.get("baseline", ""),
            "schemaVersion": structure.get("schemaVersion", ""),
            "generatedAt": structure.get("generatedAt", ""),
            "layerModel": structure.get("layerModel", []),
            "ownershipPrinciple": structure.get("ownershipPrinciple", ""),
        },
        "stats": {
            "sections": len(structure.get("sections", [])),
            "pages": len(structure.get("pages", [])),
            "drilled": len([p for p in structure.get("pages", []) if p.get("docStatus") == "drilled"]),
            "nodes": len(nodes),
            "edges": len(edges),
            "implemented": len([e for e in edges if e["status"] == "implemented"]),
            "intended": len([e for e in edges if e["status"] == "intended"]),
            "undefined": len([e for e in edges if e["status"] == "undefined"]),
            "issues": len(edge_doc.get("issues", [])),
            "orphans": len(structure.get("orphanComponents", [])),
        },
        "sections": structure.get("sections", []),
        "pages": structure.get("pages", []),
        "orphans": structure.get("orphanComponents", []),
        "shell": structure.get("shellComponents", []),
        "issues": edge_doc.get("issues", []),
        "graph": {
            "columns": col_defs,
            "nodes": list(graph_nodes.values()),
            "byCol": {c["id"]: by_col[c["id"]] for c in col_defs},
        },
        "edges": edges,
        "typeMeta": TYPE_META,
        "statusMeta": STATUS_META,
        "importanceColor": IMPORTANCE_COLOR,
    }


HTML_TEMPLATE = r"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>模块结构图 · 双创赛事智能体</title>
<style>
  :root{
    --bg:#f6f8fb; --panel:#ffffff; --line:#e3e8ef; --line-soft:#eef2f7;
    --ink:#0f172a; --ink-2:#475569; --ink-3:#94a3b8;
    --accent:#2563eb; --warn:#d97706; --ok:#16a34a;
    --radius:12px;
  }
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--ink);
    font-family:'PingFang SC','Microsoft YaHei',-apple-system,'Segoe UI',sans-serif;
    font-size:13px;line-height:1.6;-webkit-font-smoothing:antialiased}
  a{color:var(--accent);text-decoration:none}
  code,.mono{font-family:'SFMono-Regular',Consolas,'Liberation Mono',monospace;font-size:11.5px}

  header{background:var(--panel);border-bottom:1px solid var(--line);padding:16px 24px 12px}
  .hdr-top{display:flex;align-items:baseline;gap:14px;flex-wrap:wrap}
  h1{font-size:17px;font-weight:600;margin:0;letter-spacing:.3px}
  .hdr-sub{color:var(--ink-3);font-size:12px}
  .stats{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
  .stat{background:#f8fafc;border:1px solid var(--line);border-radius:9px;padding:6px 11px;min-width:74px}
  .stat .n{font-size:16px;font-weight:600;line-height:1.25}
  .stat .l{font-size:11px;color:var(--ink-3)}
  .stat.hot{border-color:#fcd9a8;background:#fffbf3}
  .stat.hot .n{color:var(--warn)}
  .stat.good .n{color:var(--ok)}

  .legend{display:flex;gap:20px;flex-wrap:wrap;margin-top:12px;padding-top:11px;border-top:1px dashed var(--line)}
  .lg{display:flex;align-items:center;gap:7px;font-size:11.5px;color:var(--ink-2)}
  .lg-swatch{width:26px;height:0;border-top-width:2px;border-top-style:solid}
  .lg-dot{width:9px;height:9px;border-radius:50%;flex:0 0 auto}

  .wrap{display:flex;align-items:flex-start;gap:16px;padding:16px 24px 40px}
  .canvas-wrap{position:relative;flex:1 1 auto;min-width:0;background:var(--panel);
    border:1px solid var(--line);border-radius:var(--radius);overflow:auto}
  .canvas{position:relative;padding:22px;display:flex;gap:186px;min-width:max-content}
  svg.edges{position:absolute;left:0;top:0;pointer-events:none;overflow:visible}

  .col{width:266px;flex:0 0 266px}
  .col-hd{margin-bottom:12px;padding-bottom:8px;border-bottom:2px solid var(--line)}
  .col-hd .t{font-weight:600;font-size:13.5px}
  .col-hd .s{font-size:11px;color:var(--ink-3);font-family:'SFMono-Regular',Consolas,monospace}
  .col-body{display:flex;flex-direction:column;gap:12px}

  .card{position:relative;background:#fff;border:1px solid var(--line);border-radius:10px;
    padding:10px 12px 10px 15px;cursor:pointer;transition:border-color .13s,box-shadow .13s}
  .card:hover{border-color:#bfd4f5;box-shadow:0 2px 10px rgba(37,99,235,.11)}
  .card.sel{border-color:var(--accent);box-shadow:0 0 0 2.5px rgba(37,99,235,.16)}
  .card.dim{opacity:.28}
  .card .bar{position:absolute;left:0;top:9px;bottom:9px;width:3px;border-radius:0 3px 3px 0}
  .card .r1{display:flex;align-items:center;justify-content:space-between;gap:8px}
  .card .nm{font-weight:600;font-size:12.5px;line-height:1.35}
  .card .kd{font-size:10px;color:var(--ink-3);background:#f1f5f9;border-radius:5px;
    padding:1px 6px;font-family:'SFMono-Regular',Consolas,monospace;flex:0 0 auto}
  .card .r2{margin-top:3px;font-size:10.5px;color:var(--ink-3);
    font-family:'SFMono-Regular',Consolas,monospace;word-break:break-all}
  .card .r3{margin-top:6px;display:flex;gap:6px;flex-wrap:wrap}
  .chip{font-size:10px;background:#f8fafc;border:1px solid var(--line);border-radius:5px;padding:0 5px;color:var(--ink-2)}
  .card .gapdot{position:absolute;right:-5px;top:50%;margin-top:-5px;width:10px;height:10px;
    border-radius:50%;border:2px solid #fff;display:none}
  .card.hasgap .gapdot{display:block}

  .side{flex:0 0 356px;display:flex;flex-direction:column;gap:14px;position:sticky;top:16px}
  .box{background:var(--panel);border:1px solid var(--line);border-radius:var(--radius);overflow:hidden}
  .box-hd{padding:10px 14px;border-bottom:1px solid var(--line);font-weight:600;font-size:12.5px;
    display:flex;justify-content:space-between;align-items:center}
  .box-hd .cnt{font-size:11px;color:var(--ink-3);font-weight:400}
  .box-bd{padding:12px 14px;max-height:300px;overflow:auto}
  .empty{color:var(--ink-3);font-size:12px;text-align:center;padding:18px 0}

  .kv{display:grid;grid-template-columns:66px 1fr;gap:6px 10px;font-size:12px}
  .kv .k{color:var(--ink-3)}
  .kv .v{word-break:break-word}
  .sec-title{font-size:11px;font-weight:600;color:var(--ink-3);letter-spacing:.6px;margin:13px 0 6px}
  .sec-title:first-child{margin-top:0}
  .quote{background:#f8fafc;border-left:2.5px solid var(--line);padding:7px 10px;border-radius:0 7px 7px 0;
    font-size:11.5px;color:var(--ink-2);white-space:pre-wrap;word-break:break-word}
  .quote.warn{background:#fffbf3;border-left-color:var(--warn)}
  .quote.ok{background:#f4fbf6;border-left-color:var(--ok)}

  .eitem{border:1px solid var(--line);border-radius:9px;padding:8px 10px;margin-bottom:8px;cursor:pointer}
  .eitem:hover{border-color:#bfd4f5;background:#fafcff}
  .eitem.sel{border-color:var(--accent);background:#f5f9ff}
  .eitem .e1{display:flex;align-items:center;gap:6px;font-size:11.5px;font-weight:600}
  .eitem .e2{font-size:10.5px;color:var(--ink-3);margin-top:4px;
    font-family:'SFMono-Regular',Consolas,monospace;word-break:break-all}
  .pill{font-size:10px;padding:1px 6px;border-radius:5px;font-weight:600;flex:0 0 auto}

  .ilist .iitem{border-bottom:1px solid var(--line-soft);padding:9px 0}
  .ilist .iitem:last-child{border-bottom:0}
  .iitem .t{font-weight:600;font-size:12px;margin-bottom:3px}
  .iitem .w{font-size:10.5px;color:var(--ink-3);font-family:'SFMono-Regular',Consolas,monospace}
  .iitem .d{font-size:11.5px;color:var(--ink-2);margin-top:5px}

  .footer{padding:0 24px 40px}
  .ftable{width:100%;border-collapse:collapse;background:var(--panel);border:1px solid var(--line);
    border-radius:var(--radius);overflow:hidden;font-size:12px}
  .ftable th{text-align:left;font-weight:600;font-size:11px;color:var(--ink-3);letter-spacing:.5px;
    padding:9px 12px;background:#f8fafc;border-bottom:1px solid var(--line)}
  .ftable td{padding:9px 12px;border-bottom:1px solid var(--line-soft);vertical-align:top}
  .ftable tr:last-child td{border-bottom:0}
  .ftable tr.clickable{cursor:pointer}
  .ftable tr.clickable:hover{background:#fafcff}

  .tabs{display:flex;gap:4px;margin-bottom:0}
  .tab{padding:6px 12px;font-size:12px;border:1px solid var(--line);border-bottom:0;
    border-radius:9px 9px 0 0;background:#f8fafc;color:var(--ink-2);cursor:pointer}
  .tab.on{background:var(--panel);color:var(--ink);font-weight:600;border-color:var(--accent);
    box-shadow:inset 0 2.5px 0 var(--accent)}
</style>
</head>
<body>
<header>
  <div class="hdr-top">
    <h1>模块结构图</h1>
    <span class="hdr-sub" id="hdrSub"></span>
  </div>
  <div class="stats" id="stats"></div>
  <div class="legend" id="legend"></div>
</header>

<div class="wrap">
  <div class="canvas-wrap">
    <div class="canvas" id="canvas">
      <svg class="edges" id="edges"></svg>
    </div>
  </div>
  <aside class="side">
    <div class="box">
      <div class="box-hd"><span>详情</span><span class="cnt" id="detailHint">点击卡片或连线</span></div>
      <div class="box-bd" id="detail"><div class="empty">未选中</div></div>
    </div>
    <div class="box">
      <div class="box-hd"><span>缺口与待确认</span><span class="cnt" id="gapCnt"></span></div>
      <div class="box-bd ilist" id="gaps"></div>
    </div>
  </aside>
</div>

<div class="footer">
  <div class="tabs" id="tabs"></div>
  <div id="tabBody"></div>
</div>

<script>
const DATA = __DATA__;
const $ = id => document.getElementById(id);
const esc = s => String(s==null?'':s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const nodeById = {};
DATA.graph.nodes.forEach(n => nodeById[n.id] = n);
const edgeById = {};
DATA.edges.forEach(e => edgeById[e.id] = e);

let selKind = null, selId = null;

/* ---------- header ---------- */
(function renderHeader(){
  const m = DATA.meta, s = DATA.stats;
  $('hdrSub').innerHTML = esc(m.baseline) + ' · schema ' + esc(m.schemaVersion) + ' · 生成于 ' + esc(m.generatedAt);
  const items = [
    ['一级模块', s.sections, ''],
    ['页面/视图', s.pages, ''],
    ['已下钻', s.drilled, ''],
    ['节点', s.nodes, ''],
    ['边', s.edges, ''],
    ['已实现', s.implemented, 'good'],
    ['未实现', s.intended, 'hot'],
    ['待确认', s.undefined, 'hot'],
    ['issues', s.issues, 'hot'],
    ['孤儿组件', s.orphans, ''],
  ];
  $('stats').innerHTML = items.map(([l,n,c]) =>
    `<div class="stat ${c}"><div class="n">${n}</div><div class="l">${l}</div></div>`).join('');

  const typeLg = Object.entries(DATA.typeMeta).filter(([k]) => DATA.edges.some(e => e.type === k))
    .map(([k,v]) => `<span class="lg"><span class="lg-swatch" style="border-top-color:${v.color}"></span>${esc(v.label)}</span>`).join('');
  const statusLg = Object.entries(DATA.statusMeta)
    .map(([k,v]) => `<span class="lg"><span class="lg-swatch" style="border-top:2px ${v.dash==='0'?'solid':'dashed'} #64748b"></span>${esc(v.label)}</span>`).join('');
  const impLg = ['high','medium','low'].map(k =>
    `<span class="lg"><span class="lg-dot" style="background:${DATA.importanceColor[k]}"></span>${k}</span>`).join('');
  $('legend').innerHTML = '<span class="lg" style="color:#94a3b8">颜色=边类型</span>' + typeLg
    + '<span class="lg" style="color:#94a3b8;margin-left:8px">线型=实现状态</span>' + statusLg
    + '<span class="lg" style="color:#94a3b8;margin-left:8px">左侧竖条=重要度</span>' + impLg;
})();

/* ---------- canvas ---------- */
function gapEdgesOf(nid){
  return DATA.edges.filter(e => (e.from===nid || e.to===nid) && e.status!=='implemented');
}

(function renderCanvas(){
  const canvas = $('canvas');
  DATA.graph.columns.forEach(col => {
    const ids = DATA.graph.byCol[col.id] || [];
    if(!ids.length) return;
    const el = document.createElement('div');
    el.className = 'col';
    el.innerHTML = `<div class="col-hd"><div class="t">${esc(col.title)}</div><div class="s">${esc(col.subtitle)}</div></div>`
      + '<div class="col-body">' + ids.map(id => {
        const n = nodeById[id];
        const imp = DATA.importanceColor[n.importance] || '#cbd5e1';
        const gap = gapEdgesOf(id).length;
        const meta = [];
        if(n.tier==='node'){
          if(n.factCount) meta.push(`事实 ${n.factCount}`);
          if(n.ruleCount) meta.push(`规则 ${n.ruleCount}`);
          if(n.sources && n.sources.length) meta.push(`引用 ${n.sources.length}`);
        } else {
          meta.push(n.tier === 'page' ? '页面级' : (n.tier === 'modal' ? '弹层' : ''));
        }
        return `<div class="card${gap?' hasgap':''}" data-id="${esc(id)}" data-kind="node">
          <span class="bar" style="background:${imp}"></span>
          <div class="r1"><span class="nm">${esc(n.label)}</span><span class="kd">${esc(n.kind)}</span></div>
          <div class="r2">${esc(n.sub)}</div>
          <div class="r3">${meta.filter(Boolean).map(t=>`<span class="chip">${esc(t)}</span>`).join('')}</div>
          <span class="gapdot" style="background:${gap?'#d97706':'transparent'}" title="${gap} 条未实现连线"></span>
        </div>`;
      }).join('') + '</div>';
    canvas.appendChild(el);
  });

  canvas.addEventListener('click', ev => {
    const card = ev.target.closest('.card');
    if(card){ select('node', card.dataset.id); }
  });
  canvas.addEventListener('mouseover', ev => {
    const card = ev.target.closest('.card');
    if(card) hover(card.dataset.id);
  });
  canvas.addEventListener('mouseout', ev => {
    if(ev.target.closest('.card')) hover(null);
  });
})();

/* ---------- edges ---------- */
function anchorsOf(id){
  const el = document.querySelector(`.card[data-id="${CSS.escape(id)}"]`);
  if(!el) return null;
  const r = el.getBoundingClientRect();
  const c = $('canvas').getBoundingClientRect();
  return {
    left:  {x: r.left - c.left,           y: r.top - c.top + r.height/2},
    right: {x: r.right - c.left,          y: r.top - c.top + r.height/2},
    cx: r.left - c.left + r.width/2
  };
}

function drawEdges(){
  const svg = $('edges');
  const canvas = $('canvas');
  const W = canvas.scrollWidth, H = canvas.scrollHeight;
  svg.setAttribute('width', W); svg.setAttribute('height', H);
  svg.style.width = W + 'px'; svg.style.height = H + 'px';

  const defs = ['#6366f1','#2563eb','#ea580c','#0891b2','#a855f7','#0d9488','#64748b']
    .map(c => `<marker id="m${c.slice(1)}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></marker>`).join('');

  let paths = '';
  DATA.edges.forEach(e => {
    const a = anchorsOf(e.from), b = anchorsOf(e.to);
    if(!a || !b) return;
    const sameCol = Math.abs(a.cx - b.cx) < 30;
    let d, ax, ay, bx, by;
    if(sameCol){
      ax = a.left.x; ay = a.left.y; bx = b.left.x; by = b.left.y;
      const out = 34 + Math.abs(e.offset) * 0.5;
      const sideX = Math.min(ax, bx) - out;
      d = `M ${ax} ${ay} C ${sideX} ${ay}, ${sideX} ${by}, ${bx} ${by}`;
    } else if(b.left.x > a.right.x){
      ax = a.right.x; ay = a.right.y + e.offset; bx = b.left.x; by = b.left.y + e.offset;
      const dx = Math.max(46, (bx - ax) * 0.42);
      d = `M ${ax} ${ay} C ${ax+dx} ${ay}, ${bx-dx} ${by}, ${bx} ${by}`;
    } else {
      ax = a.left.x; ay = a.left.y + e.offset; bx = b.right.x; by = b.right.y + e.offset;
      const dx = Math.max(46, (ax - bx) * 0.42);
      d = `M ${ax} ${ay} C ${ax-dx} ${ay}, ${bx+dx} ${by}, ${bx} ${by}`;
    }
    const opacity = e.status === 'implemented' ? .82 : 1;
    paths += `<g class="eg" data-id="${esc(e.id)}">
      <path d="${d}" fill="none" stroke="${e.color}" stroke-width="1.7"
        stroke-dasharray="${e.dash}" opacity="${opacity}" marker-end="url(#m${e.color.slice(1)})"/>
      <path d="${d}" fill="none" stroke="transparent" stroke-width="14" style="pointer-events:stroke;cursor:pointer"/>
    </g>`;
    const mx = (ax+bx)/2, my = (ay+by)/2 + (sameCol ? (ay<by? -8 : 8) : -7);
    const dot = e.status==='implemented' ? '' :
      `<circle cx="${mx}" cy="${my-11}" r="3.2" fill="${e.status==='intended'?'#d97706':'#64748b'}" stroke="#fff" stroke-width="1.4"/>`;
    paths += `<text x="${mx}" y="${my}" text-anchor="middle" font-size="10"
      font-family="'SFMono-Regular',Consolas,monospace" fill="${e.color}"
      paint-order="stroke" stroke="#fff" stroke-width="3.2" stroke-linejoin="round"
      style="pointer-events:none">${esc(e.typeLabel)}</text>${dot}`;
  });

  svg.innerHTML = `<defs>${defs}</defs>${paths}`;
  svg.querySelectorAll('.eg').forEach(g => {
    g.addEventListener('click', ev => { ev.stopPropagation(); select('edge', g.dataset.id); });
    g.addEventListener('mouseover', () => hoverEdge(g.dataset.id, true));
    g.addEventListener('mouseout', () => hoverEdge(g.dataset.id, false));
  });
}

function hover(id){
  document.querySelectorAll('.card').forEach(c => {
    if(!id){ c.classList.remove('dim'); return; }
    const related = DATA.edges.some(e => (e.from===id && e.to===c.dataset.id) || (e.to===id && e.from===c.dataset.id));
    c.classList.toggle('dim', !related && c.dataset.id !== id);
  });
}
function hoverEdge(id, on){
  document.querySelectorAll('.eg path').forEach(p => p.style.filter = '');
  if(!on) return;
  const g = document.querySelector(`.eg[data-id="${CSS.escape(id)}"]`);
  if(g) g.querySelectorAll('path').forEach(p => p.style.filter = 'drop-shadow(0 0 3px rgba(37,99,235,.55))');
}

/* ---------- detail ---------- */
function kv(rows){ return `<div class="kv">${rows.map(([k,v]) => `<div class="k">${esc(k)}</div><div class="v">${v}</div>`).join('')}</div>`; }
function block(title, body){ return `<div class="sec-title">${esc(title)}</div>${body}`; }

function select(kind, id){
  selKind = kind; selId = id;
  document.querySelectorAll('.card').forEach(c => c.classList.toggle('sel', kind==='node' && c.dataset.id===id));
  document.querySelectorAll('.eitem').forEach(c => c.classList.toggle('sel', kind==='edge' && c.dataset.id===id));
  $('detailHint').textContent = kind === 'node' ? '节点' : '连线';
  $('detail').innerHTML = kind === 'node' ? nodeDetail(id) : edgeDetail(id);
}

function nodeDetail(id){
  const n = nodeById[id];
  if(!n) return '<div class="empty">未找到</div>';
  const outs = DATA.edges.filter(e => e.from===id), ins = DATA.edges.filter(e => e.to===id);
  let h = kv([
    ['id', `<span class="mono">${esc(n.id)}</span>`],
    ['名称', esc(n.label)],
    ['所属', n.page ? `<span class="mono">${esc(n.page)}</span>` : '—'],
    ['形态', `<span class="mono">${esc(n.kind)}</span>`],
    ['重要度', esc(n.importance)],
    ['层级', esc(n.tier)],
  ]);
  if(n.file) h += block('源文件', `<div class="quote mono">${esc(n.file)}</div>`);
  if(n.note) h += block('说明', `<div class="quote">${esc(n.note)}</div>`);
  if(n.factCount != null && n.tier === 'node')
    h += block('条目统计', `<div class="quote">事实 ${n.factCount} 条 · 规则 ${n.ruleCount} 条 · 行号引用 ${(n.sources||[]).length} 处</div>`);
  if(n.sources && n.sources.length)
    h += block('sources', `<div class="quote mono">${n.sources.map(esc).join('<br>')}</div>`);

  const list = (arr, dir) => arr.map(e => {
    const other = dir === 'out' ? e.to : e.from;
    const on = nodeById[other];
    const col = e.status==='implemented' ? '#16a34a' : (e.status==='intended' ? '#d97706' : '#64748b');
    return `<div class="eitem" data-id="${esc(e.id)}" data-kind="edge">
      <div class="e1"><span class="pill" style="background:${e.color}1a;color:${e.color}">${esc(e.typeLabel)}</span>
        <span class="pill" style="background:${col}1a;color:${col}">${esc(e.statusLabel)}</span>
        <span style="color:#94a3b8">${dir==='out'?'→':'←'}</span>
        <span style="font-weight:400">${esc(on ? on.label : other)}</span></div>
      <div class="e2">${esc(e.id)}</div></div>`;
  }).join('') || '<div class="empty">无</div>';

  if(outs.length) h += block(`出边 (${outs.length})`, list(outs, 'out'));
  if(ins.length)  h += block(`入边 (${ins.length})`, list(ins, 'in'));
  return h;
}

function edgeDetail(id){
  const e = edgeById[id];
  if(!e) return '<div class="empty">未找到</div>';
  const a = nodeById[e.from], b = nodeById[e.to];
  const col = e.status==='implemented' ? '#16a34a' : (e.status==='intended' ? '#d97706' : '#64748b');
  let h = kv([
    ['id', `<span class="mono">${esc(e.id)}</span>`],
    ['类型', `<span class="pill" style="background:${e.color}1a;color:${e.color}">${esc(e.typeLabel)}</span>`],
    ['状态', `<span class="pill" style="background:${col}1a;color:${col}">${esc(e.statusLabel)}</span>`],
    ['起点', esc(a ? a.label : e.from)],
    ['终点', esc(b ? b.label : e.to)],
    ['级别', esc(e.severity || '—')],
  ]);
  if(e.trigger) h += block('触发', `<div class="quote">${esc(e.trigger)}</div>`);
  if(e.payload) h += block('载荷', `<div class="quote mono">${esc(e.payload)}</div>`);
  if(e.logic) h += block('逻辑', `<div class="quote">${esc(e.logic)}</div>`);
  if(e.note) h += block('说明', `<div class="quote">${esc(e.note)}</div>`);
  if(e.designRef) h += block('设计要求（来自）', `<div class="quote warn">${esc(e.designRef)}</div>`);
  if(e.expected) h += block('期望行为', `<div class="quote warn">${esc(e.expected)}</div>`);
  if(e.blockedBy) h += block('卡在哪', `<div class="quote warn">${esc(e.blockedBy)}</div>`);
  if(e.issue) h += block('待确认问题', `<div class="quote warn">${esc(e.issue)}</div>`);
  if(e.evidenceChain) h += block('证据链', `<div class="quote">${esc(e.evidenceChain)}</div>`);
  if(e.sources && e.sources.length) h += block('sources', `<div class="quote mono">${e.sources.map(esc).join('<br>')}</div>`);
  return h;
}

$('detail').addEventListener('click', ev => {
  const it = ev.target.closest('.eitem');
  if(it) select('edge', it.dataset.id);
});

/* ---------- gaps ---------- */
(function renderGaps(){
  const rows = [];
  DATA.edges.filter(e => e.status !== 'implemented').forEach(e => {
    const a = nodeById[e.from], b = nodeById[e.to];
    rows.push({kind:'edge', id:e.id, sev:e.severity, color:e.status==='intended'?'#d97706':'#64748b',
      t:`${a?a.label:e.from} → ${b?b.label:e.to}`,
      w:`${e.typeLabel} · ${e.statusLabel}`, d:e.blockedBy || e.issue || ''});
  });
  DATA.issues.forEach(i => {
    const n = nodeById[i.where];
    rows.push({kind:'issue', id:i.id, sev:i.severity, color:'#94a3b8',
      t:i.title, w:`${i.where}${n?'（'+n.label+'）':''} · ${i.status||''}`, d:i.detail || ''});
  });
  rows.sort((x,y) => ({high:0,medium:1,low:2}[x.sev] ?? 9) - ({high:0,medium:1,low:2}[y.sev] ?? 9));
  $('gapCnt').textContent = rows.length + ' 项';
  $('gaps').innerHTML = rows.map(r => `<div class="iitem ${r.kind==='edge'?'eitem':''}" data-id="${esc(r.id)}" data-kind="${r.kind}">
      <div class="t" style="color:${r.color}">${esc(r.t)}</div>
      <div class="w">${esc(r.w)}</div>
      <div class="d">${esc(r.d).slice(0,240)}${r.d && r.d.length>240?'…':''}</div>
    </div>`).join('') || '<div class="empty">无缺口</div>';
  $('gaps').addEventListener('click', ev => {
    const it = ev.target.closest('[data-kind]');
    if(!it) return;
    if(it.dataset.kind === 'edge'){ select('edge', it.dataset.id); scrollToEdge(it.dataset.id); }
    else {
      const iss = DATA.issues.find(i => i.id === it.dataset.id);
      if(iss && nodeById[iss.where]) select('node', iss.where);
    }
  });
})();

function scrollToEdge(id){
  const e = edgeById[id];
  if(!e) return;
  const el = document.querySelector(`.card[data-id="${CSS.escape(e.from)}"]`);
  if(el) el.scrollIntoView({behavior:'smooth', block:'center', inline:'center'});
}

/* ---------- footer tabs ---------- */
const TABS = [
  {id:'sections', label:'一级模块'},
  {id:'pages', label:'页面清单'},
  {id:'edges', label:'边清单'},
  {id:'issues', label:'issues'},
  {id:'orphans', label:'孤儿组件'},
];
let curTab = 'edges';
function renderTabs(){
  $('tabs').innerHTML = TABS.map(t => `<div class="tab ${t.id===curTab?'on':''}" data-id="${t.id}">${esc(t.label)}</div>`).join('');
  $('tabBody').innerHTML = renderTabBody(curTab);
}
function renderTabBody(id){
  const st = 'width:100%;border-collapse:collapse;background:#fff;border:1px solid #e3e8ef;border-radius:12px;overflow:hidden;font-size:12px';
  if(id === 'sections'){
    let h = `<table style="${st}"><tr><th style="padding:9px 12px;background:#f8fafc;text-align:left">模块</th><th style="padding:9px 12px;background:#f8fafc;text-align:left">用户视角的意义</th><th style="padding:9px 12px;background:#f8fafc;text-align:left">包含页面</th></tr>`;
    DATA.sections.forEach(s => {
      h += `<tr><td style="padding:9px 12px;border-top:1px solid #eef2f7"><b>${esc(s.title)}</b><br><span class="mono" style="color:#94a3b8">${esc(s.id)}</span></td>
        <td style="padding:9px 12px;border-top:1px solid #eef2f7;color:#475569">${esc(s.userView)}</td>
        <td style="padding:9px 12px;border-top:1px solid #eef2f7">${s.pages.map(p => {const pg=DATA.pages.find(x=>x.id===p); return `<span class="chip" style="font-size:10px;background:#f8fafc;border:1px solid #e3e8ef;border-radius:5px;padding:1px 5px;display:inline-block;margin:1px 3px 1px 0">${esc(pg?pg.title:p)}</span>`;}).join('')}</td></tr>`;
    });
    return h + '</table>';
  }
  if(id === 'pages'){
    let h = `<table style="${st}"><tr><th style="padding:9px 12px;background:#f8fafc;text-align:left">页面</th><th style="padding:9px 12px;background:#f8fafc;text-align:left">组件</th><th style="padding:9px 12px;background:#f8fafc;text-align:left">状态</th><th style="padding:9px 12px;background:#f8fafc;text-align:left">节点</th><th style="padding:9px 12px;background:#f8fafc;text-align:left">说明</th></tr>`;
    DATA.pages.forEach(p => {
      const done = p.docStatus === 'drilled';
      h += `<tr><td style="padding:9px 12px;border-top:1px solid #eef2f7"><b>${esc(p.title)}</b><br><span class="mono" style="color:#94a3b8">${esc(p.id)}</span></td>
        <td style="padding:9px 12px;border-top:1px solid #eef2f7" class="mono">${esc(p.component)}</td>
        <td style="padding:9px 12px;border-top:1px solid #eef2f7"><span class="pill" style="font-size:10px;padding:1px 6px;border-radius:5px;background:${done?'#16a34a1a':'#f1f5f9'};color:${done?'#16a34a':'#94a3b8'}">${done?'已下钻':'待铺开'}</span></td>
        <td style="padding:9px 12px;border-top:1px solid #eef2f7">${p.nodeCount||0}</td>
        <td style="padding:9px 12px;border-top:1px solid #eef2f7;color:#475569">${esc(p.description)}</td></tr>`;
    });
    return h + '</table>';
  }
  if(id === 'edges'){
    let h = `<table style="${st}"><tr><th style="padding:9px 12px;background:#f8fafc;text-align:left">起点</th><th style="padding:9px 12px;background:#f8fafc;text-align:left">终点</th><th style="padding:9px 12px;background:#f8fafc;text-align:left">类型</th><th style="padding:9px 12px;background:#f8fafc;text-align:left">状态</th><th style="padding:9px 12px;background:#f8fafc;text-align:left">触发 / 卡点</th></tr>`;
    DATA.edges.forEach(e => {
      const a = nodeById[e.from], b = nodeById[e.to];
      const col = e.status==='implemented' ? '#16a34a' : (e.status==='intended' ? '#d97706' : '#64748b');
      h += `<tr class="clickable" data-id="${esc(e.id)}" style="cursor:pointer">
        <td style="padding:9px 12px;border-top:1px solid #eef2f7">${esc(a?a.label:e.from)}</td>
        <td style="padding:9px 12px;border-top:1px solid #eef2f7">${esc(b?b.label:e.to)}</td>
        <td style="padding:9px 12px;border-top:1px solid #eef2f7"><span class="pill" style="font-size:10px;padding:1px 6px;border-radius:5px;background:${e.color}1a;color:${e.color}">${esc(e.typeLabel)}</span></td>
        <td style="padding:9px 12px;border-top:1px solid #eef2f7"><span class="pill" style="font-size:10px;padding:1px 6px;border-radius:5px;background:${col}1a;color:${col}">${esc(e.statusLabel)}</span></td>
        <td style="padding:9px 12px;border-top:1px solid #eef2f7;color:#475569">${esc(e.trigger||'')}${e.blockedBy?'<br><span style="color:#d97706">卡点：'+esc(e.blockedBy).slice(0,120)+'…</span>':''}</td></tr>`;
    });
    return h + '</table>';
  }
  if(id === 'issues'){
    let h = `<table style="${st}"><tr><th style="padding:9px 12px;background:#f8fafc;text-align:left">位置</th><th style="padding:9px 12px;background:#f8fafc;text-align:left">问题</th><th style="padding:9px 12px;background:#f8fafc;text-align:left">级别</th><th style="padding:9px 12px;background:#f8fafc;text-align:left">详情</th></tr>`;
    DATA.issues.forEach(i => {
      const n = nodeById[i.where];
      h += `<tr><td style="padding:9px 12px;border-top:1px solid #eef2f7">${esc(n?n.label:i.where)}</td>
        <td style="padding:9px 12px;border-top:1px solid #eef2f7"><b>${esc(i.title)}</b></td>
        <td style="padding:9px 12px;border-top:1px solid #eef2f7">${esc(i.severity||'')}</td>
        <td style="padding:9px 12px;border-top:1px solid #eef2f7;color:#475569">${esc(i.detail)}</td></tr>`;
    });
    return h + '</table>';
  }
  if(id === 'orphans'){
    let h = `<table style="${st}"><tr><th style="padding:9px 12px;background:#f8fafc;text-align:left">组件</th><th style="padding:9px 12px;background:#f8fafc;text-align:left">行数</th><th style="padding:9px 12px;background:#f8fafc;text-align:left">说明</th></tr>`;
    DATA.orphans.forEach(o => {
      h += `<tr><td style="padding:9px 12px;border-top:1px solid #eef2f7" class="mono">${esc(o.component)}</td>
        <td style="padding:9px 12px;border-top:1px solid #eef2f7">${o.lines||''}</td>
        <td style="padding:9px 12px;border-top:1px solid #eef2f7;color:#475569">${esc(o.note)}</td></tr>`;
    });
    return h + '</table>';
  }
  return '';
}
renderTabs();
$('tabs').addEventListener('click', ev => {
  const t = ev.target.closest('.tab');
  if(t){ curTab = t.dataset.id; renderTabs(); }
});
$('tabBody').addEventListener('click', ev => {
  const tr = ev.target.closest('tr.clickable');
  if(tr){ select('edge', tr.dataset.id); scrollToEdge(tr.dataset.id); }
});

/* ---------- boot ---------- */
window.addEventListener('load', () => { drawEdges(); });
window.addEventListener('resize', () => { requestAnimationFrame(drawEdges); });
if(document.fonts && document.fonts.ready) document.fonts.ready.then(() => drawEdges());
setTimeout(drawEdges, 60);
</script>
</body>
</html>
"""


def main() -> int:
    data = build_data()
    payload = json.dumps(data, ensure_ascii=False, indent=1)
    html = HTML_TEMPLATE.replace("__DATA__", payload)
    with open(OUT_FILE, "w", encoding="utf-8") as fh:
        fh.write(html)
    os.makedirs(SITE_DIR, exist_ok=True)
    with open(SITE_INDEX, "w", encoding="utf-8") as fh:
        fh.write(html)
    s = data["stats"]
    print(f"生成成功：{OUT_FILE}")
    print(f"发布副本：{SITE_INDEX}（site/ 为纯静态发布单元，只含本页）")
    print(f"  一级模块 {s['sections']} · 页面 {s['pages']}（已下钻 {s['drilled']}）· 节点 {s['nodes']}")
    print(f"  边 {s['edges']}（已实现 {s['implemented']} / 未实现 {s['intended']} / 待确认 {s['undefined']}）· issues {s['issues']}")
    print(f"  图节点 {len(data['graph']['nodes'])} 个，分 {len(data['graph']['columns'])} 列")
    print(f"  文件大小 {os.path.getsize(OUT_FILE)/1024:.1f} KB")
    return 0


if __name__ == "__main__":
    sys.exit(main())
