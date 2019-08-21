# breadstone

Breadstone is one of my side-projects, that will probably be forgotten in a months time.

Breadstone is the combination of BREADboard as in electronics prototyping and redSTONE as in minecraft circuitry.

This blazor app is an experiment to attempt to create a circuit design software that supports export to minecraft redstone circuits.

## Why blazor

I think it's an interesting technology and I wanted to give it a try. If by any chance, I actually progress in this project any significant amount, then having near-native speed can also come in handy when it comes to circuit optimisation and layouting in the 3D world of minecraft to transpile logical circuits to as small as possible volumes of redstone.

## What are the formats

The `spec` folder contains all definitions and specifications. Currently there is only a spec for intermediate storage of complex circuitry, and not yet any 3D format for blocks.

## What's the progress

Pretty much none. The app can currently dynamically render an SVG of some hardcoded circuit components with some pretty grid lines, but other than that, nothing works.

## What's ahead

The roadmap looks as follows:

- Complex circuit editor
  - Reusable (custom) components
  - Circuit emulation
  - Auto-layouting of components and wiring
- Complex circuit to flat circuit converter
- Flat circuit to minecraft blocks converter
  - In-App 3D redstone emulation and rendering (isometric SVG-rendering probably, or maybe via WebGL)
  - Trimming unused wire paths
  - Layouting engine with support for space and timing boundaries
