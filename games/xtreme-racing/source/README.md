# XTREME RACING source

This is ARCADIA's customized TypeScript/Vite source for Ryan Campbell's MIT-licensed Kart Royale project.

The ARCADIA changes are concentrated in:

- `src/main.ts` for the same-origin ARCADIA lifecycle and race-result bridge
- `src/ui/Menus.ts` and `src/ui/HUD.ts` for ARCADIA launch/restart actions, title treatment, and MPH display
- `src/audio/Audio.ts` for independent music and sound-effect mute control
- `src/core/TouchControls.ts` for the XTREME RACING landscape message
- `index.html`, `public/manifest.webmanifest`, and `vite.config.ts` for branding and relative production paths

Install and build:

```powershell
npm.cmd ci
npm.cmd run build
```

Vite writes the deployable game into `dist/`. ARCADIA serves the checked-in production copy from the parent `games/xtreme-racing/` directory.
