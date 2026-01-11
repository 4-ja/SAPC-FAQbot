import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>SAPC IT PORTAL</div>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/wiki" style={styles.link}>Wiki/FAQ</Link>
        {/* You can add more links here later */}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    background: '#1a1a1a',
    borderBottom: '1px solid #333',
    color: 'white'
  },
  logo: {
    fontWeight: 'bold',
    fontSize: '1.2rem',
    letterSpacing: '1px'
  },
  links: {
    display: 'flex',
    gap: '20px'
  },
  link: {
    color: '#646cff',
    textDecoration: 'none',
    fontWeight: '500'
  }
};