import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./features/auth/ProtectedRoute";
import LoginPage from "./pages/Login";
import NotFoundPage from "./pages/NotFoundPage";
import ChatLayout from "./components/layout/ChatLayout";
import ChatWindow from "./features/chat/ChatWindow";
import Layout from "./components/layout/Layout";
import EmptyChatState from "./features/chat/EmptyChatState";
import { useAuthStore } from "./stores/authStore";
import { useEffect } from "react";
import Toaster from "./components/ui/sonner";

function AuthInitializer() {
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

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <AuthInitializer />
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas protegidas */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <ChatLayout />
              </Layout>
            </ProtectedRoute>
          }
        >
          <Route index element={<EmptyChatState />} />
          <Route path="chat/:conversationId" element={<ChatWindow />} />
        </Route>

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <></>
            </ProtectedRoute>
          }
        />

        {/* Ruta 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
