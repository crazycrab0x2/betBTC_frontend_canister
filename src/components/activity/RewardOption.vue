<template>
  <div class="flex gap-3">
    <template v-if="referredUserId">
      <img src="/default0.svg" alt="" class="rounded-full w-10 h-10" />
    </template>
    <template v-else>
      <UserAvatar v-if="profile?.avatar" :user="profile" />
    </template>
    <div class="flex flex-col flex-grow">
      <p class="inter mt-2 font-[400] text-[14px] leading-5 text-neutral-200">
        {{ setContent(content, user.displayName || user.handle)
        }}{{ ` and earned ${point} points.` }}
      </p>
      <div
        v-if="content.includes('deposit') || content.includes('bet')"
        class="bg-neutral-800 overflow-hidden rounded-xl px-[14px] flex flex-col gap-5 items-start transition-all duration-300 ease-in-out"
        :class="isSeeMore ? 'max-h-[600px] py-[14px] mt-2' : 'max-h-0 py-0 mt-0'"
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
              <p class="inter text-neutral-400 text-[12px] leading-4 font-normal">Transaction ID</p>
              <button @click="copyText(id ?? '', 'Transaction ID Copied!')">
                <Icon icon="ph:copy-duotone" color="#A1A1A9" width="18" height="18" />
              </button>
            </div>
            <p class="inter text-neutral-200 font-medium text-[14px] leading-5">{{ id }}</p>
          </div>
          <div v-if="amount" class="flex items-center justify-between w-full">
            <p class="inter text-neutral-400 text-[12px] leading-4 font-normal">
              Deposit Amount (BTC)
            </p>
            <p class="inter text-neutral-200 font-medium text-[14px] leading-5">
              {{ amount }}
            </p>
          </div>
        </div>
      </div>
      <template v-if="content.includes('deposit') || content.includes('bet')">
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
                isSeeMore = true
              }
            "
          >
            <Icon icon="ic:baseline-plus" color="#A1A1A9" width="14" height="14" />
            <span class="inter leading-4 text-[12px] font-[400] text-neutral-400"> See More </span>
          </button>
        </template>
      </template>
    </div>
    <DateTime :timestamp="Number(timestamp)" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import type { Reward } from '../../types/notificationTypes'
import { copyText } from '@/utils/text'

import { useHelpers } from '@/composables/useHelpers'
import UserAvatar from '../common/UserAvatar.vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

const { formatTimestamp } = useHelpers()
const authStore = useAuthStore()
const { profile } = storeToRefs(authStore)

withDefaults(defineProps<Reward>(), {})
const isSeeMore = ref<boolean>(false)

const setContent = (content: string, owner: string) => {
  if (content == 'Register') return 'Setup profile'
  else if (content == 'Invite') return `${owner} signed up using your referral`
  else if (content == 'placed their first bet' || content == 'made their first deposit')
    return `${owner} ${content}`
  else return content
}
</script>
