<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="flex items-center bg-neutral-800 rounded-full py-0.5 px-1.5 gap-1">
    <template v-if="type === 'top'">
      <Icon icon="mynaui:heart-check" color="green" width="18" />
      <p class="text-green-600 text-[14px]">Top comment</p>
    </template>
    <template v-else-if="type === 'spam'">
      <Icon icon="fe:warning" color="red" width="18" />
      <p class="text-red-600 text-[14px]">Suspected spam</p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
interface BadgeProps {
  type: 'top' | 'spam'
}
defineProps<BadgeProps>()
</script>
