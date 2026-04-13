<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { ZodProvider } from '@autoform/zod'
import { parseSchema, getDefaultValues, getLabel, removeEmptyValues } from '@autoform/core'
import type { ParsedField } from '@autoform/core'
import { z } from 'zod'

const activeTab = ref<'basic' | 'advanced' | 'nested'>('basic')
const submittedData = ref<any>(null)

const basicZod = z.object({
  firstName: z.string().min(2).describe('First Name'),
  lastName: z.string().min(2).describe('Last Name'),
  email: z.string().email().describe('Email Address'),
  age: z.number().min(18).max(120).describe('Age'),
  role: z.enum(['developer', 'designer', 'manager', 'other']).describe('Role'),
  newsletter: z.boolean().default(false).describe('Subscribe to newsletter'),
})

const advancedZod = z.object({
  username: z.string().min(3).max(20).describe('Username'),
  birthDate: z.coerce.date().describe('Birth Date'),
  experience: z.enum(['junior', 'mid', 'senior', 'lead']).describe('Experience Level'),
  salary: z.number().min(0).describe('Expected Salary (USD)'),
  remoteWork: z.boolean().default(true).describe('Open to remote work'),
})

const nestedZod = z.object({
  company: z.string().min(2).describe('Company Name'),
  website: z.string().url().describe('Website URL'),
  contact: z.object({
    name: z.string().min(2).describe('Contact Name'),
    email: z.string().email().describe('Contact Email'),
    phone: z.string().min(5).describe('Phone Number'),
  }),
  industry: z.enum(['tech', 'finance', 'healthcare', 'education', 'other']).describe('Industry'),
})

const schemas = {
  basic: new ZodProvider(basicZod),
  advanced: new ZodProvider(advancedZod),
  nested: new ZodProvider(nestedZod),
}

const currentSchema = computed(() => schemas[activeTab.value])
const parsed = computed(() => parseSchema(currentSchema.value))
const values = reactive<Record<string, any>>({})
const errors = ref<Record<string, string>>({})

function resetForm() {
  Object.keys(values).forEach(k => delete values[k])
  Object.assign(values, getDefaultValues(currentSchema.value))
  errors.value = {}
  submittedData.value = null
}

watch(activeTab, () => resetForm(), { immediate: true })

function getValue(path: string): any {
  return path.split('.').reduce((o: any, k) => o?.[k], values)
}

function setValue(path: string, val: any) {
  const keys = path.split('.')
  let obj: any = values
  for (let i = 0; i < keys.length - 1; i++) {
    if (!obj[keys[i]!]) obj[keys[i]!] = {}
    obj = obj[keys[i]!]
  }
  obj[keys[keys.length - 1]!] = val
}

function handleSubmit() {
  errors.value = {}
  const data = removeEmptyValues({ ...values })
  const result = currentSchema.value.validateSchema(data)
  if (result.success) {
    submittedData.value = result.data
  } else {
    result.errors?.forEach((e: any) => {
      errors.value[e.path.join('.')] = e.message
    })
  }
}

function getFieldType(field: ParsedField): string {
  return field.fieldConfig?.fieldType ?? field.type
}
</script>

