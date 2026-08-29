# XTREME RACING upstream

XTREME RACING is ARCADIA's customized build of [Kart Royale](https://github.com/ryancampbell/kart-royale) by Ryan Campbell.

The upstream project is distributed under the MIT License included in this directory. ARCADIA changes the title presentation, connects race lifecycle and results to ARCADIA, and displays speed in miles per hour.

The customized TypeScript/Vite project is retained in `source/`. The production JavaScript source map in `assets/` also retains the corresponding TypeScript sources for this build.

To rebuild, run `npm ci` and `npm run build` from `source/`, then copy the generated `dist/` files into this directory while preserving `LICENSE`, `UPSTREAM.md`, and `source/`.
