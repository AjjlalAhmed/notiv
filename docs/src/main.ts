import { ViteSSG } from 'vite-ssg'
import App from './App.vue'

// For a single-page docs site, render App at the root path.
// vite-ssg will pre-render the HTML at build time and hydrate on the client.
export const createApp = ViteSSG(
  App,
  { routes: [{ path: '/', component: App }] },
)
