import { Button } from "@/components/ui/button";
import { getAuthUrl } from "@/config/authConfig";
import { LogIn } from "lucide-react";

export const LoginButton = () => {
  const handleLogin = () => {
    window.location.href = getAuthUrl();
  };

  return (
    <Button onClick={handleLogin} variant="default">
      <LogIn className="mr-2 h-4 w-4" />
      Login with Google
    </Button>
  );
};
