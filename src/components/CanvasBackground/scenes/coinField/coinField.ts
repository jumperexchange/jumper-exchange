// @ts-nocheck
/**
 * coinField — a Three.js background of hovering, text-dithered token coins.
 * The cursor carries a noisy-edged "scan window" that reveals the real keylit
 * 3D coins; the rest renders as a flowing #653CA2 text-dither over a flat bg.
 *
 * Framework-agnostic. Renders TRANSPARENT content composited over `bg` — drop a
 * <canvas> behind your UI and call initCoinField(canvas, options).
 *
 *   import { initCoinField } from './coinField.js';
 *   const field = initCoinField(canvasEl, { bg: '#120B1E' });
 *   // later: field.set({ bgGlitch: 0.6 });  field.dispose();
 *
 * Requires `three` (^0.169). Uses three/addons postprocessing + RoomEnvironment.
 */
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import type { CanvasBackgroundHandle } from '@/components/CanvasBackground/types';
import { COIN_FIELD_DEFAULTS } from './coinFieldDefaults';
import { coinFieldOptionsSchema } from './coinFieldOptionsSchema';

type CoinConf = {
  token: string;
  x: number;
  y: number;
  scale: number;
  rot: { x: number; y: number; z: number };
  phase: number;
};

type CoinFieldOptions = typeof COIN_FIELD_DEFAULTS & {
  cell: { w: number; h: number };
  bloom: { strength: number; radius: number; threshold: number };
  coins: CoinConf[];
  text: (typeof COIN_FIELD_DEFAULTS)['text'] | null;
};

type RedrawCanvas = HTMLCanvasElement & {
  __needsRedraw?: () => void;
};

const DEFAULTS = structuredClone(COIN_FIELD_DEFAULTS) as CoinFieldOptions;

const FILLER =
  'USDC 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 ERC-20 DECIMALS=6 ' +
  'TRANSFER(TO,AMOUNT) APPROVE(SPENDER) BALANCEOF(ACCOUNT) MINT BURN ' +
  'BACKED 1:1 USD RESERVES ATTESTED MONTHLY CIRCLE DIGITAL DOLLAR ' +
  'ONCHAIN SETTLEMENT 24/7 INSTANT GLOBAL ';

/* ---------- Token registry: per-coin face artwork + metal colours ---------- */
/* `glyph(ctx,S,bump)` draws onto a radial-gradient disc; `paint(...)` paints the
   whole disc itself. `unmirroredBack:true` keeps the back face un-flipped. */
const svgImgCache = new Map();
function drawSvg(g, S, svgString, dx = 0, dy = 0, dw = S, dh = S) {
  let img = svgImgCache.get(svgString);
  if (!img) {
    img = new Image();
    img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svgString);
    svgImgCache.set(svgString, img);
  }
  if (img.complete && img.naturalWidth) {
    g.drawImage(img, dx, dy, dw, dh);
    return true;
  }
  img.addEventListener(
    'load',
    () => {
      const redrawCanvas = g.canvas as RedrawCanvas;
      redrawCanvas.__needsRedraw?.();
    },
    { once: true },
  );
  return false;
}

