import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Layers, Target, Rocket, Film, Zap, Brain, 
  BarChart3, Users, X, ExternalLink, Trophy, BookMarked, Sun, Moon,
  FileText, Shield, FileSignature, Medal, Sparkles, CheckCircle2, Circle, BookOpen
} from "lucide-react";
import { chapters } from "@/lib/data";
import { useTheme } from "@/contexts/ThemeContext";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Layers, Target, Rocket, Film, Zap, Brain, BarChart3, Users
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeChapter: number;
  onChapterSelect: (idx: number) => void;
  onShowDocs?: () => void;
  progress: number;
  chapterCompletion?: Record<string, boolean>;
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-border/10 hover:bg-border/20 border border-border/20 transition-all duration-200 group"
    >
      <div className="flex items-center gap-2">
        {theme === "dark" ? (
          <Moon size={14} className="text-blue-400" />
        ) : (
          <Sun size={14} className="text-amber-400" />
        )}
        <span className="text-[11px] text-muted-foreground group-hover:text-foreground transition-colors">
          {theme === "dark" ? "暗色模式" : "亮色模式"}
        </span>
      </div>
      <div className={`w-8 h-4 rounded-full relative transition-colors duration-200 ${
        theme === "dark" ? "bg-blue-500/30" : "bg-amber-500/30"
      }`}>
        <div className={`absolute top-0.5 w-3 h-3 rounded-full transition-all duration-200 ${
          theme === "dark" ? "left-0.5 bg-blue-400" : "left-[18px] bg-amber-400"
        }`} />
      </div>
    </button>
  );
}

function WrongNotebookButton() {
  const [count, setCount] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const updateCount = () => {
      const stored = localStorage.getItem("haochuang-wrong-notes");
      if (stored) {
        const notes = JSON.parse(stored);
        setCount(notes.length);
      } else {
        setCount(0);
      }
    };
    updateCount();
    window.addEventListener("wrong-notes-updated", updateCount);
    window.addEventListener("storage", updateCount);
    return () => {
      window.removeEventListener("wrong-notes-updated", updateCount);
      window.removeEventListener("storage", updateCount);
    };
  }, []);

  if (count === 0) return null;

  const scrollToQuiz = () => {
    // 滾動到每日一題區塊（錯題本在 QuizModule 內）
    const el = document.getElementById("daily-quiz");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <button
      onClick={scrollToQuiz}
      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/20 hover:border-amber-500/30 transition-all duration-200 group active:scale-[0.97]"
    >
      <div className="flex items-center gap-2">
        <BookOpen size={14} className="text-amber-400" />
        <span className="text-[11px] text-amber-400/90 group-hover:text-amber-400 font-medium transition-colors">
          我的錯題本
        </span>
      </div>
      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 font-semibold">
        {count}
      </span>
    </button>
  );
}

