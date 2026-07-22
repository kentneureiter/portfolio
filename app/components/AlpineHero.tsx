'use client'
import { useEffect, useRef } from 'react'
import styles from './AlpineHero.module.css'

// ============================================================
// AlpineHero — layered pixel-dot landscape.
//
// Layer stack (bottom -> top):
//   1. sky canvas      — lavender dither + sun (static)
//   2. bg clouds       — DOM sprites drifting behind the mask
//   3. mask canvas     — solid beige, erased in an organic
//                        dithered blob that trails the cursor
//   4. mountain canvas — procedural dithered ridge (static)
//   5. fg clouds       — DOM sprites drifting over the mountain
//   6. grain overlay   — paper texture + vignette (CSS)
//
// All generation code below is deterministic (hash-based), so
// the scene is identical on every load and every resize.
// ============================================================

const PIXEL = 6      // grid cell size in px
const DOT_R = 2.4    // dot radius — beige shows between dots
const REVEAL_RADIUS = 38  // reveal blob radius, in cells

// ---------- deterministic hash / noise ----------
function hash2(x: number, y: number): number {
  let h = (x * 374761393 + y * 668265263) | 0
  h = (h ^ (h >>> 13)) | 0
  h = (h * 1274126177) | 0
  h = (h ^ (h >>> 16)) >>> 0
  return h / 4294967296
}

function smooth(t: number) { return t * t * (3 - 2 * t) }

function vnoise(x: number, y: number): number {
  const xi = Math.floor(x), yi = Math.floor(y)
  const xf = x - xi, yf = y - yi
  const a = hash2(xi, yi), b = hash2(xi + 1, yi)
  const c = hash2(xi, yi + 1), d = hash2(xi + 1, yi + 1)
  const u = smooth(xf), v = smooth(yf)
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
}

function fbm(x: number, y: number, oct: number): number {
  let s = 0, amp = 0.5, f = 1
  for (let i = 0; i < oct; i++) {
    s += amp * vnoise(x * f, y * f)
    amp *= 0.5
    f *= 2
  }
  return s
}

// 4x4 Bayer matrix, normalized [0,1) — for dithered edges
const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
].map(r => r.map(v => v / 16))

// ---------- palette ----------
const P = {
  paper: '#f7f2e4',   // page beige — gaps between dots + mask color
  // sky (revealed on hover) — ordered pale -> deep, vibrant blues
  sky: ['#b9d3f4', '#8fb6ee', '#6a9be6', '#4a82dc', '#3568cd'],
  skyDeep: '#2451b8',
  sun: ['#f6df8e', '#f2cd5e', '#eeba3d'],
  // mountain — green-heavy Hawaiian palette + hot accents
  mBlack: '#091008',                                  // green-black shadow '#0f1a0c'
  mBrown: '#34230b',                                //'#3c2a10'
  mOrange: ['#c24a10', '#e65806', '#fd7b11'],   //['#c24a10', '#df5f14', '#f0791a']
  mAmber: ['#ee8f09', '#fbb216'],                 //['#ef9718', '#f7b52a']
  mYellow: '#f4d134',                                  // brightest sparkle: #fad83c
  gLight: ['#d0e55e', '#b4e03d', '#afdf62'],          // sunlit yellow-green ['#c8dc50', '#a9cf44', '#8fc23c']
  gMid: ['#43ac0e', '#339113', '#3b7c29'],      //['#5da03c', '#4a8f34', '#3f7d2e']
  gDeep: ['#189602', '#20491c', '#173a16'],     //['#2c5f23', '#20491c', '#173a16']
  mCream: '#f5ecd2',                                //'#f5ecd2'
}

function pick(arr: string[], r: number): string {
  return arr[Math.min(arr.length - 1, Math.floor(r * arr.length))]
}

