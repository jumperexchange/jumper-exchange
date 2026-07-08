# Canvas background scene examples

## Reference scene: coinField

Location: `src/components/CanvasBackground/scenes/coinField/`

Strapi payload:

```json
{
  "id": "coinField",
  "options": {
    "bg": "#120B1E",
    "bgGlitch": 0.3,
    "text": { "content": "Keep it private" }
  }
}
```

If `bg` is omitted, partner `BackgroundColorLight` / `BackgroundColorDark` is mapped to `options.bg` automatically.

## Option classification (coinField)

| Key                                          | Kind       | Notes                                 |
| -------------------------------------------- | ---------- | ------------------------------------- |
| `coins`                                      | structural | remount required                      |
| `text`                                       | structural | remount required                      |
| `bg`, `bgGlitch`, `spin`, `move`, `bloom`, … | live       | applied via `handle.set()`            |
| `bg`                                         | special    | falls back to partner backgroundColor |

## Minimal new scene skeleton

### mySceneDefaults.ts

```ts
export const MY_SCENE_DEFAULTS = {
  bg: '#0a0a0f',
  speed: 0.2,
  intensity: 0.5,
} as const;
```

### mySceneOptionsSchema.ts

```ts
import { z } from 'zod';
import { MY_SCENE_DEFAULTS } from './mySceneDefaults';

export const mySceneOptionsSchema = z
  .object({
    bg: z.string(),
    speed: z.number().min(0).max(2),
    intensity: z.number().min(0).max(1),
  })
  .strict();

export { MY_SCENE_DEFAULTS };
```

### myScene.ts (minimal stub)

```ts
import type { CanvasBackgroundHandle } from '@/components/CanvasBackground/types';
import { MY_SCENE_DEFAULTS } from './mySceneDefaults';

export const initMyScene = (
  canvas: HTMLCanvasElement,
  options: Record<string, unknown>,
): CanvasBackgroundHandle => {
  const opts = { ...MY_SCENE_DEFAULTS, ...options };
  let raf = 0;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return { set: () => {}, resize: () => {}, dispose: () => {} };
  }

  const draw = () => {
    ctx.fillStyle = String(opts.bg);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const loop = () => {
    draw();
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);

  return {
    set(patch) {
      Object.assign(opts, patch);
    },
    resize() {
      draw();
    },
    dispose() {
      cancelAnimationFrame(raf);
    },
  };
};
```

Replace the 2D stub with Three.js when the design requires WebGL; keep the same handle shape.

## Test cases to add

```ts
it('resolves myScene with defaults', () => {
  const result = resolveCanvasBackgroundConfig({ id: 'myScene' }, null);
  expect(result?.id).toBe('myScene');
  expect(result?.options.speed).toBe(0.2);
});
```
