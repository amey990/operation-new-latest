'use client';

import { Box, Typography, Tooltip } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { keyframes } from '@mui/system';
import { useColorMode } from '../../theme/ThemeRegistry'; // Adjust path if necessary

const PURPLE = '#783CB4'; // Renamed from GREEN for sanity!
const STORAGE_KEY = 'sidebar_collapsed';

const fadeSlide = keyframes`
  from { opacity: 0; transform: translateX(-10px); }
  to   { opacity: 1; transform: translateX(0); }
`;

// ── Icons ─────────────────────────────────────
const DashboardIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.2"/><rect x="14" y="3" width="7" height="7" rx="1.2"/>
    <rect x="3" y="14" width="7" height="7" rx="1.2"/><rect x="14" y="14" width="7" height="7" rx="1.2"/>
  </svg>
);
const AgentsIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="8" width="18" height="12" rx="2.5"/>
    <path d="M9 8V6a3 3 0 0 1 6 0v2"/>
    <circle cx="9" cy="14" r="1.2" fill="currentColor" stroke="none"/>
    <circle cx="15" cy="14" r="1.2" fill="currentColor" stroke="none"/>
    <path d="M9 18h6"/>
    <path d="M12 4v1"/>
  </svg>
);
const KnowledgeIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);
const AnalyticsIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);
const UsersIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const LogoutIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const LightningIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const ChevronIcon = ({ pointRight }: { pointRight: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"
    style={{ transition: 'transform 0.3s ease', transform: pointRight ? 'rotate(0deg)' : 'rotate(180deg)' }}>
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

// ── Nav config ────────────────────────────────
const NAV_MAIN = [
  { label: 'Dashboard',        href: '/pages/dashboard',  Icon: DashboardIcon },
  { label: 'Agents',           href: '/pages/Agents',     Icon: AgentsIcon, match: ['/pages/Chatinterface'] },
  { label: 'Knowledge Center', href: '/pages/KnowledgeC', Icon: KnowledgeIcon },
];

const NAV_MANAGE = [
  { label: 'Analytics', href: '/pages/Analytics', Icon: AnalyticsIcon },
  { label: 'Users',     href: '/pages/Users',     Icon: UsersIcon },
];

// Helper to get tooltip styles based on mode
const getTooltipStyles = (isDark: boolean) => ({
  tooltip: { sx: { bgcolor: isDark ? '#1c1c1c' : '#374151', border: isDark ? '1px solid #2a2a2a' : 'none', fontSize: '0.75rem', fontWeight: 500 } },
  arrow:   { sx: { color: isDark ? '#1c1c1c' : '#374151' } },
});

// ── NavItem ───────────────────────────────────
function NavItem({ label, href, Icon, collapsed, delay = 0, match = [] }: {
  label: string; href: string; Icon: React.FC; collapsed: boolean; delay?: number; match?: string[];
}) {
  const pathname = usePathname();
  const router   = useRouter();
  
  // Get Mode
  const { mode } = useColorMode();
  const isDark = mode === 'dark';
  
  // Dynamic Variables
  const TEXT_MID  = isDark ? '#777' : '#6b7280';

  const norm = (p: string) => (p || '').replace(/\/+$/, '');
  const current = norm(pathname || '');
  const base    = norm(href);
  const isActive =
    current === base ||
    (base.length > 1 && current.startsWith(base)) ||
    match.some((m) => current.startsWith(norm(m)));

  const inner = (
    <Box
      onClick={() => router.push(href)}
      sx={{
        display: 'flex', alignItems: 'center',
        gap: collapsed ? 0 : 1.5,
        px: collapsed ? 0 : 1.5, py: 0.95,
        mx: 'auto',
        width: collapsed ? 38 : '100%',
        height: collapsed ? 38 : 'auto',
        borderRadius: '9px', cursor: 'pointer',
        justifyContent: collapsed ? 'center' : 'flex-start',
        color: isActive ? PURPLE : TEXT_MID,
        backgroundColor: isActive ? `${PURPLE}12` : 'transparent',
        border: `1px solid ${isActive ? PURPLE + '28' : 'transparent'}`,
        position: 'relative',
        transition: 'all 0.17s ease',
        animation: `${fadeSlide} 0.3s ease-out ${delay}s both`,
        boxSizing: 'border-box',
        '&:hover': {
          // Soft purple background on hover instead of gray
          backgroundColor: isActive ? `${PURPLE}18` : (isDark ? `${PURPLE}15` : `${PURPLE}0F`),
          // Turn the icon and text purple on hover
          color: PURPLE, 
          border: `1px solid ${isActive ? PURPLE + '35' : (isDark ? PURPLE + '25' : PURPLE + '15')}`,
        },
        '&::before': isActive && !collapsed ? {
          content: '""', position: 'absolute',
          left: -1, top: '18%', height: '64%', width: '3px',
          borderRadius: '0 3px 3px 0',
          backgroundColor: PURPLE, boxShadow: `0 0 10px ${PURPLE}99`,
        } : {},
      }}
    >
      <Box sx={{ display: 'flex', flexShrink: 0, lineHeight: 0 }}><Icon /></Box>
      {!collapsed && (
        <Typography sx={{ fontSize: '0.83rem', fontWeight: isActive ? 600 : 500, letterSpacing: '0.01em', whiteSpace: 'nowrap' }}>
          {label}
        </Typography>
      )}
      {isActive && collapsed && (
        <Box sx={{ position: 'absolute', top: 5, right: 5, width: 5, height: 5, borderRadius: '50%', bgcolor: PURPLE, boxShadow: `0 0 6px ${PURPLE}` }} />
      )}
    </Box>
  );

  return collapsed
    ? <Tooltip title={label} placement="right" arrow componentsProps={getTooltipStyles(isDark)}>{inner}</Tooltip>
    : inner;
}

function SidebarDivider({ label, collapsed }: { label?: string; collapsed: boolean }) {
  const { mode } = useColorMode();
  const isDark = mode === 'dark';
  const BORDER   = isDark ? '#1a1a1a' : '#e5e7eb';
  const TEXT_DIM = isDark ? '#444' : '#9ca3af';

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 0.5, my: 0.8 }}>
      {!collapsed && label && (
        <Typography sx={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', color: TEXT_DIM, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
          {label}
        </Typography>
      )}
      <Box sx={{ flex: 1, height: '1px', bgcolor: BORDER }} />
    </Box>
  );
}

