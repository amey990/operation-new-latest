'use client';

import {
  Box, Typography, TextField, Button, Link,
  IconButton, Stack, Avatar, AvatarGroup, InputAdornment,
} from '@mui/material';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { keyframes } from '@mui/system';

const GREEN = '#783CB4';

const formEnter = keyframes`
  0%   { opacity: 0; transform: scale(0.94) translateY(14px); filter: blur(6px); }
  60%  { filter: blur(0px); }
  100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0px); }
`;
const formExit = keyframes`
  0%   { opacity: 1; transform: scale(1) translateY(0); filter: blur(0px); }
  100% { opacity: 0; transform: scale(1.04) translateY(-10px); filter: blur(5px); }
`;
const cardFlipIn = keyframes`
  from { opacity: 0; transform: rotateX(-35deg) translateY(12px) scale(0.96); }
  to   { opacity: 1; transform: rotateX(0deg) translateY(0) scale(1); }
`;
const cardFlipOut = keyframes`
  from { opacity: 1; transform: rotateX(0deg) translateY(0) scale(1); }
  to   { opacity: 0; transform: rotateX(35deg) translateY(-12px) scale(0.96); }
`;
const dotPulse = keyframes`
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.25); }
`;
const shimmer = keyframes`
  from { background-position: -200% center; }
  to   { background-position: 200% center; }
`;
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const GoogleIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);
const StarIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
    <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z" />
  </svg>
);

const CARD_R = 20;
const NOTCH_R = 32;

function WhiteCardWithNotch({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }} preserveAspectRatio="none" viewBox="0 0 400 200">
        <defs>
          <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="12" floodColor="rgba(0,0,0,0.15)" />
          </filter>
        </defs>
        <path d={`M ${CARD_R} 0 L ${400-NOTCH_R-10} 0 A ${NOTCH_R} ${NOTCH_R} 0 0 0 ${400} ${NOTCH_R+10} L 400 ${200-CARD_R} A ${CARD_R} ${CARD_R} 0 0 1 ${400-CARD_R} 200 L ${CARD_R} 200 A ${CARD_R} ${CARD_R} 0 0 1 0 ${200-CARD_R} L 0 ${CARD_R} A ${CARD_R} ${CARD_R} 0 0 1 ${CARD_R} 0 Z`} fill="white" filter="url(#cardShadow)" />
      </svg>
      <Box sx={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>{children}</Box>
    </Box>
  );
}

type Agent = { key: string; name: string; color: string; tagline: string; bullets: string[] };
const AGENTS: Agent[] = [
  { key: 'M',  name: 'Monitor',      color: '#ef4444', tagline: 'Real-time health & SLA',  bullets: ['Live device/service health', 'Anomaly detection', 'Trend snapshots'] },
  { key: 'T',  name: 'Ticket',       color: '#3b82f6', tagline: 'Fast incident logging',    bullets: ['Auto-summary + severity', 'Recommended next steps', 'Owner + ETA hints'] },
  { key: 'Tr', name: 'Troubleshoot', color: '#10b981', tagline: 'Guided fixes',             bullets: ['Step-by-step flows', 'Safe command suggestions', 'Root-cause narrowing'] },
  { key: 'I',  name: 'Inform',       color: '#f59e0b', tagline: 'Knowledge on demand',      bullets: ['KB search', 'Runbook guidance', 'Best-practice tips'] },
  { key: 'C',  name: 'Configure',    color: '#8b5cf6', tagline: 'Config validation',        bullets: ['Compliance checks', 'Drift detection', 'Safe change hints'] },
  { key: 'P',  name: 'Packet',       color: '#ec4899', tagline: 'Traffic insights',         bullets: ['Latency/loss clues', 'Protocol anomalies', 'Capture interpretation'] },
];

