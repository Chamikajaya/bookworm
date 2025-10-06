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
import {
  bookMetadataSchema,
  type BookMetadataInput,
} from "@/lib/validations/bookSchema";
import {
  useCreateBookMutation,
  useGenerateUploadUrlMutation,
  useUploadToS3Mutation,
  useUpdateBookImageMutation,
} from "@/api/admin/adminApi";

export const AddBook = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [createdBookId, setCreatedBookId] = useState<string | null>(null);

  const form = useForm<BookMetadataInput>({
    resolver: zodResolver(bookMetadataSchema),
    defaultValues: {
      title: "",
      author: "",
      description: "",
      price: 0,
      stockQuantity: 0,
      language: "English",
      publishedYear: new Date().getFullYear(),
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
    try {
      const formData = form.getValues();

      // Step 1: Create book
      const bookResponse = await createBook(formData).unwrap();

      // TODO:  ! In order to this to work, backend must return the created book id in the response right ? - is current structure work fine ?
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

        console.log("Generated upload URL:", response);

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
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/admin/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </header>

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
                    isSubmitting={false}
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
