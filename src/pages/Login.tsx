import LoginForm from "@/features/auth/LoginForm";
import RegisterForm from "@/features/auth/RegisterForm";
import { useAuthStore } from "@/stores/authStore";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ReactCardFlip from "react-card-flip";
import { toast } from "sonner";

function LoginPage() {
  const [isFlipped, setIsFlipped] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleClick = () => setIsFlipped(!isFlipped);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const from = searchParams.get("from");

    if (from === "verified_email") {
      setTimeout(() => {
        toast.success("Tu correo fue verificado correctamente 🥳");
      }, 1000);
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <ReactCardFlip
        isFlipped={isFlipped}
        flipDirection="horizontal"
        flipSpeedBackToFront={0.4}
        flipSpeedFrontToBack={0.4}
      >
        <div key="front">
          <LoginForm isFlipped={handleClick} />
        </div>
        <div key="back">
          <RegisterForm isFlipped={handleClick} />
        </div>
      </ReactCardFlip>
    </div>
  );
}

export default LoginPage;
