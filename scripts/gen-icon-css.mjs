// Генерирует site/.vitepress/theme/styles/icons.generated.css: иконки Lucide как CSS-переменные (mask-image).
// Запуск: node scripts/gen-icon-css.mjs
import * as lucide from 'lucide-static'
import { writeFileSync } from 'node:fs'

const names = {
  info: 'Info', tip: 'Lightbulb', warning: 'TriangleAlert', danger: 'OctagonAlert',
  details: 'ChevronRight', caret: 'ChevronDown', search: 'Search', arrow: 'ArrowRight', clock: 'Clock',
}
let css = '/* Сгенерировано scripts/gen-icon-css.mjs — не править вручную. Иконки: Lucide (ISC). */\n:root {\n'
for (const [k, n] of Object.entries(names)) {
  const svg = lucide[n].replace(/\n\s*/g, ' ').replace(/class="[^"]*"/, '').trim()
  css += `  --oc-icon-${k}: url("data:image/svg+xml,${encodeURIComponent(svg)}");\n`
}
css += '}\n'
writeFileSync(new URL('../site/.vitepress/theme/styles/icons.generated.css', import.meta.url), css)
console.log('ok')
