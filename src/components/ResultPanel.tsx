import { Download, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResultPanelProps {
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

const ResultPanel = ({ imageUrl, isLoading, error }: ResultPanelProps) => {
  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "dock-stories-character.png";
    link.click();
  };

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
      {isLoading ? (
        <div className="flex flex-col items-center gap-4 text-muted-foreground animate-pulse">
          <div className="w-20 h-20 rounded-full border-4 border-border border-t-accent animate-spin" />
          <p className="font-display text-lg">Bringing history to life…</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 text-destructive max-w-xs text-center">
          <ImageOff className="w-10 h-10" />
          <p className="text-sm">{error}</p>
        </div>
      ) : imageUrl ? (
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="rounded-lg overflow-hidden border border-border shadow-lg bg-card max-w-md w-full">
            <img
              src={imageUrl}
              alt="Generated character"
              className="w-full h-auto"
            />
          </div>
          <Button variant="outline" onClick={handleDownload} className="gap-2">
            <Download className="w-4 h-4" />
            Download Image
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 text-muted-foreground max-w-xs text-center">
          <div className="w-32 h-40 rounded-lg border-2 border-dashed border-border flex items-center justify-center">
            <ImageOff className="w-8 h-8 opacity-40" />
          </div>
          <p className="font-display text-lg">Your character will appear here</p>
          <p className="text-sm">Fill in the form and click generate</p>
        </div>
      )}
    </div>
  );
};

export default ResultPanel;
