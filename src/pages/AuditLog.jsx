import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Clock, User, Activity, AlertCircle } from 'lucide-react';

export default function AuditLog() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const q = query(collection(db, "auditLogs"), orderBy("timestamp", "desc"));
      const snap = await getDocs(q);
      setLogs(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchLogs();
  }, []);

  const getActionColor = (action) => {
    if (action === "CREATED") return "#28a745";
    if (action === "UPDATED") return "#2563eb";
    if (action === "DELETED") return "#dc2626";
    return "#64748b";
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}><Activity color="#28a745" /> System Audit Log</h1>
          <p style={styles.subtitle}>Recent activity across the ESSI Knowledge Base</p>
        </header>

        <div style={styles.timeline}>
          {logs.map((log) => (
            <div key={log.id} style={styles.logCard}>
              <div style={{ ...styles.actionIndicator, backgroundColor: getActionColor(log.action) }}>
                {log.action}
              </div>
              <div style={styles.logInfo}>
                <h3 style={styles.targetTitle}>{log.targetTitle}</h3>
                <div style={styles.metaRow}>
                  <span style={styles.metaItem}><User size={14} /> {log.userName}</span>
                  <span style={styles.metaItem}><Clock size={14} /> {log.timestamp?.toDate().toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { backgroundColor: '#f8fafc', minHeight: '100vh', padding: '40px 20px' },
  container: { maxWidth: '800px', margin: '0 auto' },
  header: { marginBottom: '30px' },
  title: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '2rem', color: '#0f172a' },
  subtitle: { color: '#64748b' },
  timeline: { display: 'flex', flexDirection: 'column', gap: '15px' },
  logCard: { 
    backgroundColor: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0',
    display: 'flex', alignItems: 'center', gap: '20px' 
  },
  actionIndicator: { 
    padding: '6px 12px', borderRadius: '8px', color: '#fff', fontSize: '0.7rem', fontWeight: 'bold', width: '80px', textAlign: 'center' 
  },
  logInfo: { flex: 1 },
  targetTitle: { margin: '0 0 5px 0', fontSize: '1.1rem', color: '#1e293b' },
  metaRow: { display: 'flex', gap: '20px', color: '#94a3b8', fontSize: '0.85rem' },
  metaItem: { display: 'flex', alignItems: 'center', gap: '5px' }
};