<template>
  <a class="flex justify-end inter font-[400] text-[10px] leading-[12px] text-[#A1A1A9] px-1" :href="`/market/${id}`">
    More Options
  </a>
</template>

<script setup lang="ts">
const props = defineProps<{
  id: string
}>()
</script>
