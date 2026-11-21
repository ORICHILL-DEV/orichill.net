import * as lucide from 'lucide-static'

/** Компактный inline-SVG иконки Lucide (https://lucide.dev) для меню и навигации. */
export function icon(name: keyof typeof lucide): string {
  const svg = (lucide[name] as unknown as string)
    .replace(/\n\s*/g, ' ')
    .replace(/class="[^"]*"/, 'class="oc-ic" aria-hidden="true"')
    .replace(/width="24"/, 'width="1em"')
    .replace(/height="24"/, 'height="1em"')
  return svg.trim()
}

/** Текст пункта меню с иконкой слева. */
export function withIcon(name: keyof typeof lucide, text: string): string {
  return `${icon(name)}<span class="oc-label">${text}</span>`
}
