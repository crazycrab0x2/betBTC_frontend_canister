<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="p-2 bg-[#18181B] w-full">
    <div
      ref="keyboard"
      class="relative bg-[#121212] rounded-[12px] border-[#27272A] border-[1px] flex flex-col gap-8 w-full h-full px-4 md:px-8 lg:px-16 py-4 md:py-6 lg:py-8"
    >
      <p class="text-neutral-50 text-[32px] font-medium space-grotesk leading-10 text-left">
        Wallet
      </p>
      <div class="h-10 justify-start items-center inline-flex">
        <div
          class="px-2 py-1 rounded-xl border border-zinc-800 justify-start items-center gap-3 flex"
        >
          <div
            class="px-2 py-1.5 rounded-lg justify-start items-center gap-2 flex cursor-pointer group"
            :class="currentTab == TABS.DEPOSIT && 'bg-[#27272A]'"
            @click="onChangeTab(TABS.DEPOSIT)"
          >
            <div class="px-1 justify-start items-center gap-16 flex">
              <div class="justify-start items-center gap-2 flex">
                <div
                  class="group-hover:text-zinc-200 text-[#a1a1a9] text-sm font-medium inter leading-tight"
                >
                  {{ TABS.DEPOSIT }}
                </div>
              </div>
            </div>
          </div>
          <div
            class="px-2 py-1.5 rounded-lg justify-start items-center gap-2 flex cursor-pointer group"
            :class="currentTab == TABS.TRANSFER && 'bg-[#27272A]'"
            @click="onChangeTab(TABS.TRANSFER)"
          >
            <div class="px-1 justify-start items-center gap-16 flex">
              <div class="justify-start items-center gap-2 flex">
                <div
                  class="group-hover:text-zinc-200 text-[#a1a1a9] text-sm font-medium inter leading-tight"
                >
                  {{ TABS.TRANSFER }}
                </div>
              </div>
            </div>
          </div>
          <div
            class="px-2 py-1.5 rounded-lg justify-start items-center gap-2 flex cursor-pointer group"
            :class="currentTab == TABS.WITHDRAW && 'bg-[#27272A]'"
            @click="onChangeTab(TABS.WITHDRAW)"
          >
            <div class="px-1 justify-start items-center gap-16 flex">
              <div class="justify-start items-center gap-2 flex">
                <div
                  class="group-hover:text-zinc-200 text-[#a1a1a9] text-sm font-medium inter leading-tight"
                >
                  {{ TABS.WITHDRAW }}
                </div>
              </div>
            </div>
          </div>
          <div
            class="px-2 py-1.5 rounded-lg justify-start items-center gap-2 flex cursor-pointer group"
            :class="currentTab == TABS.LOGS && 'bg-[#27272A]'"
            @click="onChangeTab(TABS.LOGS)"
          >
            <div class="px-1 justify-start items-center gap-16 flex">
              <div class="justify-start items-center gap-2 flex">
                <div
                  class="group-hover:text-zinc-200 text-[#a1a1a9] text-sm font-medium inter leading-tight"
                >
                  {{ TABS.LOGS }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="h-14 justify-start items-start gap-4 inline-flex mb-4">
        <container>
          <div class="self-stretch flex-col justify-center items-start gap-1 inline-flex">
            <div
              class="self-stretch text-neutral-50 text-2xl font-medium space-grotesk leading-loose"
            >
              {{ currentTab }} {{ currentTab === TABS.LOGS ? '' : 'Funds' }}
            </div>
            <div class="self-stretch text-[#a1a1a9] text-sm font-normal inter leading-tight">
              {{ CAPTIONS[currentTab] }}
            </div>
          </div>
        </container>
      </div>
      <div class="flex flex-col w-full xl:w-[80%] 2xl:w-[60%]">
        <div v-if="currentTab !== TABS.LOGS">
          <div class="flex flex-col lg:grid lg:grid-cols-2">
            <div
              class="relative h-[54px] px-4 md:px-6 lg:px-8 justify-start items-center gap-2 inline-flex"
            >
              <!-- <div class="text-zinc-200 text-base font-medium inter leading-snug">
              {{ currentTab }} BTC
            </div> -->
              <!-- <ToggleSwitch class="z-10" :isBtc="isBtc" :onSwitch="onSwitch" />
            <div class="text-[#52525a] text-base font-medium inter leading-snug">
              {{ currentTab }} USDT
            </div> -->
              <div
                class="hidden absolute w-full h-full top-0 left-0 lg:grid grid-cols-2 grid-rows-2"
              >
                <div></div>
                <div></div>
                <div></div>
                <div
                  class="translate-x-[1px] translate-y-[1px] border-b-[1px] border-r-[1px] border-b-[#27272A] border-r-[#27272A] rounded-br-[12px]"
                ></div>
              </div>
            </div>
            <div
              class="relative h-[54px] py-4 px-4 md:px-6 lg:px-8 rounded-xl justify-end items-center gap-2 inline-flex"
            >
              <div class="justify-start items-center gap-2 flex">
                <div class="text-right text-[#a1a1a9] text-base font-medium inter leading-snug">
                  Balance
                </div>
                <div class="justify-start items-center gap-1.5 flex">
                  <Icon
                    v-if="isLoadingBalance"
                    icon="eos-icons:bubble-loading"
                    color="#FF9046"
                    width="20"
                    height="20"
                  />
                  <div v-else class="text-[#a1a1a9] text-sm font-medium inter leading-tight">
                    {{
                      isBtc
                        ? convertSats2Btc(balance).toFixed(8)
                        : convertSats2Btc(balance * btcPrice).toFixed(2)
                    }}
                  </div>
                  <div v-if="isBtc" class="text-[#a1a1a9] text-sm font-medium inter leading-tight">
                    ckBTC
                  </div>
                  <div v-else class="text-[#a1a1a9] text-sm font-medium inter leading-tight">
                    USD
                  </div>
                  <Icon
                    v-if="isBtc"
                    icon="jam:refresh"
                    color="#FAFAF1"
                    width="20"
                    height="20"
                    class="cursor-pointer z-10"
                    @click="updateBalance"
                  />
                  <Icon v-else icon="bx:dollar" color="#E4E4E7CC" width="16" />
                </div>
              </div>
              <div
                class="hidden translate-y-[1px] absolute w-full h-full top-0 left-0 lg:grid grid-rows-2"
              >
                <div
                  class="border-t-[1px] border-l-[1px] border-r-[1px] border-t-[#27272A] border-r-[#27272A] border-l-[#27272A] rounded-tl-[12px] rounded-tr-[12px]"
                ></div>
                <div class="border-r-[1px] border-r-[#27272A]"></div>
              </div>
              <div
                class="lg:hidden absolute w-full h-full top-0 left-0 border-t-[1px] border-t-[#27272A] border-x-[1px] border-x-[#27272A] rounded-t-[12px]"
              ></div>
            </div>
          </div>
          <div
            class="relative w-full px-4 md:px-6 lg:px-8 py-6 rounded-xl flex-col justify-start items-start gap-5 inline-flex"
          >
            <DepositComponent class="z-10" v-if="currentTab == TABS.DEPOSIT" />
            <TransferComponent
              class="z-10"
              v-if="currentTab == TABS.TRANSFER"
              :onBalance="updateBalance"
            />
            <WithdrawComponent
              class="z-10"
              v-if="currentTab == TABS.WITHDRAW"
              :onBalance="updateBalance"
            />

            <div class="absolute w-full h-full top-0 left-0 grid grid-cols-4">
              <div
                class="lg:translate-x-[1px] lg:border-t-[1px] border-l-[1px] border-b-[1px] lg:border-t-[#27272A] border-b-[#27272A] border-l-[#27272A] lg:rounded-tl-[12px] rounded-bl-[12px]"
              ></div>
              <div class="border-b-[1px] border-b-[#27272A]"></div>
              <div
                class="translate-x-[0px] col-span-2 border-r-[1px] border-b-[1px] border-r-[#27272A] border-b-[#27272A] rounded-br-[12px]"
              ></div>
            </div>
          </div>
        </div>
        <LogsComponent v-if="currentTab === TABS.LOGS" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import DepositComponent from './DepositComponent.vue'
import TransferComponent from './TransferComponent.vue'
import WithdrawComponent from './WithdrawComponent.vue'
import LogsComponent from './LogsComponent.vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { useLayoutStore } from '@/stores/layout'
import Container from '../container/Container.vue'
import { useHelpers } from '@/composables/useHelpers'
import { useMarketStore } from '@/stores/market'

const layoutStore = useLayoutStore()
const marketStore = useMarketStore()
const { btcPrice } = storeToRefs(marketStore)
const { convertSats2Btc } = useHelpers()
const { keyboardHeight } = storeToRefs(layoutStore)

const keyboard = ref<HTMLInputElement | null>(null)
const authStore = useAuthStore()
const { updateBalance } = authStore
const { isLoadingBalance, balance } = storeToRefs(authStore)

const TABS = {
  DEPOSIT: 'Deposit',
  TRANSFER: 'Transfer',
  WITHDRAW: 'Withdraw',
  LOGS: 'Logs'
}

const CAPTIONS = {
  [TABS.DEPOSIT]:
    'Deposit bitcoin from an external wallet to convert it to ckBTC, which will accelerate transactions. It takes 6 block confirmations for you to receive ckBTC.',
  [TABS.TRANSFER]: 'Transfer between friends.',
  [TABS.WITHDRAW]: 'Withdraw your funds back into your bitcoin wallet.',
  [TABS.LOGS]: 'Logs of all deposits, transfers and withdrawals from your wallet.'
}

const currentTab = ref(TABS.DEPOSIT)
const isBtc = ref(storeToRefs(layoutStore).isBtc.value)

watch(
  () => keyboardHeight.value,
  () => {
    if (keyboard.value) keyboard.value.style.marginBottom = `${keyboardHeight.value}px`
  }
)

const onChangeTab = (tab: string) => {
  currentTab.value = tab
}

const _onSwitch = () => {
  isBtc.value = !isBtc.value
}
</script>
