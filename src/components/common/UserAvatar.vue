<template>
    <img
        :src="user.avatar ?? '/default0.svg'"
        :alt="user.handle || user.displayName"
        class="w-[43px] h-[43px] xl:block hidden rounded-[12px] cursor-pointer object-cover aspect-square"
    />
</template>
  
<script setup lang="ts">

import type { PickedUser } from '@/types/marketDataTypes';

defineProps<{user:PickedUser}>()

</script>
<style scoped></style>