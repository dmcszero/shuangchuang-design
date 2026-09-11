# -*- coding: utf-8 -*-
"""
本体工具箱 v0.4（校验 / 查询 / 可视化生成）
真源：../sdm_core.ttl + ../sdm_shapes.ttl
产出（ont_generated/，已 gitignore）：
  - validate_report.txt          SHACL 校验报告
  - queries/<name>.md            预置 SPARQL 查询结果
  - diagram_global.mmd           全局交互总图（角色×视图×导航边）
  - diagram_journey.mmd          学生端 13 步旅程链
  - diagram_defense.mmd          答辩训练状态机
  - index.html                   浅色瘦身版人工导览页（五板块）
用法：python tools/ontology_tools.py all
   或 python tools/ontology_tools.py validate|query|diagram|html
"""
import html
import sys
from pathlib import Path

from rdflib import Graph, Namespace, RDF, RDFS
from pyshacl import validate

HERE = Path(__file__).resolve().parent
BASE = HERE.parent
GEN = BASE / "ont_generated"
CORE = BASE / "sdm_core.ttl"
SHAPES = BASE / "sdm_shapes.ttl"

SDM = Namespace("https://github.com/dmcszero/shuangchuang-design/ontology#")
MERMAID_CDN = "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"


def load_graph() -> Graph:
    g = Graph()
    g.parse(CORE.as_posix(), format="turtle")
    g.bind("sdm", SDM)
    return g


def run_validate(g: Graph) -> bool:
    conforms, _, results_text = validate(
        g, shacl_graph=Graph().parse(SHAPES.as_posix(), format="turtle"),
        ont_graph=None, inference="rdfs", advanced=True, debug=False,
    )
    GEN.mkdir(exist_ok=True)
    report = GEN / "validate_report.txt"
    report.write_text(
        ("SHACL 校验通过 PASS" if conforms else "SHACL 校验发现问题 FAIL") + "\n\n" + results_text,
        encoding="utf-8",
    )
    print(f"[validate] {'PASS' if conforms else 'FAIL'}")
    return conforms


QUERIES: dict[str, str] = {
    "01_角色可见性矩阵": """
        SELECT ?roleLabel ?viewLabel ?isHome WHERE {
          ?role a sdm:Role ; rdfs:label ?roleLabel ; sdm:canSee ?view .
          ?view rdfs:label ?viewLabel .
          BIND(IF(EXISTS{?role sdm:landsOn ?view}, "★默认落地", "可见") AS ?isHome)
        } ORDER BY ?roleLabel ?viewLabel
    """,
    "02_导航边全集": """
        SELECT ?fromLabel ?viaLabel ?toLabel WHERE {
          ?edge a sdm:NavigationEdge ;
                sdm:navigatesFrom ?f ; sdm:navigatesTo ?t .
          ?f rdfs:label ?fromLabel . ?t rdfs:label ?toLabel .
          OPTIONAL { ?edge rdfs:label ?viaLabel }
        } ORDER BY ?fromLabel
    """,
    "03_跨页载荷链": """
        SELECT ?fromLabel ?toLabel ?payloadLabel ?payloadType WHERE {
          ?edge sdm:carriesPayload ?p ;
                sdm:navigatesFrom ?f ; sdm:navigatesTo ?t .
          ?f rdfs:label ?fromLabel . ?t rdfs:label ?toLabel . ?p rdfs:label ?payloadLabel .
          OPTIONAL { ?edge sdm:payloadType ?payloadType }
        }
    """,
    "04_视图服务生命周期": """
        SELECT ?viewLabel ?stageLabel ?focus WHERE {
          ?v a sdm:View ; rdfs:label ?viewLabel ; sdm:serves ?s .
          ?s rdfs:label ?stageLabel .
          OPTIONAL { ?s sdm:stageFocus ?focus }
        } ORDER BY ?stageLabel ?viewLabel
    """,
    "05_学生模块构件清单": """
        SELECT ?modLabel ?capLabel WHERE {
          ?m a sdm:StudentModule ; rdfs:label ?modLabel .
          OPTIONAL { ?m sdm:contains ?cap . ?cap rdfs:label ?capLabel }
        } ORDER BY ?modLabel ?capLabel
    """,
    "05b_模块间与构件级关联": """
        SELECT ?srcLabel ?edge ?tgtLabel WHERE {
          { ?s sdm:relates ?o . ?s rdfs:label ?srcLabel . ?o rdfs:label ?tgtLabel . BIND("relates关联" AS ?edge) }
          UNION
          { ?s sdm:triggers ?o . ?s rdfs:label ?srcLabel . ?o rdfs:label ?tgtLabel . BIND("triggers触发" AS ?edge) }
        } ORDER BY ?srcLabel
    """,
    "06_教练AI能力装配": """
        SELECT ?agentLabel ?capLabel WHERE {
          ?a a sdm:IntelligenceUnit ; rdfs:label ?agentLabel ; sdm:builtOn ?cap .
          ?cap rdfs:label ?capLabel .
        } ORDER BY ?agentLabel
    """,
    "07_调用协议与深度调用": """
        SELECT ?srcLabel ?rel ?tgtLabel WHERE {
          { ?src sdm:deepCalls ?tgt . BIND("深度v2.1-RPC" AS ?rel) }
          UNION
          { ?src sdm:shallowCalls ?tgt . BIND("浅度v2.1-ATOMIC" AS ?rel) }
          ?src rdfs:label ?srcLabel . ?tgt rdfs:label ?tgtLabel .
        }
    """,
    "08_子流程状态机": """
        SELECT ?flowLabel ?stateLabel WHERE {
          ?f a sdm:StateFlow ; rdfs:label ?flowLabel ; sdm:containsState ?st .
          ?st rdfs:label ?stateLabel .
        } ORDER BY ?flowLabel
    """,
    "09_答辩状态机迁移": """
        SELECT ?viewLabel ?stateLabel WHERE {
          sdm:view_defense_training sdm:containsState ?st .
          ?st rdfs:label ?stateLabel .
        } ORDER BY ?stateLabel
    """,
}


