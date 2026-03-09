# notiv

Physics-based toast notification library for Vue 3 and Nuxt 3, with smooth SVG morphing pill animations.

**[Documentation & Playground →](https://ajjlalahmed.github.io/notiv/)**

## Installation

```bash
npm install notiv
```

## Vue 3 Setup

Register the plugin and add the `<NotivToaster>` component once in your app root:

```ts
// main.ts
import { createApp } from 'vue'
import { NotivPlugin } from 'notiv'
import 'notiv/style.css'
import App from './App.vue'

createApp(App).use(NotivPlugin).mount('#app')
```

```vue
<!-- App.vue -->
<script setup>
import { NotivToaster } from 'notiv'
</script>

<template>
  <NotivToaster position="top-right" theme="system" />
  <RouterView />
</template>
```

## Nuxt 3 Setup

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['notiv/nuxt'],
})
```

`NotivToaster`, `useNotiv()`, and `notiv` are all auto-imported. Add the toaster anywhere in your layout:

```vue
<!-- layouts/default.vue -->
<template>
  <NotivToaster position="top-right" theme="system" />
  <slot />
</template>
```

## Usage

```ts
import { notiv } from 'notiv'

notiv.success({ title: 'Saved!', description: 'Your changes have been saved.' })
notiv.error({ title: 'Error', description: 'Something went wrong.' })
notiv.warning({ title: 'Warning', description: 'Check your input.' })
notiv.info({ title: 'Info', description: 'Update available.' })
notiv.loading({ title: 'Uploading...' })
notiv.action({ title: 'File deleted', button: { title: 'Undo', onClick: () => restoreFile() } })
```

### Promise toasts

Show a loading toast that automatically transitions to success or error:

```ts
notiv.promise(fetchData(), {
  loading: { title: 'Loading...' },
  success: { title: 'Done!', description: 'Data loaded.' },
  error: { title: 'Failed', description: 'Could not load data.' },
})

// success/error can also be functions that receive the resolved value / error
notiv.promise(saveUser(data), {
  loading: { title: 'Saving...' },
  success: (user) => ({ title: `Welcome, ${user.name}!` }),
  error: (err) => ({ title: 'Save failed', description: err.message }),
})
```

### Composable

```vue
<script setup>
import { useNotiv } from 'notiv'

const { notiv, toasts } = useNotiv()

function save() {
  notiv.success({ title: 'Saved!' })
}
</script>
```

### Dismiss & clear

```ts
const id = notiv.loading({ title: 'Processing...' })

// dismiss a specific toast
notiv.dismiss(id)

// clear all toasts (optionally by position)
notiv.clear()
notiv.clear('top-right')
```

## NotivToaster Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `position` | `NotivPosition` | `'top-right'` | Default position for all toasts |
| `theme` | `'light' \| 'dark' \| 'system'` | `'system'` | Color theme |
| `offset` | `number \| string \| object` | — | Viewport offset (px or CSS value) |
| `options` | `NotivOptions` | — | Default options applied to all toasts |

### Positions

`top-left` · `top-center` · `top-right` · `bottom-left` · `bottom-center` · `bottom-right`

## Toast Options

| Option | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | — | Toast title |
| `description` | `string` | — | Secondary text |
| `type` | `NotivState` | — | Toast state (`success`, `error`, `warning`, `info`, `action`, `loading`) |
| `position` | `NotivPosition` | toaster default | Override position per toast |
| `duration` | `number \| null` | `6000` | Duration in ms. `null` = persist forever |
| `icon` | `Component \| VNode \| null` | — | Custom icon component |
| `fill` | `string` | — | Custom badge fill color |
| `roundness` | `number` | `16` | Badge corner radius (px) |
| `autopilot` | `boolean \| { expand?, collapse? }` | `true` | Auto expand/collapse behavior |
| `button` | `{ title: string, onClick: () => void }` | — | Action button |
| `styles` | `NotivStyles` | — | CSS class overrides for inner elements |
| `id` | `string` | auto | Custom toast ID |

## Nuxt-only: `$notiv`

```ts
const { $notiv } = useNuxtApp()
$notiv.success({ title: 'Hello from server context!' })
```

## License

MIT
