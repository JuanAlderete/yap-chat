import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './features/auth/ProtectedRoute';
import LoginPage from './pages/login';
import DashboardPage from './pages/Dashboard';
import NotFoundPage from './pages/NotFoundPage';

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
              <DashboardPage />
              {/* <ChatLayout /> */}
            </ProtectedRoute>
          }
        >
          {/* Rutas anidadas del chat */}
          {/* <Route index element={<ChatDashboard />} /> */}
          {/* <Route path=":conversationId" element={<ChatRoom />} /> */}
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
