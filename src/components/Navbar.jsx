import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { Star, LogIn, LogOut, User, History } from 'lucide-react'; // Added History icon

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logoContainer}>
        <div style={styles.starIcon}>
          <Star size={18} fill="#ed1c24" color="#ed1c24" />
        </div>
        <div style={styles.logoText}>
          EXPRESSIONS <span style={{ color: '#28a745' }}>IT PORTAL</span>
        </div>
      </div>

      <div style={styles.links}>
        <Link 
          to="/" 
          style={{
            ...styles.link, 
            color: location.pathname === '/' ? '#28a745' : '#64748b',
            borderBottom: location.pathname === '/' ? '2px solid #28a745' : '2px solid transparent'
          }}
        >
          Home
        </Link>
        <Link 
          to="/wiki" 
          style={{
            ...styles.link, 
            color: location.pathname.startsWith('/wiki') ? '#28a745' : '#64748b',
            borderBottom: location.pathname.startsWith('/wiki') ? '2px solid #28a745' : '2px solid transparent'
          }}
        >
          Wiki/FAQ
        </Link>

        {/* NEW: SYSTEM LOGS LINK (Visible to everyone logged in) */}
        {user && (
          <Link 
            to="/audit-log" 
            style={{
              ...styles.link, 
              gap: '6px',
              color: location.pathname === '/audit-log' ? '#28a745' : '#64748b',
              borderBottom: location.pathname === '/audit-log' ? '2px solid #28a745' : '2px solid transparent'
            }}
          >
            <History size={16} /> Logs
          </Link>
        )}

        {/* AUTH SECTION */}
        <div style={styles.authWrapper}>
          {user ? (
            <div style={styles.userProfile}>
              <div style={styles.userInfo}>
                <User size={14} color="#64748b" />
                <span style={styles.userName}>{user.displayName?.split(' ')[0] || 'Staff'}</span>
              </div>
              <button onClick={handleLogout} style={styles.logoutBtn} title="Logout">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/login" style={styles.loginBtn}>
              <LogIn size={16} />
              <span>Staff Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 4rem',
    background: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
    height: '70px'
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  starIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontWeight: '900',
    fontSize: '1.1rem',
    letterSpacing: '-0.5px',
    color: '#0f172a',
    fontFamily: "'Inter', sans-serif",
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '30px',
    height: '100%',
  },
  link: {
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '0.9rem',
    padding: '25px 0',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center'
  },
  authWrapper: {
    marginLeft: '10px',
    display: 'flex',
    alignItems: 'center'
  },
  loginBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#28a745',
    color: '#fff',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: '10px',
    fontSize: '0.85rem',
    fontWeight: '700',
    transition: 'opacity 0.2s'
  },
  userProfile: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#f8fafc',
    padding: '5px 5px 5px 12px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  userName: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#1e293b'
  },
  logoutBtn: {
    background: '#fff',
    border: '1px solid #e2e8f0',
    color: '#ed1c24',
    padding: '6px',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.2s'
  }
};