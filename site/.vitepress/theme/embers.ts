/**
 * Искры за логотипом на первом экране: лёгкий canvas без библиотек.
 * Частицы в цветах пламени (бирюза → фиолет) поднимаются вверх и гаснут.
 * Анимация останавливается, когда первый экран не виден или вкладка скрыта,
 * и не запускается при prefers-reduced-motion.
 */
type P = { x: number; y: number; vx: number; vy: number; r: number; life: number; max: number; hue: number }

const COLORS = [174, 186, 268, 282, 300] // бирюзовый, голубой, фиолетовый, пурпурный

export function startEmbers(canvas: HTMLCanvasElement, area: HTMLElement): () => void {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}
  const ctx = canvas.getContext('2d')
  if (!ctx) return () => {}

  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  let w = 0, h = 0, raf = 0, running = false, visible = true
  const parts: P[] = []
  const mobile = matchMedia('(max-width: 640px)').matches
  const MAX = mobile ? 26 : 60

  function resize() {
    w = canvas.clientWidth
    h = canvas.clientHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  function spawn(): P {
    // рождаются у основания логотипа и в нижней половине окна
    const cx = w / 2
    const spread = Math.min(w * 0.42, 420)
    return {
      x: cx + (Math.random() - 0.5) * spread * (Math.random() < 0.6 ? 0.5 : 2),
      y: h * (0.45 + Math.random() * 0.6),
      vx: (Math.random() - 0.5) * 0.25,
      vy: -(0.25 + Math.random() * 0.6),
      r: 0.8 + Math.random() * 2.2,
      life: 0,
      max: 220 + Math.random() * 260,
      hue: COLORS[(Math.random() * COLORS.length) | 0],
    }
  }

  function frame() {
    ctx!.clearRect(0, 0, w, h)
    ctx!.globalCompositeOperation = 'lighter'
    while (parts.length < MAX) parts.push(spawn())
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i]
      p.life++
      p.x += p.vx + Math.sin((p.life + p.hue) / 40) * 0.18
      p.y += p.vy
      const t = p.life / p.max
      if (t >= 1 || p.y < -10) { parts.splice(i, 1); continue }
      const a = Math.sin(Math.PI * t) * 0.85 // плавно появляется и гаснет
      const g = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4)
      g.addColorStop(0, `hsla(${p.hue}, 95%, 72%, ${a})`)
      g.addColorStop(1, `hsla(${p.hue}, 95%, 60%, 0)`)
      ctx!.fillStyle = g
      ctx!.beginPath()
      ctx!.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2)
      ctx!.fill()
    }
    raf = requestAnimationFrame(frame)
  }

  function sync() {
    const should = visible && !document.hidden
    if (should && !running) { running = true; raf = requestAnimationFrame(frame) }
    if (!should && running) { running = false; cancelAnimationFrame(raf) }
  }

  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync() })
  io.observe(area)
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)
  document.addEventListener('visibilitychange', sync)
  resize()
  sync()

  return () => {
    running = false
    cancelAnimationFrame(raf)
    io.disconnect()
    ro.disconnect()
    document.removeEventListener('visibilitychange', sync)
  }
}

/** Лёгкий параллакс по мыши: пишет --mx/--my (−1…1) в стиль элемента. */
export function startParallax(el: HTMLElement): () => void {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !matchMedia('(pointer: fine)').matches) return () => {}
  let raf = 0, tx = 0, ty = 0, x = 0, y = 0
  function move(e: PointerEvent) {
    const r = el.getBoundingClientRect()
    tx = ((e.clientX - r.left) / r.width - 0.5) * 2
    ty = ((e.clientY - r.top) / r.height - 0.5) * 2
    if (!raf) raf = requestAnimationFrame(step)
  }
  function step() {
    x += (tx - x) * 0.08
    y += (ty - y) * 0.08
    el.style.setProperty('--mx', x.toFixed(3))
    el.style.setProperty('--my', y.toFixed(3))
    raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.002 ? requestAnimationFrame(step) : 0
  }
  el.addEventListener('pointermove', move)
  return () => { el.removeEventListener('pointermove', move); cancelAnimationFrame(raf) }
}
