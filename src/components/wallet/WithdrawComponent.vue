<template>
  <div class="flex flex-col gap-8 w-full">
    <div class="self-stretch flex-col justify-start items-start gap-5 flex">
      <div class="self-stretch flex-col justify-center items-start gap-1.5 flex">
        <div class="justify-center items-center gap-1 inline-flex">
          <div class="text-[#a1a1a9] text-sm font-normal inter leading-tight">Wallet address</div>
        </div>
        <div
          class="group w-full flex gap-2 items-center rounded-[12px] px-[18px] py-[10px] border-[#3F3F45] hover:border-[#52525A] focus-within:!border-[#B56632] border-[1px]"
        >
          <input
            v-model="walletAddress"
            spellcheck="false"
            placeholder="Destination Address"
            class="outline-none bg-transparent placeholder-[#A1A1A9] inter font-[500] text-[16px] leading-[22px] text-[#E4E4E7] flex-grow"
          />
          <p class="text-right text-[#a1a1a9] text-xs font-normal inter leading-none">
            Bitcoin network
          </p>
        </div>
        <error-message v-if="!isValidWalletAddress" message="Invalid wallet address" />
      </div>
      <div class="self-stretch flex-col justify-center items-start gap-1.5 flex">
        <div class="justify-center items-center gap-1 inline-flex">
          <div class="text-[#a1a1a9] text-sm font-normal inter leading-tight">Withdraw Amount</div>
        </div>
        <div
          class="group w-full flex gap-2 items-center rounded-[12px] px-[18px] py-[10px] border-[#3F3F45] hover:border-[#52525A] focus-within:!border-[#B56632] border-[1px]"
        >
          <input
            v-model="amount"
            type="number"
            :min="minAmount + bitcoinNetworkFee + interNetworkFee"
            placeholder="Transfer amount"
            class="outline-none bg-transparent placeholder-[#A1A1A9] inter font-[500] text-[16px] leading-[22px] text-[#E4E4E7] flex-grow"
          />
        </div>
        <error-message v-if="isSmallAmount" message="Amount is too small" />
      </div>
      <div class="flex flex-col gap-3 w-full">
        <div class="flex flex-col gap-5 rounded-[12px] p-[14px] bg-[#27272A] w-full">
          <div class="flex flex-col gap-3">
            <div class="flex justify-between items-center px-[14px]">
              <p class="inter leading-[16px] text-[12px] text-[#A1A1A9] font-[400]">
                Inter network fee
              </p>
              <p class="inter leading-[22px] text-[16px] text-[#E4E4E7] font-[500] flex gap-1">
                <Icon
                  v-if="feeLoading"
                  icon="eos-icons:bubble-loading"
                  color="#FF9046"
                  width="20"
                  height="20"
                />
                <span v-else>{{ interNetworkFee.toFixed(8) }}</span> BTC
              </p>
            </div>
            <div class="flex justify-between items-center px-[14px]">
              <p class="inter leading-[16px] text-[12px] text-[#A1A1A9] font-[400]">
                Bitcoin network fee
              </p>
              <p class="inter leading-[22px] text-[16px] text-[#E4E4E7] font-[500] flex gap-1">
                <Icon
                  v-if="feeLoading"
                  icon="eos-icons:bubble-loading"
                  color="#FF9046"
                  width="20"
                  height="20"
                />
                <span v-else>{{ bitcoinNetworkFee.toFixed(8) }}</span> BTC
              </p>
            </div>
          </div>
          <div class="border-b-[1px] border-b-[#3F3F45]"></div>
          <div class="flex justify-between items-center px-[14px]">
            <p class="inter leading-[16px] text-[12px] text-[#A1A1A9] font-[400]">Receive amount</p>
            <p class="inter leading-[22px] text-[16px] text-[#E4E4E7] font-[500]">
              <span class="text-[#FF9046]">
                {{ (Number(amount) - interNetworkFee - bitcoinNetworkFee).toFixed(8) }}
              </span>
              BTC
            </p>
          </div>
          <div class="flex justify-between items-center px-[14px]">
            <p class="inter leading-[16px] text-[12px] text-[#A1A1A9] font-[400]">Minimum amount</p>
            <p class="inter leading-[22px] text-[16px] text-[#E4E4E7] font-[500]">
              <span class="text-[#FF9046]">
                {{ minAmount }}
              </span>
              BTC
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-col justify-start items-start gap-2 flex relative">
      <div
        class="slider relative h-10 w-[184px] bg-zinc-800 rounded-xl border-[1px] border-[#3F3F45] justify-start items-center inline-flex"
      >
        <div
          class="absolute top-0 left-0 m-1 w-8 h-8 oranj-button bg-[#ff9046] rounded-[8px] flex items-center justify-center cursor-pointer"
          ref="sliderButton"
          @mousedown="startSlide"
          @touchstart="startSlide"
        >
          <Icon
            v-if="withdrawLoading"
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
          class="text-[#52525A] text-[16px] font-[500] inter leading-[22px] ml-11"
        >
          Slide to withdraw
        </div>
      </div>
      <div
        v-if="!isValidWalletAddress || !walletAddress || isLoadingBalance || balance <= minAmount"
        class="absolute top-0 left-0 w-full h-full cursor-not-allowed"
      ></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onBeforeMount, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { idlFactory as minter } from '@/declarations/ckbtc-minter.did'
