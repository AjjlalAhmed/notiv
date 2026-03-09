<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue'
import { notiv, NotivToaster } from 'notiv'
import type { NotivOptions, NotivPosition } from 'notiv'

const POSITIONS: NotivPosition[] = [
  'top-left', 'top-center', 'top-right',
  'bottom-left', 'bottom-center', 'bottom-right',
]

const TOAST_TYPES = [
  { key: 'success', label: 'Success', color: 'oklch(0.723 0.219 142.136)' },
  { key: 'error',   label: 'Error',   color: 'oklch(0.637 0.237 25.331)'  },
  { key: 'warning', label: 'Warning', color: 'oklch(0.795 0.184 86.047)'  },
  { key: 'info',    label: 'Info',    color: 'oklch(0.685 0.169 237.323)' },
  { key: 'action',  label: 'Action',  color: 'oklch(0.623 0.214 259.815)' },
  { key: 'loading', label: 'Loading', color: 'oklch(0.556 0 0)'           },
  { key: 'promise', label: 'Promise', color: 'oklch(0.6 0 0)'             },
]

/* ── Global Toaster settings ─────────────────────────────────────────── */

const toasterPosition = ref<NotivPosition>('top-right')
const theme = ref<'light' | 'dark' | 'system'>('system')

/* ── Playground config ──────────────────────────────────────────────── */

const cfg = reactive({
  type: 'success',
  title: 'Saved!',
  description: 'Your changes have been saved.',
  position: 'top-right' as NotivPosition,
  duration: 6000 as number | null,
  fill: '',
  roundness: 16,
  autopilot: true,
  showButton: false,
})

const durationPresets = [
  { label: '2s',  value: 2000  },
  { label: '4s',  value: 4000  },
  { label: '6s',  value: 6000  },
  { label: '10s', value: 10000 },
  { label: '∞',   value: null  },
]

/* ── Live code generation ────────────────────────────────────────────── */

