<template>
  <table-row>
    <table-cell>
      <input class="cursor-pointer accent-[#E4E4E7]" type="checkbox" />
    </table-cell>
    <table-cell>
      <div class="flex items-center gap-3">
        <img
          :src="market.image"
          width="40"
          class="rounded-[4px] object-cover aspect-square hidden sm:!block"
        />
        <a
          class="text-[#A1A1A9] inter font-[400] text-[14px] leading-[20px] overflow-hidden underline"
          :href="`/market/${market.id}`"
        >
          {{ market.title }}
        </a>
      </div>
    </table-cell>
    <table-cell>
      <p class="text-[#A1A1A9] inter font-[400] text-[14px] leading-[20px] overflow-hidden">
        {{ market.id }}
      </p>
    </table-cell>
    <table-cell>
      <p class="text-[#A1A1A9] inter font-[400] text-[14px] leading-[20px] overflow-hidden">
        {{ DateTime.fromMillis(Number(market.expireAt)).toFormat('MM/dd/yyyy') }}
      </p>
    </table-cell>
    <table-cell>
      <a
        class="text-[#A1A1A9] inter font-[400] text-[14px] leading-[20px] overflow-hidden underline"
        :href="getCkBtcLink(market.id)"
        target="_blank"
      >
        ckBTC Account
      </a>
    </table-cell>

    <table-cell>
      <div class="flex sm:flex-row flex-col gap-[10px] justify-between">
        <button
          class="flex justify-center border-[1px] border-[#8C4F27] rounded-[8px] py-[6px] px-[12px] text-[#E88340] text-[13px] font-[500] leading-[20px]"
          :class="{ 'cursor-not-allowed': market.closedAt }"
          :disabled="!!market.closedAt"
          @click="() => onClick(market.id)"
        >
          {{ market.result ? (market.closedAt ? 'Closed' : 'Distribute') : 'Resolve' }}
        </button>
        <button
          class="flex flex-row gap-[8px] border-[1px] min-w-[80px] justify-center border-[#DD524C] rounded-[8px] py-[6px] px-[12px] text-[#DD524C] text-[13px] font-[500] leading-[20px] text-center"
          @click="revealDeleteConfirmationModal"
        >
          <Icon
            v-if="isRemoveLoading"
            icon="eos-icons:bubble-loading"
            color="#DD524C"
            width="20"
            height="20"
          />
          <span v-else>Remove</span>
        </button>
        <button
          class="flex justify-center border-[1px] border-[#8C4F27] rounded-[8px] py-[6px] px-[12px] text-[#E88340] text-[13px] font-[500] leading-[20px]"
          @click="() => onEdit(market.id)"
        >
          Edit
        </button>
      </div>
    </table-cell>
  </table-row>
  <Dialog :open="isRevealedConfirmationModal">
    <DialogContent class="bg-[#0a0a0a]  text-[#FAFAFA] [&>button]:hidden rounded-[12px] border-none max-w-none w-auto p-10 rounded-2xl">
      <DialogHeader class="flex justify-center items-center" >
        <DialogTitle >Are you sure you want to delete this item?</DialogTitle>
      </DialogHeader>
      <div class="flex gap-8 justify-center pt-4 items-center">
        <Button
          @click="confirmConfirmationModal"
          class="border-[1px] border-[#DD524C] rounded-[8px] py-[6px] px-[20px] text-[#DD524C] text-[13px] font-[500] leading-[20px] text-center bg-transparent"
        >
          Yes
        </Button>
        <Button
          @click="cancelConfirmationModal"
          class="border-[1px] border-[#DD524C] rounded-[8px] py-[6px] px-[20px] text-[#DD524C] text-[13px] font-[500] leading-[20px] text-center bg-transparent"
        >
          No
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import type { Market } from '@/types/marketDataTypes'
import { TableRow, TableCell } from '@/components/table'
import { ref } from 'vue'
import { useConfirmDialog } from '@vueuse/core'
import { useToast } from 'vue-toastification'
import { Icon } from '@iconify/vue'
import { sha256 } from 'js-sha256'
import type { IcrcAccount } from '@dfinity/ledger-icrc'
import { Principal } from '@dfinity/principal'
import { canisterId as backendCanisterId } from '@/backend'
import { getBtcLink } from '@/utils/explorer'
import { DateTime } from 'luxon'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const props = defineProps<{
  market: Market
  onClick: (id: string) => void
  onRemove: (args_0: string) => Promise<boolean>
  onEdit: (marketId: string) => void
}>()

const toast = useToast()
const isRemoveLoading = ref<Boolean>(false)

const {
  reveal: revealDeleteConfirmationModal,
  isRevealed: isRevealedConfirmationModal,
  cancel: cancelConfirmationModal,
  confirm: confirmConfirmationModal,
  onConfirm: onConfirmModal
} = useConfirmDialog()

onConfirmModal(async () => {
  try {
    isRemoveLoading.value = true

    const result = await props.onRemove(props.market.id)
    if (result) {
      toast.info('Removed Successfully')
    } else {
      toast.error('MarketID is wrong!')
    }
  } catch (e) {
    toast.error('Something went wrong')
  } finally {
    isRemoveLoading.value = false
  }
})

const getCkBtcLink = (marketId: string) => {
  const hash = sha256.create()
  hash.update(marketId)

  const account: IcrcAccount = {
    owner: Principal.fromText(backendCanisterId),
    subaccount: hash.array()
  }

  return getBtcLink(account)
}
</script>

<style scoped>
</style>
