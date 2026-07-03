import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Trophy, Clock, Target, Zap, Star, ChevronDown, Link2, Copy, CheckCheck, ExternalLink } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useDeviceId, getSharedDeviceIdFromUrl } from "@/hooks/useDeviceId";

interface MilestoneTask {
  id: string;
  title: string;
  description: string;
  category: "知識" | "實作" | "AI" | "協作";
}

interface MilestoneWeek {
  week: number;
  title: string;
  goal: string;
  tasks: MilestoneTask[];
}

const milestoneData: MilestoneWeek[] = [
  {
    week: 1,
    title: "認知建立期",
    goal: "理解好創的商業模式、工具棧、三大鐵則，能回答「為什麼」",
    tasks: [
      { id: "w1-1", title: "閱讀好創學院第 1-3 章", description: "理解營運底層邏輯、知識地圖、社群飛輪", category: "知識" },
      { id: "w1-2", title: "完成 Monday.com 帳號設定", description: "加入所有相關看板，了解專案管理流程", category: "實作" },
      { id: "w1-3", title: "完成 Slack 頻道加入", description: "加入所有工作頻道，設定通知偏好", category: "協作" },
      { id: "w1-4", title: "用 ChatGPT 整理學習筆記", description: "將第 1-3 章重點整理成自己的語言", category: "AI" },
      { id: "w1-5", title: "能解釋好創三大鐵則", description: "產能防禦、先收錢才開工、工具棧鎖定", category: "知識" },
      { id: "w1-6", title: "能說出 4 人團隊的分工", description: "CEO/COO/剪輯師/企劃各自負責什麼", category: "知識" },
      { id: "w1-7", title: "完成 AI 資安 SOP 閱讀", description: "理解哪些資料可以/不可以餵給 AI", category: "AI" }
    ]
  },
  {
    week: 2,
    title: "技能模仿期",
    goal: "能拆解爆款內容、套用框架產出初稿、使用 AI 工具輔助",
    tasks: [
      { id: "w2-1", title: "閱讀好創學院第 4-7 章", description: "企劃教學、短影音工作流、剪輯師教學、AI 功能指南", category: "知識" },
      { id: "w2-2", title: "拆解 5 支爆款短影音", description: "用武器六分析 Hook/Body/CTA 結構", category: "實作" },
      { id: "w2-3", title: "用 AI 產出 10 個 Hook", description: "用武器二批量生成開場 Hook", category: "AI" },
      { id: "w2-4", title: "完成第一份腳本初稿", description: "選定一個主題，用 Hook-Body-CTA 框架寫出完整腳本", category: "實作" },
      { id: "w2-5", title: "學會 CapCut 基礎剪輯", description: "能獨立完成一支 30 秒短影音的剪輯", category: "實作" },
      { id: "w2-6", title: "了解多平台差異", description: "TikTok vs Reels vs Shorts 的內容策略差異", category: "知識" },
      { id: "w2-7", title: "完成第一次企劃提案", description: "向 COO 提交一份完整的內容企劃方案", category: "協作" }
    ]
  },
  {
    week: 3,
    title: "獨立執行期",
    goal: "能獨立完成「有模板可循」的任務，不需要逐步指導",
    tasks: [
      { id: "w3-1", title: "閱讀好創學院第 8-11 章", description: "Manus 自動化、AI Prompt 兵器庫、報到清單、私域轉化", category: "知識" },
      { id: "w3-2", title: "獨立完成 3 支短影音腳本", description: "從選題到完稿，不需要主管逐步指導", category: "實作" },
      { id: "w3-3", title: "用 Manus 批量生成內容", description: "實際操作 Manus 自動化工作流", category: "AI" },
      { id: "w3-4", title: "完成一次客戶內容排程", description: "在 Monday.com 上完成一週的內容排程", category: "協作" },
      { id: "w3-5", title: "能解釋演算法核心指標", description: "完播率、複看率、互動品質的運作原理", category: "知識" },
      { id: "w3-6", title: "獨立處理一次客戶修改需求", description: "收到客戶反饋後，獨立完成修改", category: "協作" },
      { id: "w3-7", title: "完成 AI 工作流效率對比", description: "記錄有/無 AI 輔助的時間差異", category: "AI" }
    ]
  },
  {
    week: 4,
    title: "策略思考期",
    goal: "能判斷「什麼值得做」，具備基礎的商業判斷力",
    tasks: [
      { id: "w4-1", title: "閱讀好創學院第 12-14 章", description: "多平台策略、AI 工具矩陣、演算法完整認知", category: "知識" },
      { id: "w4-2", title: "獨立制定一週內容策略", description: "選題、排程、平台分配、預期成效", category: "實作" },
      { id: "w4-3", title: "完成一次數據分析報告", description: "分析過去一週的內容成效，提出優化建議", category: "實作" },
      { id: "w4-4", title: "能判斷案子值不值得接", description: "根據產能防禦機制，評估新案子的可行性", category: "知識" },
      { id: "w4-5", title: "完成 30 天學習總結", description: "整理所有學習成果，提交給 COO 審核", category: "協作" },
      { id: "w4-6", title: "建立個人 AI 工作流", description: "根據自己的工作習慣，建立最適合的 AI 輔助流程", category: "AI" },
      { id: "w4-7", title: "通過新人考核", description: "完成所有章節的自我評估，達到 Level 2 標準", category: "知識" }
    ]
  }
];