function escStr(s: string) { return s.replace(/'/g, "\\'") }

const generatedCode = computed(() => {
  if (cfg.type === 'promise') {
    const pos = cfg.position !== toasterPosition.value ? `\n  position: '${cfg.position}',` : ''
    return `notiv.promise(fetchData(), {
  loading: { title: 'Loading...' },
  success: {
    title: '${escStr(cfg.title || 'Done!')}',${cfg.description ? `\n    description: '${escStr(cfg.description)}',` : ''}
  },
  error: { title: 'Failed' },${pos}
})`
  }

  const lines: string[] = []
  lines.push(`  title: '${escStr(cfg.title || 'Toast')}',`)
  if (cfg.description) lines.push(`  description: '${escStr(cfg.description)}',`)
  if (cfg.position !== toasterPosition.value) lines.push(`  position: '${cfg.position}',`)
  if (cfg.duration !== 6000) lines.push(`  duration: ${cfg.duration === null ? 'null' : cfg.duration},`)
  if (cfg.fill) lines.push(`  fill: '${cfg.fill}',`)
  if (cfg.roundness !== 16) lines.push(`  roundness: ${cfg.roundness},`)
  if (!cfg.autopilot) lines.push(`  autopilot: false,`)
  if (cfg.showButton) lines.push(`  button: { title: 'View', onClick: () => {} },`)

  return `notiv.${cfg.type}({\n${lines.join('\n')}\n})`
})

/* ── Fire ────────────────────────────────────────────────────────────── */

function fire() {
  const opts: NotivOptions = {
    title: cfg.title || 'Toast',
    position: cfg.position,
  }
  if (cfg.description) opts.description = cfg.description
  if (cfg.duration !== 6000) opts.duration = cfg.duration
  if (cfg.fill) opts.fill = cfg.fill
  if (cfg.roundness !== 16) opts.roundness = cfg.roundness
  if (!cfg.autopilot) opts.autopilot = false
  if (cfg.showButton) opts.button = { title: 'View', onClick: () => notiv.clear() }

  if (cfg.type === 'promise') {
    notiv.promise(
      new Promise<void>(res => setTimeout(res, 2000)),
      {
        loading: { title: cfg.title || 'Loading...', position: cfg.position },
        success: { title: cfg.title || 'Done!', description: cfg.description || undefined },
        error: { title: 'Failed' },
        position: cfg.position,
      },
    )
  } else if (cfg.type === 'loading') {
    const id = notiv.loading(opts)
    const delay = typeof cfg.duration === 'number' ? cfg.duration : 3000
    setTimeout(() => notiv.dismiss(id), delay)
  } else {
    (notiv as Record<string, (o: NotivOptions) => void>)[cfg.type](opts)
  }
}

/* ── Page theme ─────────────────────────────────────────────────────── */

const DARK_VARS: Record<string, string> = {
  '--page-bg': '#0a0a0a',
  '--page-fg': '#e8e8e8',
  '--page-muted': '#666',
  '--page-border': '#1c1c1c',
  '--page-border-strong': '#282828',
  '--page-surface': '#111',
  '--page-surface2': '#161616',
  '--page-code-bg': '#0e0e0e',
  '--page-title': '#f2f2f2',
  '--page-input-bg': '#111',
}
const LIGHT_VARS: Record<string, string> = {
  '--page-bg': '#ffffff',
  '--page-fg': '#111111',
  '--page-muted': '#888',
  '--page-border': '#e4e4e4',
  '--page-border-strong': '#d0d0d0',
  '--page-surface': '#f5f5f5',
  '--page-surface2': '#efefef',
  '--page-code-bg': '#f7f7f7',
  '--page-title': '#0a0a0a',
  '--page-input-bg': '#fafafa',
}

function detectTheme(): 'light' | 'dark' {
  if (theme.value === 'light' || theme.value === 'dark') return theme.value
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyPageTheme(t: 'light' | 'dark') {
  if (typeof document === 'undefined') return
  const vars = t === 'light' ? LIGHT_VARS : DARK_VARS
  for (const [k, v] of Object.entries(vars))
    document.documentElement.style.setProperty(k, v)
}

let mq: MediaQueryList | null = null
onMounted(() => {
  applyPageTheme(detectTheme())
  mq = window.matchMedia('(prefers-color-scheme: dark)')
  const handler = () => {
    if (theme.value === 'system') applyPageTheme(detectTheme())
  }
  mq.addEventListener('change', handler)
  onUnmounted(() => mq?.removeEventListener('change', handler))
})
watch(theme, () => applyPageTheme(detectTheme()))

/* ── Quick start ─────────────────────────────────────────────────────── */

const pkgManager = ref<'npm' | 'pnpm' | 'yarn'>('npm')
const installCmds = { npm: 'npm install notiv', pnpm: 'pnpm add notiv', yarn: 'yarn add notiv' }
</script>

<template>
  <NotivToaster :theme="theme" :position="toasterPosition" />

  <div class="page">

    <!-- Nav -->
    <nav class="nav">
      <span class="logo">notiv</span>
      <div class="nav-right">
        <a href="https://www.npmjs.com/package/notiv" target="_blank" class="nav-link">npm</a>
        <a href="https://github.com/ajjlalahmed/notiv" target="_blank" class="nav-link">GitHub →</a>
      </div>
    </nav>

    <!-- Hero -->
    <section class="hero">
      <div class="hero-badge">Vue 3 &amp; Nuxt 3</div>
      <h1 class="title">Physics-based<br>toast notifications</h1>
      <p class="subtitle">
        Silky-smooth pill animations driven by spring physics.<br>
        Zero runtime dependencies.
      </p>
      <div class="install-box">
        <span class="install-prefix">$</span>
        <code>{{ installCmds[pkgManager] }}</code>
      </div>
    </section>

    <!-- ═══ PLAYGROUND ═══════════════════════════════════════════════════ -->
    <section class="section">
      <h2 class="section-title">Playground</h2>
      <p class="section-desc">Configure every option and fire a live toast. The code snippet updates in real time.</p>

      <!-- Toaster-level controls -->
      <div class="toaster-row">
        <div class="control">
          <label class="control-label">Toaster position</label>
          <select v-model="toasterPosition" class="select">
            <option v-for="p in POSITIONS" :key="p" :value="p">{{ p }}</option>
          </select>
        </div>
        <div class="control">
          <label class="control-label">Toaster theme</label>
          <select v-model="theme" class="select">
            <option value="system">system</option>
            <option value="light">light</option>
            <option value="dark">dark</option>
          </select>
        </div>
      </div>

      <!-- Playground card -->
      <div class="pg-card">

        <!-- Controls panel -->
        <div class="pg-controls">

          <!-- Type -->
          <div class="pg-group">
            <label class="control-label">Type</label>
            <div class="type-grid">
              <button
                v-for="t in TOAST_TYPES"
                :key="t.key"
                class="type-btn"
                :class="{ active: cfg.type === t.key }"
                :style="{ '--acc': t.color }"
                @click="cfg.type = t.key"
              >{{ t.label }}</button>
            </div>
          </div>

          <!-- Title -->
          <div class="pg-group">
            <label class="control-label" for="pg-title">Title</label>
            <input id="pg-title" v-model="cfg.title" class="text-input" placeholder="Saved!" />
          </div>

          <!-- Description -->
          <div class="pg-group">
            <label class="control-label" for="pg-desc">
              Description <span class="optional">optional</span>
            </label>
            <input id="pg-desc" v-model="cfg.description" class="text-input" placeholder="Your changes have been saved." />
          </div>

          <!-- Row: Position + Duration -->
          <div class="pg-row">
            <div class="pg-group">
              <label class="control-label">Position</label>
              <select v-model="cfg.position" class="select select--full">
                <option v-for="p in POSITIONS" :key="p" :value="p">{{ p }}</option>
              </select>
            </div>
            <div class="pg-group">
              <label class="control-label">Duration</label>
              <div class="preset-row">
                <button
                  v-for="p in durationPresets"
                  :key="String(p.value)"
                  class="preset-btn"
                  :class="{ active: cfg.duration === p.value }"
                  @click="cfg.duration = p.value"
                >{{ p.label }}</button>
              </div>
            </div>
          </div>

          <!-- Row: Fill + Roundness -->
          <div class="pg-row">
            <div class="pg-group">
              <label class="control-label">Fill <span class="optional">optional</span></label>
              <div class="fill-row">
                <input
                  type="color"
                  class="color-swatch"
                  :value="cfg.fill || '#1a1a1a'"
                  @input="cfg.fill = ($event.target as HTMLInputElement).value"
                />
                <input
                  v-model="cfg.fill"
                  class="text-input text-input--mono"
                  placeholder="#1a1a1a"
                />
                <button v-if="cfg.fill" class="reset-btn" title="Reset" @click="cfg.fill = ''">✕</button>
              </div>
            </div>
            <div class="pg-group">
              <label class="control-label">
                Roundness <span class="value-badge">{{ cfg.roundness }}px</span>
              </label>
              <input
                type="range"
                v-model.number="cfg.roundness"
                min="0" max="40" step="1"
                class="range-input"
              />
            </div>
          </div>

          <!-- Toggles -->
          <div class="pg-toggles">
            <div class="pg-toggle-item">
              <span class="control-label">Autopilot expand / collapse</span>
              <button
                class="toggle"
                :class="{ on: cfg.autopilot }"
                role="switch"
                :aria-checked="cfg.autopilot"
                @click="cfg.autopilot = !cfg.autopilot"
              ><span class="toggle-thumb" /></button>
            </div>
            <div class="pg-toggle-item">
              <span class="control-label">Action button</span>
              <button
                class="toggle"
                :class="{ on: cfg.showButton }"
                role="switch"
                :aria-checked="cfg.showButton"
                @click="cfg.showButton = !cfg.showButton"
              ><span class="toggle-thumb" /></button>
            </div>
          </div>

        </div><!-- /pg-controls -->

        <!-- Preview panel -->
        <div class="pg-preview">
          <div class="code-preview code-preview--grow">
            <div class="code-header">
              <span class="code-lang">ts</span>
              <span class="code-type">{{ cfg.type }}</span>
            </div>
            <pre class="code-body code-body--flush"><code>{{ generatedCode }}</code></pre>
          </div>
          <button class="fire-btn" @click="fire">
            Fire toast
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </button>
        </div>

      </div><!-- /pg-card -->
    </section>

    <!-- Quick Start -->
    <section class="section">
      <h2 class="section-title">Quick Start</h2>

      <div class="pkg-tabs">
        <button
          v-for="pm in ['npm', 'pnpm', 'yarn'] as const"
          :key="pm"
          class="pkg-tab"
          :class="{ active: pkgManager === pm }"
          @click="pkgManager = pm"
        >{{ pm }}</button>
      </div>
      <pre class="code-body code-body--sm"><code>{{ installCmds[pkgManager] }}</code></pre>

      <pre class="code-body"><code><span class="c">// main.ts</span>
import { NotivPlugin } from 'notiv'
import 'notiv/style.css'

app.use(NotivPlugin)</code></pre>

      <pre class="code-body"><code><span class="c">&lt;!-- App.vue --&gt;</span>
&lt;template&gt;
  &lt;NotivToaster position="top-right" theme="system" /&gt;
&lt;/template&gt;</code></pre>

      <pre class="code-body"><code><span class="c">// anywhere in your app</span>
import { notiv } from 'notiv'

notiv.success({ title: 'Done!', description: 'It worked.' })
notiv.error({ title: 'Oops', description: 'Something failed.' })
notiv.promise(fetchData(), {
  loading: { title: 'Loading...' },
  success: { title: 'Done!' },
  error:   { title: 'Failed' },
})</code></pre>
    </section>

    <!-- Nuxt -->
    <section class="section">
      <h2 class="section-title">Nuxt 3</h2>
      <pre class="code-body"><code><span class="c">// nuxt.config.ts</span>
export default defineNuxtConfig({
  modules: ['notiv/nuxt'],
})</code></pre>
      <p class="section-desc" style="margin-top:0.75rem">
        <code class="ic">NotivToaster</code> and <code class="ic">useNotiv()</code> are auto-imported.
        Access <code class="ic">$notiv</code> via <code class="ic">useNuxtApp().$notiv</code>.
      </p>
    </section>

    <!-- API Methods -->
    <section class="section">
      <h2 class="section-title">API</h2>
      <p class="section-desc">All methods except <code class="ic">dismiss</code> and <code class="ic">clear</code> return the toast <code class="ic">id: string</code>.</p>
      <div class="tbl-wrap">
        <table class="tbl">
          <thead><tr><th>Method</th><th>Description</th></tr></thead>
          <tbody>
            <tr v-for="[m, d] in [
              ['notiv.show(opts)',      'Generic toast — use the type option to set state'],
              ['notiv.success(opts)',   'Success state'],
              ['notiv.error(opts)',     'Error state'],
              ['notiv.warning(opts)',   'Warning state'],
              ['notiv.info(opts)',      'Info state'],
              ['notiv.action(opts)',    'Action state — pair with a button option'],
              ['notiv.loading(opts)',   'Loading spinner, duration defaults to null (persistent)'],
              ['notiv.promise(p, opts)','Tracks a promise: loading → success / error'],
              ['notiv.dismiss(id)',     'Remove a specific toast by id'],
              ['notiv.clear(pos?)',     'Remove all toasts, or only those at a given position'],
            ]" :key="m">
              <td><code class="ic">{{ m }}</code></td>
              <td>{{ d }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- NotivOptions -->
    <section class="section">
      <h2 class="section-title">NotivOptions</h2>
      <p class="section-desc">Passed to every toast method. All fields are optional.</p>
      <div class="tbl-wrap">
        <table class="tbl">
          <thead><tr><th>Option</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
          <tbody>
            <tr v-for="[o, t, d, desc] in [
              ['id',          'string',                           'auto',          'Stable ID — reuse to update or dismiss'],
              ['title',       'string',                           '—',             'Primary text in the pill header'],
              ['description', 'string',                           '—',             'Secondary text shown when the pill expands'],
              ['type',        'NotivState',                       '—',             'Icon + color: success | error | warning | info | action | loading'],
              ['position',    'NotivPosition',                    'toaster default','Overrides the toaster position for this toast'],
              ['duration',    'number | null',                    '6000',          'Auto-dismiss ms. null = never auto-dismiss'],
              ['icon',        'Component | VNode | null',         '—',             'Custom icon component. null removes it'],
              ['fill',        'string',                           'theme fill',    'Pill fill color — any CSS color value'],
              ['roundness',   'number',                           '16',            'Pill corner radius in px'],
              ['autopilot',   'boolean | { expand?, collapse? }','true',          'Auto expand/collapse. false = disabled. Object = custom delays in ms'],
              ['button',      '{ title, onClick }',              '—',             'Action button rendered in the expanded body'],
              ['styles',      'NotivStyles',                      '—',             'CSS class overrides for sub-elements (see below)'],
            ]" :key="o">
              <td><code class="ic">{{ o }}</code></td>
              <td><code class="ic">{{ t }}</code></td>
              <td><code class="ic">{{ d }}</code></td>
              <td>{{ desc }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="sub-title">NotivStyles — per-element class overrides</h3>
      <div class="tbl-wrap" style="margin-top:0.5rem">
        <table class="tbl">
          <thead><tr><th>Key</th><th>Applies to</th></tr></thead>
          <tbody>
            <tr v-for="[k, t] in [
              ['title',       'data-notiv-title — pill header text'],
              ['description', 'data-notiv-description — expanded body text'],
              ['badge',       'data-notiv-badge — icon wrapper circle'],
              ['button',      'data-notiv-button — action button'],
            ]" :key="k">
              <td><code class="ic">{{ k }}</code></td>
              <td>{{ t }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <pre class="code-body"><code>notiv.success({
  title: 'Done',
  styles: {
    badge: 'ring-2 ring-green-400',
    title: 'font-semibold',
  },
})</code></pre>
    </section>

    <!-- NotivToaster Props -->
    <section class="section">
      <h2 class="section-title">NotivToaster Props</h2>
      <div class="tbl-wrap">
        <table class="tbl">
          <thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
          <tbody>
            <tr v-for="[p, t, d, desc] in [
              ['position', 'NotivPosition',                        '\'top-right\'', 'Default position for all toasts'],
              ['theme',    '\'light\' | \'dark\' | \'system\'',    '\'system\'',    'Pill fill color scheme. system follows OS preference'],
              ['offset',   'number | string | NotivOffsetConfig',  'undefined',     'Viewport edge inset. Number = px all sides, object = per-side'],
              ['options',  'NotivOptions',                         'undefined',     'Global defaults merged into every toast'],
            ]" :key="p">
              <td><code class="ic">{{ p }}</code></td>
              <td><code class="ic">{{ t }}</code></td>
              <td><code class="ic">{{ d }}</code></td>
              <td>{{ desc }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <pre class="code-body"><code>&lt;NotivToaster
  position="top-right"
  theme="system"
  :offset="{ top: '80px', right: '1rem' }"
  :options="{ duration: 4000, roundness: 24 }"
/&gt;</code></pre>
    </section>

    <!-- useNotiv -->
    <section class="section">
      <h2 class="section-title">useNotiv()</h2>
      <p class="section-desc">Composable exposing the API and a reactive list of active toasts.</p>
      <pre class="code-body"><code>import { useNotiv } from 'notiv'

const { notiv, toasts } = useNotiv()

<span class="c">// optionally filter by position:</span>
const { toasts } = useNotiv('top-right')

<span class="c">// toasts is a ComputedRef&lt;NotivItem[]&gt;</span>
console.log(toasts.value.length)</code></pre>
    </section>

    <!-- CSS Custom Properties -->
    <section class="section">
      <h2 class="section-title">CSS Custom Properties</h2>
      <p class="section-desc">Override on <code class="ic">:root</code> to customize layout and state colors globally.</p>
      <div class="tbl-wrap">
        <table class="tbl">
          <thead><tr><th>Property</th><th>Default</th><th>Description</th></tr></thead>
          <tbody>
            <tr v-for="[prop, def, desc] in [
              ['--notiv-width',         '350px',                      'Toast pill width'],
              ['--notiv-height',        '40px',                       'Collapsed pill height'],
              ['--notiv-duration',      '420ms',                      'Spring animation duration'],
              ['--notiv-state-success', 'oklch(0.723 0.219 142.136)', 'Success icon & text color'],
              ['--notiv-state-error',   'oklch(0.637 0.237 25.331)',  'Error icon & text color'],
              ['--notiv-state-warning', 'oklch(0.795 0.184 86.047)',  'Warning icon & text color'],
              ['--notiv-state-info',    'oklch(0.685 0.169 237.323)', 'Info icon & text color'],
              ['--notiv-state-action',  'oklch(0.623 0.214 259.815)', 'Action icon & text color'],
              ['--notiv-state-loading', 'oklch(0.556 0 0)',           'Loading icon & text color'],
            ]" :key="prop">
              <td><code class="ic">{{ prop }}</code></td>
              <td><code class="ic">{{ def }}</code></td>
              <td>{{ desc }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <pre class="code-body"><code><span class="c">/* wider toasts, custom success color */</span>
:root {
  --notiv-width: 400px;
  --notiv-state-success: oklch(0.75 0.2 160);
}</code></pre>
    </section>

    <!-- Promise API -->
    <section class="section">
      <h2 class="section-title">Promise API</h2>
      <p class="section-desc"><code class="ic">success</code> and <code class="ic">error</code> accept a callback that receives the resolved value or rejection reason.</p>
      <pre class="code-body"><code>notiv.promise(fetchUser(id), {
  loading: { title: 'Loading user...' },
  success: (user) => ({
    title: `Welcome, ${user.name}!`,
    description: 'Profile loaded.',
  }),
  error: (err) => ({
    title: 'Failed',
    description: err.message,
  }),
  position: 'bottom-right',
})</code></pre>
    </section>

    <footer class="footer">
      <span>MIT License &middot; Built for Vue 3 &amp; Nuxt 3</span>
    </footer>
  </div>
</template>

<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --page-bg: #0a0a0a;
  --page-fg: #e8e8e8;
  --page-muted: #666;
  --page-border: #1c1c1c;
  --page-border-strong: #282828;
  --page-surface: #111;
  --page-surface2: #161616;
  --page-code-bg: #0e0e0e;
  --page-title: #f2f2f2;
  --page-input-bg: #111;
}

body {
  background: var(--page-bg);
  color: var(--page-fg);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  font-size: 15px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  transition: background 200ms ease, color 200ms ease;
  overflow-x: hidden;
}

code {
  font-family: 'SF Mono', ui-monospace, 'Cascadia Code', Menlo, monospace;
}
</style>

<style scoped>
.page {
  max-width: 780px;
  margin: 0 auto;
  padding: 0 1.5rem 4rem;
}

/* ── Nav ──────────────────────────────────────────────────────────────── */
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 0;
  border-bottom: 1px solid var(--page-border);
}
.logo { font-size: 1rem; font-weight: 700; letter-spacing: -0.03em; }
.nav-right { display: flex; gap: 1.25rem; align-items: center; }
.nav-link { font-size: 0.8125rem; color: var(--page-muted); text-decoration: none; transition: color 150ms; }
.nav-link:hover { color: var(--page-fg); }

/* ── Hero ─────────────────────────────────────────────────────────────── */
.hero { padding: 5rem 0 4.5rem; }
.hero-badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--page-muted);
  border: 1px solid var(--page-border-strong);
  border-radius: 9999px;
  padding: 0.25rem 0.75rem;
  margin-bottom: 1.5rem;
  letter-spacing: 0.02em;
}
.title {
  font-size: clamp(2.25rem, 6vw, 3.25rem);
  font-weight: 700;
  letter-spacing: -0.05em;
  line-height: 1.05;
  color: var(--page-title);
}
.subtitle { margin-top: 1.25rem; font-size: 1rem; color: var(--page-muted); line-height: 1.7; }
.install-box {
  margin-top: 2.25rem;
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  background: var(--page-surface);
  border: 1px solid var(--page-border-strong);
  border-radius: 10px;
  padding: 0.75rem 1.25rem;
  font-size: 0.875rem;
}
.install-prefix { color: var(--page-muted); }

