import type { ReactNode } from 'react';

export const CELL = 36;

export type Facing = 'E' | 'S' | 'W' | 'N';

const ROT: Record<Facing, number> = { E: 0, S: 90, W: 180, N: 270 };

const at = (c: number, r: number): string => `translate(${c * CELL},${r * CELL})`;

const cellTransform = (c: number, r: number, facing?: Facing): string =>
  facing && facing !== 'E' ? `${at(c, r)} rotate(${ROT[facing]},${CELL / 2},${CELL / 2})` : at(c, r);

export function Scene({
  cols,
  rows,
  top = 12,
  bottom = 28,
  children,
}: {
  cols: number;
  rows: number;
  top?: number;
  bottom?: number;
  children: ReactNode;
}) {
  const w = cols * CELL + 16;
  const h = rows * CELL + 16 + top + bottom;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} className="diagram-svg" role="img">
      <g transform={`translate(8,${8 + top})`}>{children}</g>
    </svg>
  );
}

export function Grid({ cols, rows }: { cols: number; rows: number }) {
  const lines: ReactNode[] = [];
  for (let i = 0; i <= cols; i++) {
    lines.push(<line key={`v${i}`} x1={i * CELL} y1={0} x2={i * CELL} y2={rows * CELL} />);
  }
  for (let j = 0; j <= rows; j++) {
    lines.push(<line key={`h${j}`} x1={0} y1={j * CELL} x2={cols * CELL} y2={j * CELL} />);
  }
  return <g className="grid">{lines}</g>;
}

export function Block({ c, r, fill = '#3d444f' }: { c: number; r: number; fill?: string }) {
  return (
    <g transform={at(c, r)}>
      <rect x={1} y={1} width={CELL - 2} height={CELL - 2} rx={3} fill={fill} stroke="#20242b" />
    </g>
  );
}

export function Ghost({ c, r }: { c: number; r: number }) {
  return (
    <g transform={at(c, r)}>
      <rect x={3} y={3} width={CELL - 6} height={CELL - 6} rx={3} className="ghost" />
    </g>
  );
}

export function dustColor(level: number): string {
  const t = Math.max(0, Math.min(1, level / 15));
  const mix = [77, 49, 40].map((v, i) => Math.round(v + ([255, 74, 43][i] - v) * t));
  return `rgb(${mix[0]},${mix[1]},${mix[2]})`;
}

export function Dust({ c, r, level = 15 }: { c: number; r: number; level?: number }) {
  const col = dustColor(level);
  const x = c * CELL + CELL / 2;
  const y = r * CELL + CELL / 2;
  return (
    <g>
      <line x1={x - 12} y1={y} x2={x + 12} y2={y} stroke={col} strokeWidth={4} strokeLinecap="round" />
      <line x1={x} y1={y - 12} x2={x} y2={y + 12} stroke={col} strokeWidth={4} strokeLinecap="round" />
      <rect x={x - 3} y={y - 3} width={6} height={6} fill={col} />
    </g>
  );
}

export function DustOnBlock({ c, r, level = 15 }: { c: number; r: number; level?: number }) {
  return (
    <>
      <Block c={c} r={r} />
      <Dust c={c} r={r} level={level} />
    </>
  );
}

export function Torch({ c, r, lit = true }: { c: number; r: number; lit?: boolean }) {
  return (
    <g transform={at(c, r)}>
      <rect x={15} y={16} width={6} height={15} rx={1.5} fill="#8a6b46" />
      <circle cx={18} cy={14} r={5.5} fill={lit ? '#ff5a36' : '#5b6068'} />
      {lit && <circle cx={18} cy={14} r={2.4} fill="#ffd166" />}
    </g>
  );
}

export function Lever({ c, r, on = true }: { c: number; r: number; on?: boolean }) {
  return (
    <g transform={at(c, r)}>
      <rect x={11} y={19} width={14} height={8} rx={2} fill="#7a6a55" stroke="#20242b" />
      <line x1={18} y1={23} x2={on ? 26 : 10} y2={on ? 12 : 14} stroke="#d8cdb8" strokeWidth={3} strokeLinecap="round" />
      <circle cx={on ? 26 : 10} cy={on ? 12 : 14} r={2.6} fill="#e8ddc6" />
    </g>
  );
}

