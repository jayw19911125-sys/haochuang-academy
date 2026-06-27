import { useEffect, useRef } from "react";
import mermaid from "mermaid";

interface MermaidDiagramProps {
  code: string;
  title?: string;
  description?: string;
}

export default function MermaidDiagram({ code, title, description }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      mermaid.contentLoaded();
    }
  }, [code]);

  return (
    <div className="my-6 rounded-xl border border-sidebar-border bg-sidebar/50 p-6 overflow-x-auto">
      {title && (
        <h4 className="text-sm font-semibold text-foreground mb-2">{title}</h4>
      )}
      {description && (
        <p className="text-xs text-muted-foreground mb-4">{description}</p>
      )}
      <div 
        ref={containerRef}
        className="mermaid flex justify-center"
        style={{ minHeight: "300px" }}
      >
        {code}
      </div>
    </div>
  );
}
