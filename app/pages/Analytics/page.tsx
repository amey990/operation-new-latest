'use client';

import React, { useState, useMemo } from 'react';
import { Box, Typography, MenuItem, Select } from '@mui/material';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import Sidebar from '../../components/sidebar';
import Navbar from '../../components/navbar';
import { useColorMode } from '../../../theme/ThemeRegistry';

const PURPLE = '#783CB4'; // Updated brand color
const SIDEBAR_EXPANDED  = 260;
const SIDEBAR_COLLAPSED = 70;

// ── Icons ──────────────────────────────────────────────────────────────
const IUp    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;
const IDn    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>;
const ICal   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;

// ── Projects & ranges ──────────────────────────────────────────────────
const PROJECTS    = [
  { id:'all', name:'All Projects', color:'' },
  { id:'p1',  name:'Network Ops — Site A', color:'#3b82f6' },
  { id:'p2',  name:'Core Switch Fleet',    color:'#8b5cf6' },
  { id:'p3',  name:'Incident Playbooks',   color:'#10b981' },
];
const TIME_RANGES = ['Last 7 days','Last 30 days','Last 90 days','This year'];

// ── Deterministic RNG ──────────────────────────────────────────────────
function rng(seed: number) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
}

function makeData(pid: string, range: string) {
  const r     = rng((pid.charCodeAt(0)||97)*31 + range.length*7);
  const isYr  = range.includes('year');
  const count = isYr ? 12 : range.includes('7') ? 7 : range.includes('30') ? 30 : 90;
  const labels = isYr
    ? ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    : Array.from({length:count},(_,i)=>{ const d=new Date(); d.setDate(d.getDate()-(count-1-i)); return count<=7?d.toLocaleDateString('en',{weekday:'short'}):`${d.getMonth()+1}/${d.getDate()}`; });

  // Use only every 3rd label when > 30 pts, for readability
  const skip = count > 30 ? 3 : 1;
  const tick = (_: any, i: number) => i % skip === 0;

  const uptime    = labels.map(l=>({ l, uptime: +(97+r()*2.5).toFixed(2),   latency: +(2+r()*9).toFixed(1), loss: +(r()*1.1).toFixed(2) }));
  const agentAct  = labels.map(l=>({ l, monitor:~~(100+r()*90), ticket:~~(15+r()*45), troubleshoot:~~(8+r()*30), configure:~~(4+r()*22), packet:~~(35+r()*65) }));
  const tickets   = labels.map(l=>({ l, opened:~~(3+r()*14), resolved:~~(2+r()*13), breach:~~(r()*4) }));
  const devices   = labels.map(l=>({ l, healthy:~~(330+r()*60), degraded:~~(4+r()*22), offline:~~(r()*9) }));
  const configs   = labels.map(l=>({ l, deployed:~~(2+r()*16), rollback:~~(r()*4), pending:~~(r()*6) }));
  const radar     = [
    {s:'Monitor',    v:~~(82+r()*16)},{s:'Ticket',      v:~~(74+r()*22)},
    {s:'Troubleshoot',v:~~(70+r()*24)},{s:'Inform',    v:~~(78+r()*20)},
    {s:'Configure',  v:~~(72+r()*22)},{s:'Packet',     v:~~(76+r()*20)},
  ];
  const donut     = [
    {n:'Connectivity',v:~~(22+r()*20),c:'#3b82f6'},
    {n:'Hardware',    v:~~(14+r()*16),c:'#ef4444'},
    {n:'Config Drift',v:~~(9+r()*13), c:'#f59e0b'},
    {n:'Performance', v:~~(10+r()*11),c:'#8b5cf6'},
    {n:'Security',    v:~~(4+r()*9),  c:'#ec4899'},
    {n:'Other',       v:~~(2+r()*6),  c:'#444'   },
  ];
  const health = [
    { label:'Network Health',  val:~~(88+r()*11), color:PURPLE,     desc:'Core links stable · Redundancy active · 0 critical alerts' },
    { label:'Agent Fleet',     val:~~(93+r()*7),  color:'#3b82f6', desc:'All 6 agents online · Avg response < 190ms · 99.4% accuracy' },
    { label:'Security Posture',val:~~(76+r()*18), color:'#f59e0b', desc:'2–4 low-severity findings · Patch compliance 94%' },
  ];
  return { uptime, agentAct, tickets, devices, configs, radar, donut, health, tick };
}

