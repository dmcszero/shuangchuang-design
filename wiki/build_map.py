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
    shell_by_id = {s["id"]: s for s in structure.get("shellComponents", [])}

    graph_nodes: dict[str, dict[str, Any]] = {}

    def reg(nid: str) -> None:
        """登记一个图节点。

        v0.9 起**全集登记**：页面 / 节点 / 弹层 / 壳层 全部进图（不再只登记边端点）。
        原因：只画边端点会让「无任何连线的模块」在图上消失（旧版 95 个节点有 23 个不可见），
        并使 issues[].where 指向画布上不存在的卡片（旧版 40 条 issue 有 15 条点了没反应）。
        """
        if not nid or nid in graph_nodes:
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
                "personas": p.get("personas", []),
            }
        elif nid in modal_by_id:
            m = modal_by_id[nid]
            graph_nodes[nid] = {
                "id": nid, "label": m["title"], "sub": nid,
                "kind": "modal", "importance": "medium",
                "tier": "modal", "page": "",
                "factCount": None, "ruleCount": None,
                "file": m.get("component", ""), "sources": [],
                "note": m.get("note", ""),
            }
        elif nid in shell_by_id:
            s = shell_by_id[nid]
            graph_nodes[nid] = {
                "id": nid, "label": s.get("title", nid), "sub": nid,
                "kind": "shell", "importance": "medium",
                "tier": "shell", "page": "",
                "factCount": None, "ruleCount": None,
                "file": s.get("component", ""), "sources": [],
                "note": s.get("note", ""),
            }
        else:
            graph_nodes[nid] = {
                "id": nid, "label": nid, "sub": nid, "kind": "unknown",
                "importance": "low", "tier": "unknown", "page": "",
                "factCount": None, "ruleCount": None, "file": "", "sources": [],
            }

    for pid in page_by_id:
        reg(pid)
    for mid in modal_by_id:
        reg(mid)
    for sid in shell_by_id:
        reg(sid)
    for n in nodes:
        reg(n["id"])
    for e in edge_doc.get("edges", []):          # 兜底：边端点里未登记的 id
        reg(e.get("from", ""))
        reg(e.get("to", ""))

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

    linked_ids: set[str] = set()
    for e in edge_doc.get("edges", []):
        linked_ids.add(e.get("from", ""))
        linked_ids.add(e.get("to", ""))

    for nid, g in graph_nodes.items():
        g["col"] = column_of(nid)
        g["orphan"] = nid not in linked_ids       # v0.9：无任何连线的模块（灰显展示）
        g["gapCount"] = 0                         # 与之相关的未实现边 + 挂在其上的 issues
        g["issueCount"] = 0

    # 列内排序：节点按 kind 归组，保证语义相邻
    kind_rank = {"nav": 0, "bar": 1, "tab": 2, "list": 3, "panel": 4, "table": 5,
                 "form": 6, "drawer": 7, "modal": 8, "shell": 9, "page": 10, "unknown": 11}
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
        if e.get("status") != "implemented":
            for end in (e.get("from", ""), e.get("to", "")):
                if end in graph_nodes:
                    graph_nodes[end]["gapCount"] += 1

    for it in edge_doc.get("issues", []):
        w = it.get("where", "")
        if w in graph_nodes:
            graph_nodes[w]["issueCount"] += 1
            graph_nodes[w]["gapCount"] += 1

    # ---- 总览层（页面级视图，v0.9 新增）----
    # 目的：一张图同时承担「看全」和「看细」会两头落空（节点级全景 16 列 / 7000px 宽）。
    # 总览层把节点级关系折叠成「页面 ↔ 页面」的聚合关系（含条数与缺口数），一屏可看完。
    def owning_page(eid: str) -> str:
        g = graph_nodes.get(eid)
        if not g:
            return ""
        if g["tier"] in ("page", "modal", "shell"):
            return eid
        if g["tier"] == "node":
            return g["page"]
        return ""                       # unknown：不参与页面级关系

    agg: dict[tuple[str, str], dict[str, Any]] = {}
    intra_count: dict[str, int] = {}
    for e in edge_doc.get("edges", []):
        pf, pt = owning_page(e.get("from", "")), owning_page(e.get("to", ""))
        if not pf or not pt:
            continue
        if pf == pt:
            intra_count[pf] = intra_count.get(pf, 0) + 1
            continue
        d = agg.setdefault((pf, pt), {"id": "ov-%s--%s" % (pf, pt), "from": pf, "to": pt,
                                      "count": 0, "gap": 0, "edgeIds": []})
        d["count"] += 1
        d["edgeIds"].append(e.get("id", ""))
        if e.get("status") != "implemented":
            d["gap"] += 1
    ov_edges = sorted(agg.values(), key=lambda d: (d["from"], d["to"]))

    ov_nodes: list[dict[str, Any]] = []
    for pid in page_order:
        p = page_by_id.get(pid)
        if not p:
            continue
        my_nodes = [n["id"] for n in nodes if n.get("page") == pid]
        ov_nodes.append({
            "id": pid, "label": p["title"], "sub": pid, "tier": "page", "kind": "page",
            "section": p.get("section", ""), "personas": p.get("personas", []),
            "importance": p.get("importance", "medium"),
            "nodeCount": len(my_nodes),
            "orphanNodes": len([x for x in my_nodes if graph_nodes.get(x, {}).get("orphan")]),
            "drilled": p.get("docStatus") == "drilled",
            "edgeCount": 0, "gapCount": 0, "issueCount": 0,
            "intraCount": intra_count.get(pid, 0),
            "description": p.get("description", ""), "file": p.get("component", ""),
        })
    ov_page_count = len(ov_nodes)
    for eid in list(modal_by_id) + list(shell_by_id):
        g = graph_nodes.get(eid)
        if not g:
            continue
        ov_nodes.append({
            "id": eid, "label": g["label"], "sub": eid, "tier": g["tier"], "kind": g["kind"],
            "section": "", "personas": [], "importance": g.get("importance", "medium"),
            "nodeCount": None, "orphanNodes": 0, "drilled": True,
            "edgeCount": 0, "gapCount": 0, "issueCount": 0,
            "intraCount": intra_count.get(eid, 0),
            "description": g.get("note", ""), "file": g.get("file", ""),
        })
    ov_by_id = {n["id"]: n for n in ov_nodes}
    for d in ov_edges:
        for end in (d["from"], d["to"]):
            if end in ov_by_id:
                ov_by_id[end]["edgeCount"] += 1
    for it in edge_doc.get("issues", []):
        pid = owning_page(it.get("where", ""))
        if pid in ov_by_id:
            ov_by_id[pid]["issueCount"] += 1
    for d in ov_edges:
        for end in (d["from"], d["to"]):
            if d["gap"] and end in ov_by_id:
                ov_by_id[end]["gapCount"] += d["gap"]

    ov_columns: list[dict[str, Any]] = []
    for s in structure.get("sections", []):
        ids = [p for p in s.get("pages", []) if p in ov_by_id]
        if not ids:
            continue
        ov_columns.append({"id": "ovcol-" + s.get("id", "x"), "title": s.get("title", ""),
                           "subtitle": s.get("userView", "")[:34], "nodeIds": ids})
    _placed = {i for c in ov_columns for i in c["nodeIds"]}
    _rest = [n["id"] for n in ov_nodes if n["id"] not in _placed]
    if _rest:
        ov_columns.append({"id": "ovcol-external", "title": "外部模块",
                           "subtitle": "壳层与弹层（不属于任何页面）", "nodeIds": _rest})

    # ---- 术语表（glossary.json，只用于「原始版」详情的术语对照，不修改任何原文）----
    glossary_path = os.path.join(WIKI_DIR, "glossary.json")
    glossary: list[dict[str, Any]] = []
    if os.path.exists(glossary_path):
        with open(glossary_path, encoding="utf-8") as fh:
            glossary = json.load(fh).get("terms", [])

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
            "graphNodes": len(graph_nodes),
            "disconnected": len([g for g in graph_nodes.values() if g.get("orphan")]),
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
            "disconnected": len([g for g in graph_nodes.values() if g.get("orphan")]),
        },
        "edges": edges,
        "overview": {"columns": ov_columns, "nodes": ov_nodes, "edges": ov_edges},
        "glossary": glossary,
        "personaMeta": {p["id"]: p.get("title", p["id"]) for p in structure.get("personas", [])},
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

  /* ---------- v0.9：视图切换 / 过滤 / 折叠 / 聚焦 / 术语 ---------- */
  .toolbar{display:flex;align-items:center;gap:16px;flex-wrap:wrap;padding:9px 24px;
    background:var(--panel);border-bottom:1px solid var(--line)}
  .tb{display:flex;align-items:center;gap:5px}
  .tb-lb{font-size:11px;color:var(--ink-3);margin-right:1px}
  .btn{font-size:11.5px;padding:3px 10px;border:1px solid var(--line);border-radius:7px;
    background:#fff;color:var(--ink-2);cursor:pointer;line-height:1.7;white-space:nowrap}
  .btn:hover{border-color:#bfd4f5;background:#fafcff}
  .btn.on{background:var(--accent);border-color:var(--accent);color:#fff;font-weight:600}
  .btn.ghost{border-style:dashed}
  .seg{display:flex}
  .seg .btn{border-radius:0;margin-left:-1px}
  .seg .btn:first-child{border-radius:7px 0 0 7px;margin-left:0}
  .seg .btn:last-child{border-radius:0 7px 7px 0}
  .tb-hint{font-size:11px;color:var(--ink-3);margin-left:auto}

  .col-hd.clickable{cursor:pointer;user-select:none}
  .col-hd.clickable:hover .t{color:var(--accent)}
  .col-hd .foldmark{font-size:10px;color:var(--ink-3);margin-right:4px}
  .col.folded{width:40px;flex:0 0 40px;margin-right:-140px}
  .col.folded .col-body{display:none}
  .col.folded .col-hd{border-bottom-color:var(--accent);padding-bottom:6px}
  .col.folded .col-hd .t{writing-mode:vertical-rl;font-size:12px;letter-spacing:1px;margin-top:4px}
  .col.folded .col-hd .s{display:none}
  .col.folded .col-hd .cnt{display:none}

  .card.orphan{border-style:dashed;background:#fbfcfd}
  .card.orphan .nm{color:var(--ink-2);font-weight:500}
  .card .origdot{display:inline-block;width:6px;height:6px;border-radius:50%;
    background:#cbd5e1;margin-right:5px;vertical-align:middle}
  .card .pers{font-size:9.5px;color:var(--ink-3);background:#f1f5f9;border-radius:4px;padding:0 4px}
  .card .kpi{font-size:10px;color:var(--ink-3)}
  .card .kpi b{color:var(--warn)}

  .focus{margin:0 24px 22px;background:var(--panel);border:1px solid var(--line);
    border-radius:var(--radius);overflow:hidden}
  .focus-hd{padding:10px 14px;border-bottom:1px solid var(--line);display:flex;
    align-items:center;gap:10px;flex-wrap:wrap}
  .focus-hd .ft{font-weight:600;font-size:13px}
  .focus-hd .fk{font-size:11px;color:var(--ink-3)}
  .focus-hd .acts{margin-left:auto;display:flex;gap:6px}
  .focus-bd{padding:14px;display:grid;grid-template-columns:1fr minmax(240px,300px) 1fr;gap:14px}
  .fcol-h{font-size:11px;font-weight:600;color:var(--ink-3);letter-spacing:.5px;margin-bottom:8px}
  .fcard{border:1px solid var(--line);border-radius:9px;padding:8px 10px;margin-bottom:8px;
    cursor:pointer;background:#fff}
  .fcard:hover{border-color:#bfd4f5;background:#fafcff}
  .fcard .n{font-size:12px;font-weight:600}
  .fcard .m{font-size:10.5px;color:var(--ink-3);margin-top:3px;
    font-family:'SFMono-Regular',Consolas,monospace}
  .fcard .t2{font-size:11px;color:var(--ink-2);margin-top:4px}
  .fmid{background:#f8fafc;border:1px solid var(--line);border-radius:10px;padding:12px}
  .fmid .nm{font-size:14px;font-weight:600}
  .fmid .sub{font-size:11px;color:var(--ink-3);margin-top:3px;
    font-family:'SFMono-Regular',Consolas,monospace;word-break:break-all}
  .chipset{display:flex;flex-wrap:wrap;gap:5px;margin-top:8px}
  .chip.c2{background:#fff;cursor:pointer}
  .chip.c2:hover{border-color:#bfd4f5;color:var(--accent)}
  .chip.c2.orph{border-style:dashed;color:var(--ink-3)}
  .flegend{font-size:11px;color:var(--ink-3);margin-top:10px;padding-top:8px;
    border-top:1px dashed var(--line)}

  .iitem.clickable{cursor:pointer;border-radius:8px}
  .iitem.clickable:hover{background:#fafcff}
  .iitem .loc{font-size:10px;color:var(--accent);margin-top:3px;display:none}
  .iitem.clickable:hover .loc{display:block}
  .iitem.noanchor .loc{display:block;color:var(--ink-3)}

  .tabs2{display:flex;gap:5px;margin-bottom:10px}
  .tabs2 .btn{font-size:11px}
  .plain-box{background:#f4fbf6;border:1px solid #d7ecdf;border-radius:9px;padding:10px 12px}
  .plain-box .pf{font-size:11px;font-weight:600;color:var(--ok);letter-spacing:.5px;margin-bottom:5px}
  .plain-box .pv{font-size:12px;color:var(--ink);margin-bottom:8px}
  .plain-box .pv:last-child{margin-bottom:0}
  .plain-box .pv b{color:var(--ink-2);font-weight:600}
  .fallback{font-size:11px;color:var(--ink-3);margin-bottom:8px}
  .termtab{width:100%;border-collapse:collapse;font-size:11px}
  .termtab td{padding:3px 6px;border-bottom:1px solid var(--line-soft);vertical-align:top}
  .termtab td:first-child{font-family:'SFMono-Regular',Consolas,monospace;color:#7c3aed;
    white-space:nowrap}
  .termtab tr:last-child td{border-bottom:0}
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

<div class="toolbar" id="toolbar"></div>

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

<div class="focus" id="focus" style="display:none">
  <div class="focus-hd" id="focusHd"></div>
  <div class="focus-bd" id="focusBody"></div>
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
const ovById = {};
DATA.overview.nodes.forEach(n => ovById[n.id] = n);
const ovEdgeById = {};
DATA.overview.edges.forEach(e => ovEdgeById[e.id] = e);
const pagePersonas = {};
DATA.pages.forEach(p => pagePersonas[p.id] = p.personas || []);
const TERMS = (DATA.glossary || []).slice().sort((a, b) => b.term.length - a.term.length);
const ISSUES = DATA.issues || [];
const issueById = {};
ISSUES.forEach(i => issueById[i.id] = i);

/* 视图状态（v0.9）：overview = 页面级总览（默认，一屏看完）；full = 节点级全景（原 16 列视图） */
const ST = {
  view: 'overview',
  persona: 'all',
  edgeMode: 'all',
  collapsed: {},
  selKind: null, selId: null,
  focusId: null,
  plainMode: 'plain'
};

/* ---------- header ---------- */
(function renderHeader(){
  const m = DATA.meta, s = DATA.stats;
  $('hdrSub').innerHTML = esc(m.baseline) + ' · schema ' + esc(m.schemaVersion) + ' · 生成于 ' + esc(m.generatedAt);
  const items = [
    ['一级模块', s.sections, ''],
    ['页面/视图', s.pages, ''],
    ['已下钻', s.drilled, ''],
    ['节点', s.nodes, ''],
    ['图上模块', s.graphNodes, ''],
    ['未连线', s.disconnected, s.disconnected ? 'hot' : ''],
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

/* ---------- toolbar（视图 / 端 / 连线 / 折叠）---------- */
function renderToolbar(){
  const seg = (id, cur, items) => `<div class="seg" data-seg="${id}">` + items.map(([v, lab]) =>
    `<div class="btn ${cur===v?'on':''}" data-v="${esc(v)}">${esc(lab)}</div>`).join('') + '</div>';
  const personas = [['all','全部']].concat(Object.entries(DATA.personaMeta).map(([k,v]) => [k, v]));
  $('toolbar').innerHTML =
    `<div class="tb"><span class="tb-lb">视图</span>` +
      seg('view', ST.view, [['overview','① 总览（页面级）'],['full','② 全景（节点级）']]) + `</div>` +
    `<div class="tb"><span class="tb-lb">端</span>` + seg('persona', ST.persona, personas) + `</div>` +
    `<div class="tb"><span class="tb-lb">连线</span>` +
      seg('edge', ST.edgeMode, [['all','全部'],['gap','只看缺口'],['cross','只看跨列']]) + `</div>` +
    `<div class="tb"><div class="btn ghost" id="foldAll">折叠全部列</div><div class="btn ghost" id="unfoldAll">展开全部列</div></div>` +
    `<div class="tb-hint" id="tbHint"></div>`;
  $('toolbar').querySelectorAll('[data-seg]').forEach(el => {
    el.addEventListener('click', ev => {
      const b = ev.target.closest('[data-v]');
      if(!b) return;
      const which = el.dataset.seg;
      if(which === 'view') ST.view = b.dataset.v;
      if(which === 'persona') ST.persona = b.dataset.v;
      if(which === 'edge') ST.edgeMode = b.dataset.v;
      renderToolbar(); renderCanvas();
    });
  });
  $('foldAll').addEventListener('click', () => {
    currentCols().forEach(c => ST.collapsed[c.id] = true);
    renderCanvas();
  });
  $('unfoldAll').addEventListener('click', () => { ST.collapsed = {}; renderCanvas(); });
}

/* ---------- 可见性（端过滤 / 连线过滤）---------- */
function currentCols(){
  return ST.view === 'overview' ? DATA.overview.columns : DATA.graph.columns;
}
function colPageId(colId){
  return colId.indexOf('col-page-') === 0 ? colId.slice(4) : '';
}
function colVisible(col){
  if(ST.persona === 'all') return true;
  if(ST.view === 'overview'){
    const ids = col.nodeIds || [];
    return ids.some(id => ((ovById[id]||{}).personas || []).includes(ST.persona));
  }
  const pid = colPageId(col.id);
  if(!pid) return true;                        // 外部模块列不按端过滤
  return (pagePersonas[pid] || []).includes(ST.persona);
}
function colVisibleMap(){
  const m = {};
  currentCols().forEach(c => { if(colVisible(c)) m[c.id] = true; });
  return m;
}
function ovColOf(id){
  for(const c of DATA.overview.columns){ if((c.nodeIds||[]).indexOf(id) >= 0) return c.id; }
  return '';
}
/* 端点所在列被折叠时不画线（否则会画到隐形卡片的位置） */
function colFoldedOf(id){
  if(ST.view === 'overview') return !!ST.collapsed[ovColOf(id)];
  const n = nodeById[id];
  return !!(n && ST.collapsed[n.col]);
}
function edgeVisible(e, vis){
  if(ST.edgeMode === 'gap' && e.status === 'implemented' && !e.count) return false;
  if(ST.view === 'overview'){
    if(ST.edgeMode === 'gap' && !e.gap) return false;
    return !!(vis[ovColOf(e.from)] && vis[ovColOf(e.to)]);
  }
  const a = nodeById[e.from], b = nodeById[e.to];
  if(ST.edgeMode === 'cross' && a && b && a.col === b.col) return false;
  if(a && b && !(vis[a.col] && vis[b.col])) return false;
  return true;
}

/* ---------- canvas ---------- */
function gapEdgesOf(nid){
  return DATA.edges.filter(e => (e.from===nid || e.to===nid) && e.status!=='implemented');
}
function cardMetaHtml(n){
  const meta = [];
  if(n.tier==='node'){
    if(n.factCount) meta.push(`事实 ${n.factCount}`);
    if(n.ruleCount) meta.push(`规则 ${n.ruleCount}`);
    if(n.sources && n.sources.length) meta.push(`引用 ${n.sources.length}`);
  } else {
    meta.push(n.tier === 'page' ? '页面级' : (n.tier === 'modal' ? '弹层' : (n.tier === 'shell' ? '壳层' : '')));
  }
  return meta.filter(Boolean).map(t=>`<span class="chip">${esc(t)}</span>`).join('');
}

let VIEW = { edges: [] };

function renderCanvas(){
  const canvas = $('canvas');
  canvas.innerHTML = '<svg class="edges" id="edges"></svg>';
  VIEW = { edges: [] };
  const vis = {};
  currentCols().forEach(c => { if(colVisible(c)) vis[c.id] = true; });
  const cols = currentCols().filter(c => vis[c.id]);

  cols.forEach(col => {
    const folded = !!ST.collapsed[col.id];
    const ids = ST.view === 'overview' ? (col.nodeIds || []) : (DATA.graph.byCol[col.id] || []);
    const el = document.createElement('div');
    el.className = 'col' + (folded ? ' folded' : '');
    el.dataset.col = col.id;
    el.innerHTML = `<div class="col-hd clickable" title="点击折叠 / 展开该列">`
      + `<div class="t"><span class="foldmark">${folded?'▸':'▾'}</span>${esc(col.title)}</div>`
      + `<div class="s">${esc(col.subtitle||'')}</div></div>`
      + '<div class="col-body">' + ids.map(id => {
          const n = ST.view === 'overview' ? ovById[id] : nodeById[id];
          if(!n) return '';
          const imp = DATA.importanceColor[n.importance] || '#cbd5e1';
          const gap = (n.gapCount||0) + (n.issueCount||0);
          if(ST.view === 'overview'){
            const pers = (n.personas||[]).map(p => `<span class="pers">${esc(DATA.personaMeta[p]||p)}</span>`).join(' ');
            return `<div class="card${gap?' hasgap':''}${n.tier!=='page'?' orphan':''}" data-id="${esc(id)}" data-kind="node">
              <span class="bar" style="background:${imp}"></span>
              <div class="r1"><span class="nm">${esc(n.label)}</span><span class="kd">${n.tier==='page' ? (n.nodeCount + ' 模块') : esc(n.tier)}</span></div>
              <div class="r2">${esc(n.sub)}</div>
              <div class="r3">${pers}<span class="kpi">连线 ${n.edgeCount||0}${n.intraCount?(' · 页内 '+n.intraCount):''}${gap?(' · <b>缺口 '+gap+'</b>'):''}${n.orphanNodes?(' · 未连线 '+n.orphanNodes):''}</span></div>
              <span class="gapdot" style="background:${gap?'#d97706':'transparent'}" title="${gap} 项缺口"></span>
            </div>`;
          }
          return `<div class="card${gap?' hasgap':''}${n.orphan?' orphan':''}" data-id="${esc(id)}" data-kind="node">
            <span class="bar" style="background:${imp}"></span>
            <div class="r1"><span class="nm">${n.orphan?'<span class="origdot" title="未参与任何连线"></span>':''}${esc(n.label)}</span><span class="kd">${esc(n.kind)}</span></div>
            <div class="r2">${esc(n.sub)}</div>
            <div class="r3">${cardMetaHtml(n)}${gap?`<span class="chip kpi"><b>缺口 ${gap}</b></span>`:''}</div>
            <span class="gapdot" style="background:${gap?'#d97706':'transparent'}" title="${gap} 项缺口"></span>
          </div>`;
        }).join('') + '</div>';
    el.querySelector('.col-hd').addEventListener('click', () => {
      ST.collapsed[col.id] = !ST.collapsed[col.id];
      renderCanvas();
    });
    canvas.appendChild(el);
  });

  if(ST.view === 'overview'){
    VIEW.edges = DATA.overview.edges.filter(e => edgeVisible(e, vis) && !colFoldedOf(e.from) && !colFoldedOf(e.to)).map(e => ({
      id: e.id, from: e.from, to: e.to, offset: 0, gap: e.gap, count: e.count, edgeIds: e.edgeIds,
      color: e.gap ? '#d97706' : '#2563eb',
      dash: e.gap ? '7 5' : '0',
      opacity: e.gap ? 1 : .8,
      /* 复用节点级连线的渲染分支：status 空/实决定点，typeLabel 显示聚合条数 */
      status: e.gap ? 'intended' : 'implemented',
      typeLabel: e.count > 1 ? ('×' + e.count) : ''
    }));
  } else {
    VIEW.edges = DATA.edges.filter(e => edgeVisible(e, vis) && !colFoldedOf(e.from) && !colFoldedOf(e.to)).map(e => Object.assign({}, e));
  }

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

  drawEdges();
  const hint = $('tbHint');
  if(hint){
    const tot = ST.view === 'overview' ? DATA.overview.edges.length : DATA.edges.length;
    hint.textContent = `显示 ${cols.length} 列 · 连线 ${VIEW.edges.length}/${tot}` +
      (ST.view === 'overview'
        ? '｜总览：节点级关系已折叠为页面↔页面（点卡片看下方聚焦视图）'
        : '｜全景：点卡片在下方聚焦视图里看它的全部出入关系');
  }
}

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

  const defs = ['#6366f1','#2563eb','#ea580c','#0891b2','#a855f7','#0d9488','#64748b','#d97706']
    .map(c => `<marker id="m${c.slice(1)}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></marker>`).join('');

  let paths = '';
  VIEW.edges.forEach(e => {
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
    const opacity = (e.opacity !== undefined) ? e.opacity : (e.status === 'implemented' ? .82 : 1);
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
    g.addEventListener('click', ev => {
      ev.stopPropagation();
      if(ST.view === 'overview') selectOvEdge(g.dataset.id);
      else select('edge', g.dataset.id);
    });
    g.addEventListener('mouseover', () => hoverEdge(g.dataset.id, true));
    g.addEventListener('mouseout', () => hoverEdge(g.dataset.id, false));
  });
}

function hover(id){
  document.querySelectorAll('.card').forEach(c => {
    if(!id){ c.classList.remove('dim'); return; }
    const related = VIEW.edges.some(e => (e.from===id && e.to===c.dataset.id) || (e.to===id && e.from===c.dataset.id));
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
  ST.selKind = kind; ST.selId = id;
  document.querySelectorAll('.card').forEach(c => c.classList.toggle('sel', kind==='node' && c.dataset.id===id));
  document.querySelectorAll('.eitem').forEach(c => c.classList.toggle('sel', kind==='edge' && c.dataset.id===id));
  $('detailHint').textContent = kind === 'node' ? '模块' : (kind === 'issue' ? '问题' : '连线');
  $('detail').innerHTML = kind === 'node'
    ? nodeDetail(id)
    : (kind === 'issue' ? issueDetail(id) : edgeDetail(id));
  if(kind === 'node') focusOn(id);
}

/* 聚焦视图：把「选中项 + 它的全部出入关系」单独铺成一个新视图（v0.9）。
   目的：原来的悬停高亮鼠标一移开就没了，看不到「它到底连了谁、怎么连」。 */
function focusOn(id){
  ST.focusId = id;
  renderFocus();
}
function renderFocus(){
  const box = $('focus');
  const id = ST.focusId;
  const useOv = !!(id && ST.view === 'overview' && ovById[id]);
  const n = id ? (useOv ? ovById[id] : (nodeById[id] || ovById[id])) : null;
  if(!n){ box.style.display = 'none'; return; }
  box.style.display = '';
  const isPage = n.tier === 'page';
  const pool = useOv ? DATA.overview.edges : DATA.edges;
  const ins = pool.filter(e => e.to === id);
  const outs = pool.filter(e => e.from === id);
  const myPage = isPage ? id : (n.page || '');
  const siblings = DATA.graph.nodes.filter(x => x.page === myPage && x.id !== id);

  const edgeCard = (e, dir) => {
    const otherId = dir === 'out' ? e.to : e.from;
    const other = nodeById[otherId] || ovById[otherId] || { label: otherId };
    const gap = isPage ? e.gap : (e.status !== 'implemented');
    const col = isPage ? (e.gap ? '#d97706' : '#2563eb') : e.color;
    const lbl = isPage
      ? (e.count > 1 ? (e.count + ' 条连线') : '1 条连线')
      : (e.typeLabel + ' · ' + e.statusLabel);
    return `<div class="fcard" data-focus="${esc(otherId)}">
      <div class="n">${dir==='out'?'→ ':'← '}${esc(other.label)}</div>
      <div class="m" style="color:${col}">${esc(lbl)}</div>
      ${(!isPage && e.trigger) ? `<div class="t2">${esc(e.trigger).slice(0,120)}</div>` : ''}
      ${(!isPage && e.note) ? `<div class="t2">${esc(e.note).slice(0,120)}</div>` : ''}
      ${(isPage && e.gap) ? `<div class="t2" style="color:#d97706">其中 ${e.gap} 条未实现 / 待确认</div>` : ''}
    </div>`;
  };

  const chip = (x) => `<span class="chip c2${x.orphan?' orph':''}" data-focus="${esc(x.id)}" title="${x.orphan?'未参与任何连线':''}">${esc(x.label)}</span>`;

  let mid = `<div class="nm">${esc(n.label)}</div><div class="sub">${esc(n.sub)}</div>`;
  if(isPage){
    mid += `<div class="flegend">本页共 ${n.nodeCount || 0} 个模块${n.orphanNodes?`（其中 ${n.orphanNodes} 个未参与任何连线）`:''}<br>`
      + `连线：跨页 ${n.edgeCount || 0} 条${n.intraCount?` · 页内 ${n.intraCount} 条`:''}${(n.gapCount+n.issueCount)?` · <span style="color:#d97706">缺口 ${n.gapCount+n.issueCount} 项</span>`:''}</div>`;
  } else {
    mid += `<div class="flegend">${esc(n.tier)} · 重要度 ${esc(n.importance||'')} · 所属页面 ${esc(pageTitle[n.page] || n.page || '—')}</div>`;
  }
  mid += `<div class="flegend">${myPage ? '同类模块（点选继续聚焦）' : '同层模块'}</div>`
    + `<div class="chipset">${siblings.length ? siblings.map(chip).join('') : '<span class="chip">—</span>'}</div>`;

  $('focusHd').innerHTML = `<span class="ft">聚焦视图</span>`
    + `<span class="fk">${esc(n.label)} · ${esc(n.id)} · 入 ${ins.length} / 出 ${outs.length}</span>`
    + `<span class="acts">`
    + `<span class="btn" id="focusLocate">在全景图中定位</span>`
    + `<span class="btn ghost" id="focusClear">清除聚焦</span></span>`;
  $('focusBody').innerHTML =
    `<div><div class="fcol-h">上游 · 谁指向它（${ins.length}）</div>${ins.length ? ins.map(e => edgeCard(e, 'in')).join('') : '<div class="empty">无</div>'}</div>`
    + `<div class="fmid">${mid}</div>`
    + `<div><div class="fcol-h">下游 · 它指向谁（${outs.length}）</div>${outs.length ? outs.map(e => edgeCard(e, 'out')).join('') : '<div class="empty">无</div>'}</div>`;

  $('focusClear').addEventListener('click', () => { ST.focusId = null; $('focus').style.display = 'none'; });
  $('focusLocate').addEventListener('click', () => {
    if(!nodeById[id]){ ST.view = 'full'; ST.persona = 'all'; renderToolbar(); renderCanvas(); }
    scrollToCard(id);
  });
  $('focusBody').addEventListener('click', ev => {
    const t = ev.target.closest('[data-focus]');
    if(!t) return;
    const target = t.dataset.focus;
    if(!nodeById[target] && ovById[target]){ ST.view = 'overview'; renderToolbar(); renderCanvas(); }
    else if(nodeById[target] && ST.view === 'overview' && !ovById[target]){ ST.view = 'full'; renderToolbar(); renderCanvas(); }
    const g = nodeById[target];
    if(g && ST.collapsed[g.col]){ delete ST.collapsed[g.col]; renderCanvas(); }
    document.querySelectorAll('.card').forEach(c => c.classList.toggle('sel', c.dataset.id === target));
    focusOn(target);
    scrollToCard(target);
  });
}
function scrollToCard(id){
  const el = document.querySelector(`.card[data-id="${CSS.escape(id)}"]`);
  if(el) el.scrollIntoView({behavior:'smooth', block:'center', inline:'center'});
}

/* 术语对照：扫正文里出现的术语，在详情底部列成对照表（不改原文） */
function termBlock(text){
  const hit = TERMS.filter(t => text.indexOf(t.term) >= 0);
  if(!hit.length) return '';
  return block('涉及术语', `<div class="quote"><table class="termtab">`
    + hit.map(t => `<tr><td>${esc(t.term)}</td><td>${esc(t.plain)}</td></tr>`).join('')
    + `</table></div>`);
}

function nodeDetail(id){
  const n = nodeById[id] || ovById[id];
  if(!n) return '<div class="empty">未找到</div>';
  if(ST.view === 'overview' && ovById[id]){
    const o = ovById[id];
    const myNodes = DATA.graph.nodes.filter(x => x.page === id);
    let h = kv([
      ['id', `<span class="mono">${esc(o.id)}</span>`],
      ['名称', esc(o.label)],
      ['端', (o.personas||[]).map(p => esc(DATA.personaMeta[p]||p)).join(' / ') || '—'],
      ['模块数', String(o.nodeCount)],
      ['跨页连线', String(o.edgeCount)],
      ['缺口', `<span style="color:${(o.gapCount+o.issueCount)?'#d97706':'inherit'}">${o.gapCount+o.issueCount}</span>`],
    ]);
    if(o.description) h += block('说明', `<div class="quote">${esc(o.description)}</div>`);
    if(o.file) h += block('主组件', `<div class="quote mono">${esc(o.file)}</div>`);
    h += block(`本页模块（${myNodes.length}）`, `<div class="chipset">` + (myNodes.length
      ? myNodes.map(x => `<span class="chip c2${x.orphan?' orph':''}" data-focus="${esc(x.id)}" title="${x.orphan?'未参与任何连线':''}">${esc(x.label)}</span>`).join('')
      : '—') + `</div>`);
    h += `<div class="flegend">提示：点下面「② 全景（节点级）」可看本页模块与连线的细节；点任意模块会打开下方聚焦视图。</div>`;
    return h;
  }
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
  h += termBlock([e.trigger, e.payload, e.logic, e.note, e.designRef, e.expected, e.blockedBy, e.issue, e.evidenceChain].join(' '));
  return h;
}

/* 总览层的聚合连线：列出它由哪几条节点级连线折叠而来 */
function selectOvEdge(id){
  const e = ovEdgeById[id];
  if(!e) return;
  ST.selKind = 'ovedge'; ST.selId = id;
  const a = ovById[e.from], b = ovById[e.to];
  const list = e.edgeIds.map(x => edgeById[x]).filter(Boolean);
  let h = kv([
    ['起点', esc(a ? a.label : e.from)],
    ['终点', esc(b ? b.label : e.to)],
    ['折叠自', `${list.length} 条节点级连线`],
    ['缺口', `<span style="color:${e.gap?'#d97706':'inherit'}">${e.gap}</span>`],
  ]);
  h += block(`组成连线（${list.length}）`, list.map(x => {
    const on = nodeById[x.to], of = nodeById[x.from];
    const col = x.status==='implemented' ? '#16a34a' : (x.status==='intended' ? '#d97706' : '#64748b');
    return `<div class="eitem" data-id="${esc(x.id)}" data-kind="edge">
      <div class="e1"><span class="pill" style="background:${x.color}1a;color:${x.color}">${esc(x.typeLabel)}</span>
        <span class="pill" style="background:${col}1a;color:${col}">${esc(x.statusLabel)}</span></div>
      <div class="e2">${esc(of?of.label:x.from)} → ${esc(on?on.label:x.to)}</div></div>`;
  }).join('') || '<div class="empty">无</div>');
  h += `<div class="flegend">当前为总览视图（页面级）。点「② 全景（节点级）」可看这些连线的具体落点。</div>`;
  $('detailHint').textContent = '聚合连线';
  $('detail').innerHTML = h;
}

/* issue 详情：通俗版（plain，人写的）/ 原始数据（一字未改的原始字段）双页签 */
function issueDetail(id){
  const it = issueById[id];
  if(!it) return '<div class="empty">未找到</div>';
  const hasPlain = !!(it.plain && it.plain.oneLine);
  const mode = (ST.plainMode === 'raw' || !hasPlain) ? 'raw' : 'plain';
  const n = nodeById[it.where] || ovById[it.where];
  const sevColor = it.severity === 'high' ? '#dc2626' : (it.severity === 'medium' ? '#d97706' : '#64748b');
  let h = kv([
    ['位置', n ? `${esc(n.label)}<br><span class="mono" style="color:#94a3b8">${esc(it.where)}</span>`
               : `<span class="mono">${esc(it.where)}</span><br><span style="color:#94a3b8">不在结构图上（外部引用）</span>`],
    ['级别', `<span style="color:${sevColor};font-weight:600">${esc(it.severity||'—')}</span>`],
    ['分类', esc(it.category||'—')],
    ['归属', esc(it.owner||'—')],
  ]);
  h += `<div class="tabs2">`
    + `<div class="btn ${mode==='plain'?'on':''}" data-pm="plain">通俗版</div>`
    + `<div class="btn ${mode==='raw'?'on':''}" data-pm="raw">原始数据</div></div>`;
  if(mode === 'plain'){
    const p = it.plain;
    h += `<div class="plain-box">`
      + `<div class="pf">一句话</div><div class="pv">${esc(p.oneLine)}</div>`
      + (p.symptom ? `<div class="pf">现象（页面上会看到什么）</div><div class="pv">${esc(p.symptom)}</div>` : '')
      + (p.impact ? `<div class="pf">影响</div><div class="pv">${esc(p.impact)}</div>` : '')
      + (p.ask ? `<div class="pf">需要谁做什么</div><div class="pv">${esc(p.ask)}</div>` : '')
      + `</div>`;
    h += `<div class="flegend">通俗版是另写的解释层，原始数据一字未改（点上方「原始数据」查看）。</div>`;
    return h;
  }
  if(!hasPlain) h += `<div class="fallback">该条暂无通俗版，以下为原始记录。</div>`;
  h += block('问题', `<div class="quote">${esc(it.title)}</div>`);
  if(it.detail) h += block('详情', `<div class="quote">${esc(it.detail)}</div>`);
  if(it.status){
    const stMap = {implemented: '已实现', intended: '设计有·未实现', undefined: '待确认（设计本身也没定）'};
    h += block('状态', `<div class="quote">${esc(stMap[it.status] || it.status)}</div>`);
  }
  if(it.designRef) h += block('设计要求（来自）', `<div class="quote warn">${esc(it.designRef)}</div>`);
  if(it.expected) h += block('期望行为', `<div class="quote warn">${esc(it.expected)}</div>`);
  if(it.blockedBy) h += block('卡在哪', `<div class="quote warn">${esc(it.blockedBy)}</div>`);
  if(it.issue) h += block('待确认问题', `<div class="quote warn">${esc(it.issue)}</div>`);
  h += termBlock([it.title, it.detail, it.designRef, it.expected, it.blockedBy, it.issue].join(' '));
  return h;
}

/* 点击缺口列表里的 issue：①在结构图中定位并高亮模块（滚动 + 聚焦视图）②右栏显示该 issue 详情。
   定位不到时给出明确说明，而不是无声无息（旧版 40 条 issue 有 15 条点了完全没反应）。 */
function locateIssue(id){
  const it = issueById[id];
  if(!it) return;
  const w = it.where;
  const anchored = !!(nodeById[w] || ovById[w]);
  if(anchored){
    if(!ovById[w] && ST.view === 'overview'){       // 只有节点级卡片：先切到全景
      ST.view = 'full';
      renderToolbar();
      renderCanvas();
    }
    const g = nodeById[w];
    if(g && ST.collapsed[g.col]){ delete ST.collapsed[g.col]; renderCanvas(); }
    document.querySelectorAll('.card').forEach(c => c.classList.toggle('sel', c.dataset.id === w));
    focusOn(w);
    scrollToCard(w);
  } else {
    ST.focusId = null;
    renderFocus();
  }
  select('issue', id);                              // 右栏显示问题详情（通俗版优先）
}

$('detail').addEventListener('click', ev => {
  const pm = ev.target.closest('[data-pm]');
  if(pm){ ST.plainMode = pm.dataset.pm; if(ST.selKind === 'issue') $('detail').innerHTML = issueDetail(ST.selId); return; }
  const fc = ev.target.closest('[data-focus]');
  if(fc){
    const t = fc.dataset.focus;
    if(!nodeById[t] && ovById[t]){ ST.view = 'overview'; renderToolbar(); renderCanvas(); }
    else if(nodeById[t] && ST.view === 'overview' && !ovById[t]){ ST.view = 'full'; renderToolbar(); renderCanvas(); }
    const gg = nodeById[t];
    if(gg && ST.collapsed[gg.col]){ delete ST.collapsed[gg.col]; renderCanvas(); }
    document.querySelectorAll('.card').forEach(c => c.classList.toggle('sel', c.dataset.id === t));
    focusOn(t);
    scrollToCard(t);
    return;
  }
  const it = ev.target.closest('.eitem');
  if(it){
    if(it.dataset.kind === 'edge') select('edge', it.dataset.id);
    else if(it.dataset.kind === 'issue') locateIssue(it.dataset.id);
  }
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
    const n = nodeById[i.where] || ovById[i.where];
    const p = i.plain || {};
    rows.push({kind:'issue', id:i.id, sev:i.severity,
      color: i.severity==='high' ? '#dc2626' : (i.severity==='medium' ? '#c2760b' : '#64748b'),
      t:i.title,
      w:`${n ? n.label : i.where} · ${i.category||''}${i.owner ? (' · ' + i.owner) : ''}`,
      d:(p.oneLine || i.detail || ''),
      loc: n ? '点击定位到结构图中的模块' : '不在结构图上（外部引用的元问题）',
      noanchor: !n});
  });
  rows.sort((x,y) => ({high:0,medium:1,low:2}[x.sev] ?? 9) - ({high:0,medium:1,low:2}[y.sev] ?? 9));
  $('gapCnt').textContent = rows.length + ' 项';
  $('gaps').innerHTML = rows.map(r => `<div class="iitem clickable ${r.kind==='edge'?'eitem':''}${r.noanchor?' noanchor':''}" data-id="${esc(r.id)}" data-kind="${r.kind}">
      <div class="t" style="color:${r.color}">${esc(r.t)}</div>
      <div class="w">${esc(r.w)}</div>
      <div class="d">${esc(r.d).slice(0,200)}${r.d && r.d.length>200?'…':''}</div>
      <div class="loc">▸ ${esc(r.loc)}</div>
    </div>`).join('') || '<div class="empty">无缺口</div>';
  $('gaps').addEventListener('click', ev => {
    const it = ev.target.closest('[data-kind]');
    if(!it) return;
    if(it.dataset.kind === 'edge'){ select('edge', it.dataset.id); scrollToEdge(it.dataset.id); }
    else locateIssue(it.dataset.id);
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
    let h = `<table style="${st}"><tr><th style="padding:9px 12px;background:#f8fafc;text-align:left">位置</th><th style="padding:9px 12px;background:#f8fafc;text-align:left">问题</th><th style="padding:9px 12px;background:#f8fafc;text-align:left">级别</th><th style="padding:9px 12px;background:#f8fafc;text-align:left">分类/归属</th><th style="padding:9px 12px;background:#f8fafc;text-align:left">一句话（通俗版）</th></tr>`;
    DATA.issues.forEach(i => {
      const n = nodeById[i.where] || ovById[i.where];
      const p = i.plain || {};
      h += `<tr class="clickable" data-id="${esc(i.id)}" data-kind="issue" style="cursor:pointer">
        <td style="padding:9px 12px;border-top:1px solid #eef2f7">${esc(n?n.label:i.where)}</td>
        <td style="padding:9px 12px;border-top:1px solid #eef2f7"><b>${esc(i.title)}</b></td>
        <td style="padding:9px 12px;border-top:1px solid #eef2f7">${esc(i.severity||'')}</td>
        <td style="padding:9px 12px;border-top:1px solid #eef2f7;color:#475569">${esc(i.category||'')}<br><span style="color:#94a3b8">${esc(i.owner||'')}</span></td>
        <td style="padding:9px 12px;border-top:1px solid #eef2f7;color:#475569">${esc(p.oneLine || i.detail)}</td></tr>`;
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
  if(!tr) return;
  if(tr.dataset.kind === 'issue') locateIssue(tr.dataset.id);
  else { select('edge', tr.dataset.id); scrollToEdge(tr.dataset.id); }
});

/* ---------- boot ---------- */
renderToolbar();
renderCanvas();
window.addEventListener('load', () => { renderCanvas(); });
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
