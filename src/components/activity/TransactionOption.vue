<template>
  <div>
    <div class="flex gap-[12px] overflow-hidden">
      <!--TODO: <img :src="" class="w-[40px] rounded-[4px]" :alt="marketId" /> -->
      <div class="flex flex-col flex-grow">
        <a
          class="text-neutral-400 inter font-[400] leading-4 text-[12px] underline"
          :href="`/market/${marketId}`"
        >
          {{ marketTitle }}
        </a>
        <div class="flex flex-row gap-2 mt-2 items-center">
          <div class="inter font-normal text-[14px] leading-5">
            <p v-if="!resolveDate" class="text-neutral-200">
              <span> You </span>
              <template v-if="version == MarketVersion.V1">
                <span v-if="'Yes' in types" class="capitalize text-green-600"> Bet Yes </span>
                <span v-else-if="'No' in types" class="capitalize text-red-600"> Bet No </span>
                <span v-else-if="'SYes' in types" class="capitalize text-green-600"> Sold Yes </span>
                <span v-else class="capitalize text-red-600"> Sold No </span>
              </template>
              <template v-else>
                <span v-if="'Yes' in types" class="capitalize text-green-600"> Bet </span>
                <span v-else-if="'SYes' in types" class="capitalize text-red-600"> Sold </span>
              </template>
              <span v-if="optionTitle != 'Single'"> on {{ optionTitle }}</span>
              <span> for {{ totalAmount }} </span>
            </p>
            <p v-else class="text-[#E4E4E7]">The market you bet on has been resolved.</p>
          </div>
          <button
            class="flex flex-row gap-1 rounded-lg border border-[#3F3F45] items-center inter font-[400] text-[12px] leading-[16px] text-[#A1A1A9] px-2 py-1"
            @click="onClickPayslip"
          >
            <Icon icon="fluent:arrow-download-16-regular" width="14" height="14" />
            <span>PAYSLIP</span>
          </button>
        </div>
        <div
          class="bg-neutral-800 overflow-hidden rounded-xl px-[14px] flex flex-col gap-5 items-start transition-all duration-300 ease-in-out"
          :class="isSeeMore ? 'max-h-[1500px] py-[14px] mt-2' : 'max-h-0 py-0 mt-0'"
        >
          <div class="flex flex-col gap-3 w-full">
            <div class="flex items-center justify-between w-full">
              <p class="inter text-neutral-400 text-[12px] leading-4 font-normal">Date and Time</p>
              <p class="inter text-neutral-200 font-medium text-[14px] leading-5">
                {{ formatTimestamp(Number(timestamp)) }}
              </p>
            </div>
            <div class="flex justify-between w-full">
              <div class="flex items-center gap-1">
                <p class="inter text-neutral-400 text-[12px] leading-4 font-normal">
                  Transaction ID
                </p>
                <button @click="copyText(id ?? '', 'Transaction ID Copied.')">
                  <Icon icon="ph:copy-duotone" color="#A1A1A9" width="18" height="18" />
                </button>
              </div>
              <p class="inter text-neutral-200 font-medium text-[14px] leading-5">
                {{ id }}
              </p>
            </div>
            <div class="flex justify-between w-full">
              <div class="flex items-center gap-1">
                <p class="inter text-neutral-400 text-[12px] leading-4 font-normal">Market</p>
              </div>
              <a
                :href="`/market/${marketId}`"
                class="inter text-neutral-200 font-medium text-[14px] leading-5 underline"
              >
                {{ marketTitle }}
              </a>
            </div>
            <div class="flex justify-between w-full">
              <p class="inter text-neutral-400 text-[12px] leading-4 font-normal">Option ID</p>
              <p class="inter text-neutral-200 font-medium text-[14px] leading-5">
                {{ optionId + 1 }}
              </p>
            </div>
            <div class="flex justify-between w-full">
              <p class="inter text-neutral-400 text-[12px] leading-4 font-normal">Activity Type</p>
              <p class="inter font-medium text-[14px] leading-5">
                <template v-if="version == MarketVersion.V1">
                  <span v-if="'Yes' in types" class="capitalize text-green-600"> Bet Yes </span>
                  <span v-else-if="'No' in types" class="capitalize text-red-600"> Bet No </span>
                  <span v-else-if="'SYes' in types" class="capitalize text-green-600">
                    Sold Yes
                  </span>
                  <span v-else class="capitalize text-red-600"> Sold No </span>
                </template>
                <template v-else>
                  <span v-if="'Yes' in types" class="capitalize text-green-600"> Bet </span>
                  <span v-else-if="'SYes' in types" class="capitalize text-green-600"> Sold </span>
                </template>
              </p>
            </div>
            <div class="flex justify-between w-full">
              <p class="inter text-neutral-400 text-[12px] leading-4 font-normal">
                Bet Amount (SATs)
              </p>
              <p class="inter text-neutral-200 font-medium text-[14px] leading-5">
                {{ totalAmount }}
              </p>
            </div>
            <div class="flex justify-between w-full">
              <p class="inter text-neutral-400 text-[12px] leading-4 font-normal">
                Bet Amount (USD)
              </p>
              <p class="inter text-neutral-200 font-medium text-[14px] leading-5">
                {{ ((totalAmount * btcPrice) / 100000000).toFixed(2) }}
              </p>
            </div>
            <hr v-if="resolveDate" class="border-[#3F3F45]" />
            <div class="flex items-center justify-between w-full" v-if="resolveDate">
              <p class="inter text-neutral-400 text-[12px] leading-4 font-normal">
                Resolution Date and Time
              </p>
              <p class="inter text-neutral-200 font-medium text-[14px] leading-5">
                {{ formatTimestamp(Number(resolveDate)) }}
              </p>
            </div>
            <div class="flex justify-between w-full" v-if="resolveType">
              <p class="inter text-neutral-400 text-[12px] leading-4 font-normal">
                Market Resolution
              </p>
              <p
                class="inter font-medium text-[14px] leading-5 capitalize"
                :class="'Yes' in resolveType ? 'text-green-600' : 'text-red-600'"
              >
                <template v-if="version == MarketVersion.V1">
                  <span v-if="'Yes' in resolveType" class="capitalize text-green-600">
                    Bet Yes
                  </span>
                  <span v-else-if="'No' in resolveType" class="capitalize text-red-600">
                    Bet No
                  </span>
                  <span v-else-if="'SYes' in resolveType" class="capitalize text-green-600">
                    Sold Yes
                  </span>
                  <span v-else class="capitalize text-red-600"> Sold No </span>
                </template>
                <template v-else>
                  <span v-if="'Yes' in resolveType" class="capitalize text-green-600"> Bet </span>
                  <span v-else-if="'SYes' in resolveType" class="capitalize text-green-600">
                    Sold
                  </span>
                </template>
              </p>
            </div>
            <div class="flex justify-between w-full" v-if="resolveOptionId != undefined">
              <p class="inter text-neutral-400 text-[12px] leading-4 font-normal">
                Resolution Option ID
              </p>
              <p class="inter text-neutral-200 font-medium text-[14px] leading-5">
                {{ resolveOptionId + 1 }}
              </p>
            </div>
            <div class="flex justify-between w-full" v-if="returnVolume != undefined">
              <p class="inter text-neutral-400 text-[12px] leading-4 font-normal">
                Your Earnings (SATs)
              </p>
              <p class="inter text-neutral-200 font-medium text-[14px] leading-5">
                {{ returnVolume }}
              </p>
            </div>
            <div class="flex justify-between w-full" v-if="returnVolume != undefined">
              <p class="inter text-neutral-400 text-[12px] leading-4 font-normal">
                Your Earnings (USD)
              </p>
              <p class="inter text-neutral-200 font-medium text-[14px] leading-5">
                {{ ((returnVolume * btcPrice) / 100000000).toFixed(2) }}
              </p>
            </div>
            <div class="flex flex-col">
              <div
                class="flex flex-row inter font-[500] text-[14px] leading-[20px] text-[#A1A1A9] gap-5"
              >
                <button
                  class="flex flex-row gap-1 rounded-lg border border-[#3F3F45] px-4 py-2 items-center"
                  :disabled="isDownloading"
                  @click="() => downloadPayslipPng()"
                >
                  <Icon
                    :icon="
                      isDownloading
                        ? 'line-md:downloading-loop'
                        : 'fluent:arrow-download-16-regular'
                    "
                    width="20"
                    height="20"
                  />
                  <span>PNG</span>
                </button>
                <button
                  class="flex flex-row gap-1 rounded-lg border border-[#3F3F45] px-4 py-2 items-center"
                  @click="() => (isShowPayslip = !isShowPayslip)"
                >
                  <Icon icon="streamline:receipt-check" width="16" height="16" />
                  <span>PAYSLIP</span>
                </button>
              </div>
              <div
                class="flex delay-100 transition-all duration-150 ease-in-out"
                :class="isShowPayslip ? 'max-h-[1000px] opacity-100 pt-4' : 'max-h-0 opacity-0'"
                ref="payslipRef"
              >
                <div class="flex flex-col rounded-xl bg-black max-w-[1000px] inter">
                  <Payslip
                    id="payslip"
                    :handle="user.handle"
                    :displayName="user.displayName || ''"
                    :betAmount="totalAmount"
                    :earnAmount="returnVolume || 0"
                    :timestamp="Number(timestamp)"
                    :marketTitle="marketTitle"
                    :optionTitle="optionTitle"
                    :betOption="resolveType && Object.keys(resolveType)[0]"
                  />
                  <div class="p-2 pt-0">
                    <div
                      class="flex justify-between items-center rounded-xl bg-[#18181B] px-8 py-6"
                    >
                      <div class="font-[500] font-[16px] leading-[22px] text-[#A1A1A9]">
                        Share Payslip
                      </div>
                      <div class="flex gap-5 text-[#E4E4E7]">
                        <share-network
                          key="0"
                          v-slot="{ share }"
                          network="whatsapp"
                          title="BetBTC winning payslip"
                          description=""
                          :url="payslipUrl"
                        >
                          <button
                            class="relative p-[10px] bg-[#27272A] rounded-xl"
                            @click="() => shareToSocial(SOCIAL.WHATSAPP, share)"
                            :disabled="!!selectedSocial"
                          >
                            <template v-if="selectedSocial === SOCIAL.WHATSAPP">
                              <Icon icon="eos-icons:bubble-loading" width="20" height="20" />
                            </template>
                            <template v-else>
                              <Icon width="20" height="20" icon="fluent:chat-empty-32-regular" />
                              <Icon
                                width="10"
                                height="10"
                                icon="carbon:phone-filled"
                                class="absolute top-[15px] left-[15px]"
                              />
                            </template>
                          </button>
                        </share-network>
                        <share-network
                          key="1"
                          v-slot="{ share }"
                          network="sms"
                          title="BetBTC winning payslip"
                          description=""
                          :url="payslipUrl"
                        >
                          <button
                            @click="() => shareToSocial(SOCIAL.WECHAT, share)"
                            :disabled="!!selectedSocial"
                          >
                            <Icon
                              class="p-[10px] bg-[#27272A] rounded-xl"
                              width="40"
                              height="40"
                              :icon="
                                selectedSocial === SOCIAL.WECHAT
                                  ? 'eos-icons:bubble-loading'
                                  : 'mage:we-chat'
                              "
                            />
                          </button>
                        </share-network>
                        <share-network
                          key="2"
                          v-slot="{ share }"
                          network="telegram"
                          title="BetBTC winning payslip"
                          description=""
                          :url="payslipUrl"
                        >
                          <button
                            @click="() => shareToSocial(SOCIAL.TELEGRAM, share)"
                            :disabled="!!selectedSocial"
                          >
                            <Icon
                              class="p-[10px] bg-[#27272A] rounded-xl"
                              width="40"
                              height="40"
                              :icon="
                                selectedSocial === SOCIAL.TELEGRAM
                                  ? 'eos-icons:bubble-loading'
                                  : 'icon-park-outline:telegram'
                              "
                            />
                          </button>
                        </share-network>
                        <share-network
                          key="3"
                          v-slot="{ share }"
                          network="twitter"
                          title="BetBTC winning payslip"
                          description=""
                          :url="payslipUrl"
                        >
                          <button
                            @click="() => shareToSocial(SOCIAL.TWITTER, share)"
                            :disabled="!!selectedSocial"
                          >
                            <Icon
                              class="p-[10px] bg-[#27272A] rounded-xl"
                              width="40"
                              height="40"
                              :icon="
                                selectedSocial === SOCIAL.TWITTER
                                  ? 'eos-icons:bubble-loading'
                                  : 'prime:twitter'
                              "
                            />
                          </button>
                        </share-network>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
                ;(isSeeMore = true), (isShowPayslip = false)
              }
            "
          >
            <Icon icon="ic:baseline-plus" color="#A1A1A9" width="14" height="14" />
            <span class="inter leading-4 text-[12px] font-[400] text-neutral-400"> See More </span>
          </button>
        </template>
      </div>
      <DateTime
        :timestamp="Number(timestamp)"
        timestampClass="font-normal text-[10px] text-neutral-400 leading-3 inter flex-shrink-0 text-right"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import type { Transaction } from '../../types/notificationTypes'
