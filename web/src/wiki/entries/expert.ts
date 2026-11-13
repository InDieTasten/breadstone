import { entry } from '../types';

export const expert = [
  entry({
    slug: 'bud',
    term: 'BUD',
    aliases: ['block update detector', 'quasi-BUD', 'BUD tap'],
    category: 'expert-jargon',
    definition: 'A circuit that reacts to block updates even though nothing was ever powered — usually a sticky piston stuck on quasi-connectivity.',
    body: [
      {
        heading: 'Reacting to updates',
        text: 'A quasi-BUD is a sticky piston fed through quasi-connectivity, parked one block from extending — always "about to move, never moves". Its face keeps evaluating updates; give it one nudge and the piston finally extends or drops, outputting exactly at the moment you poked it.',
      },
      {
        heading: 'BUD taps',
        text: 'A BUD tap is the poke itself: a quick block placement and removal next to the sensor block (a button-flick of blocks). Whatever you tap, the BUD notices — the basis of "detect anything" contraptions and the reason flying machines once roamed the world.',
      },
    ],
    example: {
      text: 'A quasi-BUD watching a single gravel block notices every piston elsewhere that touches that gravel — a wireless update alarm across the room.',
      diagram: 'quasi-connectivity',
    },
    related: ['quasi-connectivity', 'piston-lock', 'update-suppression', 'block-update'],
    bedrockNote: 'Quasi-connectivity is Java-only, so classic quasi-BUDs do not exist on Bedrock (which has its own update quirks to exploit instead).',
  }),
  entry({
    slug: 'quasi-connectivity',
    term: 'Quasi-connectivity',
    aliases: ['quasi', 'phantom power'],
    category: 'expert-jargon',
    definition: 'A piston (or dropper/dispenser) also notices power two blocks straight in front of its face and one block diagonally behind — power that is not really there.',
    body: [
      {
        heading: 'The two rules',
        text: 'Only pistons, droppers and dispensers have this: they check their face block plus two phantom positions — two blocks ahead in a straight line, and the block diagonally behind their back. A torch two blocks ahead powers the piston across a gap; the dust on the floor above-behind can switch it too.',
      },
      {
        heading: 'Why it matters',
        text: 'Quasi-connectivity is the engine behind quasi-BUDs, most update detectors and a decade of "impossible" circuits. It is also a great wire-saving trick: pistons can be powered without touching them.',
      },
    ],
    example: {
      text: 'A piston can be switched on from two blocks away, through a wall the signal never crosses — the classic "phantom" power demo.',
      diagram: 'quasi-connectivity',
    },
    related: ['bud', 'direct-power', 'block-update'],
    bedrockNote: 'Bedrock Edition has no quasi-connectivity at all — these builds simply do not work there.',
  }),
  entry({
    slug: 'update-suppression',
    term: 'Update suppression',
    aliases: ['suppressed updates'],
    category: 'expert-jargon',
    definition: 'When a block changes twice within one game tick and ends where it started, its neighbours may see no change at all — the update is suppressed.',
    body: [
      {
        heading: 'The same-tick vanish',
        text: 'Neighbours react to the difference between a block’s state before and after a tick. If something moves a block out and back within the same tick — a piston extending and retracting around it, a double flick — the neighbours compare identical states and stay asleep. The change happened and was never announced.',
      },
      {
        heading: 'Blessing and curse',
        text: 'Suppressed updates explain phantom blocks, silent BUDs and some duplication setups; they also explain the "works sometimes" bug in dense timing builds. The fix is spacing events at least a tick apart.',
      },
    ],
    example: {
      text: 'Two pistons racing to move the same block on the same tick: the block wobbles, nothing around it updates, and the floor stays a floor.',
      diagram: 'piston-lock',
    },
    related: ['block-update', 'zero-tick', 'piston-lock', 'tick-freeze'],
  }),
  entry({
    slug: 'zero-tick',
    term: '0-tick',
    aliases: ['zero tick', '0gt pulse'],
    category: 'expert-jargon',
    definition: 'An update that propagates within the same game tick it was created — so fast no observer state ever lands, and circuits upstream never see the middle step.',
    body: [
      {
        heading: 'What it means',
        text: 'A "0-tick pulse" is a signal that goes on and off inside a single game tick: downstream blocks only see the end state. Historically, certain piston/dropper interactions let a full update chain fire and finish without anything in between ever becoming visible.',
      },
      {
        heading: 'Use before you build',
        text: 'Which tricks still qualify as 0-tick has changed several times across recent versions — Mojang has reworked tick ordering repeatedly. Old tutorials may describe mechanics that no longer exist in the version you play: check first, build second.',
      },
    ],
    example: {
      text: '"0-tick piston" builds from older versions may now just be a normal two-tick push — the same clicks, different engine.',
      diagram: 'pulse-wave',
    },
    related: ['game-tick', 'update-suppression', 'pulse'],
    bedrockNote: 'Bedrock’s tick and update model is different enough that "0-tick" behavior never matches Java — either direction.',
  }),
  entry({
    slug: 'crosstalk',
    term: 'Crosstalk',
    aliases: ['signal bleed'],
    category: 'expert-jargon',
    definition: 'One line powering another by accident because they got too friendly — dust next to a powered block is not isolation.',
    body: [
      {
        heading: 'How signals leak',
        text: 'Dust picks up power from every adjacent powered block, so two lines running in parallel close together, a line brushing another line’s torch, or a repeater’s side touching a live neighbour all bleed signals. Nothing is broken — the rules are working, just for a circuit nobody drew.',
      },
      {
        heading: 'Curing it',
        text: 'Separate parallel lines by an unpowered block column, put diodes where two lines must cross each other’s territory, and remember a repeater’s side is an input: never run a live line along a repeater’s flank.',
      },
    ],
    example: {
      text: 'The lamp in corridor B blinks whenever corridor A’s door opens — the two dust runs share a wall block and A’s torch leaks into B.',
      diagram: 'crosstalk',
    },
    related: ['signal-strength', 'diode', 'block-update'],
  }),
  entry({
    slug: 'piston-lock',
    term: 'Piston lock',
    aliases: ['locked piston'],
    category: 'expert-jargon',
    definition: 'A piston that cannot finish extending: it stays stuck mid-motion until power drops — and updates around it quietly stop happening.',
    body: [
      {
        heading: 'Blocked, not done',
        text: 'Face a piston at something unmovable (or at another piston that pushes back) and power it: the head starts, hits resistance, and the piston sits in extending state forever. It is neither off nor extended, and while it is stuck, neighbour updates through its block go missing.',
      },
      {
        heading: 'Locked clocks & BUDs',
        text: 'The classic locked-clock: a piston loop with one piston permanently blocked, waiting. Kill the power for exactly one tick and the stuck piston snaps through its full cycle at once — a delayed, all-at-once answer to a distant button, and the basis of many "instant" transmission tricks.',
      },
    ],
    example: {
      text: 'Two pistons pushing into each other with nothing to move: both stay extended-looking but locked, and a one-tick pulse to the back piston releases the whole pair.',
      diagram: 'piston-lock',
    },
    related: ['piston', 'update-suppression', 'bud'],
  }),
  entry({
    slug: 'hopper-lock',
    term: 'Hopper lock',
    aliases: ['locked hopper'],
    category: 'expert-jargon',
    definition: 'A hopper that silently quits working — usually after feeding a hopper minecart underneath it — until some block update wakes it up.',
    body: [
      {
        heading: 'The stuck state',
        text: 'When a hopper empties downward into a hopper minecart that is moving away mid-transfer, the hopper can end up remembering the cart is still there. It keeps "feeding" nothing and stops picking up or pushing items entirely. It is not broken; it is locked.',
      },
      {
        heading: 'The cure',
        text: 'Any block update to the locked hopper resets its memory — a piston knock, a placed and broken block, a BUD tap on demand. Hopper clocks abuse the lock as a timer: lock it on purpose, wake it later.',
      },
    ],
    example: {
      text: 'A sorting line stalls over an unloaded stretch of cart track; one flicker of a piston beside the hopper and sorting resumes.',
      diagram: 'hopper-lock',
    },
    related: ['refresh', 'bud', 'smc'],
  }),
  entry({
    slug: 'smc',
    term: 'SMC',
    aliases: ['sticky piston manipulated chest'],
    category: 'expert-jargon',
    definition: 'Sticky-Piston Manipulated Chest: yank a chest away from a hopper mid-transfer and the items lose track of where they were.',
    body: [
      {
        heading: 'The trick',
        text: 'A hopper feeding into a chest is a two-step transaction. A sticky piston retracts the chest at exactly the wrong tick and the items that already "left" the hopper land nowhere while the hopper still counts them sent: duplication, or the chest eating everything.',
      },
      {
        heading: 'Version roulette',
        text: 'Item-duplication mechanics live and die with updates; SMC in particular has been patched, unpatched and re-tuned across versions. Its status in the version you play is the only thing that matters — verify before wiring up a "duplication farm".',
      },
    ],
    example: {
      text: 'Hopper → chest with a sticky piston under the chest: at the right tick the chest vanishes mid-handshake and the drop rate becomes… optimistic.',
      diagram: 'smc',
    },
    related: ['hopper-lock', 'game-tick', 'update-suppression'],
    bedrockNote: 'Duplication mechanics differ hugely on Bedrock; assume a Java dupe does nothing there.',
  }),
  entry({
    slug: 'tick-freeze',
    term: 'Tick freeze / cold start',
    aliases: ['cold start', 'frozen circuit'],
    category: 'expert-jargon',
    definition: 'A circuit that starts wrong after a chunk load — or sits silent until an outside update unfreezes it.',
    body: [
      {
        heading: 'The world boots, the circuit misses it',
        text: 'Chunks are not loaded with your circuits’ steady state; they load a snapshot of blocks. A design that only works if some line was already powered at load — or if a pulse arrived in exactly the right tick — boots into a dead state. That first-run silence is the cold start problem.',
      },
      {
        heading: 'Freeze and unfreeze',
        text: 'Some latches and quasi-fed pistons load into a state where no future update reaches them until something refreshes the stuck block. Good builds self-check on load: a startup pulse that resets every memory cell to a known value, so the machine never wakes up confused.',
      },
    ],
    example: {
      text: 'A farm that works fine until you leave for the Nether and come back: the chunk reloaded, the loop lost its pulse, and only a manual button press restarts it.',
    },
    related: ['refresh', 'update-suppression', 'cell'],
  }),
  entry({
    slug: 'refresh',
    term: 'Refresh',
    aliases: ['bump', 'nudge'],
    category: 'expert-jargon',
    definition: 'A deliberately sent update that makes a confused or stuck component re-check its state — the "have you tried turning it off and on again" of redstone.',
    body: [
      {
        heading: 'Why devices need a poke',
        text: 'Quasi-connected pistons, locked hoppers, BUD-sensors and other update-eating mechanisms do not re-evaluate themselves when they miss their moment. A refresh is any change the device can hear: a block placed and removed, a piston knock, an observer pulse on its face.',
      },
      {
        heading: 'Refresh-on-event',
        text: 'Mature builds wire a refresh line straight into the event that could cause the stuck state: door cycles bump the sensor block, sorter stalls bump the hopper. Cheap insurance against "worked yesterday".',
      },
    ],
    example: {
      text: 'The barn door jams whenever the quasi-BUD misses an update; a piston tapping the sensor block after every cycle makes the jam history.',
      diagram: 'observer-detect',
    },
    related: ['tick-freeze', 'bud', 'hopper-lock'],
  }),
];
