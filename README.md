# <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" alt="React Logo" width="32" /> Batch 11 Assignment 12 - Client Side

A React + Vite project for property management, featuring authentication, role-based dashboards, and modern UI.

---

## 🗂️ Project Structure

```
src/
│
├── assets/
│   └── lotties/
├── components/
│   ├── WebLogo.jsx
│   └── Home/
│       └── shared/
├── context/
│   ├── AuthContext.jsx
│   └── AuthProvider.jsx
├── hooks/
│   ├── useAuth.jsx
│   ├── useAxios.jsx
│   ├── useAxiosSecure.jsx
│   └── useUserRole.jsx
├── Layout/
│   ├── DashboardLayout.jsx
│   └── MainLayout.jsx
├── pages/
│   ├── AllProperties.jsx
│   ├── ErrorPage.jsx
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── PropertyDetails.jsx
│   ├── Register.jsx
│   └── DashboardPages/
│       └── Forbidden/
├── PrivateRoutes/
│   ├── AdminRoute.jsx
│   ├── AgentRoute.jsx
│   ├── PrivateRoute.jsx
│   └── UserRoute.jsx
├── routes/
│   └── router.jsx
├── firebase.config.js
├── index.css
└── main.jsx
```

---

## 🚀 Features

- **Authentication:** Context-based user management.
- **Role-based Routing:** Admin, Agent, and User routes.
- **Dashboard Layouts:** Separate layouts for dashboard and main pages.
- **Axios Integration:** Secure API requests with custom hooks.
- **Error Handling:** Custom error pages for forbidden and general errors.
- **Modern UI:** Uses React and Vite for fast development.

---

## 🛠️ Getting Started

1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the development server:
   ```sh
   npm run dev
   ```

---

## 📄 License

MIT

---

## 🙏
