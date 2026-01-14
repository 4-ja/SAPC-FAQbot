import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import { BookOpen, LifeBuoy, UserPlus, Activity, ChevronRight, Sparkles, Star } from 'lucide-react';

export default function Home() {
  const [wikiCount, setWikiCount] = useState(0);
  const [resolvedCount, setResolvedCount] = useState(0);
  const [avgTime] = useState("4.2m"); 

  useEffect(() => {
    const fetchWikiCount = async () => {
      try {
        const snap = await getDocs(collection(db, "wiki"));
        setWikiCount(snap.size);
      } catch (err) {
        console.error("Error fetching wiki count:", err);
      }
    };

    const unsubscribe = onSnapshot(doc(db, "stats", "global_metrics"), (doc) => {
      if (doc.exists()) {
        setResolvedCount(doc.data().totalResolved || 0);
      }
    });

    fetchWikiCount();
    return () => unsubscribe();
  }, []);

  // Using Expressions Green as the primary theme color
  const stats = [
    { label: "Active Wiki Guides", count: `${wikiCount}`, icon: <BookOpen size={20} color="#28a745" />, border: "#28a745" },
    { label: "Avg. Resolution Time", count: avgTime, icon: <Activity size={20} color="#28a745" />, border: "#28a745" },
    { label: "Issues Resolved", count: `${resolvedCount}`, icon: <Sparkles size={20} color="#ed1c24" />, border: "#ed1c24" }
  ];

  return (
    <div style={styles.pageBackground}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.badge}>
             <Star size={12} fill="#ed1c24" color="#ed1c24" /> 
             <span style={{ marginLeft: '8px' }}>EXPRESSIONS STATIONERY SHOP INC.</span>
          </div>
          <h1 style={styles.mainTitle}>IT Resource <span style={{color: '#28a745'}}>Center</span></h1>
          <p style={styles.subtitle}>Empowering our team with self-service troubleshooting and the creative tools to work better.</p>
        </header>

        {/* Dynamic Stats Row */}
        <div style={styles.statsRow}>
          {stats.map((stat, index) => (
            <div key={index} style={{...styles.statCard, borderTop: `4px solid ${stat.border}`}}>
              <div style={styles.statIcon}>{stat.icon}</div>
              <h3 style={styles.statNumber}>{stat.count}</h3>
              <p style={styles.statLabel}>{stat.label}</p>
            </div>
          ))}
        </div>

        <section style={styles.actionSection}>
          <h2 style={styles.sectionTitle}>How can we help you today?</h2>
          <div style={styles.cardGrid}>
            
            <Link to="/wiki" style={styles.card} className="home-card">
              <div style={styles.cardHeader}>
                <div style={{...styles.iconBg, backgroundColor: 'rgba(40, 167, 69, 0.1)'}}>
                   <BookOpen size={22} color="#28a745" />
                </div>
                <h3>Knowledge Base</h3>
              </div>
              <p style={styles.cardBody}>Search our Wiki for fixes to common hardware, POS systems, and software issues.</p>
              <span style={styles.linkText}>Browse Guides <ChevronRight size={16} /></span>
            </Link>

            <div style={styles.card} className="home-card">
              <div style={styles.cardHeader}>
                <div style={{...styles.iconBg, backgroundColor: 'rgba(40, 167, 69, 0.1)'}}>
                  <LifeBuoy size={22} color="#28a745" />
                </div>
                <h3>Submit a Ticket</h3>
              </div>
              <p style={styles.cardBody}>Can't find a fix? Reach out to the Head Office IT department for direct support.</p>
              <span style={styles.linkText}>Open Portal <ChevronRight size={16} /></span>
            </div>

            <div style={styles.card} className="home-card">
              <div style={styles.cardHeader}>
                <div style={{...styles.iconBg, backgroundColor: 'rgba(40, 167, 69, 0.1)'}}>
                  <UserPlus size={22} color="#28a745" />
                </div>
                <h3>Intern Onboarding</h3>
              </div>
              <p style={styles.cardBody}>Welcome to the Change Makers program. View system setup and requirements.</p>
              <span style={styles.linkText}>View Manual <ChevronRight size={16} /></span>
            </div>

          </div>
        </section>
      </div>
    </div>
  );
}

const styles = {
  pageBackground: {
    backgroundColor: '#f8fafc', // Soft light background to prevent eye strain
    minHeight: '100vh',
    fontFamily: "'Inter', sans-serif",
  },
  container: { padding: '80px 20px', maxWidth: '1200px', margin: '0 auto', color: '#1e293b' },
  header: { textAlign: 'center', marginBottom: '70px' },
  badge: { 
    background: '#fff', 
    color: '#64748b', 
    padding: '8px 20px', 
    borderRadius: '30px', 
    fontSize: '0.7rem', 
    fontWeight: '700', 
    letterSpacing: '1.5px',
    display: 'inline-flex',
    alignItems: 'center',
    marginBottom: '20px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
  },
  mainTitle: { fontSize: '4rem', fontWeight: '900', margin: '0 0 20px 0', letterSpacing: '-2px', color: '#0f172a' },
  subtitle: { fontSize: '1.15rem', color: '#64748b', maxWidth: '600px', margin: '0 auto', lineHeight: '1.7', fontWeight: '400' },
  
  statsRow: { display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '80px', flexWrap: 'wrap' },
  statCard: { 
    background: '#fff', 
    padding: '35px 25px', 
    borderRadius: '24px', 
    textAlign: 'center', 
    flex: '1', 
    minWidth: '220px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.04)',
    transition: 'transform 0.3s ease'
  },
  statIcon: { marginBottom: '15px', display: 'flex', justifyContent: 'center' },
  statNumber: { fontSize: '2.8rem', margin: '0', fontWeight: '800', color: '#0f172a' },
  statLabel: { color: '#94a3b8', fontSize: '0.85rem', marginTop: '8px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' },

  actionSection: { textAlign: 'left' },
  sectionTitle: { fontSize: '1.5rem', marginBottom: '35px', fontWeight: '700', color: '#1e293b' },
  cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px' },
  card: { 
    background: '#fff', 
    padding: '40px', 
    borderRadius: '28px', 
    textDecoration: 'none', 
    color: 'inherit', 
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'block',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
  },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '20px' },
  iconBg: { width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cardBody: { color: '#64748b', lineHeight: '1.6', fontSize: '0.95rem', marginBottom: '20px' },
  linkText: { 
    color: '#28a745', // Expressions Green
    fontWeight: '700', 
    fontSize: '0.9rem', 
    display: 'flex', 
    alignItems: 'center', 
    gap: '5px',
    transition: 'gap 0.2s'
  }
};