// ============================================================
// MOUNTAIN
// Ridgeline: hand-placed major peaks (tent profiles) + fBm
// detail. Peaks are editable: x/h in [0,1], s = side steepness.
// ============================================================
const PEAKS = [
  { x: 0.06, h: 0.62, s: 3.2 },
  { x: 0.22, h: 1.00, s: 3.8 },   // main summit
  { x: 0.38, h: 0.72, s: 3.0 },
  { x: 0.55, h: 0.90, s: 3.6 },
  { x: 0.72, h: 0.60, s: 2.6 },
  { x: 0.90, h: 0.82, s: 3.4 },
]

const SEED = 7.3

function ridgeAt(x: number, cols: number, rows: number, seed: number): number {
  const t = x / cols
  // tent profile: highest peak wins at each column
  let base = 0
  for (const p of PEAKS) {
    const v = p.h - Math.abs(t - p.x) * p.s
    if (v > base) base = v
  }
  base = Math.max(0.12, base)
  // jagged detail, stronger near summits, ridged for sharp notches
  const n1 = 1 - Math.abs(2 * fbm(x * 0.065 + seed * 3.1, seed * 2.3, 3) - 1)
  const n2 = fbm(x * 0.22 + seed * 9.2, seed * 5.5, 2)
  const n3 = 1 - Math.abs(2 * fbm(x * 0.13 + seed * 5.9, seed * 8.1, 2) - 1)
  const h = base + (n1 - 0.5) * 0.20 * (0.4 + base)
    + (n3 - 0.5) * 0.10 + (n2 - 0.5) * 0.05
  // ridge top between ~50% (summit) and ~78% (saddles) of height
  // — the mountain owns the bottom half of the screen, no more
  return rows * (0.845 - 0.345 * h)
}

// far (background) ridge — dimmer, higher up
function farRidgeAt(x: number, cols: number, rows: number, seed: number): number {
  const n1 = 1 - Math.abs(2 * fbm(x * 0.013 + seed * 13.7, seed * 4.1, 2) - 1)
  const n2 = 1 - Math.abs(2 * fbm(x * 0.045 + seed * 6.3, seed * 8.9, 3) - 1)
  const h = 0.65 * n1 + 0.35 * n2
  return rows * (0.86 - 0.20 * h)
}