function AgentPanel({ agent, visible }: { agent: Agent; visible: boolean }) {
  return (
    <Box sx={{ position: 'absolute', inset: 0, animation: visible ? `${cardFlipIn} 0.38s cubic-bezier(0.34,1.56,0.64,1) forwards` : `${cardFlipOut} 0.28s ease-in forwards`, opacity: visible ? 1 : 0, pointerEvents: visible ? 'auto' : 'none', transformOrigin: 'top center', perspective: '600px' }}>
      <Stack direction="row" spacing={1.1} alignItems="center" sx={{ mb: 0.8, pl: 0.8 }}>
        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: agent.color, animation: `${dotPulse} 2s ease-in-out infinite`, flexShrink: 0 }} />
        <Typography sx={{ fontWeight: 900, fontSize: '0.95rem', background: `linear-gradient(90deg, #111 0%, ${agent.color} 50%, #111 100%)`, backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', animation: `${shimmer} 2.4s linear infinite` }}>
          {agent.name}
        </Typography>
        <Typography sx={{ color: '#6b7280', fontSize: 12 }}>{agent.tagline}</Typography>
      </Stack>
      {agent.bullets.map((bullet, i) => (
        <Box key={bullet} sx={{ display: 'flex', alignItems: 'center', gap: 0.7, pl: 0.8, animation: `${fadeIn} 0.3s ease-out ${0.08 + i * 0.07}s both`, mb: i < agent.bullets.length - 1 ? 0.35 : 0 }}>
          <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: agent.color, opacity: 0.7, flexShrink: 0 }} />
          <Typography sx={{ color: '#374151', fontSize: 12.5, lineHeight: 1.55 }}>{bullet}</Typography>
        </Box>
      ))}
    </Box>
  );
}

type FormState = 'login' | 'register';

