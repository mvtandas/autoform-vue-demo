<script setup lang="ts">
import { ref } from 'vue'
import { AutoForm } from '@mvtandas/autoform-vue'
// Styles overridden in our dark theme below
import { ZodProvider } from '@autoform/zod'
import { z } from 'zod'

const activeTab = ref<'basic' | 'advanced' | 'nested'>('basic')
const submittedData = ref<any>(null)

const basicSchema = new ZodProvider(
  z.object({
    firstName: z.string().min(2).describe('First Name'),
    lastName: z.string().min(2).describe('Last Name'),
    email: z.string().email().describe('Email Address'),
    age: z.number().min(18).max(120).describe('Age'),
    role: z.enum(['developer', 'designer', 'manager', 'other']).describe('Role'),
    newsletter: z.boolean().default(false).describe('Subscribe to newsletter'),
  })
)

const advancedSchema = new ZodProvider(
  z.object({
    username: z.string().min(3).max(20).describe('Username'),
    birthDate: z.coerce.date().describe('Birth Date'),
    experience: z.enum(['junior', 'mid', 'senior', 'lead']).describe('Experience Level'),
    salary: z.number().min(0).describe('Expected Salary (USD)'),
    remoteWork: z.boolean().default(true).describe('Open to remote work'),
  })
)

const nestedSchema = new ZodProvider(
  z.object({
    company: z.string().min(2).describe('Company Name'),
    website: z.string().url().describe('Website URL'),
    contact: z.object({
      name: z.string().min(2).describe('Contact Name'),
      email: z.string().email().describe('Contact Email'),
      phone: z.string().min(5).describe('Phone Number'),
    }),
    industry: z.enum(['tech', 'finance', 'healthcare', 'education', 'other']).describe('Industry'),
  })
)

const schemas = { basic: basicSchema, advanced: advancedSchema, nested: nestedSchema }
const currentSchema = computed(() => schemas[activeTab.value])

import { computed } from 'vue'

function handleSubmit(data: any) {
  submittedData.value = data
}

const schemaTexts: Record<string, string> = {
  basic: `z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  age: z.number().min(18).max(120),
  role: z.enum(['developer', ...]),
  newsletter: z.boolean(),
})`,
  advanced: `z.object({
  username: z.string().min(3).max(20),
  birthDate: z.coerce.date(),
  experience: z.enum(['junior', ...]),
  salary: z.number().min(0),
  remoteWork: z.boolean(),
})`,
  nested: `z.object({
  company: z.string().min(2),
  website: z.string().url(),
  contact: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(5),
  }),
  industry: z.enum(['tech', ...]),
})`
}
</script>

<template>
  <div class="app">
    <header>
      <div class="logo">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <rect width="36" height="36" rx="10" fill="#3b82f6"/>
          <path d="M9 12h18M9 18h14M9 24h9" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
        <div>
          <h1>autoform-vue</h1>
          <p class="version">v1.0.0</p>
        </div>
      </div>
      <p class="subtitle">Zod schema in → Complete validated form out. Zero boilerplate.</p>
      <div class="badges">
        <a href="https://github.com/mvtandas/autoform-vue" target="_blank" class="badge">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
          GitHub
        </a>
        <a href="https://www.npmjs.com/package/@mvtandas/autoform-vue" target="_blank" class="badge badge-red">npm</a>
        <a href="https://github.com/vantezzen/autoform/pull/200" target="_blank" class="badge badge-green">PR #200 → @autoform/vue</a>
      </div>
    </header>

    <div class="how-it-works">
      <div class="step">
        <div class="step-num">1</div>
        <div class="step-text">Define your Zod schema</div>
      </div>
      <svg class="arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      <div class="step">
        <div class="step-num">2</div>
        <div class="step-text">Pass it to <code>&lt;AutoForm&gt;</code></div>
      </div>
      <svg class="arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      <div class="step">
        <div class="step-num">3</div>
        <div class="step-text">Get a validated form</div>
      </div>
    </div>

    <nav class="tabs">
      <button :class="{ active: activeTab === 'basic' }" @click="activeTab = 'basic'; submittedData = null">
        Basic Form
      </button>
      <button :class="{ active: activeTab === 'advanced' }" @click="activeTab = 'advanced'; submittedData = null">
        Advanced
      </button>
      <button :class="{ active: activeTab === 'nested' }" @click="activeTab = 'nested'; submittedData = null">
        Nested Objects
      </button>
    </nav>

    <div class="content">
      <div class="panel form-panel">
        <div class="panel-header">
          <h2>Live Form</h2>
          <span class="chip">Using @mvtandas/autoform-vue</span>
        </div>
        <AutoForm
          :key="activeTab"
          :schema="currentSchema"
          @submit="handleSubmit"
        />
      </div>

      <div class="right-panels">
        <div class="panel schema-panel">
          <div class="panel-header">
            <h2>Zod Schema</h2>
            <span class="chip chip-blue">Input</span>
          </div>
          <pre class="schema-code">{{ schemaTexts[activeTab] }}</pre>
        </div>

        <div class="panel output-panel">
          <div class="panel-header">
            <h2>Output</h2>
            <span v-if="submittedData" class="chip chip-green">Validated</span>
            <span v-else class="chip">Waiting</span>
          </div>
          <pre v-if="submittedData" class="output-code success">{{ JSON.stringify(submittedData, null, 2) }}</pre>
          <p v-else class="placeholder">Submit the form to see validated data here</p>
        </div>
      </div>
    </div>

    <div class="code-example">
      <h2>That's all the code you need</h2>
      <pre class="code-block"><span class="kw">&lt;script setup&gt;</span>
