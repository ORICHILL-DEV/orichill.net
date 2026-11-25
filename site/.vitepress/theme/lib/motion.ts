/**
 * Плавные анимации вики:
 *  - раскрытие и сворачивание разделов меню слева;
 *  - раскрытие блоков <details> («Подробнее») в тексте;
 *  - мягкое появление страницы при переходе.
 * Всё отключается, если в системе включено «уменьшение движения».
 */
import { reducedMotion as reduced } from './env'

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)' // easeOutQuint: быстро стартует, мягко садится
const OPEN_MS = 420
const CLOSE_MS = 320


const running = new WeakMap<Element, Animation>()

function animateHeight(el: HTMLElement, from: number, to: number, ms: number, onDone?: () => void) {
  running.get(el)?.cancel()
  el.classList.add('oc-anim')
  const anim = el.animate(
    [
      { height: `${from}px`, opacity: from === 0 ? 0 : 1 },
      { height: `${to}px`, opacity: to === 0 ? 0 : 1 },
    ],
    { duration: ms, easing: EASE },
  )
  running.set(el, anim)
  const finish = () => {
    if (running.get(el) !== anim) return
    running.delete(el)
    el.classList.remove('oc-anim')
    onDone?.()
  }
  anim.onfinish = finish
  anim.oncancel = () => {
    if (running.get(el) === anim) running.delete(el)
  }
}

/* ---------- Меню слева ---------- */

function watchSidebar() {
  const obs = new MutationObserver((records) => {
    if (reduced()) return
    for (const r of records) {
      const item = r.target as HTMLElement
      if (!item.classList?.contains('VPSidebarItem')) continue
      const was = (r.oldValue || '').split(/\s+/).includes('collapsed')
      const now = item.classList.contains('collapsed')
      if (was === now) continue
      const items = item.querySelector<HTMLElement>(':scope > .items')
      if (!items) continue
      // колбэк срабатывает до отрисовки, поэтому мерить можно, не боясь мигания
      items.classList.add('oc-anim')
      const full = items.scrollHeight
      if (now) animateHeight(items, full, 0, CLOSE_MS)
      else animateHeight(items, 0, full, OPEN_MS)
    }
  })
  obs.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['class'], attributeOldValue: true })
}

/* ---------- <details> в тексте ---------- */

function watchDetails() {
  document.addEventListener('click', (e) => {
    const summary = (e.target as Element | null)?.closest?.('summary')
    const details = summary?.parentElement
    if (!summary || !(details instanceof HTMLDetailsElement) || !details.closest('.vp-doc')) return
    if (reduced()) return
    e.preventDefault()
    const start = details.offsetHeight
    if (!details.open || details.classList.contains('oc-closing')) {
      details.classList.remove('oc-closing')
      details.open = true
      const end = details.scrollHeight
      details.style.overflow = 'hidden'
      animateHeight(details, start, end, OPEN_MS, () => (details.style.overflow = ''))
    } else {
      details.classList.add('oc-closing')
      const cs = getComputedStyle(details)
      const end =
        summary.offsetHeight +
        parseFloat(cs.paddingTop) +
        parseFloat(cs.paddingBottom) +
        parseFloat(cs.borderTopWidth) +
        parseFloat(cs.borderBottomWidth)
      details.style.overflow = 'hidden'
      animateHeight(details, start, end, CLOSE_MS, () => {
        details.open = false
        details.classList.remove('oc-closing')
        details.style.overflow = ''
      })
    }
  })
}

/* ---------- Появление страницы ---------- */

export function revealPage() {
  if (typeof window === 'undefined' || reduced()) return
  const el = document.querySelector<HTMLElement>('.VPDoc .content-container, .VPPage')
  el?.animate(
    [
      { opacity: 0, transform: 'translateY(10px)' },
      { opacity: 1, transform: 'none' },
    ],
    { duration: 420, easing: EASE },
  )
}

/* ---------- Появление блоков при прокрутке ---------- */

let revealObserver: IntersectionObserver | undefined

export function bindReveal() {
  if (typeof window === 'undefined') return
  const els = document.querySelectorAll<HTMLElement>('.oc-reveal:not(.oc-in)')
  if (reduced() || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('oc-in'))
    return
  }
  document.documentElement.classList.add('oc-reveal-on')
  revealObserver ??= new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        const el = e.target as HTMLElement
        el.classList.add('oc-in')
        revealObserver!.unobserve(el)
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  )
  els.forEach((el) => revealObserver!.observe(el))
}

export function installMotion() {
  watchSidebar()
  watchDetails()
}