export function ButtonOnBlock({ c, r }: { c: number; r: number }) {
  return (
    <>
      <Block c={c} r={r} />
      <g transform={at(c, r)}>
        <rect x={12} y={3} width={12} height={6} rx={2} fill="#8d939c" stroke="#20242b" />
      </g>
    </>
  );
}

export function Lamp({ c, r, lit = true }: { c: number; r: number; lit?: boolean }) {
  return (
    <g transform={at(c, r)}>
      {lit && <circle cx={18} cy={18} r={19} fill="#f0bd4b" opacity={0.25} />}
      <rect x={3} y={3} width={30} height={30} rx={4} fill={lit ? '#e8b23f' : '#6a5a3a'} stroke="#20242b" />
      <rect x={9} y={9} width={18} height={18} rx={2} fill={lit ? '#ffd97a' : '#7a6949'} opacity={0.85} />
    </g>
  );
}

export function Repeater({
  c,
  r,
  facing = 'E',
  delay = 1,
  powered = true,
}: {
  c: number;
  r: number;
  facing?: Facing;
  delay?: number;
  powered?: boolean;
}) {
  const torch = powered ? '#ff4a2b' : '#6d5148';
  const front = 12 + delay * 3.5;
  return (
    <g transform={cellTransform(c, r, facing)}>
      <rect x={5} y={2} width={26} height={32} rx={3} fill="#272c34" stroke="#20242b" />
      <line x1={10} y1={18} x2={front} y2={18} stroke="#525b6a" strokeWidth={2} />
      <circle cx={10} cy={18} r={3.4} fill={torch} />
      <circle cx={front} cy={18} r={3.4} fill={torch} />
    </g>
  );
}

export function Comparator({
  c,
  r,
  facing = 'E',
  subtract = false,
  powered = true,
}: {
  c: number;
  r: number;
  facing?: Facing;
  subtract?: boolean;
  powered?: boolean;
}) {
  const torch = powered ? '#ff4a2b' : '#6d5148';
  return (
    <g transform={cellTransform(c, r, facing)}>
      <rect x={2} y={6} width={30} height={24} rx={3} fill="#272c34" stroke="#20242b" />
      <polygon points="28,13.5 34,18 28,22.5" fill={powered ? '#ff4a2b' : '#525b6a'} />
      <circle cx={8} cy={18} r={2.8} fill={torch} />
      <circle cx={18} cy={10} r={2.4} fill="#68707e" />
      <circle cx={18} cy={26} r={2.4} fill="#68707e" />
      {subtract ? (
        <rect x={14.5} y={17} width={7} height={2} rx={1} fill="#9aa3af" />
      ) : (
        <g>
          <rect x={14.5} y={17} width={7} height={2} rx={1} fill="#9aa3af" />
          <rect x={17} y={14.5} width={2} height={7} rx={1} fill="#9aa3af" />
        </g>
      )}
    </g>
  );
}

export function Observer({ c, r, facing = 'E' }: { c: number; r: number; facing?: Facing }) {
  return (
    <g transform={cellTransform(c, r, facing)}>
      <rect x={2} y={2} width={32} height={32} rx={3} fill="#4a5058" stroke="#20242b" />
      <rect x={26} y={2} width={8} height={32} rx={2} fill="#31363d" />
      <circle cx={30} cy={13} r={2.4} fill="#20242b" />
      <circle cx={30} cy={23} r={2.4} fill="#20242b" />
      <rect x={5} y={16} width={11} height={4} rx={1} fill="#2b3038" />
    </g>
  );
}

export function Piston({
  c,
  r,
  facing = 'E',
  extended = false,
  sticky = false,
}: {
  c: number;
  r: number;
  facing?: Facing;
  extended?: boolean;
  sticky?: boolean;
}) {
  const head = sticky ? '#7a8450' : '#b98a4e';
  return (
    <g transform={cellTransform(c, r, facing)}>
      <rect x={2} y={2} width={extended ? 26 : 32} height={32} rx={3} fill="#6f7780" stroke="#20242b" />
      {extended ? (
        <g>
          <line x1={26} y1={10} x2={36} y2={10} stroke="#59616b" strokeWidth={3} />
          <line x1={26} y1={26} x2={36} y2={26} stroke="#59616b" strokeWidth={3} />
          <rect x={36} y={2} width={7} height={32} rx={2} fill={head} stroke="#20242b" />
        </g>
      ) : (
        <rect x={28} y={2} width={7} height={32} rx={2} fill={head} stroke="#20242b" />
      )}
    </g>
  );
}

