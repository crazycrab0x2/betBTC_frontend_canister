<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <tr :class="tableRowClasses">
    <slot />
  </tr>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const tableRowClasses = computed(() => 'hover:bg-[#18181B]')
</script>