const TOKENS = {
  eth: {
    bg: ['#7289f0', '#627EEA', '#5166c9'],
    side: 0x4f64c4,
    rim: 0x7289f0,
    glyph(g, S, bump) {
      const cx = S / 2,
        cy = S / 2,
        u = S;
      const upper = () => {
        g.beginPath();
        g.moveTo(cx, cy - 0.36 * u);
        g.lineTo(cx + 0.215 * u, cy + 0.01 * u);
        g.lineTo(cx, cy + 0.125 * u);
        g.lineTo(cx - 0.215 * u, cy + 0.01 * u);
        g.closePath();
      };
      const lower = () => {
        g.beginPath();
        g.moveTo(cx - 0.215 * u, cy + 0.075 * u);
        g.lineTo(cx, cy + 0.185 * u);
        g.lineTo(cx + 0.215 * u, cy + 0.075 * u);
        g.lineTo(cx, cy + 0.4 * u);
        g.closePath();
      };
      g.fillStyle = '#fff';
      upper();
      g.fill();
      lower();
      g.fill();
      if (!bump) {
        g.save();
        g.beginPath();
        g.rect(cx, cy - 0.5 * u, 0.5 * u, u);
        g.clip();
        g.fillStyle = 'rgba(98,126,234,0.35)';
        upper();
        g.fill();
        lower();
        g.fill();
        g.restore();
      }
    },
  },
  usdc: {
    bg: ['#3e73c4', '#3e73c4', '#3e73c4'],
    side: 0x2e5da0,
    rim: 0x5390e2,
    unmirroredBack: true,
    paint(g, S, bump) {
      const inner = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
<path fill="${bump ? '#000' : '#3e73c4'}" d="M8 16c4.4183 0 8 -3.5817 8 -8 0 -4.41828 -3.5817 -8 -8 -8C3.58172 0 0 3.58172 0 8c0 4.4183 3.58172 8 8 8Z"/>
<path fill="#fff" d="M10.01105 9.062c0 -1.062 -0.64 -1.426 -1.92 -1.578 -0.914 -0.1215 -1.0965 -0.364 -1.0965 -0.789 0 -0.425 0.305 -0.698 0.914 -0.698 0.5485 0 0.8535 0.182 1.0055 0.6375 0.0158 0.04405 0.04475 0.0822 0.08295 0.10925 0.03815 0.0271 0.0837 0.04185 0.13055 0.04225h0.4875c0.02815 0.00075 0.05615 -0.0042 0.08235 -0.0146 0.02615 -0.0104 0.04995 -0.02605 0.0699 -0.0459 0.01995 -0.01985 0.0357 -0.0436 0.0462 -0.0697 0.01055 -0.02615 0.01565 -0.05415 0.01505 -0.0823v-0.03c-0.0596 -0.32955 -0.22635 -0.6302 -0.47435 -0.85525 -0.248 -0.22505 -0.5634 -0.36185 -0.89715 -0.38925V4.571005c0 -0.1215 -0.0915 -0.2125 -0.2435 -0.243h-0.4575c-0.1215 0 -0.213 0.091 -0.2435 0.243V5.269c-0.9145 0.121 -1.493 0.728 -1.493 1.487 0 1.001 0.609 1.3955 1.889 1.5475 0.8535 0.1515 1.1275 0.334 1.1275 0.8195 0 0.485 -0.4265 0.819 -1.0055 0.819 -0.7925 0 -1.0665 -0.3335 -1.158 -0.789 -0.03 -0.121 -0.122 -0.182 -0.2135 -0.182h-0.518c-0.02815 -0.0007 -0.0561 0.00435 -0.0822 0.0148 -0.02615 0.0104 -0.04985 0.02605 -0.0698 0.0459 -0.0199 0.01985 -0.03555 0.04355 -0.04605 0.06965 -0.0105 0.0261 -0.0156 0.05405 -0.01495 0.08215v0.03c0.1215 0.759 0.6095 1.305 1.615 1.457v0.7285c0 0.121 0.0915 0.2125 0.2435 0.2425h0.4575c0.1215 0 0.213 -0.091 0.2435 -0.2425V10.67c0.9145 -0.1515 1.5235 -0.789 1.5235 -1.6085v0.0005Z"/>
<path fill="#fff" d="M6.446 12.2485c-2.37698 -0.85 -3.59598 -3.49 -2.71198 -5.8265 0.457 -1.275 1.46248 -2.2455 2.71198 -2.701 0.122 -0.0605 0.1825 -0.1515 0.1825 -0.3035v-0.425c0 -0.121 -0.0605 -0.212 -0.1825 -0.2425 -0.0305 0 -0.0915 0 -0.122 0.03 -0.68575 0.21416 -1.3224 0.561865 -1.87327 1.023085 -0.550855 0.461225 -1.00503 1.026855 -1.336385 1.664315 -0.331355 0.6375 -0.53334 1.3342 -0.59432 2.05005 -0.06098 0.71585 0.020245 1.4367 0.238995 2.12105 0.548 1.7 1.8585 3.005 3.56498 3.551 0.122 0.0605 0.244 0 0.274 -0.1215 0.0305 -0.03 0.0305 -0.061 0.0305 -0.1215v-0.425c0 -0.091 -0.091 -0.212 -0.1825 -0.273Zm3.23 -9.468c-0.122 -0.061 -0.244 0 -0.274 0.121 -0.0305 0.0305 -0.0305 0.061 -0.0305 0.1215v0.425c0 0.1215 0.091 0.2425 0.1825 0.3035 2.377 0.85 3.596 3.49 2.712 5.8265 -0.457 1.275 -1.4625 2.2455 -2.712 2.701 -0.122 0.0605 -0.1825 0.1515 -0.1825 0.3035v0.425c0 0.121 0.0605 0.212 0.1825 0.2425 0.0305 0 0.0915 0 0.122 -0.03 0.6858 -0.21415 1.32245 -0.56185 1.8733 -1.0231 0.55085 -0.4612 1.00505 -1.02685 1.3364 -1.6643 0.33135 -0.6375 0.53335 -1.3342 0.5943 -2.05005 0.061 -0.71585 -0.02025 -1.4367 -0.239 -2.12105 -0.548 -1.73 -1.889 -3.035 -3.565 -3.581Z"/>
</svg>`;
      drawSvg(g, S, inner);
    },
  },
  usdt: {
    bg: ['#13a8a2', '#0d9d97', '#0a857f'],
    side: 0x0a857f,
    rim: 0x17b0aa,
    glyph(g, S, bump) {
      const cx = S / 2,
        cy = S / 2,
        u = S;
      const P = [
        [-0.205, -0.225],
        [0.205, -0.225],
        [0.345, -0.02],
        [0, 0.305],
        [-0.345, -0.02],
      ].map((p) => [cx + p[0] * u, cy + p[1] * u]);
      g.fillStyle = '#fff';
      g.strokeStyle = '#fff';
      g.lineWidth = 0.05 * u;
      g.lineJoin = 'round';
      g.beginPath();
      g.moveTo(P[0][0], P[0][1]);
      for (let i = 1; i < 5; i++) {
        g.lineTo(P[i][0], P[i][1]);
      }
      g.closePath();
      g.fill();
      g.stroke();
      const ink = bump ? '#000' : '#0d9d97';
      g.fillStyle = ink;
      g.strokeStyle = ink;
      g.fillRect(cx - 0.155 * u, cy - 0.175 * u, 0.31 * u, 0.055 * u);
      g.lineWidth = 0.038 * u;
      g.beginPath();
      g.ellipse(cx, cy - 0.015 * u, 0.155 * u, 0.052 * u, 0, 0, Math.PI * 2);
      g.stroke();
      g.fillRect(cx - 0.034 * u, cy - 0.175 * u, 0.068 * u, 0.32 * u);
    },
  },
  base: {
    bg: ['#ffffff', '#f2f3f8', '#dfe3f0'],
    side: 0x0000dd,
    rim: 0x2a2aff,
    glyph(g, S, bump) {
      const cx = S / 2,
        cy = S / 2,
        u = S,
        half = 0.3 * u,
        r = 0.055 * u;
      g.fillStyle = bump ? '#fff' : '#0000ff';
      g.beginPath();
      g.roundRect(cx - half, cy - half, half * 2, half * 2, r);
      g.fill();
    },
  },
  hl: {
    bg: ['#0e352e', '#0b2d26', '#071f1a'],
    side: 0x0b2d26,
    rim: 0x16463c,
    unmirroredBack: true,
    glyph(g, S, bump) {
      const cx = S / 2,
        cy = S / 2;
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 16">
<path fill="${bump ? '#fff' : '#97fce4'}" d="M20.4543 7.53987C20.473 9.21857 20.1216 10.8228 19.4312 12.3554C18.4454 14.5378 16.0819 16.3223 13.9238 14.4228C12.1636 12.8746 11.8371 9.73157 9.19993 9.27147C5.71075 8.84867 5.62678 12.8933 3.34731 13.3502C0.806614 13.8663 -0.0361384 9.59477 0.00117909 7.65487C0.0384965 5.71497 0.554722 2.98856 2.76267 2.98856C5.30337 2.98856 5.4744 6.83417 8.69926 6.62587C11.8931 6.40827 11.949 2.40721 14.0357 0.694264C15.8363 -0.785526 17.954 0.299443 19.0145 2.08079C19.9972 3.72847 20.4294 5.66217 20.4512 7.53987H20.4543Z"/>
</svg>`;
      const tw = S * 0.62,
        th = (tw * 16) / 21;
      drawSvg(g, S, svg, cx - tw / 2, cy - th / 2, tw, th);
    },
  },
  sol: {
    bg: ['#1c1c28', '#13131c', '#0d0d13'],
    side: 0x16161f,
    rim: 0x262633,
    unmirroredBack: true,
    glyph(g, S, bump) {
      const cx = S / 2,
        cy = S / 2,
        u = S;
      const bar = (byc, slant) => {
        const hw = 0.26 * u,
          hh = 0.045 * u;
        const grad = g.createLinearGradient(cx - hw, 0, cx + hw, 0);
        grad.addColorStop(0, '#00FFA3');
        grad.addColorStop(1, '#DC1FFF');
        g.fillStyle = bump ? '#fff' : grad;
        g.beginPath();
        g.moveTo(cx - hw + slant, byc - hh);
        g.lineTo(cx + hw + slant, byc - hh);
        g.lineTo(cx + hw - slant, byc + hh);
        g.lineTo(cx - hw - slant, byc + hh);
        g.closePath();
        g.fill();
      };
      bar(cy - 0.16 * u, 0.05 * u);
      bar(cy, -0.05 * u);
      bar(cy + 0.16 * u, 0.05 * u);
    },
  },
};

