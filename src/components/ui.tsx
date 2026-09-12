import type { ReactNode } from 'react';
import { ArrowDown, ArrowUp, Minus, MoreHorizontal } from 'lucide-react';
import { riskBgColor, riskColor, severityColor } from '@/lib/utils';

interface GlassCardProps { children: ReactNode; className?: string; onClick?: () => void; noPadding?: boolean; }
export function GlassCard({ children, className = '', onClick, noPadding = false }: GlassCardProps) {
  return <div className={`glass-panel ${noPadding ? '' : 'p-4'} transition-all duration-300 hover:border-[rgba(56,182,255,0.25)] ${onClick ? 'cursor-pointer hover:glow-ice' : ''} ${className}`} onClick={onClick}>{children}</div>;
}

interface SectionHeaderProps { title: string; subtitle?: string; icon?: ReactNode; action?: ReactNode; className?: string; }
export function SectionHeader({ title, subtitle, icon, action, className = '' }: SectionHeaderProps) {
  return <div className={`flex items-center justify-between gap-4 ${className}`}><div className="flex items-center gap-3">{icon && <div className="text-[#38b6ff]">{icon}</div>}<div><h2 className="text-sm font-semibold tracking-[0.12em] text-[#e8eef5] uppercase">{title}</h2>{subtitle && <p className="mt-1 text-xs text-[#5a6a7e]">{subtitle}</p>}</div></div>{action}</div>;
}

interface StatusBadgeProps { label: string; color?: string; dot?: boolean; pulse?: boolean; }
export function StatusBadge({ label, color = '#38b6ff', dot = true, pulse = false }: StatusBadgeProps) {
  return <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wider" style={{ color, backgroundColor: `${color}18`, border: `1px solid ${color}35` }}>{dot && <span className={`h-1.5 w-1.5 rounded-full ${pulse ? 'animate-pulse-soft' : ''}`} style={{ backgroundColor: color }} />}{label}</span>;
}

export function RiskBadge({ risk, small = false }: { risk: string; small?: boolean }) {
  const color = riskColor(risk);
  return <span className={`inline-flex items-center gap-1 rounded-md font-semibold tracking-wider ${small ? 'px-1.5 py-0.5 text-[9px]' : 'px-2 py-1 text-[10px]'}`} style={{ color, backgroundColor: riskBgColor(risk), border: `1px solid ${color}35` }}><span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />{risk}</span>;
}

interface MetricCardProps { label: string; value: string | number; unit?: string; icon: ReactNode; accent?: string; trend?: { value: string; positive: boolean }; footer?: string; onClick?: () => void; }
export function MetricCard({ label, value, unit, icon, accent = '#38b6ff', trend, footer, onClick }: MetricCardProps) {
  return <GlassCard onClick={onClick} className="group relative overflow-hidden"><div className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-30" style={{ backgroundColor: accent }} /><div className="relative flex items-start justify-between"><div><p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#5a6a7e]">{label}</p><div className="mt-2 flex items-baseline gap-1.5"><span className="font-mono text-2xl font-semibold text-[#e8eef5]">{value}</span>{unit && <span className="text-xs text-[#8a9bb0]">{unit}</span>}</div>{trend && <div className={`mt-1 flex items-center gap-1 text-[10px] ${trend.positive ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>{trend.positive ? <ArrowUp size={11} /> : <ArrowDown size={11} />}{trend.value}</div>}{footer && <p className="mt-1 text-[10px] text-[#5a6a7e]">{footer}</p>}</div><div className="rounded-lg p-2.5" style={{ backgroundColor: `${accent}15`, color: accent }}>{icon}</div></div></GlassCard>;
}

export function ProgressBar({ value, color = '#38b6ff', height = 4, showValue = false }: { value: number; color?: string; height?: number; showValue?: boolean }) {
  return <div className="flex items-center gap-2"><div className="flex-1 overflow-hidden rounded-full bg-[#1a2438]" style={{ height }}><div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(value, 100)}%`, backgroundColor: color, boxShadow: `0 0 8px ${color}55` }} /></div>{showValue && <span className="font-mono text-[10px] text-[#8a9bb0]">{value}%</span>}</div>;
}

