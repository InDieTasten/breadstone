import type { ReactNode } from 'react';
import { Arrow, Block, ButtonOnBlock, Chest, Comparator, DustOnBlock, Ghost, Grid, Hopper, Label, Lamp, Lever, Minecart, Observer, Piston, Repeater, Scene, Text, Torch, Waveform } from './primitives';

const CELL = 36;

interface DiagramDef {
  title: string;
  node: ReactNode;
}

const dustLine = (
  <Scene cols={8} rows={1}>
    <Grid cols={8} rows={1} />
    <Block c={0} r={0} />
    <Lever c={0} r={0} on />
    <DustOnBlock c={1} r={0} level={15} />
    <DustOnBlock c={2} r={0} level={14} />
    <DustOnBlock c={3} r={0} level={13} />
    <DustOnBlock c={4} r={0} level={12} />
    <DustOnBlock c={5} r={0} level={11} />
    <DustOnBlock c={6} r={0} level={10} />
    <Ghost c={7} r={0} />
    <Label c={1} r={0} dy={-4} text="15" />
    <Label c={2} r={0} dy={-4} text="14" />
    <Label c={3} r={0} dy={-4} text="13" />
    <Label c={4} r={0} dy={-4} text="12" />
    <Label c={5} r={0} dy={-4} text="11" />
    <Label c={6} r={0} dy={-4} text="10" />
    <Text x={0} y={CELL + 16} size={10} dim text="Each block of dust the signal crosses drops it by one level." />
  </Scene>
);

const directPower = (
  <Scene cols={4} rows={2}>
    <Grid cols={4} rows={2} />
    <Torch c={1} r={1} lit />
    <Block c={1} r={0} />
    <Lever c={3} r={0} on />
    <Block c={3} r={1} />
    <Arrow x1={18} y1={CELL * 1 + 12} x2={18} y2={CELL * 1 - 2} color="var(--accent)" />
    <Arrow x1={3 * CELL + 18} y1={CELL * 1 + 12} x2={3 * CELL + 18} y2={CELL * 1 - 2} color="var(--muted)" dashed />
    <Text x={0} y={CELL * 2 + 16} size={10} dim text="Direct power reaches the block itself — from a torch below, or a source sitting on top." />
  </Scene>
);

const strongWeak = (
  <Scene cols={5} rows={2}>
    <Grid cols={5} rows={2} />
    <Torch c={0} r={1} lit />
    <Block c={0} r={0} />
    <DustOnBlock c={1} r={0} level={15} />
    <Arrow x1={30} y1={14} x2={CELL + 2} y2={18} color="var(--accent)" />
    <Torch c={4} r={1} lit />
    <Block c={4} r={0} />
    <Ghost c={3} r={0} />
    <Arrow x1={4 * CELL + 6} y1={14} x2={3 * CELL + 34} y2={18} color="var(--muted)" dashed />
    <Text x={0} y={CELL + 14} size={10} dim text="strong: powers the dust on top" />
    <Text x={3 * CELL} y={CELL + 14} size={10} dim text="weak: only the block, no dust" />
    <Text x={0} y={CELL * 2 + 16} size={10} dim text="A block is strong-powered by torch below / dust on top / a repeater pointing in." />
  </Scene>
);

const torchOff = (
  <Scene cols={4} rows={1}>
    <Grid cols={4} rows={1} />
    <DustOnBlock c={0} r={0} level={15} />
    <Block c={1} r={0} />
    <Torch c={2} r={0} lit={false} />
    <Lamp c={3} r={0} lit={false} />
    <Label c={0} r={0} dy={-4} text="in" />
    <Label c={2} r={0} dy={-4} text="torch off" />
    <Text x={0} y={CELL + 16} size={10} dim text="The powered block kills the torch: power in means no power out." />
  </Scene>
);

const torchLoop = (
  <Scene cols={4} rows={1}>
    <Grid cols={4} rows={1} />
    <Block c={1} r={0} />
    <Torch c={2} r={0} lit={false} />
    <Ghost c={0} r={0} />
    <Ghost c={3} r={0} />
    <Arrow x1={2 * CELL + 18} y1={CELL - 4} x2={CELL + 20} y2={CELL - 4} color="var(--muted)" dashed />
    <Text x={0} y={CELL + 16} size={10} dim text="Loop a NOT gate into its own input and the pair flips forever: a clock." />
  </Scene>
);

