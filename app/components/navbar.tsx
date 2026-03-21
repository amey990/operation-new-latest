'use client';

import {
  Box, Typography, TextField, IconButton,
  Avatar, Badge, InputAdornment, Menu, MenuItem,
} from '@mui/material';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useColorMode } from '../../theme/ThemeRegistry';

const PURPLE = '#783CB4';
const SIDEBAR_EXPANDED  = 260;
const SIDEBAR_COLLAPSED = 70;

// ── Icons ─────────────────────────────────────
function SearchIcon({ color = '#555' }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>;
}
function ChevronDownIcon({ color = '#666' }) {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>;
}
function FolderIcon({ color = '#777' }) {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>;
}
function BellIcon({ color = '#888' }: { color?: string }) {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>;
}
function SettingsIcon({ color = '#888' }: { color?: string }) {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
}
function GlobeIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
}
function ClockIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
}
function NotifBellIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>;
}
function CheckIcon() {
  return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
}
function AlertIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
}
function TicketIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"/></svg>;
}
function BotIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>;
}
function ShieldIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
}

// ── Data ──────────────────────────────────────
const PROJECTS = [
  { id: 1, name: 'Network Operations' },
  { id: 2, name: 'Data Center A' },
  { id: 3, name: 'Cloud Infrastructure' },
];
const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Japanese'];
const TIMEZONES = ['UTC−8 (PST)', 'UTC−5 (EST)', 'UTC+0 (GMT)', 'UTC+1 (CET)', 'UTC+5:30 (IST)', 'UTC+8 (CST)', 'UTC+9 (JST)'];

const NOTIFICATIONS = [
  { id: 1, type: 'alert',   color: '#ef4444', icon: 'alert',  title: 'High packet loss detected',      desc: 'Site A — loss exceeds 2.1% threshold',      time: '2m ago',  unread: true  },
  { id: 2, type: 'ticket',  color: '#f59e0b', icon: 'ticket', title: 'Ticket #4821 assigned to you',    desc: 'Core switch reboot — Priority: High',       time: '14m ago', unread: true  },
  { id: 3, type: 'agent',   color: '#3b82f6', icon: 'bot',    title: 'Agent Monitor responded',         desc: 'Resolved 3 connectivity issues on DC-A',    time: '1h ago',  unread: true  },
  { id: 4, type: 'security',color: '#8b5cf6', icon: 'shield', title: 'Security scan complete',          desc: '2 low-severity findings · Patch needed',    time: '3h ago',  unread: false },
  { id: 5, type: 'alert',   color: '#ef4444', icon: 'alert',  title: 'Device offline: sw-core-02',      desc: 'Network Operations — last seen 3h ago',     time: '3h ago',  unread: false },
  { id: 6, type: 'ticket',  color: '#f59e0b', icon: 'ticket', title: 'Ticket #4819 resolved',           desc: 'Latency spike on Cloud Infra — closed',     time: '5h ago',  unread: false },
];

// ── Reusable outside-click hook ────────────────
function useOutsideClick(ref: React.RefObject<HTMLElement>, cb: () => void, active: boolean) {
  useEffect(() => {
    if (!active) return;
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) cb();
    };
    const t = setTimeout(() => document.addEventListener('mousedown', handle), 50);
    return () => { clearTimeout(t); document.removeEventListener('mousedown', handle); };
  }, [active, cb, ref]);
}

// ── Toggle Components ──────────────────────────
function GreenToggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <Box onClick={onChange} sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center', width: 52, height: 28, borderRadius: '14px', cursor: 'pointer', backgroundColor: checked ? PURPLE : '#e5e7eb', boxShadow: checked ? `inset 0 0 0 2px #5a2a8a` : 'inset 0 0 0 2px #d1d5db', transition: 'all 0.3s ease-in-out', flexShrink: 0, userSelect: 'none' }}>
      <Box sx={{ position: 'absolute', top: 3, left: 3, width: 22, height: 22, borderRadius: '50%', backgroundColor: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.25)', transition: 'transform 0.3s ease-in-out', transform: checked ? 'translateX(24px)' : 'translateX(0px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {checked
          ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
          : <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.5" strokeLinecap="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
        }
      </Box>
    </Box>
  );
}

