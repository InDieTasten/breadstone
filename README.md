![# breadstone](https://repository-images.githubusercontent.com/197829352/8b0d6880-c46a-11e9-903b-6500e4a61ad2)

Breadstone is one of my side-projects, that will probably be forgotten in a months time.

Breadstone is the combination of BREADboard as in electronics prototyping and redSTONE as in minecraft circuitry.

This is an experiment to attempt to create a circuit design software that supports export to minecraft redstone circuits.

## What's this

A Rust (axum) backend and a React (Vite + TypeScript) frontend, packaged as a single container image: the release
build embeds `web/dist` into the binary, which serves the API under `/api` and the SPA for everything else.
This is the fresh scaffold after the switch away from Blazor; the circuit editor itself is still to be built.

## Repository layout

- `src/` – axum API (`/healthz`, `/api/version`, `/api/circuits`) and the embedded SPA
- `web/` – React frontend; `npm run dev` proxies `/api` to a locally running backend
- `spec/` – format definitions: intermediate storage of complex circuitry (no 3D block format yet)

## Development

```
cargo run                        # API + embedded UI on 0.0.0.0:8080 (UI served from disk in debug builds)
cd web && npm ci && npm run dev  # UI on 5173 with HMR, /api proxied to :8080
```

Checks: `cargo fmt --check`, `cargo clippy --all-targets -- -- -D warnings`, `cargo test`, `npm run build`.

## Deployment

- PRs: CI runs the checks; PRs from this repository also get a preview slot at
  `https://breadstone-pr-<N>.dev.indietasten.net` (removed when the PR closes).
- Pushes to `master` build `ghcr.io/indietasten/breadstone:sha-<short>` (`edge` as well), publish a GitHub release
  `sha-<short>` and bump the stack in `InDieTasten/lab`, which serves https://breadstone.indietasten.net.

## What's the progress

The scaffold: the API answers, the UI lists (in-memory) circuits through it. Everything else is ahead.

## What's ahead

The roadmap looks as follows:

- Complex circuit editor
  - Reusable (custom) components
  - Circuit emulation
  - Auto-layouting of components and wiring
  - (Parametric component design)
  - (Wire bundling/splitting alias bus support)
- Complex circuit to flat circuit converter
- Flat circuit to minecraft blocks converter
  - In-App 3D redstone emulation and rendering (isometric SVG-rendering probably, or maybe via WebGL)
  - Trimming unused wire paths
  - Layouting engine with support for space and timing boundaries
  - Export to schematic file format or similar
