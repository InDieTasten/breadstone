import { entry } from '../types';

export const components = [
  entry({
    slug: 'repeater',
    term: 'Repeater',
    aliases: ['diode', 'repeaters'],
    category: 'components',
    definition: 'A two-way gatekeeper: copies a signal onward at full strength, delays it by one to four redstone ticks, and lets it flow in one direction only.',
    body: [
      {
        heading: 'Delay & boost',
        text: 'A repeater has four settings, one redstone tick — two game ticks — apart. It always re-emits a full 15, so a line of repeaters resets the signal budget every few blocks. Right-click cycles the delay; the torch spacing shows the setting.',
      },
      {
        heading: 'Diode & lock',
        text: 'Signals never travel backward through a repeater, which makes it the standard diode: two lines can share a block without feeding each other. Power the side of a repeater and it freezes its current output — set or clear it before the lock arrives and it holds that state like a one-bit memory.',
      },
    ],
    example: {
      text: 'A hidden door with a lever on both sides: each lever feeds the piston through a repeater, and the repeaters stop one side’s signal from leaking into the other lever’s wire.',
      diagram: 'repeater-delay',
    },
    related: ['diode', 'delay', 'comparator', 'signal-strength'],
  }),
  entry({
    slug: 'comparator',
    term: 'Comparator',
    aliases: ['compare mode', 'subtract mode'],
    category: 'components',
    definition: 'Reads the block behind it and either compares or subtracts a side signal — the only component that turns levels into information.',
    body: [
      {
        heading: 'Compare mode',
        text: 'In compare mode (torch low) the output equals the back signal while it is at least as strong as both side inputs, and drops to zero when a side signal beats it. Feed two numbers in from the sides and you get signal priority, thresholds and timers for free.',
      },
      {
        heading: 'Subtract mode',
        text: 'Right-click raises the second torch: now the output is back minus side. That is the arithmetic gate — counters, item filters ("is this chest fuller than that one?") and even binary adders are built by chaining subtracting comparators.',
      },
    ],
    example: {
      text: 'A chest sorter: comparator reads the full chest (back), a second comparator reads the target level (side); while back > side the output stays lit and hoppers keep draining.',
      diagram: 'comparator',
    },
    related: ['power-level', 'signal-strength', 'repeater'],
  }),
  entry({
    slug: 'observer',
    term: 'Observer',
    aliases: ['watcher'],
    category: 'components',
    definition: 'Notices any change to the block directly in front of it and answers with a short pulse out of its back.',
    body: [
      {
        heading: 'Detecting changes',
        text: 'The observer does not care about power — it watches for block updates: a block placed or broken, a slab swapped, a piston moving, water flowing. Each change in its face triggers a pulse of about two game ticks from its back — one redstone tick.',
      },
      {
        heading: 'The modern edge detector',
        text: 'Since observers exist, "detecting a change" is a one-block job: point an observer at whatever moves and take the pulse. It is also the workhorse of clocks: two observers facing each other tick each other forever.',
      },
    ],
    example: {
      text: 'Point an observer at a door: every open/close sends a two-tick pulse through the wall — a hidden alarm without touching the door’s own wiring.',
      diagram: 'observer-detect',
    },
    related: ['block-update', 'edge-detection', 'clock'],
  }),
  entry({
    slug: 'piston',
    term: 'Piston & sticky piston',
    aliases: ['sticky piston', 'piston asymmetry'],
    category: 'components',
    definition: 'Moves blocks: any block one step away when powered; sticky pistons pull theirs back too — and the extend/retract timing is not symmetric.',
    body: [
      {
        heading: 'Push and pull',
        text: 'A piston pushes the block directly in front of it by one; a line of up to twelve pushable blocks moves with it. A sticky piston glues its single front block and drags it back when power drops. Obsidian, tile entities and the like simply refuse to move.',
      },
      {
        heading: 'The asymmetry',
        text: 'Power removed, the extended head pops back within the same tick, but the attached block only follows once the arm finishes retracting on the next game tick; when powering on, the block is shoved as the arm extends. Designs that race pistons against signals use exactly this: the head moves a tick sooner than the block.',
      },
    ],
    example: {
      text: 'A bubble-column elevator: a sticky piston flicks the soul-sand out of the column for exactly one tick — extend, retract, players already rising.',
      diagram: 'piston-push',
    },
    related: ['piston-lock', 'tower-updater', 'smc'],
    bedrockNote: 'Bedrock handles piston timing and block updates differently; timing-sensitive piston designs (and most BUD tricks) do not port.',
  }),
  entry({
    slug: 'redstone-torch',
    term: 'Redstone torch & burn-out',
    aliases: ['torch', 'inverter'],
    category: 'components',
    definition: 'A block-mounted power source that switches off the moment its block is powered — and burns out if you flick it too often.',
    body: [
      {
        heading: 'The inverter',
        text: 'A torch powers the block above it and nearby dust — until the block it stands on receives power itself. Then it goes dark: torch plus powered block equals off. Every NOT gate, and with it every latch and clock, starts here. A torch flipping costs one game tick.',
      },
      {
        heading: 'Burn-out',
        text: 'Force a torch to change state more than eight times within sixty game ticks and it burns out: it is forced off for the next sixteen ticks, ignoring what its block does, before it recovers. Burn-out is what stops runaway torch loops from simply flickering forever.',
      },
    ],
    example: {
      text: 'The classic clock for when you want it slow and simple: two torches chained into a loop flip each other until one burns out — then it restarts.',
      diagram: 'burnout-wave',
    },
    related: ['not-gate', 'clock', 'strong-weak-power'],
    bedrockNote: 'Bedrock torches do not burn out at all, so designs that lean on burn-out timing behave very differently there.',
  }),
  entry({
    slug: 'not-gate',
    term: 'NOT gate (inverter)',
    aliases: ['inverter', 'NOT'],
    category: 'components',
    definition: 'Power in means no power out: the torch-on-a-block pair, smallest brick in every latch, clock and calculator.',
    body: [
      {
        heading: 'One block of logic',
        text: 'Feed a block and any torch attached to it goes dark; unfeed it and the torch shines. That reversal is the NOT gate — the only inversion redstone has, and with a second signal it becomes every other gate: torches plus a piston make AND, torch loops make memory.',
      },
      {
        heading: 'Where to find it',
        text: 'Every SR latch is two inverters holding each other; every clock is an odd number of them in a loop; and a button on a block with a torch beside it is one, ready to make any mechanism "react to absence".',
      },
    ],
    example: {
      text: 'A day sensor through a NOT gate turns "sun is up" into "night is falling" and lights the farm lamps at dusk instead of noon.',
      diagram: 'torch-off',
    },
    related: ['redstone-torch', 'sr-latch', 'clock'],
  }),
];
