<!-- eslint-disable vue/multi-word-component-names -->
<template class="">
  <div class="flex flex-col gap-[32px]">
    <div class="flex flex-col gap-[4px]">
      <p class="space-grotesk font-[500] text-[24px] leading-[32px] text-[#FAFAFA]">Users</p>
      <p class="space-grotesk font-[400] text-[14px] leading-[20px] text-[#A1A1A9]">
        Select user to check information
      </p>
    </div>
    <div
      class="group max-w-[480px] mb-7 flex gap-2 rounded-[12px] px-[18px] py-[10px] border-[#3F3F45] hover:border-[#52525A] focus-within:!border-[#B56632] border-[1px]"
    >
      <Icon icon="wpf:search" color="#A1A1A9" width="20" height="20" />
      <input
        v-model="searchTxt"
        placeholder="Search"
        class="outline-none bg-transparent placeholder-[#A1A1A9] inter font-[500] text-[16px] leading-[22px] text-[#E4E4E7] w-full"
      />
    </div>
  </div>

  <div class="flex flex-col gap-[40px]">
    <UserTable :searchTxt="searchTxt" />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import UserTable from './UserTable.vue'
const searchTxt = ref<string>('')
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
