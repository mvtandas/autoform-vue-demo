<script setup lang="ts">
import { ref } from 'vue'
import { AutoForm } from '@mvtandas/autoform-vue'
import { ZodProvider } from '@autoform/zod'
import { z } from 'zod'
import { uiComponents } from './autoform/ui-components'
import { fieldComponents } from './autoform/field-components'

const activeTab = ref<'basic' | 'advanced' | 'nested'>('basic')

// Basic form schema
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

// Advanced form schema
const advancedSchema = new ZodProvider(
  z.object({
    username: z.string().min(3).max(20).describe('Username'),
    password: z.string().min(8).describe('Password'),
    confirmPassword: z.string().min(8).describe('Confirm Password'),
    birthDate: z.coerce.date().describe('Birth Date'),
    experience: z.enum(['junior', 'mid', 'senior', 'lead']).describe('Experience Level'),
    remoteWork: z.boolean().default(true).describe('Open to remote work'),
    salary: z.number().min(0).describe('Expected Salary (USD)'),
  })
)

// Nested form schema
const nestedSchema = new ZodProvider(
  z.object({
    company: z.string().min(2).describe('Company Name'),
    website: z.string().url().describe('Website URL'),
    contact: z.object({
      name: z.string().min(2).describe('Contact Name'),
      email: z.string().email().describe('Contact Email'),
      phone: z.string().min(5).describe('Phone Number'),
    }).describe('Contact Information'),
    industry: z.enum(['tech', 'finance', 'healthcare', 'education', 'other']).describe('Industry'),
  })
)

const submittedData = ref<any>(null)

function handleSubmit(data: any) {
  submittedData.value = data
}
</script>

<template>
  <div class="app">
    <header>
      <h1>@autoform/vue</h1>
      <p class="subtitle">Automatically render forms from your Zod schema in Vue 3</p>
      <div class="badges">
        <a href="https://github.com/mvtandas/autoform-vue" target="_blank">
          <img src="https://img.shields.io/github/stars/mvtandas/autoform-vue?style=social" alt="GitHub" />
        </a>
        <a href="https://www.npmjs.com/package/@mvtandas/autoform-vue" target="_blank">
          <img src="https://img.shields.io/npm/v/@mvtandas/autoform-vue?color=blue" alt="npm" />
        </a>
      </div>
    </header>

    <nav class="tabs">
      <button :class="{ active: activeTab === 'basic' }" @click="activeTab = 'basic'">Basic Form</button>
      <button :class="{ active: activeTab === 'advanced' }" @click="activeTab = 'advanced'">Advanced Form</button>
      <button :class="{ active: activeTab === 'nested' }" @click="activeTab = 'nested'">Nested Objects</button>
    </nav>

    <div class="content">
      <div class="form-panel">
        <div v-if="activeTab === 'basic'" class="demo-section">
          <h2>Basic Form</h2>
          <p class="demo-desc">A simple user registration form generated from a Zod schema.</p>
          <AutoForm
            :schema="basicSchema"
            :ui-components="uiComponents"
            :form-components="fieldComponents"
            with-submit
            @submit="handleSubmit"
          />
        </div>

        <div v-if="activeTab === 'advanced'" class="demo-section">
          <h2>Advanced Form</h2>
          <p class="demo-desc">Includes dates, enums, numbers, and boolean fields.</p>
          <AutoForm
            :schema="advancedSchema"
            :ui-components="uiComponents"
            :form-components="fieldComponents"
            with-submit
            @submit="handleSubmit"
          />
        </div>

        <div v-if="activeTab === 'nested'" class="demo-section">
          <h2>Nested Objects</h2>
          <p class="demo-desc">Nested object schemas are rendered as grouped fieldsets.</p>
          <AutoForm
            :schema="nestedSchema"
            :ui-components="uiComponents"
            :form-components="fieldComponents"
            with-submit
            @submit="handleSubmit"
          />
        </div>
      </div>

      <div class="output-panel">
        <h3>Submitted Data</h3>
        <pre v-if="submittedData">{{ JSON.stringify(submittedData, null, 2) }}</pre>
        <p v-else class="placeholder">Submit a form to see the validated output here.</p>
      </div>
    </div>

    <section class="code-section">
      <h2>Usage</h2>
      <pre class="code-block"><code>&lt;script setup&gt;
