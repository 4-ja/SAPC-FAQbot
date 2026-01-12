import { useState } from 'react';
import { faqData } from '../data/faqData';
import '../App.css';

export default function Wiki() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFaqs = faqData.filter((faq) =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <header className="hero-section">
        <span className="category-tag" style={{ marginBottom: '1rem' }}>Support Center</span>
        <h1>Knowledge Base</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
          Find solutions to common technical issues instantly.
        </p>
      </header>

      <div className="search-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder="What can we help you with?"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="faq-grid">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => (
            <div key={faq.id} className="faq-card">
              <span className="category-tag">{faq.category}</span>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '4rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>No issues found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}