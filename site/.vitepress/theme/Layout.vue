<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useRoute } from 'vitepress'
import { nextTick, onMounted, watch } from 'vue'
import mediumZoom, { type Zoom } from 'medium-zoom'
import MapModal from './components/MapModal.vue'
import { bindReveal, revealPage } from './motion'

const route = useRoute()
let zoom: Zoom | undefined

function bindZoom() {
  zoom ??= mediumZoom({ margin: 24, background: 'rgba(10, 6, 22, 0.86)' })
  zoom.detach()
  zoom.attach('.vp-doc img:not(.no-zoom)')
}

onMounted(() => {
  bindZoom()
  bindReveal()
})
watch(
  () => route.path,
  async () => {
    await nextTick()
    revealPage()
    bindZoom()
    bindReveal()
  },
)
</script>

<template>
  <DefaultTheme.Layout />
  <MapModal />
</template>
