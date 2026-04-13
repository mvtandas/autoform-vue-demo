import { defineComponent, h } from 'vue'
import type { AutoFormUIComponents } from '@mvtandas/autoform-vue'

const Form = defineComponent({
  setup(_, { slots, attrs }) {
    return () => h('form', { class: 'space-y-5', ...attrs }, slots.default?.())
  },
})

const FieldWrapper = defineComponent({
  props: ['label', 'error', 'id', 'field'],
  setup(props, { slots }) {
    return () =>
      h('div', { class: 'field-wrapper' }, [
        props.label
          ? h('label', { for: props.id, class: 'field-label' }, [
              props.label,
              props.field?.required ? h('span', { class: 'required' }, ' *') : null,
            ])
          : null,
        props.field?.description
          ? h('p', { class: 'field-description' }, props.field.description)
          : null,
        slots.default?.(),
        props.error ? h('p', { class: 'field-error' }, props.error) : null,
      ])
  },
})

const ErrorMessage = defineComponent({
  props: ['error'],
  setup(props) {
    return () => h('p', { class: 'field-error' }, props.error)
  },
})

const SubmitButton = defineComponent({
  setup(_, { slots }) {
    return () => h('button', { type: 'submit', class: 'submit-btn' }, slots.default?.())
  },
})

const ObjectWrapper = defineComponent({
  props: ['label', 'field'],
  setup(props, { slots }) {
    return () =>
      h('fieldset', { class: 'object-wrapper' }, [
        props.label ? h('legend', null, props.label) : null,
        slots.default?.(),
      ])
  },
})

const ArrayWrapper = defineComponent({
  props: ['label', 'field'],
  emits: ['addItem'],
  setup(props, { slots, emit }) {
    return () =>
      h('div', { class: 'array-wrapper' }, [
        props.label ? h('h4', null, props.label) : null,
        slots.default?.(),
        h('button', { type: 'button', class: 'add-btn', onClick: () => emit('addItem') }, '+ Add item'),
      ])
  },
})

const ArrayElementWrapper = defineComponent({
  props: ['index'],
  emits: ['remove'],
  setup(props, { slots, emit }) {
    return () =>
      h('div', { class: 'array-element' }, [
        slots.default?.(),
        h('button', { type: 'button', class: 'remove-btn', onClick: () => emit('remove') }, 'Remove'),
      ])
  },
})

export const uiComponents: AutoFormUIComponents = {
  Form,
  FieldWrapper,
  ErrorMessage,
  SubmitButton,
  ObjectWrapper,
  ArrayWrapper,
  ArrayElementWrapper,
}
