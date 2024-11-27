<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="relative overflow-x-auto shadow-md rounded-lg border-[#3F3F45] border-[1px]">
    <table class="w-full inter" v-bind="$attrs">
      <slot />
    </table>
  </div>
</template>
