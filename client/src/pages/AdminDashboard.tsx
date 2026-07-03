import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { 
  Users, BookOpen, Trophy, TrendingUp, AlertCircle, 
  CheckCircle2, Clock, Target, BarChart3, Bell, 
  Plus, Trash2, Pin, Eye, EyeOff, LogOut, Lock,
  ChevronDown, ChevronUp, RefreshCw, Download, Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

// ─── 格式化工具 ──────────────────────────────────────────
function formatSeconds(s: number): string {
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.round(s / 60)}m`;
  return `${Math.round(s / 360) / 10}h`;
}

function formatDate(d: Date | string | null): string {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("zh-TW", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function shortDeviceId(id: string): string {
  return id.slice(0, 12) + "...";
}

// ─── 登入 / 權限提示頁面（OAuth）──────────────────────────
function AdminAuthGate({ mode }: { mode: "login" | "forbidden" }) {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center noise-overlay gradient-mesh-bg">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="glass-card p-8 w-full max-w-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F37021] to-[#FF8C42] flex items-center justify-center">
            <Lock size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">管理員後台</h1>
            <p className="text-xs text-muted-foreground">好創學院 Admin Panel</p>
          </div>
        </div>

        {mode === "login" ? (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">
              請先登入，僅限管理員帳號存取後台。
            </p>
            <Button
              className="w-full bg-[#F37021] hover:bg-[#FF8C42] text-white"
              onClick={() => { window.location.href = getLoginUrl(); }}
            >
              前往登入
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-red-400 flex items-center gap-1">
              <AlertCircle size={12} /> 此帳號沒有管理員權限
            </p>
            <p className="text-xs text-muted-foreground">
              如需存取後台，請聯繫網站擁有者將你的帳號設為管理員。
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => { void logout(); }}
            >
              登出並切換帳號
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ─── 統計卡片 ────────────────────────────────────────────
function StatCard({ title, value, sub, icon: Icon, color }: {
  title: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="glass-card p-4">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center`} style={{ backgroundColor: `${color}20` }}>
          <Icon size={18} style={{ color }} />
        </div>
      </div>
      <div className="text-2xl font-black text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{title}</div>
      {sub && <div className="text-[10px] text-muted-foreground/60 mt-0.5">{sub}</div>}
    </div>
  );
}

