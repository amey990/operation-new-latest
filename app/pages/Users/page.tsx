'use client';

import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import Sidebar from '../../components/sidebar';
import Navbar from '../../components/navbar';
import { useColorMode } from '../../../theme/ThemeRegistry';

// ── Theme tokens ───────────────────────────────────────────────────────
const PURPLE  = '#783CB4'; // Updated brand color
const SIDEBAR_EXPANDED  = 260;
const SIDEBAR_COLLAPSED = 70;

// ── All platform modules ───────────────────────────────────────────────
const ALL_MODULES = [
  { key: 'dashboard',  label: 'Dashboard',      note: 'Default for all' },
  { key: 'agents',     label: 'Agents',         note: '' },
  { key: 'knowledge',  label: 'Knowledge Center', note: '' },
  { key: 'analytics',  label: 'Analytics',      note: '' },
  { key: 'settings',   label: 'Settings',       note: '' },
  { key: 'users',      label: 'Users',          note: 'Admin only' },
  { key: 'reports',    label: 'Reports',        note: '' },
];

// ── All AI agents ──────────────────────────────────────────────────────
const ALL_AGENTS = [
  { key: 'monitor',      label: 'Monitor Agent',      color: '#ef4444' },
  { key: 'ticket',       label: 'Ticket Agent',       color: '#3b82f6' },
  { key: 'troubleshoot', label: 'Troubleshoot Agent', color: '#10b981' },
  { key: 'inform',       label: 'Inform Agent',       color: '#f59e0b' },
  { key: 'configure',    label: 'Configure Agent',    color: '#8b5cf6' },
  { key: 'packet',       label: 'Packet Agent',       color: '#ec4899' },
];

// ── Types ──────────────────────────────────────────────────────────────
interface RoleDef {
  id: string;
  name: string;
  color: string;
  modules: string[];
  agents: string[];
  isSystem?: boolean;
}

interface NewUserForm {
  fullName: string;
  username: string;
  email: string;
  roleId: string;
  project: string;
}

// ── Default built-in roles ─────────────────────────────────────────────
const DEFAULT_ROLES: RoleDef[] = [
  {
    id: 'super-admin', name: 'Super Admin', color: '#ef4444',
    modules: ALL_MODULES.map(m => m.key), agents: ALL_AGENTS.map(a => a.key), isSystem: true,
  },
  {
    id: 'admin', name: 'Admin', color: '#f97316',
    modules: ALL_MODULES.map(m => m.key), agents: ALL_AGENTS.map(a => a.key), isSystem: true,
  },
  {
    id: 'operator', name: 'Network Operator', color: PURPLE, // Updated to purple
    modules: ['dashboard', 'agents', 'knowledge', 'analytics', 'reports'],
    agents: ['monitor', 'ticket', 'troubleshoot', 'configure', 'packet'], isSystem: false,
  },
  {
    id: 'viewer', name: 'Read-Only Viewer', color: '#6b7280',
    modules: ['dashboard', 'agents', 'knowledge', 'analytics'],
    agents: ['monitor', 'ticket'], isSystem: false,
  },
];

const PROJECTS = ['Network Operations', 'West Region', 'East Region', 'North Region'];
const ROLE_COLORS_PALETTE = [PURPLE,'#3b82f6','#f59e0b','#8b5cf6','#ec4899','#ef4444','#f97316','#10b981']; // Updated first color

// ── SVG Icons ──────────────────────────────────────────────────────────
const IconPlus   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>;
const IconClose  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>;
const IconCheck  = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IconEdit   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IconTrash  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>;
const IconLink   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>;
const IconCopy   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>;
const IconUser   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IconShield = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;

// ── Reusable toggle checkbox ───────────────────────────────────────────
function PermToggle({ checked, onChange, accentColor = PURPLE, disabled = false }: {
  checked: boolean; onChange: () => void; accentColor?: string; disabled?: boolean;
}) {
  const { mode } = useColorMode();
  const isDark = mode === 'dark';
  
  return (
    <Box onClick={disabled ? undefined : onChange} sx={{
      width: 22, height: 22, borderRadius: '6px', flexShrink: 0,
      border: `1.5px solid ${checked ? accentColor : (isDark ? '#333' : '#d1d5db')}`,
      background: checked ? `${accentColor}25` : (isDark ? '#181818' : '#f9fafb'),
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      color: accentColor,
      transition: 'all 0.15s',
      '&:hover': disabled ? {} : { borderColor: accentColor, background: `${accentColor}18` },
    }}>
      {checked && <IconCheck />}
    </Box>
  );
}

// ── Input field ────────────────────────────────────────────────────────
function Field({ label, value, onChange, type = 'text', placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  const { mode } = useColorMode();
  const isDark = mode === 'dark';
  
  return (
    <Box>
      <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: isDark ? '#888' : '#6b7280', textTransform: 'uppercase', letterSpacing: '0.09em', mb: 1 }}>
        {label}
      </Typography>
      <input
        type={type} value={value} placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: '100%', boxSizing: 'border-box', fontFamily: 'inherit',
          background: isDark ? '#161616' : '#f9fafb', 
          border: `1px solid ${focused ? PURPLE : (isDark ? '#2a2a2a' : '#e5e7eb')}`,
          borderRadius: 8, padding: '11px 14px', 
          color: isDark ? '#fff' : '#111827', 
          fontSize: '0.9rem',
          outline: 'none', transition: 'border-color 0.15s',
        }}
      />
    </Box>
  );
}

