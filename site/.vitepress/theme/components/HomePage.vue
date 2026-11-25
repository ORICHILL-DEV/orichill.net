<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'
import { icon } from '../../icons'
import { openMap } from '../lib/frames'
import { scramble } from '../lib/scramble'
import HomeHero from './home/HomeHero.vue'

const ticker = ['Хардкор', 'PvE', 'RPG', 'Полу-RP', 'Сезоны', 'Температура', 'Жажда', 'Без координат', 'Случайный спавн', 'Навыки', 'Ранги', 'Голосовой чат']

const features = [
  { ic: icon('Skull'), title: 'Опасный мир', text: 'У мобов есть свой уровень: они бьют больнее и бегают быстрее. А фантомы стали дронами-камикадзе.', link: '/wiki/mechanics/' },
  { ic: icon('Compass'), title: 'Без координат', text: 'Координаты в F3 отключены, спавн случайный. Ориентируйтесь по компасу и памяти.', link: '/wiki/mechanics/' },
  { ic: icon('Swords'), title: 'Навыки и ранги', text: 'Прокачивайте навыки и статы персонажа. Ранги показывают стаж на сервере и дают бонусы.', link: '/wiki/mechanics/skills' },
  { ic: icon('Snowflake'), title: 'Сезоны и температура', text: 'Смена времён года, температура тела и жажда. Одевайтесь по погоде и не забывайте пить.', link: '/wiki/mechanics/seasons-and-temperature' },
  { ic: icon('Hammer'), title: 'Новые крафты и чары', text: 'Кастомные крафты, зачарования, пивоварня, новая готовка и мобы Эндер Мира.', link: '/wiki/mechanics/custom-crafts' },
  { ic: icon('Mic'), title: 'Голос и эмоции', text: 'Голосовой чат по близости и эмоции. Общайтесь, объединяйтесь и стройте вместе.', link: '/wiki/mechanics/voice-chat' },
]

const stats = [
  { value: '1.21.11–26.3', label: 'Версии Java Edition' },
  { value: '14+', label: 'Возраст игроков' },
  { value: 'RTP', label: 'Случайная точка спавна' },
  { value: 'F3 = ∅', label: 'Координаты отключены' },
]

const steps = [
  { title: 'Пройдите анкету', text: 'Зайдите в наш Discord и откройте анкету. Администрация проверит её и пустит вас на основной сервер.', cta: 'Открыть Discord', href: 'https://discord.orichill.net/' },
  { title: 'Подготовьте клиент', text: 'Подойдёт Java Edition от 1.21.11 до 26.3: вход с аккаунтом Microsoft или по паролю сервера. Для комфорта есть наша сборка ORICHILL Client.', cta: 'ORICHILL Client на Modrinth', href: 'https://modrinth.com/modpack/orichill-client' },
  { title: 'Заходите в игру', text: 'Добавьте сервер mc.orichill.net и загляните в вики: правила, команды и все механики собраны там.', cta: 'Читать вики', href: '/wiki/main/info' },
]

const links = [
  { ic: icon('MessagesSquare'), name: 'Discord', text: 'Анкета, новости, общение', href: 'https://discord.orichill.net/' },
  { ic: icon('Send'), name: 'Telegram', text: 'Новости проекта', href: 'https://t.me/orichill' },
  { ic: icon('Users'), name: 'ВКонтакте', text: 'Группа сервера', href: 'https://vk.com/orichill' },
  { ic: icon('Heart'), name: 'Поддержать', text: 'Помочь проекту', href: '/wiki/others/donate' },
]

const chapters = [
  { id: 'world', n: '01', name: 'Мир' },
  { id: 'data', n: '02', name: 'Параметры' },
  { id: 'start', n: '03', name: 'Старт' },
  { id: 'map', n: '04', name: 'Карта' },
  { id: 'link', n: '05', name: 'Связь' },
]
const active = ref('')
const progress = ref(0)
const steps$ = ref<HTMLElement>()

const isLocal = (href: string) => href.startsWith('/')
const href = (h: string) => (isLocal(h) ? withBase(h) : h)

let io: IntersectionObserver | undefined
let dataIo: IntersectionObserver | undefined
const onScroll = () => {
  const el = steps$.value
  if (!el) return
  const r = el.getBoundingClientRect()
  const p = (window.innerHeight * 0.65 - r.top) / r.height
  progress.value = Math.min(Math.max(p, 0), 1)
}