export function Hopper({ c, r }: { c: number; r: number }) {
  return (
    <g transform={at(c, r)}>
      <path d="M4 8 H32 V16 L22 22 V28 H14 V22 L4 16 Z" fill="#8d939c" stroke="#20242b" />
    </g>
  );
}

export function Minecart({ c, r, funnel = false }: { c: number; r: number; funnel?: boolean }) {
  return (
    <g transform={at(c, r)}>
      <path d="M5 11 H31 L27 24 H9 Z" fill="#9aa3af" stroke="#20242b" />
      {funnel && <path d="M9 13 H27 V17 L21 20 V22 H15 V20 L9 17 Z" fill="#6a7280" />}
      <circle cx={13} cy={28} r={3} fill="#4a5260" />
      <circle cx={24} cy={28} r={3} fill="#4a5260" />
    </g>
  );
}

export function Chest({ c, r }: { c: number; r: number }) {
  return (
    <g transform={at(c, r)}>
      <rect x={4} y={10} width={28} height={19} rx={2} fill="#a3763c" stroke="#20242b" />
      <rect x={4} y={10} width={28} height={7} rx={2} fill="#b98a4e" stroke="#20242b" />
      <rect x={16} y={12} width={4} height={8} rx={1} fill="#5c4322" />
    </g>
  );
}

export function Label({ c, r, dy = -5, text, dim = false }: { c: number; r: number; dy?: number; text: string; dim?: boolean }) {
  return (
    <text x={c * CELL + CELL / 2} y={r * CELL + dy} textAnchor="middle" fontSize={10} className={dim ? 'svg-text dim' : 'svg-text'}>
      {text}
    </text>
  );
}

export function Text({
  x,
  y,
  text,
  size = 11,
  dim = false,
  anchor = 'start',
}: {
  x: number;
  y: number;
  text: string;
  size?: number;
  dim?: boolean;
  anchor?: 'start' | 'middle' | 'end';
}) {
  return (
    <text x={x} y={y} fontSize={size} textAnchor={anchor} className={dim ? 'svg-text dim' : 'svg-text'}>
      {text}
    </text>
  );
}

export function Arrow({
  x1,
  y1,
  x2,
  y2,
  dashed = false,
  color = 'var(--muted)',
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  dashed?: boolean;
  color?: string;
}) {
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const s = 6.5;
  const bx1 = x2 - s * Math.cos(ang - 0.45);
  const by1 = y2 - s * Math.sin(ang - 0.45);
  const bx2 = x2 - s * Math.cos(ang + 0.45);
  const by2 = y2 - s * Math.sin(ang + 0.45);
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.6} strokeDasharray={dashed ? '4 3' : undefined} />
      <polyline points={`${bx1},${by1} ${x2},${y2} ${bx2},${by2}`} fill="none" stroke={color} strokeWidth={1.6} />
    </g>
  );
}

export interface WaveSegment {
  on: boolean;
  w: number;
  label?: string;
}

export function Waveform({ segments, w = 340, h = 88 }: { segments: WaveSegment[]; w?: number; h?: number }) {
  const y0 = h - 26;
  const y1 = 18;
  const x0 = 12;
  const total = segments.reduce((s, g) => s + g.w, 0);
  const scale = (w - 24) / total;
  let x = x0;
  let prev = false;
  const path: string[] = [`M ${x} ${y0}`];
  const ticks: ReactNode[] = [];
  segments.forEach((g, i) => {
    const sw = g.w * scale;
    const y = g.on ? y1 : y0;
    if (i === 0 || g.on !== prev) path.push(`L ${x} ${y}`);
    path.push(`L ${x + sw} ${y}`);
    ticks.push(<line key={`t${i}`} x1={x + sw} y1={y0 + 3} x2={x + sw} y2={y0 + 8} stroke="#4a5260" />);
    if (g.label) {
      ticks.push(
        <text key={`l${i}`} x={x + sw / 2} y={h - 8} textAnchor="middle" fontSize={9} className="svg-text dim">
          {g.label}
        </text>,
      );
    }
    x += sw;
    prev = g.on;
  });
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} className="diagram-svg" role="img">
      <line x1={4} y1={y0} x2={w - 4} y2={y0} stroke="#2a3038" />
      <path d={path.join(' ')} fill="none" stroke="var(--accent)" strokeWidth={2} />
      {ticks}
    </svg>
  );
}
