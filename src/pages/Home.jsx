import { Link } from 'react-router-dom';

export default function Home() {
  // Mock stats to make it look like a real IT dashboard
  const stats = [
    { label: "Active Wiki Guides", count: "45+" },
    { label: "Avg. Resolution Time", count: "2 hrs" },
    { label: "Resolved Today", count: "12" }
  ];

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>SAPC IT Resource Center</h1>
        <p>Empowering our team with self-service troubleshooting and documentation.</p>
      </header>

      {/* Quick Stats Section */}
      <div style={styles.statsRow}>
        {stats.map((stat, index) => (
          <div key={index} style={styles.statCard}>
            <h3>{stat.count}</h3>
            <p>{stat.label}</p>
          </div>
        ))}
      </div>

      <section style={styles.actionSection}>
        <h2>How can we help you today?</h2>
        <div style={styles.cardGrid}>
          
          {/* Link to the Wiki you just built */}
          <Link to="/wiki" style={styles.card}>
            <h3>Knowledge Base</h3>
            <p>Search our Wiki for fixes to common hardware and software issues.</p>
            <span style={styles.linkText}>Browse Guides →</span>
          </Link>

          <div style={styles.card}>
            <h3>Submit a Ticket</h3>
            <p>Can't find a fix? Reach out to the IT department for direct support.</p>
            <span style={styles.linkText}>Open Portal →</span>
          </div>

          <div style={styles.card}>
            <h3>Intern Onboarding</h3>
            <p>New to the team? View the manual and system setup requirements.</p>
            <span style={styles.linkText}>View Manual →</span>
          </div>

        </div>
      </section>
    </div>
  );
}

// Simple Inline Styles for a professional look
const styles = {
  container: { padding: '40px', maxWidth: '1100px', margin: '0 auto', fontFamily: 'sans-serif', color: '#fff' },
  header: { textAlign: 'center', marginBottom: '50px' },
  statsRow: { display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '50px' },
  statCard: { background: '#2a2a2a', padding: '20px', borderRadius: '12px', textAlign: 'center', flex: 1, border: '1px solid #444' },
  actionSection: { textAlign: 'center' },
  cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px', marginTop: '30px' },
  card: { 
    background: '#333', 
    padding: '30px', 
    borderRadius: '15px', 
    textDecoration: 'none', 
    color: 'inherit', 
    textAlign: 'left',
    transition: 'transform 0.2s',
    display: 'block',
    border: '1px solid #555'
  },
  linkText: { color: '#646cff', fontWeight: 'bold', marginTop: '15px', display: 'inline-block' }
};