def run_queries(g: Graph) -> None:
    qdir = GEN / "queries"
    qdir.mkdir(exist_ok=True)
    # 清理过期查询文件（改名/删除查询后防旧 md 残留）
    valid_names = {f"{name}.md" for name in QUERIES}
    for old in qdir.glob("*.md"):
        if old.name not in valid_names:
            old.unlink()
            print(f"[query] 清理过期文件 {old.name}")
    for name, q in QUERIES.items():
        try:
            rows = g.query(q)
            lines = [f"# 查询 {name}", "",
                     "| " + " | ".join(str(v) for v in rows.vars) + " |",
                     "|" + "---|" * len(rows.vars)]
            for row in rows:
                lines.append("| " + " | ".join(
                    (str(v) if v is not None else "—") for v in row) + " |")
            (qdir / f"{name}.md").write_text("\n".join(lines), encoding="utf-8")
            print(f"[query] {name}: {len(rows)} 行")
        except Exception as exc:  # noqa: BLE001
            print(f"[query] {name}: ERROR {exc}")


def label_or_local(g: Graph, node) -> str:
    for obj in g.objects(node, RDFS.label):
        return str(obj)
    return str(node).split("#")[-1]


def esc(s: str) -> str:
    return html.escape(s, quote=True)


def all_view_instances(g: Graph) -> set:
    """View 及其子类（MachineView）实例并集——rdflib 不做子类推理。"""
    s: set = set(g.subjects(RDF.type, SDM.View))
    s |= set(g.subjects(RDF.type, SDM.MachineView))
    return s


def safe_id(node) -> str:
    return str(node).split("#")[-1]


