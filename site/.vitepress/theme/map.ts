import { ref } from 'vue'

/** Адрес живой карты squaremap. Открывается в окне поверх сайта, без перехода. */
export const MAP_URL = 'https://map.orichill.net/'

export const mapOpen = ref(false)

export function openMap() {
  mapOpen.value = true
  if (location.hash !== '#map') history.replaceState(history.state, '', '#map')
}

export function closeMap() {
  mapOpen.value = false
  if (location.hash === '#map')
    history.replaceState(history.state, '', location.pathname + location.search)
}

function isMapLink(a: HTMLAnchorElement) {
  const href = a.getAttribute('href') || ''
  return href === '#map' || /^https?:\/\/map\.orichill\.net\/?$/.test(href)
}

/**
 * Любая ссылка на карту (в меню, в тексте вики, на главной) открывает окно.
 * Ctrl/Cmd/Shift-клик и средняя кнопка работают как обычно: карта в новой вкладке.
 */
export function installMapLinks() {
  document.addEventListener(
    'click',
    (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as Element | null)?.closest?.('a')
      if (!a || !isMapLink(a)) return
      e.preventDefault()
      e.stopPropagation()
      openMap()
    },
    true,
  )
  if (location.hash === '#map') openMap()
  window.addEventListener('hashchange', () => {
    if (location.hash === '#map') openMap()
  })
}
