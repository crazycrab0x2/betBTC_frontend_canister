<template>
  <div @click="tryActiveTab" :class="tabClasses">
    <div class="px-0.5 justify-start items-center gap-16 flex">
      <div class="justify-start items-center gap-2 flex">
        <div
          class="group-hover:text-zinc-200 text-[#a1a1a9] text-sm font-medium inter leading-tight"
        >
          {{ title }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { TAB_ACTIVATE_INJECTION_KEY } from './config'
type TabProps = {
  name: string
  title: string
  disabled: boolean
  active: boolean
}
const props = withDefaults(defineProps<TabProps>(), {
  name: '',
  title: '',
  disabled: false,
  active: false
})

const defaultTabClasses = {
  default: 'px-2 py-1.5 rounded-lg justify-start items-center gap-2 flex cursor-pointer group',
  active:
    'px-2 py-1.5 rounded-lg justify-start items-center gap-2 flex cursor-pointer group bg-[#27272A]'
}

const onActivate = inject<(value: string) => void>(TAB_ACTIVATE_INJECTION_KEY)

const tryActiveTab = () => {
  if (props.disabled) return
  if (!onActivate) return console.warn('no onActivate')
  onActivate(props.name)
}

const tabClasses = computed(() => {
  if (props.active) return defaultTabClasses.active
  return defaultTabClasses.default
})
</script>
