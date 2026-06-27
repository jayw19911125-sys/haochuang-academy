import { useState, useEffect, useMemo } from "react";
import { Trophy, Medal, Crown, Flame, Star, TrendingUp, Clock, Target, ChevronDown, ChevronUp, User } from "lucide-react";

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar?: string;
  chaptersCompleted: number;
  quizScore: number; // average percentage
  totalStudyTime: number; // seconds
  streak: number; // consecutive days
  lastActive: string;
  joinDate: string;
}

const STORAGE_KEY = "haochuang-leaderboard";

// Default team members (pre-populated for demo)
const DEFAULT_ENTRIES: LeaderboardEntry[] = [
  {
    id: "user-self",
    name: "我",
    chaptersCompleted: 0,
    quizScore: 0,
    totalStudyTime: 0,
    streak: 0,
    lastActive: new Date().toISOString(),
    joinDate: new Date().toISOString(),
  },
];

function getLeaderboardData(): LeaderboardEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    
    // Initialize with default + pull from quiz and time data
    const entries = syncSelfData(DEFAULT_ENTRIES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    return entries;
  } catch {
    return DEFAULT_ENTRIES;
  }
}

function syncSelfData(entries: LeaderboardEntry[]): LeaderboardEntry[] {
  const updated = entries.map(entry => {
    if (entry.id !== "user-self") return entry;
    
    // Pull quiz data
    let totalScore = 0;
    let quizCount = 0;
    for (let i = 1; i <= 14; i++) {
      const key = `haochuang-quiz-ch${i}`;
      const data = localStorage.getItem(key);
      if (data) {
        try {
          const parsed = JSON.parse(data);
          if (parsed.passed) {
            totalScore += (parsed.score / parsed.total) * 100;
            quizCount++;
          }
        } catch {}
      }
    }
    
    // Pull learning time data
    let totalTime = 0;
    try {
      const timeData = localStorage.getItem("haochuang-learning-time");
      if (timeData) {
        const records = JSON.parse(timeData);
        totalTime = records.reduce((sum: number, r: { totalSeconds: number }) => sum + r.totalSeconds, 0);
      }
    } catch {}
    
    // Pull streak from learning time
    let streak = 0;
    try {
      const timeData = localStorage.getItem("haochuang-learning-time");
      if (timeData) {
        const records = JSON.parse(timeData);
        const dates = records.map((r: { lastVisited: string }) => new Date(r.lastVisited).toDateString());
        const uniqueDates = Array.from(new Set(dates) as Set<string>).sort((a: string, b: string) => new Date(b).getTime() - new Date(a).getTime());
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
          for (let i = 0; i < uniqueDates.length; i++) {
            const expected = new Date(Date.now() - i * 86400000).toDateString();
            if (uniqueDates[i] === expected) streak++;
            else break;
          }
        }
      }
    } catch {}
    
    return {
      ...entry,
      chaptersCompleted: quizCount,
      quizScore: quizCount > 0 ? Math.round(totalScore / quizCount) : 0,
      totalStudyTime: totalTime,
      streak,
      lastActive: new Date().toISOString(),
    };
  });
  
  return updated;
}

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}秒`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}分`;
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return mins > 0 ? `${hours}h${mins}m` : `${hours}h`;
}

function calculateOverallScore(entry: LeaderboardEntry): number {
  // Weighted score: chapters 40% + quiz 30% + time 20% + streak 10%
  const chapterScore = (entry.chaptersCompleted / 14) * 40;
  const quizScoreNorm = (entry.quizScore / 100) * 30;
  const timeScore = Math.min(entry.totalStudyTime / (14 * 20 * 60), 1) * 20; // 20 min per chapter target
  const streakScore = Math.min(entry.streak / 7, 1) * 10;
  return Math.round(chapterScore + quizScoreNorm + timeScore + streakScore);
}

type SortKey = "overall" | "chapters" | "quiz" | "time" | "streak";

interface AddMemberModalProps {
  onAdd: (name: string) => void;
  onClose: () => void;
}

