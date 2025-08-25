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
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
};

interface RegisterFormProps {
  isFlipped: () => void;
}

function RegisterForm({ isFlipped }: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const navigate = useNavigate();
  const authStore = useAuthStore();

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    console.log(data);
    //await authStore.register(data);
    // try {
    //   await authStore.register(data);
    //   navigate("/");
    // } catch (error) {
    //   console.error("Registration failed:", error);
    // } finally {
    //   setIsLoading(false);
    // }
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
        <CardTitle>Sign up to your account</CardTitle>
        <CardDescription>
          Enter your email and password below to sign up to your account
        </CardDescription>
        <CardAction>
          <Button variant="link" onClick={handleClickFlipped}>
            Login
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
            <Label htmlFor="password">Password</Label>
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
          <div className="grid gap-1">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              {...register("confirmPassword", {
                required: {
                  value: true,
                  message: "Confirm password is required",
                },
              })}
              type="password"
              id="confirmPassword"
              className={
                errors.confirmPassword
                  ? "border-red-300 focus-visible:ring-red-200 focus-visible:border-red-300"
                  : ""
              }
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <div className="flex flex-col items-start justify-center w-full">
            <div className="flex items-center gap-3">
              <Checkbox
                id="terms"
                {...register("terms", {
                  required: "You must accept the terms and conditions.",
                })}
              />
              <Label htmlFor="terms">Accept terms and conditions</Label>
            </div>
            {errors.terms && (
              <p className="text-sm text-red-500">{errors.terms.message}</p>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button onClick={handleSubmit(onSubmit)} className="w-full">
          {authStore.isLoading ? "Loading..." : "Register"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default RegisterForm;
