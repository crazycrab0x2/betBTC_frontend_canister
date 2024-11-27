<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="p-2 bg-[#18181B] w-full min-h-screen">
    <div
      ref="keyboard"
      class="relative bg-[#121212] rounded-[12px] border-[#27272A] border-[1px] flex flex-col gap-8 w-full pt-[32px] pb-12 px-5 md:px-8 lg:px-16 h-full"
    >
      <div class="flex items-center justify-between flex-wrap">
        <p class="space-grotesk font-[500] text-[32px] leading-[40px] text-[#FAFAFA]">
          Leaderboard
        </p>
        <BalanceSwitch/>
      </div>
      <container>
        <div class="flex flex-col gap-8 w-full">
          <div class="flex flex-col gap-1">
            <p class="inter font-[500] text-[18px] leading-[24px] text-[#FAFAFA]">
              Refer and earn more!
            </p>
            <p class="inter font-[400] text-[14px] leading-[20px] text-[#A1A1A9]">
              BetBTC's referral program is designed to incentivize user growth and active
              participation by rewarding existing users for successfully inviting new members to the
              platform.
            </p>
          </div>
          <div
            class="sm:px-6 px-4 py-3 flex gap-2 rounded-[12px] w-fit border-[1px] border-[#3F3F45]"
          >
            <div
              class="px-3 sm:px-4 py-[6px] rounded-[8px] cursor-pointer hover:bg-[#27272A]"
              :class="
                duration == 'day' ? 'bg-[#27272A] text-[#E4E4E7]' : 'bg-[#18181B] text-[#A1A1A9]'
              "
              @click="() => (duration = 'day')"
            >
              <p class="inter font-[500] text-[14px] leading-[20px]">Day</p>
            </div>
            <div
              class="px-3 sm:px-4 py-[6px] rounded-[8px] cursor-pointer hover:bg-[#27272A]"
              :class="
                duration == 'week' ? 'bg-[#27272A] text-[#E4E4E7]' : 'bg-[#18181B] text-[#A1A1A9]'
              "
              @click="() => (duration = 'week')"
            >
              <p class="inter font-[500] text-[14px] leading-[20px]">Week</p>
            </div>
            <div
              class="px-3 sm:px-4 py-[6px] rounded-[8px] cursor-pointer hover:bg-[#27272A]"
              :class="
                duration == 'month' ? 'bg-[#27272A] text-[#E4E4E7]' : 'bg-[#18181B] text-[#A1A1A9]'
              "
              @click="() => (duration = 'month')"
            >
              <p class="inter font-[500] text-[14px] leading-[20px]">Month</p>
            </div>
            <div
              class="px-3 sm:px-4 py-[6px] rounded-[8px] cursor-pointer hover:bg-[#27272A]"
              :class="
                duration == 'all' ? 'bg-[#27272A] text-[#E4E4E7]' : 'bg-[#18181B] text-[#A1A1A9]'
              "
              @click="() => (duration = 'all')"
            >
              <p class="inter font-[500] text-[14px] leading-[20px]">All</p>
            </div>
          </div>
          <div class="w-[265px]">
            <form-input placeholder="Search username" v-model="username">
              <template #prefix>
                <Icon icon="icon-park-outline:search" color="#A1A1A9" width="22" height="22" />
              </template>
            </form-input>
          </div>
          <Table :duration="duration" :username="username" />
        </div>
      </container>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import Table from './Table.vue'
import { useLayoutStore } from '@/stores/layout'
import { storeToRefs } from 'pinia'
import Container from '@/components/container/Container.vue'
import FormInput from '@/components/form/Input.vue'
import BalanceSwitch from '../common/BalanceSwitch.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const layoutStore = useLayoutStore()
const { keyboardHeight } = storeToRefs(layoutStore)

const { profile } = storeToRefs(authStore)
const keyboard = ref<HTMLInputElement | null>(null)
const duration = ref('all')
const username = ref<string>('')

watch(
  () => keyboardHeight.value,
  () => {
    if (keyboard.value) keyboard.value.style.marginBottom = `${keyboardHeight.value}px`
  }
)
</script>
<style scoped>
.file-drop-area {
  transition:
    background-color 0.3s,
    border-color 0.3s;
}
.file-drop-area.dragging {
  background-color: #2d3748;
}
</style>
