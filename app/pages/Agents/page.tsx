'use client';

import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/sidebar';
import Navbar from '../../components/navbar';
import { useColorMode } from '../../../theme/ThemeRegistry'; // Added the import

// ── Theme tokens ───────────────────────────────────────────────────────
const PURPLE  = '#783CB4'; // Updated to Purple
const SIDEBAR_EXPANDED  = 260;
const SIDEBAR_COLLAPSED = 70;

// ── SVG Icons ──────────────────────────────────────────────────────────
const IconMonitor     = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
const IconTicket      = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/></svg>;
const IconSearch      = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>;
const IconInform      = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>;
const IconConfigure   = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
const IconPacket      = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><path d="M6 6h.01M6 18h.01"/></svg>;
const IconCheck       = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IconArrow       = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>;

// ── Types ──────────────────────────────────────────────────────────────
interface AgentCapability {
  label: string;
  description: string;
}

interface AgentDef {
  id: string;
  name: string;
  tagline: string;
  color: string;
  Icon: React.FC;
  status: 'live' | 'idle';
  capabilities: AgentCapability[];
  href: string;
}

// ── Agent definitions ──────────────────────────────────────────────────
const AGENTS: AgentDef[] = [
  {
    id: 'monitor', name: 'Monitor Agent', color: '#ef4444', Icon: IconMonitor,
    tagline: 'Real-time network health surveillance across all devices',
    status: 'live',
    href: '/pages/Chatinterface/MonitorChat',
    capabilities: [
      { label: 'Real-time device polling',    description: 'Continuous SNMP/ICMP polling at configurable intervals' },
      { label: 'Threshold-based alerting',    description: 'Smart alerts on CPU, memory, bandwidth & uptime thresholds' },
      { label: 'Multi-vendor support',        description: 'Cisco, Juniper, Aruba, Fortinet and 40+ vendors' },
      { label: 'Topology discovery',          description: 'Auto-discover and map your network topology' },
      { label: 'Alert deduplication',         description: 'AI-powered alert correlation to suppress noise' },
      { label: 'Historical trending',         description: 'Retain and chart 90 days of device metrics' },
    ],
  },
  {
    id: 'ticket', name: 'Ticket Agent', color: '#3b82f6', Icon: IconTicket,
    tagline: 'Autonomous ticket lifecycle management and resolution',
    status: 'live',
    href: '/pages/Chatinterface/TicketChat',
    capabilities: [
      { label: 'Auto ticket creation',        description: 'Instantly log incidents triggered by monitor alerts' },
      { label: 'Priority classification',     description: 'AI-scored P1–P4 severity based on impact analysis' },
      { label: 'SLA tracking',                description: 'Real-time SLA breach warnings and escalations' },
      { label: 'Resolution suggestions',      description: 'Surface relevant KB articles and similar past tickets' },
      { label: 'Auto-close on resolution',    description: 'Verify fix and close tickets automatically' },
      { label: 'Team assignment routing',     description: 'Route to the right team based on category and load' },
    ],
  },
  {
    id: 'troubleshoot', name: 'Troubleshoot Agent', color: '#10b981', Icon: IconSearch,
    tagline: 'AI-driven root cause analysis and guided remediation',
    status: 'live',
    href: '/pages/Chatinterface/Troubleshootchat',
    capabilities: [
      { label: 'Root cause analysis',         description: 'Multi-layer correlation across device, link and service' },
      { label: 'Guided remediation steps',    description: 'Step-by-step fix instructions per issue type' },
      { label: 'Log analysis',                description: 'Parse syslog and SNMP trap data for root clues' },
      { label: 'Connectivity path tracing',   description: 'Trace end-to-end packet paths to isolate breaks' },
      { label: 'RCA report generation',       description: 'Auto-generate PDF incident reports for stakeholders' },
      { label: 'Historical pattern matching', description: 'Compare against past incidents for faster diagnosis' },
    ],
  },
  {
    id: 'inform', name: 'Inform Agent', color: '#f59e0b', Icon: IconInform,
    tagline: 'Intelligent stakeholder communication and notification routing',
    status: 'live',
    href: '/pages/Chatinterface/InformChat',
    capabilities: [
      { label: 'Multi-channel notifications', description: 'Email, Slack, Teams, SMS and webhook delivery' },
      { label: 'Audience-aware messaging',    description: 'Technical for engineers, exec summaries for leadership' },
      { label: 'Scheduled digest reports',    description: 'Daily, weekly and monthly automated status digests' },
      { label: 'Escalation workflows',        description: 'Configurable escalation chains for unacknowledged P1s' },
      { label: 'Custom notification templates', description: 'Brand-consistent templates per alert type' },
      { label: 'Delivery confirmation',       description: 'Track open rates and re-notify on missed critical alerts' },
    ],
  },
  {
    id: 'configure', name: 'Configure Agent', color: '#8b5cf6', Icon: IconConfigure,
    tagline: 'Automated config push, validation and rollback across your fleet',
    status: 'idle',
    href: '/pages/Chatinterface/ConfigureChat',
    capabilities: [
      { label: 'Bulk config deployment',      description: 'Push configs to hundreds of devices simultaneously' },
      { label: 'Pre-deployment validation',   description: 'Dry-run and syntax check before any change applies' },
      { label: 'Auto rollback on failure',    description: 'Instantly revert if a config causes device instability' },
      { label: 'Change diff and audit log',   description: 'Full before/after diff stored for compliance' },
      { label: 'Template-based config',       description: 'Jinja2 templates for consistent repeatable deployments' },
      { label: 'Maintenance windows',         description: 'Queue changes for approved maintenance windows only' },
    ],
  },
  {
    id: 'packet', name: 'Packet Agent', color: '#ec4899', Icon: IconPacket,
    tagline: 'Deep packet inspection and traffic anomaly detection',
    status: 'live',
    href: '/pages/Chatinterface/PacketChat',
    capabilities: [
      { label: 'Flow analysis (NetFlow/sFlow)', description: 'Aggregate and visualise traffic flows in real time' },
      { label: 'ML anomaly detection',         description: 'ML-based detection of unusual traffic patterns' },
      { label: 'Application recognition',      description: 'Identify 2000+ applications from DPI signatures' },
      { label: 'Bandwidth heatmaps',           description: 'Visual heatmaps by interface, VLAN and site' },
      { label: 'Security threat detection',    description: 'Flag port scans, DDoS signatures and lateral movement' },
      { label: 'PCAP capture on-demand',       description: 'Trigger targeted packet captures for deep analysis' },
    ],
  },
];