export default function LoginPage() {
  const router = useRouter();

  const [formState,     setFormState]     = useState<FormState>('login');
  const [rendering,     setRendering]     = useState<FormState>('login');
  const [isExitingForm, setIsExitingForm] = useState(false);
  const [activeAgent,   setActiveAgent]   = useState(0);
  const [prevAgent,     setPrevAgent]     = useState<number | null>(null);
  const [email,           setEmail]           = useState('');
  const [password,        setPassword]        = useState('');
  const [username,        setUsername]        = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword,    setShowPassword]    = useState(false);
  const [showConfirmPwd,  setShowConfirmPwd]  = useState(false);

  const isRegister = rendering === 'register';

  const toggleForm = () => {
    const next: FormState = formState === 'login' ? 'register' : 'login';
    setIsExitingForm(true);
    setFormState(next);
    setTimeout(() => {
      setRendering(next);
      setIsExitingForm(false);
      setEmail(''); setPassword(''); setUsername('');
      setConfirmPassword(''); setShowPassword(false); setShowConfirmPwd(false);
    }, 260);
  };

  const handleAgentClick = (idx: number) => {
    if (idx === activeAgent) return;
    setPrevAgent(activeAgent);
    setActiveAgent(idx);
    setTimeout(() => setPrevAgent(null), 400);
  };

  // ── Navigate to dashboard on Sign in ─────────
  const handleSignIn = () => router.push('/pages/dashboard');

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#ffffff', borderRadius: '10px',
      '& input': { 
        color: '#111', 
        py: 1.2, 
        px: 2, 
        fontSize: '0.9rem',
        // Override browser autofill background color
        '&:-webkit-autofill': {
          WebkitBoxShadow: '0 0 0 1000px #ffffff inset !important',
          WebkitTextFillColor: '#111 !important',
          borderRadius: '10px',
        }
      },
      '& fieldset': { border: 'none' },
      '&:hover fieldset': { border: 'none' },
      '&.Mui-focused fieldset': { border: `2px solid ${GREEN}` },
    },
  };

  return (
    <Box sx={{ width: '100vw', height: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(145deg, #150a21 0%, #09040e 50%, #150a21 100%)' }}>
      <Box sx={{ position: 'relative', width: '90vw', maxWidth: 1000, height: '80vh', maxHeight: 600, borderRadius: '24px', background: 'linear-gradient(160deg, #1c0d2e 0%, #0e0617 55%, #150a22 100%)', boxShadow: '0 30px 80px rgba(0,0,0,0.65)', display: 'flex', overflow: 'visible' }}>

        {/* LEFT — Form */}
        <Box sx={{ flex: '0 0 52%', display: 'flex', flexDirection: 'column', justifyContent: 'center', px: { xs: 4, md: 5 }, py: 2.5, borderRadius: '24px 0 0 24px', overflow: 'hidden', position: 'relative' }}>
          <Box key={rendering} sx={{ animation: isExitingForm ? `${formExit} 0.26s cubic-bezier(0.4,0,1,1) forwards` : `${formEnter} 0.45s cubic-bezier(0.22,1,0.36,1) forwards`, display: 'flex', flexDirection: 'column' }}>

            <Box sx={{ mb: 2 }}>
              <Image src="/assets/commedialogo.jpg" alt="Commedia Logo" width={130} height={44} priority style={{ objectFit: 'contain' }} />
            </Box>

            <Typography sx={{ fontWeight: 900, color: '#fff', fontSize: '1.8rem', lineHeight: 1.1, mb: 0.6 }}>
              {isRegister ? 'Create Account' : 'Welcome back'}
            </Typography>
            <Typography sx={{ color: '#9b8ca8', fontSize: '0.85rem', mb: 1.8 }}>
              {isRegister ? 'Please fill in your details to register' : 'Please Enter your Account details'}
            </Typography>

            {isRegister && (<>
              <Typography sx={{ color: '#fff', fontSize: '0.8rem', fontWeight: 600, mb: 0.2 }}>Username</Typography>
              <TextField fullWidth variant="outlined" value={username} onChange={e => setUsername(e.target.value)} sx={{ ...inputSx, mb: 1.4 }} />
            </>)}

            <Typography sx={{ color: '#fff', fontSize: '0.8rem', fontWeight: 600, mb: 0.2 }}>Email</Typography>
            <TextField fullWidth variant="outlined" value={email} onChange={e => setEmail(e.target.value)} sx={{ ...inputSx, mb: 1.4 }} />

            <Typography sx={{ color: '#fff', fontSize: '0.8rem', fontWeight: 600, mb: 0.2 }}>Password</Typography>
            <TextField fullWidth variant="outlined" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} sx={{ ...inputSx, mb: isRegister ? 1.4 : 0.8 }}
              InputProps={{ endAdornment: <InputAdornment position="end"><Box onClick={() => setShowPassword(!showPassword)} sx={{ color: '#8b799c', cursor: 'pointer', display: 'flex', alignItems: 'center', pr: 1 }}>{showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}</Box></InputAdornment> }}
            />

            {isRegister && (<>
              <Typography sx={{ color: '#fff', fontSize: '0.8rem', fontWeight: 600, mb: 0.2 }}>Confirm Password</Typography>
              <TextField fullWidth variant="outlined" type={showConfirmPwd ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} sx={{ ...inputSx, mb: 2.6 }}
                InputProps={{ endAdornment: <InputAdornment position="end"><Box onClick={() => setShowConfirmPwd(!showConfirmPwd)} sx={{ color: '#8b799c', cursor: 'pointer', display: 'flex', alignItems: 'center', pr: 1 }}>{showConfirmPwd ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}</Box></InputAdornment> }}
              />
            </>)}

            {!isRegister && (
              <Box sx={{ textAlign: 'right', mb: 2.8 }}>
                <Link underline="always" sx={{ color: '#fff', fontSize: '0.8rem', cursor: 'pointer', transition: 'color 0.2s ease', '&:hover': { color: GREEN } }}>Forgot Password</Link>
              </Box>
            )}

            <Button fullWidth variant="contained"
              onClick={isRegister ? undefined : handleSignIn}
              sx={{ backgroundColor: GREEN, color: '#fff', py: 1.3, fontSize: '0.9rem', fontWeight: 700, borderRadius: '12px', textTransform: 'none', mb: 2.2, boxShadow: 'none', transition: 'background-color 0.2s, transform 0.15s', '&:hover': { backgroundColor: '#6a33a0', boxShadow: 'none', transform: 'translateY(-1px)' }, '&:active': { transform: 'translateY(0)' } }}
            >
              {isRegister ? 'Register' : 'Sign in'}
            </Button>

            {!isRegister && (
              <Stack direction="row" spacing={1.5} justifyContent="center" sx={{ mb: 3 }}>
                <IconButton sx={{ width: 46, height: 46, backgroundColor: '#fff', border: '1.5px solid #e5e7eb', borderRadius: '50%', transition: 'transform 0.18s, box-shadow 0.18s', '&:hover': { backgroundColor: '#f3f4f6', transform: 'scale(1.08)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' } }}>
                  <GoogleIcon />
                </IconButton>
              </Stack>
            )}
          </Box>
        </Box>

        {/* RIGHT — Floating Cards */}
        <Box sx={{ display: { xs: 'none', md: 'block' }, position: 'absolute', left: '50%', top: '-28px', width: '56%', height: 'calc(100% + 56px)' }}>
          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: '26%', backgroundColor: GREEN, borderRadius: '22px', p: 3.5, overflow: 'hidden', display: 'flex', flexDirection: 'column', zIndex: 1 }}>
            <Box sx={{ position: 'absolute', right: 22, bottom: 90, width: 170, height: 170, opacity: 0.22, zIndex: 0, pointerEvents: 'none' }}>
              <Image src="/assets/Star.png" alt="" fill sizes="170px" quality={100} style={{ objectFit: 'contain', transform: 'scale(1.25)', filter: 'brightness(0) invert(1) drop-shadow(0 10px 22px rgba(0,0,0,0.22))' }} />
            </Box>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography sx={{ fontWeight: 900, color: '#fff', fontSize: '1.65rem', lineHeight: 1.15, mb: 1.2 }}>Intelligent Operations<br />Management</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.95)', fontSize: '0.86rem', lineHeight: 1.7 }}>
                "Transform your network operations with our AI-powered advisor. From proactive monitoring to automated troubleshooting, our intelligent agents work 24/7 to ensure optimal performance."
              </Typography>
            </Box>
          </Box>

          <Box sx={{ position: 'absolute', bottom: 0, left: '4%', right: '2%', height: '42%', zIndex: 2 }}>
            <WhiteCardWithNotch>
              <Box sx={{ p: '18px 22px 16px 22px', height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', gap: 1.1 }}>
                <Typography sx={{ fontWeight: 900, color: '#111', fontSize: '1.08rem', lineHeight: 1.25, letterSpacing: '-0.02em' }}>Meet Your AI Agent Squad</Typography>
                <Typography sx={{ color: '#6b7280', fontSize: '0.8rem', lineHeight: 1.45 }}>Six focused agents collaborate to monitor, triage, troubleshoot and validate changes — all from one workspace.</Typography>
                <Box sx={{ mt: 0.4, bgcolor: '#F6F7F8', border: '1px solid rgba(17,24,39,0.10)', borderRadius: '14px', p: '12px 14px 12px 20px', flex: 1, overflow: 'hidden', position: 'relative', perspective: '600px', borderLeft: `3px solid ${AGENTS[activeAgent].color}`, transition: 'border-color 0.35s ease' }}>
                  {prevAgent !== null && <AgentPanel key={`prev-${prevAgent}`} agent={AGENTS[prevAgent]} visible={false} />}
                  <AgentPanel key={`active-${activeAgent}`} agent={AGENTS[activeAgent]} visible={true} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 'auto' }}>
                  <AvatarGroup max={6} sx={{ '& .MuiAvatar-root': { width: 26, height: 26, fontSize: '0.55rem', border: '2px solid #fff', fontWeight: 800, cursor: 'pointer', transition: 'all 0.22s cubic-bezier(0.34,1.56,0.64,1)', '&:hover': { transform: 'scale(1.18) translateY(-2px)', zIndex: 10 } } }}>
                    {AGENTS.map((a, idx) => (
                      <Avatar key={a.key} onClick={() => handleAgentClick(idx)} sx={{ bgcolor: idx === activeAgent ? GREEN : a.color, opacity: idx === activeAgent ? 1 : 0.85, transform: idx === activeAgent ? 'scale(1.15) translateY(-2px)' : 'scale(1)', boxShadow: idx === activeAgent ? `0 0 0 2px ${GREEN}44, 0 4px 10px ${GREEN}44` : 'none', transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)', zIndex: idx === activeAgent ? 5 : 1 }} title={a.name}>{a.key}</Avatar>
                    ))}
                  </AvatarGroup>
                </Box>
              </Box>
            </WhiteCardWithNotch>
            <Box sx={{ position: 'absolute', top: '-15px', right: '-10px', width: 56, height: 56, backgroundColor: '#0e0617', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.4)', border: `3px solid ${GREEN}`, transition: 'transform 0.3s, box-shadow 0.3s', cursor: 'pointer', '&:hover': { transform: 'rotate(45deg) scale(1.1)', boxShadow: `0 4px 24px ${GREEN}66` } }}>
              <StarIcon />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}