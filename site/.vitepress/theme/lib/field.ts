import { reducedMotion } from './env'

/**
 * Фон первого экрана: уходящая к горизонту сетка и медленно всплывающие частицы.
 * Двигается медленно, реагирует на мышь лёгким смещением горизонта,
 * останавливается, когда экран не виден или вкладка неактивна.
 */
export function startField(canvas: HTMLCanvasElement, host: HTMLElement) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return () => {}

  const mobile = window.matchMedia('(max-width: 640px)').matches
  const still = reducedMotion()
  let w = 0
  let h = 0
  let dpr = 1
  let raf = 0
  let visible = true
  let mx = 0
  let my = 0
  let tx = 0
  let ty = 0

  type Mote = { x: number; y: number; r: number; v: number; a: number; hue: number; ph: number }
  let motes: Mote[] = []
  const spawn = (anyY: boolean): Mote => ({
    x: Math.random() * w,
    y: anyY ? Math.random() * h : h + 10,
    r: Math.random() * 1.4 + 0.4,
    v: Math.random() * 0.18 + 0.06,
    a: Math.random() * 0.5 + 0.25,
    hue: Math.random() < 0.45 ? 162 : 268,
    ph: Math.random() * Math.PI * 2,
  })

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    w = host.clientWidth
    h = host.clientHeight
    canvas.width = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    const n = mobile ? 28 : 64
    motes = Array.from({ length: n }, () => spawn(true))
  }

  function draw(t: number) {
    tx += (mx - tx) * 0.04
    ty += (my - ty) * 0.04
    host.style.setProperty('--mx', tx.toFixed(3))
    host.style.setProperty('--my', ty.toFixed(3))
    ctx!.clearRect(0, 0, w, h)

    // --- сетка пола ---
    const horizon = h * (0.6 + ty * 0.02)
    const vx = w / 2 + tx * 40
    const depth = h - horizon
    ctx!.lineWidth = 1

    // продольные линии к точке схода
    const cols = mobile ? 14 : 26
    for (let i = -cols; i <= cols; i++) {
      const xb = vx + (i / cols) * w * 1.6
      const g = ctx!.createLinearGradient(0, horizon, 0, h)
      g.addColorStop(0, 'rgba(168,116,255,0)')
      g.addColorStop(1, 'rgba(168,116,255,0.16)')
      ctx!.strokeStyle = g
      ctx!.beginPath()
      ctx!.moveTo(vx, horizon)
      ctx!.lineTo(xb, h)
      ctx!.stroke()
    }
    // поперечные линии плывут к зрителю
    const speed = still ? 0 : t * 0.000045
    const rows = 14
    for (let i = 0; i < rows; i++) {
      const z = ((i / rows + speed) % 1)
      const y = horizon + depth * z * z
      const alpha = 0.02 + z * z * 0.16
      ctx!.strokeStyle = `rgba(102,205,170,${alpha.toFixed(3)})`
      ctx!.beginPath()
      ctx!.moveTo(0, y)
      ctx!.lineTo(w, y)
      ctx!.stroke()
    }
    // свечение горизонта
    const glow = ctx!.createRadialGradient(vx, horizon, 0, vx, horizon, w * 0.55)
    glow.addColorStop(0, 'rgba(138,60,240,0.20)')
    glow.addColorStop(1, 'rgba(138,60,240,0)')
    ctx!.fillStyle = glow
    ctx!.fillRect(0, horizon - w * 0.3, w, w * 0.6)

    // --- частицы ---
    for (const m of motes) {
      if (!still) {
        m.y -= m.v
        m.x += Math.sin(t * 0.0004 + m.ph) * 0.08
        if (m.y < -10) Object.assign(m, spawn(false))
      }
      const fade = Math.min(1, m.y / (h * 0.25)) * (0.75 + 0.25 * Math.sin(t * 0.001 + m.ph))
      ctx!.fillStyle = `hsla(${m.hue}, 80%, 72%, ${(m.a * fade).toFixed(3)})`
      ctx!.beginPath()
      ctx!.arc(m.x + tx * 12 * m.r, m.y + ty * 8 * m.r, m.r, 0, Math.PI * 2)
      ctx!.fill()
    }

    if (!still && visible) raf = requestAnimationFrame(draw)
  }

  const onMove = (e: PointerEvent) => {
    const r = host.getBoundingClientRect()
    mx = ((e.clientX - r.left) / r.width - 0.5) * 2
    my = ((e.clientY - r.top) / r.height - 0.5) * 2
  }
  const io = new IntersectionObserver(([e]) => {
    const was = visible
    visible = e.isIntersecting && !document.hidden
    if (visible && !was && !still) raf = requestAnimationFrame(draw)
  })
  const onVis = () => {
    const was = visible
    visible = !document.hidden
    if (visible && !was && !still) raf = requestAnimationFrame(draw)
  }

  resize()
  raf = requestAnimationFrame(draw)
  const ro = new ResizeObserver(() => {
    resize()
    if (still) draw(0)
  })
  ro.observe(host)
  io.observe(host)
  document.addEventListener('visibilitychange', onVis)
  if (!mobile && !still) host.addEventListener('pointermove', onMove)

  return () => {
    cancelAnimationFrame(raf)
    ro.disconnect()
    io.disconnect()
    document.removeEventListener('visibilitychange', onVis)
    host.removeEventListener('pointermove', onMove)
  }
}