import { HttpAgent, Actor } from '@dfinity/agent'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { useToast, TYPE } from 'vue-toastification'
import { useHelpers, SATOSHIS_PER_BTC } from '@/composables/useHelpers'
import ErrorMessage from '../message/ErrorMessage.vue'
import ToastWithSiginin from '../toast/ToastWithSiginin.vue'
import config from '@/config'

const props = defineProps({
  onBalance: {
    type: Function,
    required: true
  }
})

const authStore = useAuthStore()
const toast = useToast()
const { isValidBTCAddress, convertSats2Btc } = useHelpers()
const { authClient, backendActor, balance, isLoadingBalance } = storeToRefs(authStore)

const walletAddress = ref('')
const amount = ref('0.0')
const minAmount = ref(0)
const withdrawLoading = ref(false)
const feeLoading = ref(false)
const interNetworkFee = ref(0.0)
const bitcoinNetworkFee = ref(0.0)
const sliderButton = ref<HTMLDivElement | null>(null)
const sliderText = ref<HTMLDivElement | null>(null)
const actor = backendActor.value

const isSmallAmount = computed<boolean>(() => {
  if (
    Number(amount.value) > 0 &&
    Number(amount) < minAmount.value + bitcoinNetworkFee.value + interNetworkFee.value
  ) {
    return true
  }

  return false
})

const isValidWalletAddress = computed<boolean>(() => {
  if (walletAddress.value) {
    return isValidBTCAddress(walletAddress.value)
  }
  return true
})

interface WithdrawFee {
  minter_fee: number
  bitcoin_fee: number
}

interface MinterInfo {
  kyt_fee: number
  min_confirmations: number
  retrieve_btc_min_amount: number
}

onBeforeMount(async () => {
  try {
    feeLoading.value = true

    const canisterId = config.VITE_CANISTER_ID_CKBTC_MINTER
    const agent = HttpAgent.createSync({ host: 'https://ic0.app' })
    const actor = Actor.createActor(minter, { agent, canisterId })
    const minterInfo = (await actor.get_minter_info()) as MinterInfo
    minAmount.value = convertSats2Btc(Number(minterInfo.retrieve_btc_min_amount))
    interNetworkFee.value = convertSats2Btc(Number(minterInfo.kyt_fee))
    const withdrawFee = (await actor.estimate_withdrawal_fee({ amount: [] })) as WithdrawFee
    bitcoinNetworkFee.value =
      convertSats2Btc(Number(withdrawFee.bitcoin_fee)) +
      convertSats2Btc(Number(withdrawFee.minter_fee))
  } catch (error) {
    console.error('=======>', error)
  } finally {
    feeLoading.value = false
  }
})

const startSlide = (event: any) => {
  event.preventDefault()
  document.addEventListener('mousemove', slide)
  document.addEventListener('mouseup', stopSlide)
  document.addEventListener('touchmove', slide)
  document.addEventListener('touchend', stopSlide)
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

const stopSlide = () => {
  document.removeEventListener('mousemove', slide)
  document.removeEventListener('mouseup', stopSlide)
  document.removeEventListener('touchmove', slide)
  document.removeEventListener('touchend', stopSlide)
}

const triggerEvent = async () => {
  if (!authClient.value) return
  if (!sliderButton.value) return
  sliderButton.value.style.left = '142px'
  if (!sliderText.value) return
  sliderText.value.style.marginLeft = '30px'
  sliderText.value.textContent = 'Processing'
  withdrawLoading.value = true
  let isAuthenticated = false
  if (walletAddress.value && isValidWalletAddress.value) {
    try {
      isAuthenticated = await authClient.value.isAuthenticated()
    } catch {
      toast.error('Auth key expired! Please sign in again.')
    }
    if (!isAuthenticated) {
      toast(ToastWithSiginin, {
        type: TYPE.ERROR
      })
    } else {
      const withdrawResult = await actor.withdraw(
        walletAddress.value,
        BigInt(Number(amount.value) * SATOSHIS_PER_BTC)
      )
      if ('Err' in withdrawResult) {
        toast.error(withdrawResult.Err)
      } else {
        toast.success(withdrawResult.Ok)
        props.onBalance()
      }
    }
  } else {
    toast.error('Input valid destination address!')
  }
  withdrawLoading.value = false
  sliderText.value.textContent = 'Slide to withdraw'
  sliderButton.value.style.left = '0px'
  sliderText.value.style.marginLeft = '44px'
}
</script>
<style scoped>
.slider {
  box-shadow: 0px 1px 1px 1px #000000 inset;
  border: 1px solid var(--neutral-700, #3f3f45);
}
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* For Firefox */
input[type='number'] {
  appearance: textfield;
  -moz-appearance: textfield;
}
</style>
