#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""LLM Wiki 工具链 · shuangchuang-design-main（schema v0.4）

五个子命令（纯标准库，零第三方依赖）：

    python wiki/gen_wiki_tools.py validate     校验 structure / pages / nodes / edges 一致性
    python wiki/gen_wiki_tools.py sync-edges   把 edges.json 渲染进各 node 的第 5 节（出入边）
    python wiki/gen_wiki_tools.py index        生成 wiki/llms.txt（含 node 清单）
    python wiki/gen_wiki_tools.py map          生成 wiki/module-map.html + wiki/site/index.html
    python wiki/gen_wiki_tools.py gaps         汇总非 implemented 边与 issues → wiki/gaps.md
                                               并分流产品决策条目 → wiki/decisions.md

真源与产物
----------
真源（手写，唯一事实来源）：
    wiki/structure.json          section / page / persona / placeholder / 壳层 / 弹层 / 孤儿
    wiki/edges.json              边 + issues（issues 带 category / owner 分流字段）
    wiki/nodes/<page-id>/*.md    节点（frontmatter + 前 4 节）
    wiki/pages/<page-id>.md      页面（frontmatter + 页面级事实 + 节点地图）
产物（工具生成，勿手改）：
    wiki/nodes/**/ 第 5 节「出入边」   ← sync-edges
    wiki/llms.txt                      ← index
    wiki/module-map.html · wiki/site/index.html ← map
    wiki/gaps.md · wiki/decisions.md   ← gaps

设计原则
--------
- 行号口径 = UTF-8 解码行数，1-based，闭区间；引用语法 `Sources: [相对路径:起[-止]]()`，
  路径相对本仓根 `shuangchuang-design-main/`。
- node 第 5 节的真源是 `edges.json`。手写会与边表漂移，故由 sync-edges 生成并在 markers
  （`<!-- EDGES:BEGIN -->` / `<!-- EDGES:END -->`）之间整段覆盖；validate 的 D5 校验二者一致。
- 文件一律 LF + 末尾换行；本工具读写均显式声明 newline，不随平台漂移。
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

# --------------------------------------------------------------------------
# 路径常量
# --------------------------------------------------------------------------
REPO_ROOT = Path(__file__).resolve().parent.parent
WIKI_DIR = REPO_ROOT / "wiki"
PAGES_DIR = WIKI_DIR / "pages"
NODES_DIR = WIKI_DIR / "nodes"
STRUCTURE_FILE = WIKI_DIR / "structure.json"
EDGES_FILE = WIKI_DIR / "edges.json"
GLOSSARY_FILE = WIKI_DIR / "glossary.json"
LLMS_TXT = WIKI_DIR / "llms.txt"
GAPS_MD = WIKI_DIR / "gaps.md"
DECISIONS_MD = WIKI_DIR / "decisions.md"
MAP_FILE = WIKI_DIR / "module-map.html"
SITE_DIR = WIKI_DIR / "site"
SITE_INDEX = SITE_DIR / "index.html"

# --------------------------------------------------------------------------
# 契约常量（改这里即改契约；须与 wiki/schema.md 同步）
# --------------------------------------------------------------------------
PAGE_REQUIRED_FM = ["id", "title", "section", "importance", "sources", "related_pages"]
NODE_REQUIRED_FM = ["id", "title", "page", "kind", "importance", "sources"]
PAGE_REQUIRED_SECTIONS = ["一句话定位", "事实", "规则与边界", "常见开发任务", "与 related_pages 的联动提示"]
NODE_REQUIRED_SECTIONS = ["一句话定位", "事实", "规则与边界", "常见开发任务", "出入边"]

VALID_KIND = {"panel", "tab", "nav", "list", "form", "modal", "bar", "drawer", "table"}
VALID_IMPORTANCE = {"high", "medium", "low"}
VALID_EDGE_TYPE = {"navigate", "navigate-with-payload", "read", "writeback", "reuse", "embed"}
VALID_EDGE_STATUS = {"implemented", "intended", "undefined"}
STATUS_REQUIRED = {
    "implemented": ["sources"],
    "intended": ["designRef", "expected", "blockedBy"],
    "undefined": ["issue"],
}
NAV_TYPES = {"navigate", "navigate-with-payload"}

# v0.4 新增：persona（端）维度与 issues 分流
VALID_ISSUE_CATEGORY = {"产品决策", "技术实现", "数据口径"}
VALID_ISSUE_OWNER = {"上司拍板", "工程自决", "待产品定义"}

PAGE_MIN_CITES = 5   # 页面正文最少引用条数（防空壳页）
NODE_MIN_CITES = 3   # 节点正文最少引用条数

EDGES_BEGIN = "<!-- EDGES:BEGIN -->"
EDGES_END = "<!-- EDGES:END -->"

FM_RE = re.compile(r"\A---\r?\n(.*?)\r?\n---\r?\n", re.DOTALL)
CITATION_RE = re.compile(r"Sources:\s*\[([^\[\]]+?):(\d+)(?:\s*-\s*(\d+))?\]\(\)")
SRC_ITEM_RE = re.compile(r"^(?P<path>[^:]+):(?P<start>\d+)(?:-(?P<end>\d+))?$")

STATUS_LABEL = {
    "implemented": "implemented（已实现）",
    "intended": "intended（设计有·未实现）",
    "undefined": "undefined（设计本身未定）",
}


# --------------------------------------------------------------------------
# 基础设施（沿用 v1 design-main 的设施，零重写）
# --------------------------------------------------------------------------
class Report:
    """收集校验结果并按级别输出。"""

    def __init__(self) -> None:
        self.errors: list[str] = []
        self.warnings: list[str] = []
        self.stats: dict[str, Any] = {}

    def error(self, msg: str) -> None:
        self.errors.append(msg)

    def warn(self, msg: str) -> None:
        self.warnings.append(msg)

    def dump(self) -> None:
        for k in sorted(self.stats):
            print("  · %s: %s" % (k, self.stats[k]))
        if self.warnings:
            print("\n[WARN] %d 条警告：" % len(self.warnings))
            for w in self.warnings:
                print("  ! %s" % w)
        if self.errors:
            print("\n[ERROR] %d 条错误：" % len(self.errors))
            for e in self.errors:
                print("  x %s" % e)
        else:
            print("\n校验结论：全绿（0 error）")


def read_text_lf(rel_or_abs: str | Path) -> str | None:
    """按原样读取文本（不做换行归一），文件不存在返回 None。"""
    p = Path(rel_or_abs)
    if not p.is_absolute():
        p = REPO_ROOT / p
    if not p.is_file():
        return None
    try:
        with open(p, "r", encoding="utf-8", newline="") as fh:
            return fh.read()
    except UnicodeDecodeError:
        return None


