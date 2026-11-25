import { ref } from 'vue'

/**
 * Внешние разделы, которые открываются окном поверх сайта, без перехода:
 * живая карта squaremap и магазин EasyDonate.
 */
export const MAP_URL = 'https://map.orichill.net/'
export const STORE_URL = 'https://store.orichill.net/'

export type FrameKind = 'map' | 'store'

export const frames: Record<FrameKind, { url: string; hash: string; title: string; label: string }> = {
  map: { url: MAP_URL, hash: '#map', title: 'Онлайн-карта', label: 'Онлайн-карта ORICHILL' },
  store: { url: STORE_URL, hash: '#store', title: 'Магазин', label: 'Магазин ORICHILL' },
}

/** Какое окно открыто сейчас (или null). */
export const openFrame = ref<FrameKind | null>(null)

function setHash(hash: string | null) {
  const clean = location.pathname + location.search
  history.replaceState(history.state, '', hash ? clean + hash : clean)
}

export function open(kind: FrameKind) {
  openFrame.value = kind
  if (location.hash !== frames[kind].hash) setHash(frames[kind].hash)
}

export function close() {
  const kind = openFrame.value
  openFrame.value = null
  if (kind && location.hash === frames[kind].hash) setHash(null)
}

export const openMap = () => open('map')
export const openStore = () => open('store')

function kindOf(a: HTMLAnchorElement): FrameKind | null {
  const href = a.getAttribute('href') || ''
  if (href === '#map' || /^https?:\/\/map\.orichill\.net\/?$/.test(href)) return 'map'
  if (href === '#store' || /^https?:\/\/store\.orichill\.net\/?$/.test(href) || /^\/store\/?$/.test(href)) return 'store'
  return null
}

export function fromHash() {
  const kind = (Object.keys(frames) as FrameKind[]).find((k) => frames[k].hash === location.hash)
  if (kind) open(kind)
}

/**
 * Любая ссылка на карту или магазин (в меню, в тексте вики, на главной) открывает окно.
 * Ctrl/Cmd/Shift-клик и средняя кнопка работают как обычно: новая вкладка.
 * Прямой заход на /store показывает магазин встроенным в страницу.
 */
export function installFrameLinks() {
  document.addEventListener(
    'click',
    (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as Element | null)?.closest?.('a')
      if (!a) return
      const kind = kindOf(a)
      if (!kind) return
      // на самой странице /store окно не нужно: магазин уже встроен
      if (kind === 'store' && location.pathname.replace(/\/$/, '') === '/store') return
      e.preventDefault()
      e.stopPropagation()
      open(kind)
    },
    true,
  )
  window.addEventListener('hashchange', fromHash)
}

/** Путь ведёт на страницу магазина? (внутренние ссылки /store обрабатывает роутер VitePress) */
export function isStorePath(href: string) {
  return new URL(href, location.href).pathname.replace(/\/$/, '') === '/store'
}
