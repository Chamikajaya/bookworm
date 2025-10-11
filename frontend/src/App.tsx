import { use, useEffect } from "react";
import { AppRouter } from "./router";
import { Toaster } from "sonner";
import { useGetUserProfileQuery } from "./api/authApi";

function App() {
  // Initialize auth state on app load

  // ! TODO: Returning null on loading state in components ? simply return null or a loading spinner ?

  const { refetch } = useGetUserProfileQuery();

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <>
      <AppRouter />
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;