def write_text_lf(path: Path, text: str) -> None:
    """写文本，强制 LF + 末尾换行（不随平台漂移）。"""
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8", newline="\n") as fh:
        fh.write(text)


def read_lines(rel_path: str) -> list[str] | None:
    """按 UTF-8 口径读取源码行；文件不存在返回 None。

    行号口径与编辑器一致：本仓源文件为 LF + 无 BOM + 末尾带换行，
    故 splitlines() 的长度 == 编辑器最后一行行号。
    """
    p = REPO_ROOT / rel_path
    if not p.is_file():
        return None
    try:
        text = p.read_text(encoding="utf-8").replace("\r\n", "\n").replace("\r", "\n")
    except UnicodeDecodeError:
        return None
    lines = text.split("\n")
    if lines and lines[-1] == "":
        lines.pop()
    return lines


def parse_frontmatter(text: str) -> dict[str, Any] | None:
    """极简 YAML 子集：标量 + `  - item` 列表 + `[a, b]` 行内列表。"""
    m = FM_RE.match(text)
    if not m:
        return None
    data: dict[str, Any] = {}
    current_key: str | None = None
    for raw in m.group(1).splitlines():
        line = raw.rstrip()
        if not line.strip() or line.strip().startswith("#"):
            continue
        if line.lstrip().startswith("- ") and current_key:
            data.setdefault(current_key, [])
            if not isinstance(data[current_key], list):
                data[current_key] = [data[current_key]]
            data[current_key].append(line.strip()[2:].strip().strip('"').strip("'"))
            continue
        if ":" in line:
            k, _, v = line.partition(":")
            k, v = k.strip(), v.strip()
            current_key = k
            if v == "":
                data[k] = []
            elif v.startswith("[") and v.endswith("]"):
                inner = v[1:-1].strip()
                data[k] = [x.strip().strip('"').strip("'") for x in inner.split(",") if x.strip()] if inner else []
            else:
                data[k] = v.strip('"').strip("'")
    return data


def strip_frontmatter(text: str) -> str:
    m = FM_RE.match(text)
    return text[m.end():] if m else text


def section_body(body: str, heading: str) -> str:
    """取出 `## <heading>` 到下一个 `## ` 之间的正文（前缀匹配，容忍标题带补充说明）。"""
    pattern = re.compile(r"^##[ \t]+" + re.escape(heading) + r".*$", re.MULTILINE)
    m = pattern.search(body)
    if not m:
        return ""
    rest = body[m.end():]
    nxt = re.search(r"^##[ \t]+", rest, re.MULTILINE)
    return rest[: nxt.start()] if nxt else rest


def has_section(body: str, heading: str) -> bool:
    return bool(re.search(r"^##[ \t]+" + re.escape(heading), body, re.MULTILINE))


def as_list(v: Any) -> list[str]:
    if v is None:
        return []
    if isinstance(v, list):
        return [str(x) for x in v]
    if isinstance(v, str):
        return [v] if v else []
    return []


# --------------------------------------------------------------------------
# 载入真源
# --------------------------------------------------------------------------
class Node:
    __slots__ = ("id", "file", "fm", "text", "body", "page")

    def __init__(self, nid: str, file: Path, fm: dict[str, Any], text: str) -> None:
        self.id = nid
        self.file = file
        self.fm = fm
        self.text = text
        self.body = strip_frontmatter(text)
        self.page = str(fm.get("page", ""))


class Wiki:
    """一次性载入三份真源，供五个子命令共用。"""

    def __init__(self) -> None:
        self.errors: list[str] = []
        self.structure: dict[str, Any] = {}
        self.edge_doc: dict[str, Any] = {}
        self.nodes: dict[str, Node] = {}
        self.node_order: list[str] = []
        self.pages: dict[str, dict[str, Any]] = {}
        self.page_fm: dict[str, dict[str, Any]] = {}
        self.page_body: dict[str, str] = {}
        self._load()

    # ---- 载入 ----
    def _load(self) -> None:
        if STRUCTURE_FILE.is_file():
            self.structure = json.loads(STRUCTURE_FILE.read_text(encoding="utf-8"))
        else:
            self.errors.append("structure.json 缺失：%s" % STRUCTURE_FILE)
        if EDGES_FILE.is_file():
            self.edge_doc = json.loads(EDGES_FILE.read_text(encoding="utf-8"))
        else:
            self.errors.append("edges.json 缺失：%s" % EDGES_FILE)

        for p in self.structure.get("pages", []):
            self.pages[p.get("id", "")] = p
            f = PAGES_DIR / ("%s.md" % p.get("id"))
            text = read_text_lf(f)
            if text is None:
                continue
            fm = parse_frontmatter(text)
            if fm is None:
                continue
            self.page_fm[p.get("id", "")] = fm
            self.page_body[p.get("id", "")] = strip_frontmatter(text)

        if NODES_DIR.is_dir():
            for page_dir in sorted(NODES_DIR.iterdir()):
                if not page_dir.is_dir():
                    continue
                for f in sorted(page_dir.glob("*.md")):
                    text = read_text_lf(f)
                    if text is None:
                        continue
                    fm = parse_frontmatter(text)
                    if fm is None:
                        self.node_order.append(f.stem)
                        self.nodes[f.stem] = Node(f.stem, f, {}, text)
                        continue
                    nid = str(fm.get("id") or f.stem)
                    if nid != f.stem:
                        self.errors.append(
                            "nodes/%s/%s：frontmatter id=%r 与文件名不一致" % (page_dir.name, f.name, nid)
                        )
                    if nid in self.nodes:
                        self.errors.append("node id 重复：%s" % nid)
                    self.node_order.append(nid)
                    self.nodes[nid] = Node(nid, f, fm, text)

    # ---- 索引 ----
    @property
    def edges(self) -> list[dict[str, Any]]:
        return self.edge_doc.get("edges", [])

    @property
    def issues(self) -> list[dict[str, Any]]:
        return self.edge_doc.get("issues", [])

    def rel(self, p: Path) -> str:
        return p.relative_to(REPO_ROOT).as_posix()

    def node_file_rel(self, nid: str) -> str:
        n = self.nodes.get(nid)
        return self.rel(n.file) if n else nid

    def label(self, nid: str) -> str:
        """任意图节点的中文名（node / page / modal / shell 通用）。"""
        if nid in self.nodes:
            return str(self.nodes[nid].fm.get("title") or nid)
        pmap = {m.get("id"): m for m in self.structure.get("modals", [])}
        if nid in pmap:
            return str(pmap[nid].get("title") or nid)
        smap = {s.get("id"): s for s in self.structure.get("shellComponents", [])}
        if nid in smap:
            return str(smap[nid].get("title") or nid)
        if nid in self.pages:
            return str(self.pages[nid].get("title") or nid)
        return nid

    def nodes_of_page(self, pid: str) -> list[str]:
        """按页面 frontmatter 的 `nodes:` 声明顺序返回（缺失项追加在尾部）。"""
        declared = [n for n in as_list(self.page_fm.get(pid, {}).get("nodes")) if n in self.nodes]
        rest = [nid for nid in self.node_order if self.nodes[nid].page == pid and nid not in declared]
        return declared + rest

    def in_edges(self, nid: str) -> list[dict[str, Any]]:
        return [e for e in self.edges if e.get("to") == nid]

    def out_edges(self, nid: str) -> list[dict[str, Any]]:
        return [e for e in self.edges if e.get("from") == nid]

    @property
    def valid_targets(self) -> set[str]:
        ids = set(self.nodes) | set(self.pages)
        ids |= {m.get("id") for m in self.structure.get("modals", [])}
        ids |= {s.get("id") for s in self.structure.get("shellComponents", [])}
        return ids


