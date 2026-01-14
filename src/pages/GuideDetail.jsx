import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

export default function GuideDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [guide, setGuide] = useState(null);

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

  if (!guide) return <div className="container">Loading guide...</div>;

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <button onClick={() => navigate('/wiki')} className="btn-primary" style={{ marginBottom: '20px', background: '#475569' }}>
        ← Back to Wiki
      </button>
      
      <span className="category-tag">{guide.category}</span>
      <h1 style={{ fontSize: '2.5rem', margin: '20px 0' }}>{guide.question}</h1>
      
      <div style={{ lineHeight: '1.8', fontSize: '1.1rem', whiteSpace: 'pre-wrap', marginBottom: '30px' }}>
        {guide.answer}
      </div>

      {guide.media && (
        <div style={{ borderTop: '1px solid #334155', paddingTop: '30px' }}>
          <h3>Reference Material:</h3>
          {guide.type === 'video' ? (
            <video src={guide.media} controls style={{ width: '100%', borderRadius: '12px' }} />
          ) : guide.type === 'pdf' ? (
            <iframe src={guide.media} width="100%" height="800px" title="manual" />
          ) : (
            <img src={guide.media} alt="reference" style={{ width: '100%', borderRadius: '12px' }} />
          )}
        </div>
      )}
    </div>
  );
}