function LogoutItem({ collapsed }: { collapsed: boolean }) {
  const router = useRouter();
  const { mode } = useColorMode();
  const isDark = mode === 'dark';

  const inner = (
    <Box
      onClick={() => router.push('/')}
      sx={{
        display: 'flex', alignItems: 'center',
        gap: collapsed ? 0 : 1.5,
        px: collapsed ? 0 : 1.5, py: 0.95,
        mx: 'auto',
        width: collapsed ? 38 : '100%',
        height: collapsed ? 38 : 'auto',
        borderRadius: '9px', cursor: 'pointer',
        justifyContent: collapsed ? 'center' : 'flex-start',
        color: '#c0392b', transition: 'all 0.17s ease',
        border: '1px solid transparent', boxSizing: 'border-box',
        '&:hover': { 
          bgcolor: isDark ? '#1e0808' : '#fee2e2', 
          color: '#e74c3c', 
          border: `1px solid ${isDark ? '#3d0c0c' : '#fecaca'}` 
        },
      }}
    >
      <Box sx={{ display: 'flex', flexShrink: 0 }}><LogoutIcon /></Box>
      {!collapsed && <Typography sx={{ fontSize: '0.83rem', whiteSpace: 'nowrap', fontWeight: 500 }}>Log Out</Typography>}
    </Box>
  );
  return collapsed
    ? <Tooltip title="Log Out" placement="right" arrow componentsProps={getTooltipStyles(isDark)}>{inner}</Tooltip>
    : inner;
}

// ── Sidebar ───────────────────────────────────
interface SidebarProps {
  onCollapseChange?: (collapsed: boolean) => void;
}