import { computed, ref, onBeforeMount } from 'vue'
import { useMarketStore } from '@/stores/market'
import { storeToRefs } from 'pinia'
import { copyText } from '@/utils/text'
import { useHelpers } from '@/composables/useHelpers'
import DateTime from '@/components/common/DateTime.vue'
import Payslip from './Payslip.vue'
import * as htmlToImage from 'html-to-image'
import { useAuthStore } from '@/stores/auth'
import { nanoid } from 'nanoid'
import { MarketVersion } from '@/types/marketDataTypes'

const { formatTimestamp } = useHelpers()
const props = defineProps<Transaction>()
const marketStore = useMarketStore()
const { btcPrice } = storeToRefs(marketStore)
const isSeeMore = ref<boolean>(false)
const isShowPayslip = ref<boolean>(false)
const isDownloading = ref<boolean>(false)
const selectedSocial = ref<string>('')
const payslipUrl = ref<string>('')
const authStore = useAuthStore()
const { backendActor } = storeToRefs(authStore)
const payslipRef = ref<HTMLElement | null>(null)

const baseUrl = computed(() =>
  import.meta.env.VITE_DFX_NETWORK === 'ic'
    ? `https://${import.meta.env.VITE_CANISTER_ID_BACKEND}.raw.icp0.io/market/`
    : `http://${import.meta.env.VITE_CANISTER_ID_BACKEND}.localhost:4943/market/`
)