# --------------------------------------------------------------------------
# validate
# --------------------------------------------------------------------------
def cmd_validate(args: argparse.Namespace) -> int:
    w = Wiki()
    rep = Report()
    for e in w.errors:
        rep.error(e)

    structure, pages, sections = w.structure, w.pages, w.structure.get("sections", [])
    declared = list(pages)
    dup = {i for i in declared if declared.count(i) > 1}
    if dup:
        rep.error("[A1] structure.json pages[].id 重复：%s" % sorted(dup))
    section_ids = {s.get("id") for s in sections}
    for s in sections:
        for pid in s.get("pages", []):
            if pid not in pages:
                rep.error("[A2] section %s 引用了未定义的 page id：%s" % (s.get("id"), pid))

    # ---- A8 persona 维度（v0.4；structure.json 未声明 personas[] 时跳过，向后兼容） ----
    personas = structure.get("personas", [])
    if personas:
        persona_ids = {p.get("id") for p in personas}
        for p in personas:
            dp = p.get("defaultPage")
            if dp and dp not in pages:
                rep.error("[A8] persona %s 的 defaultPage=%r 不是已定义的 page" % (p.get("id"), dp))
        for pg in structure.get("pages", []):
            pgs = pg.get("personas")
            if pgs is None:
                rep.warn("[A8] page %s 未声明 personas（v0.4 起每页应至少服务一端）" % pg.get("id"))
                continue
            for ps in as_list(pgs):
                if ps not in persona_ids:
                    rep.error("[A8] page %s 的 personas 引用了未定义的 persona id：%s" % (pg.get("id"), ps))
        for ph in structure.get("placeholders", []):
            for ps in as_list(ph.get("personas")):
                if ps not in persona_ids:
                    rep.error("[A8] placeholder %s 的 personas 引用了未定义的 persona id：%s" % (ph.get("id"), ps))

    # ---- A3 页面文件存在（已下钻必须存在=error；待铺开缺失=汇总提示） ----
    pending: list[str] = []
    for pid in declared:
        if pid in w.page_fm:
            continue
        status = pages[pid].get("docStatus", "pending")
        if status == "drilled":
            rep.error("[A3] %s 标记 docStatus=drilled 但页面文件缺失：wiki/pages/%s.md" % (pid, pid))
        else:
            pending.append(pid)
    if pending:
        rep.warn(
            "[A3] %d 个 page 尚未铺开（docStatus=pending，无 pages/<id>.md）：%s"
            % (len(pending), "、".join(pending))
        )

    # ---- A4 游离页面 ----
    if PAGES_DIR.is_dir():
        for f in sorted(PAGES_DIR.glob("*.md")):
            if f.stem.startswith("page-") and f.stem not in pages:
                rep.error("[A4] 游离页面（未在 structure.json 登记）：wiki/pages/%s" % f.name)

    # ---- 逐页校验 B / C ----
    page_cites: dict[str, int] = {}
    for pid in declared:
        fm = w.page_fm.get(pid)
        if fm is None:
            continue
        rel = "wiki/pages/%s.md" % pid
        for key in PAGE_REQUIRED_FM:
            if not fm.get(key):
                rep.error("[B1] %s：frontmatter 缺少 `%s`" % (rel, key))
        if fm.get("id") != pid:
            rep.error("[B1] %s：frontmatter id(%r) 与文件名不一致" % (rel, fm.get("id")))
        if fm.get("section") not in section_ids:
            rep.error("[B2] %s：section(%r) 不在 structure.json sections 中" % (rel, fm.get("section")))
        if fm.get("importance") not in VALID_IMPORTANCE:
            rep.error("[B3] %s：importance(%r) 不在枚举内" % (rel, fm.get("importance")))
        for rp in as_list(fm.get("related_pages")):
            if rp not in pages:
                rep.error("[B4] %s：related_pages 指向未登记的 page -> %s" % (rel, rp))
            if rp == pid:
                rep.error("[B4] %s：related_pages 不应自引用" % rel)
        for s in as_list(fm.get("sources")):
            if not SRC_ITEM_RE.match(s):
                rep.error("[C5] %s：frontmatter sources 格式非法 %r（应为 路径:行号）" % (rel, s))
                continue
            _check_src(rep, rel, s)

        body = w.page_body.get(pid, "")
        for name in PAGE_REQUIRED_SECTIONS:
            if not has_section(body, name):
                rep.error("[C1] %s：正文缺少必备小节 `## %s`" % (rel, name))
        cites = CITATION_RE.findall(body)
        page_cites[pid] = len(cites)
        if len(cites) < PAGE_MIN_CITES:
            rep.error("[C2] %s：可用 Sources 引用仅 %d 条，低于下限 %d" % (rel, len(cites), PAGE_MIN_CITES))
        _check_citations(rep, rel, cites)

    # ---- 节点校验 A5~A7 / B1 B5 / C1 C2 C5 ----
    seen_node_ids: set[str] = set()
    node_cites: dict[str, int] = {}
    for nid in w.node_order:
        n = w.nodes[nid]
        rel = w.rel(n.file)
        if nid in seen_node_ids:
            rep.error("[A6] node id 重复：%s" % nid)
        seen_node_ids.add(nid)
        if not n.fm:
            rep.error("[B1] %s：缺少 frontmatter" % rel)
            continue
        for key in NODE_REQUIRED_FM:
            if not n.fm.get(key):
                rep.error("[B1] %s：frontmatter 缺少 `%s`" % (rel, key))
        if nid != n.file.stem:
            rep.error("[A6] %s：node id(%r) 不等于文件名(%r)" % (rel, nid, n.file.stem))
        if n.page and n.page not in pages:
            rep.error("[A5] %s：page=%r 不在 structure.json 中" % (rel, n.page))
        if n.page in pages and n.file.parent.name != n.page:
            rep.error("[A5] %s：所在目录(%s)与 frontmatter page(%s) 不一致" % (rel, n.file.parent.name, n.page))
        if n.fm.get("kind") not in VALID_KIND:
            rep.error("[B5] %s：kind=%r 不在枚举内" % (rel, n.fm.get("kind")))
        if n.fm.get("importance") not in VALID_IMPORTANCE:
            rep.error("[B5] %s：importance=%r 不在枚举内" % (rel, n.fm.get("importance")))

        for name in NODE_REQUIRED_SECTIONS:
            if not has_section(n.body, name):
                rep.error("[C1] %s：正文缺少必备小节 `## %s`" % (rel, name))
        cites = CITATION_RE.findall(n.body)
        node_cites[nid] = len(cites)
        if len(cites) < NODE_MIN_CITES:
            rep.error("[C2] %s：可用 Sources 引用仅 %d 条，低于下限 %d" % (rel, len(cites), NODE_MIN_CITES))
        _check_citations(rep, rel, cites)
        for s in as_list(n.fm.get("sources")):
            if not SRC_ITEM_RE.match(s):
                rep.error("[C5] %s：frontmatter sources 格式非法 %r" % (rel, s))
                continue
            _check_src(rep, rel, s)

    # ---- A7 已下钻页面的节点覆盖 ----
    for p in pages.values():
        pid = p.get("id", "")
        owned = w.nodes_of_page(pid)
        status = p.get("docStatus", "pending")
        decl_n = p.get("nodeCount")
        if status == "drilled" and not owned:
            rep.error("[A7] %s 标记 docStatus=drilled 但没有任何 node" % pid)
        if status != "drilled" and owned:
            rep.error("[A7] %s 有 %d 个 node 但 docStatus=%r（应为 drilled）" % (pid, len(owned), status))
        if isinstance(decl_n, int) and decl_n != len(owned):
            rep.warn("[A7] %s 在 structure.json 记 nodeCount=%d，实际 %d" % (pid, decl_n, len(owned)))

    # ---- D1 / D2 / D3 / C5（边） ----
    valid_targets = w.valid_targets
    seen_edge_ids: set[str] = set()
    seen_pair_trigger: dict[tuple[str, str], set[str]] = {}
    for e in w.edges:
        eid = e.get("id", "<no-id>")
        if eid in seen_edge_ids:
            rep.error("[D2] edge id 重复：%s" % eid)
        seen_edge_ids.add(eid)
        for end in ("from", "to"):
            tgt = e.get(end)
            if tgt not in valid_targets:
                rep.error("[D1] %s：%s=%r 既不是 node，也不在 page / modal / shell 中" % (eid, end, tgt))
        ttype = e.get("type")
        if ttype not in VALID_EDGE_TYPE:
            rep.error("[D3] %s：type=%r 不在枚举内" % (eid, ttype))
        status = e.get("status")
        if status not in VALID_EDGE_STATUS:
            rep.error("[D3] %s：status=%r 不在枚举内" % (eid, status))
        else:
            for field in STATUS_REQUIRED[status]:
                v = e.get(field)
                if not v or (isinstance(v, list) and not v):
                    rep.error("[D3] %s：status=%s 必须提供 `%s`" % (eid, status, field))
        for src in as_list(e.get("sources")):
            if not SRC_ITEM_RE.match(src):
                rep.error("[C5] edge %s：sources 格式非法 %r" % (eid, src))
                continue
            _check_src(rep, "edge %s" % eid, src)

        key = (e.get("from", ""), e.get("to", ""))
        trig = str(e.get("trigger", ""))
        seen = seen_pair_trigger.setdefault(key, set())
        if trig in seen:
            rep.error("[D2] 平行边 %s -> %s 的 trigger 重复：%r" % (key[0], key[1], trig))
        seen.add(trig)

    # ---- D4 有去无回（仅对「已实现 + 跨页面跳转」提示；同页跳转有 tab 栏兜底，弹层有关闭按钮） ----
    def owner_page(nid: str) -> str | None:
        if nid in w.nodes:
            return w.nodes[nid].page or None
        if nid in w.pages:
            return nid
        return None  # modal / shell：不是页面，不参与跨页判定

    for e in w.edges:
        if e.get("type") not in NAV_TYPES or e.get("status") != "implemented":
            continue
        frm, to = e.get("from"), e.get("to")
        pf, pt = owner_page(frm), owner_page(to)
        if pf is None or pt is None or pf == pt:
            continue
        back = [x for x in w.edges if x.get("from") == to and x.get("to") == frm]
        if not back:
            rep.warn("[D4] 有去无回：%s（%s）-> %s（%s）无反向入口（确认是否有意为之）" % (frm, pf, to, pt))

    # ---- D5 第 5 节与 edges.json 一致（需先跑 sync-edges） ----
    for nid in w.node_order:
        n = w.nodes[nid]
        if not n.fm:
            continue
        rel = w.rel(n.file)
        if EDGES_BEGIN not in n.text or EDGES_END not in n.text:
            rep.error("[D5] %s：缺少 EDGES 标记区块（%s / %s）" % (rel, EDGES_BEGIN, EDGES_END))
            continue
        current = _extract_edges_block(n.text)
        expected = render_edges_block(w, nid)
        if current.strip() != expected.strip():
            rep.error("[D5] %s：第 5 节与 edges.json 不一致 —— 运行 `python wiki/gen_wiki_tools.py sync-edges`" % rel)

    # ---- E2 issues 分流字段（v0.4）：category / owner 必填且 ∈ 枚举；边若带同名字样也须 ∈ 枚举 ----
    for i in w.issues:
        iid = i.get("id", "<no-id>")
        cat = i.get("category")
        own = i.get("owner")
        if not cat:
            rep.error("[E2] issue %s：缺少 `category`（产品决策 / 技术实现 / 数据口径）" % iid)
        elif cat not in VALID_ISSUE_CATEGORY:
            rep.error("[E2] issue %s：category=%r 不在枚举内" % (iid, cat))
        if not own:
            rep.error("[E2] issue %s：缺少 `owner`（上司拍板 / 工程自决 / 待产品定义）" % iid)
        elif own not in VALID_ISSUE_OWNER:
            rep.error("[E2] issue %s：owner=%r 不在枚举内" % (iid, own))
    for e in w.edges:
        eid = e.get("id", "<no-id>")
        if e.get("category") is not None and e.get("category") not in VALID_ISSUE_CATEGORY:
            rep.error("[E2] edge %s：category=%r 不在枚举内" % (eid, e.get("category")))
        if e.get("owner") is not None and e.get("owner") not in VALID_ISSUE_OWNER:
            rep.error("[E2] edge %s：owner=%r 不在枚举内" % (eid, e.get("owner")))

    # ---- E3 issue 定位与通俗版（v0.9）：where 必须指向已登记实体；plain 若写则须完整 ----
    # 背景：v0.9 前 issues[].where 可以指向画布上不存在的实体（页面自身不是边端点 / 节点无任何连线），
    # 导致 module-map 里点 issue 无声无息（实测 40 条中 15 条不可达）。此处把「可定位」变成契约。
    modal_ids = {m.get("id") for m in structure.get("modals", [])}
    shell_ids = {s.get("id") for s in structure.get("shellComponents", [])}
    ph_ids = {p.get("id") for p in structure.get("placeholders", [])}
    node_ids = set(w.nodes)
    known_prefix = ("page-", "nd-", "modal-", "shell-", "ph-")
    for i in w.issues:
        iid = i.get("id", "<no-id>")
        wh = str(i.get("where", "") or "")
        if not wh:
            rep.error("[E3] issue %s：缺少 `where`（必须指向 page / node / modal / shell）" % iid)
        elif not (wh in pages or wh in node_ids or wh in modal_ids or wh in shell_ids or wh in ph_ids):
            if wh.startswith(known_prefix):
                rep.error("[E3] issue %s：where=%r 不是任何已登记的 page / node / modal / shell" % (iid, wh))
            else:
                rep.warn("[E3] issue %s：where=%r 不是本库实体（按外部引用处理，结构图上无卡片）" % (iid, wh))
        pl = i.get("plain")
        if pl is not None:
            if not isinstance(pl, dict):
                rep.error("[E3] issue %s：plain 必须是对象" % iid)
            else:
                if not pl.get("oneLine"):
                    rep.error("[E3] issue %s：plain 缺 `oneLine`（通俗版至少要有「一句话」）" % iid)
                for k in ("symptom", "impact", "ask"):
                    if not pl.get(k):
                        rep.warn("[E3] issue %s：plain.%s 为空（通俗版四段建议写全）" % (iid, k))

    # ---- E3 glossary.json 术语表（可选真源：只解释、不改原文） ----
    if GLOSSARY_FILE.exists():
        try:
            gdoc = json.loads(GLOSSARY_FILE.read_text(encoding="utf-8"))
        except Exception as exc:  # noqa: BLE001
            rep.error("[E3] glossary.json 解析失败：%s" % exc)
        else:
            seen_terms: set[str] = set()
            for t in gdoc.get("terms", []):
                tm = str(t.get("term", "") or "")
                if not tm:
                    rep.error("[E3] glossary.json：存在缺 term 的条目")
                elif tm in seen_terms:
                    rep.error("[E3] glossary.json：term 重复：%s" % tm)
                else:
                    seen_terms.add(tm)
                if not t.get("plain"):
                    rep.error("[E3] glossary.json：term %s 缺 plain 释义" % (tm or "<空>"))
            rep.stats["术语表条目"] = len(gdoc.get("terms", []))
            rep.stats["带通俗版的 issue"] = sum(1 for i in w.issues if i.get("plain"))

    # ---- E1 缺口汇总（报告区，不阻断） ----
    gaps = [e for e in w.edges if e.get("status") != "implemented"]
    rep.stats["section 数"] = len(sections)
    rep.stats["page 数"] = len(declared)
    rep.stats["已下钻 page"] = sum(1 for p in pages.values() if p.get("docStatus") == "drilled")
    rep.stats["待铺开 page"] = len(pending)
    rep.stats["node 数"] = len(w.nodes)
    rep.stats["edge 数"] = len(w.edges)
    rep.stats["issues 数"] = len(w.issues)
    rep.stats["已实现边"] = len(w.edges) - len(gaps)
    rep.stats["缺口边（非 implemented）"] = len(gaps)
    rep.stats["正文可验证引用（页+节）"] = sum(page_cites.values()) + sum(node_cites.values())
    sev_rank = {"high": 0, "medium": 1, "low": 2}
    gap_lines = [
        "  %s %-46s %-22s severity=%s\n      %s"
        % (
            {"intended": "○", "undefined": "?"}.get(e.get("status", ""), "·"),
            str(e.get("id")),
            "%s → %s" % (e.get("from"), e.get("to")),
            e.get("severity", "n/a"),
            _gap_reason(e),
        )
        for e in sorted(
            gaps, key=lambda x: (sev_rank.get(str(x.get("severity")), 9), str(x.get("id")))
        )
    ]

    print("== validate：%s ==" % WIKI_DIR)
    rep.dump()
    print("\n[GAPS] 缺口 %d 条（○ intended / ? undefined；详情见 wiki/gaps.md）：" % len(gaps))
    for line in gap_lines:
        print(line)
    return 1 if rep.errors else 0


