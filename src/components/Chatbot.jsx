import { useState } from 'react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="chatbot-container">
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <span>SAPC IT Assistant</span>
            <button onClick={() => setIsOpen(false)} style={{background: 'none', border: 'none', cursor: 'pointer'}}>✕</button>
          </div>
          <div className="chat-messages">
            <p style={{background: 'var(--border)', padding: '8px', borderRadius: '8px', width: 'fit-content'}}>
              Hello! How can I help you today?
            </p>
          </div>
          <div className="chat-input-area">
            <input type="text" placeholder="Type a message..." />
            <button className="category-tag" style={{border: 'none', cursor: 'pointer'}}>Send</button>
          </div>
        </div>
      )}
      
      <button className="chatbot-button" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '💬' : '🤖'}
      </button>
    </div>
  );
}