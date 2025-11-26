import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";

type Props = {
  children: React.ReactNode;
};

export default function AuthInitializer({ children }: Props) {
  const checkAuthStatus = useAuthStore((state) => state.checkAuthStatus);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