function NotifProfileToggle({ value, onChange }: { value: 'on' | 'silent'; onChange: (v: 'on' | 'silent') => void }) {
  const { mode } = useColorMode();
  const isDark = mode === 'dark';
  const isOn = value === 'on';

  return (
    <Box
      sx={{
        position: 'relative', display: 'inline-flex', alignItems: 'center',
        width: '100%', height: 28, minWidth: 120,
        borderRadius: '14px', cursor: 'pointer',
        backgroundColor: isOn ? PURPLE : (isDark ? '#444' : '#d1d5db'),
        boxShadow: isOn ? `inset 0 0 0 2px #5a2a8a` : `inset 0 0 0 2px ${isDark ? '#3a3a3a' : '#9ca3af'}`,
        transition: 'background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        userSelect: 'none',
      }}
      onClick={() => onChange(isOn ? 'silent' : 'on')}
    >
      <Box sx={{
        position: 'absolute', top: 3, left: 3,
        width: 22, height: 22, borderRadius: '50%', backgroundColor: '#fff',
        boxShadow: isOn ? `0 2px 5px rgba(0,0,0,0.25), 0 0 0 2px ${PURPLE}55` : '0 2px 5px rgba(0,0,0,0.25)',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        transform: isOn ? 'translateX(0px)' : 'translateX(200px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {isOn
          ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={PURPLE} strokeWidth="2.5" strokeLinecap="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
          : <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.5" strokeLinecap="round"><line x1="1" y1="1" x2="23" y2="23"/><path d="M17 17H3s3-2 3-9a6 6 0 0 1 .34-2M13.73 4A6 6 0 0 1 18 8.27C18 14 21 17 21 17"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
        }
      </Box>
      <Typography sx={{
        position: 'absolute',
        right: isOn ? 10 : 'auto', left: isOn ? 'auto' : 10,
        fontSize: '0.65rem', fontWeight: 700, color: isOn ? '#fff' : (isDark ? '#fff' : '#4b5563'),
        letterSpacing: '0.04em', transition: 'all 0.3s',
        pointerEvents: 'none',
      }}>
        {isOn ? 'ON' : 'SILENT'}
      </Typography>
    </Box>
  );
}

function MiniSelect({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
  const { mode } = useColorMode();
  const isDark = mode === 'dark';
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref as React.RefObject<HTMLElement>, () => setOpen(false), open);

  const BG = isDark ? '#141414' : '#f9fafb';
  const BG_HOVER = isDark ? '#161616' : '#f3f4f6';
  const BORDER = isDark ? '#252525' : '#e5e7eb';
  const TEXT = isDark ? '#ccc' : '#111827';
  const MENU_BG = isDark ? '#0d0d0d' : '#ffffff';

  return (
    <Box ref={ref} sx={{ position: 'relative' }}>
      <Box onClick={() => setOpen(o => !o)} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, px: 1.4, py: 1, bgcolor: BG, border: `1px solid ${BORDER}`, borderRadius: '8px', cursor: 'pointer', transition: 'all 0.15s', '&:hover': { bgcolor: BG_HOVER } }}>
        <Typography sx={{ fontSize: '0.78rem', color: TEXT }}>{value}</Typography>
        <Box sx={{ color: '#555', display: 'flex', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}><ChevronDownIcon color="#555" /></Box>
      </Box>
      {open && (
        <Box sx={{ position: 'absolute', top: 'calc(100% + 5px)', left: 0, right: 0, bgcolor: MENU_BG, border: `1px solid ${BORDER}`, borderRadius: '9px', overflow: 'hidden', zIndex: 300, boxShadow: isDark ? '0 8px 28px rgba(0,0,0,0.8)' : '0 8px 24px rgba(0,0,0,0.1)', maxHeight: 180, overflowY: 'auto', '&::-webkit-scrollbar': { width: 3 }, '&::-webkit-scrollbar-thumb': { bgcolor: isDark ? '#2a2a2a' : '#cbd5e1', borderRadius: 2 } }}>
          {options.map(o => (
            <Box key={o} onClick={() => { onChange(o); setOpen(false); }} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1.4, py: 0.85, cursor: 'pointer', transition: 'background 0.12s', bgcolor: o === value ? `${PURPLE}12` : 'transparent', '&:hover': { bgcolor: isDark ? '#1c1c1c' : '#f3f4f6' } }}>
              <Typography sx={{ fontSize: '0.76rem', color: o === value ? PURPLE : (isDark ? '#bbb' : '#4b5563') }}>{o}</Typography>
              {o === value && <Box sx={{ color: PURPLE }}><CheckIcon /></Box>}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

function NIcon({ type }: { type: string }) {
  if (type === 'ticket') return <TicketIcon />;
  if (type === 'bot')    return <BotIcon />;
  if (type === 'shield') return <ShieldIcon />;
  return <AlertIcon />;
}

// ── Notifications Panel ────────────────────────
function NotificationsPanel({ onClose }: { onClose: () => void }) {
  const { mode } = useColorMode();
  const isDark = mode === 'dark';
  const BG = isDark ? '#0d0d0d' : '#ffffff';
  const BORDER = isDark ? '#1e1e1e' : '#e5e7eb';
  const BORDER_INNER = isDark ? '#181818' : '#f3f4f6';
  const TEXT_MAIN = isDark ? '#e0e0e0' : '#111827';
  const TEXT_MUTED = isDark ? '#444' : '#6b7280';
  const TEXT_DIM = isDark ? '#333' : '#9ca3af';
  const HOVER_BG = isDark ? '#141414' : '#f9fafb';

  const [items, setItems] = useState(NOTIFICATIONS);
  const unreadCount = items.filter(n => n.unread).length;

  const markAllRead = () => setItems(prev => prev.map(n => ({ ...n, unread: false })));
  const dismiss = (id: number) => setItems(prev => prev.filter(n => n.id !== id));

  return (
    <Box sx={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: 320, bgcolor: BG, border: `1px solid ${BORDER}`, borderRadius: '14px', zIndex: 200, boxShadow: isDark ? '0 20px 60px rgba(0,0,0,0.85)' : '0 10px 40px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.2, py: 1.6, borderBottom: `1px solid ${BORDER_INNER}` }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.9 }}>
          <Box sx={{ color: PURPLE }}><BellIcon color={PURPLE} /></Box>
          <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: TEXT_MAIN }}>Notifications</Typography>
          {unreadCount > 0 && (
            <Box sx={{ px: 0.8, py: 0.1, bgcolor: PURPLE, borderRadius: '5px' }}>
              <Typography sx={{ fontSize: '0.6rem', fontWeight: 800, color: '#fff' }}>{unreadCount}</Typography>
            </Box>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {unreadCount > 0 && (
            <Typography onClick={markAllRead} sx={{ fontSize: '0.65rem', color: TEXT_MUTED, cursor: 'pointer', '&:hover': { color: PURPLE } }}>Mark all read</Typography>
          )}
          <Box onClick={onClose} sx={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '5px', cursor: 'pointer', color: TEXT_DIM, transition: 'all 0.15s', '&:hover': { bgcolor: BORDER_INNER, color: TEXT_MUTED } }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </Box>
        </Box>
      </Box>

      <Box sx={{ maxHeight: 360, overflowY: 'auto', '&::-webkit-scrollbar': { width: 3 }, '&::-webkit-scrollbar-thumb': { bgcolor: isDark ? '#2a2a2a' : '#cbd5e1', borderRadius: 2 } }}>
        {items.length === 0 ? (
          <Box sx={{ py: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <Box sx={{ color: TEXT_DIM }}><BellIcon color={isDark ? "#2a2a2a" : "#d1d5db"} /></Box>
            <Typography sx={{ fontSize: '0.75rem', color: TEXT_DIM }}>All caught up</Typography>
          </Box>
        ) : items.map((n, i) => (
          <Box key={n.id} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.4, px: 2.2, py: 1.4, borderBottom: i < items.length - 1 ? `1px solid ${BORDER_INNER}` : 'none', bgcolor: n.unread ? `${n.color}06` : 'transparent', transition: 'background 0.15s', '&:hover': { bgcolor: HOVER_BG }, position: 'relative' }}>
            {n.unread && <Box sx={{ position: 'absolute', top: 18, left: 8, width: 4, height: 4, borderRadius: '50%', bgcolor: n.color, boxShadow: `0 0 6px ${n.color}` }} />}
            <Box sx={{ width: 30, height: 30, borderRadius: '8px', bgcolor: `${n.color}18`, border: `1px solid ${n.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: n.color, flexShrink: 0, mt: 0.2 }}>
              <NIcon type={n.icon} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: '0.78rem', fontWeight: n.unread ? 600 : 500, color: n.unread ? TEXT_MAIN : (isDark ? '#888' : '#4b5563'), mb: 0.3, lineHeight: 1.3 }}>{n.title}</Typography>
              <Typography sx={{ fontSize: '0.67rem', color: TEXT_MUTED, lineHeight: 1.4, mb: 0.4 }}>{n.desc}</Typography>
              <Typography sx={{ fontSize: '0.62rem', color: TEXT_DIM }}>{n.time}</Typography>
            </Box>
            <Box onClick={() => dismiss(n.id)} sx={{ color: TEXT_DIM, cursor: 'pointer', mt: 0.2, flexShrink: 0, '&:hover': { color: TEXT_MUTED } }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </Box>
          </Box>
        ))}
      </Box>

      <Box sx={{ px: 2.2, py: 1.2, borderTop: `1px solid ${BORDER_INNER}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography sx={{ fontSize: '0.66rem', color: TEXT_DIM, cursor: 'pointer', '&:hover': { color: PURPLE } }}>View all notifications</Typography>
      </Box>
    </Box>
  );
}

// ── Settings Panel ─────────────────────────────
function SettingsPanel({ onClose }: { onClose: () => void }) {
  const { mode } = useColorMode();
  const isDark = mode === 'dark';
  const BG = isDark ? '#0d0d0d' : '#ffffff';
  const BORDER = isDark ? '#1e1e1e' : '#e5e7eb';
  const BORDER_INNER = isDark ? '#181818' : '#f3f4f6';
  const TEXT_MAIN = isDark ? '#e0e0e0' : '#111827';
  const TEXT_MUTED = isDark ? '#444' : '#6b7280';
  const TEXT_DIM = isDark ? '#333' : '#9ca3af';

  const [language,     setLanguage]     = useState('English');
  const [timezone,     setTimezone]     = useState('UTC+5:30 (IST)');
  const [notifProfile, setNotifProfile] = useState<'on' | 'silent'>('on');

  const FieldLabel = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7, mb: 0.9 }}>
      {icon}
      <Typography sx={{ fontSize: '0.63rem', color: TEXT_MUTED, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.09em' }}>{label}</Typography>
    </Box>
  );

  return (
    <Box sx={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: 272, bgcolor: BG, border: `1px solid ${BORDER}`, borderRadius: '14px', zIndex: 200, boxShadow: isDark ? '0 20px 60px rgba(0,0,0,0.85)' : '0 10px 40px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.2, py: 1.6, borderBottom: `1px solid ${BORDER_INNER}` }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.9 }}>
          <Box sx={{ color: PURPLE }}><SettingsIcon color={PURPLE} /></Box>
          <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: TEXT_MAIN }}>Quick Settings</Typography>
        </Box>
        <Box onClick={onClose} sx={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '5px', cursor: 'pointer', color: TEXT_DIM, transition: 'all 0.15s', '&:hover': { bgcolor: BORDER_INNER, color: TEXT_MUTED } }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </Box>
      </Box>
      <Box sx={{ px: 2.2, py: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box>
          <FieldLabel icon={<GlobeIcon />} label="Language" />
          <MiniSelect value={language} options={LANGUAGES} onChange={setLanguage} />
        </Box>
        <Box>
          <FieldLabel icon={<ClockIcon />} label="Timezone" />
          <MiniSelect value={timezone} options={TIMEZONES} onChange={setTimezone} />
        </Box>
        <Box>
          <FieldLabel icon={<NotifBellIcon />} label="Notification Profile" />
          <NotifProfileToggle value={notifProfile} onChange={setNotifProfile} />
        </Box>
      </Box>
      <Box sx={{ px: 2.2, py: 1.2, borderTop: `1px solid ${BORDER_INNER}`, display: 'flex', alignItems: 'center', gap: 0.6 }}>
        <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: PURPLE, boxShadow: `0 0 6px ${PURPLE}` }} />
        <Typography sx={{ fontSize: '0.61rem', color: TEXT_DIM }}>Changes apply instantly</Typography>
      </Box>
    </Box>
  );
}

// ── Main Navbar Component ─────────────────────────────
export default function Navbar({ sidebarCollapsed }: { sidebarCollapsed: boolean }) {
  const router = useRouter();
  
  const { mode, toggleColorMode } = useColorMode();
  const isDarkMode = mode === 'dark';

  const BG = isDarkMode ? '#0a0a0a' : '#ffffff';
  const BORDER = isDarkMode ? '#1a1a1a' : '#e5e7eb';
  const TEXT_MAIN = isDarkMode ? '#ffffff' : '#111827';
  const TEXT_MUTED = isDarkMode ? '#888888' : '#6b7280';
  const INPUT_BG = isDarkMode ? '#111111' : '#f9fafb';
  const HOVER_BG = isDarkMode ? '#111111' : '#f3f4f6';
  const DROPDOWN_BG = isDarkMode ? '#0f0f0f' : '#ffffff';

  const [searchValue,     setSearchValue]     = useState('');
  const [projectAnchor,   setProjectAnchor]   = useState<null | HTMLElement>(null);
  const [selectedProject, setSelectedProject] = useState(PROJECTS[0]);
  const [notifOpen,       setNotifOpen]       = useState(false);
  const [settingsOpen,    setSettingsOpen]    = useState(false);

  const notifRef    = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  useOutsideClick(notifRef    as React.RefObject<HTMLElement>, () => setNotifOpen(false),    notifOpen);
  useOutsideClick(settingsRef as React.RefObject<HTMLElement>, () => setSettingsOpen(false), settingsOpen);

  const sidebarW = sidebarCollapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED;
  const unreadCount = 3;

  const dropdownSx = {
    background: DROPDOWN_BG, border: `1px solid ${BORDER}`, borderRadius: '10px', mt: 1, minWidth: 180,
    boxShadow: isDarkMode ? '0 8px 32px rgba(0,0,0,0.6)' : '0 8px 24px rgba(0,0,0,0.1)',
    '& .MuiMenuItem-root': {
      color: TEXT_MAIN, fontSize: '0.83rem', py: 1.1, px: 2, gap: 1.2, transition: 'background-color 0.15s, color 0.15s',
      '&:hover': { background: `${PURPLE}14`, color: isDarkMode ? '#fff' : '#000' },
      '&.Mui-selected': { background: `${PURPLE}1e` },
    },
  };

  const triggerSx = {
    display: 'flex', alignItems: 'center', gap: 1.2,
    px: 1.6, py: 0.75, borderRadius: '9px',
    background: 'transparent', border: `1px solid ${BORDER}`,
    cursor: 'pointer', transition: 'all 0.18s',
    '&:hover': { border: `1px solid ${isDarkMode ? '#2a2a2a' : '#d1d5db'}`, background: HOVER_BG },
  };

  return (
    <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 99, height: 64, background: BG, display: 'flex', alignItems: 'center', transition: 'background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease', '&::after': { content: '""', position: 'absolute', bottom: 0, left: `${sidebarW}px`, right: 0, height: '1px', backgroundColor: BORDER, transition: 'left 0.28s cubic-bezier(0.4,0,0.2,1), background-color 0.3s ease' } }}>
      <Box sx={{ width: sidebarW, flexShrink: 0, transition: 'width 0.28s cubic-bezier(0.4,0,0.2,1)' }} />

      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', px: 3, height: '100%', gap: 3 }}>

        {/* ── Search ── */}
        <TextField placeholder="Search..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)}
          sx={{
            width: 300,
            '& .MuiOutlinedInput-root': {
              background: INPUT_BG,
              borderRadius: '10px',
              height: 40,
              transition: 'background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease',
              '& input': {
                color: TEXT_MAIN,
                fontSize: '0.83rem',
                '&::placeholder': { color: TEXT_MUTED, opacity: 1 }
              },
              '& fieldset': { border: `1px solid ${BORDER}` },
              '&:hover fieldset': { border: `1px solid ${isDarkMode ? '#2a2a2a' : '#d1d5db'}` },
              '&.Mui-focused fieldset': { border: `1px solid ${PURPLE}66` }
            }
          }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon color={TEXT_MUTED} /></InputAdornment> }}
        />

        {/* ── Right side controls ── */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, flexShrink: 0 }}>

          {/* Project dropdown */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: '0.72rem', color: TEXT_MUTED, fontWeight: 500, whiteSpace: 'nowrap' }}>Select Project</Typography>
            <Box onClick={(e) => setProjectAnchor(e.currentTarget)} sx={triggerSx}>
              <FolderIcon color={TEXT_MUTED} />
              <Typography sx={{ fontSize: '0.83rem', color: TEXT_MAIN, fontWeight: 500, whiteSpace: 'nowrap' }}>{selectedProject.name}</Typography>
              <ChevronDownIcon color={TEXT_MUTED} />
            </Box>
          </Box>
          <Menu anchorEl={projectAnchor} open={Boolean(projectAnchor)} onClose={() => setProjectAnchor(null)} PaperProps={{ sx: dropdownSx }}>
            {PROJECTS.map((p) => (
              <MenuItem key={p.id} selected={p.id === selectedProject.id} onClick={() => { setSelectedProject(p); setProjectAnchor(null); }}>{p.name}</MenuItem>
            ))}
          </Menu>

          {/* Dark mode toggle */}
          <Box onClick={toggleColorMode} sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center', width: 52, height: 28, borderRadius: '14px', cursor: 'pointer', backgroundColor: isDarkMode ? PURPLE : '#e5e7eb', boxShadow: isDarkMode ? `inset 0 0 0 2px #5a2a8a` : 'inset 0 0 0 2px #d1d5db', transition: 'all 0.3s ease-in-out', flexShrink: 0, userSelect: 'none' }}>
            <Box sx={{ position: 'absolute', top: 3, left: 3, width: 22, height: 22, borderRadius: '50%', backgroundColor: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.25)', transition: 'transform 0.3s ease-in-out', transform: isDarkMode ? 'translateX(24px)' : 'translateX(0px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isDarkMode
                ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
                : <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.5" strokeLinecap="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
              }
            </Box>
          </Box>

          {/* Bell - Dropdown code restored here! */}
          <Box ref={notifRef} sx={{ position: 'relative' }}>
            <IconButton onClick={() => { setNotifOpen(o => !o); setSettingsOpen(false); }}
              sx={{ width: 38, height: 38, borderRadius: '9px', background: notifOpen ? `${PURPLE}12` : 'transparent', border: notifOpen ? `1px solid ${PURPLE}55` : `1px solid ${BORDER}`, transition: 'all 0.18s', '&:hover': { border: `1px solid ${PURPLE}55`, background: `${PURPLE}0e` } }}>
              <Badge badgeContent={unreadCount} sx={{ '& .MuiBadge-badge': { background: PURPLE, color: '#fff', fontSize: '0.58rem', fontWeight: 800, minWidth: 16, height: 16, top: -2, right: -2 } }}>
                <BellIcon color={notifOpen ? PURPLE : TEXT_MUTED} />
              </Badge>
            </IconButton>
            {notifOpen && <NotificationsPanel onClose={() => setNotifOpen(false)} />}
          </Box>

          {/* Settings - Dropdown code restored here! */}
          <Box ref={settingsRef} sx={{ position: 'relative' }}>
            <IconButton onClick={() => { setSettingsOpen(o => !o); setNotifOpen(false); }}
              sx={{ width: 38, height: 38, borderRadius: '9px', background: settingsOpen ? `${PURPLE}12` : 'transparent', border: settingsOpen ? `1px solid ${PURPLE}55` : `1px solid ${BORDER}`, transition: 'all 0.18s', '&:hover': { border: `1px solid ${PURPLE}55`, background: `${PURPLE}0e` }, '& svg': { transition: 'transform 0.45s cubic-bezier(0.34,1.56,0.64,1)', transform: settingsOpen ? 'rotate(90deg)' : 'rotate(0deg)' } }}>
              <SettingsIcon color={settingsOpen ? PURPLE : TEXT_MUTED} />
            </IconButton>
            {settingsOpen && <SettingsPanel onClose={() => setSettingsOpen(false)} />}
          </Box>

          {/* User */}
          <Box onClick={() => router.push('/pages/Userprofile')}
            sx={{ display: 'flex', alignItems: 'center', gap: 1.2, pl: 1.5, borderLeft: `1px solid ${BORDER}`, cursor: 'pointer', borderRadius: '10px', transition: 'all 0.18s', '&:hover': { '& .user-avatar': { boxShadow: `0 0 14px ${PURPLE}66` }, '& .user-name': { color: PURPLE } } }}>
            <Avatar className="user-avatar" sx={{ width: 34, height: 34, 
              background: `linear-gradient(135deg, ${PURPLE} 0%, #5a2a8a 100%)`,
              color: '#fff', fontWeight: 800, fontSize: '0.8rem', boxShadow: `0 0 10px ${PURPLE}44`, transition: 'box-shadow 0.2s' }}>U</Avatar>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Typography className="user-name" sx={{ fontSize: '0.78rem', fontWeight: 600, color: TEXT_MAIN, lineHeight: 1.2, transition: 'color 0.2s' }}>User Name</Typography>
              <Typography sx={{ fontSize: '0.68rem', color: TEXT_MUTED }}>Admin</Typography>
            </Box>
          </Box>

        </Box>
      </Box>
    </Box>
  );
}