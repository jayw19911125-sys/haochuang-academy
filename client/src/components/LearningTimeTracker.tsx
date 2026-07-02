import { useState, useEffect, useRef, useCallback } from "react";
import { Clock, TrendingUp, BookOpen, Timer, BarChart2, Flame, Award } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useDeviceId } from "@/hooks/useDeviceId";

interface TimeRecord {
  chapterId: string;
  chapterTitle: string;
  totalSeconds: number;
  lastVisited: string;
  visitCount: number;
}

interface LearningTimeTrackerProps {
  currentChapterId: string;
  currentChapterTitle: string;
}

const STORAGE_KEY = "haochuang-learning-time";
const TOTAL_CHAPTERS = 14;

// Recommended time per chapter (in minutes)
const RECOMMENDED_TIME: Record<string, number> = {
  ch1: 10, ch2: 15, ch3: 20, ch4: 30, ch5: 25,
  ch6: 20, ch7: 25, ch8: 20, ch9: 15, ch10: 20,
  ch11: 25, ch12: 30, ch13: 20, ch14: 15,
};

function getTimeRecords(): TimeRecord[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveTimeRecords(records: TimeRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}秒`;
  if (seconds < 3600) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}分${secs}秒` : `${mins}分鐘`;
  }
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return mins > 0 ? `${hours}小時${mins}分` : `${hours}小時`;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "今天";
  if (days === 1) return "昨天";
  if (days < 7) return `${days}天前`;
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

