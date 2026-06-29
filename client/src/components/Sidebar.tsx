import { motion, AnimatePresence } from "framer-motion";
import { 
  Layers, Target, Rocket, Film, Zap, Brain, 
  BarChart3, Users, X, ExternalLink, Trophy, BookMarked, Sun, Moon,
  FileText, Shield, FileSignature, Medal, Sparkles
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

export default function Sidebar({ isOpen, onClose, activeChapter, onChapterSelect, onShowDocs, progress }: SidebarProps) {
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
          
          {/* Overall Progress */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">閱讀進度</span>
              <span className="text-[10px] font-mono text-[#F37021]">{Math.round(progress * 100)}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${progress * 100}%` }} />
            </div>
          </div>
        </div>

        {/* Chapter List */}
        <nav className="p-3 overflow-y-auto" style={{ height: 'calc(100vh - 200px - 100px)' }}>
          <ul className="space-y-1">
            {chapters.map((chapter, idx) => {
              const Icon = iconMap[chapter.icon] || Layers;
              const isActive = idx === activeChapter;
              
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
                      <Icon 
                        size={16} 
                        className={`transition-colors ${isActive ? "text-[#F37021]" : "text-muted-foreground group-hover:text-foreground"}`} 
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-medium truncate transition-colors ${isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}>
                          {chapter.title.replace(/^[壹貳參肆伍陸柒捌玖拾]、/, "")}
                        </p>
                        <p className="text-[10px] text-muted-foreground/70 truncate mt-0.5">
                          {chapter.audience}
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