def run_diagram(g: Graph) -> None:
    GEN.mkdir(exist_ok=True)

    # ---------- 全局交互总图（浅色） ----------
    lines = ["flowchart LR"]
    for role in g.subjects(RDF.type, SDM.Role):
        rid = safe_id(role)
        lines.append(f'    {rid}["🧑 {esc(label_or_local(g, role))}"]:::roleClass')
    lines.append("")
    machine_views = set(g.subjects(RDF.type, SDM.MachineView))
    for v in sorted(all_view_instances(g), key=lambda x: safe_id(x)):
        vid = safe_id(v)
        lbl = esc(label_or_local(g, v))
        n_states = len(list(g.objects(v, SDM.containsState)))
        tag = f" ⛭{n_states}" if n_states else ""
        cls = "machineClass" if v in machine_views else "viewClass"
        lines.append(f'    {vid}["{lbl}{tag}"]:::{cls}')
    lines.append("")
    for role, view in g.subject_objects(SDM.canSee):
        rid, vid = safe_id(role), safe_id(view)
        if (role, SDM.landsOn, view) in g:
            lines.append(f"    {rid} ==>|默认落地| {vid}")
        else:
            lines.append(f"    {rid} -.->|可见| {vid}")
    lines.append("")
    for edge in g.subjects(RDF.type, SDM.NavigationEdge):
        frm = g.value(edge, SDM.navigatesFrom)
        to = g.value(edge, SDM.navigatesTo)
        if frm is None or to is None:
            continue
        fid, tid = safe_id(frm), safe_id(to)
        lbl = label_or_local(g, edge)
        payload = g.value(edge, SDM.carriesPayload)
        # mermaid 标签含中文箭头/特殊符号时必须用引号包裹文本
        if payload is not None:
            tag = f'==>|🔒 {esc(lbl)}|' if lbl else "==>"
        else:
            tag = f'-->|{esc(lbl)}|' if lbl else "-->"
        lines.append(f"    {fid} {tag} {tid}")
    (GEN / "diagram_global.mmd").write_text("\n".join(lines), encoding="utf-8")

    # ---------- 学生端模块触达网络（v0.4：实测 UI 模块/构件两级） ----------
    mods = sorted(g.subjects(RDF.type, SDM.StudentModule), key=lambda s: safe_id(s))
    j = ["flowchart LR",
         "    %% v0.4 学生端触达网络：外层=模块（实测 UI 呈现），内层=构件；模块级 relates 粗边 / 构件级联动虚线",
         "    classDef modMain fill:#EFF6FF,stroke:#60A5FA,color:#1E3A8A;",
         "    classDef modSub fill:#F8FAFC,stroke:#94A3B8,color:#475569;",
         "    classDef modEntry fill:#FFF7ED,stroke:#FDBA74,color:#9A3412;",
         "    classDef capNode fill:#FFFFFF,stroke:#CBD5E1,color:#334155;",
         "    classDef capLink fill:#FDF2F8,stroke:#F9A8D4,color:#9D174D;"]
    GROUP = {
        "m_login": "入口",
        "m_coach": "M1", "m_sessions": "M1",
        "m_workbench": "M2",
        "m_guidance": "M3",
        "m_defense": "M4",
        "m_shortcuts": "M5", "m_current_project": "M5",
    }
    groups: dict = {}
    for m in mods:
        groups.setdefault(GROUP.get(safe_id(m), "GX"), []).append(m)
    GRNAME = {"M1": "① 新建对话（AI 备赛助手）", "M2": "② 项目工作台",
              "M3": "③ 全链路指导工作台", "M4": "④ 模拟评审与答辩训练",
              "M5": "侧栏常驻部件", "入口": "登录入口", "GX": "其他"}
    for gname, members in groups.items():
        gid = "G" + str(abs(hash(gname)) % 10**6)
        j.append(f'    subgraph {gid}["{GRNAME.get(gname, gname)}"]')
        for m in members:
            mid = safe_id(m)
            lbl = esc(label_or_local(g, m))
            tl = str(g.value(m, SDM.touchLevel) or "")
            cls = "modEntry" if mid == "m_login" else ("modMain" if tl == "direct" else "modSub")
            j.append(f'        {mid}["▸ {lbl}"]:::{cls}')
            for cap in sorted(g.objects(m, SDM.contains), key=lambda c: safe_id(c)):
                cid = safe_id(cap)
                clbl = esc(label_or_local(g, cap))
                cross = any(True for _ in g.objects(cap, SDM.relates))
                ccls = "capLink" if cross else "capNode"
                j.append(f'        {cid}["{clbl}"]:::{ccls}')
                j.append(f"        {mid} --- {cid}")
        j.append("    end")
    j.append("")
    for s, o in g.subject_objects(SDM.relates):
        sid, oid = safe_id(s), safe_id(o)
        if sid.startswith("m_") and oid.startswith("m_"):
            lbl = esc(label_or_local(g, s).split("（")[0] + " → " + label_or_local(g, o).split("（")[0])
            j.append(f'    {sid} ==>|"{lbl}"| {oid}')
    for s, o in g.subject_objects(SDM.relates):
        sid, oid = safe_id(s), safe_id(o)
        if not (sid.startswith("m_") and oid.startswith("m_")):
            j.append(f'    {sid} -.->|"联动"| {oid}')
    for s, o in g.subject_objects(SDM.triggers):
        j.append(f'    {safe_id(s)} -.->|"触发"| {safe_id(o)}')
    (GEN / "diagram_journey.mmd").write_text("\n".join(j), encoding="utf-8")

    # ---------- 答辩状态机 ----------
    d = ["stateDiagram-v2",
         "    direction LR",
         "    [*] --> st_def_selector: 进入训练",
         "    st_def_selector --> st_def_prep: 开始备战",
         "    st_def_prep --> st_def_session: 进入实战",
         "    st_def_session --> st_def_report: 结束答辩",
         "    st_def_report --> st_def_selector: 再来一次",
         "    st_def_report --> st_def_prep: 复盘回备战",
         "    st_def_prep --> st_def_selector: 改配置回选择",
         "    st_def_session --> st_def_prep: 中途退回"]
    (GEN / "diagram_defense.mmd").write_text("\n".join(d), encoding="utf-8")
    print("[diagram] global / journey / defense 已生成")


