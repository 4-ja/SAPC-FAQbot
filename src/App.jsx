import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Wiki from './pages/Wiki';
import Home from './pages/Home';
import Navbar from './components/Navbar'
import Chatbot from './components/Chatbot';
import GuideDetail from './pages/GuideDetail';
import Login from './pages/Login';
import EditGuide from './components/EditGuide';
import AuditLog from './pages/AuditLog';


function App() {
  const [count, setCount] = useState(0)
  return (
    <BrowserRouter>
      <Navbar /> {/* Stays visible on every page */}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/wiki" element={<Wiki />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/audit-log" element={<AuditLog/>}/>
        <Route path="/wiki/:id" element={<GuideDetail />} />
        <Route path="/wiki/edit/:id" element={<EditGuide />} />
      </Routes>
      <Chatbot></Chatbot> 
    </BrowserRouter>
  )
}

export default App