function hexToVec3(hex) {
  const h = String(hex).replace('#', '');
  const f =
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h;
  const n = parseInt(f, 16);
  return new THREE.Vector3(
    ((n >> 16) & 255) / 255,
    ((n >> 8) & 255) / 255,
    (n & 255) / 255,
  );
}

export function initCoinField(
  canvas: HTMLCanvasElement,
  options: Record<string, unknown> = {},
): CanvasBackgroundHandle {
  const merged = {
    ...DEFAULTS,
    ...options,
    cell: { ...DEFAULTS.cell, ...(options.cell || {}) },
    bloom: { ...DEFAULTS.bloom, ...(options.bloom || {}) },
  };
  const parseResult = coinFieldOptionsSchema.safeParse(merged);
  if (!parseResult.success) {
    console.error('Invalid coinField options:', parseResult.error);
  }
  const opts: CoinFieldOptions = parseResult.success
    ? parseResult.data
    : DEFAULTS;
  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;

  /* renderer / scenes / camera */
  // antialias:false — the scene is composited through render targets + bloom, so MSAA on the default
  // framebuffer does nothing here; the dither + bloom already soften every edge.
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false,
    alpha: true,
    premultipliedAlpha: false,
  });
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  const coinScene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 80);
  camera.position.set(0, 0.2, 11);
  camera.lookAt(0, 0, 0);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  coinScene.environment = envTex;
  coinScene.environmentIntensity = 0.5;

  /* lights */
  const keyL = new THREE.PointLight(0xfff2e8, 52, 0, 2);
  keyL.position.set(-3.5, 3.8, 6.2);
  const rimL = new THREE.DirectionalLight(0xb48cff, 1.5);
  rimL.position.set(5, 2.5, -4);
  const fillL = new THREE.AmbientLight(0x2a2440, 1.0);
  const cursorL = new THREE.PointLight(0x9a6cff, 0, 8, 2);
  cursorL.position.set(0, 0, 2.2);
  coinScene.add(keyL, rimL, fillL, cursorL);

  /* coin textures + meshes */
  function makeTokenTextures(token) {
    const S = 1024;
    const mk = (bump) => {
      const c = document.createElement('canvas');
      c.width = c.height = S;
      const g = c.getContext('2d');
      if (token.paint) {
        token.paint(g, S, bump);
        return c;
      }
      if (bump) {
        g.fillStyle = '#000';
        g.fillRect(0, 0, S, S);
      } else {
        const grad = g.createRadialGradient(
          S / 2,
          S / 2,
          S * 0.1,
          S / 2,
          S / 2,
          S * 0.52,
        );
        grad.addColorStop(0, token.bg[0]);
        grad.addColorStop(0.7, token.bg[1]);
        grad.addColorStop(1, token.bg[2]);
        g.fillStyle = grad;
        g.fillRect(0, 0, S, S);
      }
      token.glyph(g, S, bump);
      return c;
    };
    const mapCanvas = mk(false),
      bumpCanvas = mk(true);
    const map = new THREE.CanvasTexture(mapCanvas);
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const bump = new THREE.CanvasTexture(bumpCanvas);
    bump.anisotropy = map.anisotropy;
    const redraw = () => {
      // re-paint once async SVG images load
      const g1 = mapCanvas.getContext('2d'),
        g2 = bumpCanvas.getContext('2d');
      g1.clearRect(0, 0, S, S);
      g2.clearRect(0, 0, S, S);
      if (token.paint) {
        token.paint(g1, S, false);
        token.paint(g2, S, true);
      } else {
        const grad = g1.createRadialGradient(
          S / 2,
          S / 2,
          S * 0.1,
          S / 2,
          S / 2,
          S * 0.52,
        );
        grad.addColorStop(0, token.bg[0]);
        grad.addColorStop(0.7, token.bg[1]);
        grad.addColorStop(1, token.bg[2]);
        g1.fillStyle = grad;
        g1.fillRect(0, 0, S, S);
        token.glyph(g1, S, false);
        g2.fillStyle = '#000';
        g2.fillRect(0, 0, S, S);
        token.glyph(g2, S, true);
      }
      map.needsUpdate = true;
      bump.needsUpdate = true;
    };
    (mapCanvas as RedrawCanvas).__needsRedraw = redraw;
    (bumpCanvas as RedrawCanvas).__needsRedraw = redraw;
    return { map, bump };
  }
  function mirrorTex(t) {
    const m = t.clone();
    m.needsUpdate = true;
    m.wrapS = THREE.RepeatWrapping;
    m.repeat.x = -1;
    m.offset.x = 1;
    return m;
  }

  function buildCoin(conf) {
    const token = TOKENS[conf.token] || TOKENS.usdc;
    const { map, bump } = makeTokenTextures(token);
    const matOpts = {
      bumpScale: 0.6,
      metalness: 0.55,
      roughness: 0.42,
      envMapIntensity: 0.6,
    };
    const faceFront = new THREE.MeshStandardMaterial({
      map,
      bumpMap: bump,
      ...matOpts,
    });
    const bm = token.unmirroredBack ? map : mirrorTex(map);
    const bb = token.unmirroredBack ? bump : mirrorTex(bump);
    const faceBack = new THREE.MeshStandardMaterial({
      map: bm,
      bumpMap: bb,
      ...matOpts,
    });
    const side = new THREE.MeshStandardMaterial({
      color: token.side,
      metalness: 0.6,
      roughness: 0.45,
      envMapIntensity: 0.55,
    });
    const rim = new THREE.MeshStandardMaterial({
      color: token.rim,
      metalness: 0.65,
      roughness: 0.38,
      envMapIntensity: 0.65,
    });
    const R = 1.0,
      T = 0.14;
    const group = new THREE.Group();
    const edge = new THREE.CylinderGeometry(R, R, T, 96, 1, true);
    edge.rotateX(Math.PI / 2);
    group.add(new THREE.Mesh(edge, side));
    const front = new THREE.Mesh(new THREE.CircleGeometry(R, 96), faceFront);
    front.position.z = T / 2;
    group.add(front);
    const back = new THREE.Mesh(new THREE.CircleGeometry(R, 96), faceBack);
    back.position.z = -T / 2;
    back.rotation.y = Math.PI;
    group.add(back);
    const torus = new THREE.TorusGeometry(R * 0.97, 0.028, 24, 128);
    const rimF = new THREE.Mesh(torus, rim);
    rimF.position.z = T * 0.45;
    const rimB = new THREE.Mesh(torus, rim);
    rimB.position.z = -T * 0.45;
    group.add(rimF, rimB);
    group.scale.setScalar(conf.scale);
    return group;
  }

  /* optional text plane — same scene as coins → free dither + cursor reveal */
  function buildTextPlane(cfg) {
    const cw = 2048,
      ch = 384;
    const c = document.createElement('canvas');
    c.width = cw;
    c.height = ch;
    const g = c.getContext('2d');
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const draw = () => {
      g.clearRect(0, 0, cw, ch);
      g.fillStyle = cfg.color || '#ece3ff';
      g.font = cfg.font || '600 230px sans-serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText(cfg.content || '', cw / 2, ch / 2);
      tex.needsUpdate = true;
    };
    draw();
    // re-paint after the font actually loads (first paint uses fallback metrics)
    if (document.fonts && document.fonts.load) {
      document.fonts
        .load(cfg.font || '600 230px sans-serif')
        .then(draw)
        .catch(() => {});
    }
    const W = cfg.width || 4.4,
      H = W * (ch / cw);
    const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(W, H), mat);
    const p = cfg.position || { x: 0, y: -3.0, z: -0.1 };
    mesh.position.set(p.x ?? 0, p.y ?? -3.0, p.z ?? -0.1);
    return mesh;
  }
  let textPlane = null;
  let textHalfW = 0,
    textHalfH = 0;
  if (opts.text) {
    textPlane = buildTextPlane(opts.text);
    coinScene.add(textPlane);
    textHalfW = textPlane.geometry.parameters.width / 2;
    textHalfH = textPlane.geometry.parameters.height / 2;
  }
  let curMaskR = opts.maskRadius; // smoothed mask radius (CSS px) for the text-hover boost
  const _projV = new THREE.Vector3();

  const coins = opts.coins.map((c, i) => {
    const g = buildCoin(c);
    g.position.set(c.x, c.y, 0);
    coinScene.add(g);
    return {
      conf: c,
      group: g,
      rotX: 0,
      rotY: 0,
      offX: 0,
      offY: 0,
      spinDir: (i % 2 ? -1 : 1) * (0.8 + 0.1 * i),
      spinAngle: 0,
    };
  });

  /* offscreen coin target + the composite (dither + mask) fullscreen pass */
  let rt = null,
    textTex = null;
  const compMat = new THREE.ShaderMaterial({
    transparent: true,
    depthTest: false,
    depthWrite: false,
    uniforms: {
      tCoin: { value: null },
      tText: { value: null },
      uRes: { value: new THREE.Vector2(1, 1) },
      uCell: { value: new THREE.Vector2(5, 7) },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(-9999, -9999) },
      uMaskR: { value: 58 },
      uNoiseAmp: { value: 0.14 },
      uRingCore: { value: 1 },
      uRingHalo: { value: 6 },
      uActive: { value: 0 },
      uPGrid: { value: 10 },
      uDitherOpacity: { value: 1 },
      uBgOpacity: { value: 1 },
      uBgFlow: { value: 30 },
      uBgGlitch: { value: 0.3 },
      uReveal: { value: 0 },
      uDots: { value: opts.dots === false ? 0 : 1 },
    },
    vertexShader: `void main(){ gl_Position = vec4(position.xy, 0.0, 1.0); }`,
    fragmentShader: `
      uniform sampler2D tCoin, tText;
      uniform vec2 uRes, uCell, uMouse;
      uniform float uTime, uMaskR, uNoiseAmp, uRingCore, uRingHalo, uActive, uPGrid;
      uniform float uDitherOpacity, uBgOpacity, uBgFlow, uBgGlitch, uReveal, uDots;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
      // dither ink at a frag position: a text glyph, or a halftone dot when uDots is on
      float ink(vec2 f){
        if (uDots > 0.5){
          vec2 d = (fract(f / uCell) - 0.5) * uCell;   // px offset from cell centre (aspect-correct -> round)
          float r = 0.40 * min(uCell.x, uCell.y);
          return 1.0 - smoothstep(r - 1.0, r + 0.5, length(d));
        }
        return texture2D(tText, f / uRes).a;
      }
      void main(){
        vec2 frag = gl_FragCoord.xy;
        vec2 cell = (floor(frag / uCell) + 0.5) * uCell;
        vec4 coinC = texture2D(tCoin, cell / uRes);
        float lum = dot(min(coinC.rgb, vec3(1.1)), vec3(0.299, 0.587, 0.114));
        float q = floor(min(lum, 0.999) * 6.0) / 6.0;
        float glyphA = ink(frag);
        float fl = 0.85 + 0.3 * hash(cell + floor(uTime * 7.0));
        vec3 textCol = vec3(0.396, 0.235, 0.635) * (0.62 + 0.42 * q) * fl;
        float textA = glyphA * coinC.a * (0.21 + 0.21 * q) * uDitherOpacity;

        vec2 dm = frag - uMouse;
        float d = length(dm);
        float ang = atan(dm.y, dm.x);
        float noise = 0.5 * sin(ang * 3.0 + uTime * 1.6) + 0.3 * sin(ang * 7.0 - uTime * 2.2) + 0.2 * sin(ang * 13.0 + uTime * 3.1);
        float E = uMaskR * uActive * (1.0 + uNoiseAmp * noise);
        float dd = d - E;
        float inside = 0.0, ringB = 0.0, haloB = 0.0;
        if (uActive > 0.001){
          inside = 1.0 - smoothstep(-1.5, 1.5, dd);
          float tk = 0.5 + 0.5 * (0.5 + 0.5 * sin(ang * 6.0 + uTime * 1.9)) * (0.5 + 0.5 * sin(ang * 13.0 - uTime * 2.6));
          float cw = uRingCore * (0.45 + 1.45 * tk);
          ringB = exp(-dd * dd / (2.0 * cw * cw)) * (0.45 + 0.55 * tk);
          haloB = exp(-dd * dd / (2.0 * uRingHalo * uRingHalo));
        }
        vec4 coin = texture2D(tCoin, frag / uRes);
        float cov = coin.a;
        // Reveal at full opacity even when source has semi-transparent content (e.g. the dimmed text plane).
        // Un-premultiply the colour so it reads at its original brightness; saturate the alpha to 1.
        vec3 colReveal = coin.rgb / max(coin.a, 0.001);
        float alphaReveal = clamp(coin.a * 10.0, 0.0, 1.0);
        vec3 col = mix(textCol, colReveal, inside);
        float alpha = mix(textA, alphaReveal, inside);
        if (uActive > 0.001 && cov > 0.01){
          vec3 ring = vec3(0.86, 0.74, 1.0) * ringB * 2.2 + vec3(0.60, 0.42, 1.0) * haloB * 0.26;
          col += ring * uActive * cov;
          alpha = max(alpha, min(1.0, (ringB * 0.8 + haloB * 0.18)) * uActive * cov);
          vec2 cellId = floor(frag / uPGrid);
          float h1 = hash(cellId), h2 = hash(cellId + 17.0);
          float cyc = fract(uTime * (0.45 + 0.5 * h2) + h1);
          vec2 dir = normalize(vec2(h1 - 0.5, h2 - 0.5) + 1e-4);
          vec2 dotC = (cellId + 0.5) * uPGrid + dir * cyc * uPGrid * 1.3;
          float dRad = uPGrid * (0.14 + 0.12 * h2);
          float disc = 1.0 - smoothstep(dRad * 0.5, dRad, length(frag - dotC));
          float band = exp(-dd * dd / (2.0 * pow(uRingHalo * 2.6, 2.0)));
          float dotA = step(0.80, h1) * sin(3.14159 * cyc) * disc * band;
          col += vec3(0.63, 0.45, 1.0) * dotA * 1.6 * uActive * cov;
          alpha = max(alpha, dotA * 0.8 * uActive * cov);
        }
        float grad = clamp(1.0 - frag.y / (uRes.y * 0.55), 0.0, 1.0); grad *= grad;
        vec2 fscroll = frag + vec2(0.0, -uTime * uBgFlow);
        float gg = uBgGlitch;
        float tb = floor(uTime * 11.0);
        float rowId = floor(fscroll.y / uCell.y);
        float burst = step(0.82, hash(vec2(rowId * 0.7, tb)));
        float jit = hash(vec2(rowId, tb)) - 0.5;
        vec2 gfrag = fscroll + vec2(jit * burst * gg * uCell.x * 9.0, 0.0);
        vec2 bcell = floor(gfrag / uCell);
        float bgGlyph = ink(gfrag);
        float keep = step(hash(bcell * 1.31), grad * 1.15);
        float bgA = bgGlyph * keep * (0.12 + 0.24 * hash(bcell + 7.0)) * min(grad * 1.7, 1.0);
        vec3 bgCol = vec3(0.396, 0.235, 0.635) * (0.7 + 0.5 * hash(bcell + 3.0));
        float rowFlick = step(0.94, hash(vec2(rowId, tb * 2.3))) * gg;
        bgA *= (1.0 + rowFlick * 0.6);
        bgCol = mix(bgCol, vec3(0.34, 0.66, 1.0), burst * gg * 0.30);
        bgA *= uBgOpacity;
        float outA = alpha + bgA * (1.0 - alpha);
        if (outA < 0.01) discard;
        col = (col * alpha + bgCol * bgA * (1.0 - alpha)) / outA;
        gl_FragColor = vec4(col * uReveal, outA);
      }`,
  });
  const tri = new THREE.BufferGeometry();
  tri.setAttribute(
    'position',
    new THREE.BufferAttribute(
      new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]),
      3,
    ),
  );
  const compQuad = new THREE.Mesh(tri, compMat);
  compQuad.frustumCulled = false;
  compQuad.renderOrder = 10;
  scene.add(compQuad);

  function buildTextTexture(bw, bh, dprX) {
    const cellW = Math.round(opts.cell.w * dprX),
      cellH = Math.round(opts.cell.h * dprX);
    const c = document.createElement('canvas');
    c.width = bw;
    c.height = bh;
    const g = c.getContext('2d');
    g.fillStyle = '#fff';
    g.font = `700 ${Math.round(opts.font * dprX)}px Menlo, Consolas, "Courier New", monospace`;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    const cols = Math.ceil(bw / cellW),
      rows = Math.ceil(bh / cellH);
    for (let r = 0; r < rows; r++) {
      const off = (r * 53) % FILLER.length;
      for (let cI = 0; cI < cols; cI++) {
        const ch = FILLER[(off + cI) % FILLER.length];
        if (ch === ' ') {
          continue;
        }
        g.fillText(ch, cI * cellW + cellW / 2, r * cellH + cellH / 2);
      }
    }
    const tex = new THREE.CanvasTexture(c);
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.generateMipmaps = false;
    return { tex, cellW, cellH };
  }

  /* post-processing — renders transparent, then composites over `bg` in display space */
  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  renderPass.clearColor = new THREE.Color(0x000000);
  renderPass.clearAlpha = 0;
  composer.addPass(renderPass);
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(1, 1),
    opts.bloom.strength,
    opts.bloom.radius,
    opts.bloom.threshold,
  );
  composer.addPass(bloomPass);
  composer.addPass(new OutputPass());
  const baseAddPass = new ShaderPass({
    uniforms: {
      tDiffuse: { value: null },
      uBase: { value: hexToVec3(opts.bg) },
    },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `uniform sampler2D tDiffuse; uniform vec3 uBase; varying vec2 vUv;
      void main(){ gl_FragColor = vec4(texture2D(tDiffuse, vUv).rgb + uBase, 1.0); }`,
  });
  composer.addPass(baseAddPass);

  /* sizing — driven by the canvas's own client box, not the window */
  let W = 1,
    H = 1,
    bw = 1,
    bh = 1,
    dpr = 1;
  function resize() {
    const rect = canvas.getBoundingClientRect();
    W = Math.max(1, Math.round(rect.width));
    H = Math.max(1, Math.round(rect.height));
    dpr = Math.min(window.devicePixelRatio || 1, opts.maxDpr);
    renderer.setPixelRatio(dpr);
    renderer.setSize(W, H, false);
    composer.setPixelRatio(dpr);
    composer.setSize(W, H);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    const size = renderer.getDrawingBufferSize(new THREE.Vector2());
    bw = size.x;
    bh = size.y;
    if (rt) {
      rt.dispose();
    }
    rt = new THREE.WebGLRenderTarget(bw, bh, { type: THREE.HalfFloatType });
    compMat.uniforms.tCoin.value = rt.texture;
    if (textTex) {
      textTex.tex.dispose();
    }
    textTex = buildTextTexture(bw, bh, dpr);
    compMat.uniforms.tText.value = textTex.tex;
    compMat.uniforms.uRes.value.set(bw, bh);
    compMat.uniforms.uCell.value.set(textTex.cellW, textTex.cellH);
    compMat.uniforms.uMaskR.value = opts.maskRadius * dpr;
    compMat.uniforms.uNoiseAmp.value = opts.maskNoise;
    compMat.uniforms.uRingCore.value = opts.ringCore * dpr;
    compMat.uniforms.uRingHalo.value = opts.ringHalo * dpr;
    compMat.uniforms.uPGrid.value = Math.max(3, Math.round(7 * dpr));
    compMat.uniforms.uDitherOpacity.value = opts.ditherOpacity;
    compMat.uniforms.uBgOpacity.value = opts.bgOpacity;
    compMat.uniforms.uBgFlow.value = opts.bgFlow * dpr;
    compMat.uniforms.uBgGlitch.value = opts.bgGlitch;
    bloomPass.resolution.set(W, H);
  }
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  window.addEventListener('resize', resize);
  resize();

  /* pause when the canvas isn't actually in view (free win for in-page / hero placements) */
  let onScreen = true;
  const io = new IntersectionObserver(
    (es) => {
      onScreen = es[0].isIntersecting;
    },
    { threshold: 0 },
  );
  io.observe(canvas);

  /* cursor — coordinates are canvas-local */
  const cursor = { x: -9999, y: -9999, active: false };
  const smoothC = { x: -9999, y: -9999 };
  let activeAmt = 0;
  function onMove(e) {
    const r = canvas.getBoundingClientRect();
    const lx = e.clientX - r.left,
      ly = e.clientY - r.top;
    cursor.active = lx >= 0 && lx <= r.width && ly >= 0 && ly <= r.height;
    cursor.x = lx;
    cursor.y = ly;
    if (smoothC.x < -9000) {
      smoothC.x = lx;
      smoothC.y = ly;
    }
  }
  function onLeave() {
    cursor.active = false;
  }
  window.addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('mouseleave', onLeave);
  window.addEventListener('blur', onLeave);

  const _v3 = new THREE.Vector3();
  function cursorWorld() {
    _v3.set((smoothC.x / W) * 2 - 1, -(smoothC.y / H) * 2 + 1, 0.5);
    _v3.unproject(camera);
    _v3.sub(camera.position).normalize();
    const t = -camera.position.z / _v3.z;
    return {
      x: camera.position.x + _v3.x * t,
      y: camera.position.y + _v3.y * t,
    };
  }

  /* animation */
  let raf = 0,
    last = null,
    running = true;
  let reveal = 0,
    revealStart = null; // eased intro fade-in
  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (
      (opts.pauseWhenHidden && document.hidden) ||
      (opts.pauseWhenOffscreen && !onScreen)
    ) {
      last = null;
      return;
    }
    if (last === null) {
      last = now;
    }
    const elapsed = (now - last) / 1000;
    // frame-rate cap: ambient motion doesn't need 60/120fps — skip rAF ticks until the interval elapses
    if (opts.fpsCap > 0 && elapsed < 1 / opts.fpsCap - 0.0005) {
      return;
    }
    const dt = Math.min(elapsed, 0.05);
    last = now;
    const t = now / 1000;
    // smoothing normalised to 60fps so the cursor reveal feels identical at any frame-rate cap
    const sm = 1 - Math.pow(1 - 0.18, dt * 60),
      am = 1 - Math.pow(1 - 0.08, dt * 60);
    if (cursor.active) {
      smoothC.x += (cursor.x - smoothC.x) * sm;
      smoothC.y += (cursor.y - smoothC.y) * sm;
    }
    activeAmt += ((cursor.active ? 1 : 0) - activeAmt) * am;
    const mw = cursorWorld();
    const drift = (reduceMotion ? 0.15 : 1) * opts.move;
    for (const c of coins) {
      c.group.scale.setScalar(c.conf.scale);
      const p = c.conf.phase;
      const bx =
        c.conf.x +
        Math.sin(t * 0.23 + p) * opts.hoverAmp * drift +
        Math.sin(t * 0.11 + p * 2.0) * opts.hoverAmp * 0.4 * drift;
      const by =
        c.conf.y +
        Math.cos(t * 0.31 + p * 1.3) * opts.hoverAmp * 0.8 * drift +
        Math.sin(t * 0.17 + p) * opts.hoverAmp * 0.3 * drift;
      let tRotX = 0,
        tRotY = 0,
        tOffX = 0,
        tOffY = 0;
      if (activeAmt > 0.01) {
        const dx = mw.x - bx,
          dy = mw.y - by,
          dist = Math.hypot(dx, dy);
        const infl =
          Math.exp(-(dist * dist) / (opts.reactRadius * opts.reactRadius)) *
          activeAmt;
        tRotY =
          THREE.MathUtils.clamp(dx * opts.reactTilt, -0.65, 0.65) * activeAmt;
        tRotX =
          THREE.MathUtils.clamp(-dy * opts.reactTilt, -0.65, 0.65) * activeAmt;
        if (dist > 0.001) {
          tOffX = -(dx / dist) * opts.reactPush * infl;
          tOffY = -(dy / dist) * opts.reactPush * infl;
        }
      }
      c.rotX += (tRotX - c.rotX) * 0.07;
      c.rotY += (tRotY - c.rotY) * 0.07;
      c.offX += (tOffX - c.offX) * 0.06;
      c.offY += (tOffY - c.offY) * 0.06;
      if (!reduceMotion) {
        c.spinAngle += dt * opts.spin * c.spinDir;
      }
      c.group.position.set(bx + c.offX, by + c.offY, 0);
      c.group.rotation.set(
        c.conf.rot.x + c.rotX,
        c.conf.rot.y + c.rotY + c.spinAngle,
        c.conf.rot.z + 0.02 * Math.sin(t * 0.5 + p),
      );
    }
    keyL.position.y = 3.8 + Math.sin(t * 0.4) * 0.5;
    keyL.intensity = 52 * (0.9 + 0.12 * Math.sin(t * 0.6));
    cursorL.position.set(mw.x, mw.y, 2.2);
    cursorL.intensity = 3.5 * activeAmt;
    if (reduceMotion || opts.fadeMs <= 0) {
      reveal = 1;
    } else if (reveal < 1) {
      if (revealStart === null) {
        revealStart = now;
      }
      const p = Math.min((now - revealStart) / opts.fadeMs, 1);
      reveal = p * p; // ease-in
    }
    compMat.uniforms.uReveal.value = reveal;
    compMat.uniforms.uTime.value = reduceMotion ? 0 : t;
    compMat.uniforms.uMouse.value.set(smoothC.x * dpr, (H - smoothC.y) * dpr);
    compMat.uniforms.uActive.value = activeAmt;

    // Boost mask radius when the cursor is over the text plane (if one was configured).
    let targetMaskR = opts.maskRadius;
    if (textPlane && opts.textMaskMul !== 1) {
      const tp = textPlane.position;
      _projV.set(tp.x - textHalfW, tp.y, tp.z).project(camera);
      const leftX = (_projV.x + 1) * 0.5 * W;
      _projV.set(tp.x + textHalfW, tp.y, tp.z).project(camera);
      const rightX = (_projV.x + 1) * 0.5 * W;
      _projV.set(tp.x, tp.y + textHalfH, tp.z).project(camera);
      const topY = (1 - _projV.y) * 0.5 * H;
      _projV.set(tp.x, tp.y - textHalfH, tp.z).project(camera);
      const botY = (1 - _projV.y) * 0.5 * H;
      if (
        smoothC.x >= leftX &&
        smoothC.x <= rightX &&
        smoothC.y >= topY &&
        smoothC.y <= botY
      ) {
        targetMaskR = opts.maskRadius * opts.textMaskMul;
      }
    }
    curMaskR += (targetMaskR - curMaskR) * 0.15;
    compMat.uniforms.uMaskR.value = curMaskR * dpr;
    const tm = renderer.toneMapping;
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.setRenderTarget(rt);
    renderer.setClearColor(0x000000, 0);
    renderer.clear(true, true, false);
    renderer.render(coinScene, camera);
    renderer.toneMapping = tm;
    renderer.setRenderTarget(null);
    renderer.setClearColor(0x000000, 0);
    composer.render();
  }
  raf = requestAnimationFrame(frame);

  /* live-tunable knobs */
  function set(patch: Record<string, unknown> = {}) {
    Object.assign(opts, patch);
    if ('ditherOpacity' in patch) {
      compMat.uniforms.uDitherOpacity.value = opts.ditherOpacity;
    }
    if ('bgOpacity' in patch) {
      compMat.uniforms.uBgOpacity.value = opts.bgOpacity;
    }
    if ('bgFlow' in patch) {
      compMat.uniforms.uBgFlow.value = opts.bgFlow * dpr;
    }
    if ('bgGlitch' in patch) {
      compMat.uniforms.uBgGlitch.value = opts.bgGlitch;
    }
    if ('dots' in patch) {
      compMat.uniforms.uDots.value = opts.dots === false ? 0 : 1;
    }
    if ('bg' in patch) {
      baseAddPass.uniforms.uBase.value.copy(hexToVec3(opts.bg));
    }
    if ('bloom' in patch) {
      if (patch.bloom.strength != null) {
        bloomPass.strength = patch.bloom.strength;
      }
      if (patch.bloom.radius != null) {
        bloomPass.radius = patch.bloom.radius;
      }
      if (patch.bloom.threshold != null) {
        bloomPass.threshold = patch.bloom.threshold;
      }
    }
    // spin / move / hoverAmp / react* / maskRadius etc. are read live in the loop
    if ('maskRadius' in patch) {
      compMat.uniforms.uMaskR.value = opts.maskRadius * dpr;
    }
  }

  function dispose() {
    cancelAnimationFrame(raf);
    running = false;
    ro.disconnect();
    io.disconnect();
    window.removeEventListener('resize', resize);
    window.removeEventListener('pointermove', onMove);
    document.removeEventListener('mouseleave', onLeave);
    window.removeEventListener('blur', onLeave);
    rt && rt.dispose();
    textTex && textTex.tex.dispose();
    composer.dispose && composer.dispose();
    [scene, coinScene].forEach((s) =>
      s.traverse((o) => {
        if (o.geometry) {
          o.geometry.dispose();
        }
        if (o.material) {
          (Array.isArray(o.material) ? o.material : [o.material]).forEach(
            (m) => {
              for (const k in m) {
                const v = m[k];
                if (v && v.isTexture) {
                  v.dispose();
                }
              }
              m.dispose();
            },
          );
        }
      }),
    );
    pmrem.dispose();
    envTex.dispose();
    renderer.dispose();
  }

  return { set, resize, dispose };
}

export default initCoinField;
