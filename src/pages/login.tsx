import LoginForm from "@/features/auth/LoginForm";
import RegisterForm from "@/features/auth/RegisterForm";
import { useState } from "react";
import ReactCardFlip from "react-card-flip";

function Login() {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => setIsFlipped(!isFlipped);

  return (
    <div className="flex flex-col items-center justify-center h-full">
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

export default Login;
