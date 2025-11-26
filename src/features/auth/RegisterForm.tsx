import { useState } from "react";
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
import { toast } from "sonner";

type FormData = {
  name: string;
  email: string;
  password: string;
};

interface RegisterFormProps {
  isFlipped: () => void;
}

function RegisterForm({ isFlipped }: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const navigate = useNavigate();
  const authStore = useAuthStore();

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    setIsLoading(true);
    try {
      await toast.promise(() => authStore.register(data), {
        loading: "Registrando...",
        success: "Usuario registrado exitosamente. Se envio un correo de confirmación",
        error: "Error al registrar usuario",
      });
      navigate("/");
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickFlipped = () => {
    isFlipped();
    reset();
  };

  return (
    <Card className="min-w-[20rem] max-w-xl mx-8" key="back">
      <img
        src="../../../yap-chat-logo.png"
        alt="logo"
        className="px-8 mx-auto w-full"
      />
      <CardHeader>
        <CardTitle>Registro en tu cuenta</CardTitle>
        <CardDescription>
          Ingresa tu correo electrónico y contraseña para registrarte en tu cuenta
        </CardDescription>
        <CardAction>
          <Button variant="link" onClick={handleClickFlipped}>
            Iniciar sesión
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid gap-1">
            <Label htmlFor="name">Nombre</Label>
            <Input
              {...register("name", {
                required: { value: true, message: "Nombre es requerido" },
                minLength: {
                  value: 2,
                  message: "El nombre debe tener al menos 2 caracteres",
                },
              })}
              type="text"
              id="name"
              className={
                errors.name
                  ? "border-red-300 focus-visible:ring-red-200 focus-visible:border-red-300"
                  : ""
              }
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
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
              className={
                errors.email
                  ? "border-red-300 focus-visible:ring-red-200 focus-visible:border-red-300"
                  : ""
              }
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="grid gap-1">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              {...register("password", {
                required: {
                  value: true,
                  message: "Password is required",
                },
              })}
              type="password"
              id="password"
              className={
                errors.password
                  ? "border-red-300 focus-visible:ring-red-200 focus-visible:border-red-300"
                  : ""
              }
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button
          onClick={handleSubmit(onSubmit)}
          className="w-full"
          disabled={isLoading}
        >
          {authStore.isLoading ? "Cargando..." : "Registrarme"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default RegisterForm;
