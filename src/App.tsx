import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./features/auth/ProtectedRoute";
import LoginPage from "./pages/Login";
import NotFoundPage from "./pages/NotFoundPage";
import ChatLayout from "./components/layout/ChatLayout";
import ChatWindow from "./features/chat/ChatWindow";
import Layout from "./components/layout/Layout";
import EmptyChatState from "./features/chat/EmptyChatState";

function App() {
  return (
    <BrowserRouter>
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
              {/* <ProfilePage /> */}
            </ProtectedRoute>
          }
        />

        {/* Ruta 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