// Color for one mountain cell, or null (gap / not mountain)
function mountainCell(
  x: number, y: number,
  ridge: number[], farRidge: number[],
  cols: number, rows: number,
): string | null {
  const ry = ridge[x]
  const fy = farRidge[x]
  const inNear = y >= ry
  const inFar = y >= fy

  if (!inNear && !inFar) return null

  // -------- far ridge only: sparse, muted blue-grey dither --------
  if (!inNear) {
    const d = y - fy
    const fade = Math.max(0, 1 - d / (rows * 0.30))
    const r = hash2(x * 3 + 11, y * 3 + 7)
    if (r > 0.28 * fade + 0.08) return null
    const r2 = hash2(x * 5 + 3, y * 5 + 1)
    if (r2 < 0.18) return '#8b93ad'
    if (r2 < 0.5) return '#a3aac0'
    return '#b8bdcf'
  }

  // -------- main ridge --------
  const depth = y - ry                       // cells below crest
  const crestZone = depth < rows * 0.035     // thin band along the top

  // facet slope: smoothed over a wide window -> coherent lit/shadow faces
  const win = 7
  const xl = Math.max(0, x - win), xr = Math.min(cols - 1, x + win)
  const slope = (ridge[xr] - ridge[xl]) / (xr - xl)  // dy/dx in cells
  const lit = slope > 0.25       // descending rightward: catches upper-left light
  const shadow = slope < -0.25   // rising rightward: shadow side

  // gullies: dark diagonal drainage streaks
  const gully = fbm((x + y * 0.55) * 0.045, (y - x * 0.35) * 0.10 + 40, 3)
  const inGully = gully < 0.26
  // flutes: tight vertical striations that wander slightly with
  // depth — the fluted-cliff texture of Hawaiian ridges. Value in
  // [0,1]: high = sunlit rib, low = shadowed groove.
  const flute = fbm((x + y * 0.22) * 0.30, y * 0.035 + 77, 2)
  // large patches: broad tonal variation across the faces
  const patch = fbm(x * 0.018 + 100, y * 0.018 + 100, 3)
  // hot pockets: smaller scattered autumn accents, not one blob
  const hot = fbm(x * 0.042 + 200, y * 0.042 + 200, 3)
  const hotPatch = hot < 0.265
  // fine speckle
  const spk = hash2(x * 7 + 1, y * 7 + 3)

  // occasional gaps for sparkle inside the mass
  // (mountain stays flush with the bottom edge — no fade)
  if (spk > 0.975) return null

  // altitude band: 0 at crest -> 1 at bottom
  const band = Math.min(1, depth / (rows * 0.42))

  // --- crest: bright flecks against dark ---
  if (crestZone) {
    if (spk < 0.24) return P.mCream
    if (spk < 0.40) return P.mYellow
    if (spk < 0.54) return pick(P.gLight, patch)
    return P.mBlack
  }

  // --- gullies: near-solid dark green streaks ---
  if (inGully) {
    if (spk < 0.72) return P.mBlack
    if (spk < 0.90) return pick(P.gDeep, patch)
    return P.mBrown
  }

  // --- hot pockets: orange/amber/black, a nod to the reference ---
  if (hotPatch) {
    if (spk < 0.30) return pick(P.mOrange, (patch * 3) % 1)
    if (spk < 0.48) return pick(P.mAmber, (spk * 5) % 1)
    if (spk < 0.58) return P.mYellow
    if (spk < 0.86) return P.mBlack
    return P.mBrown
  }

  // --- fluted faces: ribs and grooves modulated by facet light ---
  // facet lighting shifts the rib/groove balance instead of
  // painting whole faces one flat tone
  const light = flute + (lit ? 0.16 : 0) - (shadow ? 0.14 : 0)

  if (light < 0.36) {
    // groove: deep shadow greens
    if (spk < 0.55) return P.mBlack
    if (spk < 0.88) return pick(P.gDeep, patch)
    return pick(P.gMid, (spk * 4) % 1)
  }
  if (light < 0.52) {
    // mid slope: mid greens with dark texture
    if (spk < 0.20) return P.mBlack
    if (spk < 0.72) return pick(P.gMid, (patch * 2) % 1)
    if (spk < 0.86) return pick(P.gDeep, (spk * 3) % 1)
    return pick(P.gLight, patch)
  }
  // sunlit rib: bright yellow-greens, brighter lower down
  if (spk < 0.14 && band > 0.45) return P.mYellow
  if (spk < 0.52) return pick(P.gLight, (patch * 2) % 1)
  if (spk < 0.80) return pick(P.gMid, (spk * 5) % 1)
  if (spk < 0.90) return P.mBlack
  return pick(P.gLight, (spk * 7) % 1)
}

// ============================================================
// SKY (revealed layer) — lavender dither + sun disc
// ============================================================
function skyCell(x: number, y: number, cols: number, rows: number): string | null {
  const t = y / rows
  // sun: dithered disc upper-right-of-center
  const sx = cols * 0.72, sy = rows * 0.20, sr = Math.min(cols, rows) * 0.085
  const dx = x - sx, dy = y - sy
  const dd = Math.sqrt(dx * dx + dy * dy) / sr
  if (dd < 1.15) {
    const bayer = BAYER[y & 3][x & 3]
    if (dd < 0.85 || (1.15 - dd) / 0.3 > bayer) {
      const r = hash2(x * 9 + 2, y * 9 + 5)
      return pick(P.sun, r)
    }
  }
  // lavender gradient with patchy variation — dense, few gaps
  const patch = fbm(x * 0.045, y * 0.045, 3)
  const r = hash2(x * 11 + 4, y * 11 + 6)
  if (r > 0.985) return null   // rare paper gaps for sparkle
  // deeper blue at top -> paler toward the horizon
  const g = (1 - t) * 2.4 + (patch - 0.5) * 1.8 + (r - 0.5) * 0.8
  if (g > 2.3 && r < 0.35) return P.skyDeep
  const idx = Math.max(0, Math.min(4, Math.round(g)))
  return P.sky[idx]
}

