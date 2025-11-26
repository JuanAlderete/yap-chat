import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./features/auth/ProtectedRoute";
import LoginPage from "./pages/Login";
import NotFoundPage from "./pages/NotFoundPage";
import ChatLayout from "./components/layout/ChatLayout";
import ChatWindow from "./features/chat/ChatWindow";
import Layout from "./components/layout/Layout";
import EmptyChatState from "./features/chat/EmptyChatState";
import Toaster from "./components/ui/sonner";
import AuthInitializer from "./features/auth/AuthInitializer";

function App() {
  return (
    <BrowserRouter>
      <AuthInitializer>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
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
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthInitializer>

      <Toaster />
    </BrowserRouter>
  );
}

export default App;
