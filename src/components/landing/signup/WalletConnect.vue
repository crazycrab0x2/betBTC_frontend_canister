<template>
  <div class="z-[2] bg-neutral-800 rounded-xl flex flex-col gap-8 p-6 justify-center items-start">
    <div class="flex flex-row items-center justify-start gap-2">
      <button @click="onClose">
        <Icon icon="ic:round-arrow-back-ios-new" />
      </button>
      <div>{{ wallet.name }}</div>
    </div>
    <div class="flex flex-col items-center w-full justify-center gap-6">
      <div class="bg-neutral-900 rounded-2xl p-6 w-fit">
        <img :src="wallet.logo" :alt="wallet.name" class="w-12 h-12" />
      </div>
      <div class="flex flex-col gap-2">
        <p class="text-neutral-200 text-md">Continue in {{ wallet.name }}</p>
        <span class="text-neutral-400 text-sm">{{ description }}</span>
      </div>
      <div
        v-if="!notFound"
        :class="
          'bg-neutral-900 rounded-3xl px-2 py-1 inline-flex flex-row items-center justify-center gap-1 ' +
          (status === 'loading'
            ? 'text-neutral-200'
            : status === 'success'
              ? 'text-green-500'
              : 'text-red-500')
        "
      >
        <Icon
          v-if="status === 'loading'"
          icon="eos-icons:bubble-loading"
          class="text-neutral-200"
        />
        <Icon
          v-if="status === 'error'"
          icon="fluent:circle-line-24-regular"
          class="rotate-45 scale-105 text-red-500"
        />
        <Icon
          v-if="status === 'success'"
          icon="teenyicons:tick-circle-outline"
          class="text-green-500"
        />
        <span v-if="status === 'loading'">Loading:</span>
        <span v-if="status === 'error'">Error:</span>
        <span v-if="status === 'success'">Success:</span>
        <span>{{ statusMessage }}</span>
      </div>
      <div v-if="notFound" class="text-center w-full">
        <span class="text-neutral-400">Don&apos;t have {{ wallet.name }}? &nbsp;</span>
        <a target="_blank" rel="external" :href="wallet.link" class="text-accent-500"
          >Get it here</a
        >
      </div>
      <button
        v-if="!notFound && status === 'error' && wallet.type === 'btc'"
        class="inline-flex flex-row gap-2 items-center justify-center border border-neutral-700 px-3 py-2 rounded-lg hover:bg-neutral-900 transition-colors duration-200"
        :onclick="() => handleBtcLogin(wallet.id as BTCWalletProviderKey)"
      >
        <Icon icon="akar-icons:arrow-counter-clockwise" />Try Again
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { Icon } from '@iconify/vue'
import type { Wallet } from '@/config'
import { useAuthStore } from '@/stores/auth'
import type { WalletProviderKey as BTCWalletProviderKey } from '@/stores/temp'

const { wallet } = defineProps<{
  wallet: Wallet
  onClose: () => void
}>()

type Status = 'loading' | 'success' | 'error'

const status = ref<Status>('loading')
const notFound = ref(false)
const description = ref('Accept connection request in the wallet')
const statusMessage = ref('Connection and security')

const authStore = useAuthStore()
const { setBtcAuthStatus, handleBtcLogin } = authStore
const { btcAuthStatus, btcAuthError } = storeToRefs(authStore)

setBtcAuthStatus('CONNECTING')
onBeforeMount(() => {
  try {
    if (wallet.type == 'btc') {
      const walletKey = wallet.id.split('.')[0]
      if (!walletKey || !(window as any)[walletKey]) {
        notFound.value = true
      }
    } else {
      if (wallet.id == 'ii') notFound.value = false
      else notFound.value = true
    }
  } catch (error) {
    notFound.value = true
    console.error(error)
  }
})

watch(
  () => btcAuthStatus.value,
  (val) => {
    switch (val) {
      case 'CONNECTING':
        status.value = 'loading'
        statusMessage.value = 'Connecting to your wallet'
        description.value = 'Please accept connection request in your wallet'
        break
      case 'PREPARING':
        status.value = 'loading'
        statusMessage.value = 'Preparing sign data'
        description.value = 'Please wait a little'

        break
      case 'SIGNING':
        status.value = 'loading'
        statusMessage.value = 'Signing data'
        description.value = 'Sign message in your wallet'
        break
      case 'AUTHENTICATING':
        status.value = 'loading'
        statusMessage.value = 'Authenticating'
        description.value = 'You will be signed in soon.'

        break
      case 'AUTHENTICATED':
        status.value = 'success'
        statusMessage.value = 'Authenticated'
        description.value = 'You are signed in'
        break
      case 'ERROR':
        status.value = 'error'
        statusMessage.value = btcAuthError.value!
        description.value = 'Something went wrong. please try again'
        break
      default:
        status.value = 'loading'
        statusMessage.value = 'Connection and security'
    }
  }
)
</script>