<span class="kw">import</span> { AutoForm } <span class="kw">from</span> <span class="str">'@autoform/vue'</span>
<span class="kw">import</span> { ZodProvider } <span class="kw">from</span> <span class="str">'@autoform/zod'</span>
<span class="kw">import</span> { z } <span class="kw">from</span> <span class="str">'zod'</span>

<span class="kw">const</span> schema = <span class="kw">new</span> <span class="fn">ZodProvider</span>(
  z.<span class="fn">object</span>({
    name: z.<span class="fn">string</span>().<span class="fn">min</span>(<span class="num">2</span>),
    email: z.<span class="fn">string</span>().<span class="fn">email</span>(),
    role: z.<span class="fn">enum</span>([<span class="str">'dev'</span>, <span class="str">'design'</span>]),
  })
)
<span class="kw">&lt;/script&gt;</span>

<span class="kw">&lt;template&gt;</span>
  <span class="tag">&lt;AutoForm</span> <span class="attr">:schema</span>=<span class="str">"schema"</span> <span class="attr">@submit</span>=<span class="str">"console.log"</span> <span class="tag">/&gt;</span>
<span class="kw">&lt;/template&gt;</span></pre>
    </div>

    <footer>
      Built by <a href="https://github.com/mvtandas" target="_blank">Mustafa Vatandas</a>
      · Vue 3 integration for <a href="https://github.com/vantezzen/autoform" target="_blank">AutoForm</a> (3,400+ ⭐)
    </footer>
  </div>
</template>