// ─── 學員列表 ────────────────────────────────────────────
function LearnersTable() {
  const { data, isLoading, refetch } = trpc.admin.getAllLearnersOverview.useQuery();
  const [sortBy, setSortBy] = useState<"compositeScore" | "chaptersCompleted" | "totalLearningHours">("compositeScore");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // 日期範圍篩選 state
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showDateFilter, setShowDateFilter] = useState(false);

  // exportLearnersCsv 使用 adminToken 字段（後端已由 OAuth session 驗證，adminToken 僅為相容性保留）
  const exportCsvQuery = trpc.admin.exportLearnersCsv.useQuery(
    { adminToken: "", dateFrom: dateFrom || undefined, dateTo: dateTo || undefined },
    { enabled: false } // 手動觸發
  );

  const handleExportCsv = async () => {
    setIsExporting(true);
    try {
      const result = await exportCsvQuery.refetch();
      if (result.error) {
        alert("權限不足，請重新登入");
        return;
      }
      if (result.data?.error) {
        alert(`匯出失敗：${result.data.error}`);
        return;
      }
      const csvContent = result.data?.csv ?? "";
      // 空資料時仍輸出標頭 CSV
      const isNoData = csvContent === "" || csvContent.startsWith("無資料");
      const finalCsv = isNoData
        ? "裝置 ID,綜合評分,章節完成數,章節閱讀數,進度%,測驗平均分,測驗通過數,測驗嘗試次數,學習總時間(小時),每日一題已作答,每日一題正確率%,最後活躍時間"
        : csvContent;
      // 檔名加入日期範圍標記
      const rangeTag = dateFrom || dateTo
        ? `_${dateFrom || "start"}_to_${dateTo || "end"}`
        : "";
      const blob = new Blob(["﻿" + finalCsv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `好創學員學習記錄${rangeTag}_${new Date().toLocaleDateString("zh-TW").replace(/\//g, "-")}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(`匯出發生錯誤，請重試：${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsExporting(false);
    }
  };

  const learners = useMemo(() => {
    if (!data?.data) return [];
    return [...data.data].sort((a, b) => (b[sortBy] as number) - (a[sortBy] as number));
  }, [data, sortBy]);

  if (isLoading) return (
    <div className="glass-card p-6 text-center text-muted-foreground text-sm">
      <RefreshCw size={16} className="animate-spin mx-auto mb-2" />
      載入學員資料中...
    </div>
  );

  const totalLearners = learners.length;
  const activeLearners = learners.filter(l => l.chaptersCompleted > 0).length;
  const avgProgress = totalLearners > 0 
    ? Math.round(learners.reduce((s, l) => s + l.progressPercent, 0) / totalLearners) 
    : 0;

  return (
    <div className="space-y-4">
      {/* 摘要統計 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard title="總學員數" value={totalLearners} icon={Users} color="#F37021" />
        <StatCard title="活躍學員" value={activeLearners} sub="已開始學習" icon={TrendingUp} color="#10b981" />
        <StatCard title="平均進度" value={`${avgProgress}%`} icon={Target} color="#6366f1" />
        <StatCard 
          title="全部通過" 
          value={learners.filter(l => l.chaptersCompleted >= 14).length} 
          sub="完成所有章節"
          icon={Trophy} 
          color="#f59e0b" 
        />
      </div>

      {/* 排序控制 */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground">排序：</span>
        {[
          { key: "compositeScore" as const, label: "綜合評分" },
          { key: "chaptersCompleted" as const, label: "章節完成" },
          { key: "totalLearningHours" as const, label: "學習時間" },
        ].map(opt => (
          <button
            key={opt.key}
            onClick={() => setSortBy(opt.key)}
            className={`text-xs px-3 py-1 rounded-full transition-all ${
              sortBy === opt.key 
                ? "bg-[#F37021] text-white" 
                : "glass-card hover:border-[#F37021]/30"
            }`}
          >
            {opt.label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          {/* 日期範圍篩選 */}
          <div className="relative">
            <button
              onClick={() => setShowDateFilter(v => !v)}
              className={`text-xs flex items-center gap-1 px-2 py-1 rounded transition-all ${
                (dateFrom || dateTo)
                  ? "text-blue-400 bg-blue-500/10 border border-blue-500/20"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="日期範圍篩選"
            >
              <Calendar size={12} />
              {(dateFrom || dateTo) ? `${dateFrom || "不限"} ~ ${dateTo || "不限"}` : "日期範圍"}
            </button>
            {showDateFilter && (
              <div className="absolute right-0 top-full mt-1 z-50 glass-card p-3 shadow-xl w-56">
                <div className="text-[11px] text-muted-foreground mb-2">篩選活躍日期範圍</div>
                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] text-muted-foreground">開始日期</label>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={e => setDateFrom(e.target.value)}
                      className="w-full mt-0.5 px-2 py-1 rounded bg-border/20 border border-border/30 text-xs text-foreground focus:outline-none focus:border-[#F37021]/50"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground">結束日期</label>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={e => setDateTo(e.target.value)}
                      className="w-full mt-0.5 px-2 py-1 rounded bg-border/20 border border-border/30 text-xs text-foreground focus:outline-none focus:border-[#F37021]/50"
                    />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => { setDateFrom(""); setDateTo(""); }}
                      className="flex-1 text-[11px] py-1 rounded bg-border/20 hover:bg-border/40 text-muted-foreground transition-colors"
                    >
                      清除
                    </button>
                    <button
                      onClick={() => setShowDateFilter(false)}
                      className="flex-1 text-[11px] py-1 rounded bg-[#F37021]/20 hover:bg-[#F37021]/30 text-[#F37021] transition-colors"
                    >
                      確認
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={handleExportCsv}
            disabled={isExporting}
            className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors disabled:opacity-50"
          >
            {isExporting ? <RefreshCw size={12} className="animate-spin" /> : <Download size={12} />}
            {isExporting ? "匯出中..." : "匯出 CSV"}
          </button>
          <button onClick={() => refetch()} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
            <RefreshCw size={12} /> 刷新
          </button>
        </div>
      </div>

      {/* 學員列表 */}
      <div className="space-y-2">
        {learners.length === 0 ? (
          <div className="glass-card p-8 text-center text-muted-foreground text-sm">
            尚無學員資料
          </div>
        ) : learners.map((learner, idx) => (
          <div key={learner.deviceId} className="glass-card overflow-hidden">
            <button
              onClick={() => setExpandedId(expandedId === learner.deviceId ? null : learner.deviceId)}
              className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/5 transition-colors"
            >
              {/* 排名 */}
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                idx === 0 ? "bg-amber-500/20 text-amber-400" :
                idx === 1 ? "bg-slate-400/20 text-slate-400" :
                idx === 2 ? "bg-orange-700/20 text-orange-600" :
                "bg-border/30 text-muted-foreground"
              }`}>
                {idx + 1}
              </div>

              {/* 裝置 ID */}
              <div className="flex-1 min-w-0">
                <div className="text-xs font-mono text-muted-foreground truncate">{shortDeviceId(learner.deviceId)}</div>
                <div className="text-[10px] text-muted-foreground/60">最後活動：{formatDate(learner.lastActivity)}</div>
              </div>

              {/* 進度條 */}
              <div className="hidden sm:block w-24">
                <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                  <span>{learner.chaptersCompleted}/14 章</span>
                  <span>{learner.progressPercent}%</span>
                </div>
                <div className="h-1.5 bg-border/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#F37021] rounded-full transition-all"
                    style={{ width: `${learner.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* 評分 */}
              <div className="text-right flex-shrink-0">
                <div className="text-sm font-bold text-foreground">{learner.compositeScore}</div>
                <div className="text-[10px] text-muted-foreground">綜合分</div>
              </div>

              <ChevronDown size={14} className={`text-muted-foreground transition-transform ${expandedId === learner.deviceId ? "rotate-180" : ""}`} />
            </button>

            {/* 展開詳情 */}
            <AnimatePresence>
              {expandedId === learner.deviceId && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 pt-0 border-t border-border/20">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                      <div className="text-center p-2 rounded-lg bg-background/30">
                        <div className="text-sm font-bold text-foreground">{learner.avgQuizScore}%</div>
                        <div className="text-[10px] text-muted-foreground">平均測驗分</div>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-background/30">
                        <div className="text-sm font-bold text-foreground">{formatSeconds(learner.totalLearningSeconds)}</div>
                        <div className="text-[10px] text-muted-foreground">學習時間</div>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-background/30">
                        <div className="text-sm font-bold text-foreground">{learner.dailyQuizAnswered}</div>
                        <div className="text-[10px] text-muted-foreground">每日一題</div>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-background/30">
                        <div className="text-sm font-bold text-foreground">{learner.dailyQuizAccuracy}%</div>
                        <div className="text-[10px] text-muted-foreground">每日正確率</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 章節完成率 ──────────────────────────────────────────
function ChapterStats() {
  const { data: stats, isLoading } = trpc.admin.getChapterCompletionStats.useQuery();

  if (isLoading) return (
    <div className="glass-card p-6 text-center text-muted-foreground text-sm">
      <RefreshCw size={16} className="animate-spin mx-auto mb-2" />
      載入章節統計中...
    </div>
  );

  return (
    <div className="space-y-2">
      {(!stats || stats.length === 0) ? (
        <div className="glass-card p-8 text-center text-muted-foreground text-sm">尚無章節資料</div>
      ) : stats.map(s => (
        <div key={s.chapterId} className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-xs font-mono text-muted-foreground">{s.chapterId}</span>
              <span className="text-sm font-medium text-foreground ml-2">{s.chapterTitle || s.chapterId}</span>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-[10px]">閱讀 {s.readRate}%</Badge>
              <Badge variant="outline" className={`text-[10px] ${s.passRate >= 60 ? "border-emerald-500/40 text-emerald-400" : "border-amber-500/40 text-amber-400"}`}>
                通過 {s.passRate}%
              </Badge>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-2">
            <div className="text-center">
              <div className="text-sm font-bold text-foreground">{s.totalLearners}</div>
              <div className="text-[10px] text-muted-foreground">學員</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-foreground">{s.avgScore}%</div>
              <div className="text-[10px] text-muted-foreground">平均分</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-foreground">{s.avgAttempts}x</div>
              <div className="text-[10px] text-muted-foreground">平均嘗試</div>
            </div>
          </div>
          {/* 通過率進度條 */}
          <div className="mt-2 h-1 bg-border/30 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all"
              style={{ 
                width: `${s.passRate}%`,
                backgroundColor: s.passRate >= 60 ? "#10b981" : "#f59e0b"
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── 難題分析 ────────────────────────────────────────────
function HardQuestions() {
  const { data: questions, isLoading } = trpc.admin.getHardQuestions.useQuery();

  if (isLoading) return (
    <div className="glass-card p-6 text-center text-muted-foreground text-sm">
      <RefreshCw size={16} className="animate-spin mx-auto mb-2" />
      分析中...
    </div>
  );

  return (
    <div className="space-y-3">
      {(!questions || questions.length === 0) ? (
        <div className="glass-card p-8 text-center text-muted-foreground text-sm">尚無錯題資料</div>
      ) : questions.map((q, idx) => (
        <div key={q.questionId} className="glass-card p-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
              {idx + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono text-muted-foreground">{q.chapterId}</span>
                <Badge variant="outline" className="text-[10px] border-red-500/30 text-red-400">
                  錯 {q.wrongCount} 次
                </Badge>
              </div>
              <p className="text-sm text-foreground">{q.questionText}</p>
              {q.explanation && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{q.explanation}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── 公告管理 ────────────────────────────────────────────
function AnnouncementManager() {
  const utils = trpc.useUtils();
  const { data: announcements, isLoading } = trpc.admin.getAnnouncements.useQuery();
  const createMutation = trpc.admin.createAnnouncement.useMutation({
    onSuccess: () => {
      utils.admin.getAnnouncements.invalidate();
      setNewTitle("");
      setNewContent("");
      setShowForm(false);
    }
  });
  const toggleMutation = trpc.admin.toggleAnnouncement.useMutation({
    onSuccess: () => utils.admin.getAnnouncements.invalidate()
  });

  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newType, setNewType] = useState<"info" | "warning" | "success" | "urgent">("info");
  const [isPinned, setIsPinned] = useState(false);

  const handleCreate = () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    createMutation.mutate({
      title: newTitle,
      content: newContent,
      type: newType,
      isPinned,
    });
  };

  const typeColors = {
    info: "#6366f1",
    warning: "#f59e0b",
    success: "#10b981",
    urgent: "#ef4444",
  };

  return (
    <div className="space-y-4">
      {/* 新增公告按鈕 */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="w-full glass-card p-3 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:border-[#F37021]/30 transition-all"
      >
        <Plus size={16} className="text-[#F37021]" />
        新增公告
      </button>

      {/* 新增表單 */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-card p-4 space-y-3">
              <Input
                placeholder="公告標題..."
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="bg-background/50"
              />
              <Textarea
                placeholder="公告內容..."
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                className="bg-background/50 min-h-[80px]"
              />
              <div className="flex items-center gap-3 flex-wrap">
                <select
                  value={newType}
                  onChange={e => setNewType(e.target.value as typeof newType)}
                  className="text-xs bg-background/50 border border-border rounded-lg px-2 py-1.5"
                >
                  <option value="info">一般資訊</option>
                  <option value="warning">注意事項</option>
                  <option value="success">好消息</option>
                  <option value="urgent">緊急通知</option>
                </select>
                <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPinned}
                    onChange={e => setIsPinned(e.target.checked)}
                    className="rounded"
                  />
                  置頂
                </label>
                <Button
                  onClick={handleCreate}
                  size="sm"
                  className="ml-auto bg-[#F37021] hover:bg-[#FF8C42] text-white"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? "發布中..." : "發布"}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 公告列表 */}
      {isLoading ? (
        <div className="glass-card p-6 text-center text-muted-foreground text-sm">載入中...</div>
      ) : (!announcements || announcements.length === 0) ? (
        <div className="glass-card p-8 text-center text-muted-foreground text-sm">尚無公告</div>
      ) : announcements.map(ann => (
        <div key={ann.id} className={`glass-card p-4 ${!ann.isActive ? "opacity-50" : ""}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {ann.isPinned && <Pin size={12} className="text-[#F37021] flex-shrink-0" />}
                <Badge 
                  variant="outline" 
                  className="text-[10px]"
                  style={{ borderColor: `${typeColors[ann.type as keyof typeof typeColors]}40`, color: typeColors[ann.type as keyof typeof typeColors] }}
                >
                  {ann.type === "info" ? "資訊" : ann.type === "warning" ? "注意" : ann.type === "success" ? "好消息" : "緊急"}
                </Badge>
                <span className="text-[10px] text-muted-foreground">{formatDate(ann.createdAt)}</span>
              </div>
              <div className="text-sm font-medium text-foreground">{ann.title}</div>
              <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{ann.content}</div>
            </div>
            <button
              onClick={() => toggleMutation.mutate({ id: ann.id, isActive: !ann.isActive })}
              className="flex-shrink-0 p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              {ann.isActive ? <Eye size={14} className="text-emerald-400" /> : <EyeOff size={14} className="text-muted-foreground" />}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── 主後台頁面 ──────────────────────────────────────────
export default function AdminDashboard() {
  const { user, loading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"learners" | "chapters" | "questions" | "announcements">("learners");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center noise-overlay gradient-mesh-bg">
        <div className="glass-card p-6 text-center text-muted-foreground text-sm">
          <RefreshCw size={16} className="animate-spin mx-auto mb-2" />
          驗證身分中...
        </div>
      </div>
    );
  }

  if (!user) {
    return <AdminAuthGate mode="login" />;
  }

  if (user.role !== "admin") {
    return <AdminAuthGate mode="forbidden" />;
  }

  const tabs = [
    { key: "learners" as const, label: "學員總覽", icon: Users },
    { key: "chapters" as const, label: "章節統計", icon: BookOpen },
    { key: "questions" as const, label: "難題分析", icon: BarChart3 },
    { key: "announcements" as const, label: "公告管理", icon: Bell },
  ];

  return (
    <div className="min-h-screen noise-overlay gradient-mesh-bg">
      {/* 頂部導航 */}
      <div className="sticky top-0 z-40 glass-card border-0 border-b border-border/30 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F37021] to-[#FF8C42] flex items-center justify-center">
              <Lock size={14} className="text-white" />
            </div>
            <div>
              <span className="text-sm font-bold text-foreground">管理員後台</span>
              <span className="text-[10px] text-muted-foreground ml-2">好創學院</span>
            </div>
          </div>
          <button
            onClick={() => { void logout(); }}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut size={14} />
            登出
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Tab 導航 */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? "bg-[#F37021] text-white"
                  : "glass-card hover:border-[#F37021]/30 text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* 內容區 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "learners" && <LearnersTable />}
            {activeTab === "chapters" && <ChapterStats />}
            {activeTab === "questions" && <HardQuestions />}
            {activeTab === "announcements" && <AnnouncementManager />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
