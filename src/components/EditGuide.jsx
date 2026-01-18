import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { ArrowLeft, Save } from 'lucide-react';
import { logAction } from '../services/auditServices';

export default function EditGuide() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'HARDWARE'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExistingData = async () => {
      const docRef = doc(db, "wiki", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFormData(docSnap.data());
      }
      setLoading(false);
    };
    fetchExistingData();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const guideRef = doc(db, "wiki", id);
      await updateDoc(guideRef, formData);
      // After the updateDoc:
        await logAction("UPDATED", formData.question, id);
      alert("Guide updated successfully!");
      navigate(`/wiki/${id}`); // Send back to the detail view
    } catch (error) {
      console.error("Update failed:", error);
      alert("Error updating guide.");
    }
  };

  if (loading) return <div style={{padding: '50px', textAlign: 'center'}}>Loading data...</div>;

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>
          <ArrowLeft size={18} /> Cancel
        </button>

        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>Edit Technical Guide</h2>
          
          <form onSubmit={handleUpdate} style={styles.form}>
            <label style={styles.label}>Issue / Question</label>
            <input 
              style={styles.input}
              value={formData.question}
              onChange={(e) => setFormData({...formData, question: e.target.value})}
              required
            />

            <label style={styles.label}>Category</label>
            <select 
              style={styles.input}
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="HARDWARE">HARDWARE</option>
              <option value="SOFTWARE">SOFTWARE</option>
              <option value="NETWORK">NETWORK</option>
              <option value="POS SYSTEM">POS SYSTEM</option>
            </select>

            <label style={styles.label}>Solution Details</label>
            <textarea 
              style={{...styles.input, height: '200px', resize: 'vertical'}}
              value={formData.answer}
              onChange={(e) => setFormData({...formData, answer: e.target.value})}
              required
            />

            <button type="submit" style={styles.saveBtn}>
              <Save size={18} /> Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: { backgroundColor: '#f8fafc', minHeight: '100vh', padding: '40px 20px' },
  container: { maxWidth: '700px', margin: '0 auto' },
  backBtn: { display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginBottom: '20px', fontWeight: 'bold' },
  formCard: { backgroundColor: '#fff', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' },
  formTitle: { margin: '0 0 25px 0', color: '#0f172a' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  label: { fontSize: '0.9rem', fontWeight: '600', color: '#475569' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem' },
  saveBtn: { marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#28a745', color: '#fff', padding: '14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }
};