import LoginForm from "@/features/auth/LoginForm";
import RegisterForm from "@/features/auth/RegisterForm";
import { useAuthStore } from "@/stores/authStore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactCardFlip from "react-card-flip";

function LoginPage() {
  const [isFlipped, setIsFlipped] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  const handleClick = () => setIsFlipped(!isFlipped);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

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