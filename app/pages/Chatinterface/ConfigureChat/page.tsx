'use client';

import { Box, Typography, TextField, IconButton, InputAdornment, Modal, Menu, MenuItem } from '@mui/material';
import { useRouter, usePathname } from 'next/navigation';
import React, { useState, useRef, useEffect } from 'react';

const AGENT_COLOR = '#8b5cf6';
const BG     = '#0a0a0a';
const BORDER = '#1a1a1a';
const CARD   = '#0f0f0f';
const CARD2  = '#111';

// ── Icons ──────────────────────────────────────────────────────────────
function BackIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>; }
function AgentIconSm() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>; }
function AgentIconLg() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>; }
function SendIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>; }
function ChatIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>; }
function NewChatIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>; }
function ThreadIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>; }
function ThreadIconOpen() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>; }
function DotsVertIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>; }
function DotsHorizIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>; }
function LogoutIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>; }
function SettingsIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>; }
function PinIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="17" x2="12" y2="22"/><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"/></svg>; }
function UnpinIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="2" y1="2" x2="22" y2="22"/><line x1="12" y1="17" x2="12" y2="22"/><path d="M9.58 9.58A2 2 0 0 0 9 10.76V6H8a2 2 0 0 1 0-4h8"/><path d="M14 10.76c0 .35-.06.69-.17 1L5 17h9"/></svg>; }
function RenameIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>; }
function ArchiveIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>; }
function DeleteIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>; }
function CloseIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>; }
function ChevronDownIcon() { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>; }
function ChevronRightIcon() { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>; }
function ChevronUserIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>; }
function RestoreIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>; }
function MoveIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20"/></svg>; }
function DragIcon() { return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg>; }
function AgentNavIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

// ── Types ──────────────────────────────────────────────────────────────
interface Message { role: 'user' | 'assistant'; content: string; ts: string; }
interface Thread  { id: string; name: string; expanded: boolean; }
interface ChatSession { id: string; title: string; ts: string; messages: Message[]; pinned?: boolean; archived?: boolean; threadId?: string; }

const AGENTS = [
  { id: 1, name: 'Monitor',      color: '#ef4444' },
  { id: 2, name: 'Ticket',       color: '#3b82f6' },
  { id: 3, name: 'Troubleshoot', color: '#10b981' },
  { id: 4, name: 'Inform',       color: '#f59e0b' },
  { id: 5, name: 'Configure',    color: '#8b5cf6' },
  { id: 6, name: 'Packet',       color: '#ec4899' },
];

const AGENT_ROUTES: Record<number, string> = {
  1: '/pages/Chatinterface/MonitorChat',
  2: '/pages/Chatinterface/TicketChat',
  3: '/pages/Chatinterface/Troubleshootchat',
  4: '/pages/Chatinterface/InformChat',
  5: '/pages/Chatinterface/ConfigureChat',
  6: '/pages/Chatinterface/PacketChat',
};

const agentDropdownSx = {
  background: '#0f0f0f',
  border: `1px solid #2a2a2a`,
  borderRadius: '10px',
  mt: 1,
  minWidth: 170,
  boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
  '& .MuiMenuItem-root': {
    color: '#bbb',
    fontSize: '0.8rem',
    py: 1,
    px: 1.8,
    gap: 1.2,
    transition: 'background 0.15s',
    '&:hover': { background: '#1a1a1a', color: '#fff' },
    '&.Mui-selected': { background: '#1e1e1e' },
  },
};

const AGENT_NAME       = 'Configure Agent';
const AGENT_SHORT      = 'Configure';
const AGENT_SUBTITLE   = 'Network configuration & AP deployment';
const AGENT_SYSTEM     = `You are an expert network configuration AI agent called "Configure Agent" for Commedia AI Operations. You help engineers push AP configurations, manage network templates, validate config changes, rollback deployments, and track config status. Be precise and technical. Use bullet points and **bold** for key terms.`;
const CAPABILITIES     = ["AP configuration push", "Template management", "Config validation & rollback", "Deployment tracking"];
const PROMPTS          = ["Push AP config to site", "Validate config template", "Check deployment status", "Rollback configuration", "Compare config versions", "Schedule config update"];
const PLACEHOLDER      = 'Describe your configuration task...';
const INITIAL_CONTENT  = `Hi! I'm your **Configure Agent**. Network configuration & AP deployment.\n\nHow can I help you today?`;

function getNow() { return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }
function makeSession(ts = ''): ChatSession {
  return { id: Date.now().toString(), title: 'New Session', ts, messages: [{ role: 'assistant', content: INITIAL_CONTENT, ts }] };
}
function useClientTs() { const [ts, setTs] = useState(''); useEffect(() => { setTs(getNow()); }, []); return ts; }

function renderContent(text: string) {
  return text.split('\n').map((line, i, arr) => (
    <span key={i}>
      {line.split(/(\*\*[^*]+\*\*)/g).map((p, j) =>
        p.startsWith('**') && p.endsWith('**')
          ? <strong key={j} style={{ color: '#fff', fontWeight: 700 }}>{p.slice(2,-2)}</strong>
          : p
      )}
      {i < arr.length - 1 && <br />}
    </span>
  ));
}

function TypingDots() {
  return (
    <Box sx={{ display:'flex', alignItems:'center', gap:0.5, py:0.5 }}>
      {[0,1,2].map(i => <Box key={i} sx={{ width:6, height:6, borderRadius:'50%', bgcolor:AGENT_COLOR, animation:'pulse 1.2s ease-in-out infinite', animationDelay:`${i*0.2}s`, '@keyframes pulse':{'0%,100%':{opacity:0.3,transform:'scale(0.8)'},'50%':{opacity:1,transform:'scale(1)'}} }} />)}
    </Box>
  );
}

function Bubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user';
  return (
    <Box sx={{ display:'flex', flexDirection:isUser?'row-reverse':'row', alignItems:'flex-end', gap:1.2, mb:2 }}>
      {!isUser && <Box sx={{ width:30, height:30, borderRadius:'9px', bgcolor:`${AGENT_COLOR}20`, border:`1px solid ${AGENT_COLOR}40`, display:'flex', alignItems:'center', justifyContent:'center', color:AGENT_COLOR, flexShrink:0, mb:0.2 }}><AgentIconSm /></Box>}
      {/* ── CHANGED: user bubble avatar now uses purple agent theme ── */}
      {isUser && <Box sx={{ width:30, height:30, borderRadius:'9px', background:`linear-gradient(135deg, ${AGENT_COLOR} 0%, #7c3aed 100%)`, border:`1px solid ${AGENT_COLOR}60`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, mb:0.2 }}><Typography sx={{ fontSize:'0.7rem', fontWeight:800, color:'#fff' }}>U</Typography></Box>}
      <Box sx={{ maxWidth:'70%' }}>
        <Box sx={{ px:2, py:1.5, borderRadius:isUser?'14px 14px 4px 14px':'14px 14px 14px 4px', background:isUser?`linear-gradient(135deg, ${AGENT_COLOR}22, ${AGENT_COLOR}12)`:CARD2, border:`1px solid ${isUser?AGENT_COLOR+'35':BORDER}`, fontSize:'0.83rem', color:'#ccc', lineHeight:1.65 }}>
          {renderContent(msg.content)}
        </Box>
        {msg.ts && <Typography sx={{ fontSize:'0.62rem', color:'#444', mt:0.4, textAlign:isUser?'right':'left' }}>{msg.ts}</Typography>}
      </Box>
    </Box>
  );
}

interface PopupItem { label: string; icon: React.ReactNode; action: () => void; color?: string; }
function PopupMenu({ x, y, items, onClose }: { x: number; y: number; items: PopupItem[]; onClose: () => void }) {
  useEffect(() => {
    const h = (e: MouseEvent) => { e.stopPropagation(); onClose(); };
    setTimeout(() => window.addEventListener('click', h), 0);
    return () => window.removeEventListener('click', h);
  }, [onClose]);
  return (
    <Box onClick={e => e.stopPropagation()} sx={{ position:'fixed', top:y, left:x, zIndex:9999, background:'#161616', border:`1px solid #2a2a2a`, borderRadius:'10px', py:0.5, minWidth:170, boxShadow:'0 8px 32px rgba(0,0,0,0.7)' }}>
      {items.map(item => (
        <Box key={item.label} onClick={() => { item.action(); onClose(); }} sx={{ display:'flex', alignItems:'center', gap:1.2, px:1.8, py:1, cursor:'pointer', transition:'background 0.12s', '&:hover':{ background:'#1e1e1e' } }}>
          <Box sx={{ color:item.color||'#ccc', display:'flex' }}>{item.icon}</Box>
          <Typography sx={{ fontSize:'0.78rem', color:item.color||'#ccc' }}>{item.label}</Typography>
        </Box>
      ))}
    </Box>
  );
}

function MoveToThreadPicker({ x, y, threads, onMove, onClose }: { x:number; y:number; threads:Thread[]; onMove:(threadId:string)=>void; onClose:()=>void }) {
  useEffect(() => { const h = () => onClose(); setTimeout(() => window.addEventListener('click', h), 0); return () => window.removeEventListener('click', h); }, [onClose]);
  return (
    <Box onClick={e => e.stopPropagation()} sx={{ position:'fixed', top:y, left:x, zIndex:10000, background:'#161616', border:`1px solid #2a2a2a`, borderRadius:'10px', py:0.5, minWidth:180, boxShadow:'0 8px 32px rgba(0,0,0,0.7)' }}>
      <Typography sx={{ fontSize:'0.65rem', fontWeight:700, color:'#444', letterSpacing:'0.1em', textTransform:'uppercase', px:1.8, py:0.8 }}>Move to Thread</Typography>
      {threads.length === 0
        ? <Typography sx={{ fontSize:'0.75rem', color:'#444', px:1.8, py:1 }}>No threads yet</Typography>
        : threads.map(t => (
          <Box key={t.id} onClick={() => { onMove(t.id); onClose(); }} sx={{ display:'flex', alignItems:'center', gap:1.2, px:1.8, py:1, cursor:'pointer', '&:hover':{ background:'#1e1e1e' } }}>
            <Box sx={{ color:'#8b5cf6', display:'flex' }}><ThreadIcon /></Box>
            <Typography sx={{ fontSize:'0.78rem', color:'#ccc' }}>{t.name}</Typography>
          </Box>
        ))
      }
    </Box>
  );
}

function CreateThreadModal({ open, onClose, onCreate }: { open:boolean; onClose:()=>void; onCreate:(name:string)=>void }) {
  const [name, setName] = useState('');
  const submit = () => { if (name.trim()) { onCreate(name.trim()); setName(''); onClose(); } };
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:420, bgcolor:'#141414', border:`1px solid #2a2a2a`, borderRadius:'16px', p:3, outline:'none', boxShadow:'0 24px 64px rgba(0,0,0,0.8)' }}>
        <Box sx={{ display:'flex', alignItems:'center', justifyContent:'space-between', mb:2.5 }}>
          <Typography sx={{ fontSize:'1rem', fontWeight:700, color:'#fff' }}>Create Thread</Typography>
          <Box onClick={onClose} sx={{ color:'#555', cursor:'pointer', display:'flex', p:0.4, borderRadius:'6px', '&:hover':{ color:'#ccc', bgcolor:'#1e1e1e' } }}><CloseIcon /></Box>
        </Box>
        <TextField fullWidth autoFocus placeholder="e.g. Site B Outage, Core Switch Issues..." value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key==='Enter'&&submit()}
          sx={{ mb:2, '& .MuiOutlinedInput-root':{ bgcolor:'#0f0f0f', borderRadius:'10px', fontSize:'0.85rem', '& input':{ color:'#fff', '&::placeholder':{ color:'#555', opacity:1 } }, '& fieldset':{ border:`1px solid #2a2a2a` }, '&:hover fieldset':{ border:`1px solid #333` }, '&.Mui-focused fieldset':{ border:`1px solid ${AGENT_COLOR}55` } } }}
        />
        <Box sx={{ display:'flex', gap:1.2, p:1.5, bgcolor:'#0f0f0f', borderRadius:'10px', border:`1px solid #1a1a1a`, mb:2.5 }}>
          <Box sx={{ color:AGENT_COLOR, mt:0.1, flexShrink:0 }}><ThreadIcon /></Box>
          <Typography sx={{ fontSize:'0.75rem', color:'#555', lineHeight:1.55 }}>Threads keep related chats together. Drag chats into a thread or use "Move to Thread".</Typography>
        </Box>
        <Box sx={{ display:'flex', gap:1.2, justifyContent:'flex-end' }}>
          <Box onClick={onClose} sx={{ px:2, py:0.9, borderRadius:'8px', border:`1px solid #2a2a2a`, cursor:'pointer', '&:hover':{ bgcolor:'#1a1a1a' } }}>
            <Typography sx={{ fontSize:'0.8rem', color:'#666' }}>Cancel</Typography>
          </Box>
          <Box onClick={submit} sx={{ px:2.5, py:0.9, borderRadius:'8px', bgcolor:name.trim()?AGENT_COLOR:'#1a1a1a', cursor:name.trim()?'pointer':'default', transition:'all 0.15s', '&:hover':{ filter:name.trim()?'brightness(1.1)':'none' } }}>
            <Typography sx={{ fontSize:'0.8rem', fontWeight:700, color:name.trim()?'#fff':'#444' }}>Create Thread</Typography>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

