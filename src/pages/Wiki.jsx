import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy, addDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth'; 
import { db, auth } from '../services/firebase'; 
import { uploadToCloudinary } from '../services/cloudinary';
import { Plus, Search, FileText, ArrowRight, X, Image as ImageIcon, Upload, CheckCircle } from 'lucide-react';
import { logAction } from '../services/auditServices';


export default function Wiki() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All"); // Added for filtering
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newEntry, setNewEntry] = useState({
    question: '',
    answer: '',
    category: 'Hardware',
    file: null
  });

  const categories = ["All", "Hardware", "Software", "POS System", "Network"];

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const q = query(collection(db, "wiki"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFaqs(data);
    } catch (error) {
      console.error("Firebase Fetch Error:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      alert("You must be signed in to contribute to the Wiki.");
      return;
    }

    setLoading(true);
    try {
      let fileInfo = { url: null, type: null };
      if (newEntry.file) {
        fileInfo = await uploadToCloudinary(newEntry.file);
      }

      await addDoc(collection(db, "wiki"), {
        question: newEntry.question,
        answer: newEntry.answer,
        category: newEntry.category,
        media: fileInfo.url,
        type: fileInfo.type,
        createdAt: new Date(),
        authorName: auth.currentUser.displayName || "Anonymous Staff",
        authorEmail: auth.currentUser.email,
        authorId: auth.currentUser.uid,
      });
      await logAction("CREATED", newEntry.question, "new");
      setIsModalOpen(false);
      setNewEntry({ question: '', answer: '', category: 'Hardware', file: null });
      fetchFaqs();
      alert(`Success! Solution added by ${auth.currentUser.displayName}`);
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // COMBINED FILTER LOGIC
  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === "All" || faq.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div style={wikiStyles.pageBackground}>
      <div style={wikiStyles.container}>

        <header style={wikiStyles.header}>
          <div style={wikiStyles.badge}>
            <FileText size={14} /> KNOWLEDGE BASE
          </div>
          <h1 style={wikiStyles.title}>ESSI <span style={{ color: '#28a745' }}>Technical Wiki</span></h1>
          <div style={wikiStyles.headerActions}>
            <p style={wikiStyles.subtitle}>Access troubleshooting steps for POS systems, printers, and store software.</p>
            <button onClick={() => setIsModalOpen(true)} style={wikiStyles.addButton}>
              <Plus size={18} /> Contribute Fix
            </button>
          </div>
        </header>

        {/* SEARCH & CATEGORY FILTERS */}
        <div style={wikiStyles.filterSection}>
          <div style={wikiStyles.searchContainer}>
            <Search style={wikiStyles.searchIcon} size={20} />
            <input
              type="text"
              placeholder="Search for an issue or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={wikiStyles.searchInput}
            />
          </div>

          <div style={wikiStyles.categoryBar}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  ...wikiStyles.categoryChip,
                  backgroundColor: activeCategory === cat ? '#28a745' : '#fff',
                  color: activeCategory === cat ? '#fff' : '#64748b',
                  border: activeCategory === cat ? '1px solid #28a745' : '1px solid #e2e8f0',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div style={wikiStyles.cardGrid}>
          {filteredFaqs.map((faq) => (
            <div
              key={faq.id}
              onClick={() => navigate(`/wiki/${faq.id}`)}
              style={wikiStyles.faqCard}
              className="home-card"
            >
              <span style={wikiStyles.cardCategory}>{faq.category}</span>
              <h3 style={wikiStyles.cardTitle}>{faq.question}</h3>
              <p style={wikiStyles.cardExcerpt}>{faq.answer}</p>

              <div style={wikiStyles.authorSection}>
                <div style={wikiStyles.authorBadge}>
                  <span style={{ fontWeight: '700', color: '#64748b' }}>BY:</span>
                  <span style={{ color: '#0f172a', fontWeight: '800', marginLeft: '5px' }}>
                    {faq.authorName ? faq.authorName.toUpperCase() : "SYSTEM"}
                  </span>
                </div>
              </div>

              <div style={wikiStyles.cardLink}>
                View Full Guide <ArrowRight size={16} />
              </div>
            </div>
          ))}
        </div>

        {isModalOpen && (
          <div style={wikiStyles.modalOverlay}>
            <div style={wikiStyles.modalContent}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 style={{ color: '#0f172a', margin: 0 }}>New Technical Solution</h2>
                <X onClick={() => setIsModalOpen(false)} style={{ cursor: 'pointer', color: '#64748b' }} />
              </div>
              
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={wikiStyles.inputGroup}>
                  <label style={wikiStyles.inputLabel}>Issue Title</label>
                  <input type="text" required placeholder="e.g., POS Receipt Printer Not Cutting" style={wikiStyles.modalInput}
                    onChange={e => setNewEntry({ ...newEntry, question: e.target.value })} />
                </div>

                <div style={wikiStyles.inputGroup}>
                  <label style={wikiStyles.inputLabel}>Step-by-step solution</label>
                  <textarea required placeholder="Detailed steps to fix the issue..." style={{ ...wikiStyles.modalInput, height: '100px' }}
                    onChange={e => setNewEntry({ ...newEntry, answer: e.target.value })} />
                </div>

                <div style={wikiStyles.inputGroup}>
                  <label style={wikiStyles.inputLabel}>Category</label>
                  <select style={wikiStyles.modalInput} onChange={e => setNewEntry({ ...newEntry, category: e.target.value })}>
                    <option value="Hardware">Hardware</option>
                    <option value="Software">Software</option>
                    <option value="POS System">POS System</option>
                    <option value="Network">Network</option>
                  </select>
                </div>

                <div style={wikiStyles.attachmentBox}>
                  <label style={wikiStyles.inputLabel}>Attachment (Optional)</label>
                  <div style={wikiStyles.fileInputWrapper}>
                    <input 
                      type="file" 
                      id="file-upload"
                      style={{ display: 'none' }}
                      onChange={e => setNewEntry({ ...newEntry, file: e.target.files[0] })} 
                    />
                    <label htmlFor="file-upload" style={wikiStyles.customFileBtn}>
                      <Upload size={16} /> Choose File
                    </label>
                    <span style={wikiStyles.fileNameDisplay}>
                      {newEntry.file ? (
                        <span style={{ color: '#28a745', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <CheckCircle size={14} /> {newEntry.file.name}
                        </span>
                      ) : (
                        "No file selected"
                      )}
                    </span>
                  </div>
                  <p style={wikiStyles.fileHint}>Images, PDFs, or Docs (Max 5MB)</p>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button type="submit" style={wikiStyles.publishBtn} disabled={loading}>
                    {loading ? "Publishing..." : "Publish to Wiki"}
                  </button>
                  <button type="button" style={wikiStyles.cancelBtn} onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const wikiStyles = {
  pageBackground: { backgroundColor: '#f8fafc', minHeight: '100vh', padding: '40px 20px' },
  container: { maxWidth: '1200px', margin: '0 auto' },
  header: { marginBottom: '40px' },
  badge: {
    display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#fff',
    color: '#64748b', padding: '6px 16px', borderRadius: '20px', fontSize: '0.75rem',
    fontWeight: 'bold', border: '1px solid #e2e8f0', marginBottom: '15px'
  },
  title: { fontSize: '3rem', fontWeight: '900', color: '#0f172a', margin: '0 0 10px 0', letterSpacing: '-1px' },
  subtitle: { margin: 0, color: '#64748b', fontSize: '1.1rem' },
  headerActions: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginTop: '10px' },
  addButton: { backgroundColor: '#28a745', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px', color: '#fff', cursor: 'pointer', fontWeight: 'bold' },

  filterSection: { marginBottom: '50px', display: 'flex', flexDirection: 'column', gap: '20px' },
  searchContainer: { position: 'relative', flex: 1 },
  searchIcon: { position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', zIndex: 1 },
  searchInput: { width: '100%', padding: '16px 16px 16px 48px', borderRadius: '14px', background: '#fff', border: '1px solid #e2e8f0', color: '#1e293b', fontSize: '1rem', outline: 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' },
  
  categoryBar: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  categoryChip: { padding: '8px 20px', borderRadius: '100px', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s ease', outline: 'none' },

  cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' },
  faqCard: {
    background: '#fff', padding: '35px', borderRadius: '24px', border: '1px solid #e2e8f0',
    cursor: 'pointer', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
  },
  cardCategory: { color: '#28a745', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.5px' },
  cardTitle: { color: '#0f172a', fontSize: '1.25rem', fontWeight: '800', marginBottom: '12px', margin: 0, lineHeight: '1.3' },
  cardExcerpt: { color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  
  authorSection: { marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #f1f5f9' },
  authorBadge: { fontSize: '0.75rem', display: 'flex', alignItems: 'center' },
  
  cardLink: { marginTop: '15px', color: '#28a745', fontWeight: '800', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' },

  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 },
  modalContent: { background: '#fff', padding: '35px', borderRadius: '28px', maxWidth: '500px', width: '95%', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', maxHeight: '90vh', overflowY: 'auto' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
  inputLabel: { fontSize: '0.85rem', fontWeight: '700', color: '#475569', marginBottom: '2px' },
  modalInput: { padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.95rem', outline: 'none', background: '#f8fafc', color: '#0f172a' },
  
  attachmentBox: { padding: '15px', borderRadius: '15px', background: '#f1f5f9', border: '1px dashed #cbd5e1' },
  fileInputWrapper: { display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' },
  customFileBtn: { 
    backgroundColor: '#fff', border: '1px solid #28a745', color: '#28a745', 
    padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', 
    fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' 
  },
  fileNameDisplay: { fontSize: '0.85rem', color: '#64748b', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  fileHint: { fontSize: '0.7rem', color: '#94a3b8', marginTop: '8px', fontStyle: 'italic' },

  publishBtn: { backgroundColor: '#28a745', color: '#fff', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', flex: 1, fontSize: '1rem' },
  cancelBtn: { backgroundColor: '#f1f5f9', color: '#64748b', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', flex: 1, fontSize: '1rem' },
};