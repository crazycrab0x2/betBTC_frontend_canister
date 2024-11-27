<template>
  <div
    @click="setCategory(categoryId)"
    class="rounded-full border-[1px] flex items-center gap-[2px] px-[6px] py-1 cursor-pointer bg-[#121212B2] border-[#12121233] group hover:border-[#A1A1A9]"
  >
    <Icon :icon="categoryIcon || 'octicon:hash-16'" :color="categoryColor" width="12" height="12" :class="iconClass" />
    <p class="inter font-[400] text-[10px] leading-[12px] capitalize" :class="textColor">
      {{ category?.label }}
    </p>
  </div>
</template>
<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed } from 'vue'
import { useMarketStore } from '@/stores/market';
import { storeToRefs } from 'pinia';

const marketStore = useMarketStore()
const { categories } = storeToRefs(marketStore)

const category = computed(() => categories.value.find(i => i.id === props.categoryId))
const pattern = /(?<=\[).+?(?=\])/;
const categoryIcon = computed(() => category.value?.icon?.includes('icon') ? category.value.icon.match(pattern)?.[0] : 'octicon:hash-16')
const categoryColor = computed(() => category.value?.color ? category.value.color : '')
const textColor = computed(() => category.value?.color ? `text-[${category.value.color}]` :  'text-[#A1A1A9] group-hover:text-[#FAFAF1]')

const props = defineProps({
  categoryId: {
    type: String,
    required: true
  },
  setCategory: {
    type: Function,
    required: true
  }
})

const iconClass = computed(() => {
  switch (props.categoryId) {
    case 'trending':
    case 'ending':
    case 'new':
      return ''
    default:
      return 'text-[#A1A1A9] group-hover:text-[#FAFAF1]'
  }
})
</script>