<template>
  <div class="app">
    <header>
      <div class="logo">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="8" fill="#3b82f6"/>
          <path d="M8 11h16M8 16h12M8 21h8" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
        <h1>autoform-vue</h1>
      </div>
      <p class="subtitle">Auto-generate forms from Zod schemas in Vue 3</p>
      <div class="badges">
        <a href="https://github.com/mvtandas/autoform-vue" target="_blank" class="badge">GitHub</a>
        <a href="https://www.npmjs.com/package/@mvtandas/autoform-vue" target="_blank" class="badge badge-blue">npm</a>
        <a href="https://github.com/vantezzen/autoform/pull/200" target="_blank" class="badge badge-green">PR #200</a>
      </div>
    </header>

    <nav class="tabs">
      <button :class="{ active: activeTab === 'basic' }" @click="activeTab = 'basic'">Basic</button>
      <button :class="{ active: activeTab === 'advanced' }" @click="activeTab = 'advanced'">Advanced</button>
      <button :class="{ active: activeTab === 'nested' }" @click="activeTab = 'nested'">Nested</button>
    </nav>

    <div class="content">
      <div class="form-panel">
        <form @submit.prevent="handleSubmit">
          <template v-for="field in parsed.fields" :key="field.key">
            <fieldset v-if="field.type === 'object' && field.schema" class="object-group">
              <legend>{{ getLabel(field) }}</legend>
              <div v-for="sub in field.schema" :key="sub.key" class="field">
                <label :for="`${field.key}.${sub.key}`">
                  {{ getLabel(sub) }}
                  <span v-if="sub.required" class="req">*</span>
                </label>
                <input
                  :id="`${field.key}.${sub.key}`"
                  type="text"
                  :value="getValue(`${field.key}.${sub.key}`)"
                  :required="sub.required"
                  @input="setValue(`${field.key}.${sub.key}`, ($event.target as HTMLInputElement).value)"
                />
                <p v-if="errors[`${field.key}.${sub.key}`]" class="error">{{ errors[`${field.key}.${sub.key}`] }}</p>
              </div>
            </fieldset>

            <div v-else class="field">
              <label :for="field.key">
                {{ getLabel(field) }}
                <span v-if="field.required" class="req">*</span>
              </label>

              <input v-if="getFieldType(field) === 'string'" :id="field.key" type="text"
                :value="getValue(field.key)" :required="field.required"
                @input="setValue(field.key, ($event.target as HTMLInputElement).value)" />

              <input v-else-if="getFieldType(field) === 'number'" :id="field.key" type="number"
                :value="getValue(field.key)" :required="field.required"
                @input="setValue(field.key, Number(($event.target as HTMLInputElement).value))" />

              <input v-else-if="getFieldType(field) === 'date'" :id="field.key" type="date"
                :required="field.required"
                @input="setValue(field.key, new Date(($event.target as HTMLInputElement).value))" />

              <select v-else-if="getFieldType(field) === 'select'" :id="field.key"
                :value="getValue(field.key)" :required="field.required"
                @change="setValue(field.key, ($event.target as HTMLSelectElement).value)">
                <option value="" disabled>Select...</option>
                <option v-for="[val, label] in field.options ?? []" :key="val" :value="val">{{ label }}</option>
              </select>

              <label v-else-if="getFieldType(field) === 'boolean'" class="checkbox-label">
                <input :id="field.key" type="checkbox" :checked="!!getValue(field.key)"
                  @change="setValue(field.key, ($event.target as HTMLInputElement).checked)" />
                <span>{{ getLabel(field) }}</span>
              </label>

              <p v-if="errors[field.key]" class="error">{{ errors[field.key] }}</p>
            </div>
          </template>
          <button type="submit" class="submit-btn">Submit</button>
        </form>
      </div>

      <div class="output-panel">
        <h3>Output</h3>
        <div v-if="submittedData" class="output-success">
          <div class="output-badge">Validated</div>
          <pre>{{ JSON.stringify(submittedData, null, 2) }}</pre>
        </div>
        <div v-else-if="Object.keys(errors).length" class="output-errors">
          <div class="output-badge output-badge-error">Errors</div>
          <pre>{{ JSON.stringify(errors, null, 2) }}</pre>
        </div>
        <p v-else class="placeholder">Submit a form to see validated output</p>

        <div class="schema-preview">
          <h3>Schema</h3>
          <pre class="schema-code">{{ activeTab === 'basic' ? `z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  age: z.number().min(18).max(120),
  role: z.enum(['developer', ...]),
  newsletter: z.boolean(),
})` : activeTab === 'advanced' ? `z.object({
  username: z.string().min(3).max(20),
  birthDate: z.coerce.date(),
  experience: z.enum(['junior', ...]),
  salary: z.number().min(0),
  remoteWork: z.boolean(),
})` : `z.object({
  company: z.string().min(2),
  website: z.string().url(),
  contact: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(5),
  }),
  industry: z.enum(['tech', ...]),
})` }}</pre>
        </div>
      </div>
    </div>

    <footer>
      Built by <a href="https://github.com/mvtandas" target="_blank">Mustafa Vatandas</a>
      · Part of <a href="https://github.com/vantezzen/autoform" target="_blank">AutoForm</a> ecosystem
    </footer>
  </div>