// ============================================================
// ROCKET — small static rocket in the left sky, baked into the
// sky layer so it's only visible through the hover reveal.
// Drawn in rocket-local coords (lx across the hull, ly along
// it, nose at negative ly) and rotated at draw time so it
// flies diagonally toward the top center.
// Parts: nose cone, hull with porthole, fins, nozzle, and a
// dithered exhaust flame.
// ============================================================
function rocketCell(lx: number, ly: number, x: number, y: number): string | null {
  const r = hash2(x * 13 + 101, y * 17 + 57)
  const ax = Math.abs(lx)
  // nose cone: tapers to a point, lit from the left
  if (ly >= -6.5 && ly < -3.8) {
    const w = 1.7 * (ly + 6.5) / 2.7
    if (ax <= w) return lx < 0 ? '#f4f6f8' : (r < 0.6 ? '#d7dbe2' : '#aab0bb')
    return null
  }
  // hull + fins
  if (ly >= -3.8 && ly < 2.0) {
    if (ax <= 1.7) {
      // porthole
      const wd = Math.sqrt(lx * lx + (ly + 2.2) * (ly + 2.2))
      if (wd < 1.0) return r < 0.25 ? '#9aa2af' : '#2a2e36'
      // left-lit shading across the hull
      if (lx < -0.6) return r < 0.7 ? '#f4f6f8' : '#d7dbe2'
      if (lx > 0.9) return r < 0.7 ? '#6b7280' : '#aab0bb'
      return r < 0.75 ? '#d7dbe2' : '#aab0bb'
    }
    // fins flaring out near the tail
    if (ly > 0.2) {
      const fw = 1.7 + (ly - 0.2) * 1.0
      if (ax <= fw) return r < 0.55 ? '#454b56' : '#2a2e36'
    }
    return null
  }
  // nozzle
  if (ly >= 2.0 && ly < 2.9 && ax <= 1.0) return '#2a2e36'
  // exhaust flame: yellow core -> amber -> orange, dithered edge
  if (ly >= 2.9 && ly < 6.8) {
    const t = (ly - 2.9) / 3.9           // 0 at nozzle -> 1 at tip
    const w = 1.3 * (1 - t) + 0.25
    if (ax > w) return null
    if (r > 0.85 - t * 0.55) return null // sparser toward the tip
    if (ax < w * 0.35 && t < 0.5) return '#f4d134'
    if (t < 0.45) return r < 0.5 ? '#fbb216' : '#ee8f09'
    return r < 0.6 ? '#e65806' : '#c24a10'
  }
  return null
}

// ============================================================
// CLOUD SEA — undulating band of white cloud along the bottom
// ~1/10 of the screen, in front of the mountain: the scene sits
// above a sea of clouds. Repainted per frame; time drives a slow
// horizontal drift and billowing. Returns color or null.
// ============================================================
const SEA_SHADOW = '#d9d5c6'
const SEA_TOP_FRAC = 0.76    // repaint from this fraction of rows down

function cloudSeaCell(x: number, y: number, cols: number, rows: number, time: number): string | null {
  const bandTop = rows * 0.84            // wisps can rise above this
  const rel = (y - bandTop) / (rows - bandTop)   // <0 above band
  if (rel < -0.55) return null
  // corner envelope: full strength at the edges, dissolving to
  // nothing by ~32% in from each side — puffs live in the
  // corners, not in a river across the whole bottom
  const edge = Math.min(x, cols - 1 - x) / cols
  const env = Math.max(0, 1 - edge / 0.32)
  if (env <= 0) return null
  // billowing: two drifting noise fields at different speeds
  const n1 = fbm(x * 0.040 - time * 0.55, y * 0.11 + time * 0.04, 3)
  const n2 = fbm(x * 0.013 + time * 0.15, y * 0.05 + 500, 2)
  const v = rel * 2.2 + (n1 - 0.5) * 1.5 + (n2 - 0.5) * 1.1
    + (Math.pow(env, 0.7) - 1) * 1.7
  const bayer = BAYER[y & 3][x & 3]
  if (v < 0.05 + bayer * 0.35) return null       // dithered billowy edge
  // coherent billow shading: bright puff tops, shaded crevices
  const shade = n1 + (n2 - 0.5) * 0.4 - rel * 0.08
  if (shade > 0.46) return '#ffffff'
  if (shade > 0.39) return '#fdfcf8'
  if (shade > 0.33) return '#f3f1e8'
  if (shade > 0.285) return '#e7e3d5'
  return SEA_SHADOW
}