/* ── Section shell ────────────────────────────────────────────────────── */
.section { padding: 3rem 0; border-top: 1px solid var(--page-border); }
.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: -0.03em;
  margin-bottom: 0.625rem;
  color: var(--page-title);
}
.sub-title {
  font-size: 0.9375rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  margin: 1.75rem 0 0.25rem;
  color: var(--page-title);
}
.section-desc { font-size: 0.875rem; color: var(--page-muted); margin-bottom: 1.5rem; }
.optional { font-weight: 400; opacity: 0.5; margin-left: 0.25rem; }

/* ── Toaster-level controls row ───────────────────────────────────────── */
.toaster-row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.25rem;
}
.control { display: flex; flex-direction: column; gap: 0.375rem; }
.control-label {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--page-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.value-badge {
  font-weight: 400;
  text-transform: none;
  letter-spacing: 0;
  background: var(--page-surface2);
  border: 1px solid var(--page-border-strong);
  border-radius: 4px;
  padding: 0 0.35em;
  font-size: 0.7rem;
}
.select {
  background: var(--page-input-bg);
  border: 1px solid var(--page-border-strong);
  border-radius: 8px;
  color: var(--page-fg);
  font-size: 0.8125rem;
  padding: 0.4rem 2rem 0.4rem 0.75rem;
  cursor: pointer;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23777' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  transition: border-color 150ms;
}
.select:hover, .select:focus { border-color: var(--page-muted); outline: none; }

/* ── Playground card ──────────────────────────────────────────────────── */
.pg-card {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--page-border);
  border-radius: 14px;
  overflow: hidden;
  background: var(--page-surface);
}
@media (min-width: 680px) {
  .pg-card {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}

/* Controls panel */
.pg-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem;
  border-bottom: 1px solid var(--page-border);
  min-width: 0;
}
@media (min-width: 680px) {
  .pg-controls {
    border-bottom: none;
    border-right: 1px solid var(--page-border);
  }
}

