<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <th scope="col" :class="tableHeadCellClasses">
    <slot />
  </th>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const tableHeadCellClasses = computed(
  () =>
    'inter font-[500] py-3 px-[6px] sm:px-6 text-[14px] border-[#27272A] border-b-[1px] border-r-[1px]'
)
</script>
