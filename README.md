# 🏠 RealEstate Platform

A modern property management web application built with React and Vite, featuring robust authentication, role-based dashboards, and a sleek, responsive UI.

<!-- ---

## 🔑 Admin & Agent Credentials

- **Admin Email:** info@yeasinislam.com  
- **Admin Password:** info@Yeasin

- **Agent Email:** contact@yeasinislam.com  
- **Agent Password:** contact@Yeasin -->

---

## 🌐 Live Site & Repositories

- **Live Site:** [https://real-estate-platform-f0dd4.web.app](https://real-estate-platform-f0dd4.web.app)
<!-- - **Client Side GitHub:** [b11a12-client-side-yeasin-islam](https://github.com/Programming-Hero-Web-Course4/b11a12-client-side-yeasin-islam) -->
- **Server Side GitHub:** [Real_State_Platfrom_Sever](https://github.com/yeasin-islam/Real_State_Platfrom_Sever)

---

## 🚀 Key Features

- 🔒 **Authentication:** Secure login and registration with context-based user management.
- 🏢 **Role-Based Dashboards:** Separate dashboards for Admin, Agent, and User roles.
- 🏷️ **Property Listings:** Browse, add, edit, and manage real estate properties.
- 👮 **Admin Controls:** Manage users, assign roles, mark agents as fraud, and delete users.
- 🏠 **Agent Panel:** Agents can add, update, and manage their own property listings.
- 📊 **User Dashboard:** Users can view their favorite properties and manage their profile.
- ⚡ **Modern UI:** Responsive design with smooth animations and a clean layout.
- 🔗 **Secure API Integration:** Uses Axios and custom hooks for secure and efficient API requests.
- 🛡️ **Error Handling:** Custom error and forbidden pages for a seamless user experience.
- 📱 **Mobile Friendly:** Fully responsive for all devices.
- 🕵️ **Fraud Detection:** Admins can mark agents as fraud, automatically removing their properties.
- 📝 **Detailed Property Info:** View property details, images, and agent contact information.
- 🔍 **Search & Filter:** Easily search and filter properties by various criteria.

---

## 🛠️ Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, DaisyUI, React Router, React Hook Form, React Helmet Async, Framer Motion, AOS, Lottie React, React Icons, Recharts, React Fast Marquee, React Responsive Carousel, Leaflet, React Leaflet
- **Backend:** Node.js, Express.js (see [server repo](https://github.com/Programming-Hero-Web-Course4/b11a12-server-side-yeasin-islam))
- **Authentication:** Firebase Authentication
- **Database:** MongoDB (via backend)
- **APIs:** Axios, Custom Hooks
- **Payments:** Stripe
- **Other:** SweetAlert2, React Query

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
