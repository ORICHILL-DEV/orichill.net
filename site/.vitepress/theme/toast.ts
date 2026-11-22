import { reactive } from 'vue'

export type ToastKind = 'success' | 'info' | 'error'
export interface Toast {
  id: number
  kind: ToastKind
  title: string
  text?: string
  duration: number
}

export const toasts = reactive<Toast[]>([])
let seq = 0

/** Показывает уведомление в правом верхнем углу. Одинаковые подряд не дублируются. */
export function toast(title: string, opts: { text?: string; kind?: ToastKind; duration?: number } = {}) {
  const same = toasts.find((t) => t.title === title && t.text === opts.text)
  if (same) dismiss(same.id)
  const t: Toast = { id: ++seq, kind: opts.kind ?? 'success', title, text: opts.text, duration: opts.duration ?? 3200 }
  toasts.push(t)
  while (toasts.length > 4) toasts.shift()
  return t.id
}

export function dismiss(id: number) {
  const i = toasts.findIndex((t) => t.id === id)
  if (i !== -1) toasts.splice(i, 1)
}

export async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value)
    return true
  } catch {
    const t = document.createElement('textarea')
    t.value = value
    t.setAttribute('readonly', '')
    t.style.position = 'fixed'
    t.style.opacity = '0'
    document.body.appendChild(t)
    t.select()
    const ok = document.execCommand('copy')
    t.remove()
    return ok
  }
}

/** Копирует и сразу сообщает об этом. */
export async function copyWithToast(value: string, title: string, text = value) {
  if (await copyText(value)) toast(title, { text })
  else toast('Не удалось скопировать', { text: 'Скопируйте вручную: ' + value, kind: 'error', duration: 5000 })
}

const ADDRESS = /(^|\.)orichill\.net$|^raknetl?;/

/** Уведомления для действий по всему сайту: копирование кода, ссылок на разделы, адресов, состояние сети. */
export function installToasts() {
  document.addEventListener('click', (e) => {
    const el = e.target as HTMLElement | null
    if (!el?.closest) return

    // Кнопка копирования у блоков кода (VitePress копирует сам, мы только сообщаем).
    if (el.closest('.vp-doc div[class*="language-"] > button.copy')) {
      toast('Код скопирован', { text: 'Можно вставить в чат или консоль' })
      return
    }

    // Значок # у заголовка: копируем ссылку на раздел.
    const anchor = el.closest<HTMLAnchorElement>('.vp-doc a.header-anchor')
    if (anchor) {
      const heading = anchor.parentElement?.textContent?.replace(/[#​]/g, '').trim()
      copyWithToast(anchor.href, 'Ссылка на раздел скопирована', heading || anchor.href)
      return
    }

    // Адрес сервера в тексте вики копируется по клику.
    const code = el.closest<HTMLElement>('.vp-doc :not(pre) > code')
    if (code && ADDRESS.test(code.textContent?.trim() ?? '')) {
      const v = code.textContent!.trim()
      copyWithToast(v, v.includes(';') ? 'Адрес для Raknetify скопирован' : 'IP-адрес скопирован', v)
    }
  })

  window.addEventListener('offline', () =>
    toast('Нет подключения к интернету', { text: 'Страницы, которые уже открывались, останутся доступны', kind: 'error', duration: 5000 }),
  )
  window.addEventListener('online', () => toast('Подключение восстановлено', { kind: 'info' }))
}

/** Помечает адреса в тексте, чтобы было видно, что их можно скопировать. */
export function markCopyable() {
  document.querySelectorAll<HTMLElement>('.vp-doc :not(pre) > code').forEach((c) => {
    if (ADDRESS.test(c.textContent?.trim() ?? '') && !c.classList.contains('oc-copyable')) {
      c.classList.add('oc-copyable')
      c.title = 'Нажмите, чтобы скопировать'
      c.tabIndex = 0
      c.setAttribute('role', 'button')
      c.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          c.click()
        }
      })
    }
  })
}
