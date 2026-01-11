import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Wiki from './pages/Wiki';
import Home from './pages/Home';
import Navbar from './components/Navbar'

function App() {
  const [count, setCount] = useState(0)
  return (
    <BrowserRouter>
      <Navbar /> {/* Stays visible on every page */}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/wiki" element={<Wiki />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
