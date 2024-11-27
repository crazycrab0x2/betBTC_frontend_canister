<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div
    class="flex gap-[2px] items-center"
    :class="size === 'small' ? 'p-[4px] bg-neutral-800 rounded-2xl' : ''"
  >
    <template v-if="stats === 'down'">
      <Icon
        icon="ant-design:arrow-down-outlined"
        :width="size === 'small' ? '14' : '16'"
        :height="size === 'small' ? '14' : '16'"
        color="#DD524C"
      />
      <span
        class="inter font-[400] text-red-500 leading-[12px]"
        :class="size === 'small' ? ' text-[12px]' : 'text-[16px]'"
      >
        {{ percent }}%
      </span>
    </template>
    <template v-else-if="stats === 'up'">
      <Icon
        icon="ant-design:arrow-up-outlined"
        :width="size === 'small' ? '14' : '16'"
        :height="size === 'small' ? '14' : '16'"
        color="#55B5A6"
      />
      <span
        class="inter text-[12px] font-[400] leading-[12px] text-green-500"
        :class="size === 'small' ? 'text-[12px]' : 'text-[16px]'"
      >
        {{ percent }}%
      </span>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

withDefaults(
  defineProps<{
    stats: 'up' | 'down'
    percent: number
    size: 'small' | 'large'
  }>(),
  {
    stats: 'up',
    percent: 0,
    size: 'small'
  }
)
</script>