// ── Capability Row ─────────────────────────────────────────────────────
function CapabilityRow({ label, description, color }: {
  label: string; description: string; color: string;
}) {
  const { mode } = useColorMode();
  const isDark = mode === 'dark';
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, py: 1 }}>
      <Box sx={{
        width: 20, height: 20, borderRadius: '5px', flexShrink: 0, mt: '1px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `${color}18`,
        border: `1px solid ${color}35`,
        color: color,
      }}>
        <IconCheck />
      </Box>
      <Box>
        <Typography sx={{ fontSize: '0.82rem', color: isDark ? '#ccc' : '#111827', fontWeight: 500, lineHeight: 1.3 }}>
          {label}
        </Typography>
        <Typography sx={{ fontSize: '0.72rem', color: isDark ? '#555' : '#6b7280', mt: 0.2, lineHeight: 1.5 }}>
          {description}
        </Typography>
      </Box>
    </Box>
  );
}

// ── Agent Card ─────────────────────────────────────────────────────────
function AgentCard({ agent, onNavigate }: {
  agent: AgentDef;
  onNavigate: (href: string, label: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const { mode } = useColorMode();
  const isDark = mode === 'dark';

  const CARD_BG = isDark ? '#111111' : '#ffffff';
  const BORDER = isDark ? '#222222' : '#e5e7eb';
  const DIVIDER = isDark ? '#1e1e1e' : '#f3f4f6';
  const TEXT_MAIN = isDark ? '#e8e8e8' : '#111827';
  const TEXT_MUTED = isDark ? '#666' : '#6b7280';
  const TEXT_DIM = isDark ? '#555' : '#9ca3af';

  const statusColor = agent.status === 'live' ? '#22c55e' : '#f59e0b';
  const statusLabel = agent.status === 'live' ? 'Live' : 'Idle';

  return (
    <Box sx={{
      background: CARD_BG,
      borderRadius: '14px',
      overflow: 'hidden',
      border: `1px solid ${BORDER}`,
      transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.15s, background 0.3s ease',
      '&:hover': {
        borderColor: `${agent.color}50`,
        boxShadow: `0 0 28px ${agent.color}12`,
        transform: 'translateY(-1px)',
      },
    }}>
      {/* Top colour accent */}
      <Box sx={{ height: '2.5px', background: `linear-gradient(90deg, transparent, ${agent.color}bb, transparent)` }} />

      <Box sx={{ p: '20px 22px' }}>

        {/* Icon + name + status */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
          <Box sx={{
            width: 44, height: 44, borderRadius: '12px', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: `${agent.color}18`,
            border: `1px solid ${agent.color}35`,
            color: agent.color,
          }}>
            <agent.Icon />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.3 }}>
              <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: TEXT_MAIN }}>
                {agent.name}
              </Typography>
              {/* Status dot */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                <Box sx={{
                  width: 6, height: 6, borderRadius: '50%', bgcolor: statusColor,
                  boxShadow: agent.status === 'live' ? `0 0 6px ${statusColor}` : 'none',
                }} />
                <Typography sx={{ fontSize: '0.65rem', color: statusColor, fontWeight: 600 }}>
                  {statusLabel}
                </Typography>
              </Box>
            </Box>
            <Typography sx={{ fontSize: '0.77rem', color: TEXT_MUTED, lineHeight: 1.45 }}>
              {agent.tagline}
            </Typography>
          </Box>
        </Box>

        {/* Divider */}
        <Box sx={{ height: '1px', bgcolor: DIVIDER, mb: 1.5 }} />

        {/* Capabilities toggle */}
        <Box
          onClick={() => setExpanded(v => !v)}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', mb: expanded ? 0.5 : 0 }}
        >
          <Typography sx={{ fontSize: '0.7rem', color: TEXT_DIM, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.09em' }}>
            {agent.capabilities.length} Capabilities
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: TEXT_DIM, fontSize: '0.7rem', fontWeight: 500, transition: 'color 0.15s', '&:hover': { color: TEXT_MUTED } }}>
            {expanded ? 'hide' : 'show'}
            <Box sx={{ transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', display: 'flex' }}>
              <IconArrow />
            </Box>
          </Box>
        </Box>

        {/* Capabilities expanded list */}
        {expanded && (
          <Box sx={{ mt: 1, borderTop: `1px solid ${DIVIDER}`, pt: 0.5 }}>
            {agent.capabilities.map((cap, i) => (
              <Box key={i} sx={{ borderBottom: i < agent.capabilities.length - 1 ? `1px solid ${DIVIDER}` : 'none' }}>
                <CapabilityRow label={cap.label} description={cap.description} color={agent.color} />
              </Box>
            ))}
          </Box>
        )}

        {/* Divider */}
        <Box sx={{ height: '1px', bgcolor: DIVIDER, mt: 1.5, mb: 1.5 }} />

        {/* CTA */}
        <Box
          onClick={() => onNavigate(agent.href, agent.name)}
          sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.8, cursor: 'pointer', color: agent.color, fontSize: '0.8rem', fontWeight: 600, transition: 'gap 0.15s', '&:hover': { gap: 1.4 } }}
        >
          Open Agent <IconArrow />
        </Box>
      </Box>
    </Box>
  );
}