/* Single labelled field */
.pg-group { display: flex; flex-direction: column; gap: 0.4rem; }

/* Two fields side by side */
.pg-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.875rem;
}
@media (max-width: 380px) {
  .pg-row { grid-template-columns: 1fr; }
}

/* Toggle rows */
.pg-toggles {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--page-border);
  padding-top: 0.25rem;
}
.pg-toggle-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.625rem 0;
  border-bottom: 1px solid var(--page-border);
}
.pg-toggle-item:last-child { border-bottom: none; }

/* Type buttons */
.type-grid { display: flex; flex-wrap: wrap; gap: 0.375rem; }
.type-btn {
  padding: 0.35rem 0.875rem;
  border-radius: 9999px;
  border: 1px solid color-mix(in oklch, var(--acc) 30%, transparent);
  background: color-mix(in oklch, var(--acc) 8%, transparent);
  color: var(--acc);
  font-size: 0.78rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 120ms, border-color 120ms, transform 80ms;
}
.type-btn:hover { background: color-mix(in oklch, var(--acc) 15%, transparent); }
.type-btn:active { transform: scale(0.96); }
.type-btn.active {
  background: color-mix(in oklch, var(--acc) 22%, transparent);
  border-color: color-mix(in oklch, var(--acc) 60%, transparent);
}

