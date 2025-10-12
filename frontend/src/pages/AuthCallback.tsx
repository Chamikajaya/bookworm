import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useHandleCallbackMutation } from "@/api/authApi";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { cognitoConfig } from "@/config/authConfig";
import { Spinner } from "@/components/ui/spinner";

export const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [handleCallback, { isLoading }] = useHandleCallbackMutation();
  const { isAuthenticated, user } = useAuth();
  const hasCalledCallback = useRef(false); // to prevent duplicate calls in react strict mode while development
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
    if (hasCalledCallback.current) {
      return;
    }

    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      toast.error("Authentication failed, please try again.");
      navigate("/");
      return;
    }

    if (!code) {
      navigate("/");
      return;
    }

    hasCalledCallback.current = true;

    handleCallback({
      code,
      redirectUri: cognitoConfig.redirectUri,
    })
      .unwrap()
      .then((response) => {
        console.log("✅ Callback response:", response);
        toast.success("Login successful!");
        setRedirectPath(response.data.redirectTo);
      })
      .catch((err) => {
        console.error("❌ Callback error:", err);
        toast.error("Failed to complete authentication");
        navigate("/");
      });
  }, [searchParams, handleCallback, navigate]);

  // Wait for authentication state to update before redirecting
  useEffect(() => {
    if (isAuthenticated && user && redirectPath) {
      console.log("✅ Redirecting to:", redirectPath);

      // Use a small timeout to ensure all state updates are complete
      const timer = setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user, redirectPath, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Spinner className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-lg font-medium">
        {isLoading ? "Completing sign in..." : "Redirecting..."}
      </p>
      <p className="text-sm text-muted-foreground mt-2">
        Debug: Auth={isAuthenticated ? "✓" : "✗"} User={user ? "✓" : "✗"}
      </p>
    </div>
  );
};
