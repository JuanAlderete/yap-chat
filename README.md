# YAP Chat - Frontend

Aplicación web de mensajería en tiempo real construida con React, TypeScript y Tailwind CSS.

## 🌐 Demo en Vivo

🔗 **Aplicación**: [https://yap-chat-front-git-production-juanalderetes-projects.vercel.app/](https://yap-chat-front-git-production-juanalderetes-projects.vercel.app/)

🔗 **API Backend**: [https://yap-chat-api.onrender.com/api](https://yap-chat-api.onrender.com/api)

## 🚀 Características

- ✅ Autenticación segura con JWT
- ✅ Verificación de email
- ✅ Búsqueda de usuarios en tiempo real
- ✅ Conversaciones 1 a 1
- ✅ Envío de mensajes
- ✅ Edición y eliminación de mensajes
- ✅ Actualización de perfil con avatar
- ✅ Diseño responsive (Mobile First)
- ✅ UI moderna con Shadcn/ui
- ✅ Notificaciones con Sonner
- ✅ Modo claro/oscuro

## 🛠️ Tecnologías

- **React 19** - Librería de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool
- **Tailwind CSS** - Estilos
- **Shadcn/ui** - Componentes UI
- **Zustand** - Gestión de estado
- **React Router** - Navegación
- **Axios** - Cliente HTTP
- **React Hook Form** - Formularios
- **Zod** - Validaciones
- **Sonner** - Toasts/Notificaciones
- **date-fns** - Manejo de fechas
- **Lucide React** - Iconos

## ⚙️ Instalación Local

1. Clonar el repositorio:
```bash
git clone https://github.com/JuanAlderete/yap-chat.git
cd yap-chat
```

2. Instalar dependencias:
```bash
ppnpm install
```

3. Crear archivo `.env.local`:
```env
VITE_API_URL=http://localhost:3000/api
```

Para producción, usa la URL de tu backend deployado:
```env
VITE_API_URL=https://tu-backend.onrender.com/api # Ejemplo
```

4. Iniciar servidor de desarrollo:
```bash
pnpm run dev
```

5. Abrir en el navegador:
```
http://localhost:5173
```

## 🏗️ Scripts Disponibles
```bash
pnpm run dev      # Servidor de desarrollo
pnpm run build    # Build para producción
pnpm run preview  # Preview del build
```

## 📁 Estructura del Proyecto
```
src/
├── components/
│   ├── common/           # Componentes reutilizables
│   ├── layout/           # Layout y navegación
│   └── ui/               # Componentes de Shadcn/ui
├── features/
│   ├── auth/             # Autenticación (login, registro)
│   └── chat/             # Chat (conversaciones, mensajes)
├── hooks/                # Custom hooks
├── lib/                  # Utilidades
├── pages/                # Páginas de la aplicación
├── services/             # Servicios de API
├── stores/               # Zustand stores
├── types/                # Tipos de TypeScript
└── utils/                # Funciones auxiliares
```

## 🔐 Flujo de Autenticación

1. **Registro**: El usuario se registra con nombre, email y contraseña
2. **Verificación**: Recibe un email con un token de verificación
3. **Activación**: Hace click en el link o ingresa el token
4. **Login**: Inicia sesión y recibe un JWT
5. **Token**: El token se guarda en localStorage y se envía en cada request

## 💬 Funcionalidades Principales

### **Conversaciones**
- Crear nueva conversación buscando usuarios
- Ver lista de conversaciones activas
- Buscar en conversaciones
- Ver último mensaje y timestamp
- Indicador de mensajes no leídos (próximamente)

### **Mensajes**
- Enviar mensajes de texto
- Ver mensajes en orden cronológico
- Editar mensajes propios
- Eliminar mensajes propios
- Indicador de mensaje editado
- Auto-scroll al último mensaje
- Paginación de mensajes históricos

### **Perfil**
- Actualizar nombre
- Subir avatar (Base64)
- Ver información de la cuenta

## 📱 Responsive Design

### Características Mobile:
- Navegación adaptativa
- Botón "volver" en chats
- Sidebar colapsable
- Touch gestures optimizados
- Inputs de tamaño apropiado

## 🔒 Seguridad

- ✅ Tokens JWT con expiración
- ✅ Rutas protegidas con middleware
- ✅ Validación de formularios con Zod
- ✅ Sanitización de inputs
- ✅ HTTPS en producción
- ✅ Variables de entorno para secrets

## 🚀 Deploy en Vercel

### Deploy Automático (Recomendado)

1. Conecta tu repositorio de GitHub con Vercel
2. Configura las variables de entorno:
   - `VITE_API_URL`: URL de tu backend
3. Vercel detectará Vite automáticamente
4. Deploy automático en cada push

### Deploy Manual
```bash
# Build
pnpm run build

# Preview local
pnpm run preview

# Deploy
vercel --prod
```

## 🐛 Troubleshooting

### Problema: No se conecta al backend
**Solución**: Verifica que `VITE_API_URL` esté correctamente configurada en `.env.local`

### Problema: CORS error
**Solución**: Asegúrate de que el backend tenga configurado el origen de Vercel en CORS

### Problema: 404 en rutas al recargar
**Solución**: Vercel maneja esto automáticamente con Vite. Si persiste, revisa `vercel.json`

### Problema: El token expira muy rápido
**Solución**: El token dura 7 días. Si necesitas más, ajusta `JWT_EXPIRE` en el backend

## 📦 Build para Producción
```bash
pnpm run build
```

Los archivos optimizados se generarán en `/dist`:
- HTML minificado
- CSS optimizado y tree-shaken
- JavaScript bundled y minificado
- Assets optimizados

## 🤝 Contribuciones

Este proyecto es parte de un trabajo final de curso. No se aceptan contribuciones externas en este momento.

## 👨‍💻 Autor

**Juan Alderete**
- GitHub: [@JuanAlderete](https://github.com/JuanAlderete)
- Frontend: [yap-chat](https://github.com/JuanAlderete/yap-chat)
- Backend: [yap-chat-backend](https://github.com/JuanAlderete/yap-chat-backend)

---

## 🔗 Links Relacionados

- 📚 [Documentación del Backend](https://github.com/JuanAlderete/yap-chat-backend)
- 🌐 [Demo en Vivo](https://yap-chat-front-git-production-juanalderetes-projects.vercel.app)