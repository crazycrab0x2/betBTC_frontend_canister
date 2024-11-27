<template>
  <div
    class="flex flex-col delay-100 transition-all duration-300 ease-in-out"
    :class="isExpand ? 'gap-[12px]' : ''"
  >
    <div class="flex justify-between items-end gap-1">
      <div
        class="flex flex-col overflow-hidden rounded-2xl border-[1px]"
        :class="[isExpand ? 'grow gap-[10px] p-[3px] pr-2' : 'flex-grow p-[3px] pl-2', borderColor]"
      >
        <div
          class="rounded-full flex items-center overflow-hidden gap-1"
          :class="isExpand ? 'flex-row-reverse' : 'justify-between'"
        >
          <p
            class="inter text-[12px] leading-[16px] text-[#E4E4E7] font-[500] line-clamp-1 delay-100 transition-all duration-3000 ease-in-out"
            :class="isExpand ? 'grow' : ''"
            v-if="version == MarketVersion.V1"
          >
            {{ option.option }}
          </p>
          <div
            class="flex items-center flex-shrink delay-100 gap-[2px] transition-all duration-3000 ease-in-out"
            :class="[
              isExpand ? 'justify-between' : '',
              version == MarketVersion.V1 ? '' : 'w-full justify-between'
            ]"
          >
            <!-- chance -->
            <div
              class="inter font-[500] text-[#E4E4E7] text-[12px] leading-[16px] pr-1"
              v-if="!isExpand"
            >
              {{ (outcome * 100).toFixed(2) }}%
            </div>
            <div
              class="delay-100 transition-all duration-6000 ease-in-out relative flex items-center p-[1px] gap-1 rounded-full inter text-[12px] leading-[16px] text-[#E4E4E7] font-[400]"
              v-if="(!type && !isExpand) || (type === 'Yes' && isExpand)"
              :class="version == MarketVersion.V1 ? 'w-[44px]' : 'w-[120px]'"
            >
              <button
                class="rounded-full px-2 py-1 inter font-[500] leading-[16px] text-[#FAFAFA] delay-100 transition-all duration-3000 ease-in-out shadow-[inset_0_2px_5px_rgba(255,255,255,0.4)] w-full webkit-box-limit"
                :class="type !== 'Yes' && isExpand ? 'bg-[#27272A]' : 'bg-[#4DA597]'"
                @click="() => onHandleShowBet('Yes', false)"
              >
                {{ version == MarketVersion.V1 ? 'Yes' : option.option }}
              </button>
            </div>
            <div
              class="relative flex items-center p-[1px] gap-1 rounded-full inter text-[12px] leading-[16px] text-[#E4E4E7] font-[400] w-[44px]"
              v-if="
                ((!type && !isExpand) || (type === 'No' && isExpand)) && version == MarketVersion.V1
              "
            >
              <button
                class="rounded-full px-2 py-1 inter font-[500] leading-[16px] text-[#FAFAFA] delay-100 transition-all duration-3000 ease-in-out text-nowrap shadow-[inset_0_2px_5px_rgba(255,255,255,0.4)] w-full"
                :class="type !== 'No' && isExpand ? 'bg-[#27272A]' : 'bg-[#C94B45]'"
                @click="() => onHandleShowBet('No', false)"
              >
                No
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="isExpand"
        class="rounded-full border-[1px] flex gap-1 items-center justify-between p-1"
        :class="[
          image ? 'border-[#12121233] bg-[#1212121A]' : 'border-[#FAFAFA0D] bg-[#FAFAFA1A]',
          borderColor
        ]"
      >
        <button
          class="rounded-full p-1"
          :class="
            isFeaturedCard
              ? 'bg-[#293056] border-0'
              : 'bg-[#FAFAFA33] border-[1px] border-[#FAFAFA26] '
          "
          @click="onHandleShowBet('', true)"
        >
          <Icon
            icon="ph:plus-light"
            color="#E4E4E7"
            width="16"
            height="16"
            class="delay-100 transition-all duration-3000 ease-in-out rotate-45"
          />
        </button>
      </div>
    </div>
    <div
      :class="[
        'flex flex-col delay-100 transition-all duration-300 ease-in-out overflow-hidden text-neutral-200',
        isExpand ? 'max-h-[500px]' : 'max-h-0'
      ]"
    >
      <div class="rounded-xl border-1 border-neutral-700 p-0.5" v-if="type == 'Yes'">
        <div
          class="grid grid-cols-3 rounded-md text-[10px] font-[500] leading-[12px] delay-100 transition-all duration-3000 ease-in-out border"
          :class="borderColor"
        >
          <div class="flex flex-col p-1 gap-2 border-r" :class="borderColor">
            <p class="inter font-[500] text-[10px] leading-[12px] text-[#E4E4E7]">Average Price</p>
            <div class="inter font-[400] text-[12px] leading-[16px]">
              <span>{{
                isBtc
                  ? type == 'Yes'
                    ? Math.round(
                        bondingCurve(option.yesTokenAmount + amount, option.noTokenAmount) *
                          Math.pow(10, DECIMAL)
                      )
                    : yesPrice
                  : (
                      ((type == 'Yes'
                        ? Math.round(
                            bondingCurve(option.yesTokenAmount + amount, option.noTokenAmount) *
                              Math.pow(10, DECIMAL)
                          )
                        : yesPrice) /
                        SATOSHIS_PER_BTC) *
                      btcPrice
                    ).toFixed(2)
              }}</span>
            </div>
          </div>
          <div class="flex flex-col p-1 gap-2 border-r" :class="borderColor">
            <p class="inter font-[500] text-[10px] leading-[12px] text-[#E4E4E7]">Tokens</p>
            <div class="inter font-[400] text-[12px] leading-[16px]">
              <!-- <span>{{
                isBtc
                  ? yesPrice * (type == 'Yes' ? amount : 1) + (type == 'Yes' ? 10 : 0)
                  : (
                      ((yesPrice * (type == 'Yes' ? amount : 1) + (type == 'Yes' ? 10 : 0)) /
                        SATOSHIS_PER_BTC) *
                      btcPrice
                    ).toFixed(2)
              }}</span> -->
              <span>{{ type === 'Yes' ? (amount ? amount : 0) : 0 }}</span>
            </div>
          </div>
          <div class="flex flex-col p-1 gap-2">
            <p class="inter font-[500] text-[10px] leading-[12px] text-[#E4E4E7]">
              Potential Return Amount
            </p>
            <span class="inter font-[400] text-[12px] leading-[16px] text-[#55B5A6]">
              {{
                isBtc
                  ? type === 'Yes'
                    ? getPotentialReturn(
                        option.yesBetAmount,
                        option.yesTokenAmount,
                        option.noBetAmount,
                        option.noTokenAmount
                      )
                    : 0
                  : type === 'Yes'
                    ? (
                        (getPotentialReturn(
                          option.yesBetAmount,
                          option.yesTokenAmount,
                          option.noBetAmount,
                          option.noTokenAmount
                        ) *
                          btcPrice) /
                        SATOSHIS_PER_BTC
                      ).toFixed(2)
                    : 0
              }}
            </span>
          </div>
        </div>
      </div>
      <div class="rounded-xl border-1 border-neutral-700 p-0.5 ml-1" v-if="type == 'No'">
        <div
          class="grid grid-cols-3 rounded-md text-[10px] font-[500] leading-[12px] delay-100 transition-all duration-3000 ease-in-out border"
          :class="borderColor"
        >
          <div class="flex flex-col p-1 gap-2 border-r" :class="borderColor">
            <p class="inter font-[500] text-[10px] leading-[12px] text-[#E4E4E7]">Average Price</p>
            <div class="inter font-[400] text-[12px] leading-[16px]">
              <span>{{
                isBtc
                  ? type == 'No'
                    ? 2000 -
                      Math.round(
                        bondingCurve(option.yesTokenAmount, option.noTokenAmount + amount) *
                          Math.pow(10, DECIMAL)
                      )
                    : noPrice
                  : (
                      ((type == 'No'
                        ? 2000 -
                          Math.round(
                            bondingCurve(option.yesTokenAmount, option.noTokenAmount + amount) *
                              Math.pow(10, DECIMAL)
                          )
                        : noPrice) /
                        SATOSHIS_PER_BTC) *
                      btcPrice
                    ).toFixed(2)
              }}</span>
            </div>
          </div>
          <div class="flex flex-col p-1 gap-2 border-r" :class="borderColor">
            <p class="inter font-[500] text-[10px] leading-[12px] text-[#E4E4E7]">Tokens</p>
            <div class="inter font-[400] text-[12px] leading-[16px]">
              <!-- <span>{{
                isBtc
                  ? noPrice * (type == 'No' ? amount : 1) + (type == 'No' ? 10 : 0)
                  : (
                      ((noPrice * (type == 'No' ? amount : 1) + (type == 'No' ? 10 : 0)) /
                        SATOSHIS_PER_BTC) *
                      btcPrice
                    ).toFixed(2)
              }}</span> -->
              <span>{{ type === 'No' ? (amount ? amount : 0) : 0 }}</span>
            </div>
          </div>
          <div class="flex flex-col p-1 gap-2">
            <p class="inter font-[500] text-[10px] leading-[12px] text-[#E4E4E7]">
              Potential Return Amount
            </p>
            <span class="inter font-[400] text-[12px] leading-[16px] text-[#55B5A6]">
              {{
                isBtc
                  ? type === 'No'
                    ? getPotentialReturn(
                        option.yesBetAmount,
                        option.yesTokenAmount,
                        option.noBetAmount,
                        option.noTokenAmount
                      )
                    : 0
                  : type === 'No'
                    ? (
                        (getPotentialReturn(
                          option.yesBetAmount,
                          option.yesTokenAmount,
                          option.noBetAmount,
                          option.noTokenAmount
                        ) *
                          btcPrice) /
                        SATOSHIS_PER_BTC
                      ).toFixed(2)
                    : 0
              }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div
      :class="[
        'text-white rounded-xl flex flex-col gap-[6px] delay-100 transition-all duration-300 ease-in-out',
        isExpand ? 'max-h-[500px]' : 'max-h-0 overflow-hidden'
      ]"
    >
      <div class="flex w-full justify-between items-center">
        <p class="inter font-[400] text-[10px] text-[#A1A1A9] leading-[12px]">Amount</p>
        <div class="inter text-[12px] font-[500] leading-[16px] flex items-center gap-1">
          <span :class="isBtc ? 'text-[#A1A1A9]' : 'text-neutral-600 opacity-50'"> BTC </span>
          <ToggleSwitch
            class="z-10"
            :class="[isFeaturedCard ? 'bg-[#293056]' : 'bg-[#27272A]', borderColor]"
            :toggled="isBtc"
            :onSwitch="onSwitchBtc"
          />
          <span :class="isBtc ? 'text-neutral-600 opacity-50' : 'text-[#A1A1A9]'"> USD </span>
        </div>
      </div>
      <div class="">
        <form-input
          placeholder="Amount"
          class="items-center !py-0.5 hover:border-neutral-400 text-sm"
          :class="borderColor"
          v-model="betAmount"
          type="number"
          :inputClasses="isBtc ? 'text-right' : 'text-left'"
          min="0"
          @keydown="
            (event) => {
              if (event.key === 'e' || event.key === 'E') {
                event.preventDefault()
              }
            }
          "
        >
          <template #prefix v-if="!isBtc">
            <span class="text-neutral-200"> $ </span>
          </template>
          <template v-if="betAmount !== undefined" #suffix>
            <div class="flex gap-1 -mr-3">
              <button
                @click="
                  () => {
                    if (isBtc) {
                      if (betAmount - 1000 > 0) {
                        betAmount = Number(betAmount) - 1000
                      } else {
                        betAmount = 1000
                      }
                      return
                    }
                    if (betAmount - 1 > 0) {
                      betAmount = Number(betAmount) - 1
                    } else {
                      betAmount = 1
                    }
                  }
                "
              >
                <Icon icon="mdi:minus-box" color="#a3a3a3" width="20" />
              </button>
              <button
                @click="
                  () => {
                    if (isBtc) {
                      betAmount = Number(betAmount) + 1000
                      return
                    }
                    betAmount = Number(betAmount) + 1
                  }
                "
              >
                <Icon icon="mdi:plus-box" color="#a3a3a3" width="20" />
              </button>
            </div>
          </template>
        </form-input>
      </div>
      <div class="inter font-[400] text-[10px] leading-[12px] text-[#A1A1A9]">
        You are betting {{ betAmount }} {{ isBtc ? 'SAT' : 'USD' }} on
        <span v-if="version == MarketVersion.V1"> option '{{ type }}' </span>
        <span v-else>{{ option.option }}</span>
      </div>
      <div
        class="slider relative h-10 w-[184px] rounded-xl border-[1px] justify-start items-center inline-flex mt-1 shadow-[inset_0_2px_3px_rgba(0,0,0,0.6)]"
        :class="[isFeaturedCard ? 'bg-[#293056]' : 'bg-[#27272A]', borderColor]"
      >
        <div
          class="absolute top-0 left-0 m-1 mt-[3px] w-8 h-8 oranj-button bg-[#ff9046] rounded-[8px] flex items-center justify-center cursor-pointer"
          ref="sliderButton"
          @mousedown="startSlide"
          @touchstart="startSlide"
        >
          <Icon
            v-if="betLoading"
            icon="eos-icons:bubble-loading"
            color="#121212"
            width="20"
            height="20"
          />
          <Icon
            v-else
            icon="iconamoon:arrow-right-2-duotone"
            color="#121212"
            width="20"
            height="20"
            class="cursor-pointer"
          />
        </div>
        <div
          ref="sliderText"
          class="text-[#52525A] text-[16px] font-[500] inter leading-[22px] ml-[66px]"
        >
          Slide to Bet
        </div>
        <div
          class="absolute w-full h-full top-0 left-0 cursor-not-allowed"
          v-if="
            (isBtc ? betAmount : Number(((betAmount / btcPrice) * SATOSHIS_PER_BTC).toFixed())) +
              10 >
              balance || type == ''
          "
        ></div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { Icon } from '@iconify/vue'
