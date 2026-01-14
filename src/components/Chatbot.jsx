import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, ExternalLink, ThumbsUp, ThumbsDown, Sparkles } from 'lucide-react';
import { collection, getDocs, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useNavigate } from 'react-router-dom';

export default function Chatbot() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! Describe your IT issue and I'll find the right guide for you.", sender: 'bot' }
  ]);
  
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

  const handleResolution = async (resolved) => {
    if (resolved) {
      try {
        const statsRef = doc(db, "stats", "global_metrics");
        await updateDoc(statsRef, { totalResolved: increment(1) });
        setMessages(prev => [...prev, { 
          text: "Great! I've marked this as resolved. Happy to help!", 
          sender: 'bot' 
        }]);
      } catch (err) { console.error("Firebase Update Error:", err); }
    } else {
      setMessages(prev => [...prev, { 
        text: "I'm sorry about that. Try different keywords or contact the Head Office IT Helpdesk.", 
        sender: 'bot' 
      }]);
    }
    setShowFeedback(false);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { text: input, sender: 'user' }]);
    setInput("");
    setIsTyping(true);

    try {
      const querySnapshot = await getDocs(collection(db, "wiki"));
      const queryWords = input.toLowerCase().split(/\W+/).filter(w => w.length > 2);
      let results = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const content = `${data.question} ${data.answer}`.toLowerCase();
        let score = 0;
        queryWords.forEach(word => { if (content.includes(word)) score++; });
        if (score > 0) results.push({ id: doc.id, ...data });
      });

      setTimeout(() => {
        if (results.length > 0) {
          setMessages(prev => [...prev, { 
            text: "I found some matching guides. Did these help?", 
            sender: 'bot',
            links: results.slice(0, 3).map(r => ({ id: r.id, title: r.question }))
          }]);
          setShowFeedback(true);
        } else {
          setMessages(prev => [...prev, { text: "I couldn't find a specific guide for that. Try searching for 'Printer', 'POS', or 'Login'.", sender: 'bot' }]);
        }
        setIsTyping(false);
      }, 800);
    } catch (err) { setIsTyping(false); }
  };

  return (
    <div style={chatStyles.wrapper}>
      <button style={chatStyles.toggle} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {isOpen && (
        <div style={chatStyles.container}>
          <div style={chatStyles.header}>
            <div style={chatStyles.headerTitle}>
              <Sparkles size={14} color="#28a745" />
              <span>ESSI Support</span>
            </div>
            <X size={18} style={{cursor:'pointer', color: '#94a3b8'}} onClick={() => setIsOpen(false)} />
          </div>

          <div style={chatStyles.messageArea}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                ...chatStyles.bubble,
                alignSelf: msg.sender === 'bot' ? 'flex-start' : 'flex-end',
                backgroundColor: msg.sender === 'bot' ? '#f1f5f9' : '#28a745',
                color: msg.sender === 'bot' ? '#1e293b' : '#fff',
                borderRadius: msg.sender === 'bot' ? '18px 18px 18px 4px' : '18px 18px 4px 18px'
              }}>
                {msg.text}
                {msg.links && (
                  <div style={chatStyles.linksContainer}>
                    {msg.links.map(l => (
                      <button key={l.id} onClick={() => navigate(`/wiki/${l.id}`)} style={chatStyles.linkBtn}>
                        <ExternalLink size={12} /> {l.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {showFeedback && (
              <div style={chatStyles.feedbackRow}>
                <span style={{fontSize: '0.75rem', color: '#94a3b8', marginBottom: '8px', display: 'block'}}>Did this resolve the issue?</span>
                <div style={{display: 'flex', gap: '8px'}}>
                  <button onClick={() => handleResolution(true)} style={chatStyles.feedbackBtn}><ThumbsUp size={12}/> Yes</button>
                  <button onClick={() => handleResolution(false)} style={chatStyles.feedbackBtn}><ThumbsDown size={12}/> No</button>
                </div>
              </div>
            )}
            {isTyping && <div style={{fontSize: '0.7rem', color: '#94a3b8', paddingLeft: '10px'}}>Typing...</div>}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} style={chatStyles.inputArea}>
            <input 
              style={chatStyles.input} 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Ask a question..." 
            />
            <button type="submit" style={chatStyles.sendBtn}><Send size={18} /></button>
          </form>
        </div>
      )}
    </div>
  );
}

const chatStyles = {
  wrapper: { position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999, fontFamily: "'Inter', sans-serif" },
  toggle: { 
    width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#28a745', 
    color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 8px 24px rgba(40, 167, 69, 0.3)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s'
  },
  container: { 
    position: 'absolute', bottom: '80px', right: '0', width: '350px', height: '500px', 
    backgroundColor: '#fff', borderRadius: '24px', boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
    display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid #e2e8f0'
  },
  header: { 
    padding: '15px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', 
    justifyContent: 'space-between', alignItems: 'center' 
  },
  headerTitle: { fontSize: '0.85rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  messageArea: { flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px', backgroundColor: '#fff' },
  bubble: { maxWidth: '80%', padding: '12px 16px', fontSize: '0.9rem', lineHeight: '1.4', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' },
  linksContainer: { marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '5px' },
  linkBtn: { 
    backgroundColor: '#fff', border: '1px solid #e2e8f0', padding: '8px 12px', borderRadius: '10px',
    fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', textAlign: 'left',
    color: '#28a745', fontWeight: '600'
  },
  feedbackRow: { padding: '10px', alignSelf: 'flex-start' },
  feedbackBtn: { 
    border: '1px solid #e2e8f0', background: '#fff', padding: '6px 12px', borderRadius: '8px', 
    fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', color: '#64748b' 
  },
  inputArea: { padding: '15px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '10px' },
  input: { flex: 1, border: '1px solid #e2e8f0', borderRadius: '12px', padding: '10px 15px', outline: 'none', fontSize: '0.9rem' },
  sendBtn: { background: 'none', border: 'none', color: '#28a745', cursor: 'pointer', display: 'flex', alignItems: 'center' }
};