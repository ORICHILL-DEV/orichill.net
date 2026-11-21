<script setup lang="ts">
import { withBase } from 'vitepress'
import { icon } from '../../icons'

function openSearch() {
  const btn = document.querySelector<HTMLButtonElement>('.VPNavBarSearch button, #local-search button')
  btn?.click()
}

const sections = [
  { ic: icon('Rocket'), title: 'С чего начать', text: 'IP, версии, анкета, клиент и полезные ссылки.', link: '/wiki/main/info' },
  { ic: icon('ScrollText'), title: 'Правила', text: 'Что можно и чего нельзя на сервере.', link: '/wiki/main/rules' },
  { ic: icon('Terminal'), title: 'Команды', text: 'Все команды игрока в одном месте.', link: '/wiki/main/all-commands' },
  { ic: icon('CircleHelp'), title: 'FAQ', text: 'Ответы на частые вопросы новичков.', link: '/wiki/main/faq' },
  { ic: icon('Sparkles'), title: 'Механики', text: 'Навыки, сезоны, крафты, пивоварня и многое другое.', link: '/wiki/mechanics/' },
  { ic: icon('Shield'), title: 'Защита территории', text: 'Как заприватить дом и сундуки.', link: '/wiki/mechanics/protection-private-territory-docs' },
  { ic: icon('VenetianMask'), title: 'Role play', text: 'Что такое полу-RP на ORICHILL.', link: '/wiki/rp/info' },
  { ic: icon('Heart'), title: 'Поддержать проект', text: 'Как помочь серверу развиваться.', link: '/wiki/others/donate' },
]
</script>

<template>
  <div class="oc-wh">
    <div class="oc-wh__hero">
      <span class="oc-wh__badge" v-html="icon('BookOpen') + '<span>Вики сервера</span>'" />
      <h1 class="oc-wh__title">Всё об <span class="oc-brand-text">ORICHILL</span></h1>
      <p class="oc-wh__lead">Правила, команды и каждая механика сервера. Найдите нужное через поиск или выберите раздел ниже.</p>
      <button class="oc-wh__search" type="button" @click="openSearch">
        <span class="oc-wh__search-ic" v-html="icon('Search')" />
        <span class="oc-wh__search-text">Поиск по вики…</span>
        <kbd class="oc-wh__search-kbd">Ctrl K</kbd>
      </button>
    </div>
    <div class="oc-wh__grid">
      <a v-for="(s, idx) in sections" :key="s.title" class="oc-wh__card" :href="withBase(s.link)" :style="{ '--d': `${idx * 40}ms` }">
        <span class="oc-wh__ic" v-html="s.ic" />
        <span class="oc-wh__body">
          <span class="oc-wh__card-title">{{ s.title }}</span>
          <span class="oc-wh__card-text">{{ s.text }}</span>
        </span>
        <span class="oc-wh__arrow" v-html="icon('ArrowRight')" />
      </a>
    </div>
  </div>
</template>