import { AutoForm } from '@autoform/vue'
import { ZodProvider } from '@autoform/zod'
import { z } from 'zod'

const schema = new ZodProvider(
  z.object({
    name: z.string().min(2),
    email: z.string().email(),
    role: z.enum(['developer', 'designer']),
  })
)
&lt;/script&gt;

&lt;template&gt;
  &lt;AutoForm
    :schema="schema"
    :ui-components="uiComponents"
    :form-components="fieldComponents"
    with-submit
    @submit="console.log"
  /&gt;
&lt;/template&gt;</code></pre>
    </section>

    <footer>
      <p>
        Built by <a href="https://github.com/mvtandas" target="_blank">Mustafa Vatandas</a>
        &middot; Part of the <a href="https://github.com/vantezzen/autoform" target="_blank">AutoForm</a> ecosystem
      </p>
    </footer>
  </div>
</template>

<style>
:root {
  --bg: #0a0a0a;
  --surface: #141414;
  --border: #2a2a2a;
  --text: #ededed;
  --text-muted: #888;
  --primary: #3b82f6;
  --primary-hover: #2563eb;
  --error: #ef4444;
  --success: #22c55e;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
}

.app {
  max-width: 960px;
  margin: 0 auto;
  padding: 40px 20px;
}

header {
  text-align: center;
  margin-bottom: 40px;
}

header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8px;
}

.subtitle {
  color: var(--text-muted);
  font-size: 1.1rem;
  margin-bottom: 16px;
}

.badges { display: flex; gap: 8px; justify-content: center; }
.badges img { height: 20px; }

.tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 24px;
  background: var(--surface);
  border-radius: 10px;
  padding: 4px;
}

.tabs button {
  flex: 1;
  padding: 10px 16px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.tabs button.active {
  background: var(--primary);
  color: white;
}

.content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 40px;
}

@media (max-width: 700px) {
  .content { grid-template-columns: 1fr; }
}

.form-panel, .output-panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
}

.demo-section h2 {
  font-size: 1.2rem;
  margin-bottom: 4px;
}

.demo-desc {
  color: var(--text-muted);
  font-size: 13px;
  margin-bottom: 20px;
}

.output-panel h3 {
  font-size: 1rem;
  margin-bottom: 12px;
  color: var(--text-muted);
}

.output-panel pre {
  background: #1a1a2e;
  padding: 16px;
  border-radius: 8px;
  font-size: 13px;
  overflow-x: auto;
  color: var(--success);
}

.placeholder {
  color: var(--text-muted);
  font-size: 13px;
  font-style: italic;
}

/* Form Styles */
.space-y-5 { display: flex; flex-direction: column; gap: 16px; }

.field-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.field-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text);
}

.required { color: var(--error); }

.field-description {
  font-size: 12px;
  color: var(--text-muted);
}

.form-input {
  padding: 10px 12px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text);
  font-size: 14px;
  outline: none;
  width: 100%;
  transition: border-color 0.2s;
}

.form-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.form-checkbox {
  width: 18px;
  height: 18px;
  accent-color: var(--primary);
}

.checkbox-wrapper {
  padding: 4px 0;
}

.field-error {
  font-size: 12px;
  color: var(--error);
}

.submit-btn {
  padding: 10px 24px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  align-self: flex-start;
}

.submit-btn:hover { background: var(--primary-hover); }

.object-wrapper {
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.object-wrapper legend {
  font-weight: 600;
  padding: 0 8px;
  font-size: 14px;
}

.code-section {
  margin-bottom: 40px;
}

.code-section h2 {
  margin-bottom: 12px;
}

.code-block {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  overflow-x: auto;
  font-size: 13px;
  line-height: 1.7;
}

footer {
  text-align: center;
  color: var(--text-muted);
  font-size: 13px;
  padding-top: 20px;
  border-top: 1px solid var(--border);
}

footer a {
  color: var(--primary);
  text-decoration: none;
}
</style>