# ---------------------------------------------------------------- html
HTML_HEAD = """<!DOCTYPE html>
<html lang="zh">
<head>
<meta charset="utf-8">
<title>sdm 本体导览 v0.4 — shuangchuang-design-main</title>
<script src="{cdn}"></script>
<script>
mermaid.initialize({{ startOnLoad: true,
  theme: 'neutral',
  flowchart: {{ htmlLabels: true, curve: 'basis' }},
  themeVariables: {{
    fontSize: '13px',
    primaryColor: '#f8fafc',
    primaryBorderColor: '#cbd5e1',
    primaryTextColor: '#334155',
    lineColor: '#94a3b8',
    secondaryColor: '#f1f5f9',
    tertiaryColor: '#ffffff'
  }}
}});
</script>
<style>
 *{{box-sizing:border-box}}
 body{{font-family:"Segoe UI",system-ui,-apple-system,sans-serif;margin:0;background:#f8fafc;color:#334155}}
 h1{{font-size:18px;padding:14px 28px;margin:0;background:#ffffff;border-bottom:1px solid #e2e8f0;color:#0f172a}}
 h1 span{{font-size:12px;color:#94a3b8;font-weight:400}}
 h2{{font-size:14px;padding:18px 28px 6px;margin:0;color:#0f172a}}
 h2 small{{font-weight:400;color:#94a3b8;margin-left:8px;font-size:12px}}
 .mermaid{{background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;margin:10px 28px;padding:18px;display:flex;justify-content:center;overflow-x:auto}}
 .card{{background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;margin:10px 28px;padding:14px 18px;overflow-x:auto}}
 table{{border-collapse:collapse;width:100%;font-size:12.5px}}
 th,td{{border-bottom:1px solid #f1f5f9;padding:6px 10px;text-align:left;white-space:nowrap}}
 th{{background:#f8fafc;color:#475569}}
 details{{margin:10px 28px;border:1px solid #e2e8f0;border-radius:12px;background:#fff}}
 summary{{cursor:pointer;padding:10px 18px;font-size:13px;color:#0f172a}}
 pre{{margin:0;padding:12px 18px;font-size:11.5px;line-height:1.5;white-space:pre-wrap;color:#475569}}
 .nav{{display:flex;gap:10px;padding:10px 28px;background:#ffffffcc;border-bottom:1px solid #e2e8f0;position:sticky;top:0;z-index:9;backdrop-filter:blur(6px)}}
 .nav a{{color:#475569;text-decoration:none;font-size:12.5px;padding:4px 12px;border:1px solid #e2e8f0;border-radius:8px;background:#fff}}
 .nav a:hover{{color:#0f172a;border-color:#cbd5e1}}
 .footer{{padding:16px 28px;color:#94a3b8;font-size:11.5px}}
</style>
</head>
<body>
<h1>sdm 系统本体导览 — shuangchuang-design-main <span>v0.4 · 角色维 × 生命周期维 + 学生触达网络 + AI 能力层</span></h1>
<div class="nav"><a href="#nav-sec">① 交互总图</a><a href="#mat-sec">② 角色×视图</a><a href="#jr-sec">③ 学生触达网络</a><a href="#sm-sec">④ 生命周期映射</a><a href="#q-sec">⑤ SPARQL 问答</a></div>
"""

