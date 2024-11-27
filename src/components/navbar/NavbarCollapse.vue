<template>
  <div :class="menuClasses">
    <ul :class="listClasses">
      <slot name="default" />
    </ul>
  </div>
  <div
    class="flex z-50 fixed xl:hidden left-0 top-0 flex-col delay-150 transition-all duration-300 ease-in-out justify-between h-[100dvh] overflow-auto bg-[#18181B]"
    :class="isShowMenu ? 'w-[320px]' : 'w-0'"
  >
    <ul class="w-full flex flex-col h-full px-4">
      <slot name="logo" />
      <slot name="mobile" />
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import classNames from 'classnames'

interface NavbarCollapseType {
  isShowMenu: boolean
}

withDefaults(defineProps<NavbarCollapseType>(), {
  isShowMenu: false
})
const menuClassesDefault = 'w-full xl:block lg:w-auto hidden'
const listClassesDefault =
  'flex flex-col lg:p-1 rounded-lg lg:items-center items-start lg:flex-row lg:mt-0 mt-2 lg:text-sm gap-4'
const menuClasses = computed(() =>
  classNames(
    menuClassesDefault
    // props.isShowMenu ? 'hidden' : 'hidden',
  )
)
const listClasses = computed(() => classNames(listClassesDefault))
</script>
