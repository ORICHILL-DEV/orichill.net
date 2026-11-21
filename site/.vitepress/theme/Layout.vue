<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useRoute, useRouter } from 'vitepress'
import { nextTick, onMounted, watch } from 'vue'
import mediumZoom, { type Zoom } from 'medium-zoom'
import FrameModal from './components/FrameModal.vue'
import Toaster from './components/Toaster.vue'
import { markCopyable } from './toast'
import { isStorePath, openStore } from './frames'
import { bindReveal, revealPage } from './motion'

const route = useRoute()
const router = useRouter()

// Переход на /store из меню и ссылок открывает магазин окном поверх текущей страницы.
// Прямой заход по адресу www.orichill.net/store показывает магазин встроенным в страницу.
router.onBeforeRouteChange = (to) => {
  if (isStorePath(to) && !isStorePath(location.href)) {
    openStore()
    return false
  }
}
let zoom: Zoom | undefined

function bindZoom() {
  zoom ??= mediumZoom({ margin: 24, background: 'rgba(10, 6, 22, 0.86)' })
  zoom.detach()
  zoom.attach('.vp-doc img:not(.no-zoom)')
}

onMounted(() => {
  bindZoom()
  bindReveal()
  markCopyable()
})
watch(
  () => route.path,
  async () => {
    await nextTick()
    revealPage()
    bindZoom()
    bindReveal()
    markCopyable()
  },
)
</script>

<template>
  <DefaultTheme.Layout />
  <FrameModal />
  <Toaster />
</template>
