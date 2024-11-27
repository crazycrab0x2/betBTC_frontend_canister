<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div
    ref="lottieContainer"
    :style="{ width: width, height: height }"
    class="rounded-full overflow-hidden"
  ></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import lottie from 'lottie-web'

interface Props {
  animationPath: string
  width?: string
  height?: string
  loop?: boolean
  autoplay?: boolean
}

const props = defineProps<Props>()

const lottieContainer = ref<HTMLDivElement | null>(null)

const width = props.width || '400px'
const height = props.height || '400px'
const loop = props.loop !== undefined ? props.loop : true
const autoplay = props.autoplay !== undefined ? props.autoplay : true

onMounted(() => {
  if (lottieContainer.value) {
    lottie.loadAnimation({
      container: lottieContainer.value,
      renderer: 'svg',
      loop,
      autoplay,
      path: props.animationPath
    })
  }
})
</script>

<style scoped></style>
