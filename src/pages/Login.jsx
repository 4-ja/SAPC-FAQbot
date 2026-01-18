import React from 'react';
import { auth, googleProvider } from '../services/firebase';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Star, LogIn } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/wiki');
    } catch (error) {
      console.error("Login Failed", error);
    }
  };

  return (
    <div style={loginStyles.container}>
      <div style={loginStyles.card}>
        <Star size={40} fill="#ed1c24" color="#ed1c24" />
        <h1 style={{ color: '#000000', margin: '20px 0 10px' }}>ESSI <span style={{ color: '#28a745' }}>Staff Portal</span></h1>
        <p style={{ color: '#64748b', marginBottom: '30px' }}>Sign in to manage the Knowledge Base</p>
        <button onClick={handleLogin} style={loginStyles.loginBtn}>
          <LogIn size={20} /> Sign in with Google
        </button>
      </div>
    </div>
  );
}

const loginStyles = {
  container: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' },
  card: { padding: '50px', backgroundColor: '#fff', borderRadius: '28px', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0' },
  loginBtn: { backgroundColor: '#28a745', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', margin: '0 auto' }
};