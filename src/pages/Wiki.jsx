import { useState } from 'react';
// 1. Import the data from your new file
import { faqData } from '../data/faqData'; 

export default function Wiki() {
  const [searchTerm, setSearchTerm] = useState("");

  // 2. The logic remains the same, it just uses the imported 'faqData'
  const filteredFaqs = faqData.filter((faq) =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '40px', color: 'white', maxWidth: '800px', margin: '0 auto' }}>
      <h1>IT Knowledge Base</h1>
      {/* ... the rest of your JSX code remains the same ... */}
      <input 
        type="text" 
        placeholder="Search..." 
        onChange={(e) => setSearchTerm(e.target.value)} 
        style={styles.input}
      />
      
      {filteredFaqs.map((faq) => (
        <div key={faq.id} style={styles.card}>
           <h3>{faq.question}</h3>
           <p>{faq.answer}</p>
        </div>
      ))}
    </div>
  );
}

const styles = {
    input: { width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px' },
    card: { background: '#1a1a1a', padding: '20px', marginBottom: '15px', borderRadius: '10px' }
};