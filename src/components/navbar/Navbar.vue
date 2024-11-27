<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <nav :class="navbarClasses">
    <slot name="logo" />
    <button
      aria-controls="navbar-default"
      aria-expanded="false"
      class="inline-flex items-center xl:hidden"
      type="button"
      @click="clickShowMobileMenu"
    >
      <slot name="menu-icon">
        <expand-button :is-expand="isShowMenu" />
      </slot>
    </button>
    <slot :is-show-menu="isShowMenu" :click-show-mobile-menu="clickShowMobileMenu" name="default" />
    <div v-if="slots['right-side']" class="hidden lg:order-2 md:flex">
      <slot name="right-side" />
    </div>
  </nav>
</template>

<script lang="ts" setup>
import { computed, ref, useSlots } from 'vue'
import { breakpointsTailwind, useBreakpoints, useToggle } from '@vueuse/core'
import ExpandButton from '@/components/button/ExpandButton.vue'

const props = defineProps({
  class: {
    type: String,
    default: 'my-4 flex flex-wrap justify-between items-center w-full px-4 2xl:px-[40px] gap-4'
  },
  sticky: {
    type: Boolean,
    default: false
  },
  rounded: {
    type: Boolean,
    default: false
  },
  solid: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['onHandleIsPage'])
const slots = useSlots()

const breakpoints = useBreakpoints(breakpointsTailwind)
const isMobile = breakpoints.smaller('xl')
const isShowMenuOnMobile = ref(false)
const toggleMobileMenu = useToggle(isShowMenuOnMobile)
const clickShowMobileMenu = () => {
  toggleMobileMenu()
  emits('onHandleIsPage')
}
const navbarClasses = computed(() => props.class)

const isShowMenu = computed(() => (!isMobile ? true : isShowMenuOnMobile.value))
</script>
