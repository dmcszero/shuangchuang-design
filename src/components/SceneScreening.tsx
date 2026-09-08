/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, CheckCircle2, AlertTriangle, Search, Filter, 
  ChevronRight, RefreshCw, Layers, ShieldAlert, Award, FileText, 
  Settings, ThumbsUp, HelpCircle, Save, Check, X, Info, 
  TrendingUp, PieChart, ArrowRight, Clock, ListChecks, Zap, Database, Eye, BookOpen
} from 'lucide-react';
import { Project, GradeType, TrackType } from '../types';

interface SceneScreeningProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  onNotifySkillUpdate: (projectName: string, grade: string, reason: string) => void;
  screeningTriggerTime?: number;
}

// Local interface for manual feedback logs
interface FeedbackRecord {
  id: string;
  projectId: string;
  projectName: string;
  track: string;
  actionType: 'approve_a' | 'approve_b' | 'revision_c' | 'veto_d';
  actionLabel: string;
  grade: GradeType;
  score: number;
  comments: string;
  timestamp: string;
  reviewer: string;
}

export default function SceneScreening({ projects, setProjects, onNotifySkillUpdate, screeningTriggerTime = 0 }: SceneScreeningProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('p-1');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTabRight, setActiveTabRight] = useState<'report' | 'standards' | 'logs'>('report');

  // Interactive batch screening animation states
  const [isScreening, setIsScreening] = useState<boolean>(false);
  const [screeningProgress, setScreeningProgress] = useState<number>(0);
  const [currentScreeningStep, setCurrentScreeningStep] = useState<number>(0);
  const [screeningLogs, setScreeningLogs] = useState<string[]>([]);
  const [hasScreenedThisFilter, setHasScreenedThisFilter] = useState<boolean>(true);

  // Manual review feedback states
  const [overrideGrade, setOverrideGrade] = useState<GradeType | ''>('');
  const [feedbackAction, setFeedbackAction] = useState<'approve_a' | 'approve_b' | 'revision_c' | 'veto_d'>('approve_b');
  const [overrideReason, setOverrideReason] = useState<string>('');
  const [showNotification, setShowNotification] = useState<string | null>(null);

  // Saved feedback logs in state
  const [feedbackRecords, setFeedbackRecords] = useState<FeedbackRecord[]>([
    {
      id: 'log-1',
      projectId: 'p-3',
      projectName: 'GreenGrid：基于分布式物联微电网的多能互补工学调度系统',
      track: '商业模式',
      actionType: 'revision_c',
      actionLabel: '需修正自洽逻辑后晋级 (C级)',
      grade: 'C',
      score: 72,
      comments: '项目在孤岛切换瞬间的瞬态继电保护与环流抑制上缺乏关键实验波形，商业模式也把工业园区管委会当成了付费主体，逻辑不通。要求团队补充10kV工业变电站现场测试波形，并将盈利渠道修改为EMC节电分成模式。',
      timestamp: '2026-07-21 09:12',
      reviewer: '陆一鸣 (投资总监)'
    },
    {
      id: 'log-2',
      projectId: 'p-2',
      projectName: '神农育种：耐盐碱高产抗逆‘盐丰一号’超级杂交稻分子繁育与绿色栽培系统',
      track: '乡村振兴',
      actionType: 'approve_a',
      actionLabel: '特许放行/推荐A级 (优秀候选者)',
      grade: 'A',
      score: 93,
      comments: '分子育种与离体倍体繁殖的技术壁垒极高，拥有两省多点实际万亩大田测产450kg以上的实物台账。直接带动的农民分红账目非常生动可信，是乡村振兴不可多得的优质农学金奖项目。予以推荐。',
      timestamp: '2026-07-21 11:34',
      reviewer: '顾建国 (农学教授)'
    }
  ]);

  const selectedProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  // Map feedback action to grade
  useEffect(() => {
    if (selectedProject) {
      setOverrideGrade(selectedProject.grade);
      setOverrideReason('');
      
      // Auto assign feedback action based on project's current grade
      if (selectedProject.grade === 'A') setFeedbackAction('approve_a');
      else if (selectedProject.grade === 'B') setFeedbackAction('approve_b');
      else if (selectedProject.grade === 'C') setFeedbackAction('revision_c');
      else setFeedbackAction('veto_d');
    }
  }, [selectedProjectId]);

  // Set selected feedback action to drive override grade
  useEffect(() => {
    if (feedbackAction === 'approve_a') setOverrideGrade('A');
    else if (feedbackAction === 'approve_b') setOverrideGrade('B');
    else if (feedbackAction === 'revision_c') setOverrideGrade('C');
    else if (feedbackAction === 'veto_d') setOverrideGrade('D');
  }, [feedbackAction]);

  // Handle active filter change
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    // Mark as pending screen if we switch filters, giving user a chance to run the screening visually
    setHasScreenedThisFilter(false);
  };

  // Run initial screening simulation for current filtered list
  const handleStartScreening = () => {
    if (isScreening) return;
    setIsScreening(true);
    setScreeningProgress(0);
    setCurrentScreeningStep(0);
    setScreeningLogs(['[系统启动] 建立并行分布式初筛网格节点...', '正在获取当前筛选分类下的全量BP文档与专利接口数据...']);

    // Timeline steps configuration
    const steps = [
      { progress: 25, step: 1, log: '【步骤一】成功接入文档！启动自适应OCR与多模态图文解析，正提取技术参数与关键量化数据...' },
      { progress: 50, step: 2, log: '【步骤二】文本相似度校验中... 比对Github与国家专利库1.2万个相似条目。代写率检测完毕，未发现大范围洗稿重叠。' },
      { progress: 75, step: 3, log: '【步骤三】激活多维打分矩阵。通过RAG大模型提取核心技术痛点、商业闭环，完成六维加权初始评分。' },
      { progress: 100, step: 4, log: '【步骤四】专家决策规则(Expert Skills)映射完毕！成功校验一致性逻辑自洽，判定完毕。项目已按照置信度精准分类。' }
    ];

    let progressValue = 0;
    const interval = setInterval(() => {
      progressValue += 5;
      if (progressValue >= 100) {
        clearInterval(interval);
        setScreeningProgress(100);
        setIsScreening(false);
        setHasScreenedThisFilter(true);
        
        // Ensure step 4 is completed and logged
        const step4 = steps.find(s => s.step === 4);
        if (step4) {
          setCurrentScreeningStep(4);
          setScreeningLogs(prevLogs => [
            ...prevLogs,
            step4.log,
            '✓ [初筛完成] 批次项目评估完成！所有数据已重构归一，置信度红绿灯分流系统已同步刷新。'
          ]);
        }
        return;
      }

      setScreeningProgress(progressValue);

      const stepTrigger = steps.find(s => s.progress === progressValue);
      if (stepTrigger) {
        setCurrentScreeningStep(stepTrigger.step);
        setScreeningLogs(prevLogs => [...prevLogs, stepTrigger.log]);
      }
    }, 120);
  };

  // Trigger screening from sidebar button click
  useEffect(() => {
    if (screeningTriggerTime > 0) {
      handleStartScreening();
    }
  }, [screeningTriggerTime]);

  // Handle saving of feedback and recording logs
  const handleSaveOverride = () => {
    if (!overrideGrade) return;

    const actionLabels = {
      approve_a: '特许放行/推荐A级 (优秀候选者)',
      approve_b: '建议入围复审/B级 (性能及自洽较好)',
      revision_c: '需修正自洽逻辑后晋级 (C级)',
      veto_d: '学术漏洞/AI代写疑点一票否决 (D级)'
    };

    // Calculate score based on grade selection
    let newScore = selectedProject.score;
    if (overrideGrade === 'A') newScore = Math.max(90, selectedProject.score);
    if (overrideGrade === 'B') newScore = Math.min(89, Math.max(75, selectedProject.score));
    if (overrideGrade === 'C') newScore = Math.min(74, Math.max(60, selectedProject.score));
    if (overrideGrade === 'D') newScore = Math.min(59, selectedProject.score);

    // 1. Update project in main list
    setProjects(prev => prev.map(p => {
      if (p.id === selectedProject.id) {
        return {
          ...p,
          grade: overrideGrade,
          score: newScore,
          revisions: [
            ...p.revisions,
            {
              version: `V${p.revisions.length + 1}`,
              date: new Date().toISOString().split('T')[0],
              score: newScore,
              changes: `人工复核反馈记录: ${actionLabels[feedbackAction]}。修改缘由: ${overrideReason || '未填写具体理由'}`
            }
          ]
        };
      }
      return p;
    }));

    // 2. Append to manual feedback records log
    const newFeedbackRecord: FeedbackRecord = {
      id: `log-${Date.now()}`,
      projectId: selectedProject.id,
      projectName: selectedProject.name,
      track: selectedProject.track,
      actionType: feedbackAction,
      actionLabel: actionLabels[feedbackAction],
      grade: overrideGrade,
      score: newScore,
      comments: overrideReason || '同意AI推荐，已通过初筛合规性并核定最终等级。',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      reviewer: '赛事评审委员会·特邀专家'
    };

    setFeedbackRecords(prev => [newFeedbackRecord, ...prev]);

    // 3. Trigger global skill updates to Scene 4 / App context
    onNotifySkillUpdate(selectedProject.name, overrideGrade, overrideReason || `核定操作: ${actionLabels[feedbackAction]}`);

    // Show beautiful banner
    setShowNotification(`人工复核反馈已保存！该记录已存入「初筛复核反馈日志」，并反向刷新了【${selectedProject.track}】赛道的评审决策流，专家模型参数已动态微调。`);
    
    // Switch to history tab to show the record instantly
    setActiveTabRight('logs');

    setTimeout(() => {
      setShowNotification(null);
    }, 6000);
  };

  // Filter project list based on search and selected active filter
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesFilter = 
        activeFilter === 'all' || 
        (activeFilter === 'low-confidence' && p.confidence === 'low') ||
        (activeFilter === 'anomalies' && (p.anomalies.length > 0 || p.issues.length > 0)) ||
        p.track === activeFilter;

      const matchesSearch = 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.leader.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.school.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [projects, activeFilter, searchQuery]);

  // Dynamically calculate metrics based on currently filtered projects (总结概要)
  const batchMetrics = useMemo(() => {
    const list = filteredProjects;
    if (list.length === 0) {
      return {
        total: 0,
        avgScore: 0,
        gradeA: 0,
        gradeB: 0,
        gradeC: 0,
        gradeD: 0,
        anomalyCount: 0,
        anomalyRate: '0%',
        summaryText: '无符合该筛选条件的项目数据。'
      };
    }

    const total = list.length;
    const scoresSum = list.reduce((sum, p) => sum + p.score, 0);
    const avgScore = parseFloat((scoresSum / total).toFixed(1));

    const gradeA = list.filter(p => p.grade === 'A').length;
    const gradeB = list.filter(p => p.grade === 'B').length;
    const gradeC = list.filter(p => p.grade === 'C').length;
    const gradeD = list.filter(p => p.grade === 'D').length;

    const anomalyCount = list.filter(p => p.anomalies.length > 0 || p.issues.length > 0).length;
    const anomalyRate = `${Math.round((anomalyCount / total) * 100)}%`;

    // Dynamic high-level summary paragraph for each track / filter
    let summaryText = '';
    if (activeFilter === 'all') {
      summaryText = `【全量批次初筛概要】本次初筛池共检索 ${total} 项申报项目。平均打分 ${avgScore}分。A级推荐占比为 ${Math.round((gradeA/total)*100)}%，主要瓶颈在于部分L2级别项目的商业模式采购决策路径不明确。另外，有 ${anomalyCount} 个项目被标记了“一致性逻辑矛盾”或“AI生成警示”，需进行人工重点干预。`;
    } else if (activeFilter === '科技创新') {
      summaryText = `【科技创新赛道概要】涉及 ${total} 项前沿工学和医学研究项目。平均分 ${avgScore}分。科研型硬件比例较高。AI评分指出：核心蛇形多节柔性臂技术和FBG光纤探头壁垒坚固，但在抗高压蒸汽灭菌性能及温漂补偿上存在数据盲区，复赛专家答辩应针对性追问。`;
    } else if (activeFilter === '乡村振兴') {
      summaryText = `【乡村振兴赛道概要】涉及 ${total} 项现代生态农业与智慧农机项目。该批次质量极为扎实，平均得分 ${avgScore}分。分子育种‘盐丰一号’耐盐结实数据及示范粮农增收账目十分具体，但对大田极端天气倒伏控制和种子分级溯源体系描述偏少，总体推荐放行。`;
    } else if (activeFilter === '商业模式') {
      summaryText = `【商业模式赛道概要】涉及 ${total} 项智能硬件与碳中和系统。平均分 ${avgScore}分。本项目被标记为低置信度（需人工复核），主要由于其“将工业园区管委会错定为电网调度直接购买主体”存在严重商业常识逻辑硬伤。`;
    } else if (activeFilter === '社会公益') {
      summaryText = `【社会公益赛道概要】涉及 ${total} 项针对特殊教育与助听器硬件项目。平均分 ${avgScore}分。核心舌位重构和骨导共振的肌肉反馈机制非常亮眼。团队采用了创新的「商业高毛利反哺弱势特困」造血自循环模式，公益及商业价值具有高可行性。`;
    } else if (activeFilter === 'low-confidence') {
      summaryText = `【需人工复核批次概要】共有 ${total} 个项目因AI打分置信度低（存在逻辑自相矛盾或导师专利挂名争议）被自动分流至此。这类项目通常需要评委启动手动核定，审查其实物照片、中试证明或临床备案资质，进行定级人工推翻。`;
    } else if (activeFilter === 'anomalies') {
      summaryText = `【异常及查重标记概要】当前筛查出 ${total} 个项目存在合规性红色预警。其中主要包括“BP材料中商业规划与洁净车间生产极限矛盾”、“在技术路线部分检测到40%概率的AI自动套话生成痕迹”。建议一票否决或退回要求限期整改。`;
    }

    return {
      total,
      avgScore,
      gradeA,
      gradeB,
      gradeC,
      gradeD,
      anomalyCount,
      anomalyRate,
      summaryText
    };
  }, [filteredProjects, activeFilter]);

  // Define active project step descriptions (analysis process timeline)
  const selectedProjectAnalysisSteps = useMemo(() => {
    if (!selectedProject) return [];
    
    const isTech = selectedProject.track === '科技创新';
    const isAgri = selectedProject.track === '乡村振兴';
    const isBiz = selectedProject.track === '商业模式';
    const isPublic = selectedProject.track === '社会公益';

    return [
      {
        title: '步骤一：物理文档 OCR 提取与实体识别',
        status: '完成',
        time: '评估启动 +0.4s',
        desc: `系统成功解析 ${selectedProject.leader} 团队上传的 ${selectedProject.name} PDF文档与路演PPT，对多幅关节装配、育种流程图谱进行了结构化OCR抽取，提取了例如「重复定位精度 ±0.05mm」、「耐盐度0.6%」、「THD畸变<2.5%」等 ${isTech ? '34' : isAgri ? '28' : '22'} 个核心关键物理参数。`
      },
      {
        title: '步骤二：一致性关联校验 (自纠偏比对)',
        status: selectedProject.issues.length > 0 ? '警告' : '自洽',
        time: '评估启动 +0.9s',
        desc: selectedProject.issues.length > 0 
          ? `【异常标记】在前后页检索到自相矛盾数据：${selectedProject.issues[0]}。系统自动将该项目置信度判定为 [Medium/Low]，提示人工复核。`
          : '【逻辑闭环】经系统双向文本流审计，项目的研发进度、实验中试规模、团队专业配置、以及后期财务预测无重大冲突。参数相互吻合，一致性评分：95分（高自洽）。'
      },
      {
        title: '步骤三：多维向量打分与行业对标测评',
        status: '完成',
        time: '评估启动 +1.4s',
        desc: `调用行业金奖知识向量库，对本项目的六个维度进行分拆对标。判定创新性得分 ${selectedProject.detailedScores.innovation}分（自研底蕴深厚）；可行性得分 ${selectedProject.detailedScores.feasibility}分。核心扣分原因为：${
          isTech ? 'BP缺乏柔性机械传动在高蒸汽温湿下的零点温漂修正方法' :
          isAgri ? '缺少极端气候下的抗倒伏测试数据与种子生命周期质量追溯体系' :
          isBiz ? '重载微电网孤岛切换继电保护响应时间未给出，属于重大电气常识盲区' :
          '骨传导颈环需补充在无创附着下的长期贴附生物相容性及皮肤防过敏检测备案'
        }。`
      },
      {
        title: '步骤四：AI生成率及学术不端检测 (防灌水)',
        status: selectedProject.anomalies.length > 0 ? '检测到生成迹象' : '原创',
        time: '评估启动 +1.8s',
        desc: selectedProject.anomalies.length > 0
          ? `【红色警告】检测到轻度AI生成文风（${selectedProject.anomalies[0]}）。通过对学术高频套话和段落密度分析，该章节AI写稿痕迹占比为30%-40%。已打上灰色预警标签，提醒评委严审。`
          : '【纯净度高】学术原创性探测完成。经与中文知网、维普学术库、以及主流开源社区（GitHub/HuggingFace）进行全网比对，无大面积查重重叠。内容为团队100%自主撰写，未检测到大范围AI段落重写痕迹。'
      },
      {
        title: '步骤五：最终评级裁定与质询提示生成',
        status: '生成报告',
        time: '评估启动 +2.2s',
        desc: `综合评分为 ${selectedProject.score}分，定级为「${selectedProject.grade}」级，置信度标记为 [${selectedProject.confidence === 'high' ? '高置信 · 建议快速过审' : '低置信 · 建议人工质询'}]。系统自动在质询舱内生成了针对其核心软肋的 3 个复赛提问方向，以便评委在路演现场精准剥离夸大水分。`
      }
    ];
  }, [selectedProject]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="initial-screening-workspace">
      {/* Upper premium visual heading */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-200 pb-6">
        <div>
          <span className="text-xs font-mono font-bold tracking-wider uppercase text-[#0071E3] bg-blue-50 px-2.5 py-1 rounded-full">
            Scene 1 · 智能初筛工作舱
          </span>
          <h1 className="font-display font-semibold text-3xl md:text-4xl tracking-tight text-gray-900 mt-2">
            赛事项目智能初筛与合规审计系统
          </h1>
          <p className="text-gray-500 text-sm mt-2 max-w-3xl font-light leading-relaxed">
            AI快速审阅百万字BP材料，对创新度、技术可行性、商业闭环进行综合量化打分。自动检出逻辑前后矛盾、学术抄袭与AI生成痕迹，智能过滤低置信争议，保障评审绝对的严谨性与公正性。
          </p>
        </div>

        {/* Interactive reference sheets toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTabRight('standards')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all border ${
              activeTabRight === 'standards'
                ? 'bg-gray-900 text-white border-transparent'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>查看评判依据标准</span>
          </button>
        </div>
      </div>

      {/* Global Action Top-Banner Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start space-x-3 shadow-md"
            id="notification-override"
          >
            <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-900">人工复核确认成功 (神经网络自校正已刷新)</p>
              <p className="mt-1 leading-relaxed">{showNotification}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Screening Summary & Controller Panel (总结概要 & 启动初筛) */}
      <div className="mb-8 rounded-[24px] border border-gray-200 bg-white p-6 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Database className="h-48 w-48 text-gray-400" />
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-gray-100 pb-6">
          <div className="space-y-1 z-10">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isScreening ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isScreening ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
              </span>
              <span className="text-xs font-mono font-semibold text-gray-500 uppercase tracking-wider">
                {isScreening ? '分布式多模型并行计算中...' : '初筛批次结果动态看板'}
              </span>
            </div>
            
            <div className="text-xl font-display font-light text-gray-900">
              {isScreening ? (
                <span>正在执行 2000 项项目一键初筛扫描: <span className="font-mono text-amber-600 font-bold text-2xl">{Math.floor((screeningProgress/100) * 2000)}</span> / 2000 项</span>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  <span>当前筛选范围：</span>
                  <span className="font-bold text-[#0071E3] bg-blue-50 px-3 py-0.5 rounded-full text-base">
                    {activeFilter === 'all' ? '全部项目池' : 
                     activeFilter === 'low-confidence' ? '需人工复核项目' : 
                     activeFilter === 'anomalies' ? '合规异常标记项目' : `${activeFilter} 赛道`}
                  </span>
                  <span className="text-gray-400">· 共 {batchMetrics.total} 个项目</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 z-10">
            <button
              onClick={handleStartScreening}
              disabled={isScreening}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full text-xs font-semibold tracking-tight transition-all ${
                isScreening 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' 
                  : 'bg-[#0071E3] text-white hover:bg-[#0077ED] hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-blue-500/10'
              }`}
              id="btn-run-screening"
            >
              <RefreshCw className={`h-4 w-4 ${isScreening ? 'animate-spin' : ''}`} />
              <span>{isScreening ? '正在计算中...' : `对当前筛选列表执行一键 AI 初筛`}</span>
            </button>
          </div>
        </div>

        {/* Screening Progress Live Logs (Shows only during screening or immediately after) */}
        {isScreening && (
          <div className="mt-5 p-4 bg-gray-950 rounded-xl font-mono text-xs text-emerald-400 space-y-1.5 max-h-40 overflow-y-auto border border-gray-800 shadow-inner">
            <div className="flex items-center justify-between text-gray-500 border-b border-gray-800 pb-1.5 mb-2">
              <span className="text-[10px]">AI MODEL AGENT STREAM LOGS</span>
              <span className="text-[10px] animate-pulse">● LIVE RUNNING</span>
            </div>
            {screeningLogs.map((log, index) => (
              <div key={index} className="flex items-start space-x-2">
                <span className="text-emerald-600 select-none">&gt;</span>
                <span className="leading-relaxed font-light">{log}</span>
              </div>
            ))}
          </div>
        )}

        {/* ProgressBar */}
        <div className="mt-6">
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <motion.div 
              className="bg-gradient-to-r from-blue-400 via-blue-500 to-[#0071E3] h-2 rounded-full"
              animate={{ width: `${isScreening ? screeningProgress : 100}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-gray-400 mt-2.5">
            <span className={currentScreeningStep >= 1 ? 'text-blue-600 font-bold' : ''}>① PDF文档OCR解析 ✓</span>
            <span className={currentScreeningStep >= 2 ? 'text-blue-600 font-bold' : ''}>② 相似查重与AI检测 ✓</span>
            <span className={currentScreeningStep >= 3 ? 'text-blue-600 font-bold' : ''}>③ 多维度加权估分 ✓</span>
            <span className={currentScreeningStep >= 4 ? 'text-blue-600 font-bold' : ''}>④ 置信度分流归口 ✓</span>
          </div>
        </div>

        {/* Summary metrics grid (Bento Grid) - 总结概要 */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6 pt-6 border-t border-gray-100">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">筛选统计总量</span>
            <span className="text-2xl font-bold font-mono text-gray-900 mt-1 block">{batchMetrics.total} <span className="text-xs font-normal text-gray-400">项</span></span>
            <span className="text-[10px] text-gray-400 mt-1 block">符合当前筛选条件</span>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">批次平均打分</span>
            <span className="text-2xl font-bold font-mono text-blue-600 mt-1 block">{batchMetrics.avgScore} <span className="text-xs font-normal text-gray-400">分</span></span>
            <span className="text-[10px] text-gray-400 mt-1 block">对标国赛金奖中位数</span>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">评级分布比例</span>
            <div className="flex items-baseline space-x-1 mt-1.5">
              <span className="text-xs font-bold text-red-600 bg-red-50 px-1.5 rounded">{batchMetrics.gradeA}A</span>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-1.5 rounded">{batchMetrics.gradeB}B</span>
              <span className="text-xs font-bold text-gray-600 bg-gray-100 px-1.5 rounded">{batchMetrics.gradeC + batchMetrics.gradeD}C/D</span>
            </div>
            <span className="text-[10px] text-gray-400 mt-2 block">晋级名额受比例限制</span>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">合规异常报警率</span>
            <span className={`text-2xl font-bold font-mono mt-1 block ${batchMetrics.anomalyCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>{batchMetrics.anomalyRate}</span>
            <span className="text-[10px] text-gray-400 mt-1 block">共 {batchMetrics.anomalyCount} 例异常标记</span>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 col-span-2 md:col-span-1">
            <span className="text-[10px] font-mono text-blue-600 uppercase tracking-wider block">初筛健康度评估</span>
            <div className="flex items-center space-x-1.5 mt-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-semibold text-gray-800">
                {batchMetrics.anomalyCount === 0 ? '健康等级：极高' : 
                 batchMetrics.anomalyCount === 1 ? '健康等级：中等' : '健康等级：高危'}
              </span>
            </div>
            <span className="text-[10px] text-gray-400 mt-2 block">建议严格审核异常逻辑</span>
          </div>
        </div>

        {/* Textual summary - 总结概要 */}
        <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-gray-600 leading-relaxed font-light">
          <div className="flex items-center space-x-1.5 font-semibold text-slate-800 mb-1 font-sans">
            <Info className="h-3.5 w-3.5 text-[#0071E3]" />
            <span>AI 综合初筛诊断简报:</span>
          </div>
          {batchMetrics.summaryText}
        </div>
      </div>

      {/* Main Workspace Layout (Two columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Project Selector List (项目列表) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-700">项目分流检索列表 ({filteredProjects.length})</span>
            <span className="text-[10px] text-gray-400 font-mono">支持交叉筛选与关键词检索</span>
          </div>

          {/* Search box */}
          <div className="relative shadow-sm rounded-xl">
            <Search className="absolute left-3.5 top-3 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索项目名称、负责人、学校..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0071E3] focus:ring-1 focus:ring-blue-500/15 transition-colors"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Interactive Filters Tab Bar (选择筛选列表) */}
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 font-mono block">按赛道分类过滤:</span>
            <div className="flex flex-wrap gap-1.5 py-1">
              {[
                { filter: 'all', label: '全部项目' },
                { filter: '科技创新', label: '科技创新' },
                { filter: '乡村振兴', label: '乡村振兴' },
                { filter: '商业模式', label: '商业模式' },
                { filter: '社会公益', label: '社会公益' },
              ].map((item) => (
                <button
                  key={item.filter}
                  onClick={() => handleFilterChange(item.filter)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all border ${
                    activeFilter === item.filter
                      ? 'bg-[#0071E3] text-white border-transparent shadow-sm'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <span className="text-[10px] text-gray-400 font-mono block mt-2">按AI置信风险归口过滤:</span>
            <div className="flex flex-wrap gap-1.5 py-1">
              {[
                { filter: 'low-confidence', label: '需人工复核 (争议)', icon: HelpCircle, colorClass: 'text-amber-700 bg-amber-50 border-amber-200' },
                { filter: 'anomalies', label: '合规异常 (查重警示)', icon: ShieldAlert, colorClass: 'text-red-700 bg-red-50 border-red-200' }
              ].map((item) => {
                const IconComp = item.icon;
                const isSelected = activeFilter === item.filter;
                return (
                  <button
                    key={item.filter}
                    onClick={() => handleFilterChange(item.filter)}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all border ${
                      isSelected
                        ? item.colorClass + ' shadow-sm ring-1 ring-offset-0 ring-current'
                        : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <IconComp className="h-3 w-3" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Project List Scroll Containers */}
          <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
            {filteredProjects.length === 0 ? (
              <div className="py-16 text-center rounded-2xl border border-dashed border-gray-200 bg-white text-gray-400 text-xs space-y-2">
                <Filter className="h-8 w-8 text-gray-300 mx-auto" />
                <p>当前筛选范围下没有找到项目</p>
                <button 
                  onClick={() => handleFilterChange('all')}
                  className="text-xs text-[#0071E3] underline"
                >
                  重置筛选条件
                </button>
              </div>
            ) : (
              filteredProjects.map((project) => {
                const isSelected = project.id === selectedProjectId;
                const hasIssues = project.issues.length > 0;
                const hasAnomalies = project.anomalies.length > 0;

                return (
                  <div
                    key={project.id}
                    onClick={() => setSelectedProjectId(project.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                      isSelected 
                        ? 'bg-white border-[#0071E3] shadow-md ring-1 ring-blue-500/15' 
                        : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[9px] font-mono font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200/50">
                        {project.track} · {project.type}
                      </span>
                      
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                        project.confidence === 'high' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                          : 'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        {project.confidence === 'high' ? '高置信 · 快速通过' : '人工复核争议'}
                      </span>
                    </div>

                    <h3 className="font-display font-semibold text-sm text-gray-900 mt-2.5 leading-snug">
                      {project.name}
                    </h3>

                    <div className="flex items-center justify-between text-[11px] text-gray-500 mt-3.5 pt-3 border-t border-gray-100">
                      <span>{project.leader} ({project.school})</span>
                      <div className="flex items-center space-x-1.5 font-mono">
                        <span className="text-xs font-bold text-gray-800">{project.score}分</span>
                        <span className={`text-xs font-black px-1.5 py-0.5 rounded ${
                          project.grade === 'A' ? 'text-red-700 bg-red-50 border border-red-100' :
                          project.grade === 'B' ? 'text-amber-700 bg-amber-50 border border-amber-100' :
                          'text-gray-500 bg-gray-100 border border-gray-200'
                        }`}>{project.grade}级</span>
                      </div>
                    </div>

                    {/* Alerts indicators */}
                    {(hasIssues || hasAnomalies) && (
                      <div className="mt-2.5 flex flex-wrap gap-1 border-t border-dashed border-gray-100 pt-2">
                        {hasIssues && (
                          <span className="inline-flex items-center text-[9px] text-amber-700 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded">
                            <AlertTriangle className="h-2.5 w-2.5 mr-1 text-amber-500" />
                            逻辑矛盾警报
                          </span>
                        )}
                        {hasAnomalies && (
                          <span className="inline-flex items-center text-[9px] text-red-700 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded">
                            <ShieldAlert className="h-2.5 w-2.5 mr-1 text-red-500" />
                            疑似AI生成
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Multi-Dimensional AI Review Report & Override Feedback Workspace */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-[24px] border border-gray-200 bg-white shadow-sm overflow-hidden">
            
            {/* Header Tabs Navigation */}
            <div className="bg-gray-50 border-b border-gray-200 px-6 pt-4 flex gap-4">
              <button
                onClick={() => setActiveTabRight('report')}
                className={`pb-3 text-xs font-semibold border-b-2 transition-all flex items-center space-x-1.5 ${
                  activeTabRight === 'report'
                    ? 'border-[#0071E3] text-[#0071E3]'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>① AI初筛分析报告 & 推理过程</span>
              </button>
              
              <button
                onClick={() => setActiveTabRight('standards')}
                className={`pb-3 text-xs font-semibold border-b-2 transition-all flex items-center space-x-1.5 ${
                  activeTabRight === 'standards'
                    ? 'border-[#0071E3] text-[#0071E3]'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <Award className="h-4 w-4" />
                <span>② 官方评判指标依据 & 等级标准</span>
              </button>

              <button
                onClick={() => setActiveTabRight('logs')}
                className={`pb-3 text-xs font-semibold border-b-2 transition-all flex items-center space-x-1.5 ${
                  activeTabRight === 'logs'
                    ? 'border-[#0071E3] text-[#0071E3]'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <ListChecks className="h-4 w-4" />
                <span>③ 历史复核反馈记录 ({feedbackRecords.length})</span>
              </button>
            </div>

            {/* TAB 1: AI REPORT & STEP-BY-STEP ANALYSIS PROCESS (分析过程以及原因) */}
            {activeTabRight === 'report' && (
              <div className="p-6 space-y-6">
                
                {/* Project Header summary in Report */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                        {selectedProject.track}赛道 · {selectedProject.type}
                      </span>
                      <span className="text-xs text-gray-400 font-light">{selectedProject.school}</span>
                    </div>
                    <h2 className="font-display font-semibold text-xl md:text-2xl text-gray-900 mt-1">
                      {selectedProject.name}
                    </h2>
                    <p className="text-xs text-gray-500 font-light">
                      团队申报人: <span className="text-gray-800 font-medium">{selectedProject.leader}</span> · 前端模型全量映射分析完毕
                    </p>
                  </div>

                  {/* Rating display */}
                  <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-xl border border-gray-100 self-start sm:self-auto">
                    <div className="text-right">
                      <span className="text-[9px] text-gray-400 block uppercase tracking-wider">AI估算总分</span>
                      <span className="font-mono text-2xl font-bold text-gray-900 block leading-tight">{selectedProject.score} <span className="text-xs text-gray-400 font-normal">分</span></span>
                    </div>
                    <div className={`h-11 w-11 rounded-lg flex items-center justify-center font-display text-lg font-black border ${
                      selectedProject.grade === 'A' ? 'bg-red-50 text-red-600 border-red-100' :
                      selectedProject.grade === 'B' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      'bg-gray-100 text-gray-500 border-gray-200'
                    }`}>
                      {selectedProject.grade}
                    </div>
                  </div>
                </div>

                {/* AI Document Abstract Ingestion Summary */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-gray-700 flex items-center space-x-1">
                    <FileText className="h-4 w-4 text-[#0071E3]" />
                    <span>AI 一页纸文档自解压摘要 (BP核心成果)</span>
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100/80 font-light">
                    {selectedProject.summary}
                  </p>
                </div>

                {/* Six Dimensions Breakdown and Explanations (给出原因) */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-gray-700 flex items-center space-x-1">
                    <Layers className="h-4 w-4 text-[#0071E3]" />
                    <span>六大国家标准维度的量化打分与详细原因解析 (Inference Reasons)</span>
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { key: 'innovation', name: '① 创新性 (25%)', score: selectedProject.detailedScores.innovation, desc: selectedProject.reasons.innovation },
                      { key: 'feasibility', name: '② 技术可行性 (20%)', score: selectedProject.detailedScores.feasibility, desc: selectedProject.reasons.feasibility },
                      { key: 'businessValue', name: '③ 市场与商业价值 (20%)', score: selectedProject.detailedScores.businessValue, desc: selectedProject.reasons.businessValue },
                      { key: 'team', name: '④ 团队匹配度 (15%)', score: selectedProject.detailedScores.team, desc: selectedProject.reasons.team },
                      { key: 'presentation', name: '⑤ 材料完整与表达质量 (10%)', score: selectedProject.detailedScores.presentation, desc: selectedProject.reasons.presentation },
                      { key: 'socialImpact', name: '⑥ 社会价值与社会效益 (10%)', score: selectedProject.detailedScores.socialImpact, desc: selectedProject.reasons.socialImpact }
                    ].map((dim) => (
                      <div key={dim.key} className="p-3.5 rounded-xl bg-gray-50/50 border border-gray-100 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-gray-700">{dim.name}</span>
                          <span className="font-mono font-bold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200 shadow-sm">{dim.score}分</span>
                        </div>
                        
                        {/* Simple premium progress bar */}
                        <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              dim.score >= 90 ? 'bg-[#0071E3]' : 
                              dim.score >= 80 ? 'bg-blue-400' : 
                              dim.score >= 70 ? 'bg-amber-400' : 'bg-red-400'
                            }`} 
                            style={{ width: `${dim.score}%` }} 
                          />
                        </div>
                        
                        <p className="text-[11px] text-gray-500 leading-relaxed font-light">{dim.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dynamic STEP-BY-STEP ANALYSIS PROCESS (分析过程以及原因) */}
                <div className="p-5 rounded-2xl bg-[#F5F5F7] border border-gray-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-gray-700 flex items-center space-x-1">
                      <Zap className="h-4 w-4 text-[#0071E3] animate-pulse" />
                      <span>AI 智能初筛溯源：后台完整推理与决策分析过程 (Tracing Workflow)</span>
                    </h4>
                    <span className="text-[10px] text-gray-400 font-mono">5个阶段完全穿透</span>
                  </div>

                  {/* Step Timelines */}
                  <div className="space-y-4 relative pl-3 border-l border-gray-300 ml-2">
                    {selectedProjectAnalysisSteps.map((step, idx) => (
                      <div key={idx} className="relative space-y-1">
                        {/* Step bullet */}
                        <span className="absolute -left-[19px] top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white border-2 border-blue-500">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                        </span>
                        
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-gray-800">{step.title}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] text-gray-400 font-mono">{step.time}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                              step.status === '完成' || step.status === '自洽' || step.status === '原创'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                : 'bg-red-50 text-red-700 border border-red-100'
                            }`}>{step.status}</span>
                          </div>
                        </div>
                        <p className="text-[11px] text-gray-500 leading-relaxed font-light pl-1">{step.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Anomalies alert if exists */}
                {(selectedProject.issues.length > 0 || selectedProject.anomalies.length > 0) && (
                  <div className="p-4 rounded-xl bg-red-50/60 border border-red-100 space-y-2">
                    <h4 className="text-xs font-semibold text-red-600 flex items-center space-x-1.5">
                      <ShieldAlert className="h-4 w-4 text-red-500" />
                      <span>系统自校验异常审计警告列表</span>
                    </h4>
                    <div className="text-xs text-red-800 space-y-1.5 leading-relaxed font-light pl-5 list-disc">
                      {selectedProject.issues.map((issue, idx) => (
                        <p key={idx}><strong>【一致性冲突缺陷】</strong> {issue}</p>
                      ))}
                      {selectedProject.anomalies.map((anomaly, idx) => (
                        <p key={idx}><strong>【查重警示标签】</strong> {anomaly}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Form to record feedbacks (记录不同的反馈) */}
                <div className="border-t border-gray-100 pt-6 space-y-4" id="feedback-override-form">
                  <div className="flex items-center space-x-2">
                    <Settings className="h-4 w-4 text-gray-400" />
                    <h4 className="text-xs font-semibold text-gray-800">评委人工初筛复核工作舱 (推翻决策或记录不同反馈)</h4>
                  </div>

                  <div className="bg-gray-50/80 p-5 rounded-2xl border border-gray-200/60 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700 block">选择复核意见类型 (Record Action)</label>
                        <p className="text-[11px] text-gray-400 font-light">
                          AI对当前项目推荐评级为 <span className="font-bold text-gray-800">{selectedProject.grade}</span> 级。请评委在查阅报告后给出人工核定。
                        </p>
                      </div>

                      {/* Feedback action choices */}
                      <div className="flex flex-wrap gap-1">
                        {[
                          { action: 'approve_a', label: '推荐A类', colorClass: 'approve-a-btn' },
                          { action: 'approve_b', label: '放行B类', colorClass: 'approve-b-btn' },
                          { action: 'revision_c', label: '打回C类修正', colorClass: 'revision-c-btn' },
                          { action: 'veto_d', label: '一票否决D类', colorClass: 'veto-d-btn' }
                        ].map((choice) => {
                          const isSelected = feedbackAction === choice.action;
                          return (
                            <button
                              key={choice.action}
                              type="button"
                              onClick={() => setFeedbackAction(choice.action as any)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                                isSelected
                                  ? choice.action === 'approve_a'
                                    ? 'bg-red-500 text-white border-transparent'
                                    : choice.action === 'approve_b'
                                      ? 'bg-amber-500 text-white border-transparent'
                                      : choice.action === 'revision_c'
                                        ? 'bg-gray-800 text-white border-transparent'
                                        : 'bg-red-700 text-white border-transparent'
                                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100 shadow-sm'
                              }`}
                            >
                              {choice.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Feedback content remark */}
                    <div className="space-y-1.5">
                      <label className="text-xs text-gray-700 font-semibold block">核定批复详细评语 (此内容将同步记录并训练神经网络)</label>
                      <textarea
                        rows={3}
                        value={overrideReason}
                        onChange={(e) => setOverrideReason(e.target.value)}
                        placeholder="请输入具体的人工初筛反馈意见。例如：虽然技术路线创新度尚可，但经核实其专利第一发明人并非本校导师亦无正式转化转让协议，涉嫌买卖专利，降为C档要求限期澄清；或者：同意AI初筛B级评价，该大田育种数据极具泥土泥巴感，建议放行。"
                        className="w-full p-3 rounded-xl bg-white border border-gray-200 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0071E3] focus:ring-1 focus:ring-blue-500/15 font-light"
                      />
                    </div>

                    {/* Action buttons */}
                    <div className="flex justify-end space-x-3 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setOverrideReason('');
                          if (selectedProject.grade === 'A') setFeedbackAction('approve_a');
                          else if (selectedProject.grade === 'B') setFeedbackAction('approve_b');
                          else if (selectedProject.grade === 'C') setFeedbackAction('revision_c');
                          else setFeedbackAction('veto_d');
                        }}
                        className="px-4 py-2 rounded-full text-xs text-gray-500 hover:text-gray-900 transition-colors"
                      >
                        重置表单
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveOverride}
                        className="flex items-center space-x-1.5 bg-[#0071E3] text-white px-6 py-2 rounded-full text-xs font-semibold hover:bg-[#0077ED] transition-transform active:scale-[0.98] shadow-md shadow-blue-500/15"
                      >
                        <Save className="h-4 w-4" />
                        <span>保存人工核定并刷新决策流</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: JUDGING STANDARDS & EVALUATION DETAILS (评判依据标准) */}
            {activeTabRight === 'standards' && (
              <div className="p-6 space-y-6">
                <div className="border-b border-gray-100 pb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    <Award className="h-5 w-5 text-amber-500" />
                    <span>国赛标准 · 六维初筛评估依据与定级阈值</span>
                  </h3>
                  <p className="text-gray-500 text-xs mt-1 font-light">
                    系统严格对标国家级“互联网+”与“挑战杯”三大核心创新创业赛事评分通则，由系统自动加权得出。
                  </p>
                </div>

                {/* 6 Dimensions Standards */}
                <div className="space-y-4">
                  <h4 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">
                    六大评审细化维度标准定义
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        name: '① 创新性 (权重 25%)',
                        desc: '考察核心原理或商业机制的“第一性原理”突破。查验是否属自主原创或底层配方改良，一票否决“完全抄袭GitHub开源框架”或“直接购买成熟白牌软件套壳”项目。'
                      },
                      {
                        name: '② 技术可行性 (权重 20%)',
                        desc: '查验技术是否完成物理中试、样机加工或真实临床沙箱验证。重点剥离仅存于CAD图纸、纯软件建模，却没有任何真实环境波形、抗拉疲劳或无菌验证参数的悬空项目。'
                      },
                      {
                        name: '③ 市场与商业价值 (权重 20%)',
                        desc: '审查「单客户经济模型(Unit Economics)」是否自洽。核验采购决策流（目标买单主体是谁、预算来源是什么）。一票否决把不具备采购权或无预算科室定为付费方的硬伤。'
                      },
                      {
                        name: '④ 团队匹配度 (权重 15%)',
                        desc: '审查团队学生成员的专业学历、论文与软著署名顺序。剔除导师专利直接挂名学生、或者核心算法由团队外的外行代写/外包的套利行为，确保学生是真实研发主力。'
                      },
                      {
                        name: '⑤ 材料表达质量 (权重 10%)',
                        desc: '查验BP幻灯片与文字大纲的逻辑连贯性。前后财务预测与产能规划是否打架。格式是否符合严整的国家级学术申报风格，文风是否充斥大量毫无定量指标的AI套话。'
                      },
                      {
                        name: '⑥ 社会价值与效益 (权重 10%)',
                        desc: '考察项目对国家重大民生科技替代、特教弱势普惠、或偏远盐碱增产的实质推动力。具有真实扶贫账目、医院感谢信、或重大进口替代自研证明者具有10分加权空间。'
                      }
                    ].map((std, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-gray-50 border border-gray-200/60 space-y-1.5">
                        <span className="text-xs font-semibold text-gray-800 block">{std.name}</span>
                        <p className="text-xs text-gray-500 leading-relaxed font-light">{std.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Grading threshold mappings */}
                <div className="p-5 rounded-xl bg-blue-50/40 border border-blue-100 space-y-3">
                  <h4 className="text-xs font-semibold text-blue-800">
                    初筛批次综合成绩定级映射参考
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                    <div className="p-3 bg-white rounded-lg border border-blue-100 space-y-1">
                      <span className="font-bold text-red-600 block">A 级 (Top 10%)</span>
                      <span className="text-[10px] text-gray-400 block">综合得分 &ge; 90分</span>
                      <p className="text-[10px] text-gray-500 font-light mt-1">
                        核心专利授权、实物挂网或中试数据完整，商业闭环高自洽，极力推荐晋级决赛。
                      </p>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-blue-100 space-y-1">
                      <span className="font-bold text-amber-600 block">B 级 (10% - 30%)</span>
                      <span className="text-[10px] text-gray-400 block">综合得分 75 - 89分</span>
                      <p className="text-[10px] text-gray-500 font-light mt-1">
                        技术与成果相对扎实，一致性好。存在部分测试细节或供应链缺陷，需要口头复审。
                      </p>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-blue-100 space-y-1">
                      <span className="font-bold text-gray-700 block">C 级 (30% - 60%)</span>
                      <span className="text-[10px] text-gray-400 block">综合得分 60 - 74分</span>
                      <p className="text-[10px] text-gray-500 font-light mt-1">
                        技术路线大面积套用开源，商业自洽度低。存在数据前后矛盾，建议限期整改或打回。
                      </p>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-blue-100 space-y-1">
                      <span className="font-bold text-gray-400 block">D 级 (不合格)</span>
                      <span className="text-[10px] text-gray-400 block">综合得分 &lt; 60分</span>
                      <p className="text-[10px] text-gray-500 font-light mt-1">
                        完全开源套壳、代写抄袭，或存在合规/道德性一票否决缺陷。不予通过。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: SAVED MANUAL FEEDBACK LOGS HISTORY (记录反馈日志) */}
            {activeTabRight === 'logs' && (
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 flex items-center space-x-1.5">
                      <ListChecks className="h-4 w-4 text-blue-600" />
                      <span>已记录的人工初筛复核反馈日志 (Reactive Audit Logs)</span>
                    </h3>
                    <p className="text-gray-500 text-[11px] mt-0.5 font-light">
                      这里存放了本次评审中所有由专家推翻或手动确认的核定反馈，数据实时训练微调评分神经元权重。
                    </p>
                  </div>
                  <span className="text-xs font-mono bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-bold">
                    已保存 {feedbackRecords.length} 条记录
                  </span>
                </div>

                {/* Feedback records table */}
                <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
                  {feedbackRecords.map((record) => (
                    <div 
                      key={record.id} 
                      className="p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-sm transition-all text-left space-y-2.5 relative"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-50 pb-2">
                        <div className="flex items-center space-x-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            record.actionType === 'approve_a' ? 'bg-red-50 text-red-700 border border-red-100' :
                            record.actionType === 'approve_b' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                            record.actionType === 'revision_c' ? 'bg-slate-100 text-slate-800' :
                            'bg-red-100 text-red-900'
                          }`}>
                            {record.actionLabel}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">{record.timestamp}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[11px] text-gray-400">复审人: <span className="font-semibold text-gray-700">{record.reviewer}</span></span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-gray-400 block uppercase">评定对象项目</span>
                        <h5 
                          onClick={() => {
                            setSelectedProjectId(record.projectId);
                            setActiveTabRight('report');
                          }}
                          className="text-xs font-bold text-[#0071E3] hover:underline cursor-pointer leading-tight flex items-center"
                        >
                          {record.projectName}
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </h5>
                      </div>

                      <div className="p-3 bg-gray-50 rounded-lg text-[11px] text-gray-600 leading-relaxed font-light">
                        <span className="font-semibold text-gray-800 block mb-1">反馈修改依据及备注:</span>
                        {record.comments}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