<style>
:root{--bg:#09090b;--surface:#141416;--surface2:#1e1e22;--border:#2a2a2e;--text:#fafafa;--muted:#71717a;--primary:#3b82f6;--error:#ef4444;--success:#22c55e;--radius:10px}
*{margin:0;padding:0;box-sizing:border-box}
body{background:var(--bg);color:var(--text);font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;-webkit-font-smoothing:antialiased}
code{font-family:'SF Mono','Fira Code',monospace;font-size:13px}

.app{max-width:1000px;margin:0 auto;padding:48px 24px}

/* Header */
header{text-align:center;margin-bottom:40px}
.logo{display:flex;align-items:center;justify-content:center;gap:14px;margin-bottom:12px}
.logo h1{font-size:2.2rem;font-weight:800;letter-spacing:-0.02em}
.version{font-size:12px;color:var(--muted);font-weight:500}
.subtitle{color:var(--muted);font-size:1.05rem;margin-bottom:20px;max-width:500px;margin-left:auto;margin-right:auto}

.badges{display:flex;gap:8px;justify-content:center;flex-wrap:wrap}
.badge{display:inline-flex;align-items:center;gap:6px;padding:7px 16px;border-radius:20px;font-size:13px;font-weight:600;text-decoration:none;color:var(--text);background:var(--surface2);border:1px solid var(--border);transition:all .2s}
.badge:hover{border-color:var(--primary);transform:translateY(-1px)}
.badge-red{background:rgba(239,68,68,.1);border-color:rgba(239,68,68,.25);color:#f87171}
.badge-green{background:rgba(34,197,94,.1);border-color:rgba(34,197,94,.25);color:#4ade80}

/* How it works */
.how-it-works{display:flex;align-items:center;justify-content:center;gap:16px;margin-bottom:32px;flex-wrap:wrap}
.step{display:flex;align-items:center;gap:10px}
.step-num{width:28px;height:28px;border-radius:50%;background:var(--primary);color:#fff;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0}
.step-text{font-size:14px;color:var(--muted)}
.step-text code{background:var(--surface2);padding:2px 6px;border-radius:4px;color:var(--primary)}
.arrow{color:var(--border);flex-shrink:0}

/* Tabs */
.tabs{display:flex;gap:2px;margin-bottom:24px;background:var(--surface);border-radius:12px;padding:4px}
.tabs button{flex:1;padding:11px;border:none;background:0 0;color:var(--muted);border-radius:9px;cursor:pointer;font-size:14px;font-weight:600;transition:all .2s}
.tabs button.active{background:var(--primary);color:#fff;box-shadow:0 2px 8px rgba(59,130,246,.3)}
.tabs button:hover:not(.active){color:var(--text)}

/* Content */
.content{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:48px}
@media(max-width:740px){.content{grid-template-columns:1fr}}

.panel{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:24px}
.panel-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
.panel-header h2{font-size:15px;font-weight:700}
.chip{font-size:11px;padding:3px 10px;border-radius:20px;background:var(--surface2);color:var(--muted);font-weight:600}
.chip-blue{background:rgba(59,130,246,.12);color:#60a5fa}
.chip-green{background:rgba(34,197,94,.12);color:#4ade80}

.right-panels{display:flex;flex-direction:column;gap:20px}

/* Override autoform built-in styles for dark theme */
.form-panel .autoform{gap:14px}
.form-panel .autoform-label{color:var(--muted)!important;font-size:13px!important}
.form-panel .autoform-input,
.form-panel .autoform-select,
.form-panel .autoform-textarea{background:var(--bg)!important;border-color:var(--border)!important;color:var(--text)!important;border-radius:8px!important;padding:10px 12px!important}
.form-panel .autoform-input:focus,
.form-panel .autoform-select:focus{border-color:var(--primary)!important;box-shadow:0 0 0 3px rgba(59,130,246,.12)!important}
.form-panel .autoform-checkbox{accent-color:var(--primary)!important}
.form-panel .autoform-submit{background:var(--primary)!important;border-radius:8px!important;padding:11px 28px!important;font-weight:600!important;border:none!important}
.form-panel .autoform-submit:hover{background:var(--primary)!important;opacity:.9}
.form-panel .autoform-error{color:var(--error)!important}
.form-panel .autoform-required{color:var(--error)!important}
.form-panel .autoform-object{border-color:var(--border)!important;border-radius:10px!important}
.form-panel .autoform-object legend{color:var(--text)!important}

/* Schema */
.schema-code{background:var(--bg);padding:16px;border-radius:8px;font-size:12.5px;line-height:1.7;color:#60a5fa;overflow-x:auto;white-space:pre}

/* Output */
.output-code{background:var(--bg);padding:16px;border-radius:8px;font-size:12.5px;line-height:1.7;overflow-x:auto;white-space:pre}
.output-code.success{color:var(--success)}
.placeholder{color:var(--muted);font-size:13px;font-style:italic}

/* Code example */
.code-example{margin-bottom:48px;text-align:center}
.code-example h2{font-size:1.3rem;margin-bottom:16px;font-weight:700}
.code-block{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:24px;text-align:left;font-size:13.5px;line-height:1.8;overflow-x:auto;white-space:pre}
.kw{color:#c084fc}
.str{color:#4ade80}
.fn{color:#60a5fa}
.num{color:#fbbf24}
.tag{color:#f87171}
.attr{color:#38bdf8}

/* Footer */
footer{text-align:center;color:var(--muted);font-size:13px;padding-top:24px;border-top:1px solid var(--border)}
footer a{color:var(--primary);text-decoration:none;font-weight:500}
footer a:hover{text-decoration:underline}
</style>
