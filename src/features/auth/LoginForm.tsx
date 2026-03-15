import { useAuthStore } from "@/stores/authStore";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type FormData = {
  email: string;
  password: string;
};

interface LoginFormProps {
  isFlipped: () => void;
}

function LoginForm({ isFlipped }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const navigate = useNavigate();
  const authStore = useAuthStore();

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    try {
      //console.log(data);
      await authStore.login(data);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickFlipped = () => {
    isFlipped();
    reset();
  };

  return (
    <Card className="w-[calc(100%-2rem)] sm:w-full max-w-md mx-auto">
      <img
        src="../../../yap-chat-logo.png"
        alt="YAP Chat Logo"
        width={400}
        height={100}
        className="px-8 mt-6 mx-auto w-full h-auto aspect-[4/1] object-contain"
        loading="eager"
      />
      <CardHeader>
        <CardTitle>Iniciar sesión en tu cuenta</CardTitle>
        <CardDescription>
          Ingresa tu correo electrónico para iniciar sesión en tu cuenta
        </CardDescription>
        <CardAction>
          <Button variant="link" onClick={handleClickFlipped}>
            Registrarme
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid gap-1">
            <Label htmlFor="email">Email</Label>
            <Input
              {...register("email", {
                required: { value: true, message: "Email is required" },
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              type="text"
              id="email"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={
                errors.email
                  ? "border-red-300 focus-visible:ring-red-200 focus-visible:border-red-300"
                  : ""
              }
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="grid gap-1">
            <div className="flex items-center">
              <Label htmlFor="password">Contraseña</Label>
              {/* <a
                href="#"
                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
              >
                Forgot your password?
              </a> */}
            </div>
            <Input
              {...register("password", {
                required: {
                  value: true,
                  message: "Password is required",
                },
              })}
              type="password"
              id="password"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              className={
                errors.password
                  ? "border-red-300 focus-visible:ring-red-200 focus-visible:border-red-300"
                  : ""
              }
            />
            {errors.password && (
              <p id="password-error" className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button onClick={handleSubmit(onSubmit)} className="w-full">
          {authStore.isLoading ? "Cargando..." : "Iniciar sesión"}
        </Button>
        {/* <Button variant="outline" className="w-full">
          Login with Google
        </Button> */}
      </CardFooter>
    </Card>
  );
}

export default LoginForm;