/* Text inputs */
.text-input {
  width: 100%;
  background: var(--page-input-bg);
  border: 1px solid var(--page-border-strong);
  border-radius: 8px;
  color: var(--page-fg);
  font-size: 0.8125rem;
  font-family: inherit;
  padding: 0.4rem 0.75rem;
  outline: none;
  transition: border-color 150ms;
}
.text-input:focus { border-color: var(--page-muted); }
.text-input::placeholder { color: var(--page-muted); opacity: 0.6; }
.text-input--mono { font-family: 'SF Mono', ui-monospace, monospace; }

/* Duration presets */
.preset-row { display: flex; gap: 0.25rem; flex-wrap: wrap; }
.preset-btn {
  padding: 0.3rem 0.65rem;
  border-radius: 6px;
  border: 1px solid var(--page-border-strong);
  background: transparent;
  color: var(--page-muted);
  font-size: 0.78rem;
  font-weight: 500;
  cursor: pointer;
  transition: color 120ms, background 120ms, border-color 120ms;
}
.preset-btn:hover { color: var(--page-fg); border-color: var(--page-muted); }
.preset-btn.active {
  color: var(--page-fg);
  background: var(--page-surface2);
  border-color: var(--page-muted);
}

/* Fill row */
.fill-row { display: flex; align-items: center; gap: 0.5rem; }
.color-swatch {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid var(--page-border-strong);
  padding: 2px;
  background: var(--page-input-bg);
  cursor: pointer;
  flex-shrink: 0;
}
.fill-row .text-input { flex: 1; min-width: 0; }
.reset-btn {
  padding: 0 0.4rem;
  height: 32px;
  border-radius: 6px;
  border: 1px solid var(--page-border-strong);
  background: transparent;
  color: var(--page-muted);
  font-size: 0.7rem;
  cursor: pointer;
  flex-shrink: 0;
  transition: color 120ms;
}
.reset-btn:hover { color: var(--page-fg); }