import FormInput from '@/components/form/Input.vue'
import ToggleSwitch from '@/components/button/ToggleButton.vue'
import { useToast, TYPE } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import { useLayoutStore } from '@/stores/layout'
import { useMarketStore } from '@/stores/market'
import { storeToRefs } from 'pinia'
import { type Market, type MarketOption, MarketVersion } from '@/types/marketDataTypes'
import { bondingCurve, DECIMAL } from '@/utils/market'
import ToastWithSiginin from '../toast/ToastWithSiginin.vue'
import type { ActivityType } from '@/backend/betbtc-backend.did'
import { SATOSHIS_PER_BTC } from '@/composables/useHelpers'

const props = defineProps<{
  image: string
  option: MarketOption
  marketId: string
  index: number
  isExpand: boolean
  optionExpand: (idx: number) => void
  outcome: number
  isFeaturedCard: boolean
  isBitcoinCard: boolean
  version: MarketVersion
}>()

const authStore = useAuthStore()
const marketStore = useMarketStore()
const toast = useToast()

const { balance, authClient, backendActor } = storeToRefs(authStore)
const { setBalance } = authStore

const { markets, btcPrice } = storeToRefs(marketStore)
const layoutStore = useLayoutStore()
const { setMarkets } = marketStore

const isBtc = ref<boolean>(storeToRefs(layoutStore).isBtc.value)
const betLoading = ref(false)
const yesPrice = ref<number>(0)
const noPrice = ref<number>(0)
const sliderButton = ref<HTMLDivElement>()
const sliderText = ref<HTMLDivElement>()
const type = ref('')
const amount = ref<number>(1)
const betAmount = ref<number>(isBtc.value ? 1000 : 1)
const tokenPrice = ref<number>(0)
const actor = backendActor.value

