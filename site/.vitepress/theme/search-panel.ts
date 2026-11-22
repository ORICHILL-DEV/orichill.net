/**
 * Боковой поиск VitePress:
 *  - закрывается так же плавно, как открывается (клик по пустому месту, Esc, кнопка «назад»);
 *  - найденная страница открывается справа, а панель поиска остаётся открытой,
 *    чтобы можно было сразу перейти к другому результату.
 * Встроенный компонент не меняем, а перехватываем события раньше него.
 */
const BOX = '.VPLocalSearchBox'
const CLOSE_MS = 420
let closing = false
let passThrough = false

const box = () => document.querySelector<HTMLElement>(BOX)
const wide = () => window.matchMedia('(min-width: 768px)').matches
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Сдвигаем страницу вправо, чтобы панель не закрывала начало текста.
function shiftPage() {
  const shell = box()?.querySelector<HTMLElement>('.shell')
  const content = document.querySelector<HTMLElement>('.VPDoc .content-container') ?? document.querySelector<HTMLElement>('.VPContent')
  if (!shell || !content) return
  const root = document.documentElement
  const current = parseFloat(getComputedStyle(root).getPropertyValue('--oc-search-shift')) || 0
  const left = content.getBoundingClientRect().left - current
  const need = Math.max(0, Math.min(shell.getBoundingClientRect().right + 32 - left, window.innerWidth * 0.25))
  root.style.setProperty('--oc-search-shift', need + 'px')
  root.classList.add('oc-search-preview')
}
function unshiftPage() {
  const root = document.documentElement
  root.classList.remove('oc-search-preview')
  root.style.setProperty('--oc-search-shift', '0px')
}

function closeSmoothly() {
  const el = box()
  if (!el || closing) return
  unshiftPage()
  const finish = () => {
    closing = false
    passThrough = true
    el.querySelector<HTMLElement>('.backdrop')?.click()
    passThrough = false
  }
  if (reduced()) return finish()
  closing = true
  el.classList.add('oc-closing')
  window.setTimeout(finish, CLOSE_MS)
}

function stop(e: Event) {
  e.stopPropagation()
  e.stopImmediatePropagation()
}

export function installSearchPanel() {
  // Клик по затемнению и кнопке «назад» внутри панели.
  document.addEventListener(
    'click',
    (e) => {
      if (passThrough) return
      const t = e.target as HTMLElement | null
      const el = t?.closest?.(BOX)
      if (!el) return

      if (t!.closest('.backdrop') || t!.closest('.back-button')) {
        stop(e)
        e.preventDefault()
        closeSmoothly()
        return
      }

      // Результат поиска: роутер VitePress уже перешёл на страницу (он слушает раньше нас),
      // мы только не даём панели закрыться и снимаем размытие, чтобы страница была видна справа.
      const result = t!.closest<HTMLAnchorElement>('a.result')
      if (result) {
        if (!wide()) {
          // На телефоне панель на весь экран: просто плавно закрываем после перехода.
          stop(e)
          closeSmoothly()
          return
        }
        stop(e)
        el.classList.add('oc-previewing')
        el.querySelectorAll('.result.oc-open').forEach((r) => r.classList.remove('oc-open'))
        result.classList.add('oc-open')
        window.setTimeout(shiftPage, 80)
      }
    },
    true,
  )

  // Esc закрывает плавно; Enter открывает выбранный результат справа, как клик.
  window.addEventListener(
    'keydown',
    (e) => {
      const el = box()
      if (!el || e.isComposing) return
      if (e.key === 'Escape') {
        stop(e)
        e.preventDefault()
        closeSmoothly()
      } else if (e.key === 'Enter' && !(e.target instanceof HTMLButtonElement)) {
        const sel = el.querySelector<HTMLAnchorElement>('a.result.selected')
        if (!sel) return
        stop(e)
        e.preventDefault()
        sel.click()
      }
    },
    true,
  )

  // Пока страница открыта справа, колесо мыши над ней прокручивает страницу.
  document.addEventListener(
    'wheel',
    (e) => {
      const t = e.target as HTMLElement | null
      if (!t?.closest?.(`${BOX}.oc-previewing .backdrop`)) return
      window.scrollBy({ top: e.deltaY, left: 0 })
    },
    { passive: true },
  )
}