// Calculate streak days
function getStreakDays(records: TimeRecord[]): number {
  if (records.length === 0) return 0;
  const dates = records.map(r => new Date(r.lastVisited).toDateString());
  const uniqueDates = Array.from(new Set(dates)).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  
  let streak = 0;
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  
  if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) return 0;
  
  for (let i = 0; i < uniqueDates.length; i++) {
    const expected = new Date(Date.now() - i * 86400000).toDateString();
    if (uniqueDates[i] === expected) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export default function LearningTimeTracker({ currentChapterId, currentChapterTitle }: LearningTimeTrackerProps) {
  const deviceId = useDeviceId();
  const updateReadTimeMutation = trpc.learning.updateReadTime.useMutation();
  const [records, setRecords] = useState<TimeRecord[]>(getTimeRecords());
  const [currentSessionTime, setCurrentSessionTime] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const deviceIdRef = useRef<string | null>(null);
  const currentChapterIdRef = useRef<string>(currentChapterId);
  useEffect(() => { deviceIdRef.current = deviceId; }, [deviceId]);
  useEffect(() => { currentChapterIdRef.current = currentChapterId; }, [currentChapterId]);

  // 可靠 flush 函數（共用於 cleanup / visibilitychange / beforeunload）
  const flushTimeRef = useRef<() => void>(() => {});

  // Start tracking time for current chapter
  useEffect(() => {
    startTimeRef.current = Date.now();
    setCurrentSessionTime(0);

    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setCurrentSessionTime(elapsed);
    }, 1000);

    const flush = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      if (elapsed > 3) {
        const updatedRecords = getTimeRecords();
        const existingIdx = updatedRecords.findIndex(r => r.chapterId === currentChapterId);
        if (existingIdx >= 0) {
          updatedRecords[existingIdx].totalSeconds += elapsed;
          updatedRecords[existingIdx].lastVisited = new Date().toISOString();
          updatedRecords[existingIdx].visitCount += 1;
        } else {
          updatedRecords.push({
            chapterId: currentChapterId,
            chapterTitle: currentChapterTitle,
            totalSeconds: elapsed,
            lastVisited: new Date().toISOString(),
            visitCount: 1,
          });
        }
        saveTimeRecords(updatedRecords);
        setRecords([...updatedRecords]);
        // 同步到後端
        if (deviceIdRef.current) {
          updateReadTimeMutation.mutate({
            deviceId: deviceIdRef.current,
            chapterId: currentChapterId,
            seconds: elapsed,
          });
        }
        // 重置計時器（避免重複計算）
        startTimeRef.current = Date.now();
      }
    };
    flushTimeRef.current = flush;

    return () => { flush(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChapterId, currentChapterTitle]);

  // 頁面隱藏（切換標籤頁）時也就地儲存
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        flushTimeRef.current();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const totalLearningTime = records.reduce((sum, r) => sum + r.totalSeconds, 0) + currentSessionTime;
  const totalVisits = records.reduce((sum, r) => sum + r.visitCount, 0);
  const chaptersStudied = records.length;
  const avgTimePerChapter = chaptersStudied > 0 ? Math.floor(totalLearningTime / chaptersStudied) : 0;
  const streakDays = getStreakDays(records);
  const completionRate = Math.round((chaptersStudied / TOTAL_CHAPTERS) * 100);

  // Find most studied chapter
  const mostStudied = records.length > 0
    ? records.reduce((max, r) => r.totalSeconds > max.totalSeconds ? r : max, records[0])
    : null;

  // Calculate current chapter progress vs recommended
  const currentRecord = records.find(r => r.chapterId === currentChapterId);
  const currentTotalTime = (currentRecord?.totalSeconds || 0) + currentSessionTime;
  const recommendedTime = (RECOMMENDED_TIME[currentChapterId] || 20) * 60;
  const chapterProgress = Math.min((currentTotalTime / recommendedTime) * 100, 100);

  return (
    <div className="glass-card p-4 rounded-xl">
      {/* Header with live timer */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <Clock size={16} className="text-emerald-400" />
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold text-foreground">學習時間追蹤</p>
            <p className="text-[10px] text-muted-foreground">
              本章已學習 <span className="text-emerald-400 font-mono">{formatTime(currentSessionTime)}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {streakDays > 0 && (
            <div className="px-2 py-1 rounded-md bg-orange-500/10 border border-orange-500/20 flex items-center gap-1">
              <Flame size={10} className="text-orange-400" />
              <span className="text-[10px] font-mono text-orange-400">{streakDays}天</span>
            </div>
          )}
          <div className="px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-[10px] font-mono text-emerald-400">
              總計 {formatTime(totalLearningTime)}
            </span>
          </div>
          <svg
            className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Current Chapter Progress Bar - hidden on mobile when collapsed */}
      <div className={`mt-3 pt-3 border-t border-border/20 ${!isExpanded ? 'hidden sm:block' : ''}`}>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-muted-foreground">本章建議學習時間</span>
          <span className="text-[10px] font-mono text-muted-foreground">
            {formatTime(currentTotalTime)} / {formatTime(recommendedTime)}
          </span>
        </div>
        <div className="h-2 rounded-full bg-border/30 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              chapterProgress >= 100
                ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                : chapterProgress >= 60
                ? "bg-gradient-to-r from-blue-500 to-cyan-400"
                : "bg-gradient-to-r from-amber-500 to-orange-400"
            }`}
            style={{ width: `${chapterProgress}%` }}
          />
        </div>
        {chapterProgress >= 100 && (
          <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
            <Award size={10} /> 已達建議學習時間
          </p>
        )}
      </div>

      {/* Expanded Stats */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-border/30 space-y-4">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-background/50 border border-border/20">
              <div className="flex items-center gap-1.5 mb-1">
                <Timer size={12} className="text-emerald-400" />
                <span className="text-[10px] text-muted-foreground">總學習時間</span>
              </div>
              <p className="text-sm font-bold text-foreground font-mono">{formatTime(totalLearningTime)}</p>
            </div>
            <div className="p-3 rounded-lg bg-background/50 border border-border/20">
              <div className="flex items-center gap-1.5 mb-1">
                <BookOpen size={12} className="text-blue-400" />
                <span className="text-[10px] text-muted-foreground">完成進度</span>
              </div>
              <p className="text-sm font-bold text-foreground font-mono">{completionRate}%</p>
            </div>
            <div className="p-3 rounded-lg bg-background/50 border border-border/20">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingUp size={12} className="text-amber-400" />
                <span className="text-[10px] text-muted-foreground">平均每章</span>
              </div>
              <p className="text-sm font-bold text-foreground font-mono">{formatTime(avgTimePerChapter)}</p>
            </div>
            <div className="p-3 rounded-lg bg-background/50 border border-border/20">
              <div className="flex items-center gap-1.5 mb-1">
                <Flame size={12} className="text-orange-400" />
                <span className="text-[10px] text-muted-foreground">連續學習</span>
              </div>
              <p className="text-sm font-bold text-foreground font-mono">{streakDays} 天</p>
            </div>
          </div>

          {/* Visual Bar Chart */}
          {records.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">各章學習時間分佈</p>
                <p className="text-[10px] text-muted-foreground">{chaptersStudied} / {TOTAL_CHAPTERS} 章</p>
              </div>
              
              {/* Bar Chart Visualization */}
              <div className="flex items-end gap-1 h-24 px-2">
                {Array.from({ length: TOTAL_CHAPTERS }, (_, i) => {
                  const chId = `ch${i + 1}`;
                  const record = records.find(r => r.chapterId === chId);
                  const time = record?.totalSeconds || 0;
                  const maxTime = Math.max(...records.map(r => r.totalSeconds), 1);
                  const height = time > 0 ? Math.max((time / maxTime) * 100, 8) : 4;
                  const isCurrentChapter = chId === currentChapterId;
                  const recommended = (RECOMMENDED_TIME[chId] || 20) * 60;
                  const isComplete = time >= recommended;
                  
                  return (
                    <div key={chId} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className={`w-full rounded-t-sm transition-all duration-300 ${
                          isCurrentChapter
                            ? "bg-[#F37021] shadow-[0_0_8px_rgba(243,112,33,0.4)]"
                            : isComplete
                            ? "bg-emerald-500/80"
                            : time > 0
                            ? "bg-blue-500/60"
                            : "bg-border/30"
                        }`}
                        style={{ height: `${height}%`, minHeight: "3px" }}
                        title={`第${i + 1}章: ${formatTime(time)}`}
                      />
                      <span className={`text-[8px] ${isCurrentChapter ? "text-[#F37021] font-bold" : "text-muted-foreground/50"}`}>
                        {i + 1}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 justify-center">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm bg-[#F37021]" />
                  <span className="text-[9px] text-muted-foreground">目前章節</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500/80" />
                  <span className="text-[9px] text-muted-foreground">已達標</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm bg-blue-500/60" />
                  <span className="text-[9px] text-muted-foreground">學習中</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm bg-border/30" />
                  <span className="text-[9px] text-muted-foreground">未開始</span>
                </div>
              </div>
            </div>
          )}

          {/* Detailed Chapter List */}
          {records.length > 0 && (
            <div className="space-y-2">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">詳細記錄</p>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {records
                  .sort((a, b) => b.totalSeconds - a.totalSeconds)
                  .map((record) => {
                    const recommended = (RECOMMENDED_TIME[record.chapterId] || 20) * 60;
                    const progress = Math.min((record.totalSeconds / recommended) * 100, 100);
                    const isComplete = record.totalSeconds >= recommended;
                    return (
                      <div key={record.chapterId} className="flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <p className="text-[11px] text-foreground truncate pr-2 flex items-center gap-1.5">
                              {isComplete && <Award size={10} className="text-emerald-400 flex-shrink-0" />}
                              {record.chapterTitle.replace(/^[壹貳參肆伍陸柒捌玖拾]+、/, "")}
                            </p>
                            <span className="text-[10px] font-mono text-muted-foreground whitespace-nowrap">
                              {formatTime(record.totalSeconds)}
                            </span>
                          </div>
                          <div className="h-1.5 rounded-full bg-border/30 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                isComplete
                                  ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                                  : "bg-gradient-to-r from-blue-500 to-cyan-400"
                              }`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-[9px] text-muted-foreground/70 whitespace-nowrap">
                          {formatDate(record.lastVisited)}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Achievement Badge */}
          {mostStudied && (
            <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
              <p className="text-[10px] text-emerald-400 font-medium mb-0.5">🏆 花最多時間的章節</p>
              <p className="text-xs text-foreground">
                {mostStudied.chapterTitle.replace(/^[壹貳參肆伍陸柒捌玖拾]+、/, "")}
                <span className="text-muted-foreground ml-2">
                  ({formatTime(mostStudied.totalSeconds)}，{mostStudied.visitCount} 次訪問)
                </span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
