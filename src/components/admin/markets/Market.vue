<!-- eslint-disable vue/multi-word-component-names -->
<template class="">
  <div class="flex flex-col gap-[32px]">
    <div class="flex flex-col gap-[4px]">
      <p class="space-grotesk font-[500] text-[24px] leading-[32px] text-[#FAFAFA]">
        Market Resolution Screen
      </p>
      <p class="space-grotesk font-[400] text-[14px] leading-[20px] text-[#A1A1A9]">
        Select markets to resolve.
      </p>
    </div>
  </div>
  <div class="flex flex-col gap-[40px]">
    <MarketTable />
  </div>
</template>
<script setup lang="ts">
import MarketTable from './MarketTable.vue'
</script>
<style scoped>
::-webkit-scrollbar {
  width: 0px;
  height: 10px;
}
::-webkit-scrollbar-track {
  border-radius: 0px;
  background: transparent;
}
::-webkit-scrollbar-thumb {
  border-radius: 0px;
}
</style>