def _check_src(rep: Report, owner: str, item: str) -> None:
    m = SRC_ITEM_RE.match(item)
    if not m:
        return
    lines = read_lines(m.group("path"))
    if lines is None:
        rep.error("[C5] %s：sources 指向的文件不存在 -> %s" % (owner, m.group("path")))
        return
    total = len(lines)
    start = int(m.group("start"))
    end = int(m.group("end") or m.group("start"))
    if start > end:
        rep.error("[C5] %s：%s:%d-%d 区间起止颠倒" % (owner, m.group("path"), start, end))
    if start < 1 or start > total or end < 1 or end > total:
        rep.error(
            "[C5] %s：%s:%d-%d 行号越界（文件共 %d 行）" % (owner, m.group("path"), start, end, total)
        )


def _check_citations(rep: Report, owner: str, cites: list[tuple[str, str, str]]) -> None:
    for path_s, start_s, end_s in cites:
        path_s = path_s.strip()
        lines = read_lines(path_s)
        if lines is None:
            rep.error("[C3] %s：正文引用文件不存在 -> %s" % (owner, path_s))
            continue
        total = len(lines)
        start = int(start_s)
        end = int(end_s) if end_s else start
        if start < 1 or start > total:
            rep.error("[C3] %s：引用行号越界 %s:%d（文件共 %d 行）" % (owner, path_s, start, total))
        if end < 1 or end > total:
            rep.error("[C3] %s：引用行号越界 %s:%d（文件共 %d 行）" % (owner, path_s, end, total))
        if start > end:
            rep.error("[C3] %s：引用区间起止颠倒 %s:%d-%d" % (owner, path_s, start, end))