onMounted(() => {
  // Активная глава для боковой навигации
  io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (e.isIntersecting) active.value = e.target.id
      if (window.scrollY < window.innerHeight * 0.6) active.value = ''
    },
    { rootMargin: '-45% 0px -50% 0px' },
  )
  chapters.forEach((c) => {
    const el = document.getElementById(c.id)
    if (el) io!.observe(el)
  })
  // Значения параметров «расшифровываются», когда появляются на экране
  dataIo = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        const el = e.target as HTMLElement
        scramble(el, { duration: 900, delay: Number(el.dataset.delay || 0) })
        dataIo!.unobserve(el)
      }
    },
    { threshold: 0.6 },
  )
  document.querySelectorAll<HTMLElement>('[data-scramble]').forEach((el) => dataIo!.observe(el))
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onBeforeUnmount(() => {
  io?.disconnect()
  dataIo?.disconnect()
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <div class="oc-home">
    <HomeHero />

    <!-- бегущая строка -->
    <div class="oc-ticker" aria-hidden="true">
      <div class="oc-ticker__track">
        <template v-for="k in 2" :key="k">
          <span v-for="t in ticker" :key="k + t" class="oc-ticker__item">{{ t }}</span>
        </template>
      </div>
    </div>

    <!-- навигация по главам справа -->
    <nav :class="['oc-rail', { 'is-hidden': !active }]" aria-label="Разделы главной">
      <a v-for="c in chapters" :key="c.id" :href="`#${c.id}`" :class="['oc-rail__item', { 'is-active': active === c.id }]">
        <span class="oc-rail__n">{{ c.n }}</span><span class="oc-rail__name">{{ c.name }}</span>
      </a>
    </nav>

    <section id="world" class="oc-chapter">
      <header class="oc-chapter__head">
        <span class="oc-chapter__n oc-reveal" aria-hidden="true">01</span>
        <div>
          <p class="oc-kicker oc-reveal">Мир</p>
          <h2 class="oc-h2 oc-reveal" style="--d: 1">Чем живёт сервер</h2>
          <p class="oc-sub oc-reveal" style="--d: 2">Основа ванильная, но PvE стало заметно сложнее. Для тех, кому тесно в обычном Minecraft, и с удобными механиками в помощь.</p>
        </div>
      </header>
      <div class="oc-features">
        <a v-for="(f, i) in features" :key="f.title" class="oc-feature oc-reveal" :style="{ '--d': i % 3 }" :href="withBase(f.link)">
          <span class="oc-feature__code">F-0{{ i + 1 }}</span>
          <span class="oc-feature__ic" v-html="f.ic" />
          <h3 class="oc-feature__title">{{ f.title }}</h3>
          <p class="oc-feature__text">{{ f.text }}</p>
          <span class="oc-feature__more">Подробнее <span aria-hidden="true">→</span></span>
        </a>
      </div>
    </section>

    <section id="data" class="oc-chapter oc-chapter--tight">
      <header class="oc-chapter__head">
        <span class="oc-chapter__n oc-reveal" aria-hidden="true">02</span>
        <div>
          <p class="oc-kicker oc-reveal">Параметры</p>
          <h2 class="oc-h2 oc-reveal" style="--d: 1">Коротко о главном</h2>
        </div>
      </header>
      <dl class="oc-stats">
        <div v-for="(s, i) in stats" :key="s.label" class="oc-stat oc-reveal" :style="{ '--d': i }">
          <dt class="oc-stat__label">{{ s.label }}</dt>
          <dd class="oc-stat__value" data-scramble :data-delay="i * 120">{{ s.value }}</dd>
        </div>
      </dl>
    </section>

    <section id="start" class="oc-chapter">
      <header class="oc-chapter__head">
        <span class="oc-chapter__n oc-reveal" aria-hidden="true">03</span>
        <div>
          <p class="oc-kicker oc-reveal">Старт</p>
          <h2 class="oc-h2 oc-reveal" style="--d: 1">Как начать играть</h2>
        </div>
      </header>
      <ol ref="steps$" class="oc-steps" :style="{ '--p': progress }">
        <li v-for="(s, i) in steps" :key="s.title" class="oc-step oc-reveal" :style="{ '--d': i }">
          <span class="oc-step__n">0{{ i + 1 }}</span>
          <div class="oc-step__body">
            <h3 class="oc-step__title">{{ s.title }}</h3>
            <p class="oc-step__text">{{ s.text }}</p>
            <a class="oc-step__cta" :href="href(s.href)" :target="isLocal(s.href) ? undefined : '_blank'" rel="noopener">{{ s.cta }} <span aria-hidden="true">→</span></a>
          </div>
        </li>
      </ol>
    </section>

    <section id="map" class="oc-chapter oc-chapter--tight">
      <div class="oc-mapband oc-reveal">
        <div class="oc-radar" aria-hidden="true">
          <span class="oc-radar__sweep" />
          <i style="--x: 28%; --y: 38%; --t: 0.2s" /><i style="--x: 64%; --y: 30%; --t: 1.4s" /><i style="--x: 56%; --y: 70%; --t: 2.6s" /><i style="--x: 34%; --y: 66%; --t: 3.4s" />
        </div>
        <div class="oc-mapband__body">
          <p class="oc-kicker"><span>04</span> Карта</p>
          <h2 class="oc-h2">Живая карта мира</h2>
          <p class="oc-sub">Постройки игроков и рельеф прямо в браузере. Карта откроется поверх сайта, страницу покидать не нужно.</p>
          <button class="oc-btn oc-btn--brand" type="button" @click="openMap">Открыть карту <span class="oc-btn__arrow">→</span></button>
        </div>
      </div>
    </section>

    <section id="link" class="oc-chapter oc-chapter--last">
      <header class="oc-chapter__head">
        <span class="oc-chapter__n oc-reveal" aria-hidden="true">05</span>
        <div>
          <p class="oc-kicker oc-reveal">Связь</p>
          <h2 class="oc-h2 oc-reveal" style="--d: 1">Сообщество</h2>
        </div>
      </header>
      <div class="oc-links">
        <a v-for="(l, i) in links" :key="l.name" class="oc-link oc-reveal" :style="{ '--d': i }" :href="href(l.href)" :target="isLocal(l.href) ? undefined : '_blank'" rel="noopener">
          <span class="oc-link__ic" v-html="l.ic" />
          <span class="oc-link__name">{{ l.name }}</span>
          <span class="oc-link__text">{{ l.text }}</span>
          <span class="oc-link__arrow" aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  </div>
</template>
