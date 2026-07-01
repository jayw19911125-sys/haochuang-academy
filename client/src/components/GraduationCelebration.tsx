import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, X, Star, Sparkles } from "lucide-react";

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
  delay: number;
  duration: number;
  shape: "rect" | "circle" | "triangle";
}

function generateConfetti(count: number): ConfettiPiece[] {
  const colors = [
    "#F37021", "#FF8C42", "#FFB347", "#10b981", "#34d399",
    "#6ee7b7", "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b",
    "#14b8a6", "#f43f5e"
  ];
  const shapes: ("rect" | "circle" | "triangle")[] = ["rect", "circle", "triangle"];
  
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: -(Math.random() * 20 + 10),
    rotation: Math.random() * 720 - 360,
    scale: Math.random() * 0.8 + 0.4,
    color: colors[Math.floor(Math.random() * colors.length)],
    delay: Math.random() * 0.8,
    duration: Math.random() * 2 + 2.5,
    shape: shapes[Math.floor(Math.random() * shapes.length)]
  }));
}

interface GraduationCelebrationProps {
  show: boolean;
  onClose: () => void;
}

export default function GraduationCelebration({ show, onClose }: GraduationCelebrationProps) {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    if (show) {
      setConfetti(generateConfetti(80));
      // 延遲顯示徽章
      const timer = setTimeout(() => setShowBadge(true), 600);
      return () => clearTimeout(timer);
    } else {
      setConfetti([]);
      setShowBadge(false);
    }
  }, [show]);

  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          onClick={onClose}
        >
          {/* 背景遮罩 */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* 五彩紙屑 */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {confetti.map((piece) => (
              <motion.div
                key={piece.id}
                initial={{ 
                  x: `${piece.x}vw`, 
                  y: "-10vh",
                  rotate: 0,
                  scale: piece.scale
                }}
                animate={{ 
                  y: "110vh",
                  rotate: piece.rotation,
                  x: `${piece.x + (Math.random() * 20 - 10)}vw`
                }}
                transition={{ 
                  duration: piece.duration,
                  delay: piece.delay,
                  ease: "linear"
                }}
                className="absolute"
                style={{ left: 0, top: 0 }}
              >
                {piece.shape === "rect" && (
                  <div 
                    className="w-3 h-2 rounded-[1px]"
                    style={{ backgroundColor: piece.color }}
                  />
                )}
                {piece.shape === "circle" && (
                  <div 
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: piece.color }}
                  />
                )}
                {piece.shape === "triangle" && (
                  <div 
                    className="w-0 h-0"
                    style={{ 
                      borderLeft: "5px solid transparent",
                      borderRight: "5px solid transparent",
                      borderBottom: `8px solid ${piece.color}`
                    }}
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* 畢業徽章彈出視窗 */}
          <AnimatePresence>
            {showBadge && (
              <motion.div
                initial={{ scale: 0, rotate: -20, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 15,
                  mass: 1.2
                }}
                className="relative z-10 max-w-sm w-full mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative bg-gradient-to-b from-gray-900 to-gray-950 rounded-2xl border border-amber-500/30 p-8 text-center overflow-hidden">
                  {/* 背景光暈 */}
                  <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-transparent to-emerald-500/5" />
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl" />
                  
                  {/* 關閉按鈕 */}
                  <button
                    onClick={onClose}
                    className="absolute top-3 right-3 p-1.5 rounded-lg text-muted-foreground/50 hover:text-foreground hover:bg-border/20 transition-all"
                  >
                    <X size={16} />
                  </button>

                  {/* 徽章圖標 */}
                  <motion.div
                    initial={{ scale: 0, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 250, damping: 12 }}
                    className="relative mx-auto mb-5"
                  >
                    <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-orange-600 flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.4)]">
                      <Award size={44} className="text-white drop-shadow-lg" />
                    </div>
                    {/* 旋轉光環 */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0"
                    >
                      <Star size={14} className="absolute -top-1 left-1/2 -translate-x-1/2 text-amber-400" />
                      <Star size={10} className="absolute top-1/2 -right-2 -translate-y-1/2 text-amber-300" />
                      <Star size={12} className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-amber-400" />
                      <Star size={10} className="absolute top-1/2 -left-2 -translate-y-1/2 text-amber-300" />
                    </motion.div>
                  </motion.div>

                  {/* 標題 */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="relative"
                  >
                    <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 mb-2">
                      恭喜畢業！
                    </h2>
                    <p className="text-sm text-muted-foreground mb-4">
                      你已完成好創學院全部 14 章課程
                    </p>
                  </motion.div>

                  {/* 成就描述 */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="relative space-y-3 mb-6"
                  >
                    <div className="flex items-center justify-center gap-2 text-emerald-400">
                      <Sparkles size={14} />
                      <span className="text-xs font-semibold">好創即戰力認證</span>
                      <Sparkles size={14} />
                    </div>
                    <p className="text-[11px] text-muted-foreground/80 leading-relaxed max-w-[260px] mx-auto">
                      從營運底層邏輯到 AI 自動化工作流，你已掌握好創整合行銷的完整知識體系。歡迎正式加入戰場！
                    </p>
                  </motion.div>

                  {/* 統計數據 */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="relative grid grid-cols-3 gap-3 mb-6"
                  >
                    <div className="p-2.5 rounded-lg bg-border/10 border border-border/20">
                      <p className="text-lg font-black text-[#F37021]">14</p>
                      <p className="text-[9px] text-muted-foreground">章節通過</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-border/10 border border-border/20">
                      <p className="text-lg font-black text-emerald-400">70</p>
                      <p className="text-[9px] text-muted-foreground">考核題目</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-border/10 border border-border/20">
                      <p className="text-lg font-black text-amber-400">100%</p>
                      <p className="text-[9px] text-muted-foreground">完成度</p>
                    </div>
                  </motion.div>

                  {/* 關閉按鈕 */}
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 }}
                    onClick={onClose}
                    className="relative w-full py-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold hover:from-amber-400 hover:to-orange-400 transition-all duration-200 active:scale-[0.97] shadow-[0_4px_20px_rgba(245,158,11,0.3)]"
                  >
                    開始實戰！
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