const repeaterDelay = (
  <Scene cols={4} rows={1}>
    <Grid cols={4} rows={1} />
    <DustOnBlock c={0} r={0} level={15} />
    <Repeater c={1} r={0} facing="E" delay={3} powered />
    <DustOnBlock c={2} r={0} level={15} />
    <Arrow x1={30} y1={10} x2={2 * CELL + 6} y2={10} color="var(--accent)" />
    <Label c={1} r={0} dy={-4} text="delay" />
    <Text x={0} y={CELL + 16} size={10} dim text="Setting 3: six game ticks between in and out, and the signal cannot flow back." />
  </Scene>
);

const comparator = (
  <Scene cols={5} rows={3}>
    <Grid cols={5} rows={3} />
    <DustOnBlock c={1} r={1} level={12} />
    <Comparator c={2} r={1} facing="E" subtract={false} powered />
    <DustOnBlock c={2} r={0} level={7} />
    <DustOnBlock c={2} r={2} level={0} />
    <DustOnBlock c={3} r={1} level={12} />
    <Label c={1} r={1} dy={-4} text="back" dim />
    <Label c={2} r={0} dy={-4} text="side" dim />
    <Label c={3} r={1} dy={-4} text="out" dim />
    <Text x={0} y={CELL * 3 + 16} size={10} dim text="Compare mode: out while back ≥ side. Subtract mode: out = back − side." />
  </Scene>
);

const observerDetect = (
  <Scene cols={4} rows={1}>
    <Grid cols={4} rows={1} />
    <Observer c={1} r={0} facing="E" />
    <Block c={2} r={0} />
    <Lever c={2} r={0} on />
    <DustOnBlock c={3} r={0} level={15} />
    <Label c={2} r={0} dy={-4} text="changes" dim />
    <Label c={3} r={0} dy={-4} text="pulse" dim />
    <Text x={0} y={CELL + 16} size={10} dim text="The block in front changes → a two game tick pulse leaves through the back." />
  </Scene>
);

const pistonPush = (
  <Scene cols={4} rows={1}>
    <Grid cols={4} rows={1} />
    <DustOnBlock c={0} r={0} level={15} />
    <Piston c={1} r={0} facing="E" extended={false} />
    <Block c={2} r={0} />
    <Ghost c={3} r={0} />
    <Arrow x1={2 * CELL + 4} y1={10} x2={3 * CELL + 20} y2={10} color="var(--muted)" />
    <Text x={0} y={CELL + 16} size={10} dim text="Powered: the piston shoves the block in front one step. Sticky pistons also pull it back." />
  </Scene>
);

const pistonLock = (
  <Scene cols={3} rows={1}>
    <Grid cols={3} rows={1} />
    <Piston c={0} r={0} facing="E" extended />
    <Piston c={2} r={0} facing="W" extended />
    <Text x={CELL + 18} y={14} size={10} anchor="middle" dim text="stuck" />
    <Text x={0} y={CELL + 16} size={10} dim text="Blocked pistons never finish extending; until power drops, updates around them go missing." />
  </Scene>
);

const torchDiode = (
  <Scene cols={3} rows={4}>
    <Grid cols={3} rows={4} />
    <DustOnBlock c={1} r={3} level={15} />
    <Block c={1} r={2} />
    <Torch c={2} r={2} lit />
    <Block c={1} r={1} />
    <Torch c={2} r={1} lit />
    <Lamp c={1} r={0} lit />
    <Arrow x1={2 * CELL + 18} y1={3 * CELL + 10} x2={2 * CELL + 18} y2={CELL - 2} color="var(--muted)" />
    <Text x={0} y={4 * CELL + 16} size={10} dim text="Torches stack upward only: this diode carries signals up, never down." />
  </Scene>
);

const observerClock = (
  <Scene cols={3} rows={1}>
    <Grid cols={3} rows={1} />
    <Observer c={0} r={0} facing="E" />
    <Observer c={1} r={0} facing="W" />
    <Ghost c={2} r={0} />
    <Arrow x1={CELL - 8} y1={12} x2={CELL + 8} y2={12} color="var(--muted)" />
    <Arrow x1={CELL + 8} y1={26} x2={CELL - 8} y2={26} color="var(--muted)" />
    <Text x={0} y={CELL + 16} size={10} dim text="Two observers facing each other tick each other — a pulse about every two game ticks." />
  </Scene>
);

const cellLoop = (
  <Scene cols={3} rows={3}>
    <Grid cols={3} rows={3} />
    <DustOnBlock c={0} r={0} level={15} />
    <Repeater c={1} r={0} facing="E" delay={1} powered />
    <DustOnBlock c={2} r={0} level={15} />
    <DustOnBlock c={2} r={1} level={15} />
    <Repeater c={1} r={1} facing="W" delay={1} powered />
    <DustOnBlock c={0} r={1} level={15} />
    <Lamp c={0} r={2} lit />
    <Text x={0} y={3 * CELL + 16} size={10} dim text="A repeater loop keeps its signal spinning in place: one bit of memory." />
  </Scene>
);

