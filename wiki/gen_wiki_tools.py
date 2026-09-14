#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""LLM Wiki 工具链（shuangchuang-design-main）

三个子命令（仅依赖标准库）：

    python wiki/gen_wiki_tools.py validate   # 校验 wiki/pages/*.md 与代码真源的一致性
    python wiki/gen_wiki_tools.py index      # 生成 wiki/llms.txt（llms.txt v2 格式）
    python wiki/gen_wiki_tools.py map        # 生成 wiki/model-map.html（结构建模可视化，自包含单页）

可视化（map）说明
-----------------
输入：wiki/structure.json + wiki/pages/*.md（不引入任何外部依赖或 CDN）
输出：wiki/model-map.html —— 单文件、离线可用、可直接分发
内容：① 关键指标条 ② 分区×页面邻接结构图（SVG，可点击下钻）
      ③ 页面详情面板（五节齐备 / 引用统计 / sources / related_pages）
      ④ 20 页总表
定位：用于展示结构建模成果与自查结构是否正确；不含任何“问题标注”，只呈现结构与覆盖。

校验规则（validate）
--------------------
A. 结构层
   A1 structure.json 存在且可解析；pages[].id 唯一
   A2 sections[].pages 引用的 id 必须都在 pages[] 中定义
   A3 pages[] 中每页都有对应的 pages/<id>.md（覆盖率 100%）
   A4 pages/ 下不存在游离的 page-*.md（未在 structure.json 登记）

B. frontmatter 完整性（每页必填）
   id / title / section / importance / sources / related_pages
   - id 必须等于文件名
   - section 必须是 structure.json 的 sections[].id
   - importance ∈ {high, medium, low}
   - sources 非空且列出的文件必须真实存在
   - related_pages 每一项都必须是已登记的 page id（且不得自引用）

C. 正文引用可验证性（本 wiki 的核心价值）
   C1 五节齐备：一句话定位 / 事实 / 规则与边界 / 常见开发任务 / 与 related_pages 的联动提示
   C2 正文至少 MIN_SOURCES 条 `Sources: [path:line]()` 引用（防空壳页）
   C3 每条引用：路径存在（相对仓库根）、行号为 1..文件总行数、区间 start <= end
   C4 行号口径 = UTF-8 解码行数，与编辑器显示一致
      （Python: len(Path(p).read_text(encoding='utf-8').splitlines())）

D. 联动一致性（警告级，不阻断）
   D1 structure.json 里 declared related_pages 与页面 frontmatter 是否一致
   D2 页面 A 指向 B 但 B 未回指 A（邻接不对称，提示人工确认）

退出码：有 error 时返回 1，否则 0。
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

# --------------------------------------------------------------------------
# 常量：与 wiki 契约绑定，改这里即改契约
# --------------------------------------------------------------------------
REPO_ROOT = Path(__file__).resolve().parent.parent
WIKI_DIR = REPO_ROOT / "wiki"
PAGES_DIR = WIKI_DIR / "pages"
STRUCTURE_FILE = WIKI_DIR / "structure.json"
LLMS_TXT = WIKI_DIR / "llms.txt"
MODEL_MAP = WIKI_DIR / "model-map.html"
# 可直接发布的静态站点目录：只放 index.html，便于一键发布为在线链接（入口落在 /）
SITE_DIR = WIKI_DIR / "site"
SITE_INDEX = SITE_DIR / "index.html"

REQUIRED_FRONTMATTER = ["id", "title", "section", "importance", "sources", "related_pages"]
VALID_IMPORTANCE = {"high", "medium", "low"}
MIN_SOURCES = 5

# 五节标题（按顺序出现在正文中）
REQUIRED_SECTIONS = [
    "一句话定位",
    "事实",
    "规则与边界",
    "常见开发任务",
    "与 related_pages 的联动提示",
]

# 正文内联引用：Sources: [path:line]() 或 Sources: [path:start-end]()
CITATION_RE = re.compile(r"Sources:\s*\[([^\[\]]+?):(\d+)(?:\s*-\s*(\d+))?\]\(\)")

# frontmatter 解析用（仅支持本 wiki 使用的简单 YAML 子集）
FM_RE = re.compile(r"\A---\r?\n(.*?)\r?\n---\r?\n", re.DOTALL)


# --------------------------------------------------------------------------
# 基础设施
# --------------------------------------------------------------------------
class Report:
    """收集校验结果并按级别输出。"""

    def __init__(self) -> None:
        self.errors: list[str] = []
        self.warnings: list[str] = []
        self.stats: dict[str, int] = {}

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


def read_lines(rel_path: str) -> list[str] | None:
    """按 UTF-8 口径读取文件行；文件不存在返回 None。

    行号口径与编辑器一致：本仓全部源文件为 LF + 无 BOM + 末尾带换行，
    故 splitlines() 的长度 == 编辑器最后一行行号。
    """
    p = REPO_ROOT / rel_path
    if not p.is_file():
        return None
    try:
        return p.read_text(encoding="utf-8").splitlines()
    except UnicodeDecodeError:
        return None


def parse_frontmatter(text: str) -> tuple[dict, str] | None:
    """极简 YAML 子集解析：支持 `key: value` 与 `key:` 后接 `  - item` 列表。"""
    m = FM_RE.match(text)
    if not m:
        return None
    data: dict = {}
    current_key: str | None = None
    for raw in m.group(1).splitlines():
        if not raw.strip() or raw.lstrip().startswith("#"):
            continue
        if raw.startswith("  - ") or raw.startswith("- "):
            if current_key is None:
                continue
            data.setdefault(current_key, [])
            if not isinstance(data[current_key], list):
                data[current_key] = [data[current_key]]
            data[current_key].append(raw.strip()[2:].strip().strip("'\""))
            continue
        if ":" in raw:
            key, _, val = raw.partition(":")
            key = key.strip()
            val = val.strip()
            current_key = key
            if val.startswith("[") and val.endswith("]"):
                inner = val[1:-1].strip()
                data[key] = [x.strip().strip("'\"") for x in inner.split(",") if x.strip()] if inner else []
            elif val:
                data[key] = val.strip("'\"")
            else:
                data[key] = []
    return data, text[m.end():]


def section_body(body: str, heading: str) -> str:
    """取出 `## <heading>` 到下一个 `## ` 之间的正文。

    heading 用**前缀匹配**：本 wiki 的小节标题带补充说明（如 `## 事实（每条强制可回溯）`），
    因此不能要求标题后紧跟行尾。
    """
    pattern = re.compile(r"^##[ \t]+" + re.escape(heading) + r".*$", re.MULTILINE)
    m = pattern.search(body)
    if not m:
        return ""
    rest = body[m.end():]
    nxt = re.search(r"^##[ \t]+", rest, re.MULTILINE)
    return rest[: nxt.start()] if nxt else rest


# --------------------------------------------------------------------------
# validate
# --------------------------------------------------------------------------
def cmd_validate(args: argparse.Namespace) -> int:
    rep = Report()

    # ---------- A. 结构层 ----------
    if not STRUCTURE_FILE.is_file():
        rep.error("structure.json 缺失：%s" % STRUCTURE_FILE)
        rep.dump()
        return 1
    structure = json.loads(STRUCTURE_FILE.read_text(encoding="utf-8"))

    pages = structure.get("pages", [])
    sections = structure.get("sections", [])

    declared_ids = [p.get("id") for p in pages]
    dup = {i for i in declared_ids if declared_ids.count(i) > 1}
    if dup:
        rep.error("structure.json pages[].id 重复：%s" % sorted(dup))
    declared_set = set(declared_ids)
    rep.stats["structure 登记页数"] = len(declared_ids)

    section_ids = {s.get("id") for s in sections}
    for s in sections:
        for pid in s.get("pages", []):
            if pid not in declared_set:
                rep.error("section %s 引用了未定义的 page id：%s" % (s.get("id"), pid))

    # ---------- 逐页校验 ----------
    fm_index: dict[str, dict] = {}
    cited_files: set[str] = set()
    total_cites = 0

    for page in pages:
        pid = page.get("id")
        rel = "wiki/pages/%s.md" % pid
        f = REPO_ROOT / rel
        if not f.is_file():
            rep.error("页面缺失：%s" % rel)
            continue

        text = f.read_text(encoding="utf-8")
        parsed = parse_frontmatter(text)
        if parsed is None:
            rep.error("%s：缺少 frontmatter（--- ... ---）" % rel)
            continue
        fm, body = parsed
        fm_index[pid] = fm

        # B. frontmatter 完整性
        for key in REQUIRED_FRONTMATTER:
            if key not in fm or fm[key] in ("", None, []):
                rep.error("%s：frontmatter 缺少 `%s`" % (rel, key))

        if fm.get("id") != pid:
            rep.error("%s：frontmatter id(%r) 与文件名(%r) 不一致" % (rel, fm.get("id"), pid))
        if fm.get("section") not in section_ids:
            rep.error("%s：section(%r) 不在 structure.json sections 中" % (rel, fm.get("section")))
        if fm.get("importance") not in VALID_IMPORTANCE:
            rep.error("%s：importance(%r) 必须是 %s 之一" % (rel, fm.get("importance"), sorted(VALID_IMPORTANCE)))

        srcs = fm.get("sources") or []
        if not isinstance(srcs, list) or not srcs:
            rep.error("%s：sources 必须是非空列表" % rel)
        else:
            for s in srcs:
                if read_lines(s) is None:
                    rep.error("%s：sources 列出的文件不存在 -> %s" % (rel, s))

        rel_pages = fm.get("related_pages") or []
        if not isinstance(rel_pages, list) or not rel_pages:
            rep.error("%s：related_pages 必须是非空列表" % rel)
        else:
            for rp in rel_pages:
                if rp not in declared_set:
                    rep.error("%s：related_pages 指向未登记的 page -> %s" % (rel, rp))
                if rp == pid:
                    rep.error("%s：related_pages 不应自引用" % rel)

        # C1. 五节齐备
        for name in REQUIRED_SECTIONS:
            if not re.search(r"^##\s+" + re.escape(name), body, re.MULTILINE):
                rep.error("%s：正文缺少必备小节 `## %s`" % (rel, name))

        # C2/C3. 内联引用
        cites = CITATION_RE.findall(body)
        total_cites += len(cites)
        if len(cites) < MIN_SOURCES:
            rep.error("%s：可用 Sources 引用仅 %d 条，低于下限 %d" % (rel, len(cites), MIN_SOURCES))
        for path_s, start_s, end_s in cites:
            path_s = path_s.strip()
            cited_files.add(path_s)
            lines = read_lines(path_s)
            if lines is None:
                rep.error("%s：引用文件不存在 -> %s" % (rel, path_s))
                continue
            total = len(lines)
            start = int(start_s)
            end = int(end_s) if end_s else start
            if start < 1 or start > total:
                rep.error("%s：引用行号越界 %s:%d（文件共 %d 行）" % (rel, path_s, start, total))
            if end < 1 or end > total:
                rep.error("%s：引用行号越界 %s:%d（文件共 %d 行）" % (rel, path_s, end, total))
            if start > end:
                rep.error("%s：引用区间起止颠倒 %s:%d-%d" % (rel, path_s, start, end))

    # A4. 游离页面
    if PAGES_DIR.is_dir():
        for f in sorted(PAGES_DIR.glob("*.md")):
            if f.stem.startswith("page-") and f.stem not in declared_set:
                rep.error("游离页面（未在 structure.json 登记）：wiki/pages/%s" % f.name)

    rep.stats["已生成页面数"] = len(fm_index)
    rep.stats["正文引用条数（出现次数）"] = total_cites
    rep.stats["正文引用去重源文件数"] = len(cited_files)

    # ---------- D. 联动一致性（警告级） ----------
    declared_related: dict[str, set] = {}
    for page in pages:
        declared_related.setdefault(page.get("id"), set(page.get("related_pages", [])))
    for pid, fm in fm_index.items():
        fm_rel = set(fm.get("related_pages") or [])
        dec_rel = declared_related.get(pid, set())
        if fm_rel != dec_rel:
            rep.warn(
                "structure.json 与页面 frontmatter 的 related_pages 不一致 %s："
                "structure=%s page=%s" % (pid, sorted(dec_rel), sorted(fm_rel))
            )
    for pid, fm in fm_index.items():
        for rp in set(fm.get("related_pages") or []):
            back = set((fm_index.get(rp) or {}).get("related_pages") or [])
            if pid not in back:
                rep.warn("邻接不对称：%s -> %s 但 %s 未回指（确认是否有意为之）" % (pid, rp, rp))

    print("== validate：%s ==" % WIKI_DIR)
    rep.dump()
    return 1 if rep.errors else 0


# --------------------------------------------------------------------------
# index
# --------------------------------------------------------------------------
def cmd_index(args: argparse.Namespace) -> int:
    if not STRUCTURE_FILE.is_file():
        print("[ERROR] structure.json 缺失，无法生成索引", file=sys.stderr)
        return 1
    structure = json.loads(STRUCTURE_FILE.read_text(encoding="utf-8"))
    pages = structure.get("pages", [])
    sections = structure.get("sections", [])
    by_id = {p.get("id"): p for p in pages}

    out: list[str] = []
    out.append("# %s" % structure.get("title", "Wiki"))
    out.append("")
    out.append("> %s" % structure.get("description", ""))
    out.append(">")
    out.append(
        "> 读法：结构真源在 `structure.json`，页面在 `pages/<page_id>.md`；"
        "每页「事实」节每条均带 `Sources: [路径:行号]()`，可回代码逐条核对。"
    )
    out.append(
        "> 行号口径：UTF-8 解码行数（与编辑器显示一致）。"
        "重要度 high / medium / low 用于控制上下文预算 —— 按需加载目标页 + 其 related_pages 即可，不必全读。"
    )
    out.append("")

    for sec in sections:
        ids = [i for i in sec.get("pages", []) if i in by_id]
        if not ids:
            continue
        out.append("## %s" % sec.get("title", sec.get("id")))
        out.append("")
        for pid in ids:
            page = by_id[pid]
            rel = "pages/%s.md" % pid
            one_liner = _extract_one_liner(pid) or page.get("description", "")
            one_liner = re.sub(r"\s+", " ", one_liner).strip()
            if len(one_liner) > 160:
                one_liner = one_liner[:157] + "..."
            out.append(
                "- [%s](%s): %s _(importance: %s)_"
                % (page.get("title", pid), rel, one_liner, page.get("importance", "medium"))
            )
        out.append("")

    out.append("## 使用约定")
    out.append("")
    out.append(
        "- 改代码前：先读目标模块页 + 其 `related_pages`（邻接页用于防联动漏改），"
        "页面「规则与边界」节是开发硬约束。"
    )
    out.append(
        "- 页面「事实」节每条均带行号引用，与代码不一致时**以代码为准并回写页面**。"
    )
    out.append("- 校验与重建：`python wiki/gen_wiki_tools.py validate` / `index`。")
    out.append("")

    LLMS_TXT.write_text("\n".join(out), encoding="utf-8")
    print("== index ==")
    print("  已生成：%s" % LLMS_TXT)
    print("  章节数：%d，页面数：%d" % (len(sections), len(by_id)))
    return 0


def _extract_one_liner(pid: str) -> str:
    """从页面「## 一句话定位」节提取一句话，用于 llms.txt 摘要。"""
    f = PAGES_DIR / ("%s.md" % pid)
    if not f.is_file():
        return ""
    text = f.read_text(encoding="utf-8")
    parsed = parse_frontmatter(text)
    body = parsed[1] if parsed else text
    chunk = section_body(body, "一句话定位")
    for line in chunk.splitlines():
        s = line.strip()
        if s:
            return s
    return ""


HTML_TEMPLATE = r"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>结构建模图 · 双创赛事智能体 demo Wiki</title>
<style>
:root{
  --bg:#f4f6fa; --card:#ffffff; --line:#e4e9f0; --soft:#eef2f7;
  --ink:#0f172a; --ink2:#334155; --muted:#64748b; --muted2:#94a3b8;
  --brand:#4f46e5; --brand2:#0284c7;
  --high:#4f46e5; --medium:#0891b2; --low:#94a3b8;
}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);
  font:14px/1.65 "PingFang SC","Hiragino Sans GB","Microsoft YaHei","Segoe UI",system-ui,sans-serif;
  -webkit-font-smoothing:antialiased}
.wrap{max-width:1660px;margin:0 auto;padding:30px 26px 64px}
.card{background:var(--card);border:1px solid var(--line);border-radius:16px;
  box-shadow:0 1px 2px rgba(15,23,42,.04);margin-bottom:20px}
.card-h{display:flex;align-items:baseline;justify-content:space-between;gap:16px;
  padding:16px 22px 12px;border-bottom:1px solid var(--soft);flex-wrap:wrap}
.card-h h2{margin:0;font-size:15px;font-weight:700;letter-spacing:.2px}
.card-h .hint{font-size:12px;color:var(--muted2)}
.card-b{padding:20px 22px}

/* header */
header.top{margin-bottom:22px}
.eyebrow{display:inline-flex;align-items:center;gap:8px;font-size:11.5px;font-weight:700;
  letter-spacing:.6px;color:var(--brand);background:#eef2ff;border:1px solid #dfe3ff;
  padding:4px 11px;border-radius:999px;text-transform:uppercase}
