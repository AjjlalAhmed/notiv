<script setup lang="ts">
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  watch,
  watchPostEffect,
} from 'vue'
import { useSpring } from '../composables/useSpring'
import {
  BLUR_RATIO,
  DEFAULT_ROUNDNESS,
  DEFAULT_TOAST_DURATION,
  HEADER_EXIT_MS,
  HEIGHT,
  MIN_EXPAND_RATIO,
  PILL_PADDING,
  SWAP_COLLAPSE_MS,
  WIDTH,
} from '../constants'
import { removeToast } from '../store'
import type { NotivItem, NotivOptions, NotivState } from '../types'
import IconCheck from './icons/IconCheck.vue'
import IconX from './icons/IconX.vue'
import IconCircleAlert from './icons/IconCircleAlert.vue'
import IconLoaderCircle from './icons/IconLoaderCircle.vue'
import IconLifeBuoy from './icons/IconLifeBuoy.vue'
import IconArrowRight from './icons/IconArrowRight.vue'

const props = defineProps<{
  toast: NotivItem
  pillAlign: 'left' | 'center' | 'right'
  expand: 'top' | 'bottom'
  canExpand: boolean
  defaultFill?: string
}>()

const emit = defineEmits<{
  mouseenter: []
  mouseleave: []
}>()

/* ----------------------------- Derived state ------------------------------ */

const state = computed<NotivState>(() => props.toast.state ?? props.toast.type ?? 'info')
const fill = computed(() => props.toast.fill ?? props.defaultFill ?? '#1a1a1a')
const roundness = computed(() => Math.max(0, props.toast.roundness ?? DEFAULT_ROUNDNESS))
const blur = computed(() => roundness.value * BLUR_RATIO)
const filterId = computed(() => `notiv-goo-${props.toast.id}`)
const hasDesc = computed(() => Boolean(props.toast.description) || Boolean(props.toast.button))
const isLoading = computed(() => state.value === 'loading')
const duration = computed(() =>
  props.toast.duration !== undefined ? props.toast.duration : DEFAULT_TOAST_DURATION,
)

/* ----------------------------- Ready state -------------------------------- */

const ready = ref(false)
onMounted(() => {
  requestAnimationFrame(() => { ready.value = true })
})

/* ----------------------------- Expanded state ----------------------------- */

const isExpanded = ref(false)
const open = computed(() => hasDesc.value && isExpanded.value && !isLoading.value)

/* ----------------------------- Header layers ------------------------------ */

interface HeaderView {
  key: string
  state: NotivState
  title: string
  icon: NotivItem['icon']
  styles: NotivOptions['styles']
}

const headerKey = computed(() => `${state.value}-${props.toast.title ?? ''}`)

const currentLayer = ref<HeaderView>({
  key: headerKey.value,
  state: state.value,
  title: props.toast.title ?? state.value,
  icon: props.toast.icon,
  styles: props.toast.styles,
})

const prevLayer = ref<HeaderView | null>(null)
let headerExitTimer: ReturnType<typeof setTimeout> | null = null

watch(headerKey, () => {
  prevLayer.value = { ...currentLayer.value }
  currentLayer.value = {
    key: headerKey.value,
    state: state.value,
    title: props.toast.title ?? state.value,
    icon: props.toast.icon,
    styles: props.toast.styles,
  }
  if (headerExitTimer) clearTimeout(headerExitTimer)
  headerExitTimer = setTimeout(() => {
    prevLayer.value = null
    headerExitTimer = null
  }, HEADER_EXIT_MS)
})

/* ----------------------------- Pill measurement --------------------------- */

const innerRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const pillWidth = ref(0)

let ro: ResizeObserver | null = null
let headerPad: number | null = null
let rafId = 0

function measurePill() {
  const el = innerRef.value
  const header = headerRef.value
  if (!el || !header) return
  if (headerPad === null) {
    const cs = getComputedStyle(header)
    headerPad = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight)
  }
  const w = el.scrollWidth + (headerPad ?? 0) + PILL_PADDING
  if (w > PILL_PADDING) pillWidth.value = w
}

