'use client';

import React, { useState } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { useRouter } from 'next/navigation';

import Sidebar from '../../components/sidebar';
import Navbar from '../../components/navbar';
import { useColorMode } from '../../../theme/ThemeRegistry'; // Important! Adjust path if needed

const PURPLE = '#783CB4'; // Your brand color
const PINK   = '#FF6B9D';
const SIDEBAR_EXPANDED  = 260;
const SIDEBAR_COLLAPSED = 70;

// ──────────────────────────────────────────────────────────────────────────────
// Hamster Loader Overlay (Uiverse.io by Nawsome)
// ──────────────────────────────────────────────────────────────────────────────
function HamsterLoaderOverlay({ label }: { label?: string }) {
  // Dynamic color for loader text
  const { mode } = useColorMode();
  const isDark = mode === 'dark';

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: isDark ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(6px)',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <div aria-label="Orange and tan hamster running in a metal wheel" role="img" className="wheel-and-hamster">
          <div className="wheel"></div>
          <div className="hamster">
            <div className="hamster__body">
              <div className="hamster__head">
                <div className="hamster__ear"></div>
                <div className="hamster__eye"></div>
                <div className="hamster__nose"></div>
              </div>
              <div className="hamster__limb hamster__limb--fr"></div>
              <div className="hamster__limb hamster__limb--fl"></div>
              <div className="hamster__limb hamster__limb--br"></div>
              <div className="hamster__limb hamster__limb--bl"></div>
              <div className="hamster__tail"></div>
            </div>
          </div>
          <div className="spoke"></div>
        </div>

        {label ? (
          <Typography sx={{ fontSize: '0.85rem', color: isDark ? '#cfcfcf' : '#333', fontWeight: 700, letterSpacing: '0.02em' }}>
            {label}
          </Typography>
        ) : null}
      </Box>

      <style jsx>{`
        /* From Uiverse.io by Nawsome */
        .wheel-and-hamster {
          --dur: 1s;
          position: relative;
          width: 12em;
          height: 12em;
          font-size: 14px;
        }
        .wheel,
        .hamster,
        .hamster div,
        .spoke {
          position: absolute;
        }
        .wheel,
        .spoke {
          border-radius: 50%;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        .wheel {
          background: radial-gradient(
            100% 100% at center,
            hsla(0, 0%, 60%, 0) 47.8%,
            hsl(0, 0%, 60%) 48%
          );
          z-index: 2;
        }
        .hamster {
          animation: hamster var(--dur) ease-in-out infinite;
          top: 50%;
          left: calc(50% - 3.5em);
          width: 7em;
          height: 3.75em;
          transform: rotate(4deg) translate(-0.8em, 1.85em);
          transform-origin: 50% 0;
          z-index: 1;
        }
        .hamster__head {
          animation: hamsterHead var(--dur) ease-in-out infinite;
          background: hsl(30, 90%, 55%);
          border-radius: 70% 30% 0 100% / 40% 25% 25% 60%;
          box-shadow: 0 -0.25em 0 hsl(30, 90%, 80%) inset, 0.75em -1.55em 0 hsl(30, 90%, 90%) inset;
          top: 0;
          left: -2em;
          width: 2.75em;
          height: 2.5em;
          transform-origin: 100% 50%;
        }
        .hamster__ear {
          animation: hamsterEar var(--dur) ease-in-out infinite;
          background: hsl(0, 90%, 85%);
          border-radius: 50%;
          box-shadow: -0.25em 0 hsl(30, 90%, 55%) inset;
          top: -0.25em;
          right: -0.25em;
          width: 0.75em;
          height: 0.75em;
          transform-origin: 50% 75%;
        }
        .hamster__eye {
          animation: hamsterEye var(--dur) linear infinite;
          background-color: hsl(0, 0%, 0%);
          border-radius: 50%;
          top: 0.375em;
          left: 1.25em;
          width: 0.5em;
          height: 0.5em;
        }
        .hamster__nose {
          background: hsl(0, 90%, 75%);
          border-radius: 35% 65% 85% 15% / 70% 50% 50% 30%;
          top: 0.75em;
          left: 0;
          width: 0.2em;
          height: 0.25em;
        }
        .hamster__body {
          animation: hamsterBody var(--dur) ease-in-out infinite;
          background: hsl(30, 90%, 90%);
          border-radius: 50% 30% 50% 30% / 15% 60% 40% 40%;
          box-shadow: 0.1em 0.75em 0 hsl(30, 90%, 55%) inset, 0.15em -0.5em 0 hsl(30, 90%, 80%) inset;
          top: 0.25em;
          left: 2em;
          width: 4.5em;
          height: 3em;
          transform-origin: 17% 50%;
          transform-style: preserve-3d;
        }
        .hamster__limb--fr,
        .hamster__limb--fl {
          clip-path: polygon(0 0, 100% 0, 70% 80%, 60% 100%, 0% 100%, 40% 80%);
          top: 2em;
          left: 0.5em;
          width: 1em;
          height: 1.5em;
          transform-origin: 50% 0;
        }
        .hamster__limb--fr {
          animation: hamsterFRLimb var(--dur) linear infinite;
          background: linear-gradient(hsl(30, 90%, 80%) 80%, hsl(0, 90%, 75%) 80%);
          transform: rotate(15deg) translateZ(-1px);
        }
        .hamster__limb--fl {
          animation: hamsterFLLimb var(--dur) linear infinite;
          background: linear-gradient(hsl(30, 90%, 90%) 80%, hsl(0, 90%, 85%) 80%);
          transform: rotate(15deg);
        }
        .hamster__limb--br,
        .hamster__limb--bl {
          border-radius: 0.75em 0.75em 0 0;
          clip-path: polygon(0 0, 100% 0, 100% 30%, 70% 90%, 70% 100%, 30% 100%, 40% 90%, 0% 30%);
          top: 1em;
          left: 2.8em;
          width: 1.5em;
          height: 2.5em;
          transform-origin: 50% 30%;
        }
        .hamster__limb--br {
          animation: hamsterBRLimb var(--dur) linear infinite;
          background: linear-gradient(hsl(30, 90%, 80%) 90%, hsl(0, 90%, 75%) 90%);
          transform: rotate(-25deg) translateZ(-1px);
        }
        .hamster__limb--bl {
          animation: hamsterBLLimb var(--dur) linear infinite;
          background: linear-gradient(hsl(30, 90%, 90%) 90%, hsl(0, 90%, 85%) 90%);
          transform: rotate(-25deg);
        }
        .hamster__tail {
          animation: hamsterTail var(--dur) linear infinite;
          background: hsl(0, 90%, 85%);
          border-radius: 0.25em 50% 50% 0.25em;
          box-shadow: 0 -0.2em 0 hsl(0, 90%, 75%) inset;
          top: 1.5em;
          right: -0.5em;
          width: 1em;
          height: 0.5em;
          transform: rotate(30deg) translateZ(-1px);
          transform-origin: 0.25em 0.25em;
        }
        .spoke {
          animation: spoke var(--dur) linear infinite;
          background: radial-gradient(100% 100% at center, hsl(0, 0%, 60%) 4.8%, hsla(0, 0%, 60%, 0) 5%),
            linear-gradient(
                hsla(0, 0%, 55%, 0) 46.9%,
                hsl(0, 0%, 65%) 47% 52.9%,
                hsla(0, 0%, 65%, 0) 53%
              )
              50% 50% / 99% 99% no-repeat;
        }

        /* Animations */
        @keyframes hamster {
          from,
          to {
            transform: rotate(4deg) translate(-0.8em, 1.85em);
          }
          50% {
            transform: rotate(0) translate(-0.8em, 1.85em);
          }
        }
        @keyframes hamsterHead {
          from,
          25%,
          50%,
          75%,
          to {
            transform: rotate(0);
          }
          12.5%,
          37.5%,
          62.5%,
          87.5% {
            transform: rotate(8deg);
          }
        }
        @keyframes hamsterEye {
          from,
          90%,
          to {
            transform: scaleY(1);
          }
          95% {
            transform: scaleY(0);
          }
        }
        @keyframes hamsterEar {
          from,
          25%,
          50%,
          75%,
          to {
            transform: rotate(0);
          }
          12.5%,
          37.5%,
          62.5%,
          87.5% {
            transform: rotate(12deg);
          }
        }
        @keyframes hamsterBody {
          from,
          25%,
          50%,
          75%,
          to {
            transform: rotate(0);
          }
          12.5%,
          37.5%,
          62.5%,
          87.5% {
            transform: rotate(-2deg);
          }
        }
        @keyframes hamsterFRLimb {
          from,
          25%,
          50%,
          75%,
          to {
            transform: rotate(50deg) translateZ(-1px);
          }
          12.5%,
          37.5%,
          62.5%,
          87.5% {
            transform: rotate(-30deg) translateZ(-1px);
          }
        }
        @keyframes hamsterFLLimb {
          from,
          25%,
          50%,
          75%,
          to {
            transform: rotate(-30deg);
          }
          12.5%,
          37.5%,
          62.5%,
          87.5% {
            transform: rotate(50deg);
          }
        }
        @keyframes hamsterBRLimb {
          from,
          25%,
          50%,
          75%,
          to {
            transform: rotate(-60deg) translateZ(-1px);
          }
          12.5%,
          37.5%,
          62.5%,
          87.5% {
            transform: rotate(20deg) translateZ(-1px);
          }
        }
        @keyframes hamsterBLLimb {
          from,
          25%,
          50%,
          75%,
          to {
            transform: rotate(20deg);
          }
          12.5%,
          37.5%,
          62.5%,
          87.5% {
            transform: rotate(-60deg);
          }
        }
        @keyframes hamsterTail {
          from,
          25%,
          50%,
          75%,
          to {
            transform: rotate(30deg) translateZ(-1px);
          }
          12.5%,
          37.5%,
          62.5%,
          87.5% {
            transform: rotate(10deg) translateZ(-1px);
          }
        }
        @keyframes spoke {
          from {
            transform: rotate(0);
          }
          to {
            transform: rotate(-1turn);
          }
        }
      `}</style>
    </Box>
  );
}