header.top h1{margin:14px 0 6px;font-size:27px;line-height:1.3;letter-spacing:-.4px}
header.top p.sub{margin:0;color:var(--muted);font-size:13.5px;max-width:1040px}
.kpis{display:flex;flex-wrap:wrap;gap:12px;margin-top:20px}
.kpi{flex:1 1 168px;background:#fff;border:1px solid var(--line);border-radius:14px;
  padding:13px 16px;box-shadow:0 1px 2px rgba(15,23,42,.04)}
.kpi .n{font-size:24px;font-weight:750;letter-spacing:-.5px;line-height:1.15;font-variant-numeric:tabular-nums}
.kpi .l{font-size:11.5px;color:var(--muted);margin-top:3px}
.kpi.k-brand .n{color:var(--brand)} .kpi.k-brand2 .n{color:var(--brand2)}
.kpi.k-high .n{color:var(--high)} .kpi.k-mid .n{color:var(--medium)}

/* graph */
.svgwrap{padding:14px 10px 6px;overflow-x:auto}
svg#graph{display:block;width:100%;height:auto;min-width:1180px}
.legend{display:flex;flex-wrap:wrap;gap:20px;padding:6px 22px 18px;font-size:12px;color:var(--muted)}
.legend b{color:var(--ink2);font-weight:600}
.lg{display:inline-flex;align-items:center;gap:7px}
.dot{width:9px;height:9px;border-radius:50%;display:inline-block}
.node{cursor:pointer}
.node .box{fill:#fff;stroke:#dfe5ee;stroke-width:1.2;transition:fill .12s,stroke .12s}
.node:hover .box{fill:#f7f9ff;stroke:#c7d2fe}
.node .lbl{font-size:11px;fill:#1e293b;font-weight:600}
.node.sel .box{fill:#eef2ff;stroke:#4f46e5;stroke-width:2}
.node.sel .lbl{fill:#3730a3}
.node.rel .box{fill:#f0f9ff;stroke:#38bdf8;stroke-width:1.6}
.edge{fill:none;stroke:#aab8cf;stroke-width:1.3;transition:stroke .12s,stroke-width .12s}
.edge.on{stroke:#4f46e5;stroke-width:2.2}
.edge.dim{stroke:#e8eef6;stroke-width:1}
.secbg{fill:#f7f9fc;stroke:#e9eff7;stroke-width:1;rx:12}
.sechdr{font-size:11.5px;font-weight:700;fill:#3f4d63}
.secline{stroke:#dfe7f1;stroke-width:1}
h3.sec{font-size:11.5px;font-weight:700;color:var(--muted2);letter-spacing:.7px;margin:0}

/* grid */
.grid2{display:grid;grid-template-columns:minmax(0,1.55fr) minmax(0,1fr);gap:20px;align-items:start}
@media (max-width:1180px){.grid2{grid-template-columns:minmax(0,1fr)}}

/* detail */
.d-title{display:flex;align-items:flex-start;gap:12px;flex-wrap:wrap}
.d-title h2{margin:0;font-size:19px;letter-spacing:-.2px}
.badge{font-size:11px;font-weight:700;padding:3px 9px;border-radius:999px;white-space:nowrap}
.b-high{background:#eef2ff;color:#4338ca;border:1px solid #dfe3ff}
.b-medium{background:#ecfeff;color:#0e7490;border:1px solid #cffafe}
.b-low{background:#f1f5f9;color:#64748b;border:1px solid #e2e8f0}
.b-sec{background:#f8fafc;color:#475569;border:1px solid #e8edf4;font-family:ui-monospace,Menlo,monospace;font-weight:600}
.meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}
.oneliner{margin:14px 0 0;padding:12px 15px;background:#f8fafc;border:1px solid var(--soft);
  border-left:3px solid var(--brand);border-radius:10px;color:var(--ink2);font-size:13.5px}
.subh{font-size:11.5px;font-weight:700;color:var(--muted2);letter-spacing:.7px;
  margin:20px 0 9px;padding-bottom:6px;border-bottom:1px solid var(--soft)}
.chk{display:flex;flex-wrap:wrap;gap:8px}
.chk span{font-size:12px;padding:4px 10px;border-radius:8px;background:#ecfdf5;
  color:#047857;border:1px solid #d1fae5;font-weight:600}
.chips{display:flex;flex-wrap:wrap;gap:8px}
.chip{font-size:12px;padding:5px 11px;border-radius:9px;background:#f8fafc;
  border:1px solid var(--line);color:var(--ink2);cursor:pointer;transition:all .12s}
.chip:hover{background:#eef2ff;border-color:#c7d2fe;color:#3730a3}
.srclist{max-height:216px;overflow:auto;border:1px solid var(--soft);border-radius:10px;background:#fcfdfe}
.srclist div{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:11.5px;color:#475569;
  padding:5px 12px;border-bottom:1px solid #f1f5f9}
.srclist div:last-child{border-bottom:0}
.nums{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:12px}
.nums div{background:#f8fafc;border:1px solid var(--soft);border-radius:10px;padding:10px 12px}
.nums .n{font-size:19px;font-weight:750;font-variant-numeric:tabular-nums}
.nums .l{font-size:11px;color:var(--muted)}

/* stats bars */
.bar{margin-bottom:11px}
.bar .lbl{display:flex;justify-content:space-between;font-size:12px;color:var(--ink2);margin-bottom:4px}
.bar .lbl span:last-child{color:var(--muted);font-variant-numeric:tabular-nums}
.bar .t{height:7px;background:#f1f5f9;border-radius:999px;overflow:hidden}
.bar .f{height:100%;border-radius:999px;background:linear-gradient(90deg,#6366f1,#0ea5e9)}
.bar.mono .lbl span:first-child{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:11px}

/* table */
table{width:100%;border-collapse:collapse;font-size:13px}
thead th{position:sticky;top:0;background:#fafbfd;text-align:left;font-size:11.5px;font-weight:700;
  color:var(--muted);letter-spacing:.4px;padding:11px 14px;border-bottom:1px solid var(--line);white-space:nowrap}
tbody td{padding:10px 14px;border-bottom:1px solid var(--soft);vertical-align:middle}
tbody tr{cursor:pointer;transition:background .1s}
tbody tr:hover{background:#f8fafc}
tbody tr.sel{background:#eef2ff}
td.id{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:11.5px;color:var(--muted)}
td.n{font-variant-numeric:tabular-nums;color:var(--ink2)}
.tblwrap{overflow:auto;max-height:660px}
footer{margin-top:26px;color:var(--muted2);font-size:12px;line-height:1.9}
footer code{background:#eef2f7;padding:1.5px 6px;border-radius:5px;
  font-family:ui-monospace,Menlo,Consolas,monospace;color:#475569}
</style>
</head>
<body>
<div class="wrap">
  <header class="top">
    <div class="eyebrow">LLM Wiki · 结构建模</div>
    <h1>双创赛事智能体 demo 系统 Wiki</h1>
    <p class="sub" id="subtitle"></p>
    <div class="kpis" id="kpis"></div>
  </header>

  <section class="card">
    <div class="card-h">
      <h2>分区 × 页面 结构图</h2>
      <span class="hint">点击任一节点下钻该页详情 · 连线方向为 related_pages（邻接导航，用于防联动漏改）</span>
    </div>
    <div class="svgwrap"><svg id="graph" role="img" aria-label="结构建模邻接图"></svg></div>
    <div class="legend">
      <span class="lg"><b>重要度</b></span>
      <span class="lg"><i class="dot" style="background:var(--high)"></i>high（进入上下文预算优先）</span>
      <span class="lg"><i class="dot" style="background:var(--medium)"></i>medium</span>
      <span class="lg"><i class="dot" style="background:var(--low)"></i>low（按需查阅）</span>
      <span class="lg"><b>连线</b>&nbsp;A → B 表示「改 A 时需连带核对 B」</span>
    </div>
  </section>

  <div class="grid2">
    <section class="card">
      <div class="card-h"><h2>页面详情</h2><span class="hint" id="d-hint">默认显示阅读指引，点击图中节点或下方表格行切换</span></div>
      <div class="card-b" id="detail"></div>
    </section>
    <section class="card">
      <div class="card-h"><h2>结构统计</h2><span class="hint">全部由 structure.json 与页面 frontmatter 实时推导</span></div>
      <div class="card-b">
        <h3 class="sec">分区页数分布</h3>
        <div id="st-sec" style="margin-top:10px"></div>
        <h3 class="sec" style="margin-top:20px">重要度分布</h3>
        <div id="st-imp" style="margin-top:10px"></div>
        <h3 class="sec" style="margin-top:20px">引用条数 Top 8 页面</h3>
        <div id="st-cit" style="margin-top:10px"></div>
        <h3 class="sec" style="margin-top:20px">被最多页面共用的源文件 Top 6</h3>
        <div id="st-src" style="margin-top:10px"></div>
      </div>
    </section>
  </div>

  <section class="card">
    <div class="card-h"><h2>20 页总表</h2><span class="hint">点击行下钻 · 五节齐备表示该页固定结构完整</span></div>
    <div class="tblwrap"><table>
      <thead><tr>
        <th>#</th><th>页面</th><th>page_id</th><th>分区</th><th>重要度</th>
        <th>事实条数</th><th>引用条数</th><th>引用源文件</th><th>邻接页</th>
      </tr></thead>
      <tbody id="tbody"></tbody>
    </table></div>
  </section>

  <footer>
    结构真源 <code>wiki/structure.json</code> · 页面 <code>wiki/pages/&lt;page_id&gt;.md</code> ·
    索引 <code>wiki/llms.txt</code> · 本图由 <code>python wiki/gen_wiki_tools.py map</code> 生成<br />
    行号口径为 UTF-8 解码行数（与编辑器显示一致）；页面「事实」节每条均带 <code>Sources: [路径:行号]()</code>，可回代码逐条核对。
  </footer>
</div>

<script>
const DATA = __WIKI_DATA__;
const IMP = { high: 'high', medium: 'medium', low: 'low' };
const byId = {};
DATA.pages.forEach(function (p) { byId[p.id] = p; });

/* ---------- header ---------- */
document.getElementById('subtitle').textContent = DATA.description;
(function () {
  const imps = { high: 0, medium: 0, low: 0 };
  DATA.pages.forEach(function (p) { if (imps[p.importance] !== undefined) imps[p.importance]++; });
  const items = [
    ['分区', DATA.sections.length, ''],
    ['页面', DATA.pages.length, 'k-brand'],
    ['可验证引用', DATA.totals.citations, 'k-brand2'],
    ['覆盖源文件', DATA.totals.sourceFiles, ''],
    ['high / medium / low', imps.high + ' / ' + imps.medium + ' / ' + imps.low, 'k-high']
  ];
  document.getElementById('kpis').innerHTML = items.map(function (it) {
    return '<div class="kpi ' + it[2] + '"><div class="n">' + it[1] + '</div><div class="l">' + it[0] + '</div></div>';
  }).join('');
})();

/* ---------- graph ---------- */
const NW = 210, NH = 44, GAPX = 24, GAPY = 17, PADX = 16, TOP = 58, BOT = 28;
const MAXLBL = 16;
function shortLabel(s) {
  let t = String(s).split('（')[0].split('(')[0].trim();
  if (t.length > MAXLBL) t = t.slice(0, MAXLBL - 1) + '\u2026';
  return t;
}
function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function hash(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return h; }

const cols = DATA.sections.map(function (s) {
  return { id: s.id, title: s.title, ids: s.pages.filter(function (i) { return byId[i]; }) };
});
const maxRows = Math.max.apply(null, cols.map(function (c) { return c.ids.length; }));
const W = PADX * 2 + cols.length * NW + (cols.length - 1) * GAPX;
const H = TOP + maxRows * (NH + GAPY) + BOT;
const POS = {};
cols.forEach(function (c, i) {
  c.ids.forEach(function (pid, j) {
    POS[pid] = { x: PADX + i * (NW + GAPX), y: TOP + j * (NH + GAPY), col: i };
  });
});

const svg = document.getElementById('graph');
svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
const NS = 'http://www.w3.org/2000/svg';
function el(n, a) {
  const e = document.createElementNS(NS, n);
  for (const k in a) e.setAttribute(k, a[k]);
  return e;
}
let defs = el('defs', {});
defs.innerHTML = '<marker id="arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">'
  + '<path d="M 0 0 L 10 5 L 0 10 z" fill="#93a4bf"></path></marker>'
  + '<marker id="arwOn" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">'
  + '<path d="M 0 0 L 10 5 L 0 10 z" fill="#4f46e5"></path></marker>';
svg.appendChild(defs);

const gBg = el('g', {}), gEdge = el('g', {}), gNode = el('g', {});
svg.appendChild(gBg); svg.appendChild(gEdge); svg.appendChild(gNode);

cols.forEach(function (c, i) {
  const x = PADX + i * (NW + GAPX);
  gBg.appendChild(el('rect', { class: 'secbg', x: x - 8, y: 12, width: NW + 16, height: H - 28, rx: 12, fill: i % 2 ? '#f6f9fc' : '#fbfcfe' }));
  gBg.appendChild(el('line', { class: 'secline', x1: x - 8, y1: 45, x2: x + NW + 8, y2: 45 }));
  const t = el('text', { class: 'sechdr', x: x, y: 34 });
  t.textContent = shortLabel(c.title);
  const tt = el('title', {}); tt.textContent = c.title;
  t.appendChild(tt);
  gBg.appendChild(t);
});

const edgeMap = {};
DATA.pages.forEach(function (p) {
  (p.related_pages || []).forEach(function (rp) {
    if (!POS[p.id] || !POS[rp]) return;
    const a = POS[p.id], b = POS[rp];
    const sy = a.y + NH / 2, ty = b.y + NH / 2;
    const fwd = b.x >= a.x;
    const sx = fwd ? a.x + NW : a.x;
    const tx = fwd ? b.x : b.x + NW;
    const dx = Math.max(46, Math.abs(tx - sx) * 0.42);
    const bow = ((hash(p.id + rp) % 9) - 4) * 3.2;
    const d = 'M ' + sx + ' ' + sy + ' C ' + (sx + (fwd ? dx : -dx)) + ' ' + (sy + bow)
      + ', ' + (tx + (fwd ? -dx : dx)) + ' ' + (ty + bow) + ', ' + tx + ' ' + ty;
    const pth = el('path', { class: 'edge', d: d, 'marker-end': 'url(#arw)' });
    gEdge.appendChild(pth);
    (edgeMap[p.id] = edgeMap[p.id] || []).push(pth);
  });
});

DATA.pages.forEach(function (p) {
  const pos = POS[p.id];
  if (!pos) return;
  const g = el('g', { class: 'node', 'data-id': p.id });
  g.appendChild(el('rect', { class: 'box', x: pos.x, y: pos.y, width: NW, height: NH, rx: 10 }));
  g.appendChild(el('circle', { cx: pos.x + 14, cy: pos.y + NH / 2, r: 4, fill: DATA.impColor[p.importance] }));
  const t = el('text', { class: 'lbl', x: pos.x + 27, y: pos.y + NH / 2 + 4 });
  t.textContent = shortLabel(p.title);
  const tt = el('title', {});
  tt.textContent = p.title + '\n' + p.id + '\n引用 ' + p.citations + ' 条 · 源文件 ' + p.citedFiles + ' 个';
  t.appendChild(tt);
  g.appendChild(t);
  g.addEventListener('click', function () { select(p.id, true); });
  gNode.appendChild(g);
});

/* ---------- detail ---------- */
const SEC_NAMES = DATA.sectionNames;
function lineList(arr, empty) {
  if (!arr || !arr.length) return '<div style="color:#94a3b8;font-size:12px">' + empty + '</div>';
  return arr.map(function (s) { return '<div>' + esc(s) + '</div>'; }).join('');
}
function renderOverview() {
  const imps = { high: 0, medium: 0, low: 0 };
  DATA.pages.forEach(function (p) { if (imps[p.importance] !== undefined) imps[p.importance]++; });
  return ''
    + '<div class="d-title"><h2>怎么读这张图</h2></div>'
    + '<div class="oneliner">结构层是 7 个分区 + 20 个页面；每个页面固定五节，其中「事实」节每条都带行号引用，可回到源码逐条核对。'
    + '连线表示页面之间的邻接关系 —— 改一个模块时，沿连线读完相邻页即可避免漏改。</div>'
    + '<div class="nums">'
    + '<div><div class="n">' + DATA.sections.length + '</div><div class="l">分区</div></div>'
    + '<div><div class="n">' + DATA.pages.length + '</div><div class="l">页面</div></div>'
    + '<div><div class="n">' + DATA.totals.citations + '</div><div class="l">可验证引用</div></div>'
    + '</div>'
    + '<div class="subh">入口顺序</div>'
    + '<div style="font-size:13px;color:#334155">'
    + '① 先读 <b>llms.txt</b> 建立全局印象 → ② 按任务挑 1 个目标页 → ③ 顺该页 related_pages 邻接页核对联动 → ④ 需要对上游依据时按 importance 决定是否展开数据页。'
    + '</div>'
    + '<div class="subh">分区概览</div>'
    + '<div class="chips">' + DATA.sections.map(function (s) {
        return '<span class="chip" style="cursor:default">' + esc(s.title) + ' · ' + s.pages.length + ' 页</span>';
      }).join('') + '</div>'
    + '<div class="subh">重要度分布</div>'
    + '<div style="font-size:13px;color:#334155">high ' + imps.high + ' 页（默认纳入开发上下文）· medium ' + imps.medium + ' 页（按任务加载）· low ' + imps.low + ' 页（仅重构/改名时查）</div>';
}
function renderDetail(id) {
  const p = byId[id];
  if (!p) return renderOverview();
  const secTitle = (DATA.sections.filter(function (s) { return s.id === p.section; })[0] || {}).title || p.section;
  const rel = (p.related_pages || []).map(function (rp) {
    const t = byId[rp] ? byId[rp].title : rp;
    return '<span class="chip" data-go="' + rp + '">' + esc(shortLabel(t)) + ' <span style="color:#94a3b8">' + esc(rp) + '</span></span>';
  }).join('');
  const chk = SEC_NAMES.map(function (n) {
    const ok = p.sections[n];
    return ok ? '<span>' + esc(n) + ' \u2713</span>'
      : '<span style="background:#fff7ed;color:#c2410c;border-color:#fed7aa">' + esc(n) + ' 缺</span>';
  }).join('');
  return ''
    + '<div class="d-title"><h2>' + esc(p.title) + '</h2>'
    + '<span class="badge b-' + p.importance + '">' + p.importance + '</span>'
    + '<span class="badge b-sec">' + esc(p.id) + '</span></div>'
    + '<div class="meta"><span class="badge b-sec">' + esc(secTitle) + '</span></div>'
    + '<p class="oneliner">' + esc(p.oneLiner) + '</p>'
    + '<div class="nums">'
    + '<div><div class="n">' + p.factItems + '</div><div class="l">编号事实条数</div></div>'
    + '<div><div class="n">' + p.citations + '</div><div class="l">可验证引用条数</div></div>'
    + '<div><div class="n">' + p.citedFiles + '</div><div class="l">引用源文件数</div></div>'
    + '</div>'
    + '<div class="subh">固定五节</div><div class="chk">' + chk + '</div>'
    + '<div class="subh">依据的源文件（frontmatter sources）</div>'
    + '<div class="srclist">' + lineList(p.sources, '无') + '</div>'
    + '<div class="subh">邻接页面 related_pages（点此跳转）</div><div class="chips">' + (rel || '<span style="color:#94a3b8;font-size:12px">无</span>') + '</div>'
    + '<div class="subh">页面说明（structure.json）</div>'
    + '<div style="font-size:13px;color:#334155">' + esc(p.description) + '</div>';
}

/* ---------- table ---------- */
document.getElementById('tbody').innerHTML = DATA.pages.map(function (p, i) {
  const secTitle = (DATA.sections.filter(function (s) { return s.id === p.section; })[0] || {}).title || p.section;
  return '<tr data-id="' + p.id + '">'
    + '<td class="n">' + (i + 1) + '</td>'
    + '<td><b>' + esc(p.title) + '</b></td>'
    + '<td class="id">' + esc(p.id) + '</td>'
    + '<td style="color:#475569">' + esc(shortLabel(secTitle)) + '</td>'
    + '<td><span class="badge b-' + p.importance + '">' + p.importance + '</span></td>'
    + '<td class="n">' + p.factItems + '</td>'
    + '<td class="n">' + p.citations + '</td>'
    + '<td class="n">' + p.citedFiles + '</td>'
    + '<td class="n">' + (p.related_pages || []).length + '</td>'
    + '</tr>';
}).join('');

/* ---------- stats ---------- */
function bars(host, rows, mono) {
  const max = Math.max.apply(null, rows.map(function (r) { return r[1]; })) || 1;
  document.getElementById(host).innerHTML = rows.map(function (r) {
    return '<div class="bar' + (mono ? ' mono' : '') + '"><div class="lbl"><span>' + esc(r[0]) + '</span><span>' + r[1] + '</span></div>'
      + '<div class="t"><div class="f" style="width:' + Math.max(3, Math.round(r[1] / max * 100)) + '%"></div></div></div>';
  }).join('');
}
bars('st-sec', cols.map(function (c) { return [shortLabel(c.title), c.ids.length]; }));
bars('st-imp', (function () {
  const imps = { high: 0, medium: 0, low: 0 };
  DATA.pages.forEach(function (p) { if (imps[p.importance] !== undefined) imps[p.importance]++; });
  return [['high', imps.high], ['medium', imps.medium], ['low', imps.low]];
})());
bars('st-cit', DATA.pages.slice().sort(function (a, b) { return b.citations - a.citations; })
  .slice(0, 8).map(function (p) { return [shortLabel(p.title), p.citations]; }));
bars('st-src', Object.keys(DATA.sourceIndex).map(function (k) {
  return [k, DATA.sourceIndex[k].length];
}).sort(function (a, b) { return b[1] - a[1]; }).slice(0, 6), true);

/* ---------- selection ---------- */
let sel = null;
function select(id, fromGraph) {
  sel = id;
  const p = byId[id];
  document.getElementById('detail').innerHTML = renderDetail(id);
  document.getElementById('d-hint').textContent = fromGraph ? '已从结构图下钻' : '已从总表下钻';
  document.querySelectorAll('#tbody tr').forEach(function (tr) {
    tr.classList.toggle('sel', tr.getAttribute('data-id') === id);
  });
  const relSet = {};
  (p.related_pages || []).forEach(function (r) { relSet[r] = 1; });
  DATA.pages.forEach(function (q) {
    if ((q.related_pages || []).indexOf(id) >= 0) relSet[q.id] = 1;
  });
  document.querySelectorAll('.node').forEach(function (g) {
    const nid = g.getAttribute('data-id');
    g.classList.toggle('sel', nid === id);
    g.classList.toggle('rel', nid !== id && !!relSet[nid]);
  });
  const onIds = {}; onIds[id] = 1;
  for (const k in relSet) onIds[k] = 1;
  for (const k in edgeMap) {
    const on = !!onIds[k];
    edgeMap[k].forEach(function (pth) {
      pth.classList.toggle('on', on);
      pth.classList.toggle('dim', !on);
      pth.setAttribute('marker-end', on ? 'url(#arwOn)' : 'url(#arw)');
    });
  }
}
document.getElementById('tbody').addEventListener('click', function (e) {
  const tr = e.target.closest('tr');
  if (tr) select(tr.getAttribute('data-id'), false);
});
document.getElementById('detail').addEventListener('click', function (e) {
  const c = e.target.closest('[data-go]');
  if (c) select(c.getAttribute('data-go'), true);
});
renderOverview();
document.getElementById('detail').innerHTML = renderOverview();
</script>
</body>
</html>
"""


def cmd_map(args: argparse.Namespace) -> int:
    """生成结构建模可视化（自包含单页 HTML，无外部依赖）。"""
    if not STRUCTURE_FILE.is_file():
        print("[ERROR] structure.json 缺失，无法生成可视化", file=sys.stderr)
        return 1
    structure = json.loads(STRUCTURE_FILE.read_text(encoding="utf-8"))

    pages_meta: list[dict] = []
    source_index: dict[str, list[str]] = {}
    missing: list[str] = []

    for page in structure.get("pages", []):
        pid = page.get("id")
        f = PAGES_DIR / ("%s.md" % pid)
        if not f.is_file():
            missing.append(pid)
            continue
        text = f.read_text(encoding="utf-8")
        parsed = parse_frontmatter(text)
        fm, body = parsed if parsed else ({}, text)

        cites = CITATION_RE.findall(body)
        cited_files = sorted({c[0].strip() for c in cites})
        for sf in cited_files:
            source_index.setdefault(sf, [])
            if pid not in source_index[sf]:
                source_index[sf].append(pid)

        facts_body = section_body(body, "事实")
        pages_meta.append(
            {
                "id": pid,
                "title": page.get("title", pid),
                "description": page.get("description", ""),
                "section": fm.get("section") or page.get("section", ""),
                "importance": fm.get("importance") or page.get("importance", "medium"),
                "oneLiner": _extract_one_liner(pid) or page.get("description", ""),
                "sources": fm.get("sources") or [],
                "related_pages": fm.get("related_pages") or [],
                "citations": len(cites),
                "citedFiles": len(cited_files),
                "sections": {n: bool(section_body(body, n).strip()) for n in REQUIRED_SECTIONS},
                "factItems": len(re.findall(r"^\s*\d+(?:\.\d+)?\.\s", facts_body, re.MULTILINE)),
            }
        )

    payload = {
        "title": structure.get("title", "Wiki"),
        "description": structure.get("description", ""),
        "coldStart": structure.get("coldStart", ""),
        "lineNumberConvention": structure.get("lineNumberConvention", ""),
        "sections": [
            {"id": s.get("id"), "title": s.get("title", s.get("id")), "pages": s.get("pages", [])}
            for s in structure.get("sections", [])
        ],
        "pages": pages_meta,
        "sectionNames": REQUIRED_SECTIONS,
        "impColor": {"high": "#4f46e5", "medium": "#0891b2", "low": "#94a3b8"},
        "sourceIndex": source_index,
        "totals": {
            "citations": sum(p["citations"] for p in pages_meta),
            "sourceFiles": len(source_index),
            "pages": len(pages_meta),
        },
    }

    data_js = json.dumps(payload, ensure_ascii=False).replace("</", "<\\/")
    html = HTML_TEMPLATE.replace("__WIKI_DATA__", data_js)

    # 同一份内容写两处：仓库内的正式产物 + 可发布的静态站点入口（入口落在 / ，便于直接分享）
    MODEL_MAP.write_text(html, encoding="utf-8")
    SITE_DIR.mkdir(parents=True, exist_ok=True)
    SITE_INDEX.write_text(html, encoding="utf-8")

    print("== map ==")
    print("  已生成：%s" % MODEL_MAP)
    print("  已生成：%s（可直接发布的站点入口）" % SITE_INDEX)
    print(
        "  分区 %d · 页面 %d · 引用 %d 条 · 覆盖源文件 %d 个"
        % (
            len(payload["sections"]),
            len(pages_meta),
            payload["totals"]["citations"],
            payload["totals"]["sourceFiles"],
        )
    )
    if missing:
        print("  [WARN] 以下页面缺文件，未纳入可视化：%s" % ", ".join(missing))
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(
        prog="gen_wiki_tools.py",
        description="LLM Wiki 工具链：validate（引用校验） / index（llms.txt 生成） / map（结构可视化）",
    )
    sub = parser.add_subparsers(dest="cmd", required=True)
    p_val = sub.add_parser("validate", help="校验 pages 与代码真源一致性")
    p_val.set_defaults(func=cmd_validate)
    p_idx = sub.add_parser("index", help="生成 wiki/llms.txt（llms.txt v2 格式）")
    p_idx.set_defaults(func=cmd_index)
    p_map = sub.add_parser("map", help="生成 wiki/model-map.html（结构建模可视化，自包含单页）")
    p_map.set_defaults(func=cmd_map)
    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
