<script setup lang="ts">
import { ref } from 'vue'
import { withBase } from 'vitepress'
import { openMap } from '../map'

const IP = 'mc.orichill.net'
const copied = ref(false)
async function copyIp() {
  try {
    await navigator.clipboard.writeText(IP)
  } catch {
    const t = document.createElement('textarea')
    t.value = IP
    document.body.appendChild(t)
    t.select()
    document.execCommand('copy')
    t.remove()
  }
  copied.value = true
  setTimeout(() => (copied.value = false), 1800)
}

const features = [
  { icon: '👾', title: 'Опасный мир', text: 'У мобов есть свой уровень: они бьют больнее и бегают быстрее. А фантомы стали дронами-камикадзе.', link: '/wiki/mechanics/' },
  { icon: '🧭', title: 'Без координат', text: 'Координаты в F3 отключены, спавн случайный. Чтобы ориентироваться, понадобится компас и память.', link: '/wiki/mechanics/' },
  { icon: '⚔️', title: 'Навыки и ранги', text: 'Прокачивайте навыки и статы персонажа. Ранги показывают ваш стаж на сервере и дают бонусы.', link: '/wiki/mechanics/skills' },
  { icon: '🌦️', title: 'Сезоны и температура', text: 'Смена времён года, температура тела и жажда. Одевайтесь по погоде и не забывайте пить.', link: '/wiki/mechanics/seasons-and-temperature' },
  { icon: '🛠️', title: 'Новые крафты и чары', text: 'Кастомные крафты, зачарования, пивоварня, новая готовка и мобы Эндер Мира.', link: '/wiki/mechanics/custom-crafts' },
  { icon: '🎙️', title: 'Голос и эмоции', text: 'Голосовой чат по близости и эмоции. Общайтесь, объединяйтесь и стройте вместе.', link: '/wiki/mechanics/voice-chat' },
]

const steps = [
  { n: 1, title: 'Пройдите анкету', text: 'Зайдите в наш Discord и откройте анкету. Администрация проверит её и пустит вас на основной сервер.', cta: 'Открыть Discord', href: 'https://discord.orichill.net/' },
  { n: 2, title: 'Подготовьте клиент', text: 'Подойдёт любой клиент от 1.21.11 до 26.3, лицензия или пиратка. Для максимального комфорта есть наша сборка ORICHILL Client.', cta: 'ORICHILL Client на Modrinth', href: 'https://modrinth.com/modpack/orichill-client' },
  { n: 3, title: 'Заходите в игру', text: 'Добавьте сервер mc.orichill.net и загляните в вики: правила, команды и все механики собраны там.', cta: 'Читать вики', href: '/wiki/main/info' },
]
</script>

<template>
  <div class="oc-home">
    <section class="oc-hero" :style="{ '--oc-cover': `url(${withBase('/img/cover.webp')})` }">
      <div class="oc-hero__inner">
        <img class="oc-hero__logo" :src="withBase('/img/logo.png')" alt="" width="112" height="112" />
        <h1 class="oc-hero__title"><span class="oc-brand-text">ORICHILL</span></h1>
        <p class="oc-hero__lead">
          Хардкорное ванильное выживание с PvE, RPG и полу-RP. Мир, где каждый шаг имеет значение,
          а ламповое сообщество помогает его пройти.
        </p>
        <div class="oc-ip">
          <button :class="['oc-ip__btn', { 'is-copied': copied }]" type="button" :aria-label="`Скопировать адрес ${IP}`" @click="copyIp">
            <span class="oc-ip__label">IP</span>
            <code class="oc-ip__addr">{{ IP }}</code>
            <span class="oc-ip__hint" aria-live="polite">{{ copied ? 'Скопировано' : 'Копировать' }}</span>
          </button>
          <span class="oc-ip__ver">Java 1.21.11 – 26.3 · лицензия и пиратка</span>
        </div>
        <div class="oc-hero__actions">
          <a class="oc-btn oc-btn--brand" href="#start">Начать играть</a>
          <a class="oc-btn oc-btn--ghost" :href="withBase('/wiki/')">Вики</a>
          <button class="oc-btn oc-btn--ghost" type="button" @click="openMap">Карта мира</button>
        </div>
      </div>
    </section>

    <section class="oc-section">
      <h2 class="oc-h2 oc-reveal">Чем живёт сервер</h2>
      <p class="oc-sub oc-reveal" style="--d: 1">Основа ванильная, но мы усложнили PvE для тех, кому стало тесно в обычном Minecraft, и сбалансировали это удобными механиками.</p>
      <div class="oc-grid">
        <a v-for="(f, i) in features" :key="f.title" class="oc-card oc-reveal" :style="{ '--d': i % 3 }" :href="withBase(f.link)">
          <span class="oc-card__icon" aria-hidden="true">{{ f.icon }}</span>
          <h3 class="oc-card__title">{{ f.title }}</h3>
          <p class="oc-card__text">{{ f.text }}</p>
        </a>
      </div>
    </section>

    <section id="start" class="oc-section">
      <h2 class="oc-h2 oc-reveal">Как начать</h2>
      <ol class="oc-steps">
        <li v-for="(s, i) in steps" :key="s.n" class="oc-step oc-reveal" :style="{ '--d': i }">
          <span class="oc-step__n">{{ s.n }}</span>
          <h3 class="oc-step__title">{{ s.title }}</h3>
          <p class="oc-step__text">{{ s.text }}</p>
          <a class="oc-step__cta" :href="s.href.startsWith('/') ? withBase(s.href) : s.href" :target="s.href.startsWith('/') ? undefined : '_blank'" rel="noopener">{{ s.cta }} →</a>
        </li>
      </ol>
    </section>

    <section class="oc-section">
      <div class="oc-band oc-reveal">
        <div>
          <h2 class="oc-h2 oc-h2--left">Живая карта мира</h2>
          <p class="oc-sub oc-sub--left">Смотрите постройки игроков и рельеф прямо в браузере. Карта откроется поверх сайта, страницу покидать не нужно.</p>
        </div>
        <button class="oc-btn oc-btn--brand" type="button" @click="openMap">Открыть карту</button>
      </div>
    </section>

    <section class="oc-section oc-section--last">
      <h2 class="oc-h2 oc-reveal">Сообщество</h2>
      <div class="oc-social">
        <a class="oc-social__item oc-reveal" style="--d: 0" href="https://discord.orichill.net/" target="_blank" rel="noopener"><strong>Discord</strong><span>анкета, новости, общение</span></a>
        <a class="oc-social__item oc-reveal" style="--d: 1" href="https://t.me/orichill" target="_blank" rel="noopener"><strong>Telegram</strong><span>новости проекта</span></a>
        <a class="oc-social__item oc-reveal" style="--d: 2" href="https://vk.com/orichill" target="_blank" rel="noopener"><strong>ВКонтакте</strong><span>группа сервера</span></a>
        <a class="oc-social__item oc-reveal" style="--d: 3" :href="withBase('/wiki/others/donate')"><strong>Поддержать</strong><span>помочь проекту</span></a>
      </div>
    </section>
  </div>
</template>
