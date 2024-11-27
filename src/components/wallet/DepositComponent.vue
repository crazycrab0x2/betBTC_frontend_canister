<template>
  <div class="w-full">
    <div class="flex flex-col gap-8 w-full">
      <div class="self-stretch flex-col justify-start items-start gap-5 flex w-full">
        <div class="flex flex-col gap-4 w-full">
          <div class="self-stretch flex-col justify-center items-start gap-1.5 flex">
            <div class="items-center inline-flex w-full gap-4">
              <template v-if="currentDepositConfirmation !== -1">
                <div class="flex items-center">
                  <div class="text-[#a1a1a9] text-sm font-normal inter leading-tight">
                    Current Deposit confirmation
                  </div>
                  <Icon
                    :icon="depositAmountIconType"
                    color="green"
                    width="40"
                    height="40"
                    class="cursor-pointer"
                  />
                </div>
                <p class="inter text-neutral-200 text-[14px] leading-4 font-medium">
                  {{ currentDepositConfirmation }} block confirmed
                </p>
              </template>
              <template v-else>
                <div class="text-[#a1a1a9] text-sm font-normal inter leading-tight">
                  No upcoming transaction
                </div>
              </template>
            </div>
          </div>
          <hr class="border-t border-t-neutral-700 w-full" />
        </div>
        <div class="self-stretch h-[68px] flex-col justify-center items-start gap-1.5 flex">
          <div class="justify-center items-center gap-1 inline-flex">
            <div class="text-[#a1a1a9] text-sm font-normal inter leading-tight">Wallet address</div>
            <Icon
              icon="hugeicons:circle-lock-02"
              color="#a1a1a9"
              width="16"
              height="16"
              class="cursor-pointer"
            />
          </div>
          <div
            class="self-stretch px-3.5 py-2.5 rounded-xl border border-[#3f3f45] justify-start items-center gap-2 inline-flex"
          >
            <Icon
              v-if="isLoadingDepositAddresses"
              icon="eos-icons:bubble-loading"
              color="#FF9046"
              width="20"
              height="20"
            />
            <div class="flex-grow h-[22px] px-1 justify-between items-center flex overflow-hidden">
              <div class="justify-start items-center gap-2 flex">
                <div class="text-zinc-200 text-base font-medium inter leading-snug">
                  {{ depositAddresses.btc }}
                </div>
              </div>
            </div>
            <Icon
              icon="icon-park-outline:copy"
              width="16"
              height="16"
              class="w-4 h-4 cursor-pointer text-[#A1A1A9] group-hover:text-[#E4E4E7]"
              @click="copyText(depositAddresses.btc ?? '', 'Deposit Address Copied.')"
            />
          </div>
        </div>
        <div class="self-stretch h-[68px] flex-col justify-center items-start gap-1.5 flex">
          <div class="justify-center items-center gap-1 inline-flex">
            <div class="text-[#a1a1a9] text-sm font-normal inter leading-tight">Deposit fee</div>

            <Icon
              icon="hugeicons:circle-lock-02"
              color="#a1a1a9"
              width="16"
              height="16"
              class="cursor-pointer"
            />
          </div>
          <div
            class="self-stretch px-3.5 py-2.5 rounded-xl border border-[#3f3f45] justify-start items-center gap-2 inline-flex"
          >
            <div class="grow shrink basis-0 h-[22px] px-1 justify-between items-center flex">
              <Icon
                v-if="isDepositeFeeLoading"
                icon="eos-icons:bubble-loading"
                color="#FF9046"
                width="20"
                height="20"
              />
              <div v-else class="justify-start items-center gap-2 flex">
                <div class="text-zinc-200 text-base font-medium inter leading-snug">
                  {{ depositeFee }}
                </div>
                <div class="text-zinc-200 text-base font-medium inter leading-snug">BTC</div>
              </div>
            </div>
          </div>
        </div>
        <div class="self-stretch justify-end items-center gap-2 inline-flex">
          <div class="justify-center items-center gap-2 flex cursor-pointer" @click="onShowQR">
            <div class="text-right text-zinc-200 text-sm font-normal inter leading-tight">
              {{ showQR ? 'Hide' : 'Show' }} QR Code
            </div>
          </div>
        </div>
        <Transition>
          <div v-if="showQR" class="overflow-hidden">
            <div class="bg-white p-3 w-fit rounded-[10px] mx-auto">
              <qrcode-vue
                :value="depositAddresses.btc!"
                :size="160"
                :render-as="'svg'"
              ></qrcode-vue>
            </div>
          </div>
        </Transition>
      </div>
    </div>
    <div
      class="flex md:flex-row flex-col-reverse md:justify-between justify-center items-center py-[10px] mt-[10px]"
    >
      <div class="flex flex-col justify-start items-start relative py-[20px]">
        <div
          class="slider relative h-10 w-[184px] bg-zinc-800 rounded-xl border-[1px] border-[#3F3F45] justify-start items-center inline-flex"
        >
          <div
            class="absolute top-0 left-0 m-1 w-8 h-8 oranj-button bg-[#ff9046] rounded-[8px] flex items-center justify-center"
            ref="sliderButton"
            @mousedown="startSlide"
            @touchstart="startSlide"
          >
            <Icon
              v-if="updateBalanceLoading"
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
            />
          </div>
          <div
            ref="sliderText"
            class="text-[#52525A] text-[16px] font-[500] inter leading-[22px] ml-12"
          >
            Update balance
          </div>
          <div
            v-if="isLoadingBalance"
            class="absolute top-0 left-0 w-full h-full cursor-not-allowed"
          ></div>
        </div>
        <!-- <div class="w-full flex flex-col gap-4" :class="depositHistories.length ? 'mt-8' : ''">
        <deposit-history
          v-for="(depositHistory, index) in depositHistories"
          :key="index"
          v-bind="{ ...depositHistory }"
        />
      </div> -->
      </div>
      <div
        class="flex flex-row bg-neutral-900 rounded-xl p-3 hover:opacity-80 transition-opacity duration-200 justify-center gap-[15px] cursor-pointer"
        @click="() => onClickConnectWallet(defaultWallet)"
      >
        <span class="text-white font-[500] text-[16px]">Deposit Bitcoin with </span>
        <img :src="defaultWallet.logo" :alt="defaultWallet.name" class="w-[25px]" />
      </div>
    </div>
    <TransferModal
      v-if="selectedWallet"
      :visible="visible"
      :onClose="onClose"
      :address="depositAddresses.btc!"
      :wallet="selectedWallet!"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, onBeforeMount, computed, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import QrcodeVue from 'qrcode.vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { useToast, TYPE } from 'vue-toastification'