HTML_TAIL = """
<div class="footer">由 ontology/tools/ontology_tools.py 自动生成 · 真源 sdm_core.ttl + sdm_shapes.ttl · 改 ttl 后重跑：python tools/ontology_tools.py all</div>
</body>
</html>"""


def run_html(g: Graph) -> None:
    parts = [HTML_HEAD.format(cdn=MERMAID_CDN)]

    # ① 全局交互总图
    parts.append('<div class="mermaid" id="nav-sec">\n'
                 + (GEN / "diagram_global.mmd").read_text(encoding="utf-8")
                 + "\n</div>")

    # ② 角色×视图矩阵
    parts.append("<h2 id=\"mat-sec\">角色 × 视图<small>✓ 可见 · ★ 默认落地 · 横向滚动</small></h2>")
    parts.append("<div class='card'><div style='overflow-x:auto'><table>")
    roles = sorted(g.subjects(RDF.type, SDM.Role), key=lambda r: label_or_local(g, r))
    views = sorted(all_view_instances(g), key=lambda v: safe_id(v))
    parts.append("<tr><th>角色</th>" + "".join(
        f"<th>{esc(label_or_local(g, v))}</th>" for v in views) + "</tr>")
    for role in roles:
        cells = []
        for v in views:
            mark = ""
            if (role, SDM.canSee, v) in g:
                mark = "★" if (role, SDM.landsOn, v) in g else "✓"
            color = "#0f172a" if mark == "★" else "#64748b"
            cells.append(f"<td style='text-align:center;color:{color}'>{mark}</td>")
        parts.append(f"<tr><td style='font-weight:600'>{esc(label_or_local(g, role))}</td>" + "".join(cells) + "</tr>")
    parts.append("</table></div></div>")

    # ③ 学生功能触达网络
    parts.append("<h2 id=\"jr-sec\">学生端功能触达网络<small>节点=功能/工具 · 实线=入口指向 · 点线=触发 · 虚线=供数 · 淡蓝=直接可见 / 白=页内操作 / 灰底=系统间接触达</small></h2>")
    parts.append("<div class='mermaid'>\n"
                 + (GEN / "diagram_journey.mmd").read_text(encoding="utf-8")
                 + "\n</div>")

    # ④ 生命周期 serves 映射表
    parts.append("<h2 id=\"sm-sec\">生命周期 L1~L6 × 视图<small>维度二：时间维（serves 映射）</small></h2>")
    parts.append("<div class='card'><div style='overflow-x:auto'><table>")
    parts.append("<tr><th>生命周期阶段</th><th>核心目标</th><th>服务于该阶段的视图</th></tr>")
    stages = sorted(g.subjects(RDF.type, SDM.LifeCycleStage), key=lambda s: safe_id(s))
    for st in stages:
        focus = g.value(st, SDM.stageFocus)
        served = [label_or_local(g, v) for v in all_view_instances(g)
                  if (v, SDM.serves, st) in g]
        parts.append(f"<tr><td style='font-weight:600'>{esc(label_or_local(g, st))}</td>"
                     f"<td style='color:#64748b'>{esc(str(focus)) if focus else '—'}</td>"
                     f"<td>{' · '.join(esc(x) for x in served) or '—'}</td></tr>")
    parts.append("</table></div></div>")

    # ⑤ SPARQL 问答（折叠）
    parts.append("<h2 id=\"q-sec\">SPARQL 问答<small>9 组预置查询 · 答辩状态机/子流程/能力装配细节在此</small></h2>")
    qdir = GEN / "queries"
    if qdir.exists():
        for md in sorted(qdir.glob("*.md")):
            parts.append(
                f"<details><summary>{esc(md.stem.replace('_', ' '))}</summary>"
                f"<pre>{esc(md.read_text(encoding='utf-8'))}</pre></details>")

    parts.append(HTML_TAIL)
    (GEN / "index.html").write_text("".join(parts), encoding="utf-8")
    print("[html] index.html（浅色 v0.4，五板块）")


def main() -> None:
    GEN.mkdir(exist_ok=True)
    g = load_graph()
    ok = run_validate(g)
    run_queries(g)
    run_diagram(g)
    run_html(g)
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
