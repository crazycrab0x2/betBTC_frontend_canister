<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount } from 'vue'
import { RouterView } from 'vue-router'
import { useLayoutStore } from '@/stores/layout'
import { storeToRefs } from 'pinia'
import FetchContainer from './components/container/FetchContainer.vue'
import DevAuthModal from './components/landing/DevAuthModal.vue'
import { IS_DEVELOPMENT } from './config'

const layoutStore = useLayoutStore()
const { setKeyboardHeight, setViewportHeight } = layoutStore
const { viewportHeight } = storeToRefs(layoutStore)
const visible = ref<boolean>(false)

const updateViewport = () => {
  if (
    typeof window !== 'undefined' &&
    typeof window.visualViewport !== 'undefined' &&
    window.visualViewport !== null
  ) {
    if (viewportHeight.value > window.visualViewport.height) {
      setKeyboardHeight(viewportHeight.value - window.visualViewport.height)
    } else {
      setKeyboardHeight(0)
    }
  }
}

onMounted(() => {
  if (
    typeof window !== 'undefined' &&
    typeof window.visualViewport !== 'undefined' &&
    window.visualViewport !== null
  ) {
    setViewportHeight(window.visualViewport.height)
    updateViewport()
    window.visualViewport.addEventListener('resize', updateViewport)
    if (IS_DEVELOPMENT) window.addEventListener('keydown', openModalWithCrtlAndK)
  }
})

onBeforeUnmount(() => {
  if (IS_DEVELOPMENT) window.removeEventListener('keydown', openModalWithCrtlAndK)
})

const openModalWithCrtlAndK = (event: KeyboardEvent) => {
  if (event.ctrlKey && event.key === 'k') {
    event.preventDefault()
    visible.value = true
  }
}

const onClose = () => {
  visible.value = false
}
</script>

<template>
  <div>
    <RouterView />
    <notifications position="bottom right" />
    <DevAuthModal :visible="visible" :onClose="onClose" />
    <fetch-container />
  </div>
</template>

<style>
@import '../node_modules/@syncfusion/ej2-base/styles/material.css';
@import '../node_modules/@syncfusion/ej2-buttons/styles/material.css';
@import '../node_modules/@syncfusion/ej2-inputs/styles/material.css';
@import '../node_modules/@syncfusion/ej2-popups/styles/material.css';
@import '../node_modules/@syncfusion/ej2-lists/styles/material.css';
@import '../node_modules/@syncfusion/ej2-vue-calendars/styles/material.css';
</style>