watchPostEffect(() => {
  void currentLayer.value.key
  nextTick(measurePill)
})

onMounted(() => {
  measurePill()
  if (innerRef.value) {
    ro = new ResizeObserver(() => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(measurePill)
    })
    ro.observe(innerRef.value)
  }
})

onUnmounted(() => {
  cancelAnimationFrame(rafId)
  ro?.disconnect()
  if (headerExitTimer) clearTimeout(headerExitTimer)
})

/* ----------------------------- Content height ----------------------------- */

const contentRef = ref<HTMLElement | null>(null)
const contentHeight = ref(0)

let contentRo: ResizeObserver | null = null
let contentRaf = 0

function measureContent() {
  const el = contentRef.value
  if (!el) return
  contentHeight.value = el.scrollHeight
}

watch(hasDesc, async (has) => {
  if (!has) { contentHeight.value = 0; return }
  await nextTick()
  measureContent()
  if (contentRef.value && !contentRo) {
    contentRo = new ResizeObserver(() => {
      cancelAnimationFrame(contentRaf)
      contentRaf = requestAnimationFrame(measureContent)
    })
    contentRo.observe(contentRef.value)
  }
}, { immediate: true })

onUnmounted(() => {
  cancelAnimationFrame(contentRaf)
  contentRo?.disconnect()
})

/* ----------------------------- Spring animations -------------------------- */

const minExpanded = HEIGHT * MIN_EXPAND_RATIO

const resolvedPillWidth = computed(() => Math.max(pillWidth.value || HEIGHT, HEIGHT))
const pillHeight = computed(() => HEIGHT + blur.value * 3)
const expandedHeight = computed(() => Math.max(minExpanded, HEIGHT + contentHeight.value))
const expandedContent = computed(() => Math.max(0, expandedHeight.value - HEIGHT))

const frozenExpanded = ref(minExpanded)
watch(open, (isOpen) => { if (isOpen) frozenExpanded.value = expandedHeight.value })

const targetPillX = computed(() => {
  const pw = resolvedPillWidth.value
  if (props.pillAlign === 'right') return WIDTH - pw
  if (props.pillAlign === 'center') return (WIDTH - pw) / 2
  return 0
})

const targetPillWidth = computed(() => resolvedPillWidth.value)
const targetPillHeight = computed(() => open.value ? pillHeight.value : HEIGHT)
const targetBodyHeight = computed(() => open.value ? expandedContent.value : 0)
const targetBodyOpacity = computed(() => open.value ? 1 : 0)
const targetToastHeight = computed(() => {
  if (props.toast._removing) return 0
  return open.value ? expandedHeight.value : HEIGHT
})

const pillX = useSpring(targetPillX.value)
const pillW = useSpring(targetPillWidth.value)
const pillH = useSpring(HEIGHT)
const bodyH = useSpring(0)
const bodyOp = useSpring(0)
const toastH = useSpring(HEIGHT)

// Snap pill position/width before ready — measurement happens in onMounted before
// the ready rAF fires, so !ready.value means "first render, skip the slide"
watch(targetPillX, (v) => pillX.set(v, !ready.value))
watch(targetPillWidth, (v) => pillW.set(v, !ready.value))
watch(targetPillHeight, (v) => pillH.set(v))
watch(targetBodyHeight, (v) => bodyH.set(v))
watch(targetBodyOpacity, (v) => bodyOp.set(v))
watch(targetToastHeight, (v) => toastH.set(v))

const svgHeight = computed(() =>
  hasDesc.value
    ? Math.max(open.value ? expandedHeight.value : frozenExpanded.value, minExpanded)
    : HEIGHT,
)

/* ----------------------------- CSS custom props --------------------------- */