function AddMemberModal({ onAdd, onClose }: AddMemberModalProps) {
  const [name, setName] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-card p-6 rounded-xl w-80 max-w-[90vw]" onClick={e => e.stopPropagation()}>
        <h3 className="text-sm font-bold text-foreground mb-4">新增團隊成員</h3>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="輸入成員名稱"
          className="w-full px-3 py-2 rounded-lg bg-background/50 border border-border/30 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-[#F37021]/50 mb-4"
          autoFocus
          onKeyDown={e => { if (e.key === "Enter" && name.trim()) { onAdd(name.trim()); } }}
        />
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-3 py-2 rounded-lg text-xs text-muted-foreground border border-border/30 hover:bg-border/20 transition-colors"
          >
            取消
          </button>
          <button
            onClick={() => { if (name.trim()) onAdd(name.trim()); }}
            disabled={!name.trim()}
            className="flex-1 px-3 py-2 rounded-lg text-xs font-medium text-white bg-[#F37021] hover:bg-[#F37021]/90 transition-colors disabled:opacity-40"
          >
            新增
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>(getLeaderboardData());
  const [sortKey, setSortKey] = useState<SortKey>("overall");
  const [showAddModal, setShowAddModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  // Sync self data on mount
  useEffect(() => {
    const synced = syncSelfData(entries);
    setEntries(synced);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(synced));
  }, []);

  const sortedEntries = useMemo(() => {
    const sorted = [...entries].sort((a, b) => {
      switch (sortKey) {
        case "overall": return calculateOverallScore(b) - calculateOverallScore(a);
        case "chapters": return b.chaptersCompleted - a.chaptersCompleted;
        case "quiz": return b.quizScore - a.quizScore;
        case "time": return b.totalStudyTime - a.totalStudyTime;
        case "streak": return b.streak - a.streak;
        default: return 0;
      }
    });
    return sorted;
  }, [entries, sortKey]);

  const handleAddMember = (name: string) => {
    const newEntry: LeaderboardEntry = {
      id: `user-${Date.now()}`,
      name,
      chaptersCompleted: 0,
      quizScore: 0,
      totalStudyTime: 0,
      streak: 0,
      lastActive: new Date().toISOString(),
      joinDate: new Date().toISOString(),
    };
    const updated = [...entries, newEntry];
    setEntries(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setShowAddModal(false);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown size={16} className="text-amber-400" />;
      case 2: return <Medal size={16} className="text-gray-300" />;
      case 3: return <Medal size={16} className="text-amber-700" />;
      default: return <span className="text-[11px] font-mono text-muted-foreground w-4 text-center">{rank}</span>;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1: return "bg-gradient-to-r from-amber-500/10 to-amber-500/5 border-amber-500/30";
      case 2: return "bg-gradient-to-r from-gray-400/10 to-gray-400/5 border-gray-400/20";
      case 3: return "bg-gradient-to-r from-amber-700/10 to-amber-700/5 border-amber-700/20";
      default: return "bg-background/30 border-border/20";
    }
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-border/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg" style={{ boxShadow: '0 0 12px rgba(245,158,11,0.3)' }}>
              <Trophy size={18} className="text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">新人考核排行榜</h3>
              <p className="text-[10px] text-muted-foreground">學習進度 × 測驗成績 × 學習時間 × 連續天數</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-2.5 py-1.5 rounded-lg text-[10px] font-medium text-[#F37021] border border-[#F37021]/30 hover:bg-[#F37021]/10 transition-colors"
            >
              + 新增成員
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-lg hover:bg-border/20 transition-colors"
            >
              {isExpanded ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
            </button>
          </div>
        </div>

        {/* Sort Tabs */}
        {isExpanded && (
          <div className="flex items-center gap-1.5 mt-4 overflow-x-auto pb-1">
            {([
              { key: "overall" as SortKey, label: "綜合分數", icon: Star },
              { key: "chapters" as SortKey, label: "通過章數", icon: Target },
              { key: "quiz" as SortKey, label: "測驗成績", icon: TrendingUp },
              { key: "time" as SortKey, label: "學習時間", icon: Clock },
              { key: "streak" as SortKey, label: "連續天數", icon: Flame },
            ]).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setSortKey(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-medium whitespace-nowrap transition-all duration-200 ${
                  sortKey === key
                    ? "bg-[#F37021]/10 text-[#F37021] border border-[#F37021]/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-border/20 border border-transparent"
                }`}
              >
                <Icon size={11} />
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Leaderboard List */}
      {isExpanded && (
        <div className="p-3 space-y-2">
          {sortedEntries.length === 0 ? (
            <div className="py-8 text-center">
              <Trophy size={32} className="mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">尚無排行數據</p>
              <p className="text-[10px] text-muted-foreground/70 mt-1">完成章節測驗後即可上榜</p>
            </div>
          ) : (
            sortedEntries.map((entry, idx) => {
              const rank = idx + 1;
              const overallScore = calculateOverallScore(entry);
              const isSelf = entry.id === "user-self";
              
              return (
                <div
                  key={entry.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${getRankBg(rank)} ${
                    isSelf ? "ring-1 ring-[#F37021]/30" : ""
                  }`}
                >
                  {/* Rank */}
                  <div className="w-6 flex-shrink-0 flex items-center justify-center">
                    {getRankIcon(rank)}
                  </div>

                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isSelf
                      ? "bg-gradient-to-br from-[#F37021] to-[#FF8C42]"
                      : "bg-gradient-to-br from-gray-600 to-gray-700"
                  }`}>
                    {entry.avatar ? (
                      <img src={entry.avatar} alt={entry.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User size={14} className="text-white" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-xs font-medium truncate ${isSelf ? "text-[#F37021]" : "text-foreground"}`}>
                        {entry.name}
                        {isSelf && <span className="text-[9px] ml-1 text-muted-foreground">(你)</span>}
                      </p>
                      {entry.streak >= 3 && (
                        <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-orange-500/10 border border-orange-500/20">
                          <Flame size={9} className="text-orange-400" />
                          <span className="text-[9px] font-mono text-orange-400">{entry.streak}</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[9px] text-muted-foreground flex items-center gap-1">
                        <Target size={9} /> {entry.chaptersCompleted}/14 章
                      </span>
                      <span className="text-[9px] text-muted-foreground flex items-center gap-1">
                        <TrendingUp size={9} /> {entry.quizScore}%
                      </span>
                      <span className="text-[9px] text-muted-foreground flex items-center gap-1">
                        <Clock size={9} /> {formatTime(entry.totalStudyTime)}
                      </span>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="flex-shrink-0 text-right">
                    <p className={`text-lg font-black font-mono ${
                      rank === 1 ? "text-amber-400" : rank <= 3 ? "text-foreground" : "text-muted-foreground"
                    }`}>
                      {overallScore}
                    </p>
                    <p className="text-[9px] text-muted-foreground">分</p>
                  </div>
                </div>
              );
            })
          )}

          {/* Scoring Explanation */}
          <div className="mt-4 p-3 rounded-lg bg-background/30 border border-border/20">
            <p className="text-[10px] font-medium text-muted-foreground mb-2">計分規則</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[9px] text-muted-foreground">通過章數 40%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-[9px] text-muted-foreground">測驗成績 30%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-[9px] text-muted-foreground">學習時間 20%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                <span className="text-[9px] text-muted-foreground">連續天數 10%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddModal && (
        <AddMemberModal
          onAdd={handleAddMember}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}
