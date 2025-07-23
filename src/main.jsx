import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router';
import Router from './routes/router.jsx';
import AuthProvider from './context/AuthProvider.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import 'aos/dist/aos.css';
import Aos from 'aos';
import { HelmetProvider } from 'react-helmet-async';

Aos.init({
  duration: 700,
  easing: 'ease-in-out',
  once: true,
});

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <AuthProvider>
        <RouterProvider router={Router} />
      </AuthProvider>
    </HelmetProvider>
  </QueryClientProvider>
);