// ============================================================
// REVEAL MASK — organic, noise-feathered blob around cursor.
// Returns alpha [0,1] for cell (x,y): 1 = revealed. Caller
// dithers the feathered edge with Bayer. time animates the
// outline so it feels alive.
// ============================================================
function revealAt(
  x: number, y: number,
  cx: number, cy: number,
  radius: number, time: number,
): number {
  const dx = x - cx, dy = y - cy
  const d = Math.sqrt(dx * dx + dy * dy)
  if (d > radius * 1.6) return 0
  const ang = Math.atan2(dy, dx)
  // wobble the radius with angular + time noise -> organic outline
  const wob = fbm(Math.cos(ang) * 1.8 + time * 0.35 + 50,
    Math.sin(ang) * 1.8 + time * 0.22 + 50, 3)
  const r2 = radius * (0.72 + wob * 0.8)
  // second smaller lobe offset by noise -> asymmetric shape
  const ox = (fbm(time * 0.3 + 9, 3.3, 2) - 0.5) * radius * 1.1
  const oy = (fbm(4.7, time * 0.27 + 9, 2) - 0.5) * radius * 0.9
  const d2 = Math.sqrt((dx - ox) * (dx - ox) + (dy - oy) * (dy - oy))
  const v = Math.max(1 - d / r2, (1 - d2 / (r2 * 0.7)) * 0.9)
  if (v <= 0) return 0
  // spatial noise breaks the gradient into patches
  const n = fbm(x * 0.09 + time * 0.15, y * 0.09, 2)
  return Math.max(0, Math.min(1, v * 1.5 + (n - 0.5) * 0.7))
}

// ============================================================
// drawing helpers
// ============================================================
// Per-cell "uneven print" texture: every cell rolls its own dot
// radius and ink opacity, and lays a faint square halo tint so
// the corners around the dot aren't flat paper. ~12% of cells
// skip the circle and print a solid square. This is what breaks
// the "every pixel got the same circle filter" uniformity.
function drawTexturedCell(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, color: string,
  dense = false,   // clouds over dark ground: stronger halo + ink
) {
  const t1 = hash2(x * 131 + 17, y * 113 + 29)
  const t2 = hash2(x * 151 + 5, y * 97 + 11)
  const t3 = hash2(x * 173 + 23, y * 59 + 41)
  const px = x * PIXEL, py = y * PIXEL
  ctx.fillStyle = color
  if (t1 > 0.88) {              // solid square, no halo
    ctx.globalAlpha = 1
    ctx.fillRect(px, py, PIXEL, PIXEL)
    return
  }
  // halo square behind the dot
  ctx.globalAlpha = dense ? 0.45 + 0.2 * t2 : 0.10 + 0.18 * t2
  ctx.fillRect(px, py, PIXEL, PIXEL)
  // the dot: jittered radius, jittered ink
  // radius floor 0.90 keeps the mass full — was 0.78, which left
  // some cells looking like stray small circles
  ctx.globalAlpha = dense ? 0.92 + 0.08 * t3 : 0.78 + 0.22 * t3
  ctx.beginPath()
  ctx.arc(px + PIXEL / 2, py + PIXEL / 2, DOT_R * (0.90 + 0.33 * t2), 0, Math.PI * 2)
  ctx.fill()
  ctx.globalAlpha = 1
}

