<template>
  <div class="flex flex-col gap-8 w-full">
    <div class="self-stretch flex-col justify-start items-start gap-5 flex">
      <div class="self-stretch flex-col justify-center items-start gap-1.5 flex">
        <div class="justify-center items-center gap-1 inline-flex">
          <div class="text-[#a1a1a9] text-sm font-normal inter leading-tight">User Id</div>
        </div>
        <div
          class="group w-full flex gap-2 items-center rounded-[12px] px-[18px] py-[10px] border-[#3F3F45] hover:border-[#52525A] focus-within:!border-[#B56632] border-[1px]"
        >
          <input
            v-model="toPrincipal"
            placeholder="User Id"
            spellcheck="false"
            class="outline-none bg-transparent placeholder-[#A1A1A9] inter font-[500] text-[16px] leading-[22px] text-[#E4E4E7] flex-grow"
          />
        </div>
        <error-message v-if="!isValidUserPrincipal" message="Invalid user principal" />
      </div>
      <div class="self-stretch flex-col justify-center items-start gap-1.5 flex">
        <div class="justify-center items-center gap-1 inline-flex">
          <div class="text-[#a1a1a9] text-sm font-normal inter leading-tight">Transfer Amount</div>
        </div>
        <div
          class="group w-full flex gap-2 items-center rounded-[12px] px-[18px] py-[10px] border-[#3F3F45] hover:border-[#52525A] focus-within:!border-[#B56632] border-[1px]"
        >
          <input
            v-model="amount"
            type="number"
            placeholder="Transfer amount"
            class="outline-none bg-transparent placeholder-[#A1A1A9] inter font-[500] text-[16px] leading-[22px] text-[#E4E4E7] flex-grow"
          />
        </div>
        <error-message
          v-if="Number(amount) > 0 && Number(Number(amount).toFixed(8)) == 0"
          message="Amount is too small"
        />
      </div>
      <div class="flex flex-col gap-3 w-full">
        <div class="flex flex-col gap-5 rounded-[12px] p-[14px] bg-[#27272A] w-full">
          <div class="flex flex-col gap-3">
            <div class="flex justify-between items-center px-[14px]">
              <p class="inter leading-[16px] text-[12px] text-[#A1A1A9] font-[400]">Subtotal</p>
              <p class="inter leading-[22px] text-[16px] text-[#E4E4E7] font-[500]">
                {{ Number(amount).toFixed(8) }} BTC
              </p>
            </div>
            <div class="flex justify-between items-center px-[14px]">
              <p class="inter leading-[16px] text-[12px] text-[#A1A1A9] font-[400]">Transfer fee</p>
              <p class="inter leading-[22px] text-[16px] text-[#E4E4E7] font-[500]">
                0.00000010 BTC
              </p>
            </div>
          </div>
          <div class="border-b-[1px] border-b-[#3F3F45]"></div>
          <div class="flex justify-between items-center px-[14px]">
            <p class="inter leading-[16px] text-[12px] text-[#A1A1A9] font-[400]">Total amount</p>
            <p class="inter leading-[22px] text-[16px] text-[#E4E4E7] font-[500]">
              <span class="text-[#FF9046]">{{
                (Number(amount) + Number(0.0000001)).toFixed(8)
              }}</span>
              BTC
            </p>
          </div>
        </div>
        <div class="flex items-center gap-1" v-if="!userPrincipal">
          <Icon icon="fluent-mdl2:error" color="#DD524C" width="14" height="14" />
          <p class="inter text-[12px] leading-[16px] text-[#DD524C] font-[400]">
            Input receiver principal.
          </p>
        </div>
      </div>
    </div>
    <div class="relative flex-col justify-start items-start gap-2 flex">
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
            v-if="transferLoading"
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
          class="text-[#52525A] text-[16px] font-[500] inter leading-[22px] ml-12"
        >
          Slide to transfer
        </div>
      </div>
      <div
        v-if="!userPrincipal || Number(amount) == 0 || !isValidUserPrincipal"
        class="absolute top-0 left-0 w-full h-full cursor-not-allowed"
      ></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useAuthStore } from '@/stores/auth'
import { useHelpers, SATOSHIS_PER_BTC } from '@/composables/useHelpers'
import { storeToRefs } from 'pinia'
import { useToast } from 'vue-toastification'
import ErrorMessage from '../message/ErrorMessage.vue'
import { Principal } from '@dfinity/principal'

const props = defineProps({
  onBalance: {
    type: Function,
    required: true
  }
})

const authStore = useAuthStore()
const toast = useToast()
const { isValidPrincipal } = useHelpers()
const { userPrincipal, authClient, backendActor } = storeToRefs(authStore)

const toPrincipal = ref('')
const amount = ref('0.0')

const isValidUserPrincipal = computed<boolean>(() => {
  if (toPrincipal.value) {
    return isValidPrincipal(toPrincipal.value)
  }
  return true
})

const transferLoading = ref(false)
const sliderButton = ref<HTMLDivElement | null>(null)
const sliderText = ref<HTMLDivElement | null>(null)
const actor = backendActor.value

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
  transferLoading.value = true
  let isAuthenticated = false
  if (toPrincipal.value && isValidUserPrincipal.value) {
    try {
      isAuthenticated = await authClient.value.isAuthenticated()
    } catch {
      toast.error('Auth key expired! Please sign in again.')
    }
    if (!isAuthenticated) {
      toast.error('Auth key expired! Please sign in again.')
    } else {
      const transferResult = (await actor.transfer(
        Principal.from(toPrincipal.value),
        BigInt(Math.floor(Number(amount.value) * SATOSHIS_PER_BTC))
      )) as [string, string]
      if (transferResult[1]) {
        toast.error(transferResult[1])
      } else {
        toast.success(transferResult[0])
        props.onBalance()
      }
    }
  } else {
    toast.error('Input user principal!')
  }
  transferLoading.value = false
  sliderText.value.textContent = 'Slide to transfer'
  sliderButton.value.style.left = '0px'
  sliderText.value.style.marginLeft = '48px'
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
