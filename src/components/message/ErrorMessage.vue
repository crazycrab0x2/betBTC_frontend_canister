<template>
  <div class="flex items-center gap-1">
    <Icon icon="fluent-mdl2:error" color="#DD524C" width="14" height="14" />
    <p class="inter text-[12px] leading-[16px] text-[#DD524C] font-[400]">
      {{ message }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import { Icon } from '@iconify/vue/dist/iconify.js'
withDefaults(
  defineProps<{
    message: string
  }>(),
  {
    message: ''
  }
)
</script>
