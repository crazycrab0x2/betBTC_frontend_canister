<template>
  <Dialog :open="visible">
    <DialogContent class="[&>button]:hidden w-[350] h-fit rounded-[16px] bg-[#0a0a0a]  text-[#FAFAFA] border-none max-w-none flex p-4 justify-center items-center">
      <DialogClose as-child class="close-button" @click="onClose">
        <Icon
          icon="ic:baseline-close"
          color="#ffffff"
          width="48"
          height="48"
          class="cursor-pointer"
        />
      </DialogClose>
      <div class="flex flex-col gap-[60px] pt-[40px] pb-[20px]">
        <div>
          <p class="text-[24px] text-center font-[500] space-grotesk mb-4">Deposit with {{ wallet.name }}</p>
        </div>
        <div class="self-stretch flex-col justify-center items-start gap-[10px] flex">
          <div class="justify-center items-center gap-1 inline-flex">
            <div class="text-[#a1a1a9] text-sm font-normal inter leading-tight">Amount</div>
          </div>
          <div
            class="group w-full flex gap-2 items-center rounded-[12px] px-[18px] py-[10px] border-[#3F3F45] hover:border-[#52525A] focus-within:!border-[#B56632] border-[1px]"
          >
            <input
              type="number"
              v-model="amount"
              placeholder="Deposit amount"
              class="outline-none bg-transparent placeholder-[#A1A1A9] inter font-[500] text-[16px] leading-[22px] text-[#E4E4E7] flex-grow"
            />
            <p class="text-right text-[#a1a1a9] text-[13px] font-normal inter leading-none">
              Bitcoin
            </p>
          </div>
          <error-message v-if="errorMsg" :message="errorMsg" />
        </div>
        <div
          class="flex flex-row bg-neutral-900 rounded-xl p-3 hover:opacity-80 transition-opacity duration-200 justify-center gap-[15px] cursor-pointer"
          @click="() => onClickWallet(wallet)"
        >
          <span class="text-white font-[500] text-[16px]">Deposit</span>
        </div>
      </div>      
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { defaultWallet, type Wallet } from '@/config'
import ErrorMessage from '../message/ErrorMessage.vue'
import { useToast } from 'vue-toastification'
import type { WalletProviderKey as BTCWalletProviderKey } from '@/stores/temp'
import { getWalletProvider } from '@/stores/temp'
import {
  Dialog,
  DialogContent,
  DialogClose,
} from '@/components/ui/dialog'

const { onClose, address } = defineProps<{
  wallet: Wallet
  visible: boolean
  address: string
  onClose: () => void
}>()

const toast = useToast()
const MIN_AMOUNT = 0.000015
const amount = ref<number>(0)
const errorMsg = ref<string>('')

watch(
  () => amount.value,
  () => {
    if (amount.value < MIN_AMOUNT) errorMsg.value = 'Minimum amount is 0.000015BTC.'
    else errorMsg.value = ''
  }
)

const onClickWallet = (wallet: Wallet) => {
  if (amount.value < MIN_AMOUNT) {
    errorMsg.value = 'Minimum amount is 0.000015BTC.'
    return
  }
  switch (wallet.type) {
    case 'icp':
      toast.info('Coming Soon')
      break
    case 'btc':
      onClickWithBtc(wallet.id as BTCWalletProviderKey)
      break
    default:
      console.error(`Unknown wallet type: ${wallet.type}`)
      break
  }
}

const onClickWithBtc = async (providerKey: BTCWalletProviderKey) => {
  const provider = getWalletProvider(providerKey)
  if (provider) {
    try {
      const txid = await provider.sendBitcoin(address, amount.value * 100_000_000)
      toast.success('Deposited Successfully.')
    } catch (error: any) {
      errorMsg.value = error?.message ?? 'Unknow Error'
    }
  } else {
    errorMsg.value = 'Please install XverseWallet.'
  }
}
</script>

<style scoped>
.close-button {
  z-index: 20;
  position: absolute;
  padding: 10px;
  top: 10px;
  right: 10px;
  /* background-color: #ff90460d; */
  border-radius: 12px;
  color: white;
}

.close-button:hover {
  background-color: #ff90461a;
}

.close-button:active {
  background-color: #ff90460d;
  box-shadow: 0px 0px 0px 4px #ff904633;
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
