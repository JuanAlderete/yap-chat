# YAP Chat 💬

<!-- Agregar screenshot aquí -->

Aplicación de mensajería en tiempo real desarrollada con React y Node.js, aprendidos de forma autodidacta para este proyecto.

## 🚀 Demo en vivo

- **Frontend:** [https://yap-chat.vercel.app](https://yap-chat.vercel.app)
- **Backend API:** [https://yap-chat-api.onrender.com/api](https://yap-chat-api.onrender.com/api)
- **Repositorio del backend:** [yap-chat-api](https://github.com/JuanAlderete/yap-chat-api)

---

## 🛠️ Stack tecnológico

![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-000000?style=for-the-badge&logo=react&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)

---

## ✨ Funcionalidades

- **Autenticación** con JWT (register / login / persistencia de sesión)
- **Mensajería en tiempo real** via Socket.io
- **Indicador "escribiendo..."** cuando el otro usuario está redactando
- **Badges de mensajes no leídos** en la lista de conversaciones
- **Eliminar conversaciones** con diálogo de confirmación
- **Timestamps relativos** autoactualizables ("2m ago", "1h ago")
- **Skeleton loaders** mientras cargan las conversaciones
- Editar y eliminar mensajes propios
- Diseño responsive (móvil y desktop)
- Tema claro / oscuro

---

## 📦 Instalación local

### Requisitos previos

- Node.js ≥ 18
- pnpm

```bash
# 1. Clonar el repositorio
git clone https://github.com/JuanAlderete/yap-chat.git
cd yap-chat

# 2. Instalar dependencias
pnpm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env y completar VITE_API_URL

# 4. Iniciar servidor de desarrollo
pnpm dev
```

El proyecto quedará disponible en `http://localhost:5173`.

### Variables de entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `VITE_API_URL` | URL base de la API REST | `https://yap-chat-api.onrender.com/api` |

> El servicio de WebSocket se conecta automáticamente a la raíz del servidor (sin `/api`).

---

## 🗂️ Estructura del proyecto

```
src/
├── features/
│   └── chat/               # UI de mensajería (ChatWindow, ChatSidebar, etc.)
├── services/
│   ├── api.ts              # Axios con interceptores (auth token, 401 redirect)
│   ├── socket.service.ts   # Singleton de Socket.io
│   ├── auth.service.ts
│   ├── conversation.service.ts
│   └── message.service.ts
├── stores/
│   ├── authStore.ts        # Zustand — autenticación
│   └── chatStore.ts        # Zustand — conversaciones y mensajes
└── types/
    ├── auth.types.ts
    └── chat.types.ts
```

---

## 📚 Lo que aprendí

Este proyecto fue desarrollado de forma **100% autodidacta** como práctica de tecnologías modernas de frontend y backend:

- **React 19** y su ecosistema (hooks, context, React Router, react-hook-form)
- **TypeScript** aplicado a proyectos reales con tipado estricto
- **Zustand** como gestor de estado global (alternativa liviana a Redux)
- **Socket.io** para comunicación bidireccional en tiempo real
- **Diseño de componentes** reutilizables con shadcn/ui y Tailwind CSS
- **Autenticación con JWT**: flujo de login, persistencia, interceptores Axios
- Patrones como singleton services, optimistic UI, y skeleton loading
- **Node.js / Express** en el backend (ver repo del backend)

---

## 📝 Licencia

MIT © [Juan Alderete](https://github.com/JuanAlderete)