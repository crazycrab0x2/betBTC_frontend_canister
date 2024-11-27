<template>
    <p
        :class="timestampClass? timestampClass : `inter font-[400] text-neutral-400 text-[10px] leading-3 flex-shrink-0 flex-grow text-right`"
        @click = " () => isAbsolute = !isAbsolute"
    >
        {{ timeAgo(Number(timestamp), isAbsolute) }}
    </p>
</template>
  
<script setup lang="ts">

import { useHelpers } from '@/composables/useHelpers'
import { ref } from 'vue';
const { timeAgo } = useHelpers(); 

const isAbsolute = ref(false);


defineProps({
    timestamp: Number,
    timestampClass: String,
})

</script>
<style scoped></style>
