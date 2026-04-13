import { defineComponent, h } from 'vue'
import type { AutoFormFieldComponents } from '@mvtandas/autoform-vue'

const StringField = defineComponent({
  props: ['field', 'value', 'error', 'id', 'inputProps'],
  setup(props) {
    return () =>
      h('input', {
        type: 'text',
        class: 'form-input',
        id: props.id,
        value: props.inputProps?.modelValue ?? '',
        placeholder: props.field?.fieldConfig?.inputProps?.placeholder || '',
        required: props.field?.required,
        onInput: (e: Event) => {
          props.inputProps?.['onUpdate:modelValue']?.((e.target as HTMLInputElement).value)
        },
      })
  },
})

const NumberField = defineComponent({
  props: ['field', 'value', 'error', 'id', 'inputProps'],
  setup(props) {
    return () =>
      h('input', {
        type: 'number',
        class: 'form-input',
        id: props.id,
        value: props.inputProps?.modelValue ?? '',
        required: props.field?.required,
        onInput: (e: Event) => {
          const val = (e.target as HTMLInputElement).value
          props.inputProps?.['onUpdate:modelValue']?.(val === '' ? undefined : Number(val))
        },
      })
  },
})

const BooleanField = defineComponent({
  props: ['field', 'value', 'error', 'id', 'inputProps'],
  setup(props) {
    return () =>
      h('div', { class: 'checkbox-wrapper' }, [
        h('input', {
          type: 'checkbox',
          class: 'form-checkbox',
          id: props.id,
          checked: !!props.inputProps?.modelValue,
          onChange: (e: Event) => {
            props.inputProps?.['onUpdate:modelValue']?.((e.target as HTMLInputElement).checked)
          },
        }),
      ])
  },
})

const DateField = defineComponent({
  props: ['field', 'value', 'error', 'id', 'inputProps'],
  setup(props) {
    return () => {
      const val = props.inputProps?.modelValue
      const dateStr = val instanceof Date ? val.toISOString().split('T')[0] : val || ''
      return h('input', {
        type: 'date',
        class: 'form-input',
        id: props.id,
        value: dateStr,
        required: props.field?.required,
        onInput: (e: Event) => {
          const v = (e.target as HTMLInputElement).value
          props.inputProps?.['onUpdate:modelValue']?.(v ? new Date(v) : undefined)
        },
      })
    }
  },
})

const SelectField = defineComponent({
  props: ['field', 'value', 'error', 'id', 'inputProps'],
  setup(props) {
    return () =>
      h(
        'select',
        {
          class: 'form-input',
          id: props.id,
          value: props.inputProps?.modelValue ?? '',
          required: props.field?.required,
          onChange: (e: Event) => {
            props.inputProps?.['onUpdate:modelValue']?.((e.target as HTMLSelectElement).value)
          },
        },
        [
          h('option', { value: '', disabled: true }, 'Select...'),
          ...(props.field?.options || []).map(([value, label]: [string, string]) =>
            h('option', { value, key: value }, label)
          ),
        ]
      )
  },
})

export const fieldComponents: AutoFormFieldComponents = {
  string: StringField,
  number: NumberField,
  boolean: BooleanField,
  date: DateField,
  select: SelectField,
  fallback: StringField,
}
