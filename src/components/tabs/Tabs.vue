<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="h-10 justify-start items-center inline-flex">
    <div class="p-1 rounded-xl border border-zinc-800 justify-start items-center gap-1 flex">
      <tab-pane
        v-for="(tab, index) in tabsChildren"
        :key="index"
        :disabled="tab.disabled"
        :name="tab.name"
        :title="tab.title"
        :active="modelValueRef === tab.name"
        @click="emitClick"
      />
    </div>
  </div>
  <div v-bind="$attrs">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, provide, toRef, useSlots } from 'vue'
import TabPane from './TabPane.vue'
import {
  TAB_ACTIVATE_INJECTION_KEY,
  TAB_ACTIVE_NAME_INJECTION_KEY,
  TAB_VISIBILITY_DIRECTIVE_INJECTION_KEY
} from './config'

interface TabsProps {
  modelValue?: string
  directive?: 'if' | 'show'
}

const props = withDefaults(defineProps<TabsProps>(), {
  modelValue: '',
  directive: 'if'
})
const emit = defineEmits(['update:modelValue', 'click:pane'])
const slots = useSlots()
const defaultSlot = slots.default
const tabsChildren = computed(() =>
  defaultSlot
    ? defaultSlot().map((e) => ({
        name: e.props?.name,
        title: e.props?.title,
        disabled: !!e.props?.disabled
      }))
    : []
)
const modelValueRef = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value)
})
const emitClick = (): void => {
  emit('click:pane')
}
const onActivate = (value: string) => {
  modelValueRef.value = value
}

provide(TAB_ACTIVATE_INJECTION_KEY, onActivate)
provide(TAB_ACTIVE_NAME_INJECTION_KEY, modelValueRef)
provide(TAB_VISIBILITY_DIRECTIVE_INJECTION_KEY, toRef(props, 'directive'))
</script>
