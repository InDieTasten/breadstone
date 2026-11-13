import { entry } from '../types';

export const timing = [
  entry({
    slug: 'clock',
    term: 'Clock (fast clock, 5-clock)',
    aliases: ['fast clock', '5-clock', 'oscillator'],
    category: 'timing',
    definition: 'A circuit that fires pulses forever without being touched — named by its period: a 5-clock completes a cycle every five game ticks.',
    body: [
      {
        heading: 'Naming by period',
        text: 'The convention is simple: the number in front of "-clock" is the period in game ticks. A 20-clock pulses once per second, a 5-clock five times per second, a "fast clock" is anything up in the tens of hertz — like two observers facing each other, which tick each other about every two game ticks.',
      },
      {
        heading: 'Off switch first',
        text: 'Every real design needs the clock to stop: a repeater in the loop (power its side and the loop freezes) or a signal blocker in the line turns a metronome into an on-demand one. A clock you cannot stop is a fire alarm in a paper house.',
      },
    ],
    example: {
      text: 'A note-block song machine is just a 5-clock ticking a counter forward, with comparators reading the track to pick the notes.',
      diagram: 'clock-wave',
    },
    related: ['game-tick', 'pulse', 'monostable-circuit'],
  }),
  entry({
    slug: 'pulse',
    term: 'Pulse',
    aliases: ['short pulse', 'long pulse', 'blip'],
    category: 'timing',
    definition: 'One brief excursion of a signal from off to on and back — pulse length decides which components even notice.',
    body: [
      {
        heading: 'Length matters',
        text: 'A one game tick pulse exists but many components only react reliably from two ticks up; pistons will start, torches manage it, and anything that needs a full on-and-off of its own may swallow it whole. "Shorten the pulse" or "stretch it to two" are standard fixes.',
      },
      {
        heading: 'Shaping pulses',
        text: 'Repeaters stretch nothing but add delay; observers, torch chains and monostables cut pulses short; a held button or a T flip-flop holds them long. Most timing bugs are settled by shaping the pulse to what the next component expects.',
      },
    ],
    example: {
      text: 'Pressing a button fires a pulse long enough for a piston to extend fully — but the return click may be a 1 gt blip some mechanism downstream never sees.',
      diagram: 'pulse-wave',
    },
    related: ['game-tick', 'edge-detection', 'monostable-circuit'],
  }),
  entry({
    slug: 'delay',
    term: 'Delay',
    aliases: ['latency'],
    category: 'timing',
    definition: 'Shifting a signal later in time — dust adds none, repeaters and torches are the honest delay elements.',
    body: [
      {
        heading: 'What delays and what does not',
        text: 'Redstone dust propagates within the same tick: a signal crossing fifteen blocks of dust arrives with zero delay. The real delay elements are repeaters (two game ticks per setting), redstone torches (one tick each) and components like pistons that take time to move blocks.',
      },
      {
        heading: 'Using delay on purpose',
        text: 'Delays order events: the classic "extend the door, then close the circuit" or "let the cart pass, then flip the rail" is just the right number of repeaters between two outputs of the same button.',
      },
    ],
    example: {
      text: 'A four-repeater chain on setting 2 delays the piston sixteen game ticks — long enough for the minecart to clear the track before the rail flips.',
      diagram: 'repeater-delay',
    },
    related: ['game-tick', 'repeater', 'redstone-torch'],
  }),
  entry({
    slug: 'edge-detection',
    term: 'Edge detection',
    aliases: ['rising edge', 'falling edge', 'edge detector'],
    category: 'timing',
    definition: 'Turning a change — up or down — into a single short pulse, instead of reacting to a steady state.',
    body: [
      {
        heading: 'Edges, not levels',
        text: 'A level-sensitive mechanism reacts the whole time a lever is on; an edge detector reacts only at the moment it flips. Rising-edge fires when power arrives, falling-edge when it leaves. That is the difference between "do it while held" and "do it once per press".',
      },
      {
        heading: 'The observer age',
        text: 'Pre-observer builds were clever and fragile: pistons pulling dust out of a circuit, torch loops catching the off-swing. Since observers, one block pointed at anything that changes does both edges — and a second observer or torch inverts to the other one.',
      },
    ],
    example: {
      text: 'Point an observer at a fence gate: every open and every close counts as one pulse — a visitor counter at the front door.',
      diagram: 'observer-detect',
    },
    related: ['observer', 'pulse', 'monostable-circuit'],
  }),
  entry({
    slug: 'monostable-circuit',
    term: 'Monostable circuit',
    aliases: ['monostable', 'one-shot'],
    category: 'timing',
    definition: 'A one-shot: whatever comes in, it answers with exactly one fixed-length pulse and then rests.',
    body: [
      {
        heading: 'One stable state',
        text: 'The name says it: one state is stable (off). An input kicks it into the temporary on-state for a set duration — one to a few game ticks — and it returns by itself, no matter how long or how many times you keep holding the input. Long button presses stay one event.',
      },
      {
        heading: 'Where one-shots live',
        text: 'Every "fire once per press" mechanism — pulse a T flip-flop, trigger a piston punch, avoid double-counting a held button — is a monostable in front of the real machinery. An observer watching a block is the modern one-shot.',
      },
    ],
    example: {
      text: 'A held button through a monostable counts as one click on a combination lock, instead of spamming the counter into the next code.',
      diagram: 'monostable-wave',
    },
    related: ['pulse', 'edge-detection', 't-flip-flop'],
  }),
  entry({
    slug: 'tick-perfect',
    term: 'Tick-perfect',
    aliases: ['tick perfect', 'on time'],
    category: 'timing',
    definition: 'A signal is tick-perfect when it arrives exactly on the game tick its design expects — with 1 gt pulses, one tick early or late is one tick missed.',
    body: [
      {
        heading: 'Why timing drifts',
        text: 'Signals start at some phase within a tick and propagate in whole ticks from there; two paths fired by the same button may not arrive aligned. Anything racing a piston, a falling block or a moving cart has to be timed: every branch measured in gt so the arrivals meet at the tick you planned.',
      },
      {
        heading: 'Resync tricks',
        text: 'Repeaters re-time: whatever pulse passes, the output lands a clean two ticks later, and odd numbers of inverters flip the phase. Speedrun-grade builds (shulkers, bed leaves) are mostly "tick-perfect" in this sense: the input must land in one specific tick of the cycle.',
      },
    ],
    example: {
      text: 'A one-tick piston push in front of a falling anvil: fire on the planned tick and the anvil lands on the piston head — one tick late and it lands on the floor.',
      diagram: 'clock-wave',
    },
    related: ['game-tick', 'pulse', 'delay'],
  }),
];