const rootStyle = computed(() => ({
  '--_h': `${toastH.value.value}px`,
  '--_pw': `${resolvedPillWidth.value}px`,
  '--_px': `${pillX.value.value}px`,
  '--_ht': 'translateZ(0)',
  '--_co': `${open.value ? 1 : 0}`,
}))

/* ----------------------------- Autopilot --------------------------------- */

let autoExpandTimer: ReturnType<typeof setTimeout> | null = null
let autoCollapseTimer: ReturnType<typeof setTimeout> | null = null

function clearAutopilot() {
  if (autoExpandTimer) clearTimeout(autoExpandTimer)
  if (autoCollapseTimer) clearTimeout(autoCollapseTimer)
  autoExpandTimer = autoCollapseTimer = null
}

watch(
  [() => props.toast.instanceId, () => props.toast.autoExpandDelayMs, () => props.toast.autoCollapseDelayMs, () => props.canExpand, () => props.toast._removing],
  () => {
    clearAutopilot()
    if (!hasDesc.value || isLoading.value || !props.canExpand || props.toast._removing) {
      isExpanded.value = false
      return
    }
    const { autoExpandDelayMs: ed, autoCollapseDelayMs: cd } = props.toast
    if (ed == null && cd == null) return

    if (ed != null && ed > 0) {
      autoExpandTimer = setTimeout(() => { isExpanded.value = true }, ed)
    } else if (ed === 0) {
      isExpanded.value = true
    }
    if (cd != null && cd > 0) {
      autoCollapseTimer = setTimeout(() => { isExpanded.value = false }, cd)
    }
  },
  { immediate: true },
)

onUnmounted(clearAutopilot)

/* ----------------------------- Auto-dismiss ------------------------------ */

let dismissTimer: ReturnType<typeof setTimeout> | null = null

function startDismissTimer() {
  if (duration.value === null || duration.value <= 0) return
  dismissTimer = setTimeout(() => removeToast(props.toast.id), duration.value)
}

function clearDismissTimer() {
  if (dismissTimer) clearTimeout(dismissTimer)
  dismissTimer = null
}

onMounted(startDismissTimer)
onUnmounted(clearDismissTimer)

/* ----------------------------- Swap on update ----------------------------- */

let swapTimer: ReturnType<typeof setTimeout> | null = null

watch(() => props.toast.instanceId, () => {
  if (swapTimer) clearTimeout(swapTimer)
  if (open.value) {
    isExpanded.value = false
    swapTimer = setTimeout(() => { swapTimer = null }, SWAP_COLLAPSE_MS)
  }
})

/* ----------------------------- Hover handlers ---------------------------- */

function handleMouseEnter() {
  emit('mouseenter')
  clearDismissTimer()
  if (hasDesc.value && !isLoading.value) isExpanded.value = true
}

function handleMouseLeave() {
  emit('mouseleave')
  startDismissTimer()
  isExpanded.value = false
}

/* ----------------------------- Swipe to dismiss -------------------------- */

const SWIPE_DISMISS = 30
const SWIPE_MAX = 20

const buttonRef = ref<HTMLButtonElement | null>(null)
let pointerStart: number | null = null

function onPointerDown(e: PointerEvent) {
  if (props.toast._removing) return
  if ((e.target as HTMLElement).closest('[data-notiv-button]')) return
  pointerStart = e.clientY
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
}

function onPointerMove(e: PointerEvent) {
  if (pointerStart === null || !buttonRef.value) return
  const dy = e.clientY - pointerStart
  const sign = dy > 0 ? 1 : -1
  const clamped = Math.min(Math.abs(dy), SWIPE_MAX) * sign
  buttonRef.value.style.transform = `translateY(${clamped}px)`
}

function onPointerUp(e: PointerEvent) {
  if (pointerStart === null || !buttonRef.value) return
  const dy = e.clientY - pointerStart
  pointerStart = null
  buttonRef.value.style.transform = ''
  if (Math.abs(dy) > SWIPE_DISMISS) removeToast(props.toast.id)
}

/* ----------------------------- Icon map ---------------------------------- */

