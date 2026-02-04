import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- STEP 1: INSERT YOUR DATA ---
const SUPABASE_URL = 'https://tvxpjkrwwlbnkblcqyqo.supabase.co'; 
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2eHBqa3J3d2xibmtibGNxeXFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMDQ4NDAsImV4cCI6MjA4NTc4MDg0MH0.bSGUbOUnpRImgkoGsACvFG_bxtWtMsmhQ7TqBGSBl9U';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [xp, setXp] = useState(0);
  const [tab, setTab] = useState('chat');

  // --- STEP 2: AUTOMATIC SYNC ---
  useEffect(() => {
    // Load existing messages
    const fetchInitialData = async () => {
      const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: true });
      if (data) setMessages(data);
    };
    fetchInitialData();

    // Listen for NEW messages in real-time
    const channel = supabase
      .channel('chat-room')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
        setXp((prev) => prev + 10); // Every message adds 10 XP!
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  // --- STEP 3: SENDING DATA ---
  async function sendMessage() {
    if (input.trim() === '') return;
    
    // This sends the message to the cloud
    const { error } = await supabase.from('messages').insert([{ content: input }]);
    
    if (error) {
      console.error("Error sending:", error.message);
      alert("Make sure you created the 'messages' table in Supabase!");
    }
    
    setInput('');
  }

  // --- STEP 4: THE LOOK (UI) ---
  return (
    <div style={styles.appContainer}>
      {/* Top Header & Relationship Stats */}
      <div style={styles.header}>
        <h1 style={{fontSize: '20px', margin: 0}}>Together App</h1>
        <div style={styles.xpSection}>
          <span>Level {Math.floor(xp / 100) + 1}</span>
          <div style={styles.barContainer}>
            <div style={{...styles.barFill, width: `${xp % 100}%`}}></div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div style={styles.tabs}>
        <button style={tab === 'chat' ? styles.tabActive : styles.tab} onClick={() => setTab('chat')}>Chat</button>
        <button style={tab === 'gallery' ? styles.tabActive : styles.tab} onClick={() => setTab('gallery')}>Gallery</button>
        <button style={tab === 'plans' ? styles.tabActive : styles.tab} onClick={() => setTab('plans')}>Plans</button>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {tab === 'chat' ? (
          <div style={styles.chatArea}>
            <div style={styles.msgList}>
              {messages.map((m) => (
                <div key={m.id} style={styles.bubble}>
                  {m.content}
                </div>
              ))}
            </div>
            <div style={styles.inputRow}>
              <input 
                style={styles.input} 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                placeholder="Message..." 
              />
              <button style={styles.sendBtn} onClick={sendMessage}>Send</button>
            </div>
          </div>
        ) : (
          <div style={{textAlign: 'center', marginTop: '50px', color: '#888'}}>
            <h3>{tab.toUpperCase()}</h3>
            <p>We will build this part next!</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Simple Styles
const styles = {
  appContainer: { maxWidth: '400px', margin: '0 auto', height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Arial, sans-serif', border: '1px solid #eee' },
  header: { padding: '20px', background: '#fff', textAlign: 'center', borderBottom: '1px solid #eee' },
  xpSection: { marginTop: '10px' },
  barContainer: { background: '#eee', height: '8px', borderRadius: '4px', marginTop: '5px' },
  barFill: { background: '#ff4b5c', height: '100%', borderRadius: '4px', transition: 'width 0.4s' },
  tabs: { display: 'flex', background: '#f9f9f9' },
  tab: { flex: 1, padding: '15px', border: 'none', background: 'none', cursor: 'pointer' },
  tabActive: { flex: 1, padding: '15px', border: 'none', background: '#fff', borderBottom: '3px solid #ff4b5c', fontWeight: 'bold' },
  content: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  chatArea: { flex: 1, display: 'flex', flexDirection: 'column', padding: '10px' },
  msgList: { flex: 1, overflowY: 'auto', marginBottom: '10px' },
  bubble: { background: '#f1f1f1', padding: '10px', borderRadius: '15px', marginBottom: '8px', alignSelf: 'flex-start', maxWidth: '80%' },
  inputRow: { display: 'flex', gap: '8px' },
  input: { flex: 1, padding: '10px', borderRadius: '20px', border: '1px solid #ddd' },
  sendBtn: { padding: '10px 20px', background: '#ff4b5c', color: 'white', border: 'none', borderRadius: '20px', fontWeight: 'bold' }
};