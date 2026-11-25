<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'
import { openMap } from '../../lib/frames'
import { copyWithToast } from '../../lib/toast'
import { startField } from '../../lib/field'
import { scramble } from '../../lib/scramble'
import { fetchStatus, type ServerStatus } from '../../lib/status'
import { reducedMotion } from '../../lib/env'

const IP = 'mc.orichill.net'

const root = ref<HTMLElement>()
const field = ref<HTMLCanvasElement>()
const title = ref<HTMLElement>()
const booted = ref(false)
const copied = ref(false)
const clock = ref('--:--:--')
const coords = ref({ x: '????', z: '????' })
const status = ref<ServerStatus>({ state: 'loading' })

const statusText = computed(() => {
  const s = status.value
  if (s.state === 'loading') return 'Поиск сигнала'
  if (s.state === 'offline') return 'Нет сигнала'
  return `Онлайн · ${s.players}${s.max ? ' / ' + s.max : ''}`
})

async function copyIp() {
  await copyWithToast(IP, 'IP-адрес скопирован', `${IP} · вставьте его в «Сетевая игра» → «Добавить сервер»`)
  copied.value = true
  setTimeout(() => (copied.value = false), 1800)
}

const stops: Array<() => void> = []
onMounted(() => {
  if (root.value && field.value) stops.push(startField(field.value, root.value))

  // Запуск: рамка, линия сканирования, затем «расшифровка» названия.
  // Полная заставка один раз за визит, дальше короче.
  let seen = false
  try {
    seen = sessionStorage.getItem('oc-boot') === '1'
    sessionStorage.setItem('oc-boot', '1')
  } catch {}
  const quick = seen || reducedMotion()
  root.value?.classList.toggle('is-quick', quick)
  requestAnimationFrame(() => (booted.value = true))
  if (title.value) stops.push(scramble(title.value, { text: 'ORICHILL', duration: quick ? 700 : 1400, delay: quick ? 150 : 900 }))

  // Часы МСК и «сбитые» координаты: на сервере их не видно
  const tick = () => {
    clock.value = new Date().toLocaleTimeString('ru-RU', { timeZone: 'Europe/Moscow', hour12: false })
    const g = () => (Math.random() < 0.5 ? '-' : '') + String((Math.random() * 9999) | 0).padStart(4, '0')
    coords.value = { x: g(), z: g() }
  }
  tick()
  const t = window.setInterval(tick, 1000)
  stops.push(() => clearInterval(t))

  fetchStatus(IP).then((s) => (status.value = s))
})
onBeforeUnmount(() => stops.forEach((f) => f()))
</script>

<template>
  <section ref="root" :class="['oh', { 'is-booted': booted }]" :style="{ '--oc-cover': `url(${withBase('/img/cover.webp')})` }">
    <div class="oh__cover" aria-hidden="true" />
    <canvas ref="field" class="oh__field" aria-hidden="true" />
    <div class="oh__scan" aria-hidden="true" />

    <!-- рамка интерфейса -->
    <div class="oh__hud" aria-hidden="true">
      <span class="oh__corner oh__corner--tl" /><span class="oh__corner oh__corner--tr" />
      <span class="oh__corner oh__corner--bl" /><span class="oh__corner oh__corner--br" />
      <div class="oh__meta oh__meta--tl">
        <span class="oh__dot" />ORICHILL // протокол выживания
        <span class="oh__dim">сезон 2026</span>
      </div>
      <div class="oh__meta oh__meta--tr">МСК <b>{{ clock }}</b></div>
      <div class="oh__meta oh__meta--bl">
        <span class="oh__dim">Координаты скрыты</span>
        X <b>{{ coords.x }}</b> Z <b>{{ coords.z }}</b>
      </div>
      <div :class="['oh__meta', 'oh__meta--br', `is-${status.state}`]">
        <span class="oh__pulse" />{{ statusText }}
      </div>
    </div>

    <div class="oh__core">
      <div class="oh__emblem" aria-hidden="true">
        <svg class="oh__rings" viewBox="0 0 200 200">
          <circle class="oh__ring oh__ring--ticks" cx="100" cy="100" r="94" />
          <circle class="oh__ring oh__ring--arc" cx="100" cy="100" r="84" />
          <circle class="oh__ring oh__ring--arc2" cx="100" cy="100" r="74" />
          <circle class="oh__ring oh__ring--thin" cx="100" cy="100" r="64" />
        </svg>
        <span class="oh__aura" />
        <img class="oh__logo" :src="withBase('/img/logo.png')" alt="" width="104" height="104" />
      </div>

      <p class="oh__kicker">Хардкорное выживание · PvE · RPG · полу-RP</p>
      <h1 class="oh__title"><span ref="title" class="oh__title-text">ORICHILL</span></h1>
      <p class="oh__lead">Мир, который не прощает ошибок. Координаты скрыты, мобы сильнее, а выжить помогает только сообщество.</p>

      <div class="oh__actions">
        <button :class="['oh__ip', { 'is-copied': copied }]" type="button" :aria-label="`Скопировать адрес ${IP}`" @click="copyIp">
          <span class="oh__ip-label">IP</span>
          <span class="oh__ip-addr">{{ IP }}</span>
          <span class="oh__ip-hint" aria-live="polite">{{ copied ? 'Скопировано' : 'Копировать' }}</span>
        </button>
        <div class="oh__buttons">
          <a class="oc-btn oc-btn--brand" href="#start">Начать играть <span class="oc-btn__arrow">→</span></a>
          <button class="oc-btn oc-btn--ghost" type="button" @click="openMap">Карта мира</button>
        </div>
        <p class="oh__ver">Java 1.21.11 – 26.3 · 14+</p>
      </div>
    </div>

    <a class="oh__scroll" href="#world" aria-label="Листать вниз"><span>Листать</span><i /></a>
  </section>
</template>
