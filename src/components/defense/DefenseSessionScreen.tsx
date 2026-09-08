import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mic, 
  Send, 
  StopCircle, 
  Clock, 
  User, 
  Bot, 
  AlertCircle, 
  Sparkles, 
  CheckCircle2, 
  Volume2, 
  ShieldAlert,
  HelpCircle,
  CornerDownLeft,
  ArrowLeft
} from 'lucide-react';
import { DefenseProject, ModeDef, DefenseSessionConfig, DefenseMessage } from './defenseTypes';

interface Props {
  project: DefenseProject;
  mode: ModeDef;
  config: DefenseSessionConfig;
  onFinish: () => void;
  onBack?: () => void;
}

export default function DefenseSessionScreen({
  project,
  mode,
  config,
  onFinish,
  onBack
}: Props) {
  const [messages, setMessages] = useState<DefenseMessage[]>([]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(config.timeLimit || 90);
  const [isStreaming, setIsStreaming] = useState(false);
  const [roundCount, setRoundCount] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when messages or streaming state changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isStreaming]);

  // Countdown timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Initial bot opening message
  useEffect(() => {
    setIsStreaming(true);
    const opener = setTimeout(() => {
      setIsStreaming(false);
      let initialQuestion = '';
      if (mode.id === 'elevator') {
        initialQuestion = `各位答辩人好。欢迎进入电梯演讲实训舱，当前设定为【${config.elevatorDuration === '3min' ? '3分钟标准版' : '1分钟极速版'}】。请在倒计时内高密度阐述：你们针对哪个真实产业痛点，打造了何种不可替代的解决方案，以及当前取得的商业化印证成果？请开始陈述！`;
      } else if (mode.id === 'followup') {
        initialQuestion = `你们在商业计划书中多次强调“自研核心算法具有绝对技术壁垒”，但我注意到国内外竞品同样在加速迭代。请问：如果行业龙头厂商下调价格或直接提供免费基础功能，你们的客户迁移成本究竟由什么来保障？请给出具体测算指标。`;
      } else if (mode.id === 'adversarial') {
        initialQuestion = `我看过你们报送的《${project.name}》申报书，技术指标很漂亮，但商业落地漏洞很大！你们第三年预测近千万营收，但工业检测设备往往需要长达半年以上的驻厂验证。请直面回答：你们是否存在夸大商业化进展以迎合评审的倾向？前期付费客户的复购率究竟是多少？`;
      } else {
        initialQuestion = `各位好，我是本次主审评委。认真审阅过《${project.name}》材料后，我想首先向团队发问：当前市场上已有类似解决方案的前提下，你们的技术突破性到底在哪个具体指标上形成了对现有格局的颠覆？请结合真实工况数据进行阐明。`;
      }

      setMessages([
        {
          id: 'msg-1',
          role: 'judge',
          content: initialQuestion,
          time: 0
        }
      ]);
    }, 1400);

    return () => clearTimeout(opener);
  }, [mode.id, project.name, config.elevatorDuration]);

  // User sends a response
  const handleSend = () => {
    if (!input.trim()) return;

    const spentTime = (config.timeLimit || 90) - timeLeft;
    const userMsg: DefenseMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      time: spentTime > 0 ? spentTime : config.timeLimit || 90
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTimeLeft(config.timeLimit || 90);
    setIsRecording(false);
    setRoundCount((c) => c + 1);

    // Dynamic AI follow-up response
    setIsStreaming(true);
    setTimeout(() => {
      setIsStreaming(false);

      let aiResponse = '';
      if (roundCount === 1) {
        aiResponse = `你刚才提到了技术指标与中试数据，回答有一定依据。但你似乎回避了关键的“商业交付与现金流”考量——定制化产线部署成本高昂，若大客户验收周期拖延超过9个月，团队目前的自有资金能支撑多久的研发消耗？`;
      } else if (roundCount === 2) {
        aiResponse = `很好，在资金周转方案上有思考。但对于核心技术人员与高校课题组的兼任合规问题，你们核心研发骨干的职务发明与高校专利转化协议是否已签订了排他性独占协议？请简要说明法律风险防范预案。`;
      } else {
        aiResponse = `针对该项合规问题的阐述逻辑清晰，具有答辩说服力。本次【${mode.name}】专项实训的目标问答轮次已基本完成，你可以随时点击右侧按钮提交答卷并生成复盘报告。`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'judge',
          content: aiResponse,
          time: 0
        }
      ]);
    }, 2200);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Quick suggestion chips for rapid testing
  const quickSuggestions = [
    '我们通过先发工业产线私有数据建立飞轮壁垒，大厂无法获取细分垂直场景的专有训练集。',
    '已与两家行业头部上市企业签署概念验证合作协议，前期定制开发费已到账65万元。',
    '已取得高校科技成果转移办公室正式批件，核心发明专利排他性独占许可已完成公证备案。'
  ];

  return (
    <div className="space-y-4 pb-12">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl p-4 px-6 shadow-xs">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft size={16} />
            </button>
          )}
          <span
            className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border"
            style={{ backgroundColor: mode.bg, color: mode.text, borderColor: mode.border }}
          >
            <mode.icon size={13} />
            {mode.name}舱
          </span>
          <div className="truncate">
            <span className="text-xs font-bold text-slate-900 truncate block sm:inline">
              {project.name}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <span>当前轮次：</span>
            <span className="font-mono font-bold text-indigo-600">第 {roundCount} 轮</span>
          </div>

          <button
            onClick={onFinish}
            className="px-3.5 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <StopCircle size={14} />
            <span>交卷并生成评审报告</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Chat Stage, Right Persona & Focus Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Interactive Chat Stream & Input Area */}
        <div className="lg:col-span-8 flex flex-col bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden h-[74vh]">
          {/* Messages Scroll Area */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-50/40"
          >
            {messages.map((msg) => {
              const isJudge = msg.role === 'judge';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isJudge ? 'justify-start' : 'justify-end'}`}
                >
                  {isJudge && (
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                      <Bot size={18} />
                    </div>
                  )}

                  <div className={`max-w-2xl space-y-1.5 ${isJudge ? '' : 'items-end'}`}>
                    <div className={`flex items-center gap-2 text-[11px] ${isJudge ? 'text-slate-500' : 'justify-end text-slate-400'}`}>
                      {isJudge ? (
                        <>
                          <span className="font-bold text-slate-800">国赛主审评委</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                            {config.difficulty === 'high_pressure' ? '犀利追问' : '标准专家'}
                          </span>
                        </>
                      ) : (
                        <>
                          <span>用时 {msg.time || 45} 秒</span>
                          <span className="font-bold text-indigo-700">项目答辩人</span>
                        </>
                      )}
                    </div>

                    <div
                      className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                        isJudge
                          ? 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-xs'
                          : 'bg-indigo-600 text-white rounded-tr-xs'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>

                  {!isJudge && (
                    <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                      <User size={16} />
                    </div>
                  )}
                </div>
              );
            })}

            {/* AI Streaming Indicator */}
            {isStreaming && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 animate-pulse">
                  <Bot size={18} />
                </div>
                <div className="bg-white border border-slate-200 p-3.5 rounded-2xl rounded-tl-xs text-xs text-slate-500 flex items-center gap-2 shadow-xs">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span>评委正在综合计划书材料推敲论述盲区...</span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Controls Area */}
          <div className="p-4 bg-white border-t border-slate-200 space-y-3">
            {/* Quick response helpers */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px] text-slate-500">
              <span className="shrink-0 text-slate-400 font-medium">快速论据锦囊：</span>
              {quickSuggestions.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setInput((prev) => prev ? `${prev} ${s}` : s)}
                  className="shrink-0 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200 px-2.5 py-1 rounded-lg text-slate-600 transition-colors max-w-xs truncate"
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Countdown timer & progress bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs px-1">
                <div className="flex items-center gap-2">
                  <Clock size={14} className={timeLeft < 30 ? 'text-rose-600' : 'text-slate-400'} />
                  <span className="text-slate-500">答辩倒计时：</span>
                  <span
                    className={`font-mono font-bold text-sm ${
                      timeLeft < 30 ? 'text-rose-600 animate-pulse' : 'text-slate-900'
                    }`}
                  >
                    {formatTime(timeLeft)}
                  </span>
                </div>

                {timeLeft < 30 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                    即将超时，请迅速收敛论点
                  </span>
                )}
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${
                    timeLeft < 30 ? 'bg-rose-500' : 'bg-indigo-600'
                  }`}
                  style={{ width: `${(timeLeft / (config.timeLimit || 90)) * 100}%` }}
                />
              </div>
            </div>

            {/* Audio equalizer animation when recording */}
            <AnimatePresence>
              {isRecording && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 32, opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-indigo-50 border border-indigo-200 rounded-xl px-3 flex items-center gap-3 overflow-hidden"
                >
                  <div className="flex items-end gap-1 h-3.5">
                    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-indigo-600 rounded-full origin-bottom"
                        animate={{ height: ['30%', '100%', '30%'] }}
                        transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.08, ease: 'easeInOut' }}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-medium text-indigo-700">
                    正在模拟语音高保真采集，清晰说出关键壁垒数据...
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Textarea Input and Action Buttons */}
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="在此输入您的答辩回答论述，支持文字陈述或点击麦克风模拟现场语音回答，回车即可提交..."
                className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:bg-white text-slate-900 text-xs sm:text-sm rounded-xl p-3 pr-24 min-h-[84px] max-h-36 resize-none outline-none transition-colors shadow-2xs"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />

              <div className="absolute right-2.5 bottom-2.5 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsRecording(!isRecording)}
                  className={`p-2 rounded-lg border transition-colors ${
                    isRecording
                      ? 'bg-rose-50 border-rose-300 text-rose-600'
                      : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
                  }`}
                  title={isRecording ? '停止模拟录音' : '开启现场录音模拟'}
                >
                  <Mic size={15} />
                </button>

                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!input.trim() || isStreaming}
                  className="p-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-colors"
                >
                  <span>发送</span>
                  <CornerDownLeft size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Persona, Real-time Focus, Early Exit */}
        <div className="lg:col-span-4 space-y-4">
          {/* Judge Persona Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
                当前对席评委人设
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold">
                AI 拟真人格
              </span>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                <mode.icon size={24} className="text-indigo-400" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900">
                  {config.judgeMode === 'panel' ? '国赛专家联合评审席' : '首席主审专家'}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  擅长从产业真实买单意愿、竞品反制能力与法律合规等多角度进行极限施压。
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                    {mode.name}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-medium border border-rose-200">
                    {config.difficulty === 'high_pressure' ? '高压挑剔' : '专业严谨'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Focus Card */}
          <div className="bg-white border border-indigo-100 rounded-2xl p-5 shadow-xs space-y-3 bg-gradient-to-br from-white to-indigo-50/30">
            <div className="flex items-center gap-2 text-indigo-700">
              <Sparkles size={16} />
              <h4 className="text-xs font-bold">实时评审考核焦点</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              系统当前正在重点审查答辩人在面对【市场壁垒与竞品替代风险】时的论证扎实度。建议在陈述中引用已签署的测试合同、保密验证协议或具体量化参数。
            </p>
          </div>

          {/* Practical Tips Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-slate-800">
              <HelpCircle size={15} className="text-slate-400" />
              <h4 className="text-xs font-bold">答辩防守技巧提醒</h4>
            </div>
            <ul className="text-xs text-slate-500 space-y-2 leading-relaxed">
              <li className="flex items-start gap-1.5">
                <span className="text-indigo-600 font-bold">•</span>
                <span>先明确结论再陈述支撑论据，切忌长篇大论绕圈子。</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-indigo-600 font-bold">•</span>
                <span>面对大厂竞争质疑，切勿仅以“我们先做所以有时间差”作答。</span>
              </li>
            </ul>
          </div>

          {/* Finish & Generate Report CTA */}
          <div className="pt-2">
            <button
              onClick={onFinish}
              className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <StopCircle size={15} className="text-rose-400" />
              <span>结束本次实训并生成综合报告</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
