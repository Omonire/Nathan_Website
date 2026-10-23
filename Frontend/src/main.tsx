import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SiteProvider } from './lib/site-context'
import './index.css'
import App from './App.tsx'
import { AdminLogin } from './components/AdminLogin'
import { AdminDashboard } from './components/AdminDashboard'
import { BlogPage } from './components/Blog'
import { BlogPost } from './components/BlogPost'
import { WorkPage } from './components/OurWork'
import { ContactPage } from './components/Contact'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SiteProvider>
      <BrowserRouter>
        <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </SiteProvider>
  </StrictMode>,
)