const onSwitchBtc = () => {
  isBtc.value = !isBtc.value
  if (isBtc.value) {
    betAmount.value = 1000
  } else {
    betAmount.value = 1
  }
}

onMounted(() => {
  yesPrice.value = Math.round(
    bondingCurve(props.option.yesTokenAmount, props.option.noTokenAmount) * Math.pow(10, DECIMAL)
  )
  noPrice.value = 2000 - yesPrice.value
})

watch(
  () => betAmount.value,
  () => {
    if (isBtc.value) {
      amount.value = Math.floor(Number((betAmount.value / tokenPrice.value).toFixed(2)) * 10) / 10
    } else {
      amount.value =
        Math.floor(
          Number(
            ((betAmount.value * SATOSHIS_PER_BTC) / btcPrice.value / tokenPrice.value).toFixed(2)
          ) * 10
        ) / 10
    }
  }
)

watch(type, () => {
  tokenPrice.value = type.value === 'Yes' ? yesPrice.value : noPrice.value
  if (isBtc.value) {
    amount.value = Math.floor(Number((betAmount.value / tokenPrice.value).toFixed(2)) * 10) / 10
  } else {
    amount.value =
      Math.floor(
        Number(
          ((betAmount.value * SATOSHIS_PER_BTC) / btcPrice.value / tokenPrice.value).toFixed(2)
        ) * 10
      ) / 10
  }
})

