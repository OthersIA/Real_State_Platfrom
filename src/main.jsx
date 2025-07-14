import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Navber from './components/Home/Navber.jsx'
import Hero from './components/Home/Hero.jsx'
import Footer from './components/Home/Footer.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Navber></Navber>
    <Hero></Hero>
    <Footer></Footer>
  </StrictMode>,
)
