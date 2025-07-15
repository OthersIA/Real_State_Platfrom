import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import Router from './routes/router.jsx'
import AuthProvider from './context/AuthProvider.jsx'


createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <RouterProvider router={Router} />
  </AuthProvider>

)