/* Range slider */
.range-input {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 4px;
  background: var(--page-border-strong);
  outline: none;
  cursor: pointer;
}
.range-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--page-fg);
  cursor: pointer;
  border: 2px solid var(--page-bg);
  box-shadow: 0 0 0 1px var(--page-muted);
}
.range-input::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--page-fg);
  cursor: pointer;
  border: 2px solid var(--page-bg);
}

/* Toggle */
.toggle {
  position: relative;
  width: 36px;
  height: 20px;
  border-radius: 9999px;
  border: 1px solid var(--page-border-strong);
  background: var(--page-surface2);
  cursor: pointer;
  transition: background 200ms, border-color 200ms;
  flex-shrink: 0;
}
.toggle.on {
  background: var(--page-fg);
  border-color: var(--page-fg);
}
.toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--page-muted);
  transition: transform 200ms, background 200ms;
}
.toggle.on .toggle-thumb {
  transform: translateX(16px);
  background: var(--page-bg);
}

/* full-width select inside pg-row */
.select--full { width: 100%; }

/* Preview panel */
.pg-preview {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  padding: 1.25rem;
  /* must shrink in the grid column — without this, long code lines
     push the column wider instead of scrolling inside the pre */
  min-width: 0;
  overflow: hidden;
}
.code-preview--grow {
  flex: 1;
  min-height: 200px;
  /* same: allow the flex child to shrink, not blow out */
  min-width: 0;
  overflow: hidden;
}
.code-preview--grow .code-body--flush {
  overflow-x: auto;
  overflow-y: auto;
  max-height: 340px;
  -webkit-overflow-scrolling: touch;
}

