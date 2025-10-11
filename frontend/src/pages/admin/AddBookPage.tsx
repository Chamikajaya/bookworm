import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StepIndicator } from "@/components/admin/StepIndicator";
import { BookFormStepOne } from "@/components/admin/BookFormStepOne";
import { BookFormStepTwo } from "@/components/admin/BookFormStepTwo";
import { bookMetadataSchema } from "@/lib/validations/bookSchema";
import {
  useCreateBookMutation,
  useGenerateUploadUrlMutation,
  useUploadToS3Mutation,
  useUpdateBookImageMutation,
} from "@/api/admin/adminApi";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Header } from "@/components/layout/Header";

export const AddBook = () => {
  const navigate = useNavigate();
  const { isLoading: authLoading } = useRequireAuth("ADMIN");
  const [currentStep, setCurrentStep] = useState(1);
  const [createdBookId, setCreatedBookId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(bookMetadataSchema),
    defaultValues: {
      title: "",
      author: "",
      description: "",
      language: "English",
    },
  });

  const [createBook] = useCreateBookMutation();
  const [generateUploadUrl] = useGenerateUploadUrlMutation();
  const [uploadToS3] = useUploadToS3Mutation();
  const [updateBookImage] = useUpdateBookImageMutation();

  const handleNext = () => {
    setCurrentStep(2);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (imageFile: File | null) => {
    setIsSubmitting(true);
    try {
      const formData = form.getValues();

      // Step 1: Create book
      const bookResponse = await createBook(formData).unwrap();

      const bookId = (bookResponse as any).data?.id || createdBookId;

      if (!bookId) {
        throw new Error("Failed to get book ID from response");
      }

      setCreatedBookId(bookId);

      // Step 2: Upload image if provided
      if (imageFile) {
        const fileExtension = `.${imageFile.name.split(".").pop()}`;

        // Get pre-signed URL
        const response = await generateUploadUrl({
          bookId,
          fileExtension,
          contentType: imageFile.type,
        }).unwrap();

        // Upload to S3
        await uploadToS3({
          url: response.data.uploadUrl,
          file: imageFile,
        }).unwrap();

        // Update book with image key
        await updateBookImage({
          bookId,
          coverImageKey: response.data.key,
        }).unwrap();
      }

      toast.success("Book added successfully!");
      navigate("/admin/dashboard");
    } catch (error: any) {
      console.error("Error creating book:", error);
      toast.error(
        error?.data?.message || "Failed to create book. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Add New Book</CardTitle>
          </CardHeader>
          <CardContent>
            <StepIndicator currentStep={currentStep} totalSteps={2} />

            <Form {...form}>
              <form>
                {currentStep === 1 && (
                  <BookFormStepOne form={form} onNext={handleNext} />
                )}
                {currentStep === 2 && (
                  <BookFormStepTwo
                    onBack={handleBack}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                  />
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