const srLatch = (
  <Scene cols={5} rows={2}>
    <Grid cols={5} rows={2} />
    <Torch c={0} r={0} lit />
    <Block c={0} r={1} />
    <Torch c={2} r={1} lit={false} />
    <Block c={2} r={0} />
    <ButtonOnBlock c={4} r={0} />
    <Label c={0} r={0} dy={-4} text="Q" dim />
    <Arrow x1={4 * CELL + 10} y1={14} x2={2 * CELL + 30} y2={28} color="var(--muted)" dashed />
    <Arrow x1={2 * CELL + 8} y1={22} x2={8} y2={CELL + 6} color="var(--muted)" dashed />
    <Text x={4 * CELL - 6} y={CELL + 16} size={10} dim text="S" />
    <Text x={0} y={2 * CELL + 16} size={10} dim text="Each side holds the other: set once, it stays; reset once, it stays off." />
  </Scene>
);

const tFlipFlop = (
  <Scene cols={6} rows={3}>
    <Grid cols={6} rows={3} />
    <rect x={18} y={18} width={180} height={72} rx={36} fill="none" stroke="#59616b" strokeWidth={4} />
    <line x1={90} y1={18} x2={150} y2={18} stroke="var(--accent)" strokeWidth={5} />
    <Minecart c={1} r={0} />
    <Arrow x1={3 * CELL} y1={CELL + 28} x2={3 * CELL + 30} y2={CELL + 28} color="var(--accent)" />
    <Label c={3} r={0} dy={-4} text="detector rail" dim />
    <Text x={0} y={3 * CELL + 16} size={10} dim text="A minecart over a detector rail flips the output on every pass: one press on, one press off." />
  </Scene>
);

const quasiConnectivity = (
  <Scene cols={4} rows={2}>
    <Grid cols={4} rows={2} />
    <Torch c={0} r={0} lit />
    <Block c={0} r={1} />
    <Piston c={1} r={1} facing="E" />
    <Ghost c={2} r={1} />
    <Piston c={3} r={1} facing="E" />
    <Arrow x1={22} y1={CELL + 26} x2={3 * CELL + 6} y2={CELL + 26} color="var(--muted)" dashed />
    <Label c={3} r={1} dy={-4} text="still powers" dim />
    <Text x={0} y={2 * CELL + 16} size={10} dim text="A piston face also notices power two blocks ahead and one block diagonally behind." />
  </Scene>
);

const towerUpdater = (
  <Scene cols={3} rows={4}>
    <Grid cols={3} rows={4} />
    <DustOnBlock c={0} r={3} level={15} />
    <Piston c={1} r={3} facing="N" extended={false} />
    <Block c={1} r={2} />
    <Piston c={1} r={1} facing="N" extended />
    <DustOnBlock c={1} r={0} level={15} />
    <Arrow x1={CELL + 14} y1={3 * CELL + 18} x2={CELL + 14} y2={CELL - 2} color="var(--muted)" />
    <Text x={0} y={4 * CELL + 16} size={10} dim text="Pistons carry updates up floors that dust can only climb with torches." />
  </Scene>
);

const crosstalk = (
  <Scene cols={4} rows={2}>
    <Grid cols={4} rows={2} />
    <DustOnBlock c={0} r={0} level={15} />
    <DustOnBlock c={1} r={0} level={14} />
    <Ghost c={2} r={0} />
    <DustOnBlock c={3} r={0} level={13} />
    <Torch c={2} r={1} lit />
    <Arrow x1={2 * CELL + 14} y1={CELL - 4} x2={2 * CELL + 14} y2={CELL * 0 + 20} color="var(--accent)" dashed />
    <Text x={0} y={2 * CELL + 16} size={10} dim text="Dust passing near another line's torch or powered block picks its power up." />
  </Scene>
);

const hopperLock = (
  <Scene cols={3} rows={2}>
    <Grid cols={3} rows={2} />
    <Hopper c={1} r={0} />
    <Minecart c={1} r={1} funnel />
    <Arrow x1={CELL + 4} y1={CELL + 8} x2={CELL + 4} y2={12} color="var(--muted)" dashed />
    <Text x={0} y={2 * CELL + 16} size={10} dim text="A hopper feeding over a moving hopper minecart can lock and stop until something updates it." />
  </Scene>
);

