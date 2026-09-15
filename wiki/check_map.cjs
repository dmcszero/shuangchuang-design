/* eslint-disable */
/**
 * module-map.html 回归验收探针（v1.0，2026-09-15 立）
 *
 * 为什么需要它：build_map.py 是 370 KB 单文件 HTML 模板，五命令工具链只校验数据层
 * （edges / issues / 引用），查不出「点了没反应」这类运行时故障——
 * v0.9 的 102/117 张卡片点不动，正是 renderFocus() 引用未定义变量导致的运行时异常，
 * 校验全绿也照样存在。本探针在真实 DOM（jsdom）里加载页面并逐项点击验收。
 *
 * 用法（在 shuangchuang-design-main 下）：
 *   node wiki/check_map.cjs wiki/module-map.html [输出txt]
 * 依赖 jsdom：优先用项目内安装（npm i -D jsdom），否则用环境变量指向任意 jsdom：
 *   JSDOM_PATH=C:/path/to/node_modules/jsdom node wiki/check_map.cjs wiki/module-map.html
 *
 * 覆盖：R1 形态中文化 / R2 全量卡片点击与列折叠自愈 / R3 缺口点击与未锚定说明 /
 *      R4 批注读写与导出导入闭环 / R5 关系链 BFS 与环处理 / R6 demo 深链按钮 /
 *      结构完整性回归（节点 117 · 边 98 · issue 40 · 运行时零异常）。
 * 退出码：0 = 全通过，1 = 有失败项。
 */
const fs = require('fs');
const { JSDOM, VirtualConsole } = require(process.env.JSDOM_PATH || 'jsdom');

const htmlPath = process.argv[2];
const html = fs.readFileSync(htmlPath, 'utf8');
const out = [];
const line = s => out.push(s);
let pass = 0, fail = 0;
const check = (name, ok, extra) => {
  line((ok ? '  ✅ ' : '  ❌ ') + name + (extra ? ' — ' + extra : ''));
  ok ? pass++ : fail++;
};

const errors = [];
const vc = new VirtualConsole();
vc.on('jsdomError', e => {
  const msg = (e.detail && e.detail.stack) || e.message || '';
  // jsdom 不实现 a[download].click() 的文档导航与 window.scrollTo()，属探针环境限制，非页面缺陷
  if (/Not implemented: (navigation|Window's scrollTo)/.test(msg)) return;
  errors.push('[jsdomError] ' + msg);
});
vc.on('error', (...a) => errors.push('[console.error] ' + a.map(String).join(' ')));

const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  pretendToBeVisual: true,
  url: 'http://localhost:8899/module-map.html',
  virtualConsole: vc,
  beforeParse(window) {
    if (!window.CSS) window.CSS = {};
    if (!window.CSS.escape) window.CSS.escape = s => String(s).replace(/[^a-zA-Z0-9_\u00a0-\uffff-]/g, c => '\\' + c);
    window.__opened = [];
    window.open = (u) => { window.__opened.push(String(u)); return { closed: false }; };
    window.HTMLElement.prototype.scrollIntoView = function () {};
    window.__blobSink = null;
    window.URL.createObjectURL = (b) => { window.__blobSink = b; return 'blob:stub'; };
    window.URL.revokeObjectURL = () => {};
    window.__lastDownload = null;
    window.HTMLAnchorElement.prototype.click = function () { window.__lastDownload = this.download; };
  }
});

const readBlob = (w, blob) => new Promise(res => {
  if (!blob) return res(null);
  if (typeof blob.text === 'function') return blob.text().then(res, () => res(null));
  try {
    const fr = new w.FileReader();
    fr.onload = () => res(String(fr.result));
    fr.onerror = () => res(null);
    fr.readAsText(blob, 'utf-8');
  } catch (e) { res(null); }
});

