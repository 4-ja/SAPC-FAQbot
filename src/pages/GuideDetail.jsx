import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { ArrowLeft, FileText, Download, ExternalLink, User, Maximize2, X } from 'lucide-react';
import { Trash2, Edit3 } from 'lucide-react';
import { logAction } from '../services/auditServices';

export default function GuideDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [guide, setGuide] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false); // For image enlargement

  const handleDelete = async () => {
  if (window.confirm("Are you sure you want to delete this guide? This action cannot be undone.")) {
    try {
      await deleteDoc(doc(db, "wiki", id));
      // After the deleteDoc:
      await logAction("DELETED", guide.question, id);
      alert("Guide deleted successfully.");
      navigate('/wiki'); // Send user back to the list
    } catch (error) {
      console.error("Error deleting document: ", error);
      alert("Failed to delete guide.");
    }
  }
};



  useEffect(() => {
    const fetchGuide = async () => {
      const docRef = doc(db, "wiki", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setGuide(docSnap.data());
      }
    };
    fetchGuide();
  }, [id]);

  if (!guide) return (
    <div style={{ ...styles.pageWrapper, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ color: '#64748b' }}>Loading technical guide...</div>
    </div>
  );

  return (
  <div style={styles.pageWrapper}>
    <div style={styles.container}>
      
      {/* NEW HEADER BAR: Aligns Back button and Edit/Delete buttons */}
      <div style={styles.topBar}>
        <button onClick={() => navigate('/wiki')} style={styles.backBtn}>
          <ArrowLeft size={18} /> Back to Wiki
        </button>

        <div style={styles.adminControls}>
          <button 
            onClick={() => navigate(`/wiki/edit/${id}`)} 
            style={styles.editBtn}
          >
            <Edit3 size={16} /> Edit Guide
          </button>
          <button 
            onClick={handleDelete} 
            style={styles.deleteBtn}
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>
        <div style={styles.contentCard}>
          <header style={styles.headerSection}>
            <span style={styles.categoryTag}>{guide.category}</span>
            <h1 style={styles.title}>{guide.question}</h1>
            <div style={styles.authorMeta}>
              <User size={14} />
              <span>Contributed by: <strong>{guide.authorName || "System"}</strong></span>
            </div>
          </header>

          <div style={styles.bodySection}>
            <h3 style={styles.sectionLabel}>Solution Details</h3>
            <div style={styles.answerText}>{guide.answer}</div>
          </div>

          {guide.media && (
            <div style={styles.mediaSection}>
              <div style={styles.mediaHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={18} color="#28a745" />
                  <span style={{ fontWeight: 'bold', color: '#0f172a' }}>Reference Material</span>
                </div>
              </div>
              
              <div style={styles.mediaContainer}>
                {guide.type === 'pdf' ? (
                  <div style={styles.pdfContainer}>
                    <div style={styles.iframeWrapper}>
                      <iframe src={guide.media} style={styles.pdfIframe} title="Manual" />
                    </div>
                    <div style={styles.pdfActions}>
                      <a href={guide.media} target="_blank" rel="noreferrer" style={styles.actionBtn}>
                        <ExternalLink size={18} /> View Full PDF
                      </a>
                      {/* Cloudinary Force Download Hack */}
                      <a href={guide.media.replace('/upload/', '/upload/fl_attachment/')} style={{ ...styles.actionBtn, backgroundColor: '#64748b' }}>
                        <Download size={18} /> Download
                      </a>
                    </div>
                  </div>
                ) : (
                  <div style={styles.imageBox} onClick={() => setIsZoomed(true)}>
                    <div style={styles.hoverOverlay}>
                      <Maximize2 color="white" />
                      <span>Click to Enlarge</span>
                    </div>
                    <img src={guide.media} alt="Technical" style={styles.previewImage} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FULLSCREEN IMAGE ZOOM MODAL */}
      {isZoomed && (
        <div style={styles.zoomOverlay} onClick={() => setIsZoomed(false)}>
          <button style={styles.closeZoom}><X size={30} /></button>
          <img src={guide.media} alt="Enlarged" style={styles.zoomedImage} />
        </div>
      )}
    </div>
  );
}

const styles = {
  pageWrapper: { backgroundColor: '#f8fafc', minHeight: '100vh', padding: '40px 20px' },
  container: { maxWidth: '850px', margin: '0 auto' },
  backBtn: { display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', color: '#64748b', border: '1px solid #e2e8f0', padding: '10px 18px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', marginBottom: '25px' },
  contentCard: { backgroundColor: '#fff', borderRadius: '24px', padding: '40px', border: '1px solid #e2e8f0' },
  headerSection: { marginBottom: '30px', borderBottom: '1px solid #f1f5f9', paddingBottom: '25px' },
  categoryTag: { color: '#28a745', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' },
  title: { fontSize: '2.2rem', color: '#0f172a', margin: '10px 0', fontWeight: '800' },
  authorMeta: { display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.9rem' },
  bodySection: { marginBottom: '40px' },
  sectionLabel: { fontSize: '0.8rem', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '15px' },
  answerText: { lineHeight: '1.8', fontSize: '1.1rem', color: '#334155', whiteSpace: 'pre-wrap' },
  
  mediaSection: { marginTop: '30px', paddingTop: '30px', borderTop: '2px dashed #f1f5f9' },
  mediaHeader: { marginBottom: '20px' },
  mediaContainer: { backgroundColor: '#f8fafc', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' },
  
  // PDF STYLES
  pdfContainer: { display: 'flex', flexDirection: 'column', gap: '15px' },
  iframeWrapper: { height: '500px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #cbd5e1', backgroundColor: '#fff' },
  pdfIframe: { width: '100%', height: '100%', border: 'none' },
  pdfActions: { display: 'flex', gap: '10px' },
  actionBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '10px', backgroundColor: '#28a745', color: '#fff', textDecoration: 'none', fontWeight: 'bold' },

  // IMAGE ZOOM STYLES
  imageBox: { position: 'relative', cursor: 'zoom-in', borderRadius: '12px', overflow: 'hidden', display: 'flex', justifyContent: 'center' },
  previewImage: { maxWidth: '100%', maxHeight: '500px', objectFit: 'contain' },
  hoverOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: '0.3s', color: '#fff', fontWeight: 'bold', gap: '10px' },
  
  // ZOOM MODAL STYLES
  zoomOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.95)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out' },
  zoomedImage: { maxWidth: '95%', maxHeight: '95%', borderRadius: '10px', boxShadow: '0 0 50px rgba(0,0,0,0.5)' },
  closeZoom: { position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between', // This is what pushes them to opposite sides
    alignItems: 'center',
    marginBottom: '25px', // Space between the buttons and the card
    width: '100%'
  },
  
  editBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    // Professional Blue Theme
    background: '#eff6ff', 
    color: '#2563eb',
    border: '1px solid #bfdbfe',
    padding: '8px 15px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.2s ease'
  },
  deleteBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    // Warning Red Theme
    background: '#fef2f2',
    color: '#dc2626',
    border: '1px solid #fecaca',
    padding: '8px 15px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.2s ease'
  },

  adminControls: {
    display: 'flex',
    gap: '10px',
    margin: 0 // MUST BE 0
  },
};