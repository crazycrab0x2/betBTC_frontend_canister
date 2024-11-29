<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="rounded-xl p-2 inter bg-black">
    <div class="min-h-[438px] min-w-[480px] bg-contain bg-no-repeat payslip-background">
      <navbar-logo
        imageClasses="pl-1 pr-3 py-2"
        imageUrl="/payslip-logo.svg"
        imageWidth="88"
        link="#"
      />
      <div class="flex flex-col divide-y-2 divide-dashed divide-[#3F3F45] px-6">
        <div class="flex flex-col px-2 pb-10 pt-0 gap-[50px]">
          <div class="flex flex-row justify-end items-center gap-3">
            <div class="flex flex-col gap-1 text-[#A1A1A9] font-[400] text-right">
              <span class="text-[12px] leading-[16px]">@{{ handle }}</span>
              <span class="text-[14px] leading-[20px]" v-if="displayName">{{ displayName }}</span>
            </div>
            <RouterLink v-if="profile" to="/profile">
              <UserAvatar :user="profile" />
            </RouterLink>
          </div>
          <div class="flex flex-col gap-4">
            <div class="flex flex-row justify-between">
              <span class="text-[#A1A1A9] text-[12px] leading-[16px] font-[400]">
                Deposit Amount
              </span>
              <div class="flex text-[#E4E4E7] text-[14px] leading-[20px] font-[500]">
                <span class="border-r-2 pr-2">${{ betUSDAmount }}</span>
                <span class="pl-2">{{ betAmount }} SAT</span>
              </div>
            </div>
            <div class="flex flex-col p-4 rounded-xl bg-[#18181B] gap-6">
              <div class="flex items-center justify-between">
                <span class="text-[#E4E4E7] font-[500] text-[16px] leading-[22px]"> PnL* </span>
                <div
                  class="flex items-center gap-1"
                  :class="earnAmount >= betAmount ? 'text-[#55B5A6]' : 'text-[#DD524C]'"
                >
                  <Icon
                    :icon="
                      earnAmount >= betAmount
                        ? 'iconamoon:arrow-top-right-1-bold'
                        : 'iconamoon:arrow-bottom-right-1-bold'
                    "
                    width="36"
                    height="36"
                  />
                  <span class="font-[500] text-[36px] leading-[44px] space-grotesk"
                    >{{ ((earnAmount / betAmount) * 100).toFixed(2) }}%</span
                  >
                </div>
              </div>
              <div class="flex flex-col gap-2">
                <div class="flex justify-between items-center">
                  <span class="text-[#E4E4E7] text-[16px] leading-[22px] font-[500]">Returns</span>
                  <span
                    class="space-grotesk font-[500] text-[#FF9046] text-[32px] leading-[40px] tracking-tight"
                  >
                    ${{ earnUSDAmount }}
                  </span>
                </div>
                <div class="flex justify-end items-center">
                  <span
                    class="space-grotesk font-[500] text-[#A1A1A9] text-[16px] leading-[24px] tracking-tight"
                  >
                    {{ earnAmount }} SAT
                  </span>
                </div>
              </div>
            </div>
            <div class="text-[#A1A1A9] font-[400] text-[10px] leading-[10px]">
              *PnL may vary based on market conditions and are not guaranteed.
            </div>
          </div>
        </div>
        <div></div>
      </div>
    </div>
    <div class="flex flex-col gap-2 px-8 pb-8 rounded-b-xl bg-[#27272a]">
      <div class="flex flex-row justify-between items-center">
        <span class="text-[#A1A1A9] text-[12px] leading-[16px] font-[400]"> Date and Time </span>
        <span class="text-[#E4E4E7] text-[14px] leading-[20px] font-[500] w-[200px]">
          <!-- 13 Aug 24, 09:32:12 GMT -->
          {{ DateTime.fromMillis(timestamp).toFormat('dd LLL yy, HH:mm:ss ZZZZ') }}
        </span>
      </div>
      <div class="flex flex-row justify-between items-center">
        <span class="text-[#A1A1A9] text-[12px] leading-[16px] font-[400]"> Market Question </span>
        <span class="text-[#E4E4E7] text-[14px] leading-[20px] font-[500] w-[200px]">
          {{ marketTitle }}
        </span>
      </div>
      <div class="flex flex-row justify-between items-center">
        <span class="text-[#A1A1A9] text-[12px] leading-[16px] font-[400]"> Option Bet On </span>
        <span class="text-[#E4E4E7] text-[14px] leading-[20px] font-[500] w-[200px]">
          {{ optionTitle === 'Single' ? betOption : `${optionTitle}, ${betOption}` }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import NavbarLogo from '@/components/navbar/NavbarLogo.vue'
import UserAvatar from '../common/UserAvatar.vue'
import { formatBTC2USD } from '@/utils/format-amount'
import { Icon } from '@iconify/vue'
import { DateTime } from 'luxon'
import { useMarketStore } from '@/stores/market'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const { profile } = storeToRefs(authStore)

const { btcPrice } = storeToRefs(useMarketStore())

const props = defineProps<{
  handle: string
  displayName: string
  betAmount: number
  earnAmount: number
  timestamp: number
  marketTitle: string
  optionTitle: string
  betOption: string | undefined
}>()

const betUSDAmount = computed(() => formatBTC2USD(props.betAmount, btcPrice.value))
const earnUSDAmount = computed(() => formatBTC2USD(props.earnAmount, btcPrice.value))
</script>

<style scoped>
.payslip-background {
  background-image: url('payslip-bg.png');
  background-size: 100% 100%;
}
</style>
