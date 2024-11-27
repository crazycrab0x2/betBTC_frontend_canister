<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div
    class="group w-full flex gap-2 rounded-[12px] px-[18px] py-[10px] border-[#3F3F45] hover:border-[#52525A] focus-within:!border-[#B56632] border-[1px]"
  >
    <slot name="prefix" />
    <input
      v-model="model"
      v-bind="$attrs"
      :type="type"
      :autocomplete="autocomplete"
      class="outline-none bg-transparent placeholder-[#A1A1A9] inter font-[500] text-[16px] leading-[22px] text-[#E4E4E7] w-full"
      :class="inputClasses"
    />
    <slot name="suffix" />
  </div>
</template>

<script lang="ts" setup>
import type { InputTypeHTMLAttribute } from 'vue'
import { useVModel } from '@vueuse/core'

interface InputProps {
  disabled?: boolean
  label?: string
  modelValue: string | number
  required?: boolean
  type?: InputTypeHTMLAttribute
  autocomplete?: string
  inputClasses?: string
}

const props = withDefaults(defineProps<InputProps>(), {
  disabled: false,
  label: '',
  modelValue: '',
  required: false,
  type: 'text',
  autocomplete: '',
  inputClasses: ''
})

const model = useVModel(props, 'modelValue')
</script>

<style scoped>
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* For Firefox */
input[type='number'] {
  appearance: textfield;
  -moz-appearance: textfield;
}
</style>
