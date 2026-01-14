import { Link, useLocation } from 'react-router-dom';
import { Star } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

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
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 4rem',
    background: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
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
    gap: '30px',
    height: '100%',
  },
  link: {
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '0.9rem',
    padding: '20px 0',
    transition: 'all 0.2s ease',
  }
};