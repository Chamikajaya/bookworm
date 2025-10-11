import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useHandleCallbackMutation } from "@/api/authApi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { cognitoConfig } from "@/config/authConfig";

export const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [handleCallback] = useHandleCallbackMutation();

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      toast.error("Authentication failed, please try again.");
      navigate("/");
      return;
    }

    if (code) {
      handleCallback({
        code,
        redirectUrl: cognitoConfig.redirectUri,
      })
        .unwrap()
        .then((response) => {
          toast.success("Login successful!");
          navigate(response.redirectTo);
        })
        .catch((err) => {
          console.error("Callback error:", err);
          toast.error("Failed to complete authentication");
          navigate("/");
        });
    } else {
      navigate("/");
    }
  }, [searchParams, handleCallback, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-lg font-medium">Completing sign in...</p>
    </div>
  );
};