const STATE_ICONS: Record<NotivState, unknown> = {
  success: IconCheck,
  error: IconX,
  warning: IconCircleAlert,
  loading: IconLoaderCircle,
  info: IconLifeBuoy,
  action: IconArrowRight,
}

function handleButtonClick(e: MouseEvent) {
  e.preventDefault()
  e.stopPropagation()
  props.toast.button?.onClick()
}
</script>

<template>
  <button
    ref="buttonRef"
    type="button"
    data-notiv-toast
    :data-ready="ready"
    :data-expanded="open"
    :data-exiting="toast._removing || undefined"
    :data-edge="expand"
    :data-position="pillAlign"
    :data-state="state"
    :style="rootStyle as any"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
  >
    <!-- SVG Canvas -->
    <div data-notiv-canvas :data-edge="expand" :style="{ filter: `url(#${filterId})` }">
      <svg
        data-notiv-svg
        :width="WIDTH"
        :height="svgHeight"
        :viewBox="`0 0 ${WIDTH} ${svgHeight}`"
        aria-hidden="true"
        style="overflow: visible;"
      >
        <defs>
          <filter
            :id="filterId"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
            color-interpolation-filters="sRGB"
          >
            <feGaussianBlur in="SourceGraphic" :stdDeviation="blur" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>

        <!-- Pill rect — spring animated -->
        <rect
          data-notiv-pill
          :x="pillX.value.value"
          :width="pillW.value.value"
          :height="pillH.value.value"
          :rx="roundness"
          :ry="roundness"
          :fill="fill"
        />

        <!-- Body rect — full width so the expanded card is always readable -->
        <rect
          v-if="hasDesc"
          data-notiv-body
          :x="0"
          :y="HEIGHT"
          :width="WIDTH"
          :height="bodyH.value.value"
          :rx="roundness"
          :ry="roundness"
          :fill="fill"
          :opacity="bodyOp.value.value"
        />
      </svg>
    </div>

    <!-- Header: icon + title with cross-fade -->
    <div ref="headerRef" data-notiv-header :data-edge="expand">
      <div data-notiv-header-stack>
        <!-- Current layer — data-transitioning only set when replacing a previous layer -->
        <div
          ref="innerRef"
          :key="currentLayer.key"
          data-notiv-header-inner
          data-layer="current"
          :data-transitioning="prevLayer ? true : undefined"
        >
          <div
            data-notiv-badge
            :data-state="currentLayer.state"
            :class="currentLayer.styles?.badge"
          >
            <component :is="toast.icon ?? STATE_ICONS[currentLayer.state]" />
          </div>
          <span
            data-notiv-title
            :data-state="currentLayer.state"
            :class="currentLayer.styles?.title"
          >
            {{ currentLayer.title }}
          </span>
        </div>

        <!-- Previous layer (exits with blur) -->
        <div
          v-if="prevLayer"
          :key="prevLayer.key"
          data-notiv-header-inner
          data-layer="prev"
          data-exiting="true"
        >
          <div
            data-notiv-badge
            :data-state="prevLayer.state"
            :class="prevLayer.styles?.badge"
          >
            <component :is="toast.icon ?? STATE_ICONS[prevLayer.state]" />
          </div>
          <span
            data-notiv-title
            :data-state="prevLayer.state"
            :class="prevLayer.styles?.title"
          >
            {{ prevLayer.title }}
          </span>
        </div>
      </div>
    </div>

    <!-- Expanded content -->
    <div
      v-if="hasDesc"
      data-notiv-content
      :data-edge="expand"
      :data-visible="open || undefined"
    >
      <div
        ref="contentRef"
        data-notiv-description
        :class="toast.styles?.description"
      >
        {{ toast.description }}
        <a
          v-if="toast.button"
          href="#"
          data-notiv-button
          :data-state="state"
          :class="toast.styles?.button"
          @click="handleButtonClick"
        >
          {{ toast.button.title }}
        </a>
      </div>
    </div>
  </button>
</template>