def _gap_reason(e: dict[str, Any]) -> str:
    if e.get("status") == "undefined":
        return str(e.get("issue", ""))[:120]
    return str(e.get("blockedBy", ""))[:120]


# --------------------------------------------------------------------------
# sync-edges
# --------------------------------------------------------------------------
def _extract_edges_block(text: str) -> str:
    b = text.find(EDGES_BEGIN)
    e = text.find(EDGES_END)
    if b == -1 or e == -1 or e < b:
        return ""
    return text[b: e + len(EDGES_END)]


def _render_edge(w: Wiki, e: dict[str, Any], direction: str) -> str:
    eid = e.get("id", "")
    other = e.get("from") if direction == "in" else e.get("to")
    arrow = "←" if direction == "in" else "→"
    status = e.get("status", "")
    lines = [
        "- **`%s`** %s `%s`（%s）｜`%s` · **%s**%s"
        % (
            eid,
            arrow,
            other,
            w.label(other),
            e.get("type", ""),
            STATUS_LABEL.get(status, status),
            "｜severity: %s" % e.get("severity") if e.get("severity") else "",
        )
    ]
    if e.get("trigger"):
        lines.append("  - 触发：%s" % e["trigger"])
    if e.get("payload"):
        lines.append("  - 载荷：`%s`" % e["payload"])
    if e.get("logic"):
        lines.append("  - 逻辑：%s" % e["logic"])
    if status == "implemented":
        for s in as_list(e.get("sources")):
            lines.append("  - 出处：`%s`" % s)
    if e.get("designRef"):
        lines.append("  - 设计依据：%s" % e["designRef"])
    if e.get("expected"):
        lines.append("  - 期望行为：%s" % e["expected"])
    if e.get("blockedBy"):
        lines.append("  - **卡点**：%s" % e["blockedBy"])
    if e.get("issue"):
        lines.append("  - **待确认**：%s" % e["issue"])
    if e.get("note"):
        lines.append("  - 备注：%s" % e["note"])
    return "\n".join(lines)