// ── Icons ──────────────────────────────────────────────────────────────
function MonitorIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>; }
function TicketIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/></svg>; }
function TroubleshootIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>; }
function InformIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>; }
function ConfigureIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>; }
function PacketIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><path d="M6 6h.01M6 18h.01"/></svg>; }
function DevicesIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>; }
function UptimeIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 6v6l4 2"/></svg>; }
function HealthIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>; }
function TicketsKPIIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/></svg>; }
function ArrowIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>; }

// ── KPI Card ───────────────────────────────────────────────────────────
interface KpiProps { label: string; value: string; sub: string; color: string; Icon: React.FC; trend?: string; trendUp?: boolean; }
function KpiCard({ label, value, sub, color, Icon, trend, trendUp }: KpiProps) {
  const { mode } = useColorMode();
  const isDark = mode === 'dark';
  const CARD_BG = isDark ? '#0f0f0f' : '#ffffff';
  const BORDER = isDark ? '#1a1a1a' : '#e5e7eb';
  const TEXT_MAIN = isDark ? '#fff' : '#111827';
  const TEXT_MUTED = isDark ? '#555' : '#6b7280';
  
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        background: CARD_BG,
        border: `1px solid ${BORDER}`,
        borderRadius: '14px',
        p: '18px 20px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': { borderColor: `${color}44`, boxShadow: `0 0 24px ${color}12` },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 80,
          height: 80,
          borderRadius: '50%',
          bgcolor: `${color}18`,
          filter: 'blur(24px)',
          pointerEvents: 'none',
        }}
      />
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography
          sx={{
            fontSize: '0.7rem',
            fontWeight: 600,
            color: TEXT_MUTED,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          {label}
        </Typography>
        <Box sx={{ color, display: 'flex', opacity: 0.85 }}><Icon /></Box>
      </Box>

      <Typography sx={{ fontSize: '2rem', fontWeight: 800, color: TEXT_MAIN, lineHeight: 1, mb: 0.5 }}>
        {value}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.8 }}>
        <Typography sx={{ fontSize: '0.72rem', color: TEXT_MUTED }}>{sub}</Typography>
        {trend && (
          <Box sx={{ px: 0.8, py: 0.2, borderRadius: '5px', bgcolor: trendUp ? (isDark ? '#0d2e1c' : '#dcfce7') : (isDark ? '#2e0d0d' : '#fee2e2') }}>
            <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: trendUp ? (isDark ? PURPLE : '#16a34a') : '#ef4444' }}>
              {trend}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