import { HttpAgent, Actor } from '@dfinity/agent'
import { idlFactory as minter } from '@/declarations/ckbtc-minter.did'
import ToastWithSiginin from '../toast/ToastWithSiginin.vue'
// import DepositHistory from './DepositHistory.vue'
// import type { FundLog } from '@/types/notificationTypes'
// import { Principal } from '@dfinity/principal'
import { useHelpers } from '@/composables/useHelpers'
import { copyText } from '@/utils/text'
import TransferModal from './TransferModal.vue'
import config, { defaultWallet, type Wallet } from '@/config'
import { IS_DEVELOPMENT } from '@/config'

const { convertSats2Btc } = useHelpers()
const authStore = useAuthStore()
const { updateBalance } = authStore
const toast = useToast()
const {
  authClient,
  backendActor,
  depositAddresses,
  isLoadingDepositAddresses,
  isLoadingBalance
  // userPrincipal
} = storeToRefs(authStore)
const currentDepositConfirmation = ref<number>(-1)

const showQR = ref(false)
const updateBalanceLoading = ref(false)
const sliderButton = ref<HTMLDivElement | null>(null)
const sliderText = ref<HTMLDivElement | null>(null)
const actor = backendActor.value
// const depositHistories = ref<FundLog[]>([])
const depositIntervalId = ref<any>(0)
const visible = ref<boolean>(false)
const selectedWallet = ref<Wallet>()