const smc = (
  <Scene cols={4} rows={1}>
    <Grid cols={4} rows={1} />
    <Hopper c={0} r={0} />
    <Chest c={1} r={0} />
    <Piston c={2} r={0} facing="W" extended />
    <Ghost c={3} r={0} />
    <Arrow x1={CELL + 30} y1={10} x2={3 * CELL + 2} y2={10} color="var(--muted)" dashed />
    <Text x={0} y={CELL + 16} size={10} dim text="A sticky piston yanks the chest away mid-transfer: the items never arrive." />
  </Scene>
);

const pulseWave = (
  <Waveform
    segments={[
      { on: false, w: 1, label: '' },
      { on: true, w: 1.5, label: '1 gt' },
      { on: false, w: 3 },
      { on: true, w: 6, label: 'long pulse' },
      { on: false, w: 1.5 },
    ]}
  />
);

const clockWave = (
  <Waveform
    segments={[
      { on: true, w: 1.5, label: 'on' },
      { on: false, w: 3.5, label: 'off' },
      { on: true, w: 1.5, label: 'on' },
      { on: false, w: 3.5, label: 'off' },
      { on: true, w: 1.5, label: 'on' },
      { on: false, w: 3.5, label: 'off' },
    ]}
  />
);

const monostableWave = (
  <div className="wave-pair">
    <Waveform
      segments={[
        { on: false, w: 1 },
        { on: true, w: 6, label: 'input: any length' },
        { on: false, w: 2 },
      ]}
    />
    <Waveform
      segments={[
        { on: false, w: 1 },
        { on: true, w: 2, label: 'output: fixed pulse' },
        { on: false, w: 6 },
      ]}
    />
  </div>
);

const burnoutWave = (
  <Waveform
    segments={[
      { on: true, w: 1 },
      { on: false, w: 1 },
      { on: true, w: 1 },
      { on: false, w: 1 },
      { on: true, w: 1 },
      { on: false, w: 1 },
      { on: true, w: 1 },
      { on: false, w: 2.5, label: 'burnt out 16 gt' },
      { on: true, w: 2, label: 'recovers' },
      { on: false, w: 2 },
    ]}
  />
);

export const diagrams: Record<string, DiagramDef> = {
  'dust-line': { title: 'Dust carries levels 1–15 and loses one per block.', node: dustLine },
  'direct-power': { title: 'Direct power reaches the block itself.', node: directPower },
  'strong-weak': { title: 'Strong vs. weak power.', node: strongWeak },
  'torch-off': { title: 'A powered block kills its torch.', node: torchOff },
  'torch-loop': { title: 'A torch loop oscillates.', node: torchLoop },
  'repeater-delay': { title: 'A repeater delays and isolates.', node: repeaterDelay },
  comparator: { title: 'Comparator: back, sides, output.', node: comparator },
  'observer-detect': { title: 'Observer reacts to changes in front.', node: observerDetect },
  'piston-push': { title: 'A piston pushes one block.', node: pistonPush },
  'piston-lock': { title: 'Two pistons against each other.', node: pistonLock },
  'torch-diode': { title: 'A torch tower: a vertical diode.', node: torchDiode },
  'observer-clock': { title: 'An observer clock.', node: observerClock },
  'cell-loop': { title: 'A holding repeater loop.', node: cellLoop },
  'sr-latch': { title: 'A two-torch SR latch.', node: srLatch },
  't-flip-flop': { title: 'A minecart T flip-flop.', node: tFlipFlop },
  'quasi-connectivity': { title: 'Quasi-connectivity: power across the gap.', node: quasiConnectivity },
  'tower-updater': { title: 'A piston tower updater.', node: towerUpdater },
  crosstalk: { title: 'Crosstalk: power bleeding into a neighbour.', node: crosstalk },
  'hopper-lock': { title: 'A locked hopper.', node: hopperLock },
  smc: { title: 'Sticky-Piston Manipulated Chest.', node: smc },
  'pulse-wave': { title: 'Pulse lengths on the timeline.', node: pulseWave },
  'clock-wave': { title: 'A clock repeats pulses forever.', node: clockWave },
  'monostable-wave': { title: 'A monostable shapes one fixed pulse.', node: monostableWave },
  'burnout-wave': { title: 'Torch burn-out: forced off after too much flicker.', node: burnoutWave },
};

export function Diagram({ id }: { id: string }) {
  const def = diagrams[id];
  if (!def) return null;
  return (
    <figure className="diagram">
      {def.node}
      <figcaption>{def.title}</figcaption>
    </figure>
  );
}
