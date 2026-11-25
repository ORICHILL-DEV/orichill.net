/** Общие проверки окружения для анимаций. */
export const inBrowser = typeof window !== 'undefined'

/** Пользователь включил в системе «уменьшение движения». */
export const reducedMotion = () => inBrowser && window.matchMedia('(prefers-reduced-motion: reduce)').matches
