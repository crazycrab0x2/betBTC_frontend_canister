<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="flex flex-col flex-grow items-start py-2">
    <div class="flex items-center justify-between w-full">
      <p class="inter text-neutral-200 text-[14px]">
        You
        <template v-if="type === FILTER_TYPES.DEPOSIT">made a deposit of </template>
        <template v-if="type === FILTER_TYPES.TRANSFER">transferred </template>
        <template v-if="type === FILTER_TYPES.WITHDRAW">withdrew </template>
        ${{ amountUSD }} ({{ formatBTCAmount(log.amount) }} SAT).
      </p>
      <DateTime :timestamp="Number(log.date)" timestampClass ="inter text-neutral-400 font-normal text-[10px] leading-3"/>
     </div>
    <div
      class="bg-neutral-800 overflow-hidden rounded-xl px-[14px] flex flex-col gap-5 items-start transition-all duration-300 ease-in-out w-full"
      :class="isSeeMore ? 'max-h-[600px] py-[14px] mt-2' : 'max-h-0 py-0 mt-0'"
    >
      <div class="flex flex-col gap-3 w-full">
        <div class="flex items-center justify-between w-full">
          <p class="inter text-neutral-400 text-[12px] leading-4 font-normal">Date and Time</p>
          <p class="inter text-neutral-200 font-medium text-[14px] leading-5">
            {{ formatTimestamp(Number(log.date)) }}
          </p>
        </div>
        <div class="flex justify-between w-full">
          <div class="flex items-center gap-1">
            <p class="inter text-neutral-400 text-[12px] leading-4 font-normal">Transaction ID</p>
            <button @click="copyText(log.id ?? '', 'Transaction ID Copied.')">
              <Icon icon="ph:copy-duotone" color="#A1A1A9" width="18" height="18" />
            </button>
          </div>
          <p class="inter text-neutral-200 font-medium text-[14px] leading-5">{{ log.id }}</p>
        </div>
        <div class="flex items-center justify-between w-full">
          <p class="inter text-neutral-400 text-[12px] leading-4 font-normal">Activity Type</p>
          <p class="inter text-neutral-200 font-medium text-[14px] leading-5">
            {{ type }}
          </p>
        </div>
        <div
          class="flex items-center justify-between w-full"
          v-if="type === FILTER_TYPES.TRANSFER || type === FILTER_TYPES.WITHDRAW"
        >
          <p class="inter text-neutral-400 text-[12px] leading-4 font-normal">Address</p>
          <p class="inter text-neutral-200 font-medium text-[14px] leading-5">
            {{ log.address }}
          </p>
        </div>
        <div class="flex items-center justify-between w-full">
          <p class="inter text-neutral-400 text-[12px] leading-4 font-normal">
            {{ type }} Amount (USD)
          </p>
          <p class="inter text-neutral-200 font-medium text-[14px] leading-5">${{ amountUSD }}</p>
        </div>
        <div class="flex items-center justify-between w-full">
          <p class="inter text-neutral-400 text-[12px] leading-4 font-normal">
            {{ type }} Amount (BTC)
          </p>
          <p class="inter text-neutral-200 font-medium text-[14px] leading-5">
            {{ formatBTCAmount(log.amount) }} SAT
          </p>
        </div>
      </div>
    </div>
    <template v-if="isSeeMore">
      <button
        class="flex items-center mt-2"
        @click="
          () => {
            isSeeMore = false
          }
        "
      >
        <Icon icon="ic:baseline-minus" color="#A1A1A9" width="14" height="14" />
        <span class="inter leading-4 text-[12px] font-[400] text-neutral-400"> See Less </span>
      </button>
    </template>
    <template v-else>
      <button
        class="flex items-center mt-2"
        @click="
          () => {
            isSeeMore = true
          }
        "
      >
        <Icon icon="ic:baseline-plus" color="#A1A1A9" width="14" height="14" />
        <span class="inter leading-4 text-[12px] font-[400] text-neutral-400"> See More </span>
      </button>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import type { FundLog } from '@/types/notificationTypes'
import { Icon } from '@iconify/vue'
import { useHelpers } from '@/composables/useHelpers'
import { useMarketStore } from '@/stores/market'
import { storeToRefs } from 'pinia'
import { formatBTC2USD, formatBTCAmount } from '@/utils/format-amount'
import { copyText } from '@/utils/text'

const { btcPrice } = storeToRefs(useMarketStore())
const { formatTimestamp } = useHelpers()

const props = defineProps<{ log: FundLog; FILTER_TYPES: any }>()
// const amountBTC = computed<string>(() => formatBTC(props.log.amount))
const amountUSD = computed<string>(() => formatBTC2USD(props.log.amount, btcPrice.value))
const type = computed<string>(() => {
  let type = ''
  if (props.log.types) {
    switch (Object.keys(props.log.types)[0]) {
      case 'Send':
      case 'Receive':
        type = props.FILTER_TYPES.TRANSFER
        break

      default:
        type = Object.keys(props.log.types)[0]
        break
    }
  }
  return type
})

const isSeeMore = ref<boolean>(false)
</script>