const categoryColors: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  "知識": { bg: "bg-blue-500/10", text: "text-blue-400", icon: <Target size={10} /> },
  "實作": { bg: "bg-green-500/10", text: "text-green-400", icon: <Zap size={10} /> },
  "AI": { bg: "bg-purple-500/10", text: "text-purple-400", icon: <Star size={10} /> },
  "協作": { bg: "bg-amber-500/10", text: "text-amber-400", icon: <Clock size={10} /> }
};

export default function MilestoneTracker() {
  const ownDeviceId = useDeviceId();
  // 分享模式：URL 有 ?share=dev_xxx 時讀取分享者的進度（唯讀）
  const sharedDeviceId = getSharedDeviceIdFromUrl();
  const isViewingShared = !!sharedDeviceId;
  const deviceId = sharedDeviceId ?? ownDeviceId;

  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [expandedWeek, setExpandedWeek] = useState<number>(1);
  const [backendLoaded, setBackendLoaded] = useState(false);
  const [showSharePanel, setShowSharePanel] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lastCheckedId, setLastCheckedId] = useState<string | null>(null); // 用於勾選動畫
  const sharePanelRef = useRef<HTMLDivElement>(null);

  const shareUrl = `${window.location.origin}${window.location.pathname}?share=${ownDeviceId}`;

  const handleCopyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = shareUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // 點擊外部關閉分享面板
  useEffect(() => {
    if (!showSharePanel) return;
    const handleClick = (e: MouseEvent) => {
      if (sharePanelRef.current && !sharePanelRef.current.contains(e.target as Node)) {
        setShowSharePanel(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showSharePanel]);

  // 後端讀取
  const { data: backendProgress } = trpc.learning.getMilestoneProgress.useQuery(
    { deviceId: deviceId ?? "" },
    { enabled: !!deviceId, staleTime: 30_000 }
  );

  const toggleMutation = trpc.learning.toggleMilestone.useMutation();
  const syncMutation = trpc.learning.syncMilestones.useMutation();

  // 初始化：後端資料優先，否則用 localStorage
  useEffect(() => {
    if (!deviceId) return;

    if (backendProgress && backendProgress.length > 0 && !backendLoaded) {
      // 後端有資料：以後端為主
      const merged: Record<string, boolean> = {};
      backendProgress.forEach(r => { merged[r.milestoneId] = r.isChecked; });
      setCompletedTasks(merged);
      localStorage.setItem("haochuang-milestone-progress", JSON.stringify(merged));
      setBackendLoaded(true);
    } else if (!backendLoaded) {
      // 後端無資料：從 localStorage 讀取，並同步到後端
      const saved = localStorage.getItem("haochuang-milestone-progress");
      if (saved) {
        try {
          const parsed: Record<string, boolean> = JSON.parse(saved);
          setCompletedTasks(parsed);
          // 將 localStorage 資料同步到後端
          const milestones = milestoneData.flatMap(w =>
            w.tasks.map(t => ({
              milestoneId: t.id,
              weekNumber: w.week,
              isChecked: parsed[t.id] ?? false,
            }))
          );
          syncMutation.mutate({ deviceId, milestones });
        } catch {}
      }
      setBackendLoaded(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backendProgress, deviceId]);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("haochuang-milestone-progress", JSON.stringify(completedTasks));
  }, [completedTasks]);

  const toggleTask = (taskId: string) => {
    // 分享模式下禁止修改
    if (isViewingShared) return;
    const newValue = !completedTasks[taskId];
    setCompletedTasks(prev => ({ ...prev, [taskId]: newValue }));
    // 勾選動畫觸發
    if (newValue) setLastCheckedId(taskId);
    // 同步到後端
    if (ownDeviceId) {
      const weekNumber = milestoneData.find(w => w.tasks.some(t => t.id === taskId))?.week ?? 1;
      toggleMutation.mutate({
        deviceId: ownDeviceId,
        milestoneId: taskId,
        weekNumber,
        isChecked: newValue,
      });
    }
  };

  const getWeekProgress = (week: MilestoneWeek) => {
    const completed = week.tasks.filter(t => completedTasks[t.id]).length;
    return { completed, total: week.tasks.length, percent: Math.round((completed / week.tasks.length) * 100) };
  };

  const getOverallProgress = () => {
    const allTasks = milestoneData.flatMap(w => w.tasks);
    const completed = allTasks.filter(t => completedTasks[t.id]).length;
    return { completed, total: allTasks.length, percent: Math.round((completed / allTasks.length) * 100) };
  };

  const overall = getOverallProgress();

  return (
    <div className="space-y-6">
      {/* 分享模式提示橫幅 */}
      <AnimatePresence>
        {isViewingShared && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs"
          >
            <ExternalLink size={13} />
            <span>目前正在檢視分享進度（唯讀）——要記錄自己的進度，請從主頁進入</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overall Progress Card */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F37021] to-[#FF8C42] flex items-center justify-center">
              <Trophy size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">30 天里程碑總進度</h3>
              <p className="text-[11px] text-muted-foreground">{overall.completed} / {overall.total} 任務已完成</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-2xl font-black text-[#F37021]">{overall.percent}%</div>
            {/* 分享按鈕（非分享模式才顯示） */}
            {!isViewingShared && (
              <div className="relative" ref={sharePanelRef}>
                <button
                  onClick={() => setShowSharePanel(v => !v)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-[#F37021] hover:bg-[#F37021]/10 transition-all duration-200 border border-transparent hover:border-[#F37021]/20"
                  title="產生專屬進度連結"
                >
                  <Link2 size={13} />
                  分享
                </button>
                <AnimatePresence>
                  {showSharePanel && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 4 }}
                      transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
                      className="absolute right-0 top-full mt-2 z-50 w-72 glass-card p-4 shadow-xl"
                      style={{ transformOrigin: "top right" }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Link2 size={14} className="text-[#F37021]" />
                        <span className="text-xs font-semibold text-foreground">專屬進度連結</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mb-3">將這個連結複製到其他裝置，即可繼續追蹤進度。</p>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-border/20 border border-border/30">
                        <span className="flex-1 text-[10px] text-muted-foreground truncate font-mono">{shareUrl}</span>
                        <button
                          onClick={handleCopyShareLink}
                          className={`flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-all duration-200 ${
                            copied
                              ? "bg-green-500/20 text-green-400"
                              : "bg-[#F37021]/20 text-[#F37021] hover:bg-[#F37021]/30"
                          }`}
                        >
                          {copied ? <><CheckCheck size={11} /> 已複製</> : <><Copy size={11} /> 複製</>}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
        
        {/* Progress Bar - 帶動畫的進度條 */}
        <div className="h-2.5 rounded-full bg-border/30 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#F37021] to-[#FF8C42]"
            initial={{ width: 0 }}
            animate={{ width: `${overall.percent}%` }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            style={{ boxShadow: "0 0 12px rgba(243,112,33,0.5)" }}
          />
        </div>
        {/* 進度文字說明 */}
        <div className="flex justify-between mt-1.5">
          <span className="text-[10px] text-muted-foreground">起點</span>
          <span className="text-[10px] text-muted-foreground">
            {overall.percent < 100 ? `還有 ${overall.total - overall.completed} 項任務` : "🎉 全部完成！"}
          </span>
          <span className="text-[10px] text-muted-foreground">筆業</span>
        </div>

        {/* Week Mini Progress */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          {milestoneData.map(week => {
            const wp = getWeekProgress(week);
            return (
              <button
                key={week.week}
                onClick={() => setExpandedWeek(week.week)}
                className={`text-center p-2 rounded-lg transition-all duration-200 ${
                  expandedWeek === week.week 
                    ? "bg-[#F37021]/10 border border-[#F37021]/30" 
                    : "hover:bg-border/20 border border-transparent"
                }`}
              >
                <div className="text-[10px] text-muted-foreground">Week {week.week}</div>
                <div className={`text-xs font-bold mt-0.5 ${wp.percent === 100 ? "text-green-400" : "text-foreground"}`}>
                  {wp.percent}%
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Weekly Sections */}
      {milestoneData.map(week => {
        const wp = getWeekProgress(week);
        const isExpanded = expandedWeek === week.week;

        return (
          <motion.div
            key={week.week}
            className="glass-card overflow-hidden"
            initial={false}
          >
            {/* Week Header */}
            <button
              onClick={() => setExpandedWeek(isExpanded ? 0 : week.week)}
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-border/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                  wp.percent === 100 
                    ? "bg-green-500/20 text-green-400" 
                    : "bg-[#F37021]/10 text-[#F37021]"
                }`}>
                  {wp.percent === 100 ? <Check size={16} /> : `W${week.week}`}
                </div>
                <div className="text-left flex-1">
                  <h4 className="text-sm font-semibold text-foreground">
                    第 {week.week} 週：{week.title}
                  </h4>
                  {/* 週進度條 */}
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1 rounded-full bg-border/30 overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${
                          wp.percent === 100
                            ? "bg-gradient-to-r from-green-500 to-emerald-400"
                            : "bg-gradient-to-r from-[#F37021] to-[#FF8C42]"
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${wp.percent}%` }}
                        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
                      />
                    </div>
                    <span className={`text-[10px] font-medium ${
                      wp.percent === 100 ? "text-green-400" : "text-muted-foreground"
                    }`}>{wp.percent}%</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">{wp.completed}/{wp.total}</span>
                <ChevronDown 
                  size={16} 
                  className={`text-muted-foreground transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} 
                />
              </div>
            </button>

            {/* Tasks */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-4 space-y-2 border-t border-border/20 pt-3">
                    {week.tasks.map((task, i) => {
                      const isChecked = completedTasks[task.id] || false;
                      const cat = categoryColors[task.category];
                      
                      return (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className="flex items-start gap-3 p-3 rounded-lg hover:bg-border/10 transition-colors cursor-pointer group"
                          onClick={() => toggleTask(task.id)}
                        >
                          {/* Checkbox - 勾選時 bounce 動畫 */}
                          <motion.div
                            className={`
                              flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5
                              transition-colors duration-200
                              ${isChecked 
                                ? "bg-[#F37021] border-[#F37021]" 
                                : "border-border/50 group-hover:border-[#F37021]/50"
                              }
                            `}
                            animate={lastCheckedId === task.id ? {
                              scale: [1, 1.3, 0.9, 1.1, 1],
                            } : {}}
                            transition={{ duration: 0.35, ease: "easeOut" }}
                            onAnimationComplete={() => {
                              if (lastCheckedId === task.id) setLastCheckedId(null);
                            }}
                          >
                            <AnimatePresence>
                              {isChecked && (
                                <motion.div
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0, opacity: 0 }}
                                  transition={{ duration: 0.15 }}
                                >
                                  <Check size={12} className="text-white" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-medium transition-all ${isChecked ? "text-muted-foreground line-through" : "text-foreground"}`}>
                                {task.title}
                              </span>
                              <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-medium ${cat.bg} ${cat.text}`}>
                                {cat.icon}
                                {task.category}
                              </span>
                            </div>
                            <p className={`text-[11px] mt-0.5 transition-all ${isChecked ? "text-muted-foreground/50" : "text-muted-foreground"}`}>
                              {task.description}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
