import { reducedMotion } from './env'

/**
 * «Расшифровка» текста: символы перебираются и встают на место слева направо.
 * Итоговый текст уже есть в разметке (для поисковиков и без JS), эффект только поверх.
 */
const GLYPHS = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&/<>=+*░▒▓'

export function scramble(el: HTMLElement, opts: { duration?: number; delay?: number; text?: string } = {}) {
  const final = opts.text ?? el.dataset.text ?? el.textContent ?? ''
  if (reducedMotion() || !final.trim()) {
    el.textContent = final
    return () => {}
  }
  const duration = opts.duration ?? 1100
  const delay = opts.delay ?? 0
  const chars = [...final]
  // каждый символ встаёт на место в своё время, с небольшим разбросом
  const settle = chars.map((_, i) => (i / Math.max(chars.length - 1, 1)) * 0.75 + Math.random() * 0.25)
  let raf = 0
  let start = 0
  let lastSwap = 0
  let noise = chars.map(() => GLYPHS[(Math.random() * GLYPHS.length) | 0])

  const frame = (t: number) => {
    if (!start) start = t + delay
    const p = Math.min(Math.max((t - start) / duration, 0), 1)
    if (t - lastSwap > 55) {
      noise = noise.map(() => GLYPHS[(Math.random() * GLYPHS.length) | 0])
      lastSwap = t
    }
    el.textContent = chars.map((c, i) => (c === ' ' || p >= settle[i] ? c : noise[i])).join('')
    if (p < 1) raf = requestAnimationFrame(frame)
    else el.textContent = final
  }
  raf = requestAnimationFrame(frame)
  return () => {
    cancelAnimationFrame(raf)
    el.textContent = final
  }
}