// ── Agent Card ─────────────────────────────────────────────────────────
interface AgentCardProps {
  name: string;
  color: string;
  Icon: React.FC;
  metric: string;
  metricLabel: string;
  description: string;
  actionLabel: string;
  progress?: number;
  href?: string;
}

function AgentCard({
  name,
  color,
  Icon,
  metric,
  metricLabel,
  description,
  actionLabel,
  progress,
  href,
  onNavigate,
  disabled,
}: AgentCardProps & { onNavigate?: (href: string, label?: string) => void; disabled?: boolean }) {
  const { mode } = useColorMode();
  const isDark = mode === 'dark';
  
  const CARD_BG = isDark ? '#0f0f0f' : '#ffffff';
  const BORDER = isDark ? '#1a1a1a' : '#e5e7eb';
  const TEXT_MAIN = isDark ? '#fff' : '#111827';
  const TEXT_MUTED = isDark ? '#555' : '#6b7280';
  const PROGRESS_BG = isDark ? '#1a1a1a' : '#e5e7eb';

  return (
    <Box
      onClick={() => {
        if (disabled) return;
        if (href && onNavigate) onNavigate(href, name);
      }}
      sx={{
        background: CARD_BG,
        border: `1px solid ${BORDER}`,
        borderRadius: '14px',
        p: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        '&:hover': disabled
          ? {}
          : { borderColor: `${color}55`, boxShadow: `0 4px 32px ${color}14`, transform: 'translateY(-2px)' },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${color}88, transparent)`,
        }}
      />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '10px',
            bgcolor: `${color}18`,
            border: `1px solid ${color}30`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color,
            flexShrink: 0,
          }}
        >
          <Icon />
        </Box>
        <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: isDark ? '#ddd' : '#1f2937' }}>{name}</Typography>
      </Box>

      <Box>
        <Typography sx={{ fontSize: '1.6rem', fontWeight: 800, color: TEXT_MAIN, lineHeight: 1 }}>
          {metric}
        </Typography>
        <Typography sx={{ fontSize: '0.7rem', color: TEXT_MUTED, mt: 0.3 }}>{metricLabel}</Typography>
      </Box>

      {progress !== undefined && (
        <Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 4,
              borderRadius: 2,
              bgcolor: PROGRESS_BG,
              '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 2 },
            }}
          />
          <Typography sx={{ fontSize: '0.65rem', color: TEXT_MUTED, mt: 0.5 }}>{progress}% capacity</Typography>
        </Box>
      )}

      <Typography sx={{ fontSize: '0.72rem', color: TEXT_MUTED, lineHeight: 1.55 }}>{description}</Typography>

      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.8,
          mt: 'auto',
          pt: 0.5,
          color,
          fontSize: '0.75rem',
          fontWeight: 600,
          transition: 'gap 0.15s',
          '&:hover': disabled ? {} : { gap: 1.2 },
        }}
      >
        {actionLabel} <ArrowIcon />
      </Box>
    </Box>
  );
}

// ── Activity Feed ──────────────────────────────────────────────────────
const ACTIVITY = [
  { time: '2m ago',  agent: 'Monitor',      msg: 'Device 10.0.1.54 went offline',            color: '#ef4444' },
  { time: '8m ago',  agent: 'Ticket',       msg: 'Ticket #1042 auto-closed (resolved)',      color: '#3b82f6' },
  { time: '15m ago', agent: 'Troubleshoot', msg: 'RCA report generated for Site B',          color: '#10b981' },
  { time: '22m ago', agent: 'Configure',    msg: 'AP config pushed to West Region (32 APs)', color: '#8b5cf6' },
  { time: '41m ago', agent: 'Monitor',      msg: '3 new critical alerts — core switch',      color: '#ef4444' },
  { time: '1h ago',  agent: 'Packet',       msg: 'Traffic anomaly detected on VLAN 20',      color: '#ec4899' },
];

function ActivityFeed() {
  const { mode } = useColorMode();
  const isDark = mode === 'dark';
  
  const CARD_BG = isDark ? '#0f0f0f' : '#ffffff';
  const BORDER = isDark ? '#1a1a1a' : '#e5e7eb';
  const TITLE_COLOR = isDark ? '#ccc' : '#111827';
  const TIME_COLOR = isDark ? '#444' : '#9ca3af';
  const DESC_COLOR = isDark ? '#888' : '#6b7280';

  return (
    <Box sx={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '14px', p: '20px', transition: 'all 0.3s ease' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: TITLE_COLOR, letterSpacing: '0.05em' }}>
          Recent Activity
        </Typography>
        <Typography sx={{ fontSize: '0.68rem', color: PURPLE, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
          View all
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {ACTIVITY.map((item, i) => (
          <Box
            key={i}
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1.5,
              py: 1.4,
              borderBottom: i < ACTIVITY.length - 1 ? `1px solid ${BORDER}` : 'none',
            }}
          >
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                bgcolor: item.color,
                mt: 0.55,
                flexShrink: 0,
                boxShadow: `0 0 6px ${item.color}88`,
              }}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.2 }}>
                <Typography sx={{ fontSize: '0.68rem', fontWeight: 600, color: item.color }}>{item.agent}</Typography>
                <Typography sx={{ fontSize: '0.65rem', color: TIME_COLOR }}>{item.time}</Typography>
              </Box>
              <Typography sx={{ fontSize: '0.75rem', color: DESC_COLOR, lineHeight: 1.4 }}>{item.msg}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

// ── Agent data ─────────────────────────────────────────────────────────
const AGENT_CARDS: AgentCardProps[] = [
  {
    name: 'Monitor Agent',
    color: '#ef4444',
    Icon: MonitorIcon,
    metric: '398',
    metricLabel: 'Devices monitored',
    description: '294 healthy · 3 warning · 101 critical alerts active.',
    actionLabel: 'Open Monitoring',
    progress: 74,
    href: '/pages/Chatinterface/MonitorChat',
  },
  {
    name: 'Ticket Agent',
    color: '#3b82f6',
    Icon: TicketIcon,
    metric: '12',
    metricLabel: 'Open tickets',
    description: '8 new this week · avg resolution 2.4h · 3 high priority.',
    actionLabel: 'View Tickets',
    href: '/pages/Chatinterface/TicketChat',
  },
  {
    name: 'Troubleshoot Agent',
    color: '#10b981',
    Icon: TroubleshootIcon,
    metric: '5',
    metricLabel: 'RCA reports this month',
    description: 'Last run 15m ago · diagnoses: connectivity, switch, AP.',
    actionLabel: 'Start Diagnosis',
    href: '/pages/Chatinterface/Troubleshootchat',
  },
  {
    name: 'Inform Agent',
    color: '#f59e0b',
    Icon: InformIcon,
    metric: '24',
    metricLabel: 'Notifications sent today',
    description: 'Stakeholders notified on all P1 incidents in real time.',
    actionLabel: 'Configure Alerts',
    href: '/pages/Chatinterface/InformChat',
  },
  {
    name: 'Configure Agent',
    color: '#8b5cf6',
    Icon: ConfigureIcon,
    metric: '32',
    metricLabel: 'APs configured',
    description: 'West Region config pushed 22m ago · 0 failures.',
    actionLabel: 'Push Config',
    href: '/pages/Chatinterface/ConfigureChat',
  },
  {
    name: 'Packet Agent',
    color: '#ec4899',
    Icon: PacketIcon,
    metric: '1',
    metricLabel: 'Active anomaly',
    description: 'Traffic spike on VLAN 20 · analysis in progress.',
    actionLabel: 'Start Analysis',
    href: '/pages/Chatinterface/PacketChat',
  },
];

// ── Page ───────────────────────────────────────────────────────────────
export default function DashboardPage(): React.ReactElement {
  const router = useRouter();
  
  // Connect to the theme mode!
  const { mode } = useColorMode();
  const isDark = mode === 'dark';
  
  // Dynamic Backgrounds
  
  const TITLE_COLOR = isDark ? '#fff' : '#111827';
  const SUBTITLE_COLOR = isDark ? '#555' : '#6b7280';
  const SCROLLBAR_THUMB = isDark ? '#222' : '#cbd5e1';

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const sidebarW = sidebarCollapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED;

  const [navLoading, setNavLoading] = useState(false);
  const [navLabel, setNavLabel] = useState<string>('');

  const handleNavigate = (href: string, label?: string) => {
    if (!href || navLoading) return;

    setNavLabel(label ? `Opening ${label}...` : 'Loading...');
    setNavLoading(true);

    window.setTimeout(() => {
      router.push(href);
    }, 300);
  };

  return (
    <Box sx={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden', bgcolor: 'background.default', color: 'text.primary', transition: 'background-color 0.3s ease, color 0.3s ease' }}>
      {navLoading ? <HamsterLoaderOverlay label={navLabel} /> : null}

      <Sidebar onCollapseChange={setSidebarCollapsed} />

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflow: 'hidden',
          marginLeft: `${sidebarW}px`,
          transition: 'margin-left 0.28s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <Navbar sidebarCollapsed={sidebarCollapsed} />

        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            px: 3,
            pt: '88px',
            pb: 4,
            '&::-webkit-scrollbar': { width: 5 },
            '&::-webkit-scrollbar-thumb': { bgcolor: SCROLLBAR_THUMB, borderRadius: 3 },
          }}
        >
          {/* Header */}
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontSize: '1.15rem', fontWeight: 800, color: TITLE_COLOR, mb: 0.4 }}>
              Dashboard
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: SUBTITLE_COLOR }}>
              Network Operations · Live overview
            </Typography>
          </Box>

          {/* KPI Row */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <KpiCard label="Network Health" value="74%" sub="398 devices monitored" color={PURPLE} Icon={HealthIcon} trend="+2%" trendUp />
            <KpiCard label="Uptime" value="99.8%" sub="Last 30 days" color={PINK} Icon={UptimeIcon} trend="+0.1%" trendUp />
            <KpiCard label="Open Tickets" value="12" sub="3 high priority" color="#f59e0b" Icon={TicketsKPIIcon} trend="-3" trendUp />
            <KpiCard label="Devices Online" value="294" sub="101 critical · 3 warn" color="#ef4444" Icon={DevicesIcon} />
          </Box>

          {/* Agent grid + Activity feed */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <Box sx={{ flex: 1, minWidth: 0, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
              {AGENT_CARDS.map((a) => (
                <AgentCard
                  key={a.name}
                  {...a}
                  onNavigate={handleNavigate}
                  disabled={navLoading}
                />
              ))}
            </Box>
            <Box sx={{ width: 300, flexShrink: 0 }}>
              <ActivityFeed />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}