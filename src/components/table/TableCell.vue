<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <td :class="tableCellClasses">
    <slot />
  </td>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const tableCellClasses = computed(
  () =>
    'border-[#27272A] border-b-[1px] border-r-[1px] py-3 px-[8px] sm:px-6 text-[#A1A1A9] font-[500] text-[14px] leading-[20px] overflow-hidden'
)
</script>