def render_edges_block(w: Wiki, nid: str) -> str:
    inc = w.in_edges(nid)
    out = w.out_edges(nid)
    parts = [
        EDGES_BEGIN,
        "> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，"
        "手写会被覆盖。要改边请改边表后重跑该命令。",
        "",
        "**入边 %d 条**" % len(inc),
        "",
    ]
    parts.append("\n".join(_render_edge(w, e, "in") for e in inc) if inc else "（无）")
    parts += ["", "**出边 %d 条**" % len(out), ""]
    parts.append("\n".join(_render_edge(w, e, "out") for e in out) if out else "（无）")
    parts.append(EDGES_END)
    return "\n".join(parts)


def replace_edges_block(text: str, block: str) -> str:
    b = text.find(EDGES_BEGIN)
    e = text.find(EDGES_END)
    if b != -1 and e != -1 and e > b:
        return text[:b] + block + text[e + len(EDGES_END):]
    return text.rstrip("\n") + "\n\n" + block + "\n"


def cmd_sync_edges(args: argparse.Namespace) -> int:
    w = Wiki()
    changed: list[str] = []
    unchanged = 0
    for nid in w.node_order:
        n = w.nodes[nid]
        if not n.fm:
            continue
        block = render_edges_block(w, nid)
        new_text = replace_edges_block(n.text, block)
        if not new_text.endswith("\n"):
            new_text += "\n"
        if new_text != n.text:
            if args.check:
                changed.append(w.rel(n.file))
                continue
            write_text_lf(n.file, new_text)
            changed.append(w.rel(n.file))
        else:
            unchanged += 1

    print("== sync-edges ==")
    if args.check:
        if changed:
            print("  待更新 %d 个 node：" % len(changed))
            for c in changed:
                print("    - %s" % c)
            return 1
        print("  全部 node 第 5 节已与 edges.json 一致（%d 个）" % unchanged)
        return 0
    print("  已更新 %d 个 node，%d 个无需变更" % (len(changed), unchanged))
    for c in changed:
        print("    - %s" % c)
    print("  边 %d 条 · issues %d 条" % (len(w.edges), len(w.issues)))
    return 0


# --------------------------------------------------------------------------
# index
# --------------------------------------------------------------------------
def _one_liner(body: str) -> str:
    chunk = section_body(body, "一句话定位")
    for line in chunk.splitlines():
        s = line.strip()
        if s:
            return re.sub(r"\s+", " ", s)
    return ""


def cmd_index(args: argparse.Namespace) -> int:
    w = Wiki()
    if not w.structure:
        print("[ERROR] structure.json 缺失，无法生成索引", file=sys.stderr)
        return 1
    out: list[str] = []
    out.append("# %s" % w.structure.get("title", "Wiki"))
    out.append("")
    out.append("> %s" % w.structure.get("description", ""))
    out.append(">")
    out.append(
        "> 结构真源 `wiki/structure.json`，边真源 `wiki/edges.json`，"
        "页面 `wiki/pages/<page-id>.md`，节点 `wiki/nodes/<page-id>/<node-id>.md`。"
    )
    out.append(
        "> 行号口径：UTF-8 解码行数（与编辑器显示一致）。"
        "重要度 high / medium / low 用于控制上下文预算 —— 按需加载目标节点 + 其 related_pages / 出入边即可，不必全读。"
    )
    out.append(
        "> 边状态：implemented（代码已实现）｜intended（设计有·代码没有）｜undefined（设计本身未定）。"
        "非 implemented 的边见 `wiki/gaps.md`。"
    )
    out.append("")

    for sec in w.structure.get("sections", []):
        pids = [p for p in sec.get("pages", []) if p in w.pages]
        if not pids:
            continue
        out.append("## %s" % sec.get("title", sec.get("id")))
        out.append("")
        if sec.get("userView"):
            out.append("_%s_" % sec["userView"])
            out.append("")
        for pid in pids:
            page = w.pages[pid]
            rel = "pages/%s.md" % pid
            one = _one_liner(w.page_body.get(pid, "")) or page.get("description", "")
            if len(one) > 200:
                one = one[:197] + "..."
            status = page.get("docStatus", "pending")
            flag = "已下钻" if status == "drilled" else "待铺开"
            out.append(
                "- [%s](%s): %s _(importance: %s · %s)_"
                % (page.get("title", pid), rel, one, page.get("importance", "medium"), flag)
            )
            for nid in w.nodes_of_page(pid):
                n = w.nodes[nid]
                nrel = "nodes/%s/%s.md" % (pid, nid)
                none = _one_liner(n.body)
                if len(none) > 160:
                    none = none[:157] + "..."
                out.append(
                    "  - [%s](%s) `%s`: %s _(%s · %s)_"
                    % (
                        n.fm.get("title", nid),
                        nrel,
                        nid,
                        none,
                        n.fm.get("kind", ""),
                        n.fm.get("importance", "medium"),
                    )
                )
        out.append("")

    out.append("## 使用约定")
    out.append("")
    out.append(
        "- 改代码前：先读目标节点页 + 其所在页面页 + 边的对端节点（防联动漏改）；"
        "页面「规则与边界」节与节点「规则与边界」节是开发硬约束。"
    )
    out.append("- 「事实」节每条均带行号引用；与代码不一致时**以代码为准并回写**，再重跑校验。")
    out.append(
        "- 校验与重建：`python wiki/gen_wiki_tools.py validate|sync-edges|index|map|gaps`。"
    )
    out.append("")

    write_text_lf(LLMS_TXT, "\n".join(out))
    n_nodes = len(w.nodes)
    print("== index ==")
    print("  已生成：%s" % LLMS_TXT)
    print(
        "  section %d · page %d（已下钻 %d）· node %d"
        % (
            len(w.structure.get("sections", [])),
            len(w.pages),
            sum(1 for p in w.pages.values() if p.get("docStatus") == "drilled"),
            n_nodes,
        )
    )
    return 0


