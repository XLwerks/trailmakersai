import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import CharacterForm from "@/components/CharacterForm";
import ResultPanel from "@/components/ResultPanel";
import DebugPanel from "@/components/DebugPanel";
import { Compass } from "lucide-react";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [debugPrompt, setDebugPrompt] = useState<string | null>(null);
  const [debugOpen, setDebugOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (
    fields: Record<string, string>,
    referenceImageBase64: string
  ) => {
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    setDebugPrompt(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke(
        "generate-character",
        {
          body: { fields, referenceImageBase64 },
        }
      );

      if (fnError) {
        throw new Error(fnError.message || "Generation failed");
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      setGeneratedImage(data.imageUrl);
      setDebugPrompt(data.debugPrompt);
      toast.success("Character generated successfully!");
    } catch (err: any) {
      const message = err?.message || "Something went wrong";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Compass className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-foreground leading-tight">
              Trailmakers Ai
            </h1>
            <p className="text-xs text-muted-foreground">
              Worksheet 2 – Full Body Image
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Form */}
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <h2 className="font-display text-lg font-semibold mb-1 text-foreground">
              Character Details
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Upload a reference portrait and describe the clothing to extend into a full-body image
            </p>
            <CharacterForm onSubmit={handleGenerate} isLoading={isLoading} />
          </div>

          {/* Right: Result */}
          <div className="bg-card rounded-xl border border-border shadow-sm flex flex-col">
            <div className="p-6 flex-1">
              <h2 className="font-display text-lg font-semibold mb-1 text-foreground">
                Generated Image
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Full-body photorealistic character output
              </p>
              <ResultPanel
                imageUrl={generatedImage}
                isLoading={isLoading}
                error={error}
              />
            </div>
            <DebugPanel
              prompt={debugPrompt}
              isOpen={debugOpen}
              onToggle={() => setDebugOpen(!debugOpen)}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