/* Fire button */
.fire-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1.25rem;
  border-radius: 10px;
  border: none;
  background: var(--page-fg);
  color: var(--page-bg);
  font-size: 0.875rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: opacity 150ms, transform 100ms;
}
.fire-btn:hover { opacity: 0.88; }
.fire-btn:active { transform: scale(0.98); }

/* ── Code blocks ──────────────────────────────────────────────────────── */
.code-preview {
  border: 1px solid var(--page-border);
  border-radius: 12px;
  overflow: hidden;
  background: var(--page-code-bg);
  display: flex;
  flex-direction: column;
  /* prevent wide code from blowing out the layout */
  min-width: 0;
}
.code-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.875rem;
  border-bottom: 1px solid var(--page-border);
  flex-shrink: 0;
}
.code-lang { font-size: 0.68rem; font-weight: 600; color: var(--page-muted); text-transform: uppercase; letter-spacing: 0.08em; }
.code-type { font-size: 0.73rem; color: var(--page-muted); }
.code-body {
  background: var(--page-code-bg);
  border: 1px solid var(--page-border);
  border-radius: 12px;
  padding: 1.25rem;
  font-size: 0.8125rem;
  line-height: 1.7;
  color: var(--page-fg);
  /* scroll the code, not the page */
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin-top: 1rem;
  white-space: pre;
  /* never wider than its container */
  max-width: 100%;
  box-sizing: border-box;
}
.code-body--flush {
  margin-top: 0;
  border: none;
  border-radius: 0;
  flex: 1;
}
.code-body--sm { font-size: 0.875rem; padding: 0.875rem 1.25rem; }
.code-body :deep(.c), .c { color: var(--page-muted); }