function ArchiveModal({ open, sessions, onRestore, onDelete, onClose }: { open:boolean; sessions:ChatSession[]; onRestore:(id:string)=>void; onDelete:(id:string)=>void; onClose:()=>void }) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:480, bgcolor:'#141414', border:`1px solid #2a2a2a`, borderRadius:'16px', p:3, outline:'none', boxShadow:'0 24px 64px rgba(0,0,0,0.8)', maxHeight:'70vh', display:'flex', flexDirection:'column' }}>
        <Box sx={{ display:'flex', alignItems:'center', justifyContent:'space-between', mb:2.5 }}>
          <Box sx={{ display:'flex', alignItems:'center', gap:1.2 }}>
            <Box sx={{ color:'#666', display:'flex' }}><ArchiveIcon /></Box>
            <Typography sx={{ fontSize:'1rem', fontWeight:700, color:'#fff' }}>Archived Chats</Typography>
            <Box sx={{ px:0.9, py:0.2, borderRadius:'6px', bgcolor:'#1a1a1a' }}><Typography sx={{ fontSize:'0.68rem', color:'#555', fontWeight:600 }}>{sessions.length}</Typography></Box>
          </Box>
          <Box onClick={onClose} sx={{ color:'#555', cursor:'pointer', display:'flex', p:0.4, borderRadius:'6px', '&:hover':{ color:'#ccc', bgcolor:'#1e1e1e' } }}><CloseIcon /></Box>
        </Box>
        <Box sx={{ flex:1, overflowY:'auto', '&::-webkit-scrollbar':{ display:'none' } }}>
          {sessions.length === 0
            ? <Box sx={{ textAlign:'center', py:4 }}><Typography sx={{ fontSize:'0.8rem', color:'#444' }}>No archived chats yet</Typography></Box>
            : sessions.map(s => (
              <Box key={s.id} sx={{ display:'flex', alignItems:'center', gap:1.5, px:1.5, py:1.2, borderRadius:'10px', bgcolor:'#0f0f0f', border:`1px solid ${BORDER}`, mb:1, '&:hover':{ bgcolor:'#111' }, transition:'background 0.15s' }}>
                <Box sx={{ color:'#444', display:'flex', flexShrink:0 }}><ChatIcon /></Box>
                <Box sx={{ flex:1, minWidth:0 }}>
                  <Typography sx={{ fontSize:'0.8rem', color:'#888', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{s.title}</Typography>
                  <Typography sx={{ fontSize:'0.62rem', color:'#444' }}>{s.ts}</Typography>
                </Box>
                <Box sx={{ display:'flex', gap:0.5 }}>
                  <Box onClick={() => onRestore(s.id)} sx={{ display:'flex', alignItems:'center', justifyContent:'center', width:28, height:28, borderRadius:'7px', color:AGENT_COLOR, cursor:'pointer', border:`1px solid transparent`, '&:hover':{ bgcolor:`${AGENT_COLOR}15`, border:`1px solid ${AGENT_COLOR}30` } }}><RestoreIcon /></Box>
                  <Box onClick={() => onDelete(s.id)} sx={{ display:'flex', alignItems:'center', justifyContent:'center', width:28, height:28, borderRadius:'7px', color:'#ef4444', cursor:'pointer', border:`1px solid transparent`, '&:hover':{ bgcolor:'#2e0d0d', border:'1px solid #3d0c0c' } }}><DeleteIcon /></Box>
                </Box>
              </Box>
            ))
          }
        </Box>
      </Box>
    </Modal>
  );
}

