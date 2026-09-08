import React, { useState } from 'react';
import { 
  ProjectFileItem 
} from './guidanceTypes';
import { 
  FileText, 
  FileSpreadsheet, 
  Presentation, 
  Video, 
  Award, 
  Download, 
  Eye, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Volume2, 
  Maximize2, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  User, 
  Tag, 
  Layers, 
  FileCheck,
  Search,
  Sparkles,
  Info,
  Copy,
  Check
} from 'lucide-react';

interface ProjectFileViewerProps {
  file: ProjectFileItem | null;
  allFiles: ProjectFileItem[];
  onSelectFile: (file: ProjectFileItem) => void;
  onOpenBpEditor?: () => void;
  onUploadClick?: () => void;
}

export const ProjectFileViewer: React.FC<ProjectFileViewerProps> = ({
  file,
  allFiles,
  onSelectFile,
  onOpenBpEditor,
  onUploadClick,
}) => {
  const [activeSlide, setActiveSlide] = useState(1);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState(38);
  const [copied, setCopied] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [activeSheetTab, setActiveSheetTab] = useState<'pnl' | 'cash' | 'unit'>('unit');

  // Filtered files for the overview mode
  const filteredFiles = allFiles.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchFilter.toLowerCase()) || 
                          (f.description && f.description.toLowerCase().includes(searchFilter.toLowerCase())) ||
                          (f.tags && f.tags.some(t => t.toLowerCase().includes(searchFilter.toLowerCase())));
    const matchesCategory = categoryFilter === 'all' || f.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(allFiles.map(f => f.category)));

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 15 Slides metadata for PPTX preview
  const slidesData = [
    { page: 1, title: '01 封面 · 破局自主可控', subtitle: '面向晶圆级高精度光学缺陷检测系统', note: '8分钟陈述开场：30秒亮明高校团队国家级卡脖子攻坚身份与核心成果' },
    { page: 2, title: '02 痛点诊断 · 巨头垄断与三大死穴', subtitle: '进口设备垄断70%先进制程，单台千万级，节拍高达1.8秒', note: '用产线实拍图片对比凸显传统设备停线换型慢的致命硬伤' },
    { page: 3, title: '03 真实刚需 · 走访TOP8半导体产线', subtitle: '87.5%产线总监急需高性价比国产替代，意向明确', note: '展示华东6家封测厂走访实录与调研数据样本支撑' },
    { page: 4, title: '04 核心技术一 · 大视场纳秒激光干涉光路', subtitle: '非对称干涉光路设计，单脉冲均匀度98.2%，光利用率提升40%', note: '用第一性原理原理解剖图，强调完全自研无海外专利侵权风险' },
    { page: 5, title: '05 核心技术二 · 毫秒级缺陷分类边缘模型', subtitle: '18类缺陷张量并行推理，节拍压缩至0.18秒/片', note: '重点展示AI与精密光机电的一体化协同算法架构' },
    { page: 6, title: '06 权威检测 · 国家第三方CNAS认证', subtitle: '过杀率<0.1%，检出率99.6%，MTBF连续无故障运行超5000小时', note: '突出国家机器人检验评定中心CMA/CNAS红色检验公章' },
    { page: 7, title: '07 落地验证 · 两家封测上市龙头灯塔产线', subtitle: '已获65万元POC合同款并完成1200小时工业级实跑', note: '展示真实签署协议与产线联签单，击碎“实验室玩具”质疑' },
    { page: 8, title: '08 竞品矩阵 · 对标美日巨头三道护城河', subtitle: '先发工业缺陷光谱飞轮 + MES协议深度嵌入 + 2小时极速驻厂', note: '用清晰红绿对比矩阵，直观展现大厂无法替代的本土壁垒' },
    { page: 9, title: '09 商业模式 · 硬件+模组授权+SaaS算法', subtitle: '从整机销售到生态增值，实现健康现金流与长尾溢价', note: '解释单台硬件毛利58.3%与SaaS年费客户复购逻辑' },
    { page: 10, title: '10 获客策略 · 三步走从标杆到泛半导体', subtitle: '标杆灯塔验证 → 区域代理批量放量 → 拓展电池极耳/汽车电子', note: '阐明从长三角到珠三角的明确销售里程碑' },
    { page: 11, title: '11 核心团队 · 杰青博导与博硕青年研发主力', subtitle: '团队博硕比例75%，师生协同，MBA商业总监具备8年产业化操盘', note: '展示股权清晰划分与高校科技处成果独占转让批复' },
    { page: 12, title: '12 财务预测 · 2027年营收2800万净利620万', subtitle: '单客户经济模型健康自洽，1.5个月完全收回单点获客成本', note: '三张表联动，已考虑行业6个月账期极端情景' },
    { page: 13, title: '13 融资规划 · 出让10%股权融资1500万元', subtitle: '40%用于二代机型研发，35%用于长三角中试基地，25%渠道建设', note: '展示估值公允性与投资人退出渠道' },
    { page: 14, title: '14 社会价值 · 支撑国家半导体自立自强', subtitle: '赋能新质生产力，培养30余名高端交叉学科人才，带动百人就业', note: '升华家国情怀，呼应大赛“我敢闯，我会创”立德树人主旨' },
    { page: 15, title: '15 答辩备用 · 专家高频极限追问防守锦囊', subtitle: '技术替代、巨头降价、高校成果归属等12条预案速查', note: '以饱满自信迎接评委质询，随时一键调出支撑附件' }
  ];

  // If no file is actively selected, show the rich multi-modal library dashboard
  if (!file) {
    return (
      <div className="h-full flex flex-col bg-slate-50/50 overflow-y-auto">
        {/* Header bar */}
        <div className="p-6 bg-white border-b border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                  <Layers className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-bold text-slate-800">项目多模态材料与申报资产库</h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  共 {allFiles.length} 份合规材料
                </span>
              </div>
              <p className="text-xs text-slate-500">
                涵盖商业计划书正本、用户深度调研实录、路演答辩幻灯片、样机视频、权威检验公章检测与三表财务模型
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onUploadClick}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <FileCheck className="w-3.5 h-3.5" />
                登记/上传新材料
              </button>
            </div>
          </div>

          {/* Search and Category Filters */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="检索材料名称、标签、责任人或核心论点..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <button
                onClick={() => setCategoryFilter('all')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  categoryFilter === 'all'
                    ? 'bg-slate-900 text-white font-medium'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                全部材料 ({allFiles.length})
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                    categoryFilter === cat
                      ? 'bg-indigo-600 text-white font-medium'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Files Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredFiles.map(f => {
              let Icon = FileText;
              let iconBg = 'bg-blue-50 text-blue-600 border-blue-200';
              if (f.ext === 'pptx') {
                Icon = Presentation;
                iconBg = 'bg-amber-50 text-amber-600 border-amber-200';
              } else if (f.ext === 'mp4') {
                Icon = Video;
                iconBg = 'bg-rose-50 text-rose-600 border-rose-200';
              } else if (f.ext === 'pdf') {
                Icon = Award;
                iconBg = 'bg-emerald-50 text-emerald-600 border-emerald-200';
              } else if (f.ext === 'xlsx') {
                Icon = FileSpreadsheet;
                iconBg = 'bg-teal-50 text-teal-600 border-teal-200';
              }

              return (
                <div
                  key={f.id}
                  onClick={() => onSelectFile(f)}
                  className="bg-white p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${iconBg}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {f.category}
                        </span>
                      </div>
                      {f.badge && (
                        <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                          {f.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-1.5">
                      {f.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                      {f.description}
                    </p>

                    {/* Tags */}
                    {f.tags && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {f.tags.map(t => (
                          <span key={t} className="text-[10px] text-slate-600 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded">
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>版本: {f.versionRef || '当前登记版'}</span>
                    <div className="flex items-center gap-1 text-indigo-600 font-medium group-hover:translate-x-0.5 transition-transform">
                      <span>检视详情</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Active File Viewer Details Mode
  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Top File Meta Bar */}
      <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center justify-center flex-shrink-0">
            {file.ext === 'pptx' ? <Presentation className="w-5 h-5" /> :
             file.ext === 'mp4' ? <Video className="w-5 h-5" /> :
             file.ext === 'pdf' ? <Award className="w-5 h-5" /> :
             file.ext === 'xlsx' ? <FileSpreadsheet className="w-5 h-5" /> :
             <FileText className="w-5 h-5" />}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-800 truncate">{file.name}</h2>
              {file.badge && (
                <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full whitespace-nowrap">
                  {file.badge}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
              <span>{file.category}</span>
              <span>•</span>
              <span>{(file.size / 1024).toFixed(1)} KB</span>
              <span>•</span>
              <span>版本: {file.versionRef || '当前版'}</span>
              <span>•</span>
              <span>更新时间: {file.updatedAt}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {file.ext === 'md' && onOpenBpEditor && (
            <button
              onClick={onOpenBpEditor}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              在BP编辑器中调优
            </button>
          )}
          <button
            onClick={() => handleCopyText(`【材料名称】${file.name}\n【说明】${file.description || ''}`)}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            title="复制引用"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? '已复制' : '复制引用'}</span>
          </button>
          <button
            onClick={() => alert(`已生成 "${file.name}" 离线下载包链接`)}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>导出</span>
          </button>
        </div>
      </div>

      {/* Main File Content View depending on file type */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* 1. PPTX Roadshow Presentation Preview */}
        {file.ext === 'pptx' && (
          <div className="max-w-5xl mx-auto space-y-6">
            {/* 16:9 Slide Screen Canvas */}
            <div className="relative aspect-[16/9] w-full bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-800 flex flex-col justify-between p-8 text-white">
              {/* Slide Background Subtle Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 pointer-events-none" />
              
              {/* Slide Top Header */}
              <div className="relative z-10 flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                  <span className="text-xs font-semibold tracking-wider uppercase text-indigo-400">
                    2026 中国国际大学生创新大赛 · 全国总决赛路演
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  SLIDE {activeSlide} / {slidesData.length}
                </span>
              </div>

              {/* Slide Center Hero Body */}
              <div className="relative z-10 my-auto text-center space-y-4 max-w-3xl mx-auto px-4">
                <div className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-medium tracking-wide">
                  第 {activeSlide} 页核心论证
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
                  {slidesData[activeSlide - 1]?.title}
                </h1>
                <p className="text-base text-slate-300 font-normal leading-relaxed">
                  {slidesData[activeSlide - 1]?.subtitle}
                </p>

                {/* Dynamic visual preview content per slide */}
                <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur text-left text-xs text-slate-200">
                  <div className="flex items-center gap-2 text-indigo-400 font-semibold mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>8分钟路演演讲口诀与评委关切点：</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {slidesData[activeSlide - 1]?.note}
                  </p>
                </div>
              </div>

              {/* Slide Footer */}
              <div className="relative z-10 flex items-center justify-between border-t border-slate-800 pt-3 text-[11px] text-slate-400">
                <span>参赛编号：CX2026-HQ88921 | 面向晶圆级高精度光学缺陷检测系统</span>
                <span>主讲人：李林峰（光学工程博士）</span>
              </div>
            </div>

            {/* Slide Navigation Controls */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  disabled={activeSlide <= 1}
                  onClick={() => setActiveSlide(s => Math.max(1, s - 1))}
                  className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-semibold text-slate-700 px-3">
                  第 {activeSlide} 页 / 共 {slidesData.length} 页
                </span>
                <button
                  disabled={activeSlide >= slidesData.length}
                  onClick={() => setActiveSlide(s => Math.min(slidesData.length, s + 1))}
                  className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">建议陈述节奏：每页控制在 25~35 秒</span>
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-700">幻灯片缩略序列（点击跳转对应页面）：</div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {slidesData.map(s => (
                  <div
                    key={s.page}
                    onClick={() => setActiveSlide(s.page)}
                    className={`flex-shrink-0 w-32 p-2 rounded-lg border text-left cursor-pointer transition-all ${
                      activeSlide === s.page
                        ? 'border-indigo-600 bg-indigo-50/70 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="text-[10px] font-mono font-bold text-slate-400 mb-1">
                      P.{s.page}
                    </div>
                    <div className="text-[11px] font-medium text-slate-800 line-clamp-1">
                      {s.title.slice(3)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. MP4 Video Demo Simulator */}
        {file.ext === 'mp4' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="relative aspect-video w-full bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col justify-between p-6">
              {/* Simulated Video Frame */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 flex flex-col items-center justify-center text-center p-6">
                  {/* Grid Lines Overlay representing semiconductor optics */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
                  
                  <div className="relative z-10 flex flex-col items-center space-y-4">
                    <div 
                      onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                      className="w-16 h-16 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer"
                    >
                      {isPlayingVideo ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                    </div>
                    <div className="text-white font-semibold text-sm">
                      {isPlayingVideo ? '正在回放产线无故障试跑实录...' : '点击播放产线实操与微米缺陷分类演示'}
                    </div>
                    <div className="text-xs text-indigo-300 font-mono">
                      时长: 03:15 | 分辨率: 4K 60FPS | 录制地点: 某长三角芯片封测洁净车间
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Player Control Overlay */}
              <div className="relative z-10 mt-auto bg-slate-900/80 backdrop-blur rounded-xl p-3 border border-slate-800 flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden cursor-pointer">
                    <div 
                      className="h-full bg-indigo-500 rounded-full transition-all"
                      style={{ width: `${videoProgress}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-mono text-slate-300">01:14 / 03:15</span>
                </div>

                <div className="flex items-center justify-between text-slate-300 text-xs">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setIsPlayingVideo(!isPlayingVideo)} className="hover:text-white cursor-pointer">
                      {isPlayingVideo ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <Volume2 className="w-4 h-4" />
                    <span className="text-[11px]">高保真原声旁白（含晶圆定位机械音）</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono">1.0x</span>
                    <Maximize2 className="w-4 h-4 cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>

            {/* Video Chapter Markers */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="text-xs font-bold text-slate-800 mb-2">产线实录关键节点打点（向评委答辩可直接跳转）：</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                  <span className="font-medium text-slate-700">00:15 晶圆真空吸附与亚微米初定位</span>
                  <span className="text-indigo-600 font-mono">00:15</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                  <span className="font-medium text-slate-700">01:05 纳秒激光脉冲大视场全片断层扫查</span>
                  <span className="text-indigo-600 font-mono">01:05</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                  <span className="font-medium text-slate-700">02:18 边缘张量推理在0.18秒内完成缺陷定级</span>
                  <span className="text-indigo-600 font-mono">02:18</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                  <span className="font-medium text-slate-700">03:00 自动机械臂分选出料及MES系统自动联锁</span>
                  <span className="text-indigo-600 font-mono">03:00</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. PDF Certificate & Inspection Report Viewer */}
        {file.ext === 'pdf' && (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Simulated Official Document Sheet */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-300 p-10 relative overflow-hidden text-slate-800">
              {/* Document Official Watermark / Stamp */}
              <div className="absolute right-12 bottom-12 w-36 h-36 rounded-full border-4 border-red-600/70 flex flex-col items-center justify-center text-red-600/80 font-bold rotate-[-18deg] select-none pointer-events-none p-2 text-center">
                <div className="text-[10px] tracking-widest border-b border-red-600/60 pb-1">国家认可委 CNAS 认证</div>
                <div className="text-xs font-black my-1">检验检测专用章</div>
                <div className="text-[9px] tracking-tighter">有效检验凭证 · 唯一编号</div>
              </div>

              {/* Sheet Header */}
              <div className="text-center border-b-2 border-red-700 pb-4 mb-6">
                <div className="text-xs tracking-widest text-slate-500 font-bold uppercase mb-1">
                  中华人民共和国国家检验检测机构资质认定凭证
                </div>
                <h1 className="text-xl font-extrabold text-slate-900 tracking-wider">
                  {file.name.replace('.pdf', '')}
                </h1>
                <div className="flex items-center justify-center gap-6 text-xs text-slate-500 mt-2 font-mono">
                  <span>报告编号：ST2026-0902-8871</span>
                  <span>受检样品：晶圆级光学缺陷在线检测整机V2</span>
                  <span>送检单位：高校联合创新实验室</span>
                </div>
              </div>

              {/* Inspection Results Table */}
              <div className="space-y-4 text-xs">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-800 mb-2">一、核心技术性能检测综合结论：</div>
                  <p className="text-slate-600 leading-relaxed">
                    本机构依据《GB/T 38659-2020 工业视觉检验设备通用规范》及半导体先进制程量测评定准则，对该仪器进行了连续120小时高低温温湿度恶劣环境动态测试与2000片标准刻蚀硅片实测。各项指标完全符合设计要求，检出率达到国标A级。
                  </p>
                </div>

                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-100 text-slate-700 font-semibold">
                      <tr>
                        <th className="p-2.5 border-b border-slate-200">检验测试项目</th>
                        <th className="p-2.5 border-b border-slate-200">国家/行业标准要求</th>
                        <th className="p-2.5 border-b border-slate-200">实测指标</th>
                        <th className="p-2.5 border-b border-slate-200 text-center">结论判定</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      <tr>
                        <td className="p-2.5 font-medium text-slate-800">单片晶圆全检节拍</td>
                        <td className="p-2.5">≤ 1.0 秒</td>
                        <td className="p-2.5 font-semibold text-emerald-600">0.18 ~ 0.20 秒</td>
                        <td className="p-2.5 text-center text-emerald-600 font-bold">优级通过</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-medium text-slate-800">微米级微裂纹检出率</td>
                        <td className="p-2.5">≥ 95.0%</td>
                        <td className="p-2.5 font-semibold text-emerald-600">99.6%</td>
                        <td className="p-2.5 text-center text-emerald-600 font-bold">优级通过</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-medium text-slate-800">产线虚警过杀率</td>
                        <td className="p-2.5">≤ 1.0%</td>
                        <td className="p-2.5 font-semibold text-emerald-600">0.08%</td>
                        <td className="p-2.5 text-center text-emerald-600 font-bold">优级通过</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-medium text-slate-800">连续无故障运行 (MTBF)</td>
                        <td className="p-2.5">≥ 2000 小时</td>
                        <td className="p-2.5 font-semibold text-emerald-600">&gt; 5000 小时</td>
                        <td className="p-2.5 text-center text-emerald-600 font-bold">优级通过</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between pt-6 text-xs text-slate-500">
                  <div>
                    <span>主检工程师：</span>
                    <span className="font-semibold text-slate-700">陈建华（国家注册质检师）</span>
                  </div>
                  <div>
                    <span>审核发证日期：</span>
                    <span className="font-mono text-slate-700">2026年08月28日</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. XLSX Financial Spreadsheet Model Viewer */}
        {file.ext === 'xlsx' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
              {/* Sheet tabs bar */}
              <div className="flex items-center bg-slate-100 border-b border-slate-200 px-4 pt-2 gap-1">
                <button
                  onClick={() => setActiveSheetTab('unit')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer ${
                    activeSheetTab === 'unit'
                      ? 'bg-white text-indigo-700 border-t-2 border-indigo-600 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  单客户经济模型 (Unit Economics)
                </button>
                <button
                  onClick={() => setActiveSheetTab('pnl')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer ${
                    activeSheetTab === 'pnl'
                      ? 'bg-white text-indigo-700 border-t-2 border-indigo-600 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  未来三年利润表测算 (2026-2028)
                </button>
                <button
                  onClick={() => setActiveSheetTab('cash')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer ${
                    activeSheetTab === 'cash'
                      ? 'bg-white text-indigo-700 border-t-2 border-indigo-600 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  现金流与账期压力测试
                </button>
              </div>

              {/* Active Tab Sheet Data Content */}
              <div className="p-6">
                {activeSheetTab === 'unit' && (
                  <div className="space-y-4">
                    <div className="text-xs text-slate-500 mb-2">
                      基于晶圆级光学检测专机标机的单台核算模型，验证商业闭环自洽性：
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="text-xs text-slate-500">设备单台售价 (ASP)</div>
                        <div className="text-xl font-bold text-slate-800 mt-1">¥ 1,800,000</div>
                        <div className="text-[11px] text-emerald-600 mt-1">仅为进口对标竞品的 40%</div>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="text-xs text-slate-500">直接硬件BOM与组装成本</div>
                        <div className="text-xl font-bold text-slate-800 mt-1">¥ 750,000</div>
                        <div className="text-[11px] text-slate-500 mt-1">光机占55%，专用板卡占25%</div>
                      </div>
                      <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200">
                        <div className="text-xs text-indigo-600 font-semibold">硬件单机综合毛利率</div>
                        <div className="text-xl font-bold text-indigo-700 mt-1">58.3 %</div>
                        <div className="text-[11px] text-indigo-600 mt-1">高于工业装备行业42%均值</div>
                      </div>
                    </div>

                    <div className="border border-slate-200 rounded-lg overflow-hidden text-xs mt-4">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-700 font-semibold">
                          <tr>
                            <th className="p-2.5">测算指标项</th>
                            <th className="p-2.5">测算数值</th>
                            <th className="p-2.5">逻辑依据说明</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-600">
                          <tr>
                            <td className="p-2.5 font-medium text-slate-800">客户全生命周期价值 (LTV)</td>
                            <td className="p-2.5 font-bold text-slate-800">¥ 3,450,000</td>
                            <td className="p-2.5">包含初次硬件采购+3年高阶算法SaaS年费+专人耗材驻厂维护</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-medium text-slate-800">单客户获客与POC成本 (CAC)</td>
                            <td className="p-2.5 font-bold text-slate-800">¥ 180,000</td>
                            <td className="p-2.5">试用机运费、长三角驻点工程师人工及联合调试费用</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-medium text-slate-800">LTV / CAC 比率</td>
                            <td className="p-2.5 font-bold text-emerald-600">19.1 倍</td>
                            <td className="p-2.5">商业逻辑高度稳健（大于行业优秀水准 3.0）</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-medium text-slate-800">投资回本周期 (Payback)</td>
                            <td className="p-2.5 font-bold text-emerald-600">1.5 个月</td>
                            <td className="p-2.5">验收交付并收回首期合同款后立即实现正向现金流回收</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeSheetTab === 'pnl' && (
                  <div className="space-y-4 text-xs">
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <table className="w-full text-left">
                        <thead className="bg-slate-100 text-slate-700 font-semibold">
                          <tr>
                            <th className="p-2.5">财务科目（万元）</th>
                            <th className="p-2.5">2026年（预估）</th>
                            <th className="p-2.5">2027年（预估）</th>
                            <th className="p-2.5">2028年（预估）</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-600">
                          <tr className="font-semibold text-slate-800 bg-slate-50/50">
                            <td className="p-2.5">营业总收入</td>
                            <td className="p-2.5">850.0</td>
                            <td className="p-2.5">2,800.0</td>
                            <td className="p-2.5">6,500.0</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 pl-6">- 专机硬件交付收入</td>
                            <td className="p-2.5">720.0 (4台)</td>
                            <td className="p-2.5">2,340.0 (13台)</td>
                            <td className="p-2.5">5,220.0 (29台)</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 pl-6">- 模组授权与SaaS增值</td>
                            <td className="p-2.5">130.0</td>
                            <td className="p-2.5">460.0</td>
                            <td className="p-2.5">1,280.0</td>
                          </tr>
                          <tr>
                            <td className="p-2.5">营业成本 (COGS)</td>
                            <td className="p-2.5">380.0</td>
                            <td className="p-2.5">1,180.0</td>
                            <td className="p-2.5">2,600.0</td>
                          </tr>
                          <tr>
                            <td className="p-2.5">研发支出 (R&amp;D)</td>
                            <td className="p-2.5">240.0</td>
                            <td className="p-2.5">520.0</td>
                            <td className="p-2.5">1,100.0</td>
                          </tr>
                          <tr className="font-bold text-indigo-700 bg-indigo-50/50">
                            <td className="p-2.5">净利润</td>
                            <td className="p-2.5">58.0</td>
                            <td className="p-2.5">620.0</td>
                            <td className="p-2.5">1,680.0</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeSheetTab === 'cash' && (
                  <div className="space-y-3 text-xs text-slate-600">
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
                      <b>⚠️ 评委关注的半导体行业“长账期”压力测算：</b>
                      <p className="mt-1 leading-relaxed">
                        半导体大客户行业普遍存在“3:3:3:1”回款节奏（首付30%、到货30%、初验30%、质保10%），平均账期为6~9个月。模型测算在极端9个月账期下，本轮1500万融资可支撑公司在无新增订单情况下安全运营24个月以上，无资金链断裂风险。
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 5. Markdown Text Viewer */}
        {file.ext === 'md' && (
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span className="font-semibold text-slate-800">当前检视文件全文：{file.name}</span>
              </div>
              <span className="text-slate-400 font-mono">
                {file.metadata?.wordCount || 18000} 字 · Markdown 格式
              </span>
            </div>

            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm prose prose-slate max-w-none text-xs leading-relaxed text-slate-700 whitespace-pre-wrap font-sans">
              {file.contentPreview || '（商业计划书及正本详实内容已载入中栏 BP 专属编辑器，点击右上角“在BP编辑器中调优”可同步进行章节级诊断与AI润色）'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
