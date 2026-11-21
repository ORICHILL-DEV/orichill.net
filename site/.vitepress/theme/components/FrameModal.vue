<script setup lang="ts">
import { watch, onMounted, onBeforeUnmount, ref, nextTick, computed } from 'vue'
import { openFrame, close, frames, fromHash, type FrameKind } from '../frames'

// iframe создаётся при первом открытии и потом живёт дальше,
// чтобы повторное открытие было мгновенным
const mounted = ref<Record<FrameKind, boolean>>({ map: false, store: false })
const ready = ref<Record<FrameKind, boolean>>({ map: false, store: false })
const closeBtn = ref<HTMLButtonElement>()
const cur = computed(() => (openFrame.value ? frames[openFrame.value] : null))

watch(openFrame, async (kind) => {
  document.documentElement.classList.toggle('oc-map-lock', !!kind)
  if (kind) {
    mounted.value[kind] = true
    await nextTick()
    closeBtn.value?.focus()
  }
})

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && openFrame.value) close()
}
onMounted(() => {
  window.addEventListener('keydown', onKey)
  // ссылка вида orichill.net/#map или #store сразу открывает окно
  fromHash()
})
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <Teleport to="body">
    <Transition name="oc-map">
      <div v-show="openFrame" class="oc-map" role="dialog" aria-modal="true" :aria-label="cur?.label" @click.self="close">
        <div class="oc-map__window">
          <header class="oc-map__bar">
            <span class="oc-map__title">{{ cur?.title }}</span>
            <a v-if="cur" class="oc-map__ext" :href="cur.url" target="_blank" rel="noopener">Открыть в новой вкладке ↗</a>
            <button ref="closeBtn" class="oc-map__close" type="button" aria-label="Закрыть окно" @click="close">✕</button>
          </header>
          <div class="oc-map__body">
            <template v-for="(f, kind) in frames" :key="kind">
              <div v-if="mounted[kind] && !ready[kind]" v-show="openFrame === kind" class="oc-map__loading">
                <span class="oc-store__spinner" aria-hidden="true" />
                <p>Загружаем…</p>
              </div>
              <iframe
                v-if="mounted[kind]"
                v-show="openFrame === kind"
                class="oc-map__frame"
                :src="f.url"
                :title="f.label"
                :allow="kind === 'store' ? 'payment; clipboard-write' : 'fullscreen'"
                @load="ready[kind] = true"
              />
            </template>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
