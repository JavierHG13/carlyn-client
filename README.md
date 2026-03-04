
# React + TypeScript + Vite

barberia-carlyn/
│
├── public/
│   └── images/
│
├── src/
│
│   ├── assets/
│
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   └── Modal.jsx
│   │   │
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ServicioCard.jsx
│   │   └── ProtectedRoute.jsx   # protección por rol
│   │
│   ├── pages/
│   │   ├── public/
│   │   │   ├── Home.jsx
│   │   │   ├── Servicios.jsx
│   │   │   ├── Galeria.jsx
│   │   │   └── Contacto.jsx
│   │   │
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   │
│   │   ├── cliente/
│   │   │   ├── DashboardCliente.jsx
│   │   │   ├── MisCitas.jsx
│   │   │   └── Perfil.jsx
│   │   │
│   │   └── admin/
│   │       ├── DashboardAdmin.jsx
│   │       ├── Usuarios.jsx
│   │       ├── Citas.jsx
│   │       └── Servicios.jsx
│   │
│   ├── context/
│   │   └── AuthContext.jsx   # login, usuario, rol
│   │
│   ├── services/
│   │   ├── authService.js
│   │   ├── userService.js
│   │   ├── citasService.js
│   │   └── serviciosService.js
│   │
│   ├── routes/
│   │   └── AppRoutes.jsx
│   │
│   ├── layout/
│   │   ├── PublicLayout.jsx
│   │   ├── AdminLayout.jsx
│   │   └── ClienteLayout.jsx
│   │
│   ├── styles/
│   │   ├── global.css
│   │   ├── admin.css
│   │   └── cliente.css
│   │
│   ├── App.jsx
│   └── main.jsx
│
└── package.json
