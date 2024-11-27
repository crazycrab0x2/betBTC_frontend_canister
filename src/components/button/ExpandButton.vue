<template>
  <div
    class="bg-[#FF90460D] w-10 h-10 rounded-[12px] flex flex-col items-center justify-center group"
    :class="isExpand ? 'gap-0' : 'gap-2'"
  >
    <div
      class="absolute z-5 w-5 border-[1px] border-[#FF9046] rounded-full"
      :class="isExpand ? '-rotate-45 mb-0 border-transparent' : 'rotate-0 mb-2'"
    ></div>
    <div
      class="absolute z-5 w-5 border-[1px] border-[#FF9046] rounded-full"
      :class="isExpand ? 'rotate-45 mt-0 border-transparent' : 'rotate-0 mt-2'"
    ></div>
  </div>
</template>

<script setup lang="ts">
interface ExpandButtonType {
  isExpand: boolean
}

defineProps<ExpandButtonType>()
</script>
