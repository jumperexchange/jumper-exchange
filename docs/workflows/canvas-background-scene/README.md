# Canvas background scene workflow

Partner themes can replace the page background with a bundled WebGL scene. Scenes are **not** wired in `Background.tsx` per scene — register them in the canvas background registry and configure Strapi.

**Triggers:** new canvas background scene, port handoff init script, partner theme background, `customization.canvasBackground` in Strapi.

Read first:

- `src/components/CanvasBackground/types.ts` — init contract
- `src/components/CanvasBackground/scenes/coinField/` — reference implementation
- `src/components/Background.tsx` — mount point (generic `CanvasBackground` only)

## Architecture (do not bypass)

```
Strapi customization.canvasBackground { id, options? }
  → formatConfig() / resolveCanvasBackgroundConfig()
  → configTheme.canvasBackground
  → Background.tsx → CanvasBackground.tsx
  → registry.loadInit(id) → initScene(canvas, options)
```

Rules:

- **Bundled registry only** — no external script URLs
- **Canvas replaces** image/video + default gradients when active
- **Do not edit** `Background.tsx` or `CanvasBackground.tsx` for new scenes
- **No barrel files** — import source files directly

## Workflow checklist

```
Scene progress:
- [ ] 1. Choose scene id (camelCase, registry key)
- [ ] 2. Create scenes/<id>/ with init + defaults + schema + definition
- [ ] 3. Register in canvasBackgroundRegistry.ts
- [ ] 4. Add resolveCanvasBackgroundConfig.spec.ts cases
- [ ] 5. Document Strapi payload for CMS
- [ ] 6. Run tests + typecheck touched files
```

## Step 1 — Scene id

- Lowercase camelCase: `coinField`, `particleWave`, `tokenOrbit`
- Must match Strapi `canvasBackground.id`
- Must be unique in `canvasBackgroundRegistry.ts`

## Step 2 — Create scene folder

Path: `src/components/CanvasBackground/scenes/<sceneId>/`

| File                        | Purpose                                                                   |
| --------------------------- | ------------------------------------------------------------------------- |
| `<sceneId>.ts`              | Framework-agnostic init: `(canvas, options) => { set, resize, dispose }`  |
| `<sceneId>Defaults.ts`      | Default options object (single source of truth)                           |
| `<sceneId>OptionsSchema.ts` | Zod `.strict()` schema for all allowed Strapi keys                        |
| `<sceneId>Definition.ts`    | Registry entry: id, schema, defaults, structuralOptionKeys, lazy loadInit |

### Init contract

```ts
import type { CanvasBackgroundHandle } from '@/components/CanvasBackground/types';

export const initMyScene = (
  canvas: HTMLCanvasElement,
  options: Record<string, unknown>,
): CanvasBackgroundHandle => ({
  set(patch) {
    /* live-tunable knobs */
  },
  resize() {
    /* optional; ResizeObserver usually enough */
  },
  dispose() {
    /* cancel rAF, disconnect observers, dispose WebGL */
  },
});
```

Init requirements:

- Accept `HTMLCanvasElement` already in the DOM (fixed full-viewport, `pointer-events: none`)
- Composit over `options.bg` when the scene uses a flat background colour
- Respect `prefers-reduced-motion: reduce`
- Pause when tab hidden / canvas offscreen when practical
- **Dispose everything** — geometries, materials, textures, renderer, listeners
- Keep Three.js / heavy deps inside the lazy-loaded module (not in definition/schema files)

### Defaults file

```ts
export const MY_SCENE_DEFAULTS = {
  bg: '#120B1E',
  // ...all keys the schema expects
} as const;
```

### Options schema

- Use Zod `.strict()` — unknown Strapi keys are rejected at format time
- Export defaults from defaults file (re-export ok)
- Every key in defaults must appear in schema
- Nested objects: define nested Zod objects (see `coinFieldOptionsSchema.ts`)

### Definition file

```ts
import type { CanvasBackgroundRegistration } from '@/components/CanvasBackground/types';
import {
  MY_SCENE_DEFAULTS,
  mySceneOptionsSchema,
} from './mySceneOptionsSchema';

export const mySceneDefinition: CanvasBackgroundRegistration = {
  id: 'myScene',
  optionsSchema: mySceneOptionsSchema,
  defaultOptions: structuredClone(MY_SCENE_DEFAULTS) as Record<string, unknown>,
  structuralOptionKeys: ['layout', 'meshes'], // keys that require remount
  loadInit: () => import('./myScene').then((m) => m.initMyScene),
};
```

**structuralOptionKeys** — listed keys trigger full dispose + re-init when changed. Everything else is applied via `handle.set(options)` without remount. Choose carefully:

- Structural: scene graph layout, asset lists, shader variants, enabled/disabled major features
- Live-tunable: colours, speeds, opacities, bloom strength, cursor radius

Always include `bg` in defaults/schema when the scene composites over a flat colour (maps from partner `backgroundColor` when Strapi omits `bg`).

## Step 3 — Register

In `src/components/CanvasBackground/canvasBackgroundRegistry.ts`:

```ts
import { mySceneDefinition } from '@/components/CanvasBackground/scenes/myScene/mySceneDefinition';

export const canvasBackgroundRegistry = {
  [coinFieldDefinition.id]: coinFieldDefinition,
  [mySceneDefinition.id]: mySceneDefinition,
};
```

## Step 4 — Tests

Add cases to `src/components/CanvasBackground/resolveCanvasBackgroundConfig.spec.ts`:

- Unknown id → `null`
- Empty options → defaults
- Valid partial override merges correctly
- `backgroundColor` maps to `bg` when `bg` omitted
- Invalid type / unknown key → `null`

Run: `pnpm vitest run src/components/CanvasBackground/resolveCanvasBackgroundConfig.spec.ts`

## Step 5 — Strapi payload

CMS field: `lightConfig.customization.canvasBackground` / `darkConfig.customization.canvasBackground`

```json
{
  "id": "myScene",
  "options": {
    "bgGlitch": 0.3
  }
}
```

Strapi only needs to send **overrides**; defaults fill the rest at `formatConfig()` time.

See [examples.md](./examples.md) for coinField payload and option classification.

## Porting handoff JS

When given a standalone init file (e.g. `initCoinField(canvas, options)`):

1. Drop into `scenes/<id>/<id>.ts` with minimal changes
2. Extract defaults into `<id>Defaults.ts`
3. Mirror defaults in Zod schema
4. Add `@ts-nocheck` only if the handoff is large legacy JS and typing cost outweighs benefit
5. Verify `dispose()` from the handoff is complete

## Performance defaults

Match `coinField` unless the scene is simpler:

- Defer init: `CanvasBackground` already uses `requestIdleCallback`
- Cap DPR (`maxDpr: 1.5` typical)
- Cap FPS for ambient motion (`fpsCap: 30`)
- `pauseWhenHidden` + `pauseWhenOffscreen`

## Out of scope

- External script loading from Strapi URLs
- Layering canvas over partner image/video (canvas **replaces** them)
- Changes to `Background.tsx` / `CanvasBackground.tsx` per scene
- Strapi admin UI (document payload only)

## Verification before finishing

1. Registry contains new id
2. Schema parses defaults + sample Strapi override
3. Unit tests pass
4. No Three.js import in definition/schema/defaults files (lazy load only)
5. User gets example Strapi JSON for the partner
