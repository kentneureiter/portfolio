'use client'
import { useRef, useEffect, useCallback } from 'react'

const PIXEL  = 6      // grid cell size
const DOT_R  = 2.4   // circle radius — white shows in the corners between dots

export default function PixelCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const W = window.innerWidth
    const H = window.innerHeight
    canvas.width  = W
    canvas.height = H

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const cols = Math.ceil(W / PIXEL)
    const rows = Math.ceil(H / PIXEL)

    const img = new Image()
    img.onload = () => {
      // Downsample image to grid resolution to get one color per cell
      const tmp = document.createElement('canvas')
      tmp.width  = cols
      tmp.height = rows
      tmp.getContext('2d')!.drawImage(img, 0, 0, cols, rows)
      const data = tmp.getContext('2d')!.getImageData(0, 0, cols, rows).data

      // White background — shows through gaps between circles
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, W, H)

      // Group circle centers by color for efficient batch drawing
      const groups = new Map<string, number[]>()
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i   = (r * cols + c) * 4
          const key = `rgb(${data[i]},${data[i + 1]},${data[i + 2]})`
          let g = groups.get(key)
          if (!g) { g = []; groups.set(key, g) }
          g.push(c * PIXEL + PIXEL / 2, r * PIXEL + PIXEL / 2)
        }
      }

      // Draw all circles, batched by color — one beginPath/fill per unique color
      for (const [color, coords] of groups) {
        ctx.fillStyle = color
        ctx.beginPath()
        for (let i = 0; i < coords.length; i += 2) {
          const cx = coords[i], cy = coords[i + 1]
          ctx.moveTo(cx + DOT_R, cy)
          ctx.arc(cx, cy, DOT_R, 0, Math.PI * 2)
        }
        ctx.fill()
      }
    }
    img.src = '/hero.jpg'
  }, [])

  useEffect(() => {
    render()
    window.addEventListener('resize', render)
    return () => window.removeEventListener('resize', render)
  }, [render])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', top: 0, left: 0, display: 'block', width: '100vw', height: '100vh' }}
    />
  )
}