</template>

<style>
:root { --bg:#09090b;--surface:#18181b;--surface2:#27272a;--border:#3f3f46;--text:#fafafa;--muted:#a1a1aa;--primary:#3b82f6;--primary-hover:#2563eb;--error:#ef4444;--success:#22c55e;--radius:8px }
*{margin:0;padding:0;box-sizing:border-box}
body{background:var(--bg);color:var(--text);font-family:'Inter',-apple-system,sans-serif}
.app{max-width:900px;margin:0 auto;padding:48px 20px}
header{text-align:center;margin-bottom:36px}
.logo{display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:8px}
.logo h1{font-size:2rem;font-weight:700}
.subtitle{color:var(--muted);font-size:1rem;margin-bottom:16px}
.badges{display:flex;gap:8px;justify-content:center}
.badge{padding:6px 14px;border-radius:20px;font-size:12px;font-weight:600;text-decoration:none;color:var(--text);background:var(--surface2);border:1px solid var(--border);transition:all .2s}
.badge:hover{border-color:var(--primary)}
.badge-blue{background:rgba(59,130,246,.15);border-color:rgba(59,130,246,.3);color:#60a5fa}
.badge-green{background:rgba(34,197,94,.15);border-color:rgba(34,197,94,.3);color:#4ade80}
.tabs{display:flex;gap:2px;margin-bottom:24px;background:var(--surface);border-radius:10px;padding:3px}
.tabs button{flex:1;padding:10px;border:none;background:0 0;color:var(--muted);border-radius:8px;cursor:pointer;font-size:14px;font-weight:500;transition:all .2s}
.tabs button.active{background:var(--primary);color:#fff}
.tabs button:hover:not(.active){color:var(--text)}
.content{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:48px}
@media(max-width:700px){.content{grid-template-columns:1fr}}
.form-panel,.output-panel{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:24px}
form{display:flex;flex-direction:column;gap:16px}
.field{display:flex;flex-direction:column;gap:5px}
.field label{font-size:13px;font-weight:500;color:var(--muted)}
.req{color:var(--error)}
.field input[type=text],.field input[type=number],.field input[type=date],.field select{padding:10px 12px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);color:var(--text);font-size:14px;outline:0;transition:border-color .2s;width:100%}
.field input:focus,.field select:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(59,130,246,.12)}
.checkbox-label{display:flex;align-items:center;gap:8px;cursor:pointer;font-size:14px;color:var(--text)}
.checkbox-label input{width:18px;height:18px;accent-color:var(--primary)}
.error{font-size:12px;color:var(--error)}
.object-group{border:1px solid var(--border);border-radius:var(--radius);padding:16px;display:flex;flex-direction:column;gap:12px}
.object-group legend{font-weight:600;font-size:14px;padding:0 6px;color:var(--text)}
.submit-btn{padding:11px 28px;background:var(--primary);color:#fff;border:none;border-radius:var(--radius);font-size:14px;font-weight:600;cursor:pointer;transition:background .2s;align-self:flex-start}
.submit-btn:hover{background:var(--primary-hover)}
.output-panel h3{font-size:13px;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:12px}
.output-panel pre{background:var(--bg);padding:16px;border-radius:var(--radius);font-size:12px;overflow-x:auto;line-height:1.6}
.placeholder{color:var(--muted);font-size:13px;font-style:italic}
.output-success pre{color:var(--success)}
.output-errors pre{color:var(--error)}
.output-badge{display:inline-block;padding:3px 10px;border-radius:12px;font-size:11px;font-weight:600;background:rgba(34,197,94,.15);color:var(--success);margin-bottom:8px}
.output-badge-error{background:rgba(239,68,68,.15);color:var(--error)}
.schema-preview{margin-top:20px}
.schema-code{color:#60a5fa!important;font-size:12px}
footer{text-align:center;color:var(--muted);font-size:13px;padding-top:24px;border-top:1px solid var(--border)}
footer a{color:var(--primary);text-decoration:none}
</style>
