<template>
  <div class= "flex gap-2 items-center">
    <svg
    width="20"
    height="20"
    viewBox="0 0 16 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    >
    <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M8 23.7493C8.62133 23.7493 9.12502 24.253 9.12502 24.8743V26.3743C9.12502 26.9956 8.62133 27.4993 8 27.4993C7.37868 27.4993 6.87499 26.9956 6.87499 26.3743V24.8743C6.87499 24.253 7.37868 23.7493 8 23.7493Z"
        :fill="isBtc ? '#A1A1A9' : '#52525A'"
    />
    <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M15.5001 20.0007C15.5001 20.6221 14.9964 21.1258 14.3751 21.1258H1.62496C1.00363 21.1258 0.499947 20.6221 0.499947 20.0007C0.499947 19.3794 1.00363 18.8757 1.62496 18.8757H14.3751C14.9964 18.8757 15.5001 19.3794 15.5001 20.0007Z"
        :fill="isBtc ? '#A1A1A9' : '#52525A'"
    />
    <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M15.5001 14C15.5001 14.6213 14.9964 15.125 14.3751 15.125H1.62498C1.00366 15.125 0.499969 14.6213 0.499969 14C0.499969 13.3787 1.00365 12.875 1.62498 12.875H14.3751C14.9964 12.875 15.5001 13.3787 15.5001 14Z"
        :fill="isBtc ? '#A1A1A9' : '#52525A'"
    />
    <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M15.5002 7.99928C15.5002 8.62061 14.9965 9.12429 14.3751 9.12429H1.62501C1.00368 9.12429 0.499992 8.62061 0.499992 7.99928C0.499992 7.37795 1.00368 6.87427 1.625 6.87427H14.3751C14.9965 6.87427 15.5002 7.37795 15.5002 7.99928Z"
        :fill="isBtc ? '#A1A1A9' : '#52525A'"
    />
    <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M8.00003 0.499878C8.62135 0.499878 9.12504 1.00356 9.12504 1.62489V3.12491C9.12504 3.74623 8.62135 4.24992 8.00003 4.24992C7.3787 4.24992 6.87502 3.74623 6.87502 3.12491V1.62489C6.87502 1.00356 7.3787 0.499878 8.00003 0.499878Z"
        :fill="isBtc ? '#A1A1A9' : '#52525A'"
    />
    </svg>
    <ToggleSwitch class="z-10" :toggled="isBtc" :onSwitch="toggleIsBtc" />
    <Icon
    icon="hugeicons:dollar-02"
    :color="isBtc ? '#52525A' : '#A1A1A9'"
    width="20"
    height="20"
    />
    <div class="flex flex-col items-center hover:cursor-pointer min-w-36" v-if="profile">
      <div class="flex flex-row">
        <p
          class="flex items-center inter text-[14px] leading-[20px] text-nowrap text-[#FEFEF1] flex-grow-0"
        >
          Balance
        </p>
      </div>
      <div class="flex items-center">
        <Icon
          v-if="isBtc"
          icon="hugeicons:bitcoin-ellipse"
          color="#a3a3a3"
          width="16"
          class="mr-1"
        />
        <Icon v-else icon="bx:dollar" color="#a3a3a3" width="16" class="mr-1" />
        <div class="flex min-w-[40px]">
          <Icon
            v-if="isLoadingBalance"
            icon="eos-icons:bubble-loading"
            color="#FF9046"
            width="20"
            height="20"
          />
          <span v-else class="text-neutral-200">
            {{
              isBtc
                ? convertSats2Btc(balance).toFixed(8)
                : convertSats2Btc(balance * btcPrice).toFixed(2)
            }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup lang="ts">

import { useLayoutStore } from '@/stores/layout';
import { storeToRefs } from 'pinia';
import ToggleSwitch from '@/components/button/ToggleButton.vue'
import { Icon } from '@iconify/vue'
import { useHelpers } from '@/composables/useHelpers';
import { useMarketStore } from '@/stores/market';
import { useAuthStore } from '@/stores/auth';

const layoutStore = useLayoutStore()
const marketStore = useMarketStore()
const { convertSats2Btc } = useHelpers()
const authStore = useAuthStore()

const { toggleIsBtc } = layoutStore
const { isBtc } = storeToRefs(layoutStore)
const { btcPrice } = storeToRefs(marketStore)
const { isLoadingBalance, balance, profile } = storeToRefs(authStore)
</script>
<style scoped></style>
