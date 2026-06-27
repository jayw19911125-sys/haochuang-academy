import { useState, useEffect, useRef, useCallback } from "react";
import { Clock, TrendingUp, BookOpen, Timer, BarChart2 } from "lucide-react";

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

export default function LearningTimeTracker({ currentChapterId, currentChapterTitle }: LearningTimeTrackerProps) {
  const [records, setRecords] = useState<TimeRecord[]>(getTimeRecords());
  const [currentSessionTime, setCurrentSessionTime] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Start tracking time for current chapter
  useEffect(() => {
    startTimeRef.current = Date.now();
    setCurrentSessionTime(0);

    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setCurrentSessionTime(elapsed);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      // Save time when leaving chapter
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      if (elapsed > 3) { // Only save if spent more than 3 seconds
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
        setRecords(updatedRecords);
      }
    };
  }, [currentChapterId, currentChapterTitle]);

  const totalLearningTime = records.reduce((sum, r) => sum + r.totalSeconds, 0) + currentSessionTime;
  const totalVisits = records.reduce((sum, r) => sum + r.visitCount, 0);
  const chaptersStudied = records.length;
  const avgTimePerChapter = chaptersStudied > 0 ? Math.floor(totalLearningTime / chaptersStudied) : 0;

  // Find most studied chapter
  const mostStudied = records.length > 0
    ? records.reduce((max, r) => r.totalSeconds > max.totalSeconds ? r : max, records[0])
    : null;

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
                <span className="text-[10px] text-muted-foreground">已學章節</span>
              </div>
              <p className="text-sm font-bold text-foreground font-mono">{chaptersStudied} / 14</p>
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
                <BarChart2 size={12} className="text-purple-400" />
                <span className="text-[10px] text-muted-foreground">總訪問次數</span>
              </div>
              <p className="text-sm font-bold text-foreground font-mono">{totalVisits} 次</p>
            </div>
          </div>

          {/* Chapter Time Breakdown */}
          {records.length > 0 && (
            <div className="space-y-2">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">各章學習時間</p>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {records
                  .sort((a, b) => b.totalSeconds - a.totalSeconds)
                  .map((record) => {
                    const percentage = totalLearningTime > 0 ? (record.totalSeconds / totalLearningTime) * 100 : 0;
                    return (
                      <div key={record.chapterId} className="flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <p className="text-[11px] text-foreground truncate pr-2">
                              {record.chapterTitle.replace(/^[壹貳參肆伍陸柒捌玖拾]+、/, "")}
                            </p>
                            <span className="text-[10px] font-mono text-muted-foreground whitespace-nowrap">
                              {formatTime(record.totalSeconds)}
                            </span>
                          </div>
                          <div className="h-1.5 rounded-full bg-border/30 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-300"
                              style={{ width: `${Math.min(percentage, 100)}%` }}
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

          {/* Most Studied */}
          {mostStudied && (
            <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
              <p className="text-[10px] text-emerald-400 font-medium mb-0.5">花最多時間的章節</p>
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