export default function Sidebar({ isOpen, onClose, activeChapter, onChapterSelect, onShowDocs, progress, chapterCompletion = {} }: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 bottom-0 z-40 w-72
          bg-sidebar/95 backdrop-blur-xl
          border-r border-sidebar-border
          transform transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo Area */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#F37021] to-[#FF8C42] flex items-center justify-center shadow-lg" style={{ boxShadow: '0 0 20px rgba(243,112,33,0.3)' }}>
              <span className="text-white font-black text-lg">H</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground tracking-tight">好創學院</h1>
              <p className="text-[10px] text-muted-foreground tracking-wider uppercase">Training System v3.0</p>
            </div>
          </div>
          
          {/* Overall Learning Progress - 整體學習進度條 */}
          <div className="mt-4">
            {(() => {
              const totalChapters = 14;
              const completedCount = chapterCompletion 
                ? Object.values(chapterCompletion).filter(Boolean).length 
                : 0;
              const percentage = Math.round((completedCount / totalChapters) * 100);
              
              // 里程碑鼓勵提示
              const getMilestoneMessage = () => {
                if (completedCount === totalChapters) return { text: "✨ 全部完成！你已經是好創即戰力！", color: "text-emerald-400", glow: true };
                if (completedCount >= 12) return { text: "🔥 就差最後一哩路！", color: "text-emerald-400", glow: false };
                if (completedCount >= 10) return { text: "🚀 已過 70%，即將畢業！", color: "text-blue-400", glow: false };
                if (completedCount >= 7) return { text: "💪 過半了！繼續保持", color: "text-amber-400", glow: false };
                if (completedCount >= 4) return { text: "⚡ 很好的節奏，繼續前進", color: "text-amber-400/70", glow: false };
                if (completedCount >= 1) return { text: "🌱 已起步，加油！", color: "text-muted-foreground", glow: false };
                return { text: "開始你的學習之旅", color: "text-muted-foreground/60", glow: false };
              };
              const milestone = getMilestoneMessage();
              
              return (
                <>
                  {/* 進度數字 + 標題 */}
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">學習進度</span>
                    <motion.span 
                      key={percentage}
                      initial={{ opacity: 0, y: -8, scale: 1.2 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="text-[11px] font-bold font-mono text-[#F37021]"
                    >
                      {percentage}%
                    </motion.span>
                  </div>
                  
                  {/* 進度條 - 帶發光效果 */}
                  <div className="relative h-2 bg-border/20 rounded-full overflow-hidden">
                    <motion.div 
                      className="absolute inset-y-0 left-0 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ 
                        duration: 0.8, 
                        ease: [0.23, 1, 0.32, 1],
                        delay: 0.1
                      }}
                      style={{
                        background: percentage === 100 
                          ? "linear-gradient(90deg, #10b981, #34d399, #6ee7b7)" 
                          : percentage >= 50 
                            ? "linear-gradient(90deg, #F37021, #FF8C42, #FFB347)" 
                            : "linear-gradient(90deg, #F37021, #FF8C42)",
                        boxShadow: percentage > 0 ? "0 0 8px rgba(243, 112, 33, 0.4)" : "none"
                      }}
                    />
                    {/* 進度條尾端發光點 */}
                    {percentage > 0 && percentage < 100 && (
                      <motion.div
                        className="absolute top-0 bottom-0 w-2 rounded-full bg-white/40"
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        style={{ left: `calc(${percentage}% - 4px)` }}
                      />
                    )}
                  </div>
                  
                  {/* 里程碑提示 + 章節計數 */}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[9px] text-muted-foreground/60">
                      已通過 {completedCount} / {totalChapters} 章
                    </span>
                    <motion.span 
                      key={milestone.text}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                      className={`text-[9px] font-medium ${milestone.color} ${milestone.glow ? "animate-pulse" : ""}`}
                    >
                      {milestone.text}
                    </motion.span>
                  </div>
                  
                  {/* 章節小圓點進度指示器 */}
                  <div className="flex items-center gap-[3px] mt-2.5">
                    {Array.from({ length: totalChapters }).map((_, i) => {
                      const chapterIds = Object.keys(chapterCompletion || {});
                      const allChapterIds = chapters.map(c => c.id);
                      const isComplete = chapterCompletion?.[allChapterIds[i]] === true;
                      return (
                        <motion.div
                          key={i}
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: i * 0.03, duration: 0.2 }}
                          className={`flex-1 h-[3px] rounded-full transition-all duration-500 ${
                            isComplete 
                              ? "bg-emerald-400 shadow-[0_0_4px_rgba(52,211,153,0.5)]" 
                              : "bg-border/30"
                          }`}
                        />
                      );
                    })}
                  </div>
                </>
              );
            })()}
          </div>
        </div>

        {/* Chapter List */}
        <nav className="p-3 overflow-y-auto" style={{ height: 'calc(100vh - 200px - 100px)' }}>
          <ul className="space-y-1">
            {chapters.map((chapter, idx) => {
              const Icon = iconMap[chapter.icon] || Layers;
              const isActive = idx === activeChapter;
              const isCompleted = chapterCompletion[chapter.id] === true;
              
              return (
                <li key={chapter.id}>
                  <button
                    onClick={() => onChapterSelect(idx)}
                    className={`
                      w-full text-left px-3 py-2.5 rounded-lg
                      transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]
                      group relative overflow-hidden
                      ${isActive 
                        ? "bg-[#F37021]/10 border border-[#F37021]/30" 
                        : isCompleted
                          ? "bg-emerald-500/5 border border-emerald-500/20 hover:bg-emerald-500/10"
                          : "hover:bg-sidebar-accent border border-transparent"
                      }
                    `}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeChapter"
                        className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#F37021] rounded-r"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <div className="flex items-center gap-2.5">
                      {isCompleted ? (
                        <CheckCircle2 
                          size={16} 
                          className="text-emerald-500 shrink-0" 
                        />
                      ) : (
                        <Icon 
                          size={16} 
                          className={`transition-colors shrink-0 ${isActive ? "text-[#F37021]" : "text-muted-foreground group-hover:text-foreground"}`} 
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-medium truncate transition-colors ${isCompleted ? "text-emerald-400" : isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}>
                          {chapter.title.replace(/^[壹貳參肆伍陸柒捌玖拾]、/, "")}
                        </p>
                        <p className="text-[10px] text-muted-foreground/70 truncate mt-0.5">
                          {isCompleted ? "✓ 已通過考核" : chapter.audience}
                        </p>
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Special Sections */}
        <div className="px-3 mt-2 mb-2">
          <div className="border-t border-sidebar-border pt-2 space-y-1">
            <a
              href="#milestone"
              className="w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 group flex items-center gap-2.5 hover:bg-sidebar-accent border border-transparent"
            >
              <Trophy size={16} className="text-emerald-500" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-muted-foreground group-hover:text-foreground truncate">新人 30 天里程碑</p>
                <p className="text-[10px] text-muted-foreground/70 truncate mt-0.5">互動式進度追蹤</p>
              </div>
            </a>
            <a
              href="#daily-quiz"
              className="w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 group flex items-center gap-2.5 hover:bg-sidebar-accent border border-transparent"
            >
              <Sparkles size={16} className="text-violet-500" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-muted-foreground group-hover:text-foreground truncate">每日一題</p>
                <p className="text-[10px] text-muted-foreground/70 truncate mt-0.5">推播到 Slack</p>
              </div>
            </a>
            <a
              href="#leaderboard"
              className="w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 group flex items-center gap-2.5 hover:bg-sidebar-accent border border-transparent"
            >
              <Medal size={16} className="text-amber-500" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-muted-foreground group-hover:text-foreground truncate">考核排行榜</p>
                <p className="text-[10px] text-muted-foreground/70 truncate mt-0.5">團隊學習競賽</p>
              </div>
            </a>
            <a
              href="#case-library"
              className="w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 group flex items-center gap-2.5 hover:bg-sidebar-accent border border-transparent"
            >
              <BookMarked size={16} className="text-amber-500" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-muted-foreground group-hover:text-foreground truncate">實戰案例庫</p>
                <p className="text-[10px] text-muted-foreground/70 truncate mt-0.5">分類標籤 + 搜尋篩選</p>
              </div>
            </a>
            <button
              onClick={() => onShowDocs?.()}
              className="w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 group flex items-center gap-2.5 hover:bg-sidebar-accent border border-transparent"
            >
              <FileText size={16} className="text-cyan-500" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-muted-foreground group-hover:text-foreground truncate">內部文件</p>
                <p className="text-[10px] text-muted-foreground/70 truncate mt-0.5">AI 資安 SOP · 合約模板</p>
              </div>
            </button>
          </div>
        </div>

        {/* Bottom Links */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-sidebar-border bg-sidebar/95 backdrop-blur-sm space-y-2">
          {/* 我的錯題本快捷按鈕 */}
          <WrongNotebookButton />
          {/* Theme Toggle */}
          <ThemeToggle />
          <a
            href="https://app.notion.com/p/38097a06fae5814caf78e93a99dcc243"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[11px] text-muted-foreground hover:text-[#F37021] transition-colors"
          >
            <ExternalLink size={12} />
            <span>在 Notion 中查看</span>
          </a>
        </div>
      </aside>
    </>
  );
}