const onClose = () => {
  visible.value = false
}

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
  updateBalanceLoading.value = true
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
    if (depositIntervalId.value) clearTimeout(depositIntervalId.value)
    await updateBalanceProcess(true)
  }
  updateBalanceLoading.value = false
  sliderText.value.textContent = 'Update balance'
  sliderButton.value.style.left = '0px'
  sliderText.value.style.marginLeft = '48px'
}

const onShowQR = () => {
  if (depositAddresses.value.btc) showQR.value = !showQR.value
}

const depositeFee = ref<any>()
const isDepositeFeeLoading = ref<boolean>(false)

const depositAmountIconType = computed<string>(() => {
  switch (currentDepositConfirmation.value) {
    case 1:
      return 'bitcoin-icons:confirmations-1-filled'
    case 2:
      return 'bitcoin-icons:confirmations-2-filled'
    case 3:
      return 'bitcoin-icons:confirmations-3-filled'
    case 4:
      return 'bitcoin-icons:confirmations-4-filled'
    case 5:
      return 'bitcoin-icons:confirmations-5-filled'
    case 6:
      return 'line-md:circle-to-confirm-circle-transition'

    default:
      return 'line-md:circle-to-confirm-circle-transition'
  }
})

onBeforeMount(async () => {
  try {
    isDepositeFeeLoading.value = true

    const canisterId = config.VITE_CANISTER_ID_CKBTC_MINTER
    const agent = HttpAgent.createSync({ host: 'https://ic0.app' })
    const actor = Actor.createActor(minter, { agent, canisterId })
    const fetchedDepositeFee = await actor.get_deposit_fee()
    depositeFee.value = convertSats2Btc(Number(fetchedDepositeFee))
    // const fundlogs = (await backendActor.value.get_fund_activity_logs(
    //   Principal.from(userPrincipal.value),
    //   [{ Deposit: null }]
    // )) as FundLog[]
    // depositHistories.value = fundlogs
  } catch (error) {
    console.error('error ======> ', error)
  } finally {
    isDepositeFeeLoading.value = false
  }
})

const updateBalanceProcess = async (notifyErr: boolean) => {
  try {
    const depositResult = await actor.update_balance()
    if ('Ok' in depositResult) {
      toast.success(`${convertSats2Btc(Number(depositResult.Ok))} ckBTC minted.`)
      updateBalance()
    } else if ('Err' in depositResult) {
      if ('NoTransaction' in depositResult.Err) {
        currentDepositConfirmation.value = -1
      }

      if ('Pending' in depositResult.Err) {
        currentDepositConfirmation.value = Number(depositResult.Err.Pending.confirmations)
      }

      if (notifyErr) {
        if ('GenericError' in depositResult.Err) {
          toast.error(depositResult.Err.GenericError)
        }

        if ('TemporarilyUnavailable' in depositResult.Err) {
          toast.error(depositResult.Err.TemporarilyUnavailable)
        }

        if ('AlreadyProcessing' in depositResult.Err) {
          toast.error(depositResult.Err.AlreadyProcessing)
        }

        if ('CanisterCallError' in depositResult.Err) {
          toast.error(depositResult.Err.CanisterCallError)
        }
      }
    }
  } catch (error) {
    console.error('====>', error)
  }
}

const depositInterval = async () => {
  await updateBalanceProcess(false)
  depositIntervalId.value = setTimeout(depositInterval, 10000)
}

const onClickConnectWallet = (wallet: Wallet) => {
  selectedWallet.value = wallet
  visible.value = true
}

onMounted(async () => {
  await depositInterval()
})

onBeforeMount(() => {
  if (depositIntervalId.value) clearTimeout(depositIntervalId.value)
})
</script>
<style scoped>
.slider {
  box-shadow: 0px 1px 1px 1px #000000 inset;
  border: 1px solid var(--neutral-700, #3f3f45);
}
/* we will explain what these classes do next! */
.v-enter-active,
.v-leave-active {
  height: 184px;
  transition: height 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  height: 0px;
}
</style>
