'use client';

import React, { useState, useRef } from 'react';
import { Box, Typography, Avatar, IconButton, Divider } from '@mui/material';
import Sidebar from '../../components/sidebar';
import Navbar from '../../components/navbar';
import { useColorMode } from '../../../theme/ThemeRegistry';

const PURPLE = '#783CB4'; // Updated brand color
const SIDEBAR_EXPANDED = 260;
const SIDEBAR_COLLAPSED = 70;

// ── Icons ──────────────────────────────────────────────────────────────
function CameraIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}
function EditIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}
function SaveIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function LockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
function FolderIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
    </svg>
  );
}

// ── Editable Field ─────────────────────────────────────────────────────
function Field({
  label, value, icon, readonly = false, onChange,
}: {
  label: string; value: string; icon: React.ReactNode;
  readonly?: boolean; onChange?: (v: string) => void;
}) {
  const { mode } = useColorMode();
  const isDark = mode === 'dark';
  const [editing, setEditing] = useState(false);
  const [local, setLocal] = useState(value);

  const handleSave = () => { onChange?.(local); setEditing(false); };
  const handleKey = (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') { setLocal(value); setEditing(false); } };

  return (
    <Box sx={{ mb: 2.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 0.8 }}>
        <Box sx={{ color: isDark ? '#444' : '#9ca3af' }}>{icon}</Box>
        <Typography sx={{ fontSize: '0.65rem', color: isDark ? '#444' : '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</Typography>
        {readonly && <Box sx={{ color: isDark ? '#444' : '#9ca3af', display: 'flex' }}><LockIcon /></Box>}
      </Box>
      <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {editing ? (
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 1 }}>
            <input
              autoFocus
              value={local}
              onChange={e => setLocal(e.target.value)}
              onKeyDown={handleKey}
              style={{
                flex: 1, background: isDark ? '#141414' : '#ffffff', border: `1px solid ${PURPLE}66`,
                borderRadius: 8, padding: '10px 14px', color: isDark ? '#e0e0e0' : '#111827',
                fontSize: '0.85rem', outline: 'none', fontFamily: 'inherit',
              }}
            />
            <IconButton onClick={handleSave} sx={{ width: 34, height: 34, bgcolor: `${PURPLE}20`, border: `1px solid ${PURPLE}44`, color: PURPLE, borderRadius: '8px', '&:hover': { bgcolor: `${PURPLE}30` } }}>
              <SaveIcon />
            </IconButton>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', px: 1.8, py: 1.2, bgcolor: isDark ? '#111' : '#f9fafb', border: `1px solid ${isDark ? '#1a1a1a' : '#e5e7eb'}`, borderRadius: '9px', cursor: readonly ? 'default' : 'pointer', transition: 'all 0.18s', '&:hover': readonly ? {} : { border: `1px solid ${isDark ? '#2a2a2a' : '#d1d5db'}`, bgcolor: isDark ? '#131313' : '#f3f4f6' } }}
            onClick={() => !readonly && setEditing(true)}
          >
            <Typography sx={{ fontSize: '0.85rem', color: readonly ? (isDark ? '#555' : '#9ca3af') : (isDark ? '#ccc' : '#111827'), fontWeight: 500 }}>{value}</Typography>
            {!readonly && (
              <Box sx={{ color: isDark ? '#3a3a3a' : '#9ca3af', display: 'flex', opacity: 0.6 }}><EditIcon /></Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}

// ── Page ───────────────────────────────────────────────────────────────
export default function UserProfilePage(): React.ReactElement {
  const { mode } = useColorMode();
  const isDark = mode === 'dark';

  const [sc, setSc] = useState(false);
  const sw = sc ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED;

  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const [name, setName] = useState('User Name');
  const [contact, setContact] = useState('+1 (555) 000-1234');
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setAvatarSrc(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const projects = ['Network Operations', 'Data Center A', 'Cloud Infrastructure'];
  const email = 'user@commedia.io';
  const username = 'user_name';
  const role = 'Admin';

  
  const CARD_BG = isDark ? '#0f0f0f' : '#ffffff';
  const BORDER = isDark ? '#1a1a1a' : '#e5e7eb';
  const TEXT_MAIN = isDark ? '#e8e8e8' : '#111827';
  const TEXT_MUTED = isDark ? '#555' : '#6b7280';

  return (
    <Box sx={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden', }}>
      <Sidebar onCollapseChange={setSc} />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', marginLeft: `${sw}px`, transition: 'margin-left 0.28s cubic-bezier(0.4,0,0.2,1)' }}>
        <Navbar sidebarCollapsed={sc} />

        <Box sx={{
          flex: 1, overflowY: 'auto', pt: '64px', px: 3.5, pb: 5,
          '&::-webkit-scrollbar': { width: 4 }, '&::-webkit-scrollbar-thumb': { bgcolor: isDark ? '#1e1e1e' : '#cbd5e1', borderRadius: 2 }
        }}>

          {/* Header */}
          <Box sx={{ pt: 3, pb: 3, borderBottom: `1px solid ${BORDER}`, mb: 3 }}>
            <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: TEXT_MAIN, mb: 0.3 }}>User Profile</Typography>
            <Typography sx={{ fontSize: '0.7rem', color: TEXT_MUTED }}>Manage your personal information, contact details and project access</Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '300px 1fr' }, gap: 2.5, alignItems: 'start' }}>

            {/* ── Left panel ── */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

              {/* Avatar card */}
              <Box sx={{ bgcolor: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '14px', p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <Avatar
                    src={avatarSrc ?? undefined}
                    sx={{
                      width: 100, height: 100,
                      background: avatarSrc ? 'transparent' : `linear-gradient(135deg, ${PURPLE} 0%, #5a2a8a 100%)`,
                      color: '#fff', fontWeight: 800, fontSize: '2.2rem',
                      boxShadow: isDark ? `0 0 0 3px #0f0f0f, 0 0 0 5px ${PURPLE}44, 0 0 24px ${PURPLE}22` : `0 0 0 3px #ffffff, 0 0 0 5px ${PURPLE}22, 0 0 24px ${PURPLE}11`,
                    }}
                  >
                    {!avatarSrc && name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box
                    onClick={() => fileRef.current?.click()}
                    sx={{
                      position: 'absolute', bottom: 0, right: 0,
                      width: 30, height: 30, borderRadius: '50%',
                      bgcolor: isDark ? '#1a1a1a' : '#f3f4f6', border: `2px solid ${isDark ? '#0f0f0f' : '#ffffff'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: isDark ? '#888' : '#6b7280', cursor: 'pointer', transition: 'all 0.2s',
                      '&:hover': { bgcolor: PURPLE, color: '#fff' },
                    }}
                  >
                    <CameraIcon />
                  </Box>
                  <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} />
                </Box>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: TEXT_MAIN, mb: 0.3 }}>{name}</Typography>
                  <Typography sx={{ fontSize: '0.72rem', color: TEXT_MUTED }}>{email}</Typography>
                </Box>

                {/* Role chip - Updated to Purple */}
                <Box sx={{ px: 2, py: 0.6, borderRadius: '20px', bgcolor: `${PURPLE}18`, border: `1px solid ${PURPLE}33`, display: 'flex', alignItems: 'center', gap: 0.7 }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: PURPLE }} />
                  <Typography sx={{ fontSize: '0.72rem', color: PURPLE, fontWeight: 700 }}>{role}</Typography>
                </Box>

                <Typography
                  onClick={() => fileRef.current?.click()}
                  sx={{ fontSize: '0.68rem', color: TEXT_MUTED, cursor: 'pointer', textDecoration: 'underline', '&:hover': { color: PURPLE } }}
                >
                  Change profile photo
                </Typography>
              </Box>

              {/* Projects card */}
              <Box sx={{ bgcolor: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '14px', p: '18px 20px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7, mb: 1.8 }}>
                  <Box sx={{ color: isDark ? '#444' : '#9ca3af', display: 'flex' }}><FolderIcon /></Box>
                  <Typography sx={{ fontSize: '0.65rem', color: isDark ? '#444' : '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Projects</Typography>
                  <Box sx={{ ml: 'auto', px: 0.9, py: 0.15, borderRadius: '5px', bgcolor: isDark ? '#1a1a1a' : '#f3f4f6' }}>
                    <Typography sx={{ fontSize: '0.62rem', color: isDark ? '#666' : '#4b5563', fontWeight: 600 }}>{projects.length}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {projects.map(p => (
                    <Box key={p} sx={{ display: 'flex', alignItems: 'center', gap: 1.2, px: 1.4, py: 1, bgcolor: isDark ? '#111' : '#f9fafb', border: `1px solid ${BORDER}`, borderRadius: '8px' }}>
                      <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: PURPLE, flexShrink: 0, boxShadow: `0 0 6px ${PURPLE}88` }} />
                      <Typography sx={{ fontSize: '0.78rem', color: isDark ? '#888' : '#4b5563' }}>{p}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>

            {/* ── Right panel ── */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

              <Box sx={{ bgcolor: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '14px', p: '20px 24px' }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: isDark ? '#d0d0d0' : '#111827', mb: 0.4 }}>Personal Information</Typography>
                <Typography sx={{ fontSize: '0.65rem', color: TEXT_MUTED, mb: 2.5 }}>Update your name and contact details</Typography>

                <Field label="Full Name" value={name} icon={<Box sx={{ display: 'flex' }}><UserIcon /></Box>} onChange={setName} />
                <Field label="Contact" value={contact} icon={<Box sx={{ display: 'flex' }}><PhoneIcon /></Box>} onChange={setContact} />

                <Divider sx={{ borderColor: BORDER, my: 2.5 }} />

                <Field label="Email Address" value={email} icon={<Box sx={{ display: 'flex' }}><MailIcon /></Box>} readonly />
                <Field label="Username" value={username} icon={<Box sx={{ display: 'flex' }}><UserIcon /></Box>} readonly />
              </Box>

              <Box sx={{ bgcolor: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '14px', p: '20px 24px' }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: isDark ? '#d0d0d0' : '#111827', mb: 0.4 }}>Account Details</Typography>
                <Typography sx={{ fontSize: '0.65rem', color: TEXT_MUTED, mb: 2.5 }}>Your role and access level — managed by administrator</Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 0.8 }}>
                  <Box sx={{ color: isDark ? '#444' : '#9ca3af', display: 'flex' }}><ShieldIcon /></Box>
                  <Typography sx={{ fontSize: '0.65rem', color: isDark ? '#444' : '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Role</Typography>
                  <Box sx={{ color: isDark ? '#444' : '#9ca3af', display: 'flex' }}><LockIcon /></Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1.8, py: 1.5, bgcolor: isDark ? '#111' : '#f9fafb', border: `1px solid ${BORDER}`, borderRadius: '9px', mb: 2.5 }}>
                  {/* Admin Box - Updated to Purple */}
                  <Box sx={{ width: 32, height: 32, borderRadius: '8px', bgcolor: `${PURPLE}18`, border: `1px solid ${PURPLE}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: PURPLE }}>
                    <ShieldIcon />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '0.85rem', color: isDark ? '#ddd' : '#111827', fontWeight: 700 }}>{role}</Typography>
                    <Typography sx={{ fontSize: '0.65rem', color: TEXT_MUTED }}>Full access to all modules</Typography>
                  </Box>
                  {/* Active Status Box - Updated to Purple */}
                  <Box sx={{ ml: 'auto', px: 1.2, py: 0.4, borderRadius: '6px', bgcolor: `${PURPLE}15`, border: `1px solid ${PURPLE}30` }}>
                    <Typography sx={{ fontSize: '0.62rem', color: PURPLE, fontWeight: 700 }}>Active</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1.5 }}>
                  {[
                    { label: 'Projects', val: projects.length.toString() },
                    { label: 'Member Since', val: 'Jan 2024' },
                    { label: 'Last Active', val: 'Today' },
                  ].map(s => (
                    <Box key={s.label} sx={{ px: 1.6, py: 1.4, bgcolor: isDark ? '#111' : '#f9fafb', border: `1px solid ${BORDER}`, borderRadius: '9px', textAlign: 'center' }}>
                      <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: isDark ? '#ccc' : '#111827', lineHeight: 1, mb: 0.4 }}>{s.val}</Typography>
                      <Typography sx={{ fontSize: '0.62rem', color: TEXT_MUTED }}>{s.label}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}