<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="p-2 bg-[#18181B] w-full">
    <div
      class="relative bg-[#121212] rounded-[12px] border-[#27272A] border-[1px] flex flex-col gap-8 w-full h-full px-4 md:px-8 lg:px-16 py-4 md:py-6 lg:py-8"
    >
      <p class="text-neutral-50 text-[32px] font-medium space-grotesk leading-10 text-left">
        Activity
      </p>
      <container class="flex flex-col justify-center gap-6">
        <tabs v-model="currentTab">
          <tab name="payouts" title="Payouts">
            <div>
              <Payouts />
            </div>
          </tab>
          <tab name="notifications" title="Notifications">
            <div>
              <Notifications />
            </div>
          </tab>
          <tab name="transactions" title="Transactions">
            <div>
              <Transactions />
            </div>
          </tab>
          <tab name="rewards" title="Rewards">
            <div>
              <Rewards />
            </div>
          </tab>
        </tabs>
      </container>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import ActivityTable from './ActivityTable.vue'
import Container from '@/components/container/Container.vue'
import Tabs from '@/components/tabs/Tabs.vue'
import Tab from '@/components/tabs/Tab.vue'
import Payouts from './Payouts.vue'
import Notifications from './Notifications.vue'
import Transactions from './Transactions.vue'
import Rewards from './Rewards.vue'
import { useLayoutStore } from '@/stores/layout'
import { storeToRefs } from 'pinia'

const layoutStore = useLayoutStore()
const { keyboardHeight } = storeToRefs(layoutStore)
const keyboard = ref<HTMLInputElement | null>(null)
const currentTab = ref('payouts')

watch(
  () => keyboardHeight.value,
  () => {
    if (keyboard.value) keyboard.value.style.marginBottom = `${keyboardHeight.value}px`
  }
)
</script>
