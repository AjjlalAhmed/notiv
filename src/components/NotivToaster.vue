<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { store } from '../store'
import { NOTIV_POSITIONS } from '../types'
import type { NotivItem, NotivOffsetConfig, NotivOffsetValue, NotivPosition, NotivToasterProps } from '../types'
import NotivToast from './NotivToast.vue'

const props = withDefaults(defineProps<NotivToasterProps>(), {
  position: 'top-right',
  theme: 'system',
})

/* ----------------------------- Theme resolution --------------------------- */

const THEME_FILLS = {
  light: '#1a1a1a',
  dark: '#f2f2f2',
} as const

const resolvedTheme = ref<'light' | 'dark'>('light')

function detectTheme(): 'light' | 'dark' {
  if (props.theme === 'light' || props.theme === 'dark') return props.theme
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

let mq: MediaQueryList | null = null

onMounted(() => {
  resolvedTheme.value = detectTheme()
  if (props.theme === 'system') {
    mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      resolvedTheme.value = e.matches ? 'dark' : 'light'
    }
    mq.addEventListener('change', handler)
    onUnmounted(() => mq?.removeEventListener('change', handler))
  }
})

watch(() => props.theme, () => {
  resolvedTheme.value = detectTheme()
})

const themeFill = computed(() =>
  props.theme ? THEME_FILLS[resolvedTheme.value] : undefined,
)

/* ----------------------------- Position helpers --------------------------- */

function pillAlignFor(pos: NotivPosition): 'left' | 'center' | 'right' {
  if (pos.includes('right')) return 'right'
  if (pos.includes('center')) return 'center'
  return 'left'
}

function expandDirFor(pos: NotivPosition): 'top' | 'bottom' {
  return pos.startsWith('top') ? 'bottom' : 'top'
}

function toastsAt(pos: NotivPosition): NotivItem[] {
  return store.toasts.filter(t => (t.position ?? props.position) === pos)
}

/* ----------------------------- Offset styles ------------------------------ */

function viewportStyle(pos: NotivPosition): Record<string, string> {
  if (props.offset === undefined) return {}
  const px = (v: NotivOffsetValue) => (typeof v === 'number' ? `${v}px` : v)
  const o: NotivOffsetConfig =
    typeof props.offset === 'object'
      ? (props.offset as NotivOffsetConfig)
      : { top: props.offset, right: props.offset, bottom: props.offset, left: props.offset }

  const s: Record<string, string> = {}
  if (pos.startsWith('top') && o.top != null) s.top = px(o.top)
  if (pos.startsWith('bottom') && o.bottom != null) s.bottom = px(o.bottom)
  if (pos.endsWith('left') && o.left != null) s.left = px(o.left)
  if (pos.endsWith('right') && o.right != null) s.right = px(o.right)
  return s
}

/* ----------------------------- Hover tracking ----------------------------- */

const hoveredId = ref<string | undefined>(undefined)

const latestActiveId = computed(() => {
  for (let i = store.toasts.length - 1; i >= 0; i--) {
    if (!store.toasts[i]._removing) return store.toasts[i].id
  }
  return undefined
})

const activeId = computed(() => hoveredId.value ?? latestActiveId.value)

function onToastMouseEnter(id: string) {
  hoveredId.value = id
}

function onToastMouseLeave() {
  hoveredId.value = latestActiveId.value
}
</script>

<template>
  <Teleport to="body">
    <template v-for="pos in NOTIV_POSITIONS" :key="pos">
      <section
        v-if="toastsAt(pos).length > 0"
        data-notiv-viewport
        :data-position="pos"
        :data-theme="theme ? resolvedTheme : undefined"
        aria-live="polite"
        aria-atomic="false"
        :style="viewportStyle(pos)"
      >
        <NotivToast
          v-for="toast in toastsAt(pos)"
          :key="toast.id"
          :toast="toast"
          :pill-align="pillAlignFor(pos)"
          :expand="expandDirFor(pos)"
          :can-expand="activeId === undefined || activeId === toast.id"
          :default-fill="toast.fill ?? themeFill"
          @mouseenter="onToastMouseEnter(toast.id)"
          @mouseleave="onToastMouseLeave"
        />
      </section>
    </template>
  </Teleport>
</template>
