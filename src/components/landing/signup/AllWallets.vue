<template>
  <div class="z-[2] bg-neutral-800 rounded-xl flex flex-col gap-8 p-6 justify-center items-start">
    <div class="inline-flex flex-row gap-2">
      <button @click="onClose">
        <Icon icon="ic:round-arrow-back-ios-new" />
      </button>
      <div class="text-white">Wallets</div>
    </div>
    <form-input placeholder="Search Wallet" v-model="searchText" @input="handlerSearchTxtChange">
      <template #prefix>
        <Icon icon="icon-park-outline:search" color="#A1A1A9" width="22" height="22" />
      </template>
    </form-input>
    <div class="flex flex-col gap-6">
      <div
        v-for="walletsPerNetwork in filterdWallets"
        class="flex flex-col gap-3 items-start justify-start"
        :key="walletsPerNetwork.title"
      >
        <p class="text-neutral-400 font-medium font-inter text-xs">{{ walletsPerNetwork.title }}</p>
        <div class="flex flex-row gap-4">
          <button
            v-for="wallet in walletsPerNetwork.wallets"
            :key="wallet.id"
            @click="() => onClickWallet(wallet)"
            class="bg-neutral-900 rounded-xl p-3 hover:opacity-80 transition-opacity duration-200 w-fit"
          >
            <img :src="wallet.logo" :alt="wallet.name" class="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  onClickWallet: (wallet: Wallet) => void
  onClose: () => void
}>()

import { ref } from 'vue'
import { Icon } from '@iconify/vue'

import { wallets, type Wallet } from '@/config'
import FormInput from '@/components/form/Input.vue'

const supportedWallets = [
  { title: 'ICP Wallets', wallets: wallets.icp },
  { title: 'BTC Wallets', wallets: wallets.btc }
]

const searchText = ref('')
const filterdWallets = ref(supportedWallets)

const handlerSearchTxtChange = () => {
  const result = supportedWallets
    .map((v) => {
      return {
        title: v.title,
        wallets: v.wallets.filter(
          (a) => a.name.toLowerCase().indexOf(searchText.value.toLowerCase()) >= 0
        )
      }
    })
    .filter((item) => item.wallets.length > 0)
  filterdWallets.value = result
}
</script>