const SOCIAL = ref<{
  WHATSAPP: string
  WECHAT: string
  TELEGRAM: string
  TWITTER: string
}>({
  WHATSAPP: 'whatsapp',
  WECHAT: 'wechat',
  TELEGRAM: 'telegram',
  TWITTER: 'twitter'
})

const convertHTML2Img = async () => {
  return await htmlToImage.toPng(document.getElementById('payslip') as HTMLElement)
}

const downloadPayslipPng = async () => {
  isDownloading.value = true

  let dataUrl = await convertHTML2Img()

  const downloadLink = document.createElement('a')
  downloadLink.href = dataUrl

  downloadLink.download = `${props.marketId}.png`

  downloadLink.click()
  setTimeout(() => {
    console.clear()
    downloadLink.remove()
  }, 1000)

  isDownloading.value = false
}

const shareToSocial = async (platform: string, share: Function) => {
  selectedSocial.value = platform

  const payslipKey = nanoid()
  const byteArray = convertDataUrlToUInt8Arr(await convertHTML2Img())
  const uploadedKey = (await backendActor.value.upload_market_image(
    payslipKey,
    byteArray
  )) as string
  payslipUrl.value = baseUrl.value + uploadedKey
  share()
  selectedSocial.value = ''
}

const convertDataUrlToUInt8Arr = (dataUrl: string): Uint8Array => {
  const base64 = dataUrl.split(',')[1]

  const binaryString = atob(base64)
  const len = binaryString.length
  const bytes = new Uint8Array(len)

  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }

  return bytes
}

const onClickPayslip = () => {
  isSeeMore.value = true
  isShowPayslip.value = true
  setTimeout(() => {
    payslipRef.value?.scrollIntoView({ behavior: 'smooth' })
  }, 300)
}
</script>
