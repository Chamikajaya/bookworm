import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

export const ImageUpload = ({
  onFileSelect,
  selectedFile,
}: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        onFileSelect(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const handleRemove = () => {
    onFileSelect(null);
    setPreview(null);
  };

  if (preview && selectedFile) {
    return (
      <div className="space-y-4">
        <div className="relative aspect-[2/3] max-w-sm mx-auto rounded-lg overflow-hidden border">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-center text-muted-foreground">
          {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)}{" "}
          MB)
        </p>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
        isDragActive
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25"
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        {isDragActive ? (
          <Upload className="h-12 w-12 text-primary" />
        ) : (
          <ImageIcon className="h-12 w-12 text-muted-foreground" />
        )}
        <div>
          <p className="text-lg font-medium mb-1">
            {isDragActive ? "Drop the image here" : "Drag & drop image here"}
          </p>
          <p className="text-sm text-muted-foreground">
            or click to browse (Max 5MB, JPG/PNG/WEBP)
          </p>
        </div>
      </div>
    </div>
  );
};