const onHandleShowBet = (value: string, expand: boolean) => {
  type.value = value
  if ((!props.isExpand && !expand) || expand) props.optionExpand(props.index)
}

const triggerEvent = async () => {
  if (!authClient.value) return
  if (!sliderButton.value) return
  sliderButton.value.style.left = '142px'
  if (!sliderText.value) return
  sliderText.value.style.marginLeft = '30px'
  sliderText.value.textContent = 'Processing'
  //place
  betLoading.value = true
  let isAuthenticated = false
  try {
    isAuthenticated = await authClient.value.isAuthenticated()
  } catch {
    toast(ToastWithSiginin, {
      type: TYPE.ERROR
    })
  }
  if (!isAuthenticated) {
    toast(ToastWithSiginin, {
      type: TYPE.ERROR
    })
  } else {
    let activityType: ActivityType = { Yes: null }

    if (type.value == 'Yes') {
      activityType = { Yes: null }
    } else if (type.value == 'No') {
      activityType = { No: null }
    }

    const betResult = await actor.bet(
      props.marketId,
      props.index,
      activityType,
      isBtc.value
        ? BigInt(betAmount.value)
        : BigInt(((betAmount.value / btcPrice.value) * SATOSHIS_PER_BTC).toFixed())
    )
    if ('Ok' in betResult) {
      toast.success('Your bet placed successfully')
      setBalance(balance.value - amount.value * tokenPrice.value - 10)
      const newMarkets = markets.value.map((market: Market) => {
        if (market.id == props.marketId) {
          if (type.value == 'Yes') {
            market.options[props.index].yesBetAmount += betAmount.value
            market.options[props.index].yesTokenAmount += amount.value
          } else if (type.value == 'No') {
            market.options[props.index].noBetAmount += betAmount.value
            market.options[props.index].noTokenAmount += amount.value
          }
        }
        return market
      })
      setMarkets(newMarkets)
    } else {
      toast.error(betResult.Err)
    }
  }
  betLoading.value = false
  sliderText.value.textContent = 'Slide to Bet'
  sliderButton.value.style.left = '0px'
  sliderText.value.style.marginLeft = '66px'
}

