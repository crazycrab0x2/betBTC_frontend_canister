<template>
  <div
    class="relative w-[30px] h-[20px] bg-[#27272A] border-[0.7px] border-[#3F3F45] rounded-[5px]"
    @click="onClick"
  >
    <div
      class="absolute w-[14px] h-[14px] top-[2px] rounded-[4px] bg-[#FF9046] transition-all duration-150"
      :class="isBtc ? 'left-[2px]' : 'left-[12px]'"
    ></div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  isBtc: Boolean,
  onSwitch: {
    type: Function,
    required: true
  }
})

const onClick = () => {
  props.onSwitch()
}
</script>
<style scoped></style>
