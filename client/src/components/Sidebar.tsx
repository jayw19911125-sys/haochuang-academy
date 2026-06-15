import { motion, AnimatePresence } from "framer-motion";
import { 
  Layers, Target, Rocket, Film, Zap, Brain, 
  BarChart3, Users, X, ExternalLink
} from "lucide-react";
import { chapters } from "@/lib/data";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Layers, Target, Rocket, Film, Zap, Brain, BarChart3, Users
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeChapter: number;
  onChapterSelect: (idx: number) => void;
  progress: number;
}

export default function Sidebar({ isOpen, onClose, activeChapter, onChapterSelect, progress }: SidebarProps) {
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
        <nav className="p-3 overflow-y-auto h-[calc(100vh-200px)]">
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

        {/* Bottom Links */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border bg-sidebar/80 backdrop-blur-sm">
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
