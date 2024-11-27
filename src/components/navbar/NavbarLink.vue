<template>
  <li class="lg:mx-4">
    <component :is="componentName" :[linkAttr]="link" :class="linkClasses" @click="handleClick">
      <slot />
    </component>
  </li>
</template>

<script setup lang="ts">
import { twMerge } from 'tailwind-merge'
import { computed, resolveComponent } from 'vue'
interface IFwbNavbarLinkProps {
  link?: string
  isActive?: boolean
  component?: string
  linkAttr?: string
  disabled?: boolean
}
const props = withDefaults(defineProps<IFwbNavbarLinkProps>(), {
  link: '/',
  isActive: false,
  component: 'a',
  linkAttr: 'href',
  disabled: false
})

const emit = defineEmits<{ click: [event: Event] }>()

const currentPageClasses = 'text-white'
const defaultStateClasses = 'text-neutral-200 hover:text-white'
const defaultClasses = 'block py-2 pr-4 pl-3 rounded md:p-0'
const componentName = computed(() => {
  return props.component !== 'a' ? resolveComponent(props.component) : 'a'
})
const linkClasses = twMerge(
  defaultClasses,
  props.isActive ? currentPageClasses : defaultStateClasses
)
const handleClick = (event: Event) => {
  if (props.disabled) {
    return
  }
  emit('click', event)
}
</script>