# --------------------------------------------------------------------------
# map
# --------------------------------------------------------------------------
def cmd_map(args: argparse.Namespace) -> int:
    """生成结构图。HTML 模板与图布局由同目录 build_map.py 承担（单一模板源）。"""
    sys.path.insert(0, str(WIKI_DIR))
    try:
        import build_map  # type: ignore
    except Exception as exc:  # noqa: BLE001
        print("[ERROR] 无法导入 build_map.py：%s" % exc, file=sys.stderr)
        return 1
    if not hasattr(build_map, "main"):
        print("[ERROR] build_map.py 未提供 main()", file=sys.stderr)
        return 1
    return build_map.main()


# --------------------------------------------------------------------------
# gaps
# --------------------------------------------------------------------------
def cmd_gaps(args: argparse.Namespace) -> int:
    w = Wiki()
    gaps = [e for e in w.edges if e.get("status") != "implemented"]
    undefined = [e for e in gaps if e.get("status") == "undefined"]
    intended = [e for e in gaps if e.get("status") == "intended"]
    sev_rank = {"high": 0, "medium": 1, "low": 2}
    intended.sort(key=lambda e: (sev_rank.get(str(e.get("severity")), 9), str(e.get("id"))))
    undefined.sort(key=lambda e: (sev_rank.get(str(e.get("severity")), 9), str(e.get("id"))))

    out: list[str] = []
    out.append("# 缺口清单（gaps）")
    out.append("")
    out.append("> 由 `python wiki/gen_wiki_tools.py gaps` 从 `wiki/edges.json` 生成，**勿手改**。")
    out.append(
        "> 口径：只收 `status != implemented` 的边，外加 `edges.json` 的 `issues`。"
        "`intended` = 设计说要做、代码没做；`undefined` = 设计本身也没定，需产品拍板。"
        "其中 `category = 产品决策` 的条目另由本命令分流生成 `wiki/decisions.md`《待拍板清单》。"
    )
    out.append(">")
    out.append(
        "> 统计：边 %d 条（已实现 %d · intended %d · undefined %d）· issues %d 条。"
        % (len(w.edges), len(w.edges) - len(gaps), len(intended), len(undefined), len(w.issues))
    )
    out.append("")

    def edge_row(e: dict[str, Any]) -> str:
        frm, to = e.get("from"), e.get("to")
        reason = e.get("blockedBy") or e.get("issue") or ""
        return (
            "| `%s` | %s → %s | `%s` | %s | %s |"
            % (
                e.get("id"),
                w.label(frm),
                w.label(to),
                e.get("type", ""),
                e.get("severity", ""),
                reason.replace("|", "\\|"),
            )
        )

    if intended:
        out.append("## intended（设计有·未实现）")
        out.append("")
        out.append("| 边 | 走向 | type | severity | 卡点 |")
        out.append("|---|---|---|---|---|")
        for e in intended:
            out.append(edge_row(e))
        out.append("")

    if undefined:
        out.append("## undefined（待产品拍板）")
        out.append("")
        out.append("| 边 | 走向 | type | severity | 待确认问题 |")
        out.append("|---|---|---|---|---|")
        for e in undefined:
            out.append(edge_row(e))
        out.append("")

    if w.issues:
        out.append("## issues（节点内缺口，未落成边）")
        out.append("")
        out.append("| id | 位置 | 状态 | severity | 问题 | 一句话（通俗版） | 卡点 |")
        out.append("|---|---|---|---|---|---|---|")
        for i in sorted(w.issues, key=lambda x: (sev_rank.get(str(x.get("severity")), 9), str(x.get("id")))):
            out.append(
                "| `%s` | %s | %s | %s | %s | %s | %s |"
                % (
                    i.get("id"),
                    w.label(i.get("where", "")),
                    i.get("status", ""),
                    i.get("severity", ""),
                    str(i.get("title", "")).replace("|", "\\|"),
                    str((i.get("plain") or {}).get("oneLine", "")).replace("|", "\\|"),
                    str(i.get("blockedBy", "")).replace("|", "\\|"),
                )
            )
        out.append("")

    # ---- 根因聚合：找出写了同一根因的缺口（blockedBy 完全一致） ----
    by_cause: dict[str, list[str]] = {}
    for e in gaps:
        cause = str(e.get("blockedBy") or "")
        if cause:
            by_cause.setdefault(cause, []).append(str(e.get("id")))
    shared = {c: ids for c, ids in by_cause.items() if len(ids) > 1}
    if shared:
        out.append("## 同一根因的多条缺口")
        out.append("")
        for cause, ids in shared.items():
            out.append("- %s：`%s`" % ("、".join("`%s`" % i for i in ids), cause))
        out.append("")

    # ---- 逐条详情 ----
    out.append("## 逐条详情")
    out.append("")
    for e in intended + undefined:
        frm, to = e.get("from"), e.get("to")
        out.append("### `%s`" % e.get("id"))
        out.append("")
        out.append(
            "- 走向：**%s**（`%s`）→ **%s**（`%s`）｜type `%s`｜status **%s**｜severity %s"
            % (
                w.label(frm),
                frm,
                w.label(to),
                to,
                e.get("type", ""),
                e.get("status", ""),
                e.get("severity", "n/a"),
            )
        )
        if e.get("trigger"):
            out.append("- 触发：%s" % e["trigger"])
        if e.get("expected"):
            out.append("- 期望行为：%s" % e["expected"])
        if e.get("designRef"):
            out.append("- 设计依据：%s" % e["designRef"])
        if e.get("blockedBy"):
            out.append("- **卡点**：%s" % e["blockedBy"])
        if e.get("issue"):
            out.append("- **待确认**：%s" % e["issue"])
        srcs = as_list(e.get("sources"))
        if srcs:
            out.append("- 出处：%s" % "、".join("`%s`" % s for s in srcs))
        out.append("")

    write_text_lf(GAPS_MD, "\n".join(out))

    # ---- decisions.md《待拍板清单》（v0.4）：只收 category=产品决策 的条目 ----
    n_dec = _write_decisions(w, sev_rank)

    print("== gaps ==")
    print("  已生成：%s" % GAPS_MD)
    print("  已生成：%s（待拍板条目 %d 条）" % (DECISIONS_MD, n_dec))
    print(
        "  缺口边 %d 条（intended %d / undefined %d）· issues %d 条"
        % (len(gaps), len(intended), len(undefined), len(w.issues))
    )
    return 0


