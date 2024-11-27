<template>
  <table-row>
    <table-cell>
      <input class="cursor-pointer accent-[#E4E4E7]" type="checkbox" />
    </table-cell>
    <table-cell>
      <div class="flex items-center gap-3">
        <UserAvatar :user="user"/>
        <p class="text-[#A1A1A9] inter font-[400] text-[14px] leading-[20px] overflow-hidden">
          {{ user.displayName || user.handle }}
        </p>
      </div>
    </table-cell>
    <table-cell>
      <p class="text-[#A1A1A9] inter font-[400] text-[14px] leading-[20px] overflow-hidden">
        {{ user.id }}
      </p>
    </table-cell>
    <table-cell>
      <a
        class="text-[#A1A1A9] inter font-[400] text-[14px] leading-[20px] overflow-hidden underline"
        :href="getCkBtcLink(user.id)"
        target="_blank"
      >
        ckBTC account
      </a>
    </table-cell>
    <table-cell>
      <div class="flex sm:flex-row flex-col gap-[10px] justify-between">TODO</div>
    </table-cell>
  </table-row>
</template>

<script setup lang="ts">
import { TableRow, TableCell } from '@/components/table'
import { ref } from 'vue'
import { useConfirmDialog } from '@vueuse/core'
import { useToast } from 'vue-toastification'
import type { User } from '@/types/profileDataTypes'
import { Principal } from '@dfinity/principal'
import { sha256 } from 'js-sha256'
import { canisterId as backendCanisterId } from '@/backend'
import { type IcrcAccount } from '@dfinity/ledger-icrc'
import { getBtcLink } from '@/utils/explorer'
import UserAvatar from '@/components/common/UserAvatar.vue'

const props = defineProps<{
  user: User
  onClick: (id: string) => void
  onRemove: (args_0: string) => Promise<boolean>
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

    const result = await props.onRemove(props.user.id)
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

const getCkBtcLink = (userId: string) => {
  const subaccount = Principal.fromText(userId)

  const hash = sha256.create()
  hash.update(subaccount.toUint8Array())

  const account: IcrcAccount = {
    owner: Principal.fromText(backendCanisterId),
    subaccount: hash.array()
  }

  return getBtcLink(account)
}
</script>

<style scoped>
</style>
