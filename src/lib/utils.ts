import { useEffect, useRef, useState } from 'react';

export function useAnimatedCounter(target: number, duration: number = 1500): number {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return value;
}

export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => savedCallback.current(), delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export function riskColor(risk: string): string {
  switch (risk) {
    case 'LOW': return '#10b981';
    case 'MODERATE': return '#f59e0b';
    case 'HIGH': return '#ef4444';
    case 'CRITICAL': return '#dc2626';
    default: return '#8a9bb0';
  }
}

export function riskBgColor(risk: string): string {
  switch (risk) {
    case 'LOW': return 'rgba(16, 185, 129, 0.12)';
    case 'MODERATE': return 'rgba(245, 158, 11, 0.12)';
    case 'HIGH': return 'rgba(239, 68, 68, 0.12)';
    case 'CRITICAL': return 'rgba(220, 38, 38, 0.15)';
    default: return 'rgba(138, 155, 176, 0.12)';
  }
}

export function severityColor(sev: string): string {
  switch (sev) {
    case 'HIGH': return '#ef4444';
    case 'MEDIUM': return '#f59e0b';
    case 'INFO': return '#38b6ff';
    default: return '#8a9bb0';
  }
}

export function formatCoord(lat: number, lon: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lonDir = lon >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(3)}°${latDir}, ${Math.abs(lon).toFixed(3)}°${lonDir}`;
}

export function getRiskLevel(score: number): string {
  if (score < 35) return 'LOW';
  if (score < 55) return 'MODERATE';
  if (score < 75) return 'HIGH';
  return 'CRITICAL';
}