/* ── Package manager tabs ─────────────────────────────────────────────── */
.pkg-tabs { display: flex; gap: 0.25rem; margin-bottom: 0.625rem; }
.pkg-tab {
  padding: 0.3rem 0.875rem;
  border-radius: 6px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--page-muted);
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: color 150ms, background 150ms, border-color 150ms;
}
.pkg-tab:hover { color: var(--page-fg); }
.pkg-tab.active { color: var(--page-fg); background: var(--page-surface2); border-color: var(--page-border-strong); }

/* ── Inline code ──────────────────────────────────────────────────────── */
.ic {
  background: var(--page-surface2);
  border: 1px solid var(--page-border-strong);
  border-radius: 5px;
  padding: 0.1em 0.4em;
  font-size: 0.82em;
  color: var(--page-fg);
  font-family: 'SF Mono', ui-monospace, monospace;
}

/* ── Tables ───────────────────────────────────────────────────────────── */
.tbl-wrap {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  /* slight negative margin trick so the scrollbar doesn't clip the border-radius */
  border-radius: 8px;
}
.tbl { width: 100%; border-collapse: collapse; font-size: 0.875rem; margin-top: 0.5rem; }
.tbl th {
  text-align: left;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--page-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid var(--page-border);
  white-space: nowrap;
}
.tbl td { padding: 0.7rem 0.75rem; border-bottom: 1px solid var(--page-border); color: var(--page-muted); vertical-align: top; }
.tbl tr:last-child td { border-bottom: none; }
.tbl td:first-child { color: var(--page-fg); white-space: nowrap; }

@media (max-width: 520px) {
  .tbl { font-size: 0.8125rem; }
  .tbl th, .tbl td { padding: 0.5rem 0.625rem; }
  /* allow long names to wrap on tiny screens */
  .tbl td:first-child { white-space: normal; word-break: break-all; }
}

/* ── Footer ───────────────────────────────────────────────────────────── */
.footer { border-top: 1px solid var(--page-border); padding: 2rem 0; font-size: 0.8125rem; color: var(--page-muted); text-align: center; }
</style>