function makeKPIs(pid: string) {
  const r = rng((pid.charCodeAt(0)||97)*53+11);
  return [
    { label:'Network Uptime',   val:`${(97.8+r()*2).toFixed(1)}%`, delta:'+0.4%', up:true,  c:PURPLE,   icon:'wifi'    },
    { label:'Avg Latency',      val:`${(2.8+r()*5).toFixed(1)}ms`, delta:'-0.6ms',up:true,  c:'#3b82f6', icon:'cpu'     },
    { label:'Open Tickets',     val:`${~~(6+r()*28)}`,             delta:'-14%',  up:true,  c:'#f59e0b', icon:'ticket'  },
    { label:'Agent Uptime',     val:`${(99+r()*0.9).toFixed(1)}%`, delta:'+0.1%', up:true,  c:'#8b5cf6', icon:'bot'     },
    { label:'Devices Online',   val:`${~~(338+r()*85)}`,           delta:'+7',    up:true,  c:'#06b6d4', icon:'server'  },
    { label:'Config Rollbacks', val:`${~~(r()*7)}`,                delta:'-2',    up:true,  c:'#ec4899', icon:'config'  },
    { label:'SLA Breaches',     val:`${~~(r()*5)}`,                delta:'-1',    up:true,  c:'#ef4444', icon:'shield'  },
    { label:'Threats Detected', val:`${~~(r()*14)}`,               delta:'+3',    up:false, c:'#f97316', icon:'threat'  },
  ];
}

// ── Tooltip ────────────────────────────────────────────────────────────
function TTip({ active, payload, label }: any) {
  const { mode } = useColorMode();
  const isDark = mode === 'dark';
  
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ bgcolor:isDark?'#141414':'#ffffff', border:`1px solid ${isDark?'#272727':'#e5e7eb'}`, borderRadius:'10px', px:1.6, py:1, boxShadow:isDark?'0 8px 28px rgba(0,0,0,0.7)':'0 8px 24px rgba(0,0,0,0.1)' }}>
      <Typography sx={{ fontSize:'0.65rem', color:isDark?'#555':'#6b7280', mb:0.6, fontWeight:600 }}>{label}</Typography>
      {payload.map((p:any,i:number)=>(
        <Box key={i} sx={{ display:'flex', alignItems:'center', gap:0.8, mb:0.25 }}>
          <Box sx={{ width:7, height:7, borderRadius:'50%', bgcolor:p.color||p.fill, flexShrink:0 }}/>
          <Typography sx={{ fontSize:'0.7rem', color:isDark?'#888':'#4b5563' }}>{p.name}:</Typography>
          <Typography sx={{ fontSize:'0.7rem', color:isDark?'#e0e0e0':'#111827', fontWeight:600 }}>{p.value}</Typography>
        </Box>
      ))}
    </Box>
  );
}

// ── ChartCard ──────────────────────────────────────────────────────────
function CC({ title, sub, children, col=1 }: { title:string; sub?:string; children:React.ReactNode; col?:number }) {
  const { mode } = useColorMode();
  const isDark = mode === 'dark';
  const CARD_BG = isDark ? '#0f0f0f' : '#ffffff';
  const BORDER = isDark ? '#1a1a1a' : '#e5e7eb';
  const TEXT_MAIN = isDark ? '#d0d0d0' : '#111827';
  const TEXT_MUTED = isDark ? '#555' : '#6b7280';

  return (
    <Box sx={{ gridColumn:`span ${col}`, bgcolor:CARD_BG, border:`1px solid ${BORDER}`, borderRadius:'14px', p:'18px 20px' }}>
      <Typography sx={{ fontSize:'0.8rem', fontWeight:600, color:TEXT_MAIN, mb:sub?0.2:1.5 }}>{title}</Typography>
      {sub && <Typography sx={{ fontSize:'0.65rem', color:TEXT_MUTED, mb:1.5 }}>{sub}</Typography>}
      {children}
    </Box>
  );
}

