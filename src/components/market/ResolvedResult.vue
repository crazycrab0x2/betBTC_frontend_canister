<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="flex flex-row justify-between content-center">
    <div class="inter font-[500] text-[#E4E4E7] text-[16px] leading-[22px] my-auto">
      {{ title }}
    </div>
    <div class="flex flex-row gap-4">
      <div class="inter font-[500] text-[#E4E4E7] text-[16px] leading-[22px] my-auto">
        {{ data.text }}
      </div>
      <Icon
        :icon="data.icon"
        class="p-[5px] border border-[#3F3F45] rounded-full"
        :class="data.color"
        width="40"
        height="40"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed } from 'vue'
const props = defineProps<{
  title: string
  type: string
}>()

const data = computed(() => {
  let data = { icon: '', color: '', text: '' }

  switch (props.type) {
    case 'Coming':
      data = { icon: 'noto:hourglass-done', color: 'text-[#E4E4E7]', text: 'Resolving soon' }
      break
    case 'Yes':
      data = { icon: 'mingcute:check-circle-fill', color: 'text-[#4DA597]', text: 'Result is Yes' }
      break
    case 'No':
      data = { icon: 'mingcute:close-circle-fill', color: 'text-[#C94B45]', text: 'Result is No' }
      break

    default:
      break
  }

  return data
})
</script>
