import { entry } from '../types';

export const mechanisms = [
  entry({
    slug: 'sr-latch',
    term: 'SR latch',
    aliases: ['set-reset latch', 'NOR latch'],
    category: 'mechanisms',
    definition: 'One bit of memory with two buttons: set turns it on, reset turns it off, and in between it holds its state forever.',
    body: [
      {
        heading: 'How it holds',
        text: 'Two inverters pointing at each other through two inputs. Pressing set forces one side off, which keeps the other side on even after you release — a stable loop. Reset breaks it the other way. Nothing ticks; the state is just… sitting there, which makes latches cheap and instant.',
      },
      {
        heading: 'Priority',
        text: 'Set and reset together needs a plan: torch latches are reset-priority by construction, and builds can be wired for set-priority instead. Say which one wins in the design doc, or future-you will re-derive it the hard way.',
      },
    ],
    example: {
      text: 'Lightning rod in a storm sets the latch, a wall switch resets it: the barn lamp stays lit after the storm ends — memory.',
      diagram: 'sr-latch',
    },
    related: ['t-flip-flop', 'hybrid-latch', 'cell', 'not-gate'],
  }),
  entry({
    slug: 't-flip-flop',
    term: 'T flip-flop',
    aliases: ['toggle flip-flop', 'toggle'],
    category: 'mechanisms',
    definition: 'Every pulse flips it: press once on, press again off — the switch that counts pulses.',
    body: [
      {
        heading: 'One input, two presses',
        text: 'A T flip-flop takes a single input line and toggles its output with every pulse. One button for a lamp from anywhere becomes possible, and a clock through a T flip-flop divides by two: a 5-clock feeding a T flip-flop is a 10-clock.',
      },
      {
        heading: 'The classics',
        text: 'The minecart-on-a-detector-rail loop was the original; double-torch versions fit in a handful of blocks; and an SR latch with its set and reset crossed from one toggling line does the job. They differ in initial state and pulse length — test which state a new cart starts in.',
      },
    ],
    example: {
      text: 'A hidden bookshelf door: pull the same lever twice, the door opens then closes — each pull toggles the latch behind it.',
      diagram: 't-flip-flop',
    },
    related: ['sr-latch', 'clock', 'hybrid-latch'],
  }),
  entry({
    slug: 'hybrid-latch',
    term: 'Hybrid latch',
    aliases: ['hybrid'],
    category: 'mechanisms',
    definition: 'A one-bit memory that mixes an AND loop with torch logic: stable in both states, no refresh needed, and it exposes both Q and ¬Q.',
    body: [
      {
        heading: 'The best of both families',
        text: 'A pure repeater-AND latch is fast but can lose its on-state if refreshed wrong; a pure torch-NOR latch is rock-solid but slow and inverts awkwardly. The hybrid wires an AND holding loop in front of a torch stage: the loop holds, the torches make both outputs readable and the whole thing survives being poked while holding.',
      },
      {
        heading: 'When to reach for one',
        text: 'Multi-bit memory rows and calculators use hybrids everywhere: uniform timing, both true and complemented signals on tap, and no surprise state loss when another line updates nearby.',
      },
    ],
    example: {
      text: 'A combination lock’s memory row: five hybrid latches remember which buttons were pressed, each exposing Q to the next stage and ¬Q to the reset line.',
      diagram: 'cell-loop',
    },
    related: ['sr-latch', 'cell', 'repeater'],
  }),
  entry({
    slug: 'cell',
    term: 'Cell (memory loop)',
    aliases: ['memory cell', 'loop'],
    category: 'mechanisms',
    definition: 'The smallest memory unit: a signal spinning in a loop — open the loop to clear it, close it to hold a bit.',
    body: [
      {
        heading: 'Signal in a ring',
        text: 'Take a repeater chain that feeds back into itself and a pulse just circles it forever: that circulating bit is the cell. Break the ring and the bit is gone; a closed ring carrying a pulse is a stored one, and a closed ring that is dark is a stored zero.',
      },
      {
        heading: 'Loop cousins',
        text: 'Add an inverter into the ring and it can no longer sit still — it oscillates, and you get a clock instead of memory. Cell versus clock is literally "even or odd number of NOT gates in the loop".',
      },
    ],
    example: {
      text: 'A two-repeater loop holding the "door is open" bit: cut the loop with a side-locked repeater and the door state is forgotten instantly.',
      diagram: 'cell-loop',
    },
    related: ['sr-latch', 'hybrid-latch', 'clock'],
  }),
  entry({
    slug: 'tower-updater',
    term: 'Tower updater',
    aliases: ['vertical updater'],
    category: 'mechanisms',
    definition: 'A stack of pistons that carries a signal or an update straight up through several floors.',
    body: [
      {
        heading: 'Climbing floors',
        text: 'Dust walks sideways and only climbs with torches; a torch tower is a vertical diode but slow and one-way. A piston tower instead shoves blocks upward level by level — every motion is an update — so power, updates, or both can race up a column of blocks next to the wires that need them.',
      },
      {
        heading: 'Where they shine',
        text: 'Under a door whose trigger lives in a different basement, around obsidian pillars torches cannot power, or inside calculators that route bits vertically between layers: that vertical shaft is a tower updater.',
      },
    ],
    example: {
      text: 'Farm buttons in the field, harvest mechanism two floors down: the button fires a piston tower, and each piston’s motion updates the dust of the floor below it on the way up.',
      diagram: 'tower-updater',
    },
    related: ['piston', 'diode', 'refresh'],
  }),
  entry({
    slug: 'diode',
    term: 'Diode (vertical / horizontal)',
    aliases: ['one-way', 'vertical diode', 'horizontal diode'],
    category: 'mechanisms',
    definition: 'A one-way street for redstone: signals pass forward, never back — horizontally it is a repeater or torch pair, vertically a torch tower.',
    body: [
      {
        heading: 'Why one-way at all',
        text: 'Dust spreads in every direction, so any two circuits sharing a block leak into each other. A diode lets them share space while agreeing on who talks to whom: two buttons on one line, a line with two power sources, a signal crossing a busy bundle.',
      },
      {
        heading: 'Horizontal and vertical',
        text: 'Horizontally: a repeater (delays too), or a torch pair (inverts twice, costs 2 gt, and notably passes no block updates — a "update-proof" diode). Vertically: a torch tower carries the signal up, and inverted torch stacks carry it down.',
      },
    ],
    example: {
      text: 'Two pressure plates, one door: each plate feeds the piston through its own diode so stepping on one can never back-power the other.',
      diagram: 'torch-diode',
    },
    related: ['repeater', 'redstone-torch', 'crosstalk'],
  }),
];