// ── Legend row ─────────────────────────────────────────────────────────
function LRow({ items }: { items:[string,string][] }) {
  const { mode } = useColorMode();
  return (
    <Box sx={{ display:'flex', flexWrap:'wrap', gap:'4px 12px', mt:1 }}>
      {items.map(([n,c])=>(
        <Box key={n} sx={{ display:'flex', alignItems:'center', gap:0.5 }}>
          <Box sx={{ width:8, height:8, borderRadius:'2px', bgcolor:c }}/>
          <Typography sx={{ fontSize:'0.61rem', color:mode==='dark'?'#555':'#6b7280' }}>{n}</Typography>
        </Box>
      ))}
    </Box>
  );
}

// ── Page ───────────────────────────────────────────────────────────────
export default function ReportsPage(): React.ReactElement {
  const [sc,  setSc]  = useState(false);
  const [pid, setPid] = useState('all');
  const [tr,  setTr]  = useState('Last 30 days');
  const sw = sc ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED;

  const { mode } = useColorMode();
  const isDark = mode === 'dark';

  
  const CARD_BG = isDark ? '#0f0f0f' : '#ffffff';
  const BORDER = isDark ? '#1a1a1a' : '#e5e7eb';
  const TEXT_MAIN = isDark ? '#e8e8e8' : '#111827';
  const TEXT_MUTED = isDark ? '#555' : '#6b7280';
  const SCROLLBAR_THUMB = isDark ? '#1e1e1e' : '#cbd5e1';

  const axT = { fontSize:'0.59rem', fill:isDark?'#3a3a3a':'#9ca3af' };

  const d    = useMemo(()=>makeData(pid,tr),[pid,tr]);
  const kpis = useMemo(()=>makeKPIs(pid),[pid]);

  const totalInc = d.donut.reduce((s,c)=>s+c.v,0);

  // Styling for the dropdown selects
  const selSx = {
    color: isDark ? '#ccc' : '#111827', 
    fontSize: '0.77rem', 
    bgcolor: 'transparent',
    height: 36, // Ensure uniform height
    '& .MuiOutlinedInput-notchedOutline': { border: 'none' }, // We handle borders on the wrapper
    '& .MuiSvgIcon-root': { color: isDark ? '#555' : '#9ca3af' },
    '& .MuiSelect-select': { py: 0, px: 1.4, display: 'flex', alignItems: 'center' }, // Center text vertically
  };

  const mpSx = {
    bgcolor: isDark ? '#131313' : '#ffffff', 
    border: `1px solid ${BORDER}`, 
    borderRadius: '10px', 
    mt: 0.5,
    boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.8)' : '0 8px 24px rgba(0,0,0,0.1)',
    '& .MuiMenuItem-root': { 
      fontSize: '0.77rem', 
      color: isDark ? '#bbb' : '#4b5563', 
      py: 0.8, 
      '&:hover': { bgcolor: isDark ? '#1a1a1a' : '#f3f4f6' }, 
      '&.Mui-selected': { bgcolor: `${PURPLE}14`, color: PURPLE }, // Changed from GREEN to PURPLE
      '&.Mui-selected:hover': { bgcolor: `${PURPLE}20` } 
    },
  };

  return (
    <Box sx={{ display:'flex', width:'100vw', height:'100vh', overflow:'hidden', transition:'background 0.3s ease' }}>
      <Sidebar onCollapseChange={setSc}/>
      <Box sx={{ flex:1, display:'flex', flexDirection:'column', height:'100vh', overflow:'hidden', marginLeft:`${sw}px`, transition:'margin-left 0.28s cubic-bezier(0.4,0,0.2,1)' }}>
        <Navbar sidebarCollapsed={sc}/>

        <Box sx={{ flex:1, overflowY:'auto', pt:'64px', px:3.5, pb:5,
          '&::-webkit-scrollbar':{ width:4 }, '&::-webkit-scrollbar-thumb':{ bgcolor:SCROLLBAR_THUMB, borderRadius:2 } }}>

          {/* Header */}
          <Box sx={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', pt:3, pb:3, borderBottom:`1px solid ${BORDER}`, mb:3 }}>
            <Box>
              <Typography sx={{ fontSize:'1rem', fontWeight:600, color:TEXT_MAIN, mb:0.3 }}>Reports</Typography>
              <Typography sx={{ fontSize:'0.7rem', color:TEXT_MUTED }}>Agent efficiency · Network health · Device status · Configuration audits</Typography>
            </Box>
            
            <Box sx={{ display:'flex', alignItems:'center', gap:1.2 }}>
              
              {/* Calendar Time Range Dropdown Wrapper */}
              <Box sx={{ 
                display:'flex', 
                alignItems:'center', 
                pl: 1.2, 
                pr: 0.5,
                bgcolor: isDark ? '#111' : '#ffffff', 
                border: `1px solid ${isDark ? '#252525' : '#e5e7eb'}`, 
                borderRadius: '9px',
                height: 38, // Fixed height
                transition: 'border 0.2s',
                '&:hover': { border: `1px solid ${isDark ? '#333' : '#d1d5db'}` }
              }}>
                <Box sx={{ color:isDark ? '#444' : '#9ca3af', display:'flex', mt: '2px' }}><ICal /></Box>
                <Select value={tr} onChange={e=>setTr(e.target.value)} sx={{ ...selSx }} MenuProps={{ PaperProps:{ sx:mpSx } }}>
                  {TIME_RANGES.map(r=><MenuItem key={r} value={r}>{r}</MenuItem>)}
                </Select>
              </Box>

              {/* All Projects Dropdown Wrapper */}
              <Box sx={{ 
                display:'flex', 
                alignItems:'center', 
                px: 0.5,
                bgcolor: isDark ? '#111' : '#ffffff', 
                border: `1px solid ${isDark ? '#252525' : '#e5e7eb'}`, 
                borderRadius: '9px',
                height: 38, // Exactly the same fixed height
                transition: 'border 0.2s',
                '&:hover': { border: `1px solid ${isDark ? '#333' : '#d1d5db'}` }
              }}>
                <Select value={pid} onChange={e=>setPid(e.target.value)} sx={{ ...selSx, minWidth:190 }} MenuProps={{ PaperProps:{ sx:mpSx } }}>
                  {PROJECTS.map(p=>(
                    <MenuItem key={p.id} value={p.id}>
                      <Box sx={{ display:'flex', alignItems:'center', gap:1 }}>
                        {p.color && <Box sx={{ width:7, height:7, borderRadius:'50%', bgcolor:p.color, flexShrink:0 }}/>}
                        {p.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              
            </Box>
          </Box>

          {/* ── KPI strip ── */}
          <Box sx={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:1.5, mb:3.5 }}>
            {kpis.map((k,i)=>(
              <Box key={i} sx={{ px:1.8, py:1.7, borderRadius:'12px', bgcolor:CARD_BG, border:`1px solid ${BORDER}`, position:'relative', overflow:'hidden',
                '&::after':{ content:'""', position:'absolute', top:0, right:0, width:60, height:60, borderRadius:'50%', background:`radial-gradient(${k.c}20, transparent 70%)`, transform:'translate(20px,-20px)' } }}>
                <Box sx={{ display:'flex', alignItems:'center', justifyContent:'space-between', mb:1.2 }}>
                  <Box sx={{ px:0.8, py:0.3, borderRadius:'6px', bgcolor:`${k.c}15`, border:`1px solid ${k.c}22` }}>
                    <Typography sx={{ fontSize:'0.58rem', color:k.c, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.06em' }}>{k.icon}</Typography>
                  </Box>
                  <Box sx={{ display:'flex', alignItems:'center', gap:0.4, color:k.up?(isDark?'#22c55e':'#16a34a'):'#ef4444' }}>
                    {k.up?<IUp/>:<IDn/>}
                    <Typography sx={{ fontSize:'0.62rem', fontWeight:600 }}>{k.delta}</Typography>
                  </Box>
                </Box>
                <Typography sx={{ fontSize:'1.4rem', fontWeight:700, color:k.c, lineHeight:1, mb:0.4 }}>{k.val}</Typography>
                <Typography sx={{ fontSize:'0.64rem', color:TEXT_MUTED }}>{k.label}</Typography>
              </Box>
            ))}
          </Box>

          {/* ── ROW 1: Uptime area (wide) + Incident donut ── */}
          <Box sx={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:2, mb:2 }}>
            <CC title="Network Uptime" sub="Daily uptime % across all monitored devices">
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={d.uptime} margin={{top:4,right:4,left:-22,bottom:0}}>
                  <defs>
                    <linearGradient id="gu" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={PURPLE} stopOpacity={isDark?0.3:0.15}/>
                      <stop offset="100%" stopColor={PURPLE} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark?"#181818":"#f3f4f6"} vertical={false}/>
                  <XAxis dataKey="l" tick={axT} axisLine={false} tickLine={false} interval="preserveStartEnd"/>
                  <YAxis domain={[94,100]} tick={axT} axisLine={false} tickLine={false} tickFormatter={v=>`${v}%`}/>
                  <Tooltip content={<TTip/>} cursor={false}/>
                  <Area type="monotone" dataKey="uptime" name="Uptime %" stroke={PURPLE} strokeWidth={2} fill="url(#gu)" dot={false} activeDot={{r:4,fill:PURPLE,stroke:CARD_BG,strokeWidth:2}}/>
                </AreaChart>
              </ResponsiveContainer>
            </CC>

            <CC title="Incident Categories" sub="Breakdown by type">
              <Box sx={{ position:'relative', display:'flex', justifyContent:'center', mb:0.5 }}>
                <ResponsiveContainer width="100%" height={165}>
                  <PieChart>
                    <Pie data={d.donut} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={3} dataKey="v" stroke="none">
                      {d.donut.map((c,i)=><Cell key={i} fill={c.c}/>)}
                    </Pie>
                    <Tooltip content={<TTip/>} cursor={false}/>
                  </PieChart>
                </ResponsiveContainer>
                <Box sx={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-54%)', textAlign:'center', pointerEvents:'none' }}>
                  <Typography sx={{ fontSize:'1.2rem', fontWeight:700, color:TEXT_MAIN, lineHeight:1 }}>{totalInc}</Typography>
                  <Typography sx={{ fontSize:'0.55rem', color:TEXT_MUTED }}>incidents</Typography>
                </Box>
              </Box>
              <Box sx={{ display:'flex', flexWrap:'wrap', gap:'3px 10px' }}>
                {d.donut.map((c,i)=>(
                  <Box key={i} sx={{ display:'flex', alignItems:'center', gap:0.5 }}>
                    <Box sx={{ width:6, height:6, borderRadius:'50%', bgcolor:c.c }}/>
                    <Typography sx={{ fontSize:'0.6rem', color:isDark?'#666':'#6b7280' }}>{c.n} <span style={{color:isDark?'#888':'#4b5563',fontWeight:600}}>{c.v}</span></Typography>
                  </Box>
                ))}
              </Box>
            </CC>
          </Box>

          {/* ── ROW 2: Agent activity (stacked bar) + Ticket resolution (line) ── */}
          <Box sx={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:2, mb:2 }}>
            <CC title="Agent Activity" sub="Queries handled per agent">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={d.agentAct} margin={{top:4,right:4,left:-22,bottom:0}} barSize={7}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark?"#181818":"#f3f4f6"} vertical={false}/>
                  <XAxis dataKey="l" tick={axT} axisLine={false} tickLine={false} interval="preserveStartEnd"/>
                  <YAxis tick={axT} axisLine={false} tickLine={false}/>
                  <Tooltip content={<TTip/>} cursor={false}/>
                  <Bar dataKey="monitor"      name="Monitor"      fill="#ef4444" stackId="a" radius={[0,0,0,0]}/>
                  <Bar dataKey="packet"       name="Packet"       fill="#ec4899" stackId="a"/>
                  <Bar dataKey="ticket"       name="Ticket"       fill="#3b82f6" stackId="a"/>
                  <Bar dataKey="troubleshoot" name="Troubleshoot" fill="#10b981" stackId="a"/>
                  <Bar dataKey="configure"    name="Configure"    fill="#8b5cf6" stackId="a" radius={[2,2,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
              <LRow items={[['Monitor','#ef4444'],['Packet','#ec4899'],['Ticket','#3b82f6'],['Troubleshoot','#10b981'],['Configure','#8b5cf6']]}/>
            </CC>

            <CC title="Ticket Resolution" sub="Opened vs resolved vs SLA breach">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={d.tickets} margin={{top:4,right:4,left:-22,bottom:0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark?"#181818":"#f3f4f6"} vertical={false}/>
                  <XAxis dataKey="l" tick={axT} axisLine={false} tickLine={false} interval="preserveStartEnd"/>
                  <YAxis tick={axT} axisLine={false} tickLine={false}/>
                  <Tooltip content={<TTip/>} cursor={false}/>
                  <Line type="monotone" dataKey="opened"   name="Opened"    stroke="#f59e0b" strokeWidth={2} dot={false} activeDot={{r:4,strokeWidth:0}}/>
                  <Line type="monotone" dataKey="resolved" name="Resolved"  stroke={PURPLE}   strokeWidth={2} dot={false} activeDot={{r:4,strokeWidth:0}}/>
                  <Line type="monotone" dataKey="breach"   name="SLA Breach" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="5 3" dot={false} activeDot={{r:4,strokeWidth:0}}/>
                </LineChart>
              </ResponsiveContainer>
              <Box sx={{ display:'flex', gap:'12px', mt:1 }}>
                {[['Opened','#f59e0b'],['Resolved',PURPLE],['SLA Breach','#ef4444']].map(([n,c])=>(
                  <Box key={n} sx={{ display:'flex', alignItems:'center', gap:0.5 }}>
                    <Box sx={{ width:14, height:2, bgcolor:c as string, borderRadius:1 }}/>
                    <Typography sx={{ fontSize:'0.6rem', color:isDark?'#555':'#6b7280' }}>{n}</Typography>
                  </Box>
                ))}
              </Box>
            </CC>
          </Box>

          {/* ── ROW 3: Device health (area) + Config deploys (bar) + Agent radar ── */}
          <Box sx={{ display:'grid', gridTemplateColumns:'1fr 1fr 260px', gap:2, mb:2 }}>
            <CC title="Device Health" sub="Healthy / degraded / offline">
              <ResponsiveContainer width="100%" height={190}>
                <AreaChart data={d.devices} margin={{top:4,right:4,left:-22,bottom:0}}>
                  <defs>
                    {[[PURPLE,'gh'],['#f59e0b','gd'],['#ef4444','go']].map(([c,id])=>(
                      <linearGradient key={id as string} id={id as string} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={c as string} stopOpacity={isDark?0.25:0.15}/>
                        <stop offset="100%" stopColor={c as string} stopOpacity={0}/>
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark?"#181818":"#f3f4f6"} vertical={false}/>
                  <XAxis dataKey="l" tick={axT} axisLine={false} tickLine={false} interval="preserveStartEnd"/>
                  <YAxis tick={axT} axisLine={false} tickLine={false}/>
                  <Tooltip content={<TTip/>} cursor={false}/>

                  <Area type="monotone" dataKey="healthy"  name="Healthy"  stroke={PURPLE}     strokeWidth={1.8} fill="url(#gh)" dot={false}/>
                  <Area type="monotone" dataKey="degraded" name="Degraded" stroke="#f59e0b" strokeWidth={1.8} fill="url(#gd)" dot={false}/>
                  <Area type="monotone" dataKey="offline"  name="Offline"  stroke="#ef4444" strokeWidth={1.8} fill="url(#go)" dot={false}/>
                </AreaChart>
              </ResponsiveContainer>
              <LRow items={[['Healthy',PURPLE],['Degraded','#f59e0b'],['Offline','#ef4444']]}/>
            </CC>

            <CC title="Config Deployments" sub="Deployed / rolled back / pending">
              <ResponsiveContainer width="100%" height={190}>
                <BarChart data={d.configs} margin={{top:4,right:4,left:-22,bottom:0}} barGap={2} barSize={6}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark?"#181818":"#f3f4f6"} vertical={false}/>
                  <XAxis dataKey="l" tick={axT} axisLine={false} tickLine={false} interval="preserveStartEnd"/>
                  <YAxis tick={axT} axisLine={false} tickLine={false}/>
                  <Tooltip content={<TTip/>} cursor={false}/>
                  <Bar dataKey="deployed" name="Deployed" fill="#8b5cf6" radius={[3,3,0,0]}/>
                  <Bar dataKey="rollback" name="Rollback" fill="#ef4444" radius={[3,3,0,0]}/>
                  <Bar dataKey="pending"  name="Pending"  fill={isDark?"#2e2e2e":"#9ca3af"} radius={[3,3,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
              <LRow items={[['Deployed','#8b5cf6'],['Rollback','#ef4444'],['Pending',isDark?'#2e2e2e':'#9ca3af']]}/>
            </CC>

            <CC title="Agent Efficiency" sub="Composite score / agent">
              <ResponsiveContainer width="100%" height={190}>
                <RadarChart data={d.radar} margin={{top:8,right:18,left:18,bottom:8}}>
                  <PolarGrid stroke={isDark?"#1e1e1e":"#e5e7eb"} radialLines={false}/>
                  <PolarAngleAxis dataKey="s" tick={{ fontSize:'0.57rem', fill:isDark?'#555':'#6b7280' }}/>
                  <Radar name="Score" dataKey="v" stroke={PURPLE} strokeWidth={1.8} fill={PURPLE} fillOpacity={0.13} dot={{r:3,fill:PURPLE,strokeWidth:0}}/>
                  <Tooltip content={<TTip/>} cursor={false}/>
                </RadarChart>
              </ResponsiveContainer>
            </CC>
          </Box>

          {/* ── ROW 4: Latency + Packet loss + Agent totals bar ── */}
          <Box sx={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:2, mb:2 }}>
            <CC title="Avg Latency" sub="Milliseconds per period">
              <ResponsiveContainer width="100%" height={155}>
                <AreaChart data={d.uptime} margin={{top:4,right:4,left:-22,bottom:0}}>
                  <defs>
                    <linearGradient id="gl" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={isDark?0.3:0.15}/>
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark?"#181818":"#f3f4f6"} vertical={false}/>
                  <XAxis dataKey="l" tick={axT} axisLine={false} tickLine={false} interval="preserveStartEnd"/>
                  <YAxis tick={axT} axisLine={false} tickLine={false} tickFormatter={v=>`${v}ms`}/>
                  <Tooltip content={<TTip/>} cursor={false}/>
                  <Area type="monotone" dataKey="latency" name="Latency (ms)" stroke="#3b82f6" strokeWidth={2} fill="url(#gl)" dot={false}/>
                </AreaChart>
              </ResponsiveContainer>
            </CC>

            <CC title="Packet Loss %" sub="Daily average">
              <ResponsiveContainer width="100%" height={155}>
                <BarChart data={d.uptime} margin={{top:4,right:4,left:-22,bottom:0}} barSize={5}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark?"#181818":"#f3f4f6"} vertical={false}/>
                  <XAxis dataKey="l" tick={axT} axisLine={false} tickLine={false} interval="preserveStartEnd"/>
                  <YAxis tick={axT} axisLine={false} tickLine={false} tickFormatter={v=>`${v}%`}/>
                  <Tooltip content={<TTip/>} cursor={false}/>
                  <Bar dataKey="loss" name="Packet Loss %" fill="#ec4899" radius={[3,3,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </CC>

            {/* Agent totals summary */}
            <CC title="Agent Period Totals" sub="Total queries handled">
              <Box sx={{ mt:0.5 }}>
                {([
                  ['Monitor',      d.agentAct.reduce((s,r)=>s+r.monitor,0),      '#ef4444'],
                  ['Packet',       d.agentAct.reduce((s,r)=>s+r.packet,0),       '#ec4899'],
                  ['Ticket',       d.agentAct.reduce((s,r)=>s+r.ticket,0),       '#3b82f6'],
                  ['Troubleshoot', d.agentAct.reduce((s,r)=>s+r.troubleshoot,0), '#10b981'],
                  ['Configure',    d.agentAct.reduce((s,r)=>s+r.configure,0),    '#8b5cf6'],
                ] as [string,number,string][]).map(([name, total, color], i, arr) => {
                  const max = Math.max(...arr.map(x=>x[1]));
                  const pct = Math.round(total/max*100);
                  return (
                    <Box key={name} sx={{ mb: i<arr.length-1?1.3:0 }}>
                      <Box sx={{ display:'flex', alignItems:'center', justifyContent:'space-between', mb:0.4 }}>
                        <Box sx={{ display:'flex', alignItems:'center', gap:0.6 }}>
                          <Box sx={{ width:7, height:7, borderRadius:'50%', bgcolor:color }}/>
                          <Typography sx={{ fontSize:'0.7rem', color:isDark?'#888':'#6b7280' }}>{name}</Typography>
                        </Box>
                        <Typography sx={{ fontSize:'0.7rem', color:isDark?'#ccc':'#111827', fontWeight:600 }}>{total.toLocaleString()}</Typography>
                      </Box>
                      <Box sx={{ height:3, borderRadius:2, bgcolor:isDark?'#1a1a1a':'#e5e7eb' }}>
                        <Box sx={{ height:'100%', width:`${pct}%`, bgcolor:color, borderRadius:2 }}/>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </CC>
          </Box>

          {/* ── Health scores ── */}
          <Box sx={{ mt:0.5 }}>
            <Typography sx={{ fontSize:'0.62rem', color:TEXT_MUTED, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.1em', mb:1.5 }}>
              Overall Health — {PROJECTS.find(p=>p.id===pid)?.name}
            </Typography>
            <Box sx={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:1.5 }}>
              {d.health.map(h=>(
                <Box key={h.label} sx={{ px:2, py:1.8, borderRadius:'12px', bgcolor:CARD_BG, border:`1px solid ${BORDER}`, position:'relative', overflow:'hidden',
                  '&::before':{ content:'""', position:'absolute', top:0, right:0, width:80, height:80, borderRadius:'50%', background:`radial-gradient(${h.color}18, transparent 65%)`, transform:'translate(20px,-20px)' } }}>
                  <Box sx={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', mb:1 }}>
                    <Typography sx={{ fontSize:'0.76rem', fontWeight:600, color:isDark?'#ccc':'#111827', maxWidth:'70%', lineHeight:1.35 }}>{h.label}</Typography>
                    <Typography sx={{ fontSize:'1.8rem', fontWeight:700, color:h.color, lineHeight:1 }}>{h.val}</Typography>
                  </Box>
                  <Box sx={{ height:4, borderRadius:2, bgcolor:isDark?'#1a1a1a':'#e5e7eb', overflow:'hidden', mb:1.2 }}>
                    <Box sx={{ height:'100%', width:`${h.val}%`, background:`linear-gradient(90deg, ${h.color}80, ${h.color})`, borderRadius:2 }}/>
                  </Box>
                  <Typography sx={{ fontSize:'0.65rem', color:isDark?'#4a4a4a':'#6b7280', lineHeight:1.55 }}>{h.desc}</Typography>
                </Box>
              ))}
            </Box>
          </Box>

        </Box>
      </Box>
    </Box>
  );
}