function ChatNavbar({ title, archivedCount, onOpenArchive }: { title: string; archivedCount: number; onOpenArchive: () => void }) {
  const [userOpen, setUserOpen] = useState(false);
  const [agentAnchor, setAgentAnchor] = useState<null | HTMLElement>(null);
  const router = useRouter();
  const pathname = usePathname() || '';

  const derivedAgentId =
    Number(Object.entries(AGENT_ROUTES).find(([, path]) => pathname.startsWith(path))?.[0]) || 5;

  const selectedAgent = AGENTS.find(a => a.id === derivedAgentId) ?? AGENTS[4];
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setUserOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [userOpen]);

  return (
    <Box sx={{ px: 3, borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 64, flexShrink: 0 }}>
      {/* Left */}
      <Box>
        <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>{title}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mt: 0.2 }}>
          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: AGENT_COLOR, boxShadow: `0 0 6px ${AGENT_COLOR}` }} />
          <Typography sx={{ fontSize: '0.68rem', color: '#555' }}>{AGENT_NAME} · Ready</Typography>
        </Box>
      </Box>

      {/* Right */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>

        {/* Select Agent */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
          <Typography sx={{ fontSize: '0.7rem', color: '#555', fontWeight: 500, whiteSpace: 'nowrap' }}>
            Select Agent
          </Typography>
          <Box
            onClick={(e) => setAgentAnchor(e.currentTarget)}
            sx={{
              display: 'flex', alignItems: 'center', gap: 1,
              px: 1.4, py: 0.65, borderRadius: '9px',
              border: `1px solid ${BORDER}`, cursor: 'pointer', transition: 'all 0.15s',
              '&:hover': { border: `1px solid ${selectedAgent.color}44`, bgcolor: `${selectedAgent.color}08` },
            }}
          >
            <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: selectedAgent.color, flexShrink: 0, boxShadow: `0 0 5px ${selectedAgent.color}88` }} />
            <AgentNavIcon />
            <Typography sx={{ fontSize: '0.78rem', color: '#bbb', fontWeight: 500, whiteSpace: 'nowrap' }}>
              {selectedAgent.name}
            </Typography>
            <Box sx={{ color: '#555', display: 'flex' }}><ChevronDownIcon /></Box>
          </Box>
        </Box>

        <Menu
          anchorEl={agentAnchor}
          open={Boolean(agentAnchor)}
          onClose={() => setAgentAnchor(null)}
          PaperProps={{ sx: agentDropdownSx }}
        >
          {AGENTS.map((a) => (
            <MenuItem
              key={a.id}
              selected={a.id === selectedAgent.id}
              onClick={() => { setAgentAnchor(null); if (a.id !== selectedAgent.id) router.push(AGENT_ROUTES[a.id]); }}
            >
              <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: a.color, flexShrink: 0, boxShadow: `0 0 5px ${a.color}88` }} />
              {a.name}
            </MenuItem>
          ))}
        </Menu>

        {/* Archive */}
        <Box
          onClick={onOpenArchive}
          sx={{
            position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 36, height: 36, borderRadius: '9px', border: `1px solid ${BORDER}`,
            color: '#666', cursor: 'pointer', transition: 'all 0.15s',
            '&:hover': { border: `1px solid ${AGENT_COLOR}44`, color: AGENT_COLOR, bgcolor: `${AGENT_COLOR}08` },
          }}
        >
          <ArchiveIcon />
          {archivedCount > 0 && (
            <Box sx={{ position: 'absolute', top: -4, right: -4, width: 16, height: 16, borderRadius: '50%', bgcolor: AGENT_COLOR, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography sx={{ fontSize: '0.55rem', fontWeight: 800, color: '#fff' }}>{archivedCount}</Typography>
            </Box>
          )}
        </Box>

        {/* ── CHANGED: User dropdown avatar now uses purple agent theme ── */}
        <Box ref={dropdownRef} sx={{ position: 'relative' }}>
          <Box
            onClick={() => setUserOpen(p => !p)}
            sx={{
              display: 'flex', alignItems: 'center', gap: 1,
              px: 1.2, py: 0.6, borderRadius: '9px',
              border: `1px solid ${userOpen ? '#2a2a2a' : BORDER}`,
              bgcolor: userOpen ? '#111' : 'transparent',
              cursor: 'pointer', transition: 'all 0.15s',
              '&:hover': { border: `1px solid #2a2a2a`, bgcolor: '#111' },
            }}
          >
            <Box sx={{ width: 26, height: 26, borderRadius: '50%', background: `linear-gradient(135deg, ${AGENT_COLOR} 0%, #7c3aed 100%)`, border: `1px solid ${AGENT_COLOR}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Typography sx={{ fontSize: '0.65rem', fontWeight: 800, color: '#fff' }}>U</Typography>
            </Box>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#ddd', lineHeight: 1.2 }}>User Name</Typography>
              <Typography sx={{ fontSize: '0.62rem', color: '#555' }}>Admin</Typography>
            </Box>
            <Box sx={{ color: '#444', display: 'flex' }}><ChevronUserIcon /></Box>
          </Box>

          {userOpen && (
            <Box sx={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, bgcolor: '#161616', border: `1px solid #2a2a2a`, borderRadius: '10px', py: 0.5, minWidth: 160, boxShadow: '0 8px 32px rgba(0,0,0,0.7)', zIndex: 200 }}>
              <Box sx={{ px: 1.8, py: 0.8, mb: 0.5 }}>
                <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, color: '#fff' }}>User Name</Typography>
                <Typography sx={{ fontSize: '0.65rem', color: '#555' }}>user@commedia.ai</Typography>
              </Box>
              <Box sx={{ height: '1px', bgcolor: '#1a1a1a', mx: 1, mb: 0.5 }} />
              <Box sx={{ px: 1.8, py: 1, display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', '&:hover': { bgcolor: '#1e1e1e' } }} onClick={() => setUserOpen(false)}>
                <SettingsIcon /><Typography sx={{ fontSize: '0.78rem', color: '#ccc' }}>Settings</Typography>
              </Box>
              <Box sx={{ height: '1px', bgcolor: '#1a1a1a', mx: 1, my: 0.3 }} />
              <Box sx={{ px: 1.8, py: 1, display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', '&:hover': { bgcolor: '#1e0808' } }} onClick={() => router.push('/')}>
                <LogoutIcon /><Typography sx={{ fontSize: '0.78rem', color: '#ef4444' }}>Log out</Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

function ThreadRow({ thread, sessions, activeId, setActiveId, onToggle, onRename, onDelete, onDropOnThread, handleSessionDots, renamingId, renameVal, setRenameVal, setRenamingId, setSessions, draggingId }: {
  thread: Thread; sessions: ChatSession[]; activeId: string; setActiveId: (id: string) => void;
  onToggle: () => void; onRename: () => void; onDelete: () => void;
  onDropOnThread: (threadId: string, sessionId: string) => void;
  handleSessionDots: (e: React.MouseEvent, sessionId: string) => void;
  renamingId: string | null; renameVal: string; setRenameVal: (v: string) => void;
  setRenamingId: (v: string | null) => void; setSessions: React.Dispatch<React.SetStateAction<ChatSession[]>>;
  draggingId: string | null;
}) {
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
  const [renamingThread, setRenamingThread] = useState(false);
  const [renameThreadVal, setRenameThreadVal] = useState(thread.name);
  const [dragOver, setDragOver] = useState(false);
  const threadSessions = sessions.filter(s => s.threadId === thread.id && !s.archived);
  const menuItems: PopupItem[] = [
    { label: 'Rename', icon: <RenameIcon />, action: () => setRenamingThread(true) },
    { label: 'Delete Thread', icon: <DeleteIcon />, action: onDelete, color: '#ef4444' },
  ];
  return (
    <Box onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={e => { e.preventDefault(); const id = e.dataTransfer.getData('sessionId'); if (id) onDropOnThread(thread.id, id); setDragOver(false); }} sx={{ mb:0.5 }}>
      <Box sx={{ display:'flex', alignItems:'center', gap:0.5, px:1, py:0.8, borderRadius:'8px', bgcolor:dragOver?`${AGENT_COLOR}10`:'transparent', border:`1px solid ${dragOver?AGENT_COLOR+'30':'transparent'}`, transition:'all 0.15s', '&:hover .thread-dots':{ opacity:1 }, '&:hover':{ bgcolor:'#0d0d0d' } }}>
        <Box onClick={onToggle} sx={{ color:'#555', display:'flex', cursor:'pointer', flexShrink:0, '&:hover':{ color:'#888' } }}>{thread.expanded ? <ChevronDownIcon /> : <ChevronRightIcon />}</Box>
        <Box sx={{ color:'#8b5cf6', display:'flex', flexShrink:0, ml:0.3 }}>{thread.expanded ? <ThreadIconOpen /> : <ThreadIcon />}</Box>
        <Box sx={{ flex:1, minWidth:0, ml:0.8, cursor:'pointer' }} onClick={onToggle}>
          {renamingThread
            ? <input autoFocus value={renameThreadVal} onChange={e => setRenameThreadVal(e.target.value)} onBlur={() => { onRename(); setSessions(p => p); setRenamingThread(false); }} onKeyDown={e => { if (e.key==='Enter') { onRename(); setRenamingThread(false); } e.stopPropagation(); }} onClick={e => e.stopPropagation()} style={{ background:'transparent', border:'none', outline:'none', color:'#ccc', fontSize:'0.78rem', width:'100%', fontFamily:'inherit' }} />
            : <Typography sx={{ fontSize:'0.78rem', color:'#888', fontWeight:500, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{thread.name}</Typography>
          }
        </Box>
        {threadSessions.length > 0 && <Box sx={{ px:0.6, py:0.1, borderRadius:'4px', bgcolor:'#1a1a1a', mr:0.5 }}><Typography sx={{ fontSize:'0.6rem', color:'#555' }}>{threadSessions.length}</Typography></Box>}
        <Box className="thread-dots" onClick={e => { e.stopPropagation(); setMenu({ x: e.clientX, y: e.clientY }); }} sx={{ opacity:0, display:'flex', alignItems:'center', justifyContent:'center', width:20, height:20, borderRadius:'5px', color:'#666', cursor:'pointer', flexShrink:0, transition:'opacity 0.15s', '&:hover':{ bgcolor:'#2a2a2a', color:'#ccc' } }}><DotsHorizIcon /></Box>
      </Box>
      {thread.expanded && (
        <Box sx={{ ml:2, borderLeft:`1px solid ${BORDER}`, pl:1, mt:0.3 }}>
          {threadSessions.length === 0
            ? <Box sx={{ px:1, py:1.5, borderRadius:'7px', border:`1px dashed #222`, textAlign:'center' }}><Typography sx={{ fontSize:'0.68rem', color:'#333' }}>Drop chats here</Typography></Box>
            : threadSessions.map(s => <SessionRow key={s.id} s={s} activeId={activeId} setActiveId={setActiveId} handleDots={handleSessionDots} renamingId={renamingId} renameVal={renameVal} setRenameVal={setRenameVal} setRenamingId={setRenamingId} setSessions={setSessions} draggingId={draggingId} />)
          }
        </Box>
      )}
      {menu && <PopupMenu x={menu.x} y={menu.y} items={menuItems} onClose={() => setMenu(null)} />}
    </Box>
  );
}

function SessionRow({ s, activeId, setActiveId, handleDots, renamingId, renameVal, setRenameVal, setRenamingId, setSessions, draggingId }: {
  s: ChatSession; activeId: string; setActiveId: (id: string) => void;
  handleDots: (e: React.MouseEvent, id: string) => void;
  renamingId: string | null; renameVal: string; setRenameVal: (v: string) => void;
  setRenamingId: (v: string | null) => void; setSessions: React.Dispatch<React.SetStateAction<ChatSession[]>>;
  draggingId: string | null;
}) {
  const isActive = s.id === activeId;
  const isDragging = s.id === draggingId;
  return (
    <Box draggable onDragStart={e => { e.dataTransfer.setData('sessionId', s.id); }} onClick={() => setActiveId(s.id)}
      sx={{ display:'flex', alignItems:'center', gap:0.8, px:1.2, py:0.9, borderRadius:'8px', cursor:'grab', mb:0.3, bgcolor:isActive?`${AGENT_COLOR}10`:'transparent', border:`1px solid ${isActive?AGENT_COLOR+'28':'transparent'}`, opacity:isDragging?0.4:1, transition:'all 0.15s', '&:hover':{ bgcolor:isActive?`${AGENT_COLOR}10`:'#111' }, '&:hover .dots-btn':{ opacity:1 }, '&:hover .drag-handle':{ opacity:1 } }}>
      <Box className="drag-handle" sx={{ opacity:0, color:'#444', display:'flex', flexShrink:0, cursor:'grab', transition:'opacity 0.15s' }}><DragIcon /></Box>
      <Box sx={{ color:isActive?AGENT_COLOR:'#555', flexShrink:0 }}><ChatIcon /></Box>
      <Box sx={{ flex:1, minWidth:0 }}>
        {renamingId === s.id
          ? <input autoFocus value={renameVal} onChange={e => setRenameVal(e.target.value)} onBlur={() => { setSessions(p => p.map(x => x.id===s.id?{...x,title:renameVal||x.title}:x)); setRenamingId(null); }} onKeyDown={e => { if(e.key==='Enter'){setSessions(p=>p.map(x=>x.id===s.id?{...x,title:renameVal||x.title}:x));setRenamingId(null);} e.stopPropagation(); }} onClick={e => e.stopPropagation()} style={{ background:'transparent', border:'none', outline:'none', color:'#ddd', fontSize:'0.75rem', width:'100%', fontFamily:'inherit' }} />
          : <Typography sx={{ fontSize:'0.75rem', color:isActive?'#ddd':'#777', fontWeight:isActive?600:400, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{s.title}</Typography>
        }
        <Typography sx={{ fontSize:'0.62rem', color:'#444' }}>{s.ts}</Typography>
      </Box>
      <Box className="dots-btn" onClick={e => handleDots(e, s.id)} sx={{ opacity:0, display:'flex', alignItems:'center', justifyContent:'center', width:22, height:22, borderRadius:'5px', color:'#666', flexShrink:0, transition:'opacity 0.15s', '&:hover':{ bgcolor:'#2a2a2a', color:'#ccc' } }}><DotsVertIcon /></Box>
    </Box>
  );
}

export default function AgentChatPage() {
  const router = useRouter();
  const initTs = useClientTs();
  const [sessions, setSessions]         = useState<ChatSession[]>([makeSession()]);
  const [activeId, setActiveId]         = useState('');
  const [threads, setThreads]           = useState<Thread[]>([]);
  const [input, setInput]               = useState('');
  const [loading, setLoading]           = useState(false);
  const [threadModal, setThreadModal]   = useState(false);
  const [archiveModal, setArchiveModal] = useState(false);
  const [renamingId, setRenamingId]     = useState<string | null>(null);
  const [renameVal, setRenameVal]       = useState('');
  const [draggingId, setDraggingId]     = useState<string | null>(null);
  const [sessionMenu, setSessionMenu]   = useState<{ x:number; y:number; sessionId:string } | null>(null);
  const [movePickerMenu, setMovePickerMenu] = useState<{ x:number; y:number; sessionId:string } | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!initTs) return;
    setSessions(p => p.map(s => ({ ...s, ts: s.ts || initTs, messages: s.messages.map(m => ({ ...m, ts: m.ts || initTs })) })));
    setActiveId(p => p || sessions[0]?.id || '');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initTs]);
  useEffect(() => { if (!activeId && sessions[0]) setActiveId(sessions[0].id); }, [sessions, activeId]);
  const active = sessions.find(s => s.id === activeId);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [active?.messages, loading]);

  const activeSessions   = sessions.filter(s => !s.archived && !s.threadId);
  const archivedSessions = sessions.filter(s => s.archived);
  const pinnedSessions   = activeSessions.filter(s => s.pinned);
  const unpinnedSessions = activeSessions.filter(s => !s.pinned);

  function newSession() { const s = makeSession(getNow()); s.messages[0].ts = getNow(); setSessions(p => [s,...p]); setActiveId(s.id); }
  function updateSession(id: string, messages: Message[], title?: string) { setSessions(p => p.map(s => s.id===id?{...s,messages,title:title??s.title}:s)); }
  function handleDelete(id: string) { setSessions(p => { const next = p.filter(s => s.id!==id); if (activeId===id&&next[0]) setActiveId(next[0].id); return next; }); }
  function handleRename(id: string) { const s = sessions.find(s => s.id===id); if(s){setRenamingId(id);setRenameVal(s.title);} }
  function handlePin(id: string)    { setSessions(p => p.map(s => s.id===id?{...s,pinned:!s.pinned}:s)); }
  function handleArchive(id: string) { setSessions(p => { const next = p.map(s => s.id===id?{...s,archived:true,pinned:false}:s); if(activeId===id){const n=next.find(s=>!s.archived&&s.id!==id);if(n)setActiveId(n.id);} return next; }); }
  function handleRestore(id: string) { setSessions(p => p.map(s => s.id===id?{...s,archived:false}:s)); }
  function handleMoveToThread(sessionId: string, threadId: string) { setSessions(p => p.map(s => s.id===sessionId?{...s,threadId,pinned:false}:s)); setThreads(p => p.map(t => t.id===threadId?{...t,expanded:true}:t)); }
  function handleDropOnThread(threadId: string, sessionId: string) { handleMoveToThread(sessionId, threadId); setDraggingId(null); }
  function handleSessionDots(e: React.MouseEvent, sessionId: string) { e.stopPropagation(); setSessionMenu({x:e.clientX,y:e.clientY,sessionId}); }
  function getSessionMenuItems(sessionId: string): PopupItem[] {
    const s = sessions.find(s => s.id===sessionId);
    return [
      { label:'Move to Thread', icon:<MoveIcon />, action:() => setMovePickerMenu({x:sessionMenu?.x??0,y:sessionMenu?.y??0,sessionId}) },
      { label:s?.pinned?'Unpin Chat':'Pin Chat', icon:s?.pinned?<UnpinIcon />:<PinIcon />, action:() => handlePin(sessionId) },
      { label:'Rename',  icon:<RenameIcon />,  action:() => handleRename(sessionId) },
      { label:'Archive', icon:<ArchiveIcon />, action:() => handleArchive(sessionId) },
      { label:'Delete',  icon:<DeleteIcon />,  action:() => handleDelete(sessionId), color:'#ef4444' },
    ];
  }
  function handleThreadRename(threadId: string, name: string) { setThreads(p => p.map(t => t.id===threadId?{...t,name}:t)); }
  function handleThreadDelete(threadId: string) { setSessions(p => p.map(s => s.threadId===threadId?{...s,threadId:undefined}:s)); setThreads(p => p.filter(t => t.id!==threadId)); }

  async function send(text?: string) {
    if (!active) return;
    const content = (text??input).trim(); if (!content||loading) return;
    setInput('');
    const userMsg: Message = { role:'user', content, ts:getNow() };
    const updated = [...active.messages, userMsg];
    const title = active.title==='New Session'?content.slice(0,36)+(content.length>36?'…':''):active.title;
    updateSession(activeId, updated, title);
    setLoading(true);
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ model:'claude-sonnet-4-20250514', max_tokens:1000, system:AGENT_SYSTEM, messages:updated.map(m=>({role:m.role,content:m.content})) }),
      });
      const data = await res.json();
      updateSession(activeId, [...updated, { role:'assistant', content:data.content?.[0]?.text??'Sorry, I could not process that request.', ts:getNow() }]);
    } catch { updateSession(activeId, [...updated, { role:'assistant', content:'Connection error. Please try again.', ts:getNow() }]); }
    finally { setLoading(false); }
  }

  if (!active) return null;

  return (
    <Box sx={{ display:'flex', width:'100vw', height:'100vh', bgcolor:BG, overflow:'hidden' }} onDragStart={e => { const id = (e.target as HTMLElement).closest('[draggable]')?.getAttribute('data-id'); if (id) setDraggingId(id); }} onDragEnd={() => setDraggingId(null)}>

      {/* ── Left Panel ── */}
      <Box sx={{ width:260, flexShrink:0, borderRight:`1px solid ${BORDER}`, display:'flex', flexDirection:'column', height:'100vh' }}>
        <Box sx={{ px:2, py:2, borderBottom:`1px solid ${BORDER}`, display:'flex', alignItems:'center', gap:1.5, minHeight:64 }}>
          <Box onClick={() => router.push('/pages/dashboard')} sx={{ display:'flex', alignItems:'center', justifyContent:'center', width:30, height:30, borderRadius:'8px', border:`1px solid ${BORDER}`, color:'#666', cursor:'pointer', transition:'all 0.15s', flexShrink:0, '&:hover':{ border:`1px solid #333`, color:'#ccc', bgcolor:'#141414' } }}><BackIcon /></Box>
          <Box sx={{ display:'flex', alignItems:'center', gap:1, flex:1, minWidth:0 }}>
            <Box sx={{ width:28, height:28, borderRadius:'8px', bgcolor:`${AGENT_COLOR}20`, border:`1px solid ${AGENT_COLOR}40`, display:'flex', alignItems:'center', justifyContent:'center', color:AGENT_COLOR, flexShrink:0 }}><AgentIconSm /></Box>
            <Box sx={{ minWidth:0 }}><Typography sx={{ fontSize:'0.8rem', fontWeight:700, color:'#fff', lineHeight:1.2 }}>{AGENT_SHORT}</Typography><Typography sx={{ fontSize:'0.62rem', color:'#555' }}>AI Agent</Typography></Box>
          </Box>
        </Box>

        <Box sx={{ px:2, pt:2, pb:1, display:'flex', flexDirection:'column', gap:0.8 }}>
          <Box onClick={newSession} sx={{ display:'flex', alignItems:'center', gap:1, px:1.5, py:1, borderRadius:'9px', border:`1px solid ${BORDER}`, cursor:'pointer', color:'#888', transition:'all 0.15s', '&:hover':{ border:`1px solid ${AGENT_COLOR}44`, color:AGENT_COLOR, bgcolor:`${AGENT_COLOR}08` } }}><NewChatIcon /><Typography sx={{ fontSize:'0.78rem', fontWeight:500 }}>New Chat</Typography></Box>
          <Box onClick={() => setThreadModal(true)} sx={{ display:'flex', alignItems:'center', gap:1, px:1.5, py:1, borderRadius:'9px', border:`1px solid ${BORDER}`, cursor:'pointer', color:'#888', transition:'all 0.15s', '&:hover':{ border:`1px solid #8b5cf688`, color:'#8b5cf6', bgcolor:'#8b5cf608' } }}><ThreadIcon /><Typography sx={{ fontSize:'0.78rem', fontWeight:500 }}>Create Thread</Typography></Box>
        </Box>

        <Box sx={{ flex:1, display:'flex', flexDirection:'column', minHeight:0, overflow:'hidden' }}>
          {threads.length > 0 && (
            <Box sx={{ flexShrink:0, px:1.5, pt:1 }}>
              <Typography sx={{ fontSize:'0.6rem', fontWeight:700, color:'#444', letterSpacing:'0.1em', textTransform:'uppercase', px:0.5, mb:1, mt:0.5 }}>Threads</Typography>
              {threads.map(t => (
                <ThreadRow key={t.id} thread={t} sessions={sessions} activeId={activeId} setActiveId={setActiveId}
                  onToggle={() => setThreads(p => p.map(x => x.id===t.id?{...x,expanded:!x.expanded}:x))}
                  onRename={() => handleThreadRename(t.id, t.name)}
                  onDelete={() => handleThreadDelete(t.id)}
                  onDropOnThread={handleDropOnThread}
                  handleSessionDots={handleSessionDots}
                  renamingId={renamingId} renameVal={renameVal} setRenameVal={setRenameVal} setRenamingId={setRenamingId} setSessions={setSessions}
                  draggingId={draggingId}
                />
              ))}
            </Box>
          )}
          <Box sx={{ flex:1, overflowY:'auto', px:1.5, pb:1, '&::-webkit-scrollbar':{ width:3 }, '&::-webkit-scrollbar-track':{ bgcolor:'transparent' }, '&::-webkit-scrollbar-thumb':{ bgcolor:'#2a2a2a', borderRadius:4, '&:hover':{ bgcolor:'#333' } } }}>
            {pinnedSessions.length > 0 && (<><Typography sx={{ fontSize:'0.6rem', fontWeight:700, color:'#444', letterSpacing:'0.1em', textTransform:'uppercase', px:0.5, mb:1, mt:1.5 }}>Pinned</Typography>{pinnedSessions.map(s => <SessionRow key={s.id} s={s} activeId={activeId} setActiveId={setActiveId} handleDots={handleSessionDots} renamingId={renamingId} renameVal={renameVal} setRenameVal={setRenameVal} setRenamingId={setRenamingId} setSessions={setSessions} draggingId={draggingId} />)}</>)}
            <Typography sx={{ fontSize:'0.6rem', fontWeight:700, color:'#444', letterSpacing:'0.1em', textTransform:'uppercase', px:0.5, mb:1, mt:threads.length>0||pinnedSessions.length>0?1.5:0.5 }}>Recent Chats</Typography>
            {unpinnedSessions.length===0&&threads.length===0&&pinnedSessions.length===0&&<Typography sx={{ fontSize:'0.72rem', color:'#333', px:0.5 }}>No chats yet</Typography>}
            {unpinnedSessions.map(s => <SessionRow key={s.id} s={s} activeId={activeId} setActiveId={setActiveId} handleDots={handleSessionDots} renamingId={renamingId} renameVal={renameVal} setRenameVal={setRenameVal} setRenamingId={setRenamingId} setSessions={setSessions} draggingId={draggingId} />)}
          </Box>
        </Box>

        <Box sx={{ px:2, pt:1.5, pb:2, borderTop:`1px solid ${BORDER}`, flexShrink:0 }}>
          <Typography sx={{ fontSize:'0.6rem', fontWeight:700, color:'#444', letterSpacing:'0.1em', textTransform:'uppercase', mb:1 }}>Capabilities</Typography>
          {CAPABILITIES.map((c: string) => <Box key={c} sx={{ display:'flex', alignItems:'center', gap:0.8, mb:0.2 }}><Box sx={{ width:4, height:4, borderRadius:'50%', bgcolor:AGENT_COLOR, flexShrink:0 }} /><Typography sx={{ fontSize:'0.7rem', color:'#555' }}>{c}</Typography></Box>)}
        </Box>
      </Box>

      {/* ── Main Chat ── */}
      <Box sx={{ flex:1, display:'flex', flexDirection:'column', height:'100vh', minWidth:0 }}>
        <ChatNavbar title={active.title} archivedCount={archivedSessions.length} onOpenArchive={() => setArchiveModal(true)} />

        <Box sx={{ flex:1, overflowY:'auto', px:4, py:3, '&::-webkit-scrollbar':{ width:4 }, '&::-webkit-scrollbar-thumb':{ bgcolor:'#1a1a1a', borderRadius:2 } }}>
          {active.messages.length === 1 && (
            <Box sx={{ textAlign:'center', mb:4, mt:2 }}>
              <Box sx={{ width:56, height:56, borderRadius:'16px', bgcolor:`${AGENT_COLOR}18`, border:`1px solid ${AGENT_COLOR}35`, display:'flex', alignItems:'center', justifyContent:'center', color:AGENT_COLOR, mx:'auto', mb:2 }}><AgentIconLg /></Box>
              <Typography sx={{ fontSize:'1.1rem', fontWeight:800, color:'#fff', mb:0.5 }}>{AGENT_NAME}</Typography>
              <Typography sx={{ fontSize:'0.78rem', color:'#555', mb:3 }}>{AGENT_SUBTITLE}</Typography>
              <Box sx={{ display:'flex', flexWrap:'wrap', gap:1, justifyContent:'center', maxWidth:560, mx:'auto' }}>
                {PROMPTS.map((p: string) => <Box key={p} onClick={() => send(p)} sx={{ px:1.8, py:0.9, borderRadius:'20px', border:`1px solid ${BORDER}`, bgcolor:CARD, cursor:'pointer', transition:'all 0.15s', '&:hover':{ border:`1px solid ${AGENT_COLOR}44`, bgcolor:`${AGENT_COLOR}08` } }}><Typography sx={{ fontSize:'0.75rem', color:'#888' }}>{p}</Typography></Box>)}
              </Box>
            </Box>
          )}
          {active.messages.map((m,i) => <Bubble key={i} msg={m} />)}
          {loading && (
            <Box sx={{ display:'flex', alignItems:'flex-end', gap:1.2, mb:2 }}>
              <Box sx={{ width:30, height:30, borderRadius:'9px', bgcolor:`${AGENT_COLOR}20`, border:`1px solid ${AGENT_COLOR}40`, display:'flex', alignItems:'center', justifyContent:'center', color:AGENT_COLOR, flexShrink:0 }}><AgentIconSm /></Box>
              <Box sx={{ px:2, py:1.5, borderRadius:'14px 14px 14px 4px', background:CARD2, border:`1px solid ${BORDER}` }}><TypingDots /></Box>
            </Box>
          )}
          <div ref={bottomRef} />
        </Box>

        <Box sx={{ px:4, py:2.5, borderTop:`1px solid ${BORDER}`, flexShrink:0 }}>
          {active.messages.length > 1 && (
            <Box sx={{ display:'flex', gap:1, mb:1.5, overflowX:'auto', '&::-webkit-scrollbar':{ display:'none' } }}>
              {PROMPTS.slice(0,4).map((p: string) => <Box key={p} onClick={() => send(p)} sx={{ px:1.4, py:0.5, borderRadius:'16px', border:`1px solid ${BORDER}`, bgcolor:CARD, cursor:'pointer', whiteSpace:'nowrap', flexShrink:0, transition:'all 0.15s', '&:hover':{ border:`1px solid ${AGENT_COLOR}44`, bgcolor:`${AGENT_COLOR}08` } }}><Typography sx={{ fontSize:'0.7rem', color:'#666' }}>{p}</Typography></Box>)}
            </Box>
          )}
          <TextField fullWidth multiline maxRows={4} placeholder={PLACEHOLDER} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();} }}
            sx={{ '& .MuiOutlinedInput-root':{ bgcolor:CARD2, borderRadius:'12px', color:'#ccc', fontSize:'0.85rem', '& textarea':{ '&::placeholder':{ color:'#444', opacity:1 } }, '& fieldset':{ border:`1px solid ${BORDER}` }, '&:hover fieldset':{ border:`1px solid #2a2a2a` }, '&.Mui-focused fieldset':{ border:`1px solid ${AGENT_COLOR}55` } } }}
            InputProps={{ endAdornment:(
              <InputAdornment position="end">
                <IconButton onClick={() => send()} disabled={!input.trim()||loading} sx={{ width:34, height:34, bgcolor:input.trim()&&!loading?AGENT_COLOR:'#1a1a1a', borderRadius:'9px', color:input.trim()&&!loading?'#fff':'#444', transition:'all 0.2s', '&:hover':{ filter:input.trim()&&!loading?'brightness(1.1)':'none' }, '&.Mui-disabled':{ bgcolor:'#1a1a1a', color:'#333' } }}><SendIcon /></IconButton>
              </InputAdornment>
            )}}
          />
          <Typography sx={{ fontSize:'0.65rem', color:'#333', textAlign:'center', mt:1 }}>Commedia AI · Press Enter to send, Shift+Enter for new line</Typography>
        </Box>
      </Box>

      <CreateThreadModal open={threadModal} onClose={() => setThreadModal(false)} onCreate={name => setThreads(p => [...p, {id:Date.now().toString(),name,expanded:true}])} />
      <ArchiveModal open={archiveModal} sessions={archivedSessions} onRestore={handleRestore} onDelete={handleDelete} onClose={() => setArchiveModal(false)} />
      {sessionMenu && <PopupMenu x={sessionMenu.x} y={sessionMenu.y} items={getSessionMenuItems(sessionMenu.sessionId)} onClose={() => setSessionMenu(null)} />}
      {movePickerMenu && <MoveToThreadPicker x={movePickerMenu.x+175} y={movePickerMenu.y} threads={threads} onMove={threadId => handleMoveToThread(movePickerMenu.sessionId, threadId)} onClose={() => setMovePickerMenu(null)} />}
    </Box>
  );
}