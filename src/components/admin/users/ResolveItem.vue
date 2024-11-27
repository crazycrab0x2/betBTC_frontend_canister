<template>
  <div
    class="flex flex-row justify-between items-center p-2"
    :class="result?.optionId === index ? 'border border-red-600 rounded-md' : ''"
  >
    <div class="flex flex-row gap-[12px] items-center">
      <span class="text-[#A1A1A9] text-[12px] leading-[16px]"> Option {{ index + 1 }} </span>
      <span class="text-[16px] leading-[22px] text-[#E4E4E7]">{{ option.option }}</span>
    </div>
    <button
      class="flex justify-center min-w-[150px] text-[#E88340] text-[14px] leading-[20px] px-[12px] py-[6px] rounded-[8px] border-[1px] border-[#8C4F27]"
      v-if="!result"
      @click="handleSetResult"
    >
      <Icon
        v-if="isLoading"
        icon="eos-icons:bubble-loading"
        color="#8C4F27"
        width="20"
        height="20"
      />
      <span v-else>Resolve</span>
    </button>
    <p v-else>{{ result!.optionId === index ? 'Resolved' : '' }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { MarketOption, MarketResult } from '@/types/marketDataTypes'
import type { Result } from '@/backend/betbtc-backend.did'
import { Icon } from '@iconify/vue'
import { useToast } from 'vue-toastification'

const { option, onResolve, index } = defineProps<{
  option: MarketOption
  result?: MarketResult
  index: number
  onResolve: (args_1: number, args_2: string) => Promise<Result>
}>()

const isLoading = ref<Boolean>(false)
const toast = useToast()

const handleSetResult = async () => {
  try {
    isLoading.value = true
    const result = await onResolve(index, 'Yes')
    if ('Err' in result) {
      toast.error(result.Err)
      throw new Error(result.Err)
    }
    toast.success('Successfully Resolved')
  } catch (error) {
    toast.error('Resolve Failed')
  } finally {
    isLoading.value = false
  }
}
</script>
