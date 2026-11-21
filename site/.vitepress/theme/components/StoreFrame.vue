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
      Поддержка: <a href="mailto:support@orichill.net">support@orichill.net</a>.
    </p>
    <p class="oc-store__note">
      Покупки только косметические и предназначены для игроков с лицензионной копией Minecraft: Java Edition.
      Товар выдаётся автоматически, не позднее 24 часов после оплаты. Оформляя заказ, вы просите выдать его сразу;
      после выдачи право на 14-дневный отказ для жителей ЕС и Великобритании не действует.
      Возврат — по <a href="/legal/user_agreement">пункту 2.9 Пользовательского соглашения</a>.
      Покупатели 14–17 лет платят своими средствами или с согласия родителей.
      Магазин работает на платформе EasyDonate, сохраняйте чек об оплате.
    </p>
  </section>
</template>
