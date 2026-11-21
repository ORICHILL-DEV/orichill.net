<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

// Магазин работает на EasyDonate (store.orichill.net) и встраивается в сайт рамкой,
// поэтому игрок не покидает www.orichill.net. Оплата открывается в новой вкладке,
// если платёжная система не разрешает показ внутри рамки.
import { STORE_URL } from '../frames'
const loaded = ref(false)
const slow = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

onMounted(() => {
  timer = setTimeout(() => { if (!loaded.value) slow.value = true }, 8000)
})
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <section class="oc-store">
    <header class="oc-store__bar">
      <div>
        <h1 class="oc-store__title">Магазин</h1>
        <p class="oc-store__sub">Покупки не влияют на игровой баланс. Товар выдаётся на сервере автоматически после оплаты.</p>
      </div>
      <a class="oc-btn oc-btn--brand oc-store__ext" :href="STORE_URL" target="_blank" rel="noopener">Открыть в новой вкладке ↗</a>
    </header>
    <div class="oc-store__frame-wrap">
      <div v-if="!loaded" class="oc-store__loading">
        <span class="oc-store__spinner" aria-hidden="true" />
        <p>Загружаем магазин…</p>
        <p v-if="slow" class="oc-store__slow">
          Долго грузится? <a :href="STORE_URL" target="_blank" rel="noopener">Откройте магазин в новой вкладке</a>.
        </p>
      </div>
      <iframe
        class="oc-store__frame"
        :class="{ 'is-ready': loaded }"
        :src="STORE_URL"
        title="Магазин ORICHILL"
        allow="payment; clipboard-write"
        referrerpolicy="strict-origin-when-cross-origin"
        @load="loaded = true"
      />
    </div>
    <p class="oc-store__note">
      Магазин работает на платформе EasyDonate. Сохраняйте чек об оплате (см. <a href="/wiki/main/rules#_7-покупки-и-обслуживание">раздел 7 правил</a>).
    </p>
  </section>
</template>
