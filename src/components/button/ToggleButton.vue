<template>
  <div
    class="relative w-[30px] h-[17px] bg-[#27272A] border border-[#3F3F45] rounded-[5px] cursor-pointer"
    @click="onClick"
  >
    <div
      class="absolute w-[13px] h-[13px] top-[1px] rounded-[4px] bg-neutral-400 transition-all duration-150"
      :class="toggled ? 'left-[1px]' : 'left-[14px]'"
    ></div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  toggled: Boolean,
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