def _write_decisions(w: Wiki, sev_rank: dict[str, int]) -> int:
    """生成 wiki/decisions.md《待拍板清单》：只收 category=产品决策 的 issues 与边。"""
    entries: list[dict[str, Any]] = []
    for i in w.issues:
        if i.get("category") != "产品决策":
            continue
        entries.append({
            "id": str(i.get("id")),
            "kind": "issue",
            "title": str(i.get("title", "")),
            "where": "%s（`%s`）" % (w.label(str(i.get("where", ""))), i.get("where", "")),
            "owner": str(i.get("owner", "")),
            "severity": str(i.get("severity", "")),
            "background": str(i.get("detail", "")),
            "suggestion": str(i.get("expected") or i.get("issue") or ""),
            "blockedBy": str(i.get("blockedBy", "")),
            "plain": i.get("plain") if isinstance(i.get("plain"), dict) else {},
        })
    for e in w.edges:
        if e.get("category") != "产品决策":
            continue
        frm, to = str(e.get("from")), str(e.get("to"))
        entries.append({
            "id": str(e.get("id")),
            "kind": "边",
            "title": str(e.get("trigger", "")),
            "where": "%s（`%s`）→ %s（`%s`）" % (w.label(frm), frm, w.label(to), to),
            "owner": str(e.get("owner", "")),
            "severity": str(e.get("severity", "")),
            "background": str(e.get("logic", "")),
            "suggestion": str(e.get("issue") or e.get("expected") or ""),
            "blockedBy": str(e.get("blockedBy", "")),
            "plain": {},
        })
    entries.sort(key=lambda x: (sev_rank.get(x["severity"], 9), x["id"]))

    owner_count: dict[str, int] = {}
    for x in entries:
        owner_count[x["owner"]] = owner_count.get(x["owner"], 0) + 1

    out: list[str] = []
    out.append("# 待拍板清单（产品决策分流）")
    out.append("")
    out.append("> 由 `python wiki/gen_wiki_tools.py gaps` 从 `wiki/edges.json` 生成，**勿手改**。")
    out.append(
        "> 口径：只收 `category = 产品决策` 的条目（issues[] 与带该标记的边），"
        "按 severity 排序（high → medium → low）；技术实现 / 数据口径类问题不混入本清单，见 `wiki/gaps.md`。"
    )
    out.append(
        "> 交付节奏（2026-09-14 用户拍板）：批 1~3 全部铺开后**一次性全量交付**上司对齐，不逐批打扰。"
        "owner=工程自决 的条目为已定规则登记，列此供知悉，无需上司决策。"
    )
    out.append(
        "> 可读性（v0.9）：逐条详情先给**通俗版**（一句话 / 现象 / 影响 / 需要谁做什么，取自 `edges.json` 的 `plain` 字段），"
        "再附一字未改的「背景（原始记录）」供工程侧核对。"
    )
    out.append(">")
    out.append(
        "> 统计：共 %d 条（%s）。"
        % (len(entries), " · ".join("%s %d" % (k, v) for k, v in sorted(owner_count.items())) or "无")
    )
    out.append("")

    out.append("## 汇总表")
    out.append("")
    out.append("| # | 条目 | 位置 / 走向 | owner | severity |")
    out.append("|---|---|---|---|---|")
    for n, x in enumerate(entries, 1):
        out.append(
            "| %d | %s（`%s`） | %s | %s | %s |"
            % (n, x["title"].replace("|", "\\|"), x["id"], x["where"], x["owner"], x["severity"])
        )
    out.append("")

    out.append("## 逐条详情")
    out.append("")
    for n, x in enumerate(entries, 1):
        out.append("### %d. %s" % (n, x["title"]))
        out.append("")
        out.append("- 来源：`%s`（%s）｜位置：%s" % (x["id"], x["kind"], x["where"]))
        out.append("- owner：**%s**｜severity：**%s**" % (x["owner"], x["severity"]))
        pl = x.get("plain") or {}
        if pl.get("oneLine"):
            out.append("- **一句话（通俗版）**：%s" % pl["oneLine"])
            if pl.get("symptom"):
                out.append("- **现象**：%s" % pl["symptom"])
            if pl.get("impact"):
                out.append("- **影响**：%s" % pl["impact"])
            if pl.get("ask"):
                out.append("- **需要谁做什么**：%s" % pl["ask"])
        if x["background"]:
            out.append("- **背景（原始记录）**：%s" % x["background"])
        if x["suggestion"]:
            out.append("- **建议 / 期望**：%s" % x["suggestion"])
        if x["blockedBy"]:
            out.append("- **卡点**：%s" % x["blockedBy"])
        out.append("")

    write_text_lf(DECISIONS_MD, "\n".join(out))
    return len(entries)


# --------------------------------------------------------------------------
# 入口
# --------------------------------------------------------------------------
def main() -> int:
    parser = argparse.ArgumentParser(
        prog="gen_wiki_tools.py",
        description="LLM Wiki 工具链：validate / sync-edges / index / map / gaps",
    )
    sub = parser.add_subparsers(dest="cmd", required=True)

    p = sub.add_parser("validate", help="校验 structure / pages / nodes / edges 一致性")
    p.set_defaults(func=cmd_validate)

    p = sub.add_parser("sync-edges", help="把 edges.json 渲染进各 node 的第 5 节（出入边）")
    p.add_argument("--check", action="store_true", help="只检查是否有待更新，不写文件（有差异则退出码 1）")
    p.set_defaults(func=cmd_sync_edges)

    p = sub.add_parser("index", help="生成 wiki/llms.txt（含 node 清单）")
    p.set_defaults(func=cmd_index)

    p = sub.add_parser("map", help="生成 wiki/module-map.html + wiki/site/index.html")
    p.set_defaults(func=cmd_map)

    p = sub.add_parser("gaps", help="汇总非 implemented 边与 issues → wiki/gaps.md")
    p.set_defaults(func=cmd_gaps)

    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