const stopSlide = () => {
  document.removeEventListener('mousemove', slide)
  document.removeEventListener('mouseup', stopSlide)
  document.removeEventListener('touchmove', slide)
  document.removeEventListener('touchend', stopSlide)
}

const slide = (event: any) => {
  if (!sliderButton.value) return
  const slider = sliderButton.value.parentElement
  if (!slider) return
  const sliderRect = slider.getBoundingClientRect()
  let clientX
  if (event.touches) {
    clientX = event.touches[0].clientX
  } else {
    clientX = event.clientX
  }
  let newLeft = clientX - sliderRect.left - sliderButton.value.offsetWidth / 2
  if (newLeft < 0) newLeft = 0
  if (newLeft > sliderRect.width - sliderButton.value.offsetWidth - 10) {
    newLeft = sliderRect.width - sliderButton.value.offsetWidth - 10
    triggerEvent()
    stopSlide()
    return
  }
  sliderButton.value.style.left = newLeft + 'px'
}

const startSlide = (event: any) => {
  event.preventDefault()
  document.addEventListener('mousemove', slide)
  document.addEventListener('mouseup', stopSlide)
  document.addEventListener('touchmove', slide)
  document.addEventListener('touchend', stopSlide)
}

const tokenAmount = computed(() => {
  const betAmountInSats = isBtc.value
    ? betAmount.value
    : (betAmount.value * SATOSHIS_PER_BTC) / btcPrice.value

  // tokenPrice is currently in Token/Satoshis not decimal/sathshi
  return Number(((betAmountInSats * Math.pow(10, DECIMAL)) / tokenPrice.value).toFixed(1))
})

const borderColor = computed(() => {
  if (props.isFeaturedCard) return 'border-[#363F72]'
  else if (props.isBitcoinCard) return 'border-[#452510]'
  else return 'border-[#3F3F45]'
})

const getPotentialReturn = (
  yesBetAmount: number,
  yesTokenAmount: number,
  noBetAmount: number,
  noTokenAmount: number
): number => {
  const betAmountInSats = isBtc.value
    ? betAmount.value
    : Number(((betAmount.value / btcPrice.value) * SATOSHIS_PER_BTC).toFixed())
  const returnAmountInSats =
    ((yesBetAmount + noBetAmount + betAmountInSats) * tokenAmount.value) /
    ((type.value == 'Yes' ? yesTokenAmount : noTokenAmount) + tokenAmount.value)

  return Math.floor(returnAmountInSats)
}
</script>

<style scoped>
.slider {
  box-shadow: 0px 1px 1px 1px #000000 inset;
  border: 1px solid var(--neutral-700, #3f3f45);
}
.webkit-box-limit {
  display: -webkit-box;
  line-clamp: 1;
  -webkit-line-clamp: 1;
  text-overflow: ellipsis;
  overflow: hidden;
  -webkit-box-orient: vertical;
}
</style>
