'use client';

import React, { useState, useRef } from 'react';
import { Box, Typography, TextField, Modal } from '@mui/material';
import Sidebar from '../../components/sidebar';
import Navbar from '../../components/navbar';
import { useColorMode } from '../../../theme/ThemeRegistry';

// ── Theme ──────────────────────────────────────────────────────────────
const PURPLE = '#783CB4'; // Updated brand color to purple
const SIDEBAR_EXPANDED  = 260;
const SIDEBAR_COLLAPSED = 70;

// ── Icons ──────────────────────────────────────────────────────────────
const IconPlus     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>;
const IconUpload   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
const IconFile     = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
const IconFilePdf  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/></svg>;
const IconFileCsv  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
const IconUsers    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IconTrash    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;
const IconClose    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>;
const IconSearch   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>;
const IconBrain    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.04-3.04A3 3 0 0 1 4.5 12a3 3 0 0 1 1.5-2.5A2.5 2.5 0 0 1 9.5 2"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.04-3.04A3 3 0 0 0 19.5 12a3 3 0 0 0-1.5-2.5A2.5 2.5 0 0 0 14.5 2"/></svg>;
const IconDot      = () => <svg width="6" height="6" viewBox="0 0 10 10"><circle cx="5" cy="5" r="5" fill="currentColor"/></svg>;
const IconCheck    = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IconInfo     = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>;
const IconChevron  = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>;
const IconEmpty    = () => <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>;

// ── Types ──────────────────────────────────────────────────────────────
type FileStatus = 'processing' | 'ready' | 'error';
type FileType   = 'pdf' | 'csv' | 'txt' | 'json' | 'docx' | 'other';

interface KBFile      { id:string; name:string; size:string; type:FileType; status:FileStatus; uploadedAt:string; uploadedBy:string; }
interface ProjectUser { id:string; name:string; email:string; role:'owner'|'editor'|'viewer'; }
interface Project     { id:string; name:string; description:string; color:string; files:KBFile[]; users:ProjectUser[]; createdAt:string; lastUpdated:string; }

// ── Constants ──────────────────────────────────────────────────────────
const FILE_COLORS: Record<FileType,string> = { pdf:'#ef4444', csv:'#10b981', txt:'#888', json:'#f59e0b', docx:'#3b82f6', other:'#666' };
const ROLE_COLORS: Record<string,string>   = { owner:PURPLE, editor:'#3b82f6', viewer:'#666' }; // Updated owner role to PURPLE
const COLOR_OPTIONS = ['#3b82f6','#8b5cf6','#10b981','#ef4444','#f59e0b','#ec4899','#06b6d4','#f97316'];

const ALL_USERS: ProjectUser[] = [
  { id:'u1', name:'Alex Carter',  email:'alex@commedia.ai',   role:'owner'  },
  { id:'u2', name:'Sam Rivera',   email:'sam@commedia.ai',    role:'editor' },
  { id:'u3', name:'Jordan Lee',   email:'jordan@commedia.ai', role:'viewer' },
  { id:'u4', name:'Morgan Chen',  email:'morgan@commedia.ai', role:'editor' },
];

const SEED_PROJECTS: Project[] = [
  {
    id:'p1', name:'Network Operations — Site A', color:'#3b82f6',
    description:'Primary campus network infrastructure docs and topology maps.',
    createdAt:'Jan 12, 2025', lastUpdated:'2 hours ago',
    users:[ALL_USERS[0], ALL_USERS[1]],
    files:[
      { id:'f1', name:'site-a-topology.pdf',  size:'2.4 MB', type:'pdf',  status:'ready',      uploadedAt:'2h ago',   uploadedBy:'Alex Carter' },
      { id:'f2', name:'device-inventory.csv', size:'840 KB', type:'csv',  status:'ready',      uploadedAt:'2h ago',   uploadedBy:'Sam Rivera'  },
      { id:'f3', name:'runbook-v3.docx',      size:'1.1 MB', type:'docx', status:'processing', uploadedAt:'just now', uploadedBy:'Alex Carter' },
    ],
  },
  {
    id:'p2', name:'Core Switch Fleet', color:'#8b5cf6',
    description:'Config templates, firmware notes and maintenance logs.',
    createdAt:'Feb 3, 2025', lastUpdated:'Yesterday',
    users:[ALL_USERS[0], ALL_USERS[2], ALL_USERS[3]],
    files:[
      { id:'f4', name:'switch-configs.json', size:'320 KB', type:'json', status:'ready', uploadedAt:'1d ago', uploadedBy:'Jordan Lee'  },
      { id:'f5', name:'firmware-notes.txt',  size:'58 KB',  type:'txt',  status:'ready', uploadedAt:'3d ago', uploadedBy:'Morgan Chen' },
    ],
  },
  {
    id:'p3', name:'Incident Playbooks', color:'#10b981',
    description:'SOPs and escalation paths for P1/P2 incidents.',
    createdAt:'Mar 1, 2025', lastUpdated:'3 days ago',
    users:[ALL_USERS[0]],
    files:[
      { id:'f6', name:'p1-playbook.pdf',     size:'1.7 MB', type:'pdf', status:'ready', uploadedAt:'3d ago', uploadedBy:'Alex Carter' },
      { id:'f7', name:'escalation-tree.pdf', size:'540 KB', type:'pdf', status:'error', uploadedAt:'3d ago', uploadedBy:'Alex Carter' },
    ],
  },
];

// ── Helpers ────────────────────────────────────────────────────────────
function initials(name:string) { return name.split(' ').map(w=>w[0]).join('').toUpperCase(); }
function fileIcon(t:FileType) { if(t==='pdf') return <IconFilePdf />; if(t==='csv') return <IconFileCsv />; return <IconFile />; }
function getType(n:string):FileType { const e=n.split('.').pop()?.toLowerCase()??''; if(e==='pdf') return 'pdf'; if(e==='csv') return 'csv'; if(e==='txt') return 'txt'; if(e==='json') return 'json'; if(['doc','docx'].includes(e)) return 'docx'; return 'other'; }
function fmtSize(b:number) { if(b<1024) return `${b} B`; if(b<1024*1024) return `${(b/1024).toFixed(0)} KB`; return `${(b/1024/1024).toFixed(1)} MB`; }
function uid() { return Math.random().toString(36).slice(2,10); }

