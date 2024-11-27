<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <slot />
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const { userPrincipal } = storeToRefs(authStore)

onBeforeMount(() => {
  if (userPrincipal.value) {
    return
  }
  window.location.href = '/'
})
</script>
