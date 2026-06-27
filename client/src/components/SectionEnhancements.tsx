import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

// 高亮數據組件
interface HighlightProps {
  title: string;
  value: string | number;
  unit?: string;
  color?: string;
}

export function Highlight({ title, value, unit, color = "#4ecdc4" }: HighlightProps) {
  return (
    <div
      className="rounded-lg p-4 border-2 flex flex-col justify-center"
      style={{
        borderColor: color,
        backgroundColor: `${color}15`,
      }}
    >
      <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">
        {title}
      </p>
      <div className="flex items-baseline gap-1">
        <span
          className="text-2xl font-bold"
          style={{ color }}
        >
          {value}
        </span>
        {unit && (
          <span className="text-xs text-muted-foreground">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

// 高亮組合
interface HighlightsGridProps {
  highlights: HighlightProps[];
}

export function HighlightsGrid({ highlights }: HighlightsGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 my-6">
      {highlights.map((h, i) => (
        <Highlight key={i} {...h} />
      ))}
    </div>
  );
}

// 備註提示組件
interface NoteProps {
  type: "warning" | "insight" | "tip" | "data";
  title: string;
  content: string;
  icon?: string;
}

const noteStyles = {
  warning: {
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    title: "text-red-600",
    icon: "⚠️",
  },
  insight: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    title: "text-blue-600",
    icon: "💡",
  },
  tip: {
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    title: "text-green-600",
    icon: "🚀",
  },
  data: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    title: "text-purple-600",
    icon: "📊",
  },
};

export function Note({ type, title, content, icon }: NoteProps) {
  const style = noteStyles[type];
  const displayIcon = icon || style.icon;

  return (
    <div className={`rounded-lg border-2 p-4 my-4 ${style.bg} ${style.border}`}>
      <div className="flex gap-3">
        <span className="text-xl flex-shrink-0">{displayIcon}</span>
        <div className="flex-1">
          <h4 className={`text-sm font-semibold ${style.title} mb-1`}>
            {title}
          </h4>
          <p className="text-sm text-muted-foreground whitespace-pre-line">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
}

// 備註組合
interface NotesProps {
  notes: NoteProps[];
}

export function Notes({ notes }: NotesProps) {
  return (
    <div className="space-y-3">
      {notes.map((note, i) => (
        <Note key={i} {...note} />
      ))}
    </div>
  );
}

// 可展開詳情組件
interface ExpandableProps {
  title: string;
  content: string;
}

export function ExpandableItem({ title, content }: ExpandableProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-lg border border-sidebar-border overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-sidebar-accent transition-colors text-left"
      >
        <span className="font-medium text-sm text-foreground">{title}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} className="text-muted-foreground" />
        </motion.div>
      </button>

      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <div className="px-4 py-3 border-t border-sidebar-border bg-sidebar/50 text-sm text-muted-foreground whitespace-pre-line">
          {content}
        </div>
      </motion.div>
    </div>
  );
}

// 可展開組合
interface ExpandablesProps {
  items: ExpandableProps[];
}

export function Expandables({ items }: ExpandablesProps) {
  return (
    <div className="space-y-2 my-6">
      {items.map((item, i) => (
        <ExpandableItem key={i} {...item} />
      ))}
    </div>
  );
}
