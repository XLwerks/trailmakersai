import { Bug } from "lucide-react";

interface DebugPanelProps {
  prompt: string | null;
  isOpen: boolean;
  onToggle: () => void;
}

const DebugPanel = ({ prompt, isOpen, onToggle }: DebugPanelProps) => {
  return (
    <div className="border-t border-border">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-4 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors w-full"
      >
        <Bug className="w-3.5 h-3.5" />
        {isOpen ? "Hide" : "Show"} Debug Prompt
      </button>
      {isOpen && prompt && (
        <pre className="px-4 pb-4 text-xs text-muted-foreground whitespace-pre-wrap bg-secondary/50 rounded-b-lg max-h-48 overflow-y-auto font-mono leading-relaxed">
          {prompt}
        </pre>
      )}
    </div>
  );
};

export default DebugPanel;
