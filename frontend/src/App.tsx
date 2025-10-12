import { AppRouter } from "./router";
import { Toaster } from "sonner";
import { useGetUserProfileQuery } from "./api/authApi";
import { Spinner } from "./components/ui/spinner";

function App() {
  // Fetch user profile on app mount
  const { isLoading } = useGetUserProfileQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <AppRouter />
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;