export default function AlpineHero() {
  const rootRef = useRef<HTMLDivElement>(null)
  const skyRef = useRef<HTMLCanvasElement>(null)
  const maskRef = useRef<HTMLCanvasElement>(null)
  const mountainRef = useRef<HTMLCanvasElement>(null)
  const seaRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const sky = skyRef.current
    const mask = maskRef.current
    const mountain = mountainRef.current
    const sea = seaRef.current
    if (!root || !sky || !mask || !mountain || !sea) return

    let cols = 0, rows = 0
    // nametag protection zone, in cell coords (measured from the
    // [data-hero-tag] element). The mask never erases inside it,
    // so the sky can't show behind the name; near its edge the
    // erase gets a noisy penalty -> scattered beige pixel border.
    let tag: { x0: number, y0: number, x1: number, y1: number } | null = null

    const measureTag = () => {
      const el = document.querySelector('[data-hero-tag]') as HTMLElement | null
      if (!el) { tag = null; return }
      const r = el.getBoundingClientRect()
      const base = root.getBoundingClientRect()
      tag = {
        x0: Math.floor((r.left - base.left) / PIXEL),
        y0: Math.floor((r.top - base.top) / PIXEL),
        x1: Math.ceil((r.right - base.left) / PIXEL),
        y1: Math.ceil((r.bottom - base.top) / PIXEL),
      }
    }

    // ---- static layers: sky + mountain, redrawn on resize ----
    const buildStatic = () => {
      const W = root.clientWidth, H = root.clientHeight
      cols = Math.ceil(W / PIXEL)
      rows = Math.ceil(H / PIXEL)
      for (const c of [sky, mask, mountain, sea]) { c.width = W; c.height = H }

      const ridge: number[] = new Array(cols)
      const farRidge: number[] = new Array(cols)
      for (let x = 0; x < cols; x++) {
        ridge[x] = ridgeAt(x, cols, rows, SEED)
        farRidge[x] = farRidgeAt(x, cols, rows, SEED)
      }

      // LAYER 1: sky — paper background + vibrant dither + sun
      const skyCtx = sky.getContext('2d')!
      skyCtx.fillStyle = P.paper
      skyCtx.fillRect(0, 0, W, H)
      for (let y = 0; y < rows; y++)
        for (let x = 0; x < cols; x++) {
          const c = skyCell(x, y, cols, rows)
          if (c) drawTexturedCell(skyCtx, x, y, c)
        }

      // LAYER 1b: rocket — static, left sky, nose toward top center
      const rkCx = cols * 0.16, rkCy = rows * 0.22
      const rkAng = 35 * Math.PI / 180   // tilt right of vertical
      const cosA = Math.cos(rkAng), sinA = Math.sin(rkAng)
      const SR = 9
      for (let y = Math.floor(rkCy - SR); y <= rkCy + SR; y++)
        for (let x = Math.floor(rkCx - SR); x <= rkCx + SR; x++) {
          const dx = x - rkCx, dy = y - rkCy
          const lx = dx * cosA + dy * sinA
          const ly = -dx * sinA + dy * cosA
          const c = rocketCell(lx, ly, x, y)
          if (c) drawTexturedCell(skyCtx, x, y, c, true)
        }

      // LAYER 4: mountain
      const mctx = mountain.getContext('2d')!
      mctx.clearRect(0, 0, W, H)
      // opaque paper backing under the full silhouette: gap cells
      // stay beige, and the sky reveal can never seep through the
      // mountain's semi-transparent ink
      mctx.fillStyle = P.paper
      for (let x = 0; x < cols; x++) {
        const yStart = Math.ceil(Math.min(ridge[x], farRidge[x]))
        mctx.fillRect(x * PIXEL, yStart * PIXEL, PIXEL, H - yStart * PIXEL)
      }
      for (let y = 0; y < rows; y++)
        for (let x = 0; x < cols; x++) {
          const c = mountainCell(x, y, ridge, farRidge, cols, rows)
          if (c) drawTexturedCell(mctx, x, y, c)
        }

      // LAYER 3: mask — solid beige (identical to paper, so the
      // page looks flat beige until the reveal erases through it)
      const kctx = mask.getContext('2d')!
      kctx.fillStyle = P.paper
      kctx.fillRect(0, 0, W, H)
    }

    buildStatic()
    measureTag()

    // ---- LAYER 3 animation: reveal blob trails the pointer ----
    const kctx = mask.getContext('2d')!
    let px = -1000, py = -1000        // pointer, in cell coords
    let cx = -1000, cy = -1000        // trailing blob center
    let radius = 0                    // current blob radius (cells)
    let targetRadius = 0
    let raf = 0
    const t0 = performance.now()

    const paintMask = (time: number) => {
      kctx.fillStyle = P.paper
      kctx.fillRect(0, 0, mask.width, mask.height)
      if (radius < 0.5) return
      const R = Math.ceil(radius * 1.7)
      const x0 = Math.max(0, Math.floor(cx - R)), x1 = Math.min(cols - 1, Math.ceil(cx + R))
      const y0 = Math.max(0, Math.floor(cy - R)), y1 = Math.min(rows - 1, Math.ceil(cy + R))
      for (let y = y0; y <= y1; y++)
        for (let x = x0; x <= x1; x++) {
          const a = revealAt(x, y, cx, cy, radius, time)
          let thresh = 0.25 + BAYER[y & 3][x & 3] * 0.5
          if (tag) {
            // hard block inside the tag
            if (x >= tag.x0 && x <= tag.x1 && y >= tag.y0 && y <= tag.y1) continue
            // noisy penalty near the tag edge: the boundary breaks
            // into dispersed beige pixels that shift over time
            const dx = Math.max(tag.x0 - x, 0, x - tag.x1)
            const dy = Math.max(tag.y0 - y, 0, y - tag.y1)
            const d = Math.sqrt(dx * dx + dy * dy)
            if (d < 8) {
              const prot = 1 - d / 8
              const n = fbm(x * 0.30 + time * 0.5, y * 0.30 - time * 0.3, 2)
              thresh += prot * (0.5 + n * 1.2)
            }
          }
          if (a > thresh)
            kctx.clearRect(x * PIXEL, y * PIXEL, PIXEL, PIXEL)
        }
    }

    // ---- LAYER 5 animation: billowing corner cloud puffs ----
    const sctx = sea.getContext('2d')!
    const paintSea = (time: number) => {
      sctx.clearRect(0, 0, sea.width, sea.height)
      for (let y = Math.floor(rows * SEA_TOP_FRAC); y < rows; y++)
        for (let x = 0; x < cols; x++) {
          const c = cloudSeaCell(x, y, cols, rows, time)
          if (c) drawTexturedCell(sctx, x, y, c, true)
        }
    }

    let frame = 0
    const tick = () => {
      const time = (performance.now() - t0) / 1000
      // trail the pointer; ease radius in/out
      cx += (px - cx) * 0.14
      cy += (py - cy) * 0.14
      radius += (targetRadius - radius) * 0.10
      paintMask(time)
      // the sea billows slowly — every 3rd frame is plenty
      if (frame % 3 === 0) paintSea(time)
      frame++
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const onMove = (e: PointerEvent) => {
      const rect = root.getBoundingClientRect()
      px = (e.clientX - rect.left) / PIXEL
      py = (e.clientY - rect.top) / PIXEL
      if (targetRadius === 0) { cx = px; cy = py }   // snap on entry
      targetRadius = REVEAL_RADIUS
    }
    const onLeave = () => { targetRadius = 0 }

    const onResize = () => { buildStatic(); measureTag() }
    root.addEventListener('pointermove', onMove)
    root.addEventListener('pointerleave', onLeave)
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      root.removeEventListener('pointermove', onMove)
      root.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div ref={rootRef} className={styles.root}>
      {/* 1 — sky */}
      <canvas ref={skyRef} className={styles.sky} />

      {/* 3 — beige mask, erased around the cursor */}
      <canvas ref={maskRef} className={styles.mask} />

      {/* 4 — mountain */}
      <canvas ref={mountainRef} className={styles.mountain} />

      {/* 5 — billowing cloud sea along the bottom */}
      <canvas ref={seaRef} className={styles.sea} />

      {/* 6 — paper grain + vignette */}
      <div className={styles.grain} />
    </div>
  )
}
