/**
 * Статус сервера для первого экрана: онлайн и число игроков.
 * Берём из открытого API mcsrvstat.us, при любой ошибке показываем «нет сигнала».
 */
export type ServerStatus = { state: 'loading' | 'online' | 'offline'; players?: number; max?: number }

export async function fetchStatus(host: string, timeoutMs = 6000): Promise<ServerStatus> {
  const ctl = new AbortController()
  const timer = setTimeout(() => ctl.abort(), timeoutMs)
  try {
    const r = await fetch(`https://api.mcsrvstat.us/3/${encodeURIComponent(host)}`, { signal: ctl.signal })
    if (!r.ok) return { state: 'offline' }
    const d = await r.json()
    if (!d?.online) return { state: 'offline' }
    return { state: 'online', players: d.players?.online ?? 0, max: d.players?.max }
  } catch {
    return { state: 'offline' }
  } finally {
    clearTimeout(timer)
  }
}
