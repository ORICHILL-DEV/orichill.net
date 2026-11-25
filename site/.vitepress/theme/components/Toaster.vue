<script setup lang="ts">
import { onBeforeUnmount, reactive } from 'vue'
import { dismiss, toasts, type Toast } from '../lib/toast'

// Таймер у каждого уведомления свой и замирает, пока на него наведена мышь.
const timers = reactive(new Map<number, { left: number; start: number; h?: number }>())

function arm(t: Toast) {
  let s = timers.get(t.id)
  if (!s) timers.set(t.id, (s = { left: t.duration, start: 0 }))
  s.start = performance.now()
  s.h = window.setTimeout(() => dismiss(t.id), s.left)
}
function pause(t: Toast) {
  const s = timers.get(t.id)
  if (!s?.h) return
  clearTimeout(s.h)
  s.h = undefined
  s.left -= performance.now() - s.start
}
function onEnter(el: Element) {
  const id = Number((el as HTMLElement).dataset.id)
  const t = toasts.find((x) => x.id === id)
  if (t) arm(t)
}
function onLeave(el: Element) {
  const id = Number((el as HTMLElement).dataset.id)
  const s = timers.get(id)
  if (s?.h) clearTimeout(s.h)
  timers.delete(id)
}
onBeforeUnmount(() => timers.forEach((s) => s.h && clearTimeout(s.h)))
</script>

<template>
  <div class="oc-toasts" aria-live="polite" aria-atomic="false">
    <TransitionGroup name="oc-toast" tag="ul" class="oc-toasts__list" @after-enter="onEnter" @leave="onLeave">
      <li
        v-for="t in [...toasts].reverse()"
        :key="t.id"
        :data-id="t.id"
        :class="['oc-toast', `oc-toast--${t.kind}`]"
        :style="{ '--oc-toast-life': t.duration + 'ms' }"
        role="status"
        @mouseenter="pause(t)"
        @mouseleave="arm(t)"
        @focusin="pause(t)"
        @focusout="arm(t)"
      >
        <span class="oc-toast__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <circle class="oc-toast__ring" cx="12" cy="12" r="10" />
            <path v-if="t.kind === 'success'" class="oc-toast__mark" d="M7.5 12.4l3 3 6-6.6" />
            <path v-else-if="t.kind === 'error'" class="oc-toast__mark" d="M12 7.2v6M12 16.6v.1" />
            <path v-else class="oc-toast__mark" d="M12 10.8v5.6M12 7.4v.1" />
          </svg>
        </span>
        <span class="oc-toast__body">
          <strong class="oc-toast__title">{{ t.title }}</strong>
          <span v-if="t.text" class="oc-toast__text">{{ t.text }}</span>
        </span>
        <button class="oc-toast__close" type="button" aria-label="Закрыть уведомление" @click="dismiss(t.id)">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17" /></svg>
        </button>
        <span class="oc-toast__life" aria-hidden="true" />
      </li>
    </TransitionGroup>
  </div>
</template>
