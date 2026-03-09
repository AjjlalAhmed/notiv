import { ref, onUnmounted, type Ref } from 'vue'

// Snappy spring: ωₙ≈20, ζ≈0.875 → settles in ~250ms
const STIFFNESS = 400
const DAMPING = 35
const MASS = 1
const SUB_STEP = 1 / 120  // integration sub-step for accuracy
const MAX_DELTA = 0.064   // cap elapsed time at ~4 frames to handle tab switches
const PRECISION = 0.5     // px / px·s⁻¹ — settle threshold

export interface SpringValue {
  value: Ref<number>
  set(target: number, immediate?: boolean): void
}

/**
 * A reactive spring-animated value driven by requestAnimationFrame.
 * Uses actual elapsed time with fixed sub-stepping so the simulation
 * runs at real speed regardless of display refresh rate.
 */
export function useSpring(initial: number): SpringValue {
  const value = ref(initial)
  let current = initial
  let velocity = 0
  let target = initial
  let raf: number | undefined
  let lastTimestamp = 0

  function tick(timestamp: number) {
    const elapsed = lastTimestamp
      ? Math.min((timestamp - lastTimestamp) / 1000, MAX_DELTA)
      : SUB_STEP
    lastTimestamp = timestamp

    // Sub-step Euler integration — consume full elapsed time
    let remaining = elapsed
    while (remaining > 0) {
      const dt = Math.min(remaining, SUB_STEP)
      const dx = current - target
      const force = -STIFFNESS * dx - DAMPING * velocity
      velocity += (force / MASS) * dt
      current += velocity * dt
      remaining -= dt
    }

    value.value = current

    const dx = current - target
    if (Math.abs(dx) < PRECISION && Math.abs(velocity) < PRECISION) {
      current = target
      velocity = 0
      value.value = target
      raf = undefined
      lastTimestamp = 0
      return
    }
    raf = requestAnimationFrame(tick)
  }

  function set(newTarget: number, immediate = false) {
    target = newTarget
    if (immediate) {
      if (raf !== undefined) { cancelAnimationFrame(raf); raf = undefined }
      current = newTarget
      velocity = 0
      value.value = newTarget
      lastTimestamp = 0
      return
    }
    if (raf === undefined) {
      lastTimestamp = 0
      raf = requestAnimationFrame(tick)
    }
  }

  onUnmounted(() => {
    if (raf !== undefined) cancelAnimationFrame(raf)
  })

  return { value, set }
}
