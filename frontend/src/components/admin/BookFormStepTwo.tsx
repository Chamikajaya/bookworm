import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "./ImageUpload";
import { Loader2 } from "lucide-react";

interface BookFormStep2Props {
  onBack: () => void;
  onSubmit: (file: File | null) => Promise<void>;
  isSubmitting: boolean;
}

export const BookFormStepTwo = ({
  onBack,
  onSubmit,
  isSubmitting,
}: BookFormStep2Props) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = async () => {
    await onSubmit(selectedFile);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Upload Cover Image</h3>
        <p className="text-sm text-muted-foreground">
          Add a cover image for your book (optional)
        </p>
      </div>

      <ImageUpload onFileSelect={setSelectedFile} selectedFile={selectedFile} />

      <div className="flex justify-between gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
        >
          Back
        </Button>
        <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Book...
            </>
          ) : (
            "Create Book"
          )}
        </Button>
      </div>
    </div>
  );
};
