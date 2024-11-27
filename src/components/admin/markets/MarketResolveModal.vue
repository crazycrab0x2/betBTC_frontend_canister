<template>
  <Dialog :open="visible">
    <DialogContent class="w-[960px] bg-[#0a0a0a]  text-[#FAFAFA]  h-fit rounded-[12px] max-w-none border-none">
      <div class="relative flex flex-col p-[28px]">
        <button
          class="flex flex-row gap-[4px] bg-[#27272A] w-fit px-[12px] py-[6px] rounded-[8px] items-center"
          @click="onClose"
        >
          <Icon icon="iconoir:arrow-left" color="#E4E4E7" width="20" height="20" />
          <span class="inter text-[14px] leading-[20px] font-medium text-[#FAFAFA]">Back</span>
        </button>
        <div class="py-[24px] text-left flex flex-col gap-[48px]">
          <p class="space-grotesk text-[#FAFAFA] text-[24px] leading-[32px] font-medium">
            {{ market.title }}
          </p>
          <div class="max-w-[660px] flex flex-col gap-[48px] font-medium inter mx-auto">
            <p class="text-[14px] leading-[20px] text-[#FAFAFA]">
              {{ market.description }}
            </p>
            <div class="flex flex-col gap-5" v-if="market.options.length > 1">
              <ResolveItem
                v-for="(option, index) in market.options"
                :key="option.option"
                :option="option"
                :index="index"
                :onResolve="handleResolve"
                :result="market.result"
              />
            </div>
            <template v-else>
              <div class="flex flex-row justify-center items-center gap-4" v-if="!market.result">
                <button
                  class="flex justify-center text-[#E88340] text-[14px] leading-[20px] px-[12px] py-[6px] rounded-md border border-[#8C4F27] min-w-[150px]"
                  @click="handleSetResult(0, 'Yes')"
                >
                  <Icon
                    v-if="isResolveYesLoading"
                    icon="eos-icons:bubble-loading"
                    color="#8C4F27"
                    width="20"
                    height="20"
                  />
                  <span v-else>Resolve Yes</span>
                </button>
                <button
                  class="flex justify-center text-[#E88340] text-[14px] leading-[20px] px-[12px] py-[6px] rounded-md border border-[#8C4F27] min-w-[150px]"
                  @click="handleSetResult(0, 'No')"
                >
                  <Icon
                    v-if="isResolveNoLoading"
                    icon="eos-icons:bubble-loading"
                    color="#8C4F27"
                    width="20"
                    height="20"
                  />
                  <span v-else>Resolve No</span>
                </button>
              </div>
              <div v-else class="mx-auto">
                Resolved {{ 'Yes' in market.result!.betType ? 'Yes' : 'No' }}
              </div>
            </template>
            <button
              v-if="market.result"
              class="flex justify-center text-[#E88340] text-xl leading-[20px] px-8 py-4 rounded-md border border-[#8C4F27] max-w-min mx-auto min-w-[150px]"
              @click="handleDistribute"
            >
              <Icon
                v-if="isDistributeLoading"
                icon="eos-icons:bubble-loading"
                color="#8C4F27"
                width="20"
                height="20"
              />
              <span v-else>Distribute</span>
            </button>
          </div>
        </div>
      </div>
      <DialogClose class="close-button" @click="onClose">
        <Icon
          icon="ic:baseline-close"
          color="#ffffff"
          width="24"
          height="24"
          class="cursor-pointer"
        />
      </DialogClose>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { Market } from '@/types/marketDataTypes'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { useToast } from 'vue-toastification'
import { ref } from 'vue'
import ResolveItem from './ResolveItem.vue'
import {
  Dialog,
  DialogContent,
  DialogClose,
} from '@/components/ui/dialog'

const { market, onClose } = defineProps<{
  visible: boolean
  market: Market
  onClose: () => void
}>()

const authStore = useAuthStore()

const isDistributeLoading = ref<Boolean>(false)
const isResolveYesLoading = ref<Boolean>(false)
const isResolveNoLoading = ref<Boolean>(false)
const toast = useToast()
const { backendActor: backendActorRef } = storeToRefs(authStore)
const backendActor = backendActorRef.value

const handleSetResult = async (optionId: number, types: 'Yes' | 'No') => {
  if (optionId === 0 && types === 'Yes') {
    isResolveYesLoading.value = true
  }
  if (optionId === 0 && types === 'No') {
    isResolveNoLoading.value = true
  }
  try {
    toast.info('Resolving...')
    const result = await backendActor.resolve_market(market.id, optionId, types)

    if ('Err' in result) {
      toast.error(result.Err)
      throw new Error(result.Err)
    }
    toast.success('Resolved successfully')
  } catch (error) {
    console.error(error)
  } finally {
    isResolveYesLoading.value = false
    isResolveNoLoading.value = false
  }
}

const handleResolve = (optionId: number, types: string) => {
  return backendActor.resolve_market(market.id, optionId, types)
}

const handleDistribute = async () => {
  try {
    isDistributeLoading.value = true
    const result = await backendActor.distribute(market.id)

    if ('Err' in result) {
      toast.error(result.Err)
      throw new Error(result.Err)
    }
    toast.success('Distributed successfully')
  } catch (error) {
    console.error(error)
  } finally {
    isDistributeLoading.value = false
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}
.modal-content {
  @apply bg-neutral-950;
  /* background: linear-gradient(180deg, #914c1e 0%, #050505 50%); */
  text-align: center;
  color: white;
  position: relative;
  overflow: hidden;
  border-radius: 16px;
}

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
</style>
