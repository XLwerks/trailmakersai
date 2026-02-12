import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, Loader2, User } from "lucide-react";

interface CharacterFormProps {
  onSubmit: (fields: Record<string, string>, imageBase64: string) => void;
  isLoading: boolean;
}

const CharacterForm = ({ onSubmit, isLoading }: CharacterFormProps) => {
  const [referencePreview, setReferencePreview] = useState<string | null>(null);
  const [referenceBase64, setReferenceBase64] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fields, setFields] = useState({
    timePeriod: "",
    roleOccupation: "",
    clothingDescriptors: "",
    outfitDescriptionSentence: "",
  });

  const updateField = (key: string, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setReferencePreview(result);
      setReferenceBase64(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referenceBase64) return;
    onSubmit(fields, referenceBase64);
  };

  const isValid =
    referenceBase64 &&
    fields.timePeriod &&
    fields.roleOccupation &&
    fields.clothingDescriptors;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Reference Image Upload */}
      <div>
        <Label className="text-sm font-semibold tracking-wide uppercase text-muted-foreground mb-2 block">
          Reference Image *
        </Label>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="relative cursor-pointer border-2 border-dashed border-border rounded-lg h-40 flex items-center justify-center bg-secondary/50 hover:bg-secondary transition-colors overflow-hidden"
        >
          {referencePreview ? (
            <img
              src={referencePreview}
              alt="Reference"
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Upload className="w-6 h-6" />
              <span className="text-sm">Upload head & shoulders photo</span>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Text Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="timePeriod">Time Period *</Label>
          <Input
            id="timePeriod"
            value={fields.timePeriod}
            onChange={(e) => updateField("timePeriod", e.target.value)}
            placeholder="e.g. Early 19th Century"
          />
        </div>
        <div>
          <Label htmlFor="roleOccupation">Role / Occupation *</Label>
          <Input
            id="roleOccupation"
            value={fields.roleOccupation}
            onChange={(e) => updateField("roleOccupation", e.target.value)}
            placeholder="e.g. Prison Reformer"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="clothingDescriptors">
          Clothing Keywords (5 words or short phrases, comma separated) *
        </Label>
        <Textarea
          id="clothingDescriptors"
          value={fields.clothingDescriptors}
          onChange={(e) => updateField("clothingDescriptors", e.target.value)}
          placeholder="e.g. long dark grey dress, white bonnet, shawl, lace collar, leather boots"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="outfitDescriptionSentence">
          Outfit Description Sentence (optional)
        </Label>
        <Textarea
          id="outfitDescriptionSentence"
          value={fields.outfitDescriptionSentence}
          onChange={(e) =>
            updateField("outfitDescriptionSentence", e.target.value)
          }
          placeholder="e.g. Quaker-style clothing, simple and unadorned"
          rows={2}
        />
      </div>

      <Button
        type="submit"
        disabled={!isValid || isLoading}
        className="w-full font-display text-base tracking-wide h-12"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating Character…
          </>
        ) : (
          <>
            <User className="mr-2 h-4 w-4" />
            Generate Full-Body Image
          </>
        )}
      </Button>
    </form>
  );
};

export default CharacterForm;