// ── Hamster Loader ─────────────────────────────────────────────────────
function HamsterLoaderOverlay({ label }: { label?: string }) {
  const { mode } = useColorMode();
  const isDark = mode === 'dark';

  return (
    <Box sx={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: isDark ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.7)', backdropFilter: 'blur(6px)' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <div aria-label="Loading" role="img" className="wheel-and-hamster">
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
        {label && <Typography sx={{ fontSize: '0.85rem', color: isDark ? '#cfcfcf' : '#333', fontWeight: 500, letterSpacing: '0.02em' }}>{label}</Typography>}
      </Box>
      <style jsx>{`
        .wheel-and-hamster{--dur:1s;position:relative;width:12em;height:12em;font-size:14px}
        .wheel,.hamster,.hamster div,.spoke{position:absolute}
        .wheel,.spoke{border-radius:50%;top:0;left:0;width:100%;height:100%}
        .wheel{background:radial-gradient(100% 100% at center,hsla(0,0%,60%,0) 47.8%,hsl(0,0%,60%) 48%);z-index:2}
        .hamster{animation:hamster var(--dur) ease-in-out infinite;top:50%;left:calc(50% - 3.5em);width:7em;height:3.75em;transform:rotate(4deg) translate(-0.8em,1.85em);transform-origin:50% 0;z-index:1}
        .hamster__head{animation:hamsterHead var(--dur) ease-in-out infinite;background:hsl(30,90%,55%);border-radius:70% 30% 0 100%/40% 25% 25% 60%;box-shadow:0 -0.25em 0 hsl(30,90%,80%) inset,0.75em -1.55em 0 hsl(30,90%,90%) inset;top:0;left:-2em;width:2.75em;height:2.5em;transform-origin:100% 50%}
        .hamster__ear{animation:hamsterEar var(--dur) ease-in-out infinite;background:hsl(0,90%,85%);border-radius:50%;box-shadow:-0.25em 0 hsl(30,90%,55%) inset;top:-0.25em;right:-0.25em;width:0.75em;height:0.75em;transform-origin:50% 75%}
        .hamster__eye{animation:hamsterEye var(--dur) linear infinite;background-color:hsl(0,0%,0%);border-radius:50%;top:0.375em;left:1.25em;width:0.5em;height:0.5em}
        .hamster__nose{background:hsl(0,90%,75%);border-radius:35% 65% 85% 15%/70% 50% 50% 30%;top:0.75em;left:0;width:0.2em;height:0.25em}
        .hamster__body{animation:hamsterBody var(--dur) ease-in-out infinite;background:hsl(30,90%,90%);border-radius:50% 30% 50% 30%/15% 60% 40% 40%;box-shadow:0.1em 0.75em 0 hsl(30,90%,55%) inset,0.15em -0.5em 0 hsl(30,90%,80%) inset;top:0.25em;left:2em;width:4.5em;height:3em;transform-origin:17% 50%;transform-style:preserve-3d}
        .hamster__limb--fr,.hamster__limb--fl{clip-path:polygon(0 0,100% 0,70% 80%,60% 100%,0% 100%,40% 80%);top:2em;left:0.5em;width:1em;height:1.5em;transform-origin:50% 0}
        .hamster__limb--fr{animation:hamsterFRLimb var(--dur) linear infinite;background:linear-gradient(hsl(30,90%,80%) 80%,hsl(0,90%,75%) 80%);transform:rotate(15deg) translateZ(-1px)}
        .hamster__limb--fl{animation:hamsterFLLimb var(--dur) linear infinite;background:linear-gradient(hsl(30,90%,90%) 80%,hsl(0,90%,85%) 80%);transform:rotate(15deg)}
        .hamster__limb--br,.hamster__limb--bl{border-radius:0.75em 0.75em 0 0;clip-path:polygon(0 0,100% 0,100% 30%,70% 90%,70% 100%,30% 100%,40% 90%,0% 30%);top:1em;left:2.8em;width:1.5em;height:2.5em;transform-origin:50% 30%}
        .hamster__limb--br{animation:hamsterBRLimb var(--dur) linear infinite;background:linear-gradient(hsl(30,90%,80%) 90%,hsl(0,90%,75%) 90%);transform:rotate(-25deg) translateZ(-1px)}
        .hamster__limb--bl{animation:hamsterBLLimb var(--dur) linear infinite;background:linear-gradient(hsl(30,90%,90%) 90%,hsl(0,90%,85%) 90%);transform:rotate(-25deg)}
        .hamster__tail{animation:hamsterTail var(--dur) linear infinite;background:hsl(0,90%,85%);border-radius:0.25em 50% 50% 0.25em;box-shadow:0 -0.2em 0 hsl(0,90%,75%) inset;top:1.5em;right:-0.5em;width:1em;height:0.5em;transform:rotate(30deg) translateZ(-1px);transform-origin:0.25em 0.25em}
        .spoke{animation:spoke var(--dur) linear infinite;background:radial-gradient(100% 100% at center,hsl(0,0%,60%) 4.8%,hsla(0,0%,60%,0) 5%),linear-gradient(hsla(0,0%,55%,0) 46.9%,hsl(0,0%,65%) 47% 52.9%,hsla(0,0%,65%,0) 53%) 50% 50%/99% 99% no-repeat}
        @keyframes hamster{from,to{transform:rotate(4deg) translate(-0.8em,1.85em)}50%{transform:rotate(0) translate(-0.8em,1.85em)}}
        @keyframes hamsterHead{from,25%,50%,75%,to{transform:rotate(0)}12.5%,37.5%,62.5%,87.5%{transform:rotate(8deg)}}
        @keyframes hamsterEye{from,90%,to{transform:scaleY(1)}95%{transform:scaleY(0)}}
        @keyframes hamsterEar{from,25%,50%,75%,to{transform:rotate(0)}12.5%,37.5%,62.5%,87.5%{transform:rotate(12deg)}}
        @keyframes hamsterBody{from,25%,50%,75%,to{transform:rotate(0)}12.5%,37.5%,62.5%,87.5%{transform:rotate(-2deg)}}
        @keyframes hamsterFRLimb{from,25%,50%,75%,to{transform:rotate(50deg) translateZ(-1px)}12.5%,37.5%,62.5%,87.5%{transform:rotate(-30deg) translateZ(-1px)}}
        @keyframes hamsterFLLimb{from,25%,50%,75%,to{transform:rotate(-30deg)}12.5%,37.5%,62.5%,87.5%{transform:rotate(50deg)}}
        @keyframes hamsterBRLimb{from,25%,50%,75%,to{transform:rotate(-60deg) translateZ(-1px)}12.5%,37.5%,62.5%,87.5%{transform:rotate(20deg) translateZ(-1px)}}
        @keyframes hamsterBLLimb{from,25%,50%,75%,to{transform:rotate(20deg)}12.5%,37.5%,62.5%,87.5%{transform:rotate(-60deg)}}
        @keyframes hamsterTail{from,25%,50%,75%,to{transform:rotate(30deg) translateZ(-1px)}12.5%,37.5%,62.5%,87.5%{transform:rotate(10deg) translateZ(-1px)}}
        @keyframes spoke{from{transform:rotate(0)}to{transform:rotate(-1turn)}}
      `}</style>
    </Box>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────
export default function AgentsPage(): React.ReactElement {
  const router = useRouter();

  const { mode } = useColorMode();
  const isDark = mode === 'dark';
  
  
  const TITLE_COLOR = isDark ? '#e8e8e8' : '#111827';
  const SUBTITLE_COLOR = isDark ? '#555' : '#6b7280';
  const SCROLLBAR_THUMB = isDark ? '#222' : '#cbd5e1';

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const sidebarW = sidebarCollapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED;

  const [navLoading, setNavLoading] = useState(false);
  const [navLabel,   setNavLabel]   = useState('');

  const handleNavigate = (href: string, label?: string) => {
    if (!href || href === '#' || navLoading) return;
    setNavLabel(label ? `Opening ${label}...` : 'Loading...');
    setNavLoading(true);
    window.setTimeout(() => { router.push(href); }, 300);
  };

  return (
    <Box sx={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden', bgcolor: 'background.default', color: 'text.primary', transition: 'background-color 0.3s ease, color 0.3s ease' }}>
      {navLoading && <HamsterLoaderOverlay label={navLabel} />}

      <Sidebar onCollapseChange={setSidebarCollapsed} />

      <Box sx={{
        flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden',
        marginLeft: `${sidebarW}px`,
        transition: 'margin-left 0.28s cubic-bezier(0.4,0,0.2,1)',
      }}>
        <Navbar sidebarCollapsed={sidebarCollapsed} />

        <Box sx={{
          flex: 1, overflowY: 'auto', px: 3, pt: '88px', pb: 4,
          '&::-webkit-scrollbar': { width: 5 },
          '&::-webkit-scrollbar-thumb': { bgcolor: SCROLLBAR_THUMB, borderRadius: 3 },
        }}>
          {/* Page header */}
          <Box sx={{ mb: 3.5 }}>
            <Typography sx={{ fontSize: '1.1rem', fontWeight: 600, color: TITLE_COLOR, mb: 0.4 }}>
              Agents
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: SUBTITLE_COLOR }}>
              Network Operations · AI Agent Fleet
            </Typography>
          </Box>

          {/* Section label */}
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontSize: '0.68rem', color: SUBTITLE_COLOR, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
              Available agents — {AGENTS.length}
            </Typography>
          </Box>

          {/* Agent grid */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2.5 }}>
            {AGENTS.map(agent => (
              <AgentCard key={agent.id} agent={agent} onNavigate={handleNavigate} />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}