// ── Role Builder Modal ─────────────────────────────────────────────────
function RoleBuilderModal({ onClose, onSave, editing }: {
  onClose: () => void; onSave: (r: RoleDef) => void; editing?: RoleDef;
}) {
  const { mode } = useColorMode();
  const isDark = mode === 'dark';
  
  const [name,    setName]    = useState(editing?.name   ?? '');
  const [color,   setColor]   = useState(editing?.color  ?? PURPLE);
  const [modules, setModules] = useState<string[]>(editing?.modules ?? ['dashboard']);
  const [agents,  setAgents]  = useState<string[]>(editing?.agents  ?? []);

  const toggleModule = (key: string) => {
    if (key === 'dashboard' || key === 'users') return;
    setModules(p => p.includes(key) ? p.filter(k => k !== key) : [...p, key]);
  };
  const toggleAgent = (key: string) => setAgents(p => p.includes(key) ? p.filter(k => k !== key) : [...p, key]);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ id: editing?.id ?? `role-${Date.now()}`, name: name.trim(), color, modules: [...new Set(['dashboard', ...modules])], agents, isSystem: false });
    onClose();
  };

  const valid = name.trim().length > 0;

  const MODAL_BG = isDark ? '#111111' : '#ffffff';
  const BORDER = isDark ? '#222222' : '#e5e7eb';
  const TEXT_MAIN = isDark ? '#fff' : '#111827';
  const TEXT_MUTED = isDark ? '#666' : '#6b7280';
  const ROW_BG = isDark ? '#161616' : '#f9fafb';

  return (
    <Box sx={{ position: 'fixed', inset: 0, zIndex: 9998, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.7)', backdropFilter: 'blur(6px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <Box sx={{ width: 580, maxHeight: '88vh', overflowY: 'auto', background: MODAL_BG, border: `1px solid ${BORDER}`, borderRadius: '16px', display: 'flex', flexDirection: 'column', '&::-webkit-scrollbar': { width: 4 }, '&::-webkit-scrollbar-thumb': { bgcolor: isDark ? '#333' : '#cbd5e1', borderRadius: 2 } }}>

        {/* Header */}
        <Box sx={{ p: '22px 26px', borderBottom: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography sx={{ fontSize: '1rem', fontWeight: 800, color: TEXT_MAIN }}>{editing ? 'Edit Role' : 'Create New Role'}</Typography>
            <Typography sx={{ fontSize: '0.78rem', color: TEXT_MUTED, mt: 0.4 }}>Define module access and agent permissions</Typography>
          </Box>
          <Box onClick={onClose} sx={{ color: TEXT_MUTED, cursor: 'pointer', '&:hover': { color: TEXT_MAIN }, display: 'flex', transition: 'color 0.15s' }}><IconClose /></Box>
        </Box>

        <Box sx={{ p: '22px 26px', display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Name */}
          <Field label="Role Name" value={name} onChange={setName} placeholder="e.g. NOC Engineer" />

          {/* Color */}
          <Box>
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: isDark ? '#888' : '#6b7280', textTransform: 'uppercase', letterSpacing: '0.09em', mb: 1 }}>Role Color</Typography>
            <Box sx={{ display: 'flex', gap: 1.2, flexWrap: 'wrap' }}>
              {ROLE_COLORS_PALETTE.map(c => (
                <Box key={c} onClick={() => setColor(c)} sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: c, cursor: 'pointer', border: color === c ? (isDark ? '2.5px solid #fff' : '2.5px solid #000') : '2.5px solid transparent', boxShadow: color === c ? `0 0 0 1.5px ${c}` : 'none', transition: 'all 0.15s' }} />
              ))}
            </Box>
          </Box>

          <Box sx={{ height: '1px', bgcolor: BORDER }} />

          {/* Modules */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.4 }}>
              <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: isDark ? '#888' : '#6b7280', textTransform: 'uppercase', letterSpacing: '0.09em' }}>Module Access</Typography>
              <Typography sx={{ fontSize: '0.72rem', color: TEXT_MUTED }}>{modules.length}/{ALL_MODULES.length} selected</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
              {ALL_MODULES.map(mod => {
                const locked  = mod.key === 'dashboard' || mod.key === 'users';
                const checked = modules.includes(mod.key) || locked;
                return (
                  <Box key={mod.key} onClick={locked ? undefined : () => toggleModule(mod.key)} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: '11px 14px', borderRadius: 2, background: checked ? `${PURPLE}0a` : ROW_BG, border: `1px solid ${checked ? `${PURPLE}28` : (isDark ? '#222' : '#e5e7eb')}`, cursor: locked ? 'not-allowed' : 'pointer', transition: 'all 0.15s', '&:hover': locked ? {} : { borderColor: `${PURPLE}40`, background: `${PURPLE}10` } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <PermToggle checked={checked} onChange={() => toggleModule(mod.key)} disabled={locked} />
                      <Typography sx={{ fontSize: '0.85rem', color: checked ? (isDark ? '#ddd' : '#111827') : TEXT_MUTED, fontWeight: checked ? 600 : 400 }}>{mod.label}</Typography>
                    </Box>
                    {mod.note && (
                      <Box sx={{ px: 1, py: 0.3, borderRadius: '4px', background: isDark ? '#1e1e1e' : '#e5e7eb', border: `1px solid ${isDark ? '#2a2a2a' : '#d1d5db'}` }}>
                        <Typography sx={{ fontSize: '0.65rem', color: TEXT_MUTED }}>{mod.note}</Typography>
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Box>
          </Box>

          <Box sx={{ height: '1px', bgcolor: BORDER }} />

          {/* Agents */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.4 }}>
              <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: isDark ? '#888' : '#6b7280', textTransform: 'uppercase', letterSpacing: '0.09em' }}>Agent Access</Typography>
              <Typography sx={{ fontSize: '0.72rem', color: TEXT_MUTED }}>{agents.length}/{ALL_AGENTS.length} selected</Typography>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.8 }}>
              {ALL_AGENTS.map(agent => {
                const checked = agents.includes(agent.key);
                return (
                  <Box key={agent.key} onClick={() => toggleAgent(agent.key)} sx={{ display: 'flex', alignItems: 'center', gap: 1.2, p: '11px 14px', borderRadius: 2, background: checked ? `${agent.color}0a` : ROW_BG, border: `1px solid ${checked ? `${agent.color}30` : (isDark ? '#222' : '#e5e7eb')}`, cursor: 'pointer', transition: 'all 0.15s', '&:hover': { borderColor: `${agent.color}50`, background: `${agent.color}10` } }}>
                    <PermToggle checked={checked} onChange={() => toggleAgent(agent.key)} accentColor={agent.color} />
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: agent.color, flexShrink: 0 }} />
                    <Typography sx={{ fontSize: '0.82rem', color: checked ? (isDark ? '#ddd' : '#111827') : TEXT_MUTED, fontWeight: checked ? 600 : 400 }}>{agent.label.replace(' Agent', '')}</Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ p: '18px 26px', borderTop: `1px solid ${BORDER}`, display: 'flex', gap: 1.5 }}>
          <Box onClick={onClose} sx={{ flex: 1, py: 1.2, borderRadius: 2, border: `1px solid ${isDark ? '#2a2a2a' : '#d1d5db'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isDark ? '#888' : '#4b5563', fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.15s', '&:hover': { borderColor: isDark ? '#3a3a3a' : '#9ca3af', color: isDark ? '#ccc' : '#111827', bgcolor: isDark ? 'transparent' : '#f3f4f6' } }}>Cancel</Box>
          <Box onClick={handleSave} sx={{ flex: 1, py: 1.2, borderRadius: 2, cursor: valid ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', background: valid ? PURPLE : (isDark ? '#1a1a1a' : '#e5e7eb'), color: valid ? '#fff' : (isDark ? '#444' : '#9ca3af'), fontSize: '0.85rem', fontWeight: 800, transition: 'all 0.15s', '&:hover': valid ? { filter: 'brightness(1.1)' } : {} }}>
            {editing ? 'Save Changes' : 'Create Role'}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

// ── Create User Modal ──────────────────────────────────────────────────
function CreateUserModal({ roles, onClose }: { roles: RoleDef[]; onClose: () => void }) {
  const { mode } = useColorMode();
  const isDark = mode === 'dark';

  const [form, setForm] = useState<NewUserForm>({ fullName: '', username: '', email: '', roleId: '', project: PROJECTS[0] });
  const [inviteLink, setInviteLink] = useState('');
  const [copied, setCopied]         = useState(false);
  const [step, setStep]             = useState<'form' | 'done'>('form');

  const set = (key: keyof NewUserForm, val: string) => setForm(p => ({ ...p, [key]: val }));
  const selectedRole = roles.find(r => r.id === form.roleId);
  const valid = !!(form.fullName && form.username && form.email && form.roleId);

  const handleGenerate = () => {
    if (!valid) return;
    setInviteLink(`https://app.commedia.io/invite/${Math.random().toString(36).slice(2, 12)}`);
    setStep('done');
  };

  const copy = () => { navigator.clipboard.writeText(inviteLink); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const MODAL_BG = isDark ? '#111111' : '#ffffff';
  const BORDER = isDark ? '#222222' : '#e5e7eb';
  const TEXT_MAIN = isDark ? '#fff' : '#111827';
  const TEXT_MUTED = isDark ? '#666' : '#6b7280';
  const ROW_BG = isDark ? '#161616' : '#f9fafb';

  return (
    <Box sx={{ position: 'fixed', inset: 0, zIndex: 9998, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.7)', backdropFilter: 'blur(6px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <Box sx={{ width: 540, maxHeight: '88vh', overflowY: 'auto', background: MODAL_BG, border: `1px solid ${BORDER}`, borderRadius: '16px', '&::-webkit-scrollbar': { width: 4 }, '&::-webkit-scrollbar-thumb': { bgcolor: isDark ? '#333' : '#cbd5e1', borderRadius: 2 } }}>

        {/* Header */}
        <Box sx={{ p: '22px 26px', borderBottom: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography sx={{ fontSize: '1rem', fontWeight: 800, color: TEXT_MAIN }}>Create New User</Typography>
            <Typography sx={{ fontSize: '0.78rem', color: TEXT_MUTED, mt: 0.4 }}>Fill in details to provision access</Typography>
          </Box>
          <Box onClick={onClose} sx={{ color: TEXT_MUTED, cursor: 'pointer', '&:hover': { color: TEXT_MAIN }, display: 'flex', transition: 'color 0.15s' }}><IconClose /></Box>
        </Box>

        {step === 'form' ? (
          <Box sx={{ p: '22px 26px', display: 'flex', flexDirection: 'column', gap: 2.2 }}>
            <Field label="Full Name"     value={form.fullName} onChange={v => set('fullName', v)} placeholder="e.g. Sarah Chen" />
            <Field label="Username"      value={form.username} onChange={v => set('username', v)} placeholder="e.g. sarah.chen" />
            <Field label="Email Address" value={form.email}    onChange={v => set('email', v)}    placeholder="e.g. sarah@company.com" type="email" />

            {/* Role selector */}
            <Box>
              <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: isDark ? '#888' : '#6b7280', textTransform: 'uppercase', letterSpacing: '0.09em', mb: 1 }}>Role</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.7 }}>
                {roles.map(role => {
                  const active = form.roleId === role.id;
                  return (
                    <Box key={role.id} onClick={() => set('roleId', role.id)} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: '11px 14px', borderRadius: 2, cursor: 'pointer', background: active ? `${role.color}12` : ROW_BG, border: `1px solid ${active ? `${role.color}40` : (isDark ? '#222' : '#e5e7eb')}`, transition: 'all 0.15s', '&:hover': { borderColor: `${role.color}40`, background: `${role.color}0a` } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.4 }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: role.color, boxShadow: active ? `0 0 8px ${role.color}88` : 'none' }} />
                        <Typography sx={{ fontSize: '0.88rem', color: active ? TEXT_MAIN : isDark ? '#888' : '#4b5563', fontWeight: active ? 700 : 400 }}>{role.name}</Typography>
                      </Box>
                      {active && <Box sx={{ color: role.color, display: 'flex' }}><IconCheck /></Box>}
                    </Box>
                  );
                })}
              </Box>
            </Box>

            {/* Project */}
            <Box>
              <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: isDark ? '#888' : '#6b7280', textTransform: 'uppercase', letterSpacing: '0.09em', mb: 1 }}>Project / Scope</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                {PROJECTS.map(p => {
                  const active = form.project === p;
                  return (
                    <Box key={p} onClick={() => set('project', p)} sx={{ px: 1.6, py: 0.8, borderRadius: 2, cursor: 'pointer', fontSize: '0.82rem', background: active ? `${PURPLE}18` : ROW_BG, border: `1px solid ${active ? `${PURPLE}45` : (isDark ? '#222' : '#e5e7eb')}`, color: active ? PURPLE : (isDark ? '#777' : '#4b5563'), fontWeight: active ? 700 : 400, transition: 'all 0.15s' }}>
                      {p}
                    </Box>
                  );
                })}
              </Box>
            </Box>

            {/* Permissions preview */}
            {selectedRole && (
              <>
                <Box sx={{ height: '1px', bgcolor: BORDER }} />
                <Box>
                  <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: isDark ? '#888' : '#6b7280', textTransform: 'uppercase', letterSpacing: '0.09em', mb: 1.2 }}>Permissions for this role</Typography>

                  <Typography sx={{ fontSize: '0.68rem', color: TEXT_MUTED, mb: 0.8, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Modules</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6, mb: 1.5 }}>
                    {ALL_MODULES.map(mod => {
                      const has = selectedRole.modules.includes(mod.key);
                      return (
                        <Box key={mod.key} sx={{ px: 1.2, py: 0.4, borderRadius: '5px', fontSize: '0.78rem', fontWeight: 600, background: has ? `${PURPLE}18` : ROW_BG, border: `1px solid ${has ? `${PURPLE}35` : (isDark ? '#222' : '#e5e7eb')}`, color: has ? PURPLE : (isDark ? '#3a3a3a' : '#9ca3af') }}>{mod.label}</Box>
                      );
                    })}
                  </Box>

                  <Typography sx={{ fontSize: '0.68rem', color: TEXT_MUTED, mb: 0.8, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Agents</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6 }}>
                    {ALL_AGENTS.map(agent => {
                      const has = selectedRole.agents.includes(agent.key);
                      return (
                        <Box key={agent.key} sx={{ display: 'flex', alignItems: 'center', gap: 0.6, px: 1.2, py: 0.4, borderRadius: '5px', fontSize: '0.78rem', fontWeight: 600, background: has ? `${agent.color}14` : ROW_BG, border: `1px solid ${has ? `${agent.color}35` : (isDark ? '#222' : '#e5e7eb')}`, color: has ? agent.color : (isDark ? '#3a3a3a' : '#9ca3af') }}>
                          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: has ? agent.color : (isDark ? '#333' : '#d1d5db') }} />
                          {agent.label.replace(' Agent', '')}
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              </>
            )}

            {/* Footer */}
            <Box sx={{ display: 'flex', gap: 1.5, pt: 0.5 }}>
              <Box onClick={onClose} sx={{ flex: 1, py: 1.2, borderRadius: 2, border: `1px solid ${isDark ? '#2a2a2a' : '#d1d5db'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isDark ? '#888' : '#4b5563', fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.15s', '&:hover': { borderColor: isDark ? '#3a3a3a' : '#9ca3af', color: isDark ? '#ccc' : '#111827', bgcolor: isDark ? 'transparent' : '#f3f4f6' } }}>Cancel</Box>
              <Box onClick={handleGenerate} sx={{ flex: 1, py: 1.2, borderRadius: 2, cursor: valid ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.8, background: valid ? PURPLE : (isDark ? '#1a1a1a' : '#e5e7eb'), color: valid ? '#fff' : (isDark ? '#444' : '#9ca3af'), fontSize: '0.85rem', fontWeight: 800, transition: 'all 0.15s', '&:hover': valid ? { filter: 'brightness(1.1)' } : {} }}>
                <IconLink /> Generate Invite Link
              </Box>
            </Box>
          </Box>
        ) : (
          /* Done step */
          <Box sx={{ p: '32px 26px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2.5 }}>
            <Box sx={{ width: 60, height: 60, borderRadius: '50%', background: `${PURPLE}18`, border: `1px solid ${PURPLE}45`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: PURPLE, fontSize: '1.6rem', fontWeight: 800 }}>✓</Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography sx={{ fontSize: '1rem', fontWeight: 800, color: TEXT_MAIN, mb: 0.5 }}>Invite Link Generated</Typography>
              <Typography sx={{ fontSize: '0.82rem', color: isDark ? '#777' : '#4b5563' }}>Share this link with <Box component="span" sx={{ color: TEXT_MAIN, fontWeight: 600 }}>{form.fullName}</Box> to provision access</Typography>
            </Box>

            {/* Summary card */}
            <Box sx={{ width: '100%', p: '16px 18px', borderRadius: 2, background: ROW_BG, border: `1px solid ${isDark ? '#222' : '#e5e7eb'}`, display: 'flex', flexDirection: 'column', gap: 0.9 }}>
              {[['Name', form.fullName], ['Username', form.username], ['Email', form.email], ['Role', roles.find(r => r.id === form.roleId)?.name ?? ''], ['Project', form.project]].map(([label, val]) => (
                <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: '0.78rem', color: TEXT_MUTED }}>{label}</Typography>
                  <Typography sx={{ fontSize: '0.78rem', color: isDark ? '#ccc' : '#111827', fontWeight: 600 }}>{val}</Typography>
                </Box>
              ))}
            </Box>

            {/* Invite link */}
            <Box sx={{ width: '100%', p: '12px 14px', borderRadius: 2, background: `${PURPLE}0a`, border: `1px solid ${PURPLE}28`, display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <Box sx={{ color: PURPLE, display: 'flex', flexShrink: 0 }}><IconLink /></Box>
              <Typography sx={{ fontSize: '0.75rem', color: isDark ? '#888' : '#4b5563', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inviteLink}</Typography>
              <Box onClick={copy} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', px: 1.3, py: 0.6, borderRadius: 1.5, background: copied ? `${PURPLE}22` : (isDark ? '#222' : '#e5e7eb'), color: copied ? PURPLE : (isDark ? '#888' : '#4b5563'), fontSize: '0.75rem', fontWeight: 700, flexShrink: 0, transition: 'all 0.15s', '&:hover': !copied ? { bgcolor: isDark ? '#333' : '#d1d5db' } : {} }}>
                <IconCopy /> {copied ? 'Copied!' : 'Copy'}
              </Box>
            </Box>

            <Box onClick={onClose} sx={{ width: '100%', py: 1.2, borderRadius: 2, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: PURPLE, color: '#fff', fontSize: '0.88rem', fontWeight: 800, '&:hover': { filter: 'brightness(1.1)' }, transition: 'filter 0.15s' }}>Done</Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}

// ── Roles list panel ───────────────────────────────────────────────────
function RolesPanel({ roles, onEdit, onDelete, onCreateRole }: {
  roles: RoleDef[]; onEdit: (r: RoleDef) => void; onDelete: (id: string) => void; onCreateRole: () => void;
}) {
  const { mode } = useColorMode();
  const isDark = mode === 'dark';
  
  const CARD_BG = isDark ? '#111111' : '#ffffff';
  const BORDER = isDark ? '#222222' : '#e5e7eb';
  const TEXT_MAIN = isDark ? '#fff' : '#111827';
  const TEXT_MUTED = isDark ? '#666' : '#6b7280';
  const ROW_BG = isDark ? '#161616' : '#f9fafb';

  return (
    <Box sx={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '14px', mb: 2.5, transition: 'all 0.3s ease' }}>
      <Box sx={{ p: '18px 22px', borderBottom: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography sx={{ fontSize: '0.92rem', fontWeight: 800, color: TEXT_MAIN }}>Roles</Typography>
          <Typography sx={{ fontSize: '0.78rem', color: TEXT_MUTED, mt: 0.4 }}>{roles.length} roles — controls what each user can access</Typography>
        </Box>
        <Box onClick={onCreateRole} sx={{ display: 'flex', alignItems: 'center', gap: 0.8, cursor: 'pointer', px: 1.6, py: 0.8, borderRadius: 2, background: `${PURPLE}18`, border: `1px solid ${PURPLE}30`, color: PURPLE, fontSize: '0.8rem', fontWeight: 700, transition: 'all 0.15s', '&:hover': { background: `${PURPLE}28` } }}>
          <IconPlus /> New Role
        </Box>
      </Box>
      <Box sx={{ p: '14px 18px', display: 'flex', flexDirection: 'column', gap: 0.8 }}>
        {roles.map(role => (
          <Box key={role.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: '12px 16px', borderRadius: 2, background: ROW_BG, border: `1px solid ${isDark ? '#222' : '#e5e7eb'}`, transition: 'border-color 0.15s', '&:hover': { borderColor: `${role.color}35` } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 11, height: 11, borderRadius: '50%', bgcolor: role.color, boxShadow: `0 0 8px ${role.color}66`, flexShrink: 0 }} />
              <Box>
                <Typography sx={{ fontSize: '0.88rem', color: isDark ? '#ddd' : '#111827', fontWeight: 700 }}>{role.name}</Typography>
                <Typography sx={{ fontSize: '0.72rem', color: TEXT_MUTED, mt: 0.2 }}>{role.modules.length} modules · {role.agents.length} agents</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
              {role.isSystem
                ? <Box sx={{ px: 1, py: 0.35, borderRadius: '5px', background: isDark ? '#1e1e1e' : '#e5e7eb', border: `1px solid ${isDark ? '#2a2a2a' : '#d1d5db'}` }}><Typography sx={{ fontSize: '0.65rem', color: isDark ? '#555' : '#6b7280' }}>System</Typography></Box>
                : <>
                    <Box onClick={() => onEdit(role)} sx={{ color: isDark ? '#555' : '#9ca3af', cursor: 'pointer', p: 0.9, borderRadius: 1.5, '&:hover': { color: isDark ? '#bbb' : '#4b5563', bgcolor: isDark ? '#1e1e1e' : '#e5e7eb' }, display: 'flex', transition: 'all 0.15s' }}><IconEdit /></Box>
                    <Box onClick={() => onDelete(role.id)} sx={{ color: isDark ? '#555' : '#9ca3af', cursor: 'pointer', p: 0.9, borderRadius: 1.5, '&:hover': { color: '#ef4444', bgcolor: isDark ? '#1e1e1e' : '#fee2e2' }, display: 'flex', transition: 'all 0.15s' }}><IconTrash /></Box>
                  </>
              }
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

// ── Permission Matrix ──────────────────────────────────────────────────
function PermissionMatrix({ roles }: { roles: RoleDef[] }) {
  const { mode } = useColorMode();
  const isDark = mode === 'dark';
  
  const CARD_BG = isDark ? '#111111' : '#ffffff';
  const BORDER = isDark ? '#222222' : '#e5e7eb';
  const TEXT_MAIN = isDark ? '#fff' : '#111827';
  const TEXT_MUTED = isDark ? '#666' : '#6b7280';
  const HEADER_BG = isDark ? '#0d0d0d' : '#f9fafb';
  const ROW_BORDER = isDark ? '#181818' : '#e5e7eb';

  const tableHead = (
    <tr style={{ background: HEADER_BG }}>
      <th style={{ padding: '12px 22px', textAlign: 'left', fontSize: '0.68rem', color: isDark ? '#555' : '#6b7280', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', minWidth: 170, borderBottom: `1px solid ${isDark ? '#222' : '#e5e7eb'}` }} />
      {roles.map(role => (
        <th key={role.id} style={{ padding: '12px 16px', textAlign: 'center', borderBottom: `1px solid ${isDark ? '#222' : '#e5e7eb'}`, minWidth: 120 }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.6, px: 1.2, py: 0.5, borderRadius: '6px', background: `${role.color}18`, border: `1px solid ${role.color}30` }}>
            <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: role.color }} />
            <Typography sx={{ fontSize: '0.72rem', color: role.color, fontWeight: 800 }}>{role.name}</Typography>
          </Box>
        </th>
      ))}
    </tr>
  );

  return (
    <>
      {/* Module matrix */}
      <Box sx={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '14px', overflow: 'hidden', mb: 2.5, transition: 'all 0.3s ease' }}>
        <Box sx={{ p: '16px 22px', borderBottom: `1px solid ${BORDER}` }}>
          <Typography sx={{ fontSize: '0.92rem', fontWeight: 800, color: TEXT_MAIN }}>Module Access</Typography>
          <Typography sx={{ fontSize: '0.78rem', color: TEXT_MUTED, mt: 0.4 }}>Which platform modules each role can access</Typography>
        </Box>
        <Box sx={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>{tableHead}</thead>
            <tbody>
              {ALL_MODULES.map((mod, i) => (
                <tr key={mod.key} style={{ borderBottom: i < ALL_MODULES.length - 1 ? `1px solid ${ROW_BORDER}` : 'none' }}>
                  <td style={{ padding: '11px 22px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                      <Typography sx={{ fontSize: '0.85rem', color: isDark ? '#bbb' : '#4b5563', fontWeight: 500 }}>{mod.label}</Typography>
                      {mod.note && (
                        <Box sx={{ px: 0.8, py: 0.2, borderRadius: '4px', background: isDark ? '#1e1e1e' : '#e5e7eb', border: `1px solid ${isDark ? '#2a2a2a' : '#d1d5db'}` }}>
                          <Typography sx={{ fontSize: '0.62rem', color: isDark ? '#666' : '#6b7280' }}>{mod.note}</Typography>
                        </Box>
                      )}
                    </Box>
                  </td>
                  {roles.map(role => {
                    const has = role.modules.includes(mod.key);
                    return (
                      <td key={role.id} style={{ padding: '11px 16px', textAlign: 'center' }}>
                        {has
                          ? <Box sx={{ width: 22, height: 22, borderRadius: '6px', bgcolor: `${role.color}20`, border: `1px solid ${role.color}40`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: role.color }}><IconCheck /></Box>
                          : <Box sx={{ width: 22, height: 22, borderRadius: '6px', bgcolor: isDark ? '#161616' : '#f9fafb', border: `1px solid ${isDark ? '#222' : '#e5e7eb'}`, display: 'inline-flex', margin: 'auto' }} />
                        }
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Box>

      {/* Agent matrix */}
      <Box sx={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '14px', overflow: 'hidden', transition: 'all 0.3s ease' }}>
        <Box sx={{ p: '16px 22px', borderBottom: `1px solid ${BORDER}` }}>
          <Typography sx={{ fontSize: '0.92rem', fontWeight: 800, color: TEXT_MAIN }}>Agent Access</Typography>
          <Typography sx={{ fontSize: '0.78rem', color: TEXT_MUTED, mt: 0.4 }}>Which AI agents each role can interact with</Typography>
        </Box>
        <Box sx={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>{tableHead}</thead>
            <tbody>
              {ALL_AGENTS.map((agent, i) => (
                <tr key={agent.key} style={{ borderBottom: i < ALL_AGENTS.length - 1 ? `1px solid ${ROW_BORDER}` : 'none' }}>
                  <td style={{ padding: '11px 22px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.4 }}>
                      <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: agent.color, boxShadow: `0 0 7px ${agent.color}66` }} />
                      <Typography sx={{ fontSize: '0.85rem', color: isDark ? '#bbb' : '#4b5563', fontWeight: 500 }}>{agent.label}</Typography>
                    </Box>
                  </td>
                  {roles.map(role => {
                    const has = role.agents.includes(agent.key);
                    return (
                      <td key={role.id} style={{ padding: '11px 16px', textAlign: 'center' }}>
                        {has
                          ? <Box sx={{ width: 22, height: 22, borderRadius: '6px', bgcolor: `${agent.color}18`, border: `1px solid ${agent.color}40`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: agent.color }}><IconCheck /></Box>
                          : <Box sx={{ width: 22, height: 22, borderRadius: '6px', bgcolor: isDark ? '#161616' : '#f9fafb', border: `1px solid ${isDark ? '#222' : '#e5e7eb'}`, display: 'inline-flex', margin: 'auto' }} />
                        }
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Box>
    </>
  );
}

// ── Tab button ─────────────────────────────────────────────────────────
function TabBtn({ label, icon, active, onClick }: { label: string; icon: React.ReactNode; active: boolean; onClick: () => void }) {
  const { mode } = useColorMode();
  const isDark = mode === 'dark';
  
  return (
    <Box onClick={onClick} sx={{ display: 'flex', alignItems: 'center', gap: 0.8, px: 2.5, py: 1.2, cursor: 'pointer', borderBottom: `2px solid ${active ? PURPLE : 'transparent'}`, color: active ? PURPLE : (isDark ? '#666' : '#6b7280'), fontSize: '0.85rem', fontWeight: active ? 700 : 500, transition: 'all 0.15s', '&:hover': { color: active ? PURPLE : (isDark ? '#aaa' : '#4b5563') } }}>
      {icon} {label}
    </Box>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────
export default function UsersPage(): React.ReactElement {
  const { mode } = useColorMode();
  const isDark = mode === 'dark';
  
  
  const CARD_BG = isDark ? '#111111' : '#ffffff';
  const BORDER = isDark ? '#222222' : '#e5e7eb';
  const TITLE_COLOR = isDark ? '#fff' : '#111827';
  const SUBTITLE_COLOR = isDark ? '#666' : '#6b7280';
  const SCROLLBAR_THUMB = isDark ? '#333' : '#cbd5e1';

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const sidebarW = sidebarCollapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED;

  const [activeTab,       setActiveTab]       = useState<'users' | 'roles'>('users');
  const [roles,           setRoles]           = useState<RoleDef[]>(DEFAULT_ROLES);
  const [showCreateUser,  setShowCreateUser]  = useState(false);
  const [showRoleBuilder, setShowRoleBuilder] = useState(false);
  const [editingRole,     setEditingRole]     = useState<RoleDef | undefined>(undefined);

  const handleSaveRole = (role: RoleDef) => setRoles(prev => {
    const exists = prev.find(r => r.id === role.id);
    return exists ? prev.map(r => r.id === role.id ? role : r) : [...prev, role];
  });

  const openEditRole = (r: RoleDef) => { setEditingRole(r); setShowRoleBuilder(true); };
  const openNewRole  = ()          => { setEditingRole(undefined); setShowRoleBuilder(true); };

  return (
    <Box sx={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden', bgcolor: 'background.default', color: 'text.primary', transition: 'background-color 0.3s ease, color 0.3s ease' }}>
      {showCreateUser  && <CreateUserModal roles={roles} onClose={() => setShowCreateUser(false)} />}
      {showRoleBuilder && <RoleBuilderModal editing={editingRole} onClose={() => { setShowRoleBuilder(false); setEditingRole(undefined); }} onSave={handleSaveRole} />}

      <Sidebar onCollapseChange={setSidebarCollapsed} />

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', marginLeft: `${sidebarW}px`, transition: 'margin-left 0.28s cubic-bezier(0.4,0,0.2,1)' }}>
        <Navbar sidebarCollapsed={sidebarCollapsed} />

        <Box sx={{ flex: 1, overflowY: 'auto', px: 3, pt: '88px', pb: 4, '&::-webkit-scrollbar': { width: 5 }, '&::-webkit-scrollbar-thumb': { bgcolor: SCROLLBAR_THUMB, borderRadius: 3 } }}>

          {/* Page header */}
          <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', mb: 3 }}>
            <Box>
              <Typography sx={{ fontSize: '1.15rem', fontWeight: 800, color: TITLE_COLOR, mb: 0.4 }}>Users</Typography>
              <Typography sx={{ fontSize: '0.78rem', color: SUBTITLE_COLOR }}>Network Operations · User Management</Typography>
            </Box>
            <Box onClick={() => setShowCreateUser(true)} sx={{ display: 'flex', alignItems: 'center', gap: 0.8, cursor: 'pointer', px: 2.2, py: 1, borderRadius: 2, background: PURPLE, color: '#fff', fontSize: '0.85rem', fontWeight: 800, transition: 'all 0.15s', '&:hover': { filter: 'brightness(1.1)' } }}>
              <IconPlus /> Create User
            </Box>
          </Box>

          {/* Tabs */}
          <Box sx={{ display: 'flex', borderBottom: `1px solid ${BORDER}`, mb: 3 }}>
            <TabBtn label="All Users"        icon={<IconUser />}   active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
            <TabBtn label="Role Permissions" icon={<IconShield />} active={activeTab === 'roles'} onClick={() => setActiveTab('roles')} />
          </Box>

          {/* All Users — placeholder */}
          {activeTab === 'users' && (
            <Box sx={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '14px', p: '60px 24px', textAlign: 'center', transition: 'all 0.3s ease' }}>
              <Box sx={{ mb: 2.5, color: isDark ? '#333' : '#d1d5db', display: 'flex', justifyContent: 'center' }}>
                <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </Box>
              <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: isDark ? '#777' : '#4b5563', mb: 0.6 }}>Users table — coming next</Typography>
              <Typography sx={{ fontSize: '0.8rem', color: isDark ? '#555' : '#6b7280' }}>Set up your roles first, then invite users and assign permissions</Typography>
              <Box onClick={() => setActiveTab('roles')} sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.8, mt: 3, cursor: 'pointer', px: 2, py: 1, borderRadius: 2, background: `${PURPLE}18`, border: `1px solid ${PURPLE}30`, color: PURPLE, fontSize: '0.82rem', fontWeight: 700, transition: 'all 0.15s', '&:hover': { background: `${PURPLE}28` } }}>
                <IconShield /> Set up Roles first
              </Box>
            </Box>
          )}

          {/* Role Permissions */}
          {activeTab === 'roles' && (
            <>
              <RolesPanel roles={roles} onEdit={openEditRole} onDelete={id => setRoles(p => p.filter(r => r.id !== id))} onCreateRole={openNewRole} />
              <PermissionMatrix roles={roles} />
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}