export default function Sidebar({ onCollapseChange }: SidebarProps) {
  // ── Mode Hook ──
  const { mode } = useColorMode();
  const isDark = mode === 'dark';

  // ── Dynamic Colors ──
  const BG       = isDark ? '#0a0a0a' : '#ffffff';
  const BG_HOVER = isDark ? '#141414' : '#f3f4f6';
  const BORDER   = isDark ? '#1a1a1a' : '#e5e7eb';
  const TEXT_DIM = isDark ? '#555' : '#9ca3af';
  const TEXT_MAIN = isDark ? '#fff' : '#111827';
  
  // Upgrade Card Colors
  const UPGRADE_BG = isDark 
    ? 'linear-gradient(145deg, #1a0f2e 0%, #0e0a1a 100%)' 
    : 'linear-gradient(145deg, #faf5ff 0%, #ffffff 100%)';
  const UPGRADE_TEXT_DIM = isDark ? '#888' : '#6b7280';

  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try { return localStorage.getItem(STORAGE_KEY) === 'true'; } catch { return false; }
  });

  const W = collapsed ? 70 : 260;

  useEffect(() => {
    onCollapseChange?.(collapsed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    try { localStorage.setItem(STORAGE_KEY, String(next)); } catch { /* ignore */ }
    onCollapseChange?.(next);
  };

  return (
    <Box sx={{
      width: W, minWidth: W,
      height: '100vh', background: BG,
      borderRight: `1px solid ${BORDER}`,
      position: 'fixed', left: 0, top: 0, zIndex: 100,
      display: 'flex', flexDirection: 'column',
      transition: 'width 0.28s cubic-bezier(0.4,0,0.2,1), min-width 0.28s cubic-bezier(0.4,0,0.2,1), background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease',
      overflow: 'hidden',
    }}>

      {/* Logo row */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', px: collapsed ? 0 : 2, py: 2, minHeight: 64, flexShrink: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, overflow: 'hidden', minWidth: 0 }}>
          <Box sx={{ width: 34, height: 34, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="/assets/ops_logo.png" alt="Nova" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </Box>
          {!collapsed && (
            <Box sx={{ overflow: 'hidden', minWidth: 0 }}>
              <Typography sx={{ fontFamily: '"Sansation", sans-serif', fontWeight: 800, fontSize: '1.05rem', color: TEXT_MAIN, lineHeight: 1.15, letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>Nova</Typography>
              <Typography sx={{ fontFamily: '"Sansation", sans-serif', fontSize: '0.62rem', color: TEXT_DIM, letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 600, whiteSpace: 'nowrap' }}>
                Where Networks Thrive with AI
                </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Divider */}
      <Box sx={{ mx: collapsed ? 1.2 : 1.8, height: '1px', bgcolor: BORDER, flexShrink: 0, mb: 1 }} />

      {/* Nav */}
      <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', px: collapsed ? 1 : 1.2, pb: 1, '&::-webkit-scrollbar': { display: 'none' } }}>
        
        {/* Collapse toggle positioned above Dashboard */}
        <Box sx={{ display: 'flex', justifyContent: collapsed ? 'center' : 'flex-end', mb: 2, mt: 0.5, px: collapsed ? 0 : 0.5 }}>
          <Tooltip title={collapsed ? 'Expand' : 'Collapse'} placement="right" arrow componentsProps={getTooltipStyles(isDark)}>
            <Box onClick={toggle} sx={{ color: TEXT_DIM, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 0.5, borderRadius: '6px', transition: 'all 0.15s', '&:hover': { color: TEXT_MAIN, bgcolor: BG_HOVER } }}>
              <ChevronIcon pointRight={collapsed} />
            </Box>
          </Tooltip>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.2 }}>
          {NAV_MAIN.map((item, i) => <NavItem key={item.label} {...item} collapsed={collapsed} delay={i * 0.04} />)}
        </Box>
        <SidebarDivider label="Manage" collapsed={collapsed} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.2 }}>
          {NAV_MANAGE.map((item, i) => <NavItem key={item.label} {...item} collapsed={collapsed} delay={(NAV_MAIN.length + i) * 0.04} />)}
        </Box>
        <SidebarDivider collapsed={collapsed} />
        <LogoutItem collapsed={collapsed} />
      </Box>

      {/* Upgrade card */}
      {!collapsed ? (
        <Box sx={{ mx: 1.5, mb: 2, borderRadius: '12px', 
          background: UPGRADE_BG,
          border: `1px solid ${PURPLE}22`, p: '14px 16px', cursor: 'pointer', position: 'relative', overflow: 'hidden', flexShrink: 0, transition: 'border-color 0.2s, box-shadow 0.2s', '&:hover': { borderColor: `${PURPLE}55`, boxShadow: `0 0 20px ${PURPLE}15` } }}>
          <Box sx={{ position: 'absolute', top: -24, right: -24, width: 80, height: 80, borderRadius: '50%', bgcolor: `${PURPLE}15`, filter: 'blur(22px)', pointerEvents: 'none' }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Box sx={{ color: PURPLE, display: 'flex' }}><LightningIcon /></Box>
            <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: TEXT_MAIN }}>Upgrade Plan</Typography>
          </Box>
          <Typography sx={{ fontSize: '0.69rem', color: UPGRADE_TEXT_DIM, lineHeight: 1.55, mb: 1.2 }}>
            Unlock advanced AI agents & unlimited network monitoring.
          </Typography>
          <Box sx={{ bgcolor: PURPLE, borderRadius: '7px', py: 0.65, textAlign: 'center', transition: 'filter 0.18s', '&:hover': { filter: 'brightness(1.12)' } }}>
            <Typography sx={{ fontSize: '0.74rem', fontWeight: 700, color: '#fff' }}>Upgrade Now</Typography>
          </Box>
        </Box>
      ) : (
        <Tooltip title="Upgrade Plan" placement="right" arrow componentsProps={getTooltipStyles(isDark)}>
          <Box sx={{ mx: 1, mb: 2, p: 1.1, borderRadius: '9px', bgcolor: `${PURPLE}14`, border: `1px solid ${PURPLE}22`, display: 'flex', justifyContent: 'center', cursor: 'pointer', color: PURPLE, flexShrink: 0, '&:hover': { bgcolor: `${PURPLE}25` }, transition: 'all 0.18s' }}>
            <LightningIcon />
          </Box>
        </Tooltip>
      )}
    </Box>
  );
}