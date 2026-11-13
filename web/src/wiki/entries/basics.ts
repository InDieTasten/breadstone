import { entry } from '../types';

export const basics = [
  entry({
    slug: 'game-tick',
    term: 'Tick (game tick)',
    aliases: ['game tick', 'gt', 'redstone tick', 'rt'],
    category: 'basics',
    definition: 'The heartbeat of the world: twenty game ticks fit into one real second, and almost everything in redstone moves on them.',
    body: [
      {
        heading: 'Game ticks',
        text: 'Minecraft does not run redstone in real time but in steps. Each game tick — 50 ms — the server processes block updates, entity movement and scheduled events. Timing specs quote this unit, abbreviated gt: a piston reaction, an observer pulse or a "2 gt clock" all speak game ticks.',
      },
      {
        heading: 'Redstone ticks',
        text: 'Repeaters speak a coarser unit: one redstone tick is two game ticks, the delay of a repeater on its first setting. A repeater on setting 3 therefore delays a signal by three redstone ticks, six game ticks, 0.3 seconds. When a spec mixes both units, gt is the one to trust.',
      },
    ],
    example: {
      text: 'Want a lamp to light exactly half a second after you pull the lever? That is ten game ticks — five repeaters in a row on setting 1, or two and a half… which is why you count in gt instead.',
      diagram: 'repeater-delay',
    },
    related: ['block-update', 'block-tick', 'delay', 'repeater'],
  }),
  entry({
    slug: 'block-tick',
    term: 'Block tick & random tick',
    aliases: ['scheduled tick', 'random tick'],
    category: 'basics',
    definition: "A block tick is a job scheduled for one specific block; random ticks are the dice rolls that make grass spread and saplings grow.",
    body: [
      {
        heading: 'Block ticks',
        text: 'A block tick is a callback for a single block at a future game tick: "re-check this fluid in 5 ticks", "drop this sand entity now". Redstone components mostly do not use them — they react to updates instead — but observers and hoppers hide a few timers inside.',
      },
      {
        heading: 'Random ticks',
        text: 'Every game tick, each loaded chunk rolls on a handful of random block positions — that is how saplings grow, grass spreads and leaves decay. Random tick speed is a gamerule, so "it grew after 20 minutes" is average growth timing, not a circuit spec.',
      },
    ],
    example: {
      text: 'A crop farm that "works by itself" is riding random ticks; anything measured in redstone time is a block tick or a redstone clock.',
    },
    related: ['game-tick'],
  }),
  entry({
    slug: 'block-update',
    term: 'Block update & neighbour update',
    aliases: ['neighbour update', 'update'],
    category: 'basics',
    definition: 'When a block changes, its neighbours hear about it: that knock on the door is the block update, the base signal of all redstone.',
    body: [
      {
        heading: 'How updates spread',
        text: 'Placing, breaking or changing a block (a lever flipping, a piston moving) sends updates to the six neighbouring blocks. Each neighbour re-checks its own state — a lamp notices its torch, an observer notices everything — and may change in turn, sending more updates. Java Edition processes these in a strict order; that order is why timing exists at all.',
      },
      {
        heading: 'Updates versus power',
        text: 'An update is not power. It is only a notification asking the neighbour to look again; the neighbour then asks who powers it. Designs that "work without a signal" are reacting to updates, not to power — the trick behind observers and BUDs.',
      },
    ],
    example: {
      text: 'Push a block next to an observer and it fires even though nothing powered it — the observer just heard the update.',
      diagram: 'observer-detect',
    },
    related: ['observer', 'bud', 'update-suppression', 'quasi-connectivity'],
    bedrockNote: 'Bedrock processes updates in a completely different order, with a global queue instead of Java’s strict neighbour order. Update tricks rarely port cleanly.',
  }),
  entry({
    slug: 'signal-strength',
    term: 'Signal strength',
    aliases: ['signal', 'strength'],
    category: 'basics',
    definition: 'Redstone signals are not just on or off — they carry a strength from 0 to 15 that decides how far they travel.',
    body: [
      {
        heading: 'Zero to fifteen',
        text: 'Most sources (levers, torches, buttons) emit strength 15. Dust carries the highest level it receives and loses exactly one level per block, so a signal dies after fifteen blocks unless a repeater re-boosts it to 15. Observers, repeaters and torches all output a full 15.',
      },
      {
        heading: 'Why levels matter',
        text: 'Different levels from different sources meet in one wire and the maximum wins — they mix but never average out. A repeater without lock mode passes any incoming level through as a full 15; that is also why you cannot read levels off dust except with a comparator.',
      },
    ],
    example: {
      text: 'Run dust from a lever across eight blocks and a comparator reading it at the far end still sees 8 — a full-strength signal would have died, this one just weakened.',
      diagram: 'dust-line',
    },
    related: ['power-level', 'repeater', 'comparator'],
  }),
  entry({
    slug: 'power-level',
    term: 'Power level',
    aliases: ['power', 'level'],
    category: 'basics',
    definition: 'The strength value a block currently receives — what a comparator reads when it looks at the block behind it.',
    body: [
      {
        heading: 'Reading power',
        text: 'A powered block quietly remembers the highest level it was fed this tick. A comparator facing that block outputs the same number: a chest half full reports its fill level, a jukebox playing disc 7 outputs 7, and dust carrying level 11 reads as 11.',
      },
      {
        heading: 'Levels on the wire',
        text: 'Power levels are how analog-ish information travels in redstone: container fill states, note pitches and multi-bit lines all smuggle numbers through the 0–15 range instead of a bare yes/no.',
      },
    ],
    example: {
      text: 'A comparator behind a chest half-full of one item stack outputs level 7-ish — enough to light a lamp directly, but not to cross more than a handful of dust blocks.',
      diagram: 'dust-line',
    },
    related: ['signal-strength', 'comparator'],
  }),
  entry({
    slug: 'direct-power',
    term: 'Direct power',
    aliases: ['powered block'],
    category: 'basics',
    definition: 'A block is directly powered when a source is applied to the block itself — torch below, dust on top — which is what lets it light a lamp or kill a torch.',
    body: [
      {
        heading: 'Source on the block',
        text: 'Dust sitting on a block makes that block directly powered; so does a redstone torch underneath it, or a repeater or observer output pointing into it. Components check their own power level first, so "is the block directly powered" is the real question most mechanisms ask.',
      },
      {
        heading: 'The limits',
        text: 'A button on a block technically feeds the block, but most components ignore that kind of weak application; buttons and pressure plates really activate their neighbours. Directly powered blocks also light lamps on top and switch off any torch attached to them.',
      },
    ],
    example: {
      text: 'Put a lamp on a block, a lever on that same block: the lamp lights, because the block itself got the power.',
      diagram: 'direct-power',
    },
    related: ['strong-weak-power', 'signal-strength', 'redstone-torch'],
  }),
  entry({
    slug: 'strong-weak-power',
    term: 'Strong & weak power',
    aliases: ['strong power', 'weak power'],
    category: 'basics',
    definition: 'A block is strong-powered when it can feed dust sitting on top or next to it — torch below or dust on top; a button or side dust only weakly powers it.',
    body: [
      {
        heading: 'The classic test',
        text: 'The test is always the same: does dust placed on top of the block light up? Torch underneath → yes, strong. Dust on top → the block itself is fed and passes it on → strong. Button on the block, or dust touching only its side → the block is weak-powered and dust on top stays dark.',
      },
      {
        heading: 'Where it bites',
        text: 'Half of "it doesn’t work" bug reports are weak power: someone mounted a lever on the side of a wall and expected dust on the other side to light. The fix is a torch on or under the block to turn the weak feed into a strong one.',
      },
    ],
    example: {
      text: 'Lever on a wall block, dust on top of that block: dark. Add a torch on the wall block facing up… wait — flip it: torch below the block, and the dust on top glows instantly.',
      diagram: 'strong-weak',
    },
    related: ['direct-power', 'redstone-torch', 'signal-strength'],
    bedrockNote: 'Bedrock has no strong/weak split; power spreads through a "solid block update" model instead, so the Java trick table does not apply.',
  }),
];