export function CircularGauge({ value, label, color = '#38b6ff', size = 120, sublabel }: { value: number; label: string; color?: string; size?: number; sublabel?: string }) {
  const strokeWidth = size > 100 ? 8 : 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return <div className="relative flex flex-col items-center" style={{ width: size }}><svg width={size} height={size} className="-rotate-90"><circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#1a2438" strokeWidth={strokeWidth} /><circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-1000" style={{ filter: `drop-shadow(0 0 5px ${color}66)` }} /></svg><div className="absolute inset-0 flex flex-col items-center justify-center"><span className="font-mono text-xl font-semibold" style={{ color }}>{value}%</span>{sublabel && <span className="mt-0.5 text-[8px] uppercase tracking-wider text-[#5a6a7e]">{sublabel}</span>}</div><span className="mt-2 text-[10px] font-medium uppercase tracking-wider text-[#8a9bb0]">{label}</span></div>;
}

export function Sparkline({ data, color = '#38b6ff', height = 40, filled = false }: { data: number[]; color?: string; height?: number; filled?: boolean }) {
  const width = 140;
  const max = Math.max(...data); const min = Math.min(...data); const range = max - min || 1;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - 4 - ((v - min) / range) * (height - 8)}`).join(' ');
  return <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">{filled && <polygon points={`0,${height} ${points} ${width},${height}`} fill={color} opacity="0.1" />}<polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><circle cx={width} cy={height - 4 - ((data[data.length - 1] - min) / range) * (height - 8)} r="2.5" fill={color} /></svg>;
}

export function MiniLineChart({ data, color = '#38b6ff', height = 100, labels = false }: { data: number[]; color?: string; height?: number; labels?: boolean }) {
  const width = 500; const padding = { top: 10, right: 8, bottom: labels ? 22 : 8, left: 8 }; const chartHeight = height - padding.top - padding.bottom; const max = Math.max(...data) + 5; const min = Math.max(0, Math.min(...data) - 5); const range = max - min || 1;
  const points = data.map((v, i) => `${padding.left + (i / (data.length - 1)) * (width - padding.left - padding.right)},${padding.top + chartHeight - ((v - min) / range) * chartHeight}`).join(' ');
  return <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="none">{[0, 1, 2, 3].map((i) => <line key={i} x1={padding.left} x2={width - padding.right} y1={padding.top + (chartHeight / 3) * i} y2={padding.top + (chartHeight / 3) * i} stroke="rgba(56,182,255,0.07)" strokeWidth="1" />)}<polygon points={`${padding.left},${padding.top + chartHeight} ${points} ${width - padding.right},${padding.top + chartHeight}`} fill={color} opacity="0.08" /><polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />{data.map((v, i) => { const cx = padding.left + (i / (data.length - 1)) * (width - padding.left - padding.right); const cy = padding.top + chartHeight - ((v - min) / range) * chartHeight; return <circle key={i} cx={cx} cy={cy} r="3" fill="#0d1420" stroke={color} strokeWidth="1.5" />; })}{labels && ['00h', '03h', '06h', '09h', '12h', '15h', '18h', '21h', '24h'].map((label, i) => <text key={label} x={padding.left + (i / 8) * (width - padding.left - padding.right)} y={height - 5} textAnchor="middle" fill="#5a6a7e" fontSize="9">{label}</text>)}</svg>;
}

export function DottedMenu() { return <MoreHorizontal size={16} className="text-[#5a6a7e]" />; }
export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (checked: boolean) => void; label?: string }) { return <label className="flex cursor-pointer items-center gap-3">{label && <span className="text-xs text-[#8a9bb0]">{label}</span>}<button type="button" onClick={() => onChange(!checked)} className={`relative h-5 w-9 rounded-full transition-colors ${checked ? 'bg-[#0077b6]' : 'bg-[#243049]'}`}><span className={`absolute top-0.5 h-4 w-4 rounded-full bg-[#e8eef5] shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-0.5'}`} /></button></label>; }
export function SeverityBadge({ severity }: { severity: string }) { const color = severityColor(severity); return <span className="rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider" style={{ color, backgroundColor: `${color}18` }}>{severity}</span>; }
export function TrendIndicator({ value, positive }: { value: string; positive: boolean | null }) { const color = positive === null ? '#8a9bb0' : positive ? '#10b981' : '#ef4444'; return <span className="inline-flex items-center gap-0.5 text-[10px]" style={{ color }}>{positive === null ? <Minus size={11} /> : positive ? <ArrowUp size={11} /> : <ArrowDown size={11} />}{value}</span>; }