// ── Status badge ───────────────────────────────────────────────────────
function StatusBadge({ status }:{ status:FileStatus }) {
  const m = { processing:{c:'#f59e0b',l:'Processing'}, ready:{c:'#22c55e',l:'Ready'}, error:{c:'#ef4444',l:'Error'} };
  const s = m[status];
  return (
    <Box sx={{ display:'flex', alignItems:'center', gap:0.5, px:0.9, py:0.28, borderRadius:'5px', bgcolor:`${s.c}12`, border:`1px solid ${s.c}25`, flexShrink:0 }}>
      <Box sx={{ color:s.c, display:'flex' }}><IconDot /></Box>
      <Typography sx={{ fontSize:'0.63rem', color:s.c, fontWeight:600, whiteSpace:'nowrap' }}>{s.l}</Typography>
    </Box>
  );
}

// ── Create Project Modal ───────────────────────────────────────────────
function CreateProjectModal({ open, onClose, onCreate }:{ open:boolean; onClose:()=>void; onCreate:(n:string,d:string,c:string)=>void }) {
  const [name,setName]=useState(''); const [desc,setDesc]=useState(''); const [color,setColor]=useState(COLOR_OPTIONS[0]);
  const { mode } = useColorMode();
  const isDark = mode === 'dark';
  
  const MODAL_BG = isDark ? '#131313' : '#ffffff';
  const BORDER = isDark ? '#252525' : '#e5e7eb';
  const INPUT_BG = isDark ? '#0c0c0c' : '#f9fafb';
  const TEXT_MAIN = isDark ? '#e0e0e0' : '#111827';
  const TEXT_MUTED = isDark ? '#555' : '#6b7280';
  const INPUT_TEXT = isDark ? '#ddd' : '#111827';
  
  const submit=()=>{ if(!name.trim()) return; onCreate(name.trim(),desc.trim(),color); setName('');setDesc('');setColor(COLOR_OPTIONS[0]);onClose(); };
  
  const iSx=(c:string)=>({ 
    '& .MuiOutlinedInput-root':{ 
      bgcolor:INPUT_BG,
      borderRadius:'9px',
      fontSize:'0.83rem',
      '& input,& textarea':{ 
        color:INPUT_TEXT,
        '&::placeholder':{color:isDark?'#3a3a3a':'#9ca3af',opacity:1} 
      },
      '& fieldset':{border:`1px solid ${BORDER}`},
      '&:hover fieldset':{border:`1px solid ${isDark?'#333':'#d1d5db'}`},
      '&.Mui-focused fieldset':{border:`1px solid ${c}50`} 
    } 
  });

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:440,bgcolor:MODAL_BG,border:`1px solid ${BORDER}`,borderRadius:'14px',p:3,outline:'none',boxShadow:isDark?'0 24px 60px rgba(0,0,0,0.85)':'0 24px 60px rgba(0,0,0,0.1)' }}>
        <Box sx={{ display:'flex',alignItems:'center',justifyContent:'space-between',mb:2.5 }}>
          <Box>
            <Typography sx={{ fontSize:'0.92rem',fontWeight:600,color:TEXT_MAIN }}>New Project</Typography>
            <Typography sx={{ fontSize:'0.7rem',color:TEXT_MUTED,mt:0.2 }}>Group knowledge files by team or initiative</Typography>
          </Box>
          <Box onClick={onClose} sx={{ color:TEXT_MUTED,cursor:'pointer',display:'flex',p:0.5,borderRadius:'6px','&:hover':{color:isDark?'#aaa':'#111',bgcolor:isDark?'#1e1e1e':'#f3f4f6'} }}><IconClose /></Box>
        </Box>
        <Box sx={{ mb:2 }}>
          <Typography sx={{ fontSize:'0.65rem',color:TEXT_MUTED,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.08em',mb:1 }}>Colour</Typography>
          <Box sx={{ display:'flex',gap:0.8 }}>
            {COLOR_OPTIONS.map(c=>(
              <Box key={c} onClick={()=>setColor(c)} sx={{ width:22,height:22,borderRadius:'50%',bgcolor:c,cursor:'pointer',outline:color===c?(isDark?'2px solid #fff':'2px solid #000'):'2px solid transparent',outlineOffset:'2px',transition:'outline 0.12s',boxShadow:color===c?`0 0 8px ${c}80`:'none' }} />
            ))}
          </Box>
        </Box>
        <TextField fullWidth placeholder="Project name" value={name} onChange={e=>setName(e.target.value)} sx={{ mb:1.5,...iSx(color) }} />
        <TextField fullWidth multiline rows={2} placeholder="Description (optional)" value={desc} onChange={e=>setDesc(e.target.value)} sx={{ mb:2.5,...iSx(color) }} />
        <Box sx={{ display:'flex',gap:1,justifyContent:'flex-end' }}>
          <Box onClick={onClose} sx={{ px:2,py:0.8,borderRadius:'8px',border:`1px solid ${BORDER}`,cursor:'pointer','&:hover':{bgcolor:isDark?'#1a1a1a':'#f3f4f6'} }}>
            <Typography sx={{ fontSize:'0.78rem',color:isDark?'#666':'#4b5563' }}>Cancel</Typography>
          </Box>
          <Box onClick={submit} sx={{ px:2.5,py:0.8,borderRadius:'8px',bgcolor:name.trim()?color:(isDark?'#1a1a1a':'#e5e7eb'),cursor:name.trim()?'pointer':'default',transition:'all 0.15s','&:hover':{filter:name.trim()?'brightness(1.1)':'none'} }}>
            <Typography sx={{ fontSize:'0.78rem',fontWeight:600,color:name.trim()?'#fff':(isDark?'#444':'#9ca3af') }}>Create Project</Typography>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

// ── Add Member Modal ───────────────────────────────────────────────────
function AddMemberModal({ open,onClose,onAdd,existingIds }:{ open:boolean;onClose:()=>void;onAdd:(u:ProjectUser)=>void;existingIds:string[] }) {
  const [q,setQ]=useState(''); const [picked,setPicked]=useState<ProjectUser|null>(null); const [role,setRole]=useState<'editor'|'viewer'>('editor');
  const { mode } = useColorMode();
  const isDark = mode === 'dark';
  
  const MODAL_BG = isDark ? '#131313' : '#ffffff';
  const BORDER = isDark ? '#252525' : '#e5e7eb';
  const INPUT_BG = isDark ? '#0c0c0c' : '#f9fafb';
  const TEXT_MAIN = isDark ? '#e0e0e0' : '#111827';
  const TEXT_MUTED = isDark ? '#555' : '#6b7280';
  const INPUT_TEXT = isDark ? '#ccc' : '#111827';
  
  const list=ALL_USERS.filter(u=>!existingIds.includes(u.id)&&(u.name.toLowerCase().includes(q.toLowerCase())||u.email.toLowerCase().includes(q.toLowerCase())));
  const submit=()=>{ if(!picked) return; onAdd({...picked,role}); setQ('');setPicked(null);setRole('editor');onClose(); };
  
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:400,bgcolor:MODAL_BG,border:`1px solid ${BORDER}`,borderRadius:'14px',p:3,outline:'none',boxShadow:isDark?'0 24px 60px rgba(0,0,0,0.85)':'0 24px 60px rgba(0,0,0,0.1)' }}>
        <Box sx={{ display:'flex',alignItems:'center',justifyContent:'space-between',mb:2 }}>
          <Typography sx={{ fontSize:'0.92rem',fontWeight:600,color:TEXT_MAIN }}>Add Member</Typography>
          <Box onClick={onClose} sx={{ color:TEXT_MUTED,cursor:'pointer',display:'flex',p:0.5,borderRadius:'6px','&:hover':{color:isDark?'#aaa':'#111',bgcolor:isDark?'#1e1e1e':'#f3f4f6'} }}><IconClose /></Box>
        </Box>
        <Box sx={{ display:'flex',alignItems:'center',gap:0.8,px:1.2,py:0.85,borderRadius:'9px',bgcolor:INPUT_BG,border:`1px solid ${BORDER}`,mb:1.5 }}>
          <Box sx={{ color:TEXT_MUTED,display:'flex' }}><IconSearch /></Box>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by name or email…" style={{ background:'transparent',border:'none',outline:'none',color:INPUT_TEXT,fontSize:'0.8rem',width:'100%',fontFamily:'inherit' }} />
        </Box>
        <Box sx={{ maxHeight:180,overflowY:'auto',mb:2,'&::-webkit-scrollbar':{display:'none'} }}>
          {list.length===0
            ? <Typography sx={{ fontSize:'0.75rem',color:TEXT_MUTED,textAlign:'center',py:2 }}>No users available</Typography>
            : list.map(u=>(
              <Box key={u.id} onClick={()=>setPicked(u)} sx={{ display:'flex',alignItems:'center',gap:1.2,px:1.2,py:0.9,borderRadius:'9px',cursor:'pointer',mb:0.3,bgcolor:picked?.id===u.id?`${PURPLE}0c`:'transparent',border:`1px solid ${picked?.id===u.id?PURPLE+'22':'transparent'}`,transition:'all 0.12s','&:hover':{bgcolor:isDark?'#181818':'#f3f4f6'} }}>
                <Box sx={{ width:32,height:32,borderRadius:'50%',bgcolor:isDark?'#1a1a1a':'#e5e7eb',border:`1px solid ${BORDER}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                  <Typography sx={{ fontSize:'0.62rem',fontWeight:600,color:TEXT_MUTED }}>{initials(u.name)}</Typography>
                </Box>
                <Box sx={{ flex:1,minWidth:0 }}>
                  <Typography sx={{ fontSize:'0.8rem',color:INPUT_TEXT,fontWeight:500 }}>{u.name}</Typography>
                  <Typography sx={{ fontSize:'0.65rem',color:TEXT_MUTED }}>{u.email}</Typography>
                </Box>
                {picked?.id===u.id && <Box sx={{ color:PURPLE,display:'flex' }}><IconCheck /></Box>}
              </Box>
            ))
          }
        </Box>
        <Box sx={{ mb:2.5 }}>
          <Typography sx={{ fontSize:'0.65rem',color:TEXT_MUTED,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.08em',mb:1 }}>Role</Typography>
          <Box sx={{ display:'flex',gap:0.8 }}>
            {(['editor','viewer'] as const).map(r=>(
              <Box key={r} onClick={()=>setRole(r)} sx={{ flex:1,py:0.8,borderRadius:'8px',textAlign:'center',cursor:'pointer',border:`1px solid ${role===r?ROLE_COLORS[r]+'45':BORDER}`,bgcolor:role===r?`${ROLE_COLORS[r]}10`:'transparent',transition:'all 0.14s' }}>
                <Typography sx={{ fontSize:'0.76rem',color:role===r?ROLE_COLORS[r]:TEXT_MUTED,fontWeight:role===r?600:400,textTransform:'capitalize' }}>{r}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
        <Box sx={{ display:'flex',gap:1,justifyContent:'flex-end' }}>
          <Box onClick={onClose} sx={{ px:2,py:0.8,borderRadius:'8px',border:`1px solid ${BORDER}`,cursor:'pointer','&:hover':{bgcolor:isDark?'#1a1a1a':'#f3f4f6'} }}>
            <Typography sx={{ fontSize:'0.78rem',color:isDark?'#666':'#4b5563' }}>Cancel</Typography>
          </Box>
          <Box onClick={submit} sx={{ px:2.5,py:0.8,borderRadius:'8px',bgcolor:picked?PURPLE:(isDark?'#1a1a1a':'#e5e7eb'),cursor:picked?'pointer':'default',transition:'all 0.15s' }}>
            <Typography sx={{ fontSize:'0.78rem',fontWeight:600,color:picked?'#fff':(isDark?'#444':'#9ca3af') }}>Add Member</Typography>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

// ── Left project card ──────────────────────────────────────────────────
function ProjectCard({ p,active,onClick }:{ p:Project;active:boolean;onClick:()=>void }) {
  const { mode } = useColorMode();
  const isDark = mode === 'dark';
  const BORDER = isDark ? '#1e1e1e' : '#e5e7eb';
  const TEXT_MAIN = isDark ? '#e8e8e8' : '#111827';
  const TEXT_MUTED = isDark ? '#bbb' : '#6b7280';
  const ICON_COLOR = isDark ? '#3a3a3a' : '#9ca3af';

  const ready=p.files.filter(f=>f.status==='ready').length;
  
  return (
    <Box onClick={onClick} sx={{ px:1.5,py:1.3,borderRadius:'10px',border:`1px solid ${active?p.color+'40':BORDER}`,bgcolor:active?`${p.color}07`:'transparent',cursor:'pointer',mb:0.8,transition:'all 0.14s','&:hover':{ bgcolor:active?`${p.color}07`:(isDark?'#111':'#f9fafb'),border:`1px solid ${p.color}30` } }}>
      <Box sx={{ display:'flex',alignItems:'center',gap:1.1 }}>
        <Box sx={{ width:8,height:8,borderRadius:'50%',bgcolor:p.color,flexShrink:0,mt:'1px',boxShadow:active?`0 0 6px ${p.color}`:'none' }} />
        <Box sx={{ flex:1,minWidth:0 }}>
          <Box sx={{ display:'flex',alignItems:'center',justifyContent:'space-between',mb:0.4 }}>
            <Typography sx={{ fontSize:'0.81rem',fontWeight:active?600:400,color:active?TEXT_MAIN:TEXT_MUTED,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',maxWidth:'88%' }}>{p.name}</Typography>
            <Box sx={{ color:isDark?'#333':'#d1d5db',display:'flex',flexShrink:0 }}><IconChevron /></Box>
          </Box>
          <Box sx={{ display:'flex',alignItems:'center',gap:1.5 }}>
            <Box sx={{ display:'flex',alignItems:'center',gap:0.4 }}>
              <Box sx={{ color:ICON_COLOR,display:'flex' }}><IconFile /></Box>
              <Typography sx={{ fontSize:'0.63rem',color:isDark?'#4a4a4a':'#6b7280' }}>{ready}/{p.files.length} ready</Typography>
            </Box>
            <Box sx={{ display:'flex',alignItems:'center',gap:0.4 }}>
              <Box sx={{ color:ICON_COLOR,display:'flex' }}><IconUsers /></Box>
              <Typography sx={{ fontSize:'0.63rem',color:isDark?'#4a4a4a':'#6b7280' }}>{p.users.length} member{p.users.length!==1?'s':''}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

// ── Center panel ───────────────────────────────────────────────────────
function CenterPanel({ project,onDelete }:{ project:Project;onDelete:(id:string)=>void }) {
  const { mode } = useColorMode();
  const isDark = mode === 'dark';
  
  const CARD_BG = isDark ? '#111111' : '#ffffff';
  const BORDER = isDark ? '#1e1e1e' : '#e5e7eb';
  const ROW_BG = isDark ? '#0c0c0c' : '#f9fafb';
  const HOVER_BG = isDark ? '#0e0e0e' : '#f3f4f6';
  const TEXT_MAIN = isDark ? '#e8e8e8' : '#111827';
  const TEXT_MUTED = isDark ? '#555' : '#6b7280';
  const TEXT_DIM = isDark ? '#3a3a3a' : '#9ca3af';

  const ready=project.files.filter(f=>f.status==='ready').length;
  const processing=project.files.filter(f=>f.status==='processing').length;
  const breakdown=project.files.reduce<Record<string,number>>((a,f)=>{ a[f.type]=(a[f.type]||0)+1; return a; },{});

  return (
    <Box sx={{ flex:1,overflowY:'auto',px:3.5,py:3,'&::-webkit-scrollbar':{width:3},'&::-webkit-scrollbar-thumb':{bgcolor:isDark?'#1e1e1e':'#e5e7eb',borderRadius:2} }}>

      {/* Header */}
      <Box sx={{ display:'flex',alignItems:'flex-start',justifyContent:'space-between',mb:3 }}>
        <Box>
          <Box sx={{ display:'flex',alignItems:'center',gap:1.1,mb:0.5 }}>
            <Box sx={{ width:9,height:9,borderRadius:'50%',bgcolor:project.color,boxShadow:`0 0 8px ${project.color}80`,flexShrink:0 }} />
            <Typography sx={{ fontSize:'1rem',fontWeight:600,color:TEXT_MAIN }}>{project.name}</Typography>
          </Box>
          {project.description && <Typography sx={{ fontSize:'0.73rem',color:TEXT_MUTED,ml:'1.3rem',mb:0.3 }}>{project.description}</Typography>}
          <Typography sx={{ fontSize:'0.67rem',color:TEXT_DIM,ml:'1.3rem' }}>Created {project.createdAt} · Updated {project.lastUpdated}</Typography>
        </Box>
        <Box onClick={()=>onDelete(project.id)} sx={{ display:'flex',alignItems:'center',gap:0.6,px:1.2,py:0.65,borderRadius:'8px',border:`1px solid ${BORDER}`,color:TEXT_MUTED,cursor:'pointer',flexShrink:0,transition:'all 0.14s','&:hover':{color:'#ef4444',border:'1px solid #ef444440',bgcolor:isDark?'#160808':'#fef2f2'} }}>
          <IconTrash /><Typography sx={{ fontSize:'0.72rem' }}>Delete</Typography>
        </Box>
      </Box>

      {/* Stats */}
      <Box sx={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:1.2,mb:3 }}>
        {[
          { label:'Total Files', value:project.files.length, color:project.color },
          { label:'Ready',       value:ready,                color:'#22c55e' },
          { label:'Processing',  value:processing,           color:'#f59e0b' },
          { label:'Members',     value:project.users.length, color:'#8b5cf6' },
        ].map(s=>(
          <Box key={s.label} sx={{ px:1.5,py:1.5,borderRadius:'10px',bgcolor:CARD_BG,border:`1px solid ${BORDER}`,textAlign:'center' }}>
            <Typography sx={{ fontSize:'1.5rem',fontWeight:600,color:s.color,lineHeight:1 }}>{s.value}</Typography>
            <Typography sx={{ fontSize:'0.6rem',color:TEXT_MUTED,mt:0.4,textTransform:'uppercase',letterSpacing:'0.07em' }}>{s.label}</Typography>
          </Box>
        ))}
      </Box>

      {project.files.length===0 ? (
        <Box sx={{ textAlign:'center',py:8 }}>
          <Box sx={{ display:'flex',justifyContent:'center',mb:2,color:isDark?'#252525':'#d1d5db' }}><IconEmpty /></Box>
          <Typography sx={{ fontSize:'0.82rem',color:TEXT_DIM,mb:0.5 }}>No files in this project yet</Typography>
          <Typography sx={{ fontSize:'0.7rem',color:isDark?'#2e2e2e':'#9ca3af' }}>Use the Upload Files button on the right →</Typography>
        </Box>
      ) : (
        <>
          {/* File type tags */}
          <Typography sx={{ fontSize:'0.63rem',color:TEXT_MUTED,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.09em',mb:1.1 }}>File Types</Typography>
          <Box sx={{ display:'flex',flexWrap:'wrap',gap:0.7,mb:3 }}>
            {Object.entries(breakdown).map(([type,count])=>(
              <Box key={type} sx={{ display:'flex',alignItems:'center',gap:0.7,px:1.2,py:0.6,borderRadius:'7px',bgcolor:CARD_BG,border:`1px solid ${BORDER}` }}>
                <Box sx={{ color:FILE_COLORS[type as FileType]||(isDark?'#666':'#9ca3af'),display:'flex' }}>{fileIcon(type as FileType)}</Box>
                <Typography sx={{ fontSize:'0.7rem',color:isDark?'#777':'#4b5563' }}>{type.toUpperCase()}</Typography>
                <Box sx={{ px:0.5,py:0.1,borderRadius:'3px',bgcolor:isDark?'#1a1a1a':'#f3f4f6' }}>
                  <Typography sx={{ fontSize:'0.6rem',color:TEXT_MUTED }}>{count}</Typography>
                </Box>
              </Box>
            ))}
          </Box>

          {/* Files table */}
          <Typography sx={{ fontSize:'0.63rem',color:TEXT_MUTED,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.09em',mb:1.1 }}>All Files</Typography>
          <Box sx={{ borderRadius:'10px',border:`1px solid ${BORDER}`,overflow:'hidden',mb:3 }}>
            <Box sx={{ display:'grid',gridTemplateColumns:'1fr 70px 100px 86px',px:1.8,py:0.85,bgcolor:ROW_BG,borderBottom:`1px solid ${BORDER}` }}>
              {['Name','Size','Uploaded by','Status'].map(h=>(
                <Typography key={h} sx={{ fontSize:'0.6rem',color:TEXT_DIM,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.08em' }}>{h}</Typography>
              ))}
            </Box>
            {project.files.map((f,i)=>(
              <Box key={f.id} sx={{ display:'grid',gridTemplateColumns:'1fr 70px 100px 86px',px:1.8,py:1.1,borderBottom:i<project.files.length-1?`1px solid ${BORDER}`:'none',alignItems:'center',transition:'background 0.1s','&:hover':{bgcolor:HOVER_BG} }}>
                <Box sx={{ display:'flex',alignItems:'center',gap:0.9,minWidth:0 }}>
                  <Box sx={{ color:FILE_COLORS[f.type],display:'flex',flexShrink:0 }}>{fileIcon(f.type)}</Box>
                  <Typography sx={{ fontSize:'0.75rem',color:isDark?'#b0b0b0':'#1f2937',fontWeight:500,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }}>{f.name}</Typography>
                </Box>
                <Typography sx={{ fontSize:'0.68rem',color:TEXT_MUTED }}>{f.size}</Typography>
                <Typography sx={{ fontSize:'0.68rem',color:TEXT_MUTED,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }}>{f.uploadedBy.split(' ')[0]}</Typography>
                <StatusBadge status={f.status} />
              </Box>
            ))}
          </Box>

          {/* Team */}
          <Typography sx={{ fontSize:'0.63rem',color:TEXT_MUTED,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.09em',mb:1.1 }}>Team</Typography>
          <Box sx={{ display:'flex',flexWrap:'wrap',gap:0.7 }}>
            {project.users.map(u=>(
              <Box key={u.id} sx={{ display:'flex',alignItems:'center',gap:0.8,px:1.1,py:0.6,borderRadius:'8px',bgcolor:CARD_BG,border:`1px solid ${BORDER}` }}>
                <Box sx={{ width:20,height:20,borderRadius:'50%',bgcolor:u.role==='owner'?`${PURPLE}15`:(isDark?'#1a1a1a':'#f3f4f6'),border:`1px solid ${u.role==='owner'?PURPLE+'30':(isDark?'#2a2a2a':'#e5e7eb')}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                  <Typography sx={{ fontSize:'0.52rem',fontWeight:700,color:u.role==='owner'?PURPLE:(isDark?'#666':'#9ca3af') }}>{initials(u.name)}</Typography>
                </Box>
                <Typography sx={{ fontSize:'0.73rem',color:isDark?'#aaa':'#4b5563' }}>{u.name.split(' ')[0]}</Typography>
                <Box sx={{ px:0.65,py:0.15,borderRadius:'4px',bgcolor:`${ROLE_COLORS[u.role]}10`,border:`1px solid ${ROLE_COLORS[u.role]}20` }}>
                  <Typography sx={{ fontSize:'0.57rem',color:ROLE_COLORS[u.role],fontWeight:600,textTransform:'capitalize' }}>{u.role}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}

// ── Right panel ────────────────────────────────────────────────────────
function RightPanel({ project,onUpload,onRemoveFile,onAddMember,onRemoveMember }:{ project:Project;onUpload:(pid:string,files:FileList)=>void;onRemoveFile:(pid:string,fid:string)=>void;onAddMember:(pid:string,u:ProjectUser)=>void;onRemoveMember:(pid:string,uid:string)=>void }) {
  const { mode } = useColorMode();
  const isDark = mode === 'dark';
  
  const PANEL_BG = isDark ? '#0d0d0d' : '#f9fafb';
  const BORDER = isDark ? '#1e1e1e' : '#e5e7eb';
  const TEXT_MAIN = isDark ? '#e0e0e0' : '#111827';
  const TEXT_MUTED = isDark ? '#444' : '#6b7280';
  const LIST_BG = isDark ? '#111' : '#ffffff';
  
  const fileRef=useRef<HTMLInputElement>(null);
  const [tab,setTab]=useState<'files'|'members'>('files');
  const [addOpen,setAddOpen]=useState(false);
  const [drag,setDrag]=useState(false);

  return (
    <Box sx={{ width:340,flexShrink:0,borderLeft:`1px solid ${BORDER}`,display:'flex',flexDirection:'column',height:'100%',bgcolor:PANEL_BG }}>

      {/* Header */}
      <Box sx={{ px:2.2,pt:1.8,pb:1.5,borderBottom:`1px solid ${BORDER}`,flexShrink:0 }}>
        <Box sx={{ display:'flex',alignItems:'center',gap:1,mb:0.3 }}>
          <Box sx={{ width:8,height:8,borderRadius:'50%',bgcolor:project.color,boxShadow:`0 0 6px ${project.color}88`,flexShrink:0 }} />
          <Typography sx={{ fontSize:'0.86rem',fontWeight:600,color:TEXT_MAIN,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }}>{project.name}</Typography>
        </Box>
        <Typography sx={{ fontSize:'0.66rem',color:TEXT_MUTED,ml:'1.15rem' }}>Updated {project.lastUpdated}</Typography>
      </Box>

      {/* Stats strip */}
      <Box sx={{ display:'flex',borderBottom:`1px solid ${BORDER}`,flexShrink:0 }}>
        {[
          { label:'Files',      value:project.files.length },
          { label:'Ready',      value:project.files.filter(f=>f.status==='ready').length,      color:'#22c55e' },
          { label:'Processing', value:project.files.filter(f=>f.status==='processing').length, color:'#f59e0b' },
          { label:'Members',    value:project.users.length },
        ].map((s,i)=>(
          <Box key={s.label} sx={{ flex:1,py:1.1,textAlign:'center',borderRight:i<3?`1px solid ${BORDER}`:'none' }}>
            <Typography sx={{ fontSize:'0.95rem',fontWeight:600,color:(s as any).color??TEXT_MAIN,lineHeight:1 }}>{s.value}</Typography>
            <Typography sx={{ fontSize:'0.56rem',color:TEXT_MUTED,mt:0.3,textTransform:'uppercase',letterSpacing:'0.07em' }}>{s.label}</Typography>
          </Box>
        ))}
      </Box>

      {/* Tabs */}
      <Box sx={{ display:'flex',borderBottom:`1px solid ${BORDER}`,flexShrink:0 }}>
        {(['files','members'] as const).map(t=>(
          <Box key={t} onClick={()=>setTab(t)} sx={{ flex:1,py:1,textAlign:'center',cursor:'pointer',borderBottom:`2px solid ${tab===t?project.color:'transparent'}`,transition:'border 0.14s' }}>
            <Typography sx={{ fontSize:'0.75rem',fontWeight:tab===t?600:400,color:tab===t?TEXT_MAIN:(isDark?'#555':'#9ca3af'),textTransform:'capitalize' }}>{t}</Typography>
          </Box>
        ))}
      </Box>

      {/* ── FILES tab ── */}
      {tab==='files' && (
        <Box sx={{ flex:1,display:'flex',flexDirection:'column',minHeight:0 }}>
          <Box sx={{ px:2,pt:1.6,pb:1.2,flexShrink:0 }}>
            {/* Upload button */}
            <Box onClick={()=>fileRef.current?.click()} sx={{ display:'flex',alignItems:'center',justifyContent:'center',gap:0.8,py:0.9,borderRadius:'9px',bgcolor:project.color,cursor:'pointer',mb:1,transition:'filter 0.14s','&:hover':{filter:'brightness(1.1)'} }}>
              <Box sx={{ color:'rgba(255,255,255,0.9)',display:'flex' }}><IconUpload /></Box>
              <Typography sx={{ fontSize:'0.8rem',fontWeight:600,color:'#fff' }}>Upload Files</Typography>
            </Box>
            {/* Drop zone */}
            <Box
              onDragOver={e=>{e.preventDefault();setDrag(true);}}
              onDragLeave={()=>setDrag(false)}
              onDrop={e=>{e.preventDefault();setDrag(false);if(e.dataTransfer.files.length)onUpload(project.id,e.dataTransfer.files);}}
              sx={{ py:1.3,borderRadius:'8px',border:`1.5px dashed ${drag?project.color:(isDark?'#252525':'#d1d5db')}`,bgcolor:drag?`${project.color}07`:'transparent',textAlign:'center',transition:'all 0.13s' }}
            >
              <Typography sx={{ fontSize:'0.7rem',color:drag?project.color:(isDark?'#383838':'#9ca3af') }}>{drag?'Drop to upload':'or drag & drop here'}</Typography>
              <Typography sx={{ fontSize:'0.6rem',color:isDark?'#2a2a2a':'#cbd5e1',mt:0.2 }}>PDF · CSV · TXT · JSON · DOCX</Typography>
            </Box>
            <input ref={fileRef} type="file" multiple accept=".pdf,.csv,.txt,.json,.doc,.docx" style={{ display:'none' }} onChange={e=>{if(e.target.files?.length){onUpload(project.id,e.target.files);e.target.value='';}}} />
          </Box>

          {/* File list */}
          <Box sx={{ flex:1,overflowY:'auto',px:2,pb:2,'&::-webkit-scrollbar':{width:3},'&::-webkit-scrollbar-thumb':{bgcolor:isDark?'#2a2a2a':'#cbd5e1',borderRadius:2} }}>
            {project.files.length===0
              ? <Box sx={{ textAlign:'center',py:3 }}><Typography sx={{ fontSize:'0.73rem',color:isDark?'#333':'#9ca3af' }}>No files uploaded yet</Typography></Box>
              : project.files.map(f=>(
                <Box key={f.id} sx={{ display:'flex',alignItems:'center',gap:1,px:1.1,py:0.95,borderRadius:'9px',bgcolor:LIST_BG,border:`1px solid ${BORDER}`,mb:0.7,'&:hover .del-btn':{opacity:1},transition:'border 0.12s','&:hover':{border:`1px solid ${isDark?'#282828':'#cbd5e1'}`} }}>
                  <Box sx={{ color:FILE_COLORS[f.type],display:'flex',flexShrink:0 }}>{fileIcon(f.type)}</Box>
                  <Box sx={{ flex:1,minWidth:0 }}>
                    <Typography sx={{ fontSize:'0.75rem',color:isDark?'#c0c0c0':'#1f2937',fontWeight:500,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }}>{f.name}</Typography>
                    <Typography sx={{ fontSize:'0.6rem',color:TEXT_MUTED,mt:0.1 }}>{f.size} · {f.uploadedAt}</Typography>
                  </Box>
                  <StatusBadge status={f.status} />
                  <Box className="del-btn" onClick={()=>onRemoveFile(project.id,f.id)} sx={{ opacity:0,display:'flex',alignItems:'center',justifyContent:'center',width:24,height:24,borderRadius:'5px',color:TEXT_MUTED,cursor:'pointer',flexShrink:0,transition:'all 0.13s','&:hover':{color:'#ef4444',bgcolor:isDark?'#280d0d':'#fef2f2'} }}><IconTrash /></Box>
                </Box>
              ))
            }
          </Box>
        </Box>
      )}

      {/* ── MEMBERS tab ── */}
      {tab==='members' && (
        <Box sx={{ flex:1,display:'flex',flexDirection:'column',minHeight:0 }}>
          <Box sx={{ px:2,pt:1.6,pb:1.2,display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0 }}>
            <Typography sx={{ fontSize:'0.67rem',color:TEXT_MUTED,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.08em' }}>{project.users.length} member{project.users.length!==1?'s':''}</Typography>
            <Box onClick={()=>setAddOpen(true)} sx={{ display:'flex',alignItems:'center',gap:0.5,px:1.1,py:0.5,borderRadius:'7px',border:`1px solid ${PURPLE}28`,color:PURPLE,cursor:'pointer',transition:'all 0.13s','&:hover':{bgcolor:`${PURPLE}0d`} }}>
              <IconPlus /><Typography sx={{ fontSize:'0.7rem',fontWeight:600 }}>Add</Typography>
            </Box>
          </Box>
          <Box sx={{ flex:1,overflowY:'auto',px:2,pb:2,'&::-webkit-scrollbar':{width:3},'&::-webkit-scrollbar-thumb':{bgcolor:isDark?'#2a2a2a':'#cbd5e1',borderRadius:2} }}>
            {project.users.map(u=>(
              <Box key={u.id} sx={{ display:'flex',alignItems:'center',gap:1.1,px:1.1,py:0.95,borderRadius:'9px',bgcolor:LIST_BG,border:`1px solid ${BORDER}`,mb:0.7,'&:hover .rem-btn':{opacity:1} }}>
                {/* Initials avatar */}
                <Box sx={{ width:30,height:30,borderRadius:'50%',bgcolor:u.role==='owner'?`${PURPLE}14`:(isDark?'#1a1a1a':'#f3f4f6'),border:`1px solid ${u.role==='owner'?PURPLE+'28':(isDark?'#252525':'#e5e7eb')}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                  <Typography sx={{ fontSize:'0.58rem',fontWeight:700,color:u.role==='owner'?PURPLE:(isDark?'#666':'#9ca3af'),lineHeight:1 }}>{initials(u.name)}</Typography>
                </Box>
                <Box sx={{ flex:1,minWidth:0 }}>
                  <Typography sx={{ fontSize:'0.77rem',color:isDark?'#c0c0c0':'#1f2937',fontWeight:500 }}>{u.name}</Typography>
                  <Typography sx={{ fontSize:'0.62rem',color:isDark?'#484848':'#6b7280' }}>{u.email}</Typography>
                </Box>
                <Box sx={{ px:0.8,py:0.25,borderRadius:'5px',bgcolor:`${ROLE_COLORS[u.role]}10`,border:`1px solid ${ROLE_COLORS[u.role]}22`,flexShrink:0 }}>
                  <Typography sx={{ fontSize:'0.59rem',color:ROLE_COLORS[u.role],fontWeight:600,textTransform:'capitalize' }}>{u.role}</Typography>
                </Box>
                {u.role!=='owner' && (
                  <Box className="rem-btn" onClick={()=>onRemoveMember(project.id,u.id)} sx={{ opacity:0,display:'flex',alignItems:'center',justifyContent:'center',width:24,height:24,borderRadius:'5px',color:TEXT_MUTED,cursor:'pointer',flexShrink:0,transition:'all 0.13s','&:hover':{color:'#ef4444',bgcolor:isDark?'#280d0d':'#fef2f2'} }}><IconTrash /></Box>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      )}

      <AddMemberModal open={addOpen} onClose={()=>setAddOpen(false)} existingIds={project.users.map(u=>u.id)} onAdd={u=>onAddMember(project.id,u)} />
    </Box>
  );
}

// ── Page ───────────────────────────────────────────────────────────────
export default function KnowledgeCenterPage(): React.ReactElement {
  const { mode } = useColorMode();
  const isDark = mode === 'dark';
  
  
  const BORDER = isDark ? '#1e1e1e' : '#e5e7eb';
  const CARD_BG = isDark ? '#111111' : '#ffffff';
  const TEXT_MAIN = isDark ? '#e0e0e0' : '#111827';
  const TEXT_MUTED = isDark ? '#4a4a4a' : '#6b7280';
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const sidebarW = sidebarCollapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED;
  const [projects,setProjects]     = useState<Project[]>(SEED_PROJECTS);
  const [selectedId,setSelectedId] = useState<string>('p1');
  const [createOpen,setCreateOpen] = useState(false);
  const [search,setSearch]         = useState('');

  const selected = projects.find(p=>p.id===selectedId)??null;
  const filtered = projects.filter(p=>p.name.toLowerCase().includes(search.toLowerCase())||p.description.toLowerCase().includes(search.toLowerCase()));

  function handleCreate(name:string,desc:string,color:string) {
    const np:Project={ id:uid(),name,description:desc,color,files:[],users:[{...ALL_USERS[0],role:'owner'}],createdAt:new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}),lastUpdated:'just now' };
    setProjects(p=>[np,...p]); setSelectedId(np.id);
  }
  function handleUpload(pid:string,files:FileList) {
    const added:KBFile[]=Array.from(files).map(f=>({ id:uid(),name:f.name,size:fmtSize(f.size),type:getType(f.name),status:'processing',uploadedAt:'just now',uploadedBy:'Alex Carter' }));
    setProjects(p=>p.map(proj=>proj.id===pid?{...proj,files:[...proj.files,...added],lastUpdated:'just now'}:proj));
    setTimeout(()=>{ setProjects(p=>p.map(proj=>proj.id===pid?{...proj,files:proj.files.map(f=>added.find(a=>a.id===f.id)?{...f,status:'ready'}:f)}:proj)); },2500);
  }
  function handleRemoveFile(pid:string,fid:string) { setProjects(p=>p.map(proj=>proj.id===pid?{...proj,files:proj.files.filter(f=>f.id!==fid)}:proj)); }
  function handleAddMember(pid:string,u:ProjectUser) { setProjects(p=>p.map(proj=>proj.id===pid?{...proj,users:[...proj.users,u]}:proj)); }
  function handleRemoveMember(pid:string,uid:string) { setProjects(p=>p.map(proj=>proj.id===pid?{...proj,users:proj.users.filter(u=>u.id!==uid)}:proj)); }
  function handleDelete(pid:string) { const rest=projects.filter(p=>p.id!==pid); setProjects(rest); setSelectedId(rest[0]?.id??''); }

  return (
    <Box sx={{ display:'flex',width:'100vw',height:'100vh',overflow:'hidden', bgcolor: 'background.default', color: 'text.primary', transition:'background-color 0.3s ease, color 0.3s ease' }}>
      <Sidebar onCollapseChange={setSidebarCollapsed} />
      <Box sx={{ flex:1,display:'flex',flexDirection:'column',height:'100vh',overflow:'hidden',marginLeft:`${sidebarW}px`,transition:'margin-left 0.28s cubic-bezier(0.4,0,0.2,1)' }}>
        <Navbar sidebarCollapsed={sidebarCollapsed} />
        <Box sx={{ flex:1,display:'flex',overflow:'hidden',pt:'64px' }}>

          {/* ── LEFT ── */}
          <Box sx={{ width:290,flexShrink:0,borderRight:`1px solid ${BORDER}`,display:'flex',flexDirection:'column',height:'100%', }}>
            <Box sx={{ px:2,pt:2,pb:1.8,borderBottom:`1px solid ${BORDER}`,flexShrink:0 }}>
              <Box sx={{ display:'flex',alignItems:'center',gap:0.9,mb:0.3 }}>
                <Box sx={{ color:PURPLE,display:'flex' }}><IconBrain /></Box>
                <Typography sx={{ fontSize:'0.9rem',fontWeight:600,color:TEXT_MAIN }}>Knowledge Center</Typography>
              </Box>
              <Typography sx={{ fontSize:'0.67rem',color:TEXT_MUTED,ml:'1.5rem',mb:1.5 }}>Upload files · Manage projects · Assign teams</Typography>
              
              {/* Search bar */}
              <Box sx={{ display:'flex',alignItems:'center',gap:0.7,px:1.1,py:0.8,borderRadius:'8px',bgcolor:CARD_BG,border:`1px solid ${BORDER}`,mb:1.1 }}>
                <Box sx={{ color:isDark?'#3a3a3a':'#9ca3af',display:'flex' }}><IconSearch /></Box>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search projects…" style={{ background:'transparent',border:'none',outline:'none',color:isDark?'#ccc':'#111827',fontSize:'0.77rem',width:'100%',fontFamily:'inherit' }} />
              </Box>
              
              {/* New Project Button */}
              <Box onClick={()=>setCreateOpen(true)} sx={{ display:'flex',alignItems:'center',justifyContent:'center',gap:0.7,py:0.82,borderRadius:'8px',border:`1px solid ${PURPLE}25`,color:PURPLE,cursor:'pointer',transition:'all 0.14s','&:hover':{bgcolor:`${PURPLE}0b`,border:`1px solid ${PURPLE}48`} }}>
                <IconPlus /><Typography sx={{ fontSize:'0.77rem',fontWeight:600 }}>New Project</Typography>
              </Box>
            </Box>

            <Box sx={{ flex:1,overflowY:'auto',px:1.5,py:1.5,'&::-webkit-scrollbar':{width:3},'&::-webkit-scrollbar-thumb':{bgcolor:isDark?'#2a2a2a':'#cbd5e1',borderRadius:2} }}>
              {filtered.length===0
                ? <Typography sx={{ fontSize:'0.73rem',color:isDark?'#333':'#9ca3af',textAlign:'center',pt:3 }}>No projects found</Typography>
                : filtered.map(p=><ProjectCard key={p.id} p={p} active={selectedId===p.id} onClick={()=>setSelectedId(p.id)} />)
              }
            </Box>
            <Box sx={{ px:1.5,pb:1.5,flexShrink:0 }}>
              <Box sx={{ display:'flex',gap:0.8,p:1.1,borderRadius:'8px',bgcolor:isDark?'#0c0c0c':'#f9fafb',border:`1px solid ${BORDER}` }}>
                <Box sx={{ color:isDark?'#333':'#9ca3af',display:'flex',flexShrink:0,mt:'1px' }}><IconInfo /></Box>
                <Typography sx={{ fontSize:'0.63rem',color:isDark?'#3a3a3a':'#6b7280',lineHeight:1.6 }}>Uploaded files are processed by AI agents as background knowledge for smarter responses.</Typography>
              </Box>
            </Box>
          </Box>

          {/* ── CENTER + RIGHT ── */}
          {selected ? (
            <Box sx={{ flex:1,display:'flex',overflow:'hidden',minWidth:0, }}>
              <CenterPanel project={selected} onDelete={handleDelete} />
              <RightPanel project={selected} onUpload={handleUpload} onRemoveFile={handleRemoveFile} onAddMember={handleAddMember} onRemoveMember={handleRemoveMember} />
            </Box>
          ) : (
            <Box sx={{ flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center', }}>
              <Box sx={{ color:isDark?'#222':'#d1d5db',display:'flex',mb:1.5 }}><IconEmpty /></Box>
              <Typography sx={{ fontSize:'0.85rem',color:isDark?'#444':'#6b7280',fontWeight:500,mb:0.3 }}>Select a project</Typography>
              <Typography sx={{ fontSize:'0.7rem',color:isDark?'#333':'#9ca3af' }}>Choose from the left or create a new one</Typography>
            </Box>
          )}
        </Box>
      </Box>
      <CreateProjectModal open={createOpen} onClose={()=>setCreateOpen(false)} onCreate={handleCreate} />
    </Box>
  );
}