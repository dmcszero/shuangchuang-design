#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
⛔ 已退役（2026-09-13）：本脚本的角色已由 `gen_wiki_tools.py validate` 完全取代。
   保留仅为历史留存，**勿再使用**（其规则集是正式校验器的子集，跑出来的结论会与正式链路口径不一致）。
   正式用法：python wiki/gen_wiki_tools.py validate

LLM Wiki 试点校验器 v0.1（第 3 步正式工具链的前身）

校验 schema v0.2 定义的 node / edge 结构自洽性：
  A5  node.page 存在于 structure.json
  A6  node.id 唯一且等于文件名
  A7  已下钻 page（docStatus=drilled）至少 1 个 node
  B1  node frontmatter 必填字段齐全
  B5  node.kind 属于枚举
  C5  sources 行号不超过目标文件实际行数
  D1  edge.from / edge.to 存在
  D2  edge.id 唯一
  D3  edge.status 与必填字段矩阵一致
  D5  node 第 5 节含 EDGES 标记区块

纯标准库。用法：python validate_pilot.py
退出码：0 = 无 error，1 = 存在 error
"""
from __future__ import annotations

import json
import os
import re
import sys
from typing import Any

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

REPO_ROOT = r"D:\code\创赛\shuangchuang-design-SY"
WIKI_DIR = os.path.join(REPO_ROOT, "wiki")
NODES_DIR = os.path.join(WIKI_DIR, "nodes")
PAGES_DIR = os.path.join(WIKI_DIR, "pages")
STRUCTURE_FILE = os.path.join(WIKI_DIR, "structure.json")
EDGES_FILE = os.path.join(WIKI_DIR, "edges.json")

VALID_KIND = {"panel", "tab", "nav", "list", "form", "modal", "bar", "drawer", "table"}
VALID_IMPORTANCE = {"high", "medium", "low"}
REQUIRED_FM = ["id", "title", "page", "kind", "importance", "sources"]
REQUIRED_SECTIONS = ["一句话定位", "事实", "规则与边界", "常见开发任务", "出入边"]

STATUS_REQUIRED = {
    "implemented": ["sources"],
    "intended": ["designRef", "expected", "blockedBy"],
    "undefined": ["issue"],
}

FM_RE = re.compile(r"\A---\r?\n(.*?)\r?\n---\r?\n", re.DOTALL)
SRC_ITEM_RE = re.compile(r"^(?P<path>[^:]+):(?P<start>\d+)(?:-(?P<end>\d+))?$")
CITATION_RE = re.compile(r"Sources:\s*\[([^\[\]]+?):(\d+)(?:\s*-\s*(\d+))?\]\(\)")

errors: list[str] = []
warnings: list[str] = []


def err(msg: str) -> None:
    errors.append(msg)


def warn(msg: str) -> None:
    warnings.append(msg)


def parse_frontmatter(text: str) -> dict[str, Any] | None:
    """极简 YAML 子集：标量 + 简单列表（- 项 / [a, b]）"""
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
            k = k.strip()
            v = v.strip()
            key = k
            if v == "":
                data[k] = []
            elif v.startswith("[") and v.endswith("]"):
                inner = v[1:-1].strip()
                data[k] = [x.strip().strip('"').strip("'") for x in inner.split(",") if x.strip()] if inner else []
            else:
                data[k] = v.strip('"').strip("'")
    return data


def count_lines(rel_path: str) -> int | None:
    full = os.path.join(REPO_ROOT, rel_path)
    if not os.path.isfile(full):
        return None
    with open(full, encoding="utf-8") as fh:
        return sum(1 for _ in fh)


def load_json(path: str) -> Any:
    with open(path, encoding="utf-8") as fh:
        return json.load(fh)


def main() -> int:
    # ---- 载入 ----
    try:
        structure = load_json(STRUCTURE_FILE)
    except Exception as exc:  # noqa: BLE001
        print(f"[FATAL] structure.json 解析失败：{exc}")
        return 1
    try:
        edge_doc = load_json(EDGES_FILE)
    except Exception as exc:  # noqa: BLE001
        print(f"[FATAL] edges.json 解析失败：{exc}")
        return 1

    page_ids = {p["id"] for p in structure.get("pages", [])}
    page_status = {p["id"]: p.get("docStatus", "pending") for p in structure.get("pages", [])}
    modal_ids = {m["id"] for m in structure.get("modals", [])}
    shell_ids = {s["id"] for s in structure.get("shellComponents", [])}
    valid_targets = page_ids | modal_ids | shell_ids

    # ---- 载入所有 node ----
    nodes: dict[str, dict[str, Any]] = {}
    node_bodies: dict[str, str] = {}
    if os.path.isdir(NODES_DIR):
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
                fm = parse_frontmatter(text)
                stem = fn[:-3]
                if fm is None:
                    err(f"[B1] {path} 缺少 frontmatter")
                    continue
                if fm.get("id") != stem:
                    err(f"[A6] {path}：frontmatter id={fm.get('id')!r} 与文件名 {stem!r} 不一致")
                nodes[fm.get("id", stem)] = fm
                node_bodies[fm.get("id", stem)] = text

    node_ids = set(nodes)

    # ---- A5 / B1 / B5 ----
    for nid, fm in nodes.items():
        for field in REQUIRED_FM:
            if not fm.get(field):
                err(f"[B1] {nid} 缺少必填字段 {field}")
        pg = fm.get("page")
        if pg and pg not in page_ids:
            err(f"[A5] {nid}：page={pg!r} 不存在于 structure.json")
        kind = fm.get("kind")
        if kind and kind not in VALID_KIND:
            err(f"[B5] {nid}：kind={kind!r} 不在枚举内")
        imp = fm.get("importance")
        if imp and imp not in VALID_IMPORTANCE:
            err(f"[B5] {nid}：importance={imp!r} 不在枚举内")

    # ---- A7 已下钻 page 至少 1 节点 ----
    drilled = {pid for pid, st in page_status.items() if st == "drilled"}
    for pid in sorted(drilled):
        owned = [nid for nid, fm in nodes.items() if fm.get("page") == pid]
        if not owned:
            err(f"[A7] {pid} 标记为 drilled 但没有任何 node")

    # ---- D5 第 5 节 EDGES 标记 ----
    for nid, text in node_bodies.items():
        for sec in REQUIRED_SECTIONS:
            if f"## {sec}" not in text:
                err(f"[D5] {nid} 缺少固定节「## {sec}」")
        if "<!-- EDGES:BEGIN -->" not in text or "<!-- EDGES:END -->" not in text:
            err(f"[D5] {nid} 缺少 EDGES 标记区块")

    # ---- C5 sources 行号 ----
    def check_sources(owner: str, items: list[str]) -> None:
        for item in items:
            m = SRC_ITEM_RE.match(str(item))
            if not m:
                err(f"[C5] {owner}：sources 项格式非法 {item!r}（应为 路径:行号）")
                continue
            rel = m.group("path")
            total = count_lines(rel)
            if total is None:
                err(f"[C5] {owner}：sources 指向的文件不存在 {rel}")
                continue
            end = int(m.group("end") or m.group("start"))
            if end > total:
                err(f"[C5] {owner}：{rel}:{m.group('start')}-{end} 超出文件行数 {total}")

    for nid, fm in nodes.items():
        srcs = fm.get("sources") or []
        if isinstance(srcs, str):
            srcs = [srcs]
        check_sources(f"node {nid}", srcs)

    # ---- 正文内的 Sources 引用 ----
    for nid, text in node_bodies.items():
        for cm in CITATION_RE.finditer(text):
            rel = cm.group(1)
            end = int(cm.group(3) or cm.group(2))
            total = count_lines(rel)
            if total is None:
                err(f"[C5] {nid}：正文引用文件不存在 {rel}")
            elif end > total:
                err(f"[C5] {nid}：正文引用 {rel}:{cm.group(2)}-{end} 超出文件行数 {total}")

    # ---- D1 / D2 / D3 ----
    seen_ids: set[str] = set()
    for edge in edge_doc.get("edges", []):
        eid = edge.get("id", "<no-id>")
        if eid in seen_ids:
            err(f"[D2] edge id 重复：{eid}")
        seen_ids.add(eid)

        for end_name in ("from", "to"):
            target = edge.get(end_name)
            if target not in node_ids and target not in valid_targets:
                err(f"[D1] {eid}：{end_name}={target!r} 既不是 node、也不在 page/modal/shell 中")

        status = edge.get("status")
        if status not in STATUS_REQUIRED:
            err(f"[D3] {eid}：status={status!r} 非法")
            continue
        for field in STATUS_REQUIRED[status]:
            value = edge.get(field)
            if not value:
                err(f"[D3] {eid}：status={status} 必须提供 {field}")
        for src in edge.get("sources") or []:
            check_sources(f"edge {eid}", [src])

    # ---- 出边覆盖：每个非 implemented 的边应能被 node 第 5 节体现（提示级） ----
    for edge in edge_doc.get("edges", []):
        if edge.get("status") == "implemented":
            continue
        warn(f"[E1] {edge.get('id')} 为 {edge.get('status')}（未实现/待确认），severity={edge.get('severity', 'n/a')}")

    # ---- 统计 ----
    print("=" * 68)
    print(f"节点 {len(nodes)} 个 | 边 {len(edge_doc.get('edges', []))} 条 | issues {len(edge_doc.get('issues', []))} 条")
    by_status: dict[str, int] = {}
    for e in edge_doc.get("edges", []):
        by_status[e.get("status", "?")] = by_status.get(e.get("status", "?"), 0) + 1
    print("边状态分布：" + ", ".join(f"{k}={v}" for k, v in sorted(by_status.items())))
    print("=" * 68)

    if warnings:
        print(f"\n--- 警告 {len(warnings)} 条 ---")
        for w in warnings:
            print("  ! " + w)

    if errors:
        print(f"\n--- 错误 {len(errors)} 条 ---")
        for e in errors:
            print("  x " + e)
        print(f"\n结果：FAIL（{len(errors)} error / {len(warnings)} warning）")
        return 1

    print(f"\n结果：PASS（0 error / {len(warnings)} warning）")
    return 0


if __name__ == "__main__":
    sys.exit(main())
