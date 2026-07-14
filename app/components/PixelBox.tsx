'use client'
import { useEffect, useRef, type ReactNode } from 'react'
import styles from './PixelBox.module.css'

// ============================================================
// PixelBox — name plate framed by a soft pixel mosaic.
// Beige/tan squares, dense at the edges and dissolving toward
// the center, so the plate blends into the page while still
// reading as a pixel object. A slow twinkle re-rolls a few
// edge cells at a time. The solid background also blocks the
// sky reveal from showing through behind the text.
// ============================================================

const CELL = 6          // mosaic square size — matches the scene's pixel grid
const EDGE = 9          // mosaic reaches this many cells inward
const TONES = [
  '#f7f2e4', '#f4eedd', '#f0e9d4',   // near-background
  '#eae2c9', '#e3d9bc', '#dbcfae',   // mid tans
  '#d2c49e',                          // darkest accent — stays subtle
]

export default function PixelBox({ children }: { children: ReactNode }) {
  const boxRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const box = boxRef.current
    const canvas = canvasRef.current
    if (!box || !canvas) return
    const ctx = canvas.getContext('2d')!

    let cols = 0, rows = 0

    // density: 1 at the border, fading to 0 EDGE cells inward
    const densityAt = (x: number, y: number) => {
      const d = Math.min(x, y, cols - 1 - x, rows - 1 - y)
      if (d >= EDGE) return 0
      const t = 1 - d / EDGE
      return t * t * 0.95
    }

    const paintCell = (x: number, y: number) => {
      ctx.clearRect(x * CELL, y * CELL, CELL, CELL)
      const p = densityAt(x, y)
      if (p === 0 || Math.random() > p) return
      // bias toward the lighter tones; darker squares are rare
      const r = Math.random()
      const tone = TONES[Math.min(TONES.length - 1, Math.floor(r * r * TONES.length))]
      ctx.fillStyle = tone
      ctx.fillRect(x * CELL, y * CELL, CELL, CELL)
    }

    const paintAll = () => {
      canvas.width = box.clientWidth
      canvas.height = box.clientHeight
      cols = Math.ceil(canvas.width / CELL)
      rows = Math.ceil(canvas.height / CELL)
      for (let y = 0; y < rows; y++)
        for (let x = 0; x < cols; x++) paintCell(x, y)
    }

    const ro = new ResizeObserver(paintAll)
    ro.observe(box)

    // gentle twinkle: re-roll a few edge cells periodically
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const twinkle = reduced ? 0 : window.setInterval(() => {
      const n = Math.ceil(cols * rows * 0.008)
      for (let i = 0; i < n; i++) {
        const x = Math.floor(Math.random() * cols)
        const y = Math.floor(Math.random() * rows)
        if (densityAt(x, y) > 0) paintCell(x, y)
      }
    }, 300)

    return () => {
      ro.disconnect()
      if (twinkle) clearInterval(twinkle)
    }
  }, [])

  return (
    <div ref={boxRef} className={styles.box}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.content}>{children}</div>
    </div>
  )
}
