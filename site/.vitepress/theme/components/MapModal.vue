<script setup lang="ts">
import { watch, onMounted, onBeforeUnmount, ref, nextTick } from 'vue'
import { mapOpen, closeMap, MAP_URL } from '../map'

// iframe создаётся только при первом открытии и потом живёт дальше,
// чтобы повторное открытие карты было мгновенным
const loaded = ref(false)
const closeBtn = ref<HTMLButtonElement>()

watch(mapOpen, async (open) => {
  document.documentElement.classList.toggle('oc-map-lock', open)
  if (open) {
    loaded.value = true
    await nextTick()
    closeBtn.value?.focus()
  }
})

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && mapOpen.value) closeMap()
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <Teleport to="body">
    <Transition name="oc-map">
      <div v-show="mapOpen" class="oc-map" role="dialog" aria-modal="true" aria-label="Онлайн-карта ORICHILL" @click.self="closeMap">
        <div class="oc-map__window">
          <header class="oc-map__bar">
            <span class="oc-map__title">Онлайн-карта</span>
            <a class="oc-map__ext" :href="MAP_URL" target="_blank" rel="noopener">Открыть в новой вкладке ↗</a>
            <button ref="closeBtn" class="oc-map__close" type="button" aria-label="Закрыть карту" @click="closeMap">✕</button>
          </header>
          <iframe v-if="loaded" class="oc-map__frame" :src="MAP_URL" title="Онлайн-карта ORICHILL" loading="lazy" allow="fullscreen" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