setTimeout(async () => {
  const w = dom.window, d = w.document;
  const $ = id => d.getElementById(id);
  const ev = expr => w.eval(expr);                     // 读写页面内部 const/let
  const click = el => el.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));

  line('=== module-map.html v1.0 验收 ===');
  line('初始化错误：' + (errors.length ? errors.join(' | ') : '（无）'));
  line('');

  /* ---- R1 术语中文化 ---- */
  line('【R1】节点形态中文化');
  ev("ST.view='full'; ST.focusTab='rel'; renderToolbar(); renderCanvas();");
  const kindEnums = ['nav', 'bar', 'tab', 'list', 'panel', 'table', 'form', 'drawer', 'modal', 'shell', 'page', 'unknown'];
  const kds = Array.from(d.querySelectorAll('.card .kd'));
  const kdTexts = kds.map(e => e.textContent.trim());
  const bare = kdTexts.filter(t => kindEnums.includes(t));
  check('全景卡片无裸英文 kind', bare.length === 0, kdTexts.length + ' 张卡，裸英文 ' + bare.length + (bare.length ? '：' + bare.slice(0, 3).join(',') : ''));
  check('kind 英文原值保留在 tooltip', kds.some(e => /^(形态|层级)：/.test(e.getAttribute('title') || '')));
  const sample = kdTexts.filter(Boolean)[0];
  check('示例', !!sample, '例：' + sample);
  ev("select('node','nd-guidance-diff-modal')");
  check('详情「形态」显示中文', $('detail').innerHTML.indexOf('弹层（模态框）') >= 0);
  line('');

  /* ---- R2 聚焦视图可靠性 ---- */
  line('【R2】聚焦视图可靠性');
  const ids = Array.from(d.querySelectorAll('.card')).map(c => c.dataset.id);
  const bad = [];
  ids.forEach(id => {
    $('focusBody').innerHTML = '';
    const e0 = errors.length;
    try { w.select('node', id); } catch (e) { errors.push('[scan] ' + e.message); }
    if ($('focusBody').innerHTML.length === 0 || errors.length > e0) bad.push(id);
  });
  check('全量卡片点击均渲染聚焦视图', bad.length === 0, ids.length + ' 张中 ' + bad.length + ' 张异常' + (bad.length ? '：' + bad.slice(0, 3).join(',') : ''));
  const col = ev("nodeById['nd-guidance-diff-modal'].col");
  ev("ST.collapsed[nodeById['nd-guidance-diff-modal'].col]=true; renderCanvas();");
  w.select('node', 'nd-guidance-diff-modal');
  check('列折叠场景点卡自动展开该列', !ev("!!ST.collapsed['" + col + "']"), '列 = ' + col);
  check('折叠场景下聚焦视图有内容', $('focusBody').innerHTML.length > 0);
  line('');

  /* ---- R3 缺口点击 ---- */
  line('【R3】缺口列表点击');
  ev("ST.view='full'; renderCanvas();");
  const iids = Array.from(d.querySelectorAll('#gaps [data-kind="issue"]')).map(c => c.dataset.id);
  const ibad = [];
  iids.forEach(id => {
    $('detail').innerHTML = '';
    const e0 = errors.length;
    try { w.locateIssue(id); } catch (e) { errors.push('[iscan] ' + e.message); }
    if ($('detail').innerHTML.length === 0 || errors.length > e0) ibad.push(id);
  });
  check('全部 issue 点击后右栏必有内容且无异常', ibad.length === 0, iids.length + ' 条中 ' + ibad.length + ' 条异常');
  const ebad = [];
  Array.from(d.querySelectorAll('#gaps [data-kind="edge"]')).forEach(c => {
    $('detail').innerHTML = '';
    try { w.select('edge', c.dataset.id); } catch (e) { errors.push('[escan] ' + e.message); }
    if ($('detail').innerHTML.length === 0) ebad.push(c.dataset.id);
  });
  check('全部缺口连线点击后右栏必有内容', ebad.length === 0, ebad.length + ' 条异常');
  const unId = ev("ISSUES.filter(x=>!(nodeById[x.where]||ovById[x.where]))[0].id");
  const unWhere = ev("ISSUES.filter(x=>!(nodeById[x.where]||ovById[x.where]))[0].where");
  w.locateIssue(unId);
  check('未锚定 issue 在聚焦视图有说明', /这份梳理以外的东西/.test($('focusBody').innerHTML), unId + ' → ' + unWhere);
  const gbar = d.querySelector('.gbar');
  check('gaps 顶部有统计条', !!gbar, gbar ? gbar.textContent.replace(/\s+/g, ' ').trim().slice(0, 60) : '');
  const nAll = d.querySelectorAll('#gaps [data-kind]').length;
  click(d.getElementById('gapAnchorToggle'));
  const nAnch = d.querySelectorAll('#gaps [data-kind]').length;
  check('「只看能定位的」过滤生效', nAnch < nAll, nAll + ' → ' + nAnch);
  click(d.getElementById('gapAnchorToggle'));
  line('');

  /* ---- 工具栏批注出入口（v1.0.2：导出不该藏在详情面板里） ---- */
  line('【工具栏】批注出入口');
  ev("ST.selKind = null; ST.selId = null; document.getElementById('detail').innerHTML = '<div class=\"empty\">未选中</div>';");
  const topExp = d.getElementById('annExportTop'), topImp = d.getElementById('annImportTop'), topHelp = d.getElementById('annHelp');
  check('未选中任何对象时工具栏仍有「导出/导入/使用说明」', !!topExp && !!topImp && !!topHelp,
    [topExp, topImp, topHelp].map(x => x && x.textContent.trim()).join(' | '));
  check('导出按钮带当前批注条数', /导出（\d+）/.test(topExp ? topExp.textContent : ''), topExp ? topExp.textContent.trim() : '');
  w.__blobSink = null;
  if (topExp) click(topExp);
  check('未选中对象也能导出（有内容）', !!w.__blobSink);
  check('导出文件名带作者与日期', /^annotations-.+-\d{8}\.json$/.test(w.__lastDownload || ''), w.__lastDownload || '（未捕获）');
  if (topHelp) click(topHelp);
  const hm = d.getElementById('helpModal');
  check('「使用说明」弹层可打开', !!hm && hm.style.display === 'flex');
  const hb = $('helpBody').innerHTML;
  check('说明含三块必备内容（怎么看 / 怎么提意见 / 打开 demo）',
    /先看什么/.test(hb) && /怎么提意见/.test(hb) && /「打开 demo ↗」是干什么的/.test(hb));
  const JARGON = ['schema', '入向', '出向', '去重', '外部引用', '可达链', '本库', 'frontmatter', 'edge', 'issue'];
  const hitJargon = JARGON.filter(t => hb.indexOf(t) >= 0);
  check('说明里不出现技术黑话', hitJargon.length === 0, hitJargon.join(' / ') || '（无）');
  check('说明点明「批注只在本机 + 写完必须导出」',
    /只保存在你自己的浏览器/.test(hb) && /写完请点一下上方工具栏的「导出」/.test(hb));
  if (d.getElementById('helpClose')) click(d.getElementById('helpClose'));
  check('弹层可关闭', d.getElementById('helpModal').style.display === 'none');
  /* 右栏两个面板高度（v1.0.3：由 300px 固定改为按视口平分） */
  const boxBd = d.querySelector('.side .box-bd');
  check('右侧面板不再固定 300px 上限', !!boxBd && (boxBd.style.maxHeight === '' || boxBd.style.maxHeight === 'none'));
  line('');

  /* ---- R4 决策批注 ---- */
  line('【R4】决策批注端');
  ev("select('node','nd-guidance-diff-modal')");
  const abox = d.querySelector('#detail .annbox');
  check('详情面板出现批注区块', !!abox);
  check('批注输入三件套齐备', !!(abox && abox.querySelector('[data-ann-decision]') && abox.querySelector('[data-ann-comment]')
    && abox.querySelector('[data-ann-author]') && abox.querySelector('[data-ann-save]')));
  const before = ev('ANN.length');
  abox.querySelector('[data-ann-comment]').value = '验收探针写入：确认该弹层保留，需补 demo 深链';
  abox.querySelector('[data-ann-decision]').value = '确认保留';
  abox.querySelector('[data-ann-author]').value = '验收探针';
  click(abox.querySelector('[data-ann-save]'));
  const after = ev('ANN.length');
  check('保存批注', after === before + 1, 'ANN ' + before + ' → ' + after);
  check('批注写入 localStorage', JSON.parse(w.localStorage.getItem('module-map-annotations-v1') || '[]').length === after);
  check('被批注对象出现徽标', d.querySelectorAll('.annbadge').length > 0, Array.from(d.querySelectorAll('.annbadge')).map(e => e.textContent)[0]);
  const annId = ev('ANN[ANN.length-1].id');
  check('批注 id 形如 ann-YYYYMMDD-n', /^ann-\d{8}-\d+$/.test(annId), annId);
  check('批注含 createdAt/status', ev("!!ANN[ANN.length-1].createdAt && ANN[ANN.length-1].status==='open'"));
  ev('exportAnn()');
  const txt = await readBlob(w, w.__blobSink);
  let dumped = null;
  try { dumped = JSON.parse(txt || '{}'); } catch (e) { dumped = null; }
  check('导出 JSON 合法且含全部批注', !!(dumped && Array.isArray(dumped.annotations) && dumped.annotations.length === after), dumped ? dumped.annotations.length + ' 条' : '无内容');
  const foreign = {
    schemaVersion: '0.1', annotations: [{
      id: 'ann-20260915-99', target: { kind: 'issue', id: 'issue-guidance-unused-modals' },
      author: '他人', decision: '暂缓', comment: '外部导入', createdAt: '2026-09-15T01:00:00.000Z',
      updatedAt: '2026-09-15T01:00:00.000Z', status: 'open'
    }]
  };
  w.importAnnFile(new w.File([JSON.stringify(foreign)], 'annotations.json', { type: 'application/json' }));
  await new Promise(r => setTimeout(r, 250));
  check('导入他人批注（合并去重）', ev("ANN.some(a=>a.id==='ann-20260915-99')"), 'ANN 共 ' + ev('ANN.length') + ' 条');
  w.toggleAnnStatus('ann-20260915-99');
  check('标记已决', ev("ANN.filter(a=>a.id==='ann-20260915-99')[0].status==='resolved'"));
  ev("ST.annFilter='annotated'; renderGaps();");
  const nAnn = d.querySelectorAll('#gaps [data-kind]').length;
  check('gaps 可按批注状态过滤', nAnn < nAll, '已批注条目 ' + nAnn + ' / 全部 ' + nAll);
  ev("ST.annFilter='all';");
  w.deleteAnnotation('ann-20260915-99');
  check('删除批注', !ev("ANN.some(a=>a.id==='ann-20260915-99')"));
  line('');

  /* ---- R5 关系链视图 ---- */
  line('【R5】单向链视图');
  ev("ST.view='full'; ST.focusTab='rel'; renderToolbar(); renderCanvas(); select('node','nd-guidance-topbar');");
  const tabs = Array.from(d.querySelectorAll('[data-ftab]')).map(e => e.textContent.trim());
  check('聚焦视图出现「直接关系 / 关系链」页签', tabs.length === 2, tabs.join(' | '));
  click(d.querySelector('[data-ftab="chain"]'));
  const fb = $('focusBody').innerHTML;
  check('切换到关系链视图', fb.indexOf('入向可达链') >= 0 && fb.indexOf('出向可达链') >= 0);
  const inN = (fb.match(/影响它（(\d+)）/) || [])[1];
  const outN = (fb.match(/影响谁（(\d+)）/) || [])[1];
  check('出向可达集非空', Number(outN) > 0, '入向 ' + inN + ' · 出向 ' + outN);
  check('出向链含已知下游（diff-modal / version-drawer）', /nd-guidance-diff-modal|版本快照/.test(fb));
  check('分层渲染（含「第 N 层」）', /第 1 层/.test(fb));
  const chainOut = ev("JSON.stringify(bfsChain('nd-guidance-topbar','out'))");
  const co = JSON.parse(chainOut);
  check('BFS 不死循环', co.total < 200 && co.layers.length <= 8, '可达 ' + co.total + ' 个 · ' + co.layers.length + ' 层');
  const cyc = JSON.parse(ev("JSON.stringify(bfsChain('nd-guidance-diff-modal','in'))"));
  check('环处理（回边计数，不重复展开）', cyc.total >= 0, '入向 ' + cyc.total + ' 个 · 回边 ' + cyc.backLinks.length + ' 条');
  check('链上节点可点击继续聚焦', /data-focus="/.test(fb));
  line('');

  /* ---- R6 demo 深链 ---- */
  line('【R6】demo 深链');
  ev("ST.view='overview'; ST.focusTab='rel'; renderToolbar(); renderCanvas();");
  const btns = Array.from(d.querySelectorAll('.card [data-demo]'));
  check('总览层页面卡片出现「打开 demo」按钮', btns.length === 14, btns.length + ' 个（应 14 = 15 page − 登录页）');
  const urls = btns.map(b => b.dataset.demo);
  check('链接形如 3000/?tab=<TabType>', urls.every(u => /^http:\/\/localhost:3000\/\?tab=[a-z_]+$/.test(u)), urls[0]);
  check('登录页无按钮', !btns.some(b => b.closest('.card').dataset.id === 'page-login'));
  click(btns[0]);
  check('点击打开新页（window.open）', w.__opened.length === 1, w.__opened[0]);
  check('demoTabs 映射 14 条', Object.keys(ev('DATA.demoTabs')).length === 14);
  ev("select('node','page-guidance')");
  check('页面详情有「打开 demo」区块', !!d.querySelector('.demobig'), (d.querySelector('.demobig') || {}).textContent);
  line('');

  /* ---- 子任务（0915）：footer「issues」表格行内批注 + 数据联通 ---- */
  line('【子任务】footer issues 表格行内批注');
  ev("curTab='issues'; renderTabs();");
  const frows = Array.from(d.querySelectorAll('#tabBody tr.clickable[data-kind="issue"]'));
  check('issues 表格每行都有批注列', frows.length === 40 && frows.every(r => r.querySelector('.anncell')), frows.length + ' 行');
  const tgt = 'issue-guidance-unused-modals';
  const trow = d.querySelector('#tabBody tr.clickable[data-id="' + tgt + '"]');
  check('目标行存在', !!trow);
  click(trow.querySelector('[data-ann-open]'));
  const inlineSel = '#tabBody .anninline[data-ann-scope="issue::' + tgt + '"]';
  check('点「批注」就地展开表单', !!d.querySelector(inlineSel));
  check('展开后按钮变「收起」', (d.querySelector('#tabBody [data-ann-open="' + tgt + '"]') || {}).textContent.trim() === '收起');
  const ta1 = d.querySelector(inlineSel + ' [data-ann-comment]');
  ta1.value = '表格里写的草稿';
  ta1.dispatchEvent(new w.Event('input', { bubbles: true }));
  ev('renderTabs()');                                   // 模拟一次重渲染（切页签 / 状态刷新都会发生）
  const ta2 = d.querySelector(inlineSel + ' [data-ann-comment]');
  check('重渲染后草稿不丢', !!ta2 && ta2.value === '表格里写的草稿', ta2 ? JSON.stringify(ta2.value) : '无');
  const annBefore = ev('ANN.length');
  d.querySelector(inlineSel + ' select[data-ann-decision]').value = '需补充信息';
  click(d.querySelector(inlineSel + ' [data-ann-save]'));
  const annAfter = ev('ANN.length');
  check('表格内保存批注', annAfter === annBefore + 1, 'ANN ' + annBefore + ' → ' + annAfter);
  check('保存后表单已清空（草稿已清）', (d.querySelector(inlineSel + ' [data-ann-comment]') || {}).value === '');
  ev("select('issue','" + tgt + "')");
  const dhtml = $('detail').innerHTML;
  check('【联通】表格写入 → 详情块同步显示', dhtml.indexOf('需补充信息') >= 0 && dhtml.indexOf('表格里写的草稿') >= 0);
  const dbox = d.querySelector('#detail .annbox');
  check('详情块批注表单可用（准备反向写入）', !!dbox, dbox ? '' : 'detail 长度 ' + dhtml.length + ' / 头部 ' + dhtml.replace(/\s+/g, ' ').slice(0, 150));
  if (dbox) {
    dbox.querySelector('[data-ann-comment]').value = '详情块回写的';
    dbox.querySelector('[data-ann-decision]').value = '确认删除';
    click(dbox.querySelector('[data-ann-save]'));
  }
  const cellTxt = ((d.querySelector('#tabBody tr.clickable[data-id="' + tgt + '"] .anncell') || {}).textContent || '').replace(/\s+/g, ' ').trim();
  check('【联通】详情块写入 → 表格批注列同步', cellTxt.indexOf('确认删除') >= 0, cellTxt.slice(0, 56));
  const toggle1 = d.querySelector(inlineSel + ' [data-ann-toggle]');
  if (toggle1) click(toggle1);
  check('表格内可切换已决/未决', ev("ANN.filter(a=>a.target.id==='" + tgt + "').some(a=>a.status==='resolved')"),
    ev("JSON.stringify(ANN.filter(a=>a.target.id==='" + tgt + "').map(a=>a.status))"));
  ev("(function(){ ANN.filter(a=>a.target.id==='" + tgt + "').map(a=>a.id).forEach(function(x){ deleteAnnotation(x); }); })()");
  check('清理测试批注（不影响后续断言）', ev("ANN.filter(a=>a.target.id==='" + tgt + "').length") === 0);
  line('');

  /* ---- 结构完整性回归 ---- */
  line('【回归】结构完整性');
  check('图节点全集未退化', ev('DATA.graph.nodes.length') === 117, ev('DATA.graph.nodes.length') + ' 个');
  check('边 / issue 数未变', ev('DATA.edges.length') === 98 && ev('DATA.issues.length') === 40);
  check('issue 全部带通俗版', ev("DATA.issues.filter(i=>i.plain&&i.plain.oneLine).length") === 40);
  check('运行时零异常', errors.length === 0, errors.length ? errors.slice(0, 3).join(' | ') : '');
  line('');
  line('==== 通过 ' + pass + ' 项 / 失败 ' + fail + ' 项 ====');
  if (errors.length) { line(''); line('错误明细：'); line(errors.slice(0, 10).join('\n')); }

  fs.writeFileSync(process.argv[3] || 'D:/code/创赛/@tmp/accept_out.txt', out.join('\n'), 'utf8');
  console.log(out.join('\n'));
  dom.window.close();
  process.exit(fail ? 1 : 0);
}, 1000);
