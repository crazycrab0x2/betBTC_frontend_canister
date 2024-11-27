<template>
  <Dialog :open="isSignupModal">
    <DialogContent class="bg-[#0a0a0a]  text-[#FAFAFA] border-none w-[350px] md:w-[400px] h-fit p-[1px] rounded-[16px] max-w-none">
      <div class="relative flex flex-col px-4 md:px-6">
        <DialogClose class="close-button relative" @click="onClose">
          <Icon
            icon="ic:baseline-close"
            color="#ffffff"
            width="24"
            height="24"
            class="cursor-pointer"
          />
        </DialogClose>
        <div class="flex items-center justify-center h-[200px]">
          <img
            src="/horizontal_logo.svg"
            alt="betBTC Logo"
            class="logo w-[134px] my-24 mx-auto z-[1]"
          />
        </div>
        <div class="mb-8 flex justify-center items-center">
          <p class="text-[24px] font-[500] space-grotesk mb-4">
            {{ isSignup ? 'Sign up to start betting' : 'Sign In to start betting' }}
          </p>
        </div>
        <div class="flex flex-col gap-6 mb-6">
          <div class="flex flex-col gap-1.5">
            <div
              v-if="isSignup"
              class="flex items-center border border-[#717179] rounded-[12px] px-[18px] bg-[#3F3F45] focus-within:!border-[#B56632]"
            >
              <img src="/alpha.svg" alt="user handle" class="mr-2" />
              <input
                v-model="username"
                class="flex-grow py-[10px] outline-none bg-[#3F3F45] text-[#E4E4E7] placeholder-[#717179] inter font-[500] text-[16px] leading-[22px]"
                placeholder="Choose user handle"
              />
            </div>
            <error-message v-if="usernameError && isSignup" :message="usernameError" />
          </div>
          <div
            v-if="isSignup"
            class="flex items-center border-[1px] border-[#717179] rounded-[12px] px-[18px] bg-[#3F3F45] focus-within:!border-[#B56632]"
          >
            <img src="/referral.svg" alt="referral" class="mr-2" />
            <input
              v-model="referralCode"
              class="flex-grow py-[10px] outline-none bg-[#3F3F45] text-[#E4E4E7] placeholder-[#717179] inter font-[500] text-[16px] leading-[22px]"
              placeholder="Enter referral code (Optional)"
            />
          </div>
          <button
            @click="onClickWithXverse"
            class="flex items-center border-[1px] border-[#FFA500] justify-center bg-neutral-900 rounded-xl p-3 hover:opacity-80 transition-opacity duration-200"
          >
            <img :src="defaultWallet.logo" alt="Internet Identity Icon" class="ii-icon" />
            <span class="inter text-neutral-50 leading-[22px] font-medium text-[16px]"
              >Continue with {{ defaultWallet.name }}</span
            >
          </button>
          <div v-if="connectedWalletKeys.length === 1 && connectedWallets[0]">
            <button
              @click="() => onClickWallet(connectedWallets[0])"
              class="bg-neutral-900 rounded-xl p-3 hover:opacity-80 transition-opacity duration-200 inline-flex flex-row gap-4 items-center justify-center w-full"
            >
              <img
                :src="connectedWallets[0].logo"
                :alt="connectedWallets[0].name"
                class="w-6 h-6"
              />
              Continue with {{ connectedWallets[0].name }}
            </button>
          </div>
          <div
            v-if="connectedWalletKeys.length > 1"
            class="grid grid-flow-col gap-4"
            :style="{
              '--grid-template-columns':
                'repeat(' + connectedWalletKeys.length + ', minmax(0, 1fr))'
            }"
          >
            <button
              v-for="wallet in connectedWallets"
              :key="wallet.id"
              @click="() => onClickWallet(wallet)"
              class="bg-neutral-900 rounded-xl p-3 hover:opacity-80 transition-opacity duration-200"
            >
              <img :src="wallet.logo" :alt="wallet.name" class="w-6 h-6 m-auto" />
            </button>
          </div>
          <button
            class="flex flex-row gap-2 items-center justify-center bg-neutral-900 rounded-xl p-3 hover:opacity-80 transition-opacity duration-200"
            @click="handleClickOtherWallets"
          >
            <Icon icon="teenyicons:wallet-alt-outline" color="#FAFAFA" width="18" height="18" />
            <span class="inter text-neutral-50 leading-[22px] font-medium text-[16px]">
              Connect Other Wallets +
            </span>
          </button>
          <div class="flex flex-col gap-4">
            <div v-if="isSignup" class="flex items-center gap-2">
              <input
                class="cursor-pointer"
                type="checkbox"
                :checked="isCheckedPrivacy"
                @change="() => (isCheckedPrivacy = !isCheckedPrivacy)"
              />
              <div
                class="inter font-[400] text-[#A1A1A9] text-[14px] leading-[20px] text-left cursor-pointer"
              >
                <span @click="() => (isCheckedPrivacy = !isCheckedPrivacy)">
                  By connecting, I agree to the
                </span>
                <a href="https://study.betbtc.win/privacy-policy" target="_blank" class="underline">
                  Privacy
                </a>
                <span> and </span>
                <a href="https://study.betbtc.win/terms-of-use" target="_blank" class="underline">
                  Terms
                </a>
              </div>
            </div>
            <div
              class="inter font-normal leading-5 text-[14px] flex items-center justify-center gap-1"
            >
              <p class="text-neutral-200">
                {{ isSignup ? 'Already have an account?' : 'New to betBTC?' }}
              </p>
              <button
                class="text-accent-500"
                @click="
                  () => {
                    isSignup = !isSignup
                  }
                "
              >
                {{ isSignup ? 'Sign In' : 'Sign Up' }}
              </button>
            </div>
          </div>
          <div v-if="!disableRecaptcha" class="w-full flex justify-center">
            <RecaptchaV2
              @widget-id="handleWidgetId"
              @error-callback="handleErrorCalback"
              @expired-callback="handleExpiredCallback"
              @load-callback="handleLoadCallback"
              theme="dark"
            />
          </div>
        </div>
        <AllWallets
          v-if="showWalletSelectModal"
          :onClickWallet="onClickWallet"
          :onClose="() => (showWalletSelectModal = false)"
          class="absolute bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)]"
        />
        <WalletConnect
          v-if="isConnectingWithWallet && connectingWallet"
          :wallet="connectingWallet"
          :onClose="() => (isConnectingWithWallet = false)"
          class="absolute bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)]"
        />
      </div>
      <div
        v-if="isLoading"
        class="absolute inset-0 z-10 backdrop-blur-sm bg-opacity-75 transition-opacity"
      >
        <div class="w-full h-full flex items-center justify-center">
          <Loading
            animationPath="/loadingLottie.json"
            width="200px"
            height="200px"
            :loop="true"
            :autoplay="true"
          />
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, toRaw, watch } from 'vue'
import { useRoute } from 'vue-router'
import { RecaptchaV2 } from 'vue3-recaptcha-v2'
import { Icon } from '@iconify/vue'
import { storeToRefs } from 'pinia'
import type { Identity } from '@dfinity/agent'
import { type Wallet, wallets } from '@/config'
import type { WalletProviderKey as BTCWalletProviderKey } from '@/stores/temp'
import { type SupportedWallet, type ICPWalletProviderKey } from '@/stores/auth'
import type { User } from '@/types/profileDataTypes'
import { useHelpers } from '@/composables/useHelpers'
import { useLayoutStore } from '@/stores/layout'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

import Loading from './Loading.vue'
import AllWallets from './signup/AllWallets.vue'
import WalletConnect from './signup/WalletConnect.vue'
import ErrorMessage from '../message/ErrorMessage.vue'
import { Principal } from '@dfinity/principal'
import { debounce } from '@syncfusion/ej2-base'
import router from '@/router'
import config, { defaultWallet } from '@/config'
import {
  Dialog,
  DialogContent,
  DialogClose,
} from '@/components/ui/dialog'

const disableRecaptcha = config.VITE_DISABLE_RECAPTCHA
const toast = useToast()

const isSignup = ref<boolean>(false)
const isCheckedRecaptcha = ref(disableRecaptcha || false)

const handleWidgetId = (_widgetId: number) => {
  // console.log('Widget ID: ', widgetId)
}
const handleErrorCalback = () => {
  console.log('Error callback')
  isCheckedRecaptcha.value = false
}
const handleExpiredCallback = () => {
  console.log('Expired callback')
  isCheckedRecaptcha.value = false
}
const handleLoadCallback = (_response: unknown) => {
  isCheckedRecaptcha.value = true
}

const layoutStore = useLayoutStore()
const authStore = useAuthStore()
const { setSignupModal } = layoutStore
const { isSignupModal } = storeToRefs(layoutStore)
const { setProfile, handleBtcLogin, handleIcpLogin, handleTestAccountLogin, setAuthClient } =
  authStore
const { backendActor, authClient: authClientRef, connectedWalletKeys } = storeToRefs(authStore)

const route = useRoute()

const isReferral = ref(false)
const isCheckedPrivacy = ref(false)
const username = ref<string>('')
const usernameError = ref<string>('')
const isCheckingUsernameExist = ref<boolean>(false)

const referralCode = ref('')
const isLoading = ref(false)
const isPlugWallet = ref(false)
const isBitfinityWallet = ref(false)
const isXverseWallet = ref(true)
const isWizzWallet = ref(false)
const isUnisatWallet = ref(true)
const showWalletSelectModal = ref(false)
const isConnectingWithWallet = ref(false)
const connectingWallet = ref<Wallet | null>(null)
const connectedWallets = ref<Wallet[]>([])

const actor = backendActor.value
const { toggleBodyScroll } = useHelpers()

onBeforeMount(async () => {
  if (route.query.ref) {
    isReferral.value = true
    isSignup.value = true
    referralCode.value = route.query.ref as string
  }

  if ((window as any).ic?.plug) {
    isPlugWallet.value = true
  }
  if ((window as any).ic?.bitfinityWallet) {
    isBitfinityWallet.value = true
  }
  if ((window as any).XverseProviders) {
    isXverseWallet.value = true
  }
  if (typeof (window as any).wizz !== 'undefined') {
    isWizzWallet.value = true
  }
  if (typeof (window as any).unisat !== 'undefined') {
    isUnisatWallet.value = true
  }
})

const updateConnectedWallets = (keys: SupportedWallet[]) => {
  const supportedWallets = [...wallets.btc, ...wallets.icp]
  connectedWallets.value = supportedWallets.filter((wallet) =>
    keys.includes(wallet.id as SupportedWallet)
  )
}

updateConnectedWallets(connectedWalletKeys.value)
watch(() => connectedWalletKeys.value, updateConnectedWallets)

const onClose = () => {
  isReferral.value = false
  setSignupModal(false)
  toggleBodyScroll(false)
}

const onClickwithNFID = async () => {
  if (isSignup.value && !isCheckedPrivacy.value) {
    toast.error('Please check Privacy and Terms.')
    return
  }
  if (!isCheckedRecaptcha.value) {
    toast.error('Please complete the reCAPTCHA.')
    return
  }
  if (isReferral.value && !referralCode.value) {
    toast.error('Referral code is required!')
    return
  }

  // IMPORTANT: Convert ref to raw
  const authClient = toRaw(authClientRef.value)

  if (!authClient) {
    toast.error('No authClient')
    return
  }
  const APP_NAME = 'NFID example'
  const APP_LOGO = 'https://nfid.one/icons/favicon-96x96.png'
  const CONFIG_QUERY = `?applicationName=${APP_NAME}&applicationLogo=${APP_LOGO}`

  const identityProvider = `https://nfid.one/authenticate${CONFIG_QUERY}`
  await authClient.login({
    identityProvider,
    onSuccess: async () => {
      setAuthClient(authClient)

      await handleAuth(authClient.getIdentity())
    },
    windowOpenerFeatures: `
        left=${window.screen.width / 2 - 525 / 2},
        top=${window.screen.height / 2 - 705 / 2},
        toolbar=0,location=0,menubar=0,width=525,height=705
        `
  })
}

const onClickWithXverse = async () => {
  if (isSignup.value) {
    if (!username.value || username.value === '') {
      usernameError.value = 'Please input username!'
      return
    }
    if (usernameError.value || isCheckingUsernameExist.value) {
      return
    }
  }
  if (isSignup.value && !isCheckedPrivacy.value) {
    toast.error('Please check Privacy and Terms.')
    return
  }
  if (!isCheckedRecaptcha.value) {
    toast.error('Please complete the reCAPTCHA.')
    return
  }
  showWalletSelectModal.value = false
  connectingWallet.value = defaultWallet
  isConnectingWithWallet.value = true
  const identity = await handleBtcLogin('XverseProviders')
  await handleAuth(identity)
}

const handleClickOtherWallets = async () => {
  if (isSignup.value) {
    if (!username.value || username.value === '') {
      usernameError.value = 'Please input username!'
      return
    }
    if (usernameError.value || isCheckingUsernameExist.value) {
      return
    }
  }
  if (isSignup.value && !isCheckedPrivacy.value) {
    toast.error('Please check Privacy and Terms.')
    return
  }
  if (!isCheckedRecaptcha.value) {
    toast.error('Please complete the reCAPTCHA.')
    return
  }

  showWalletSelectModal.value = true
}

const onClickWallet = async (wallet: Wallet) => {
  showWalletSelectModal.value = false
  connectingWallet.value = wallet
  isConnectingWithWallet.value = true
  switch (wallet.type) {
    case 'btc':
      await onClickBtcWallet(wallet.id as BTCWalletProviderKey)
      break
    case 'icp':
      await onClickIcpWallet(wallet.id as ICPWalletProviderKey)
      break
    default:
      console.error(`Unknown wallet type: ${wallet.type}`)
  }
}

const onClickBtcWallet = async (providerKey: BTCWalletProviderKey) => {
  try {
    if (isSignup.value && !isCheckedPrivacy.value) {
      toast.error('Please check Privacy and Terms.')
      return
    }
    if (!isCheckedRecaptcha.value) {
      toast.error('Please complete the reCAPTCHA.')
      return
    }
    const identity = await handleBtcLogin(providerKey)
    await handleAuth(identity)
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const onClickIcpWallet = async (providerKey: ICPWalletProviderKey) => {
  if (providerKey == 'ii') {
    await handleIcpLogin(providerKey, handleAuth)
  } else toast.info('Coming soon')
}

const handleSignIn = async () => {
  let profile_res = await actor.signin()
  if ('Ok' in profile_res) {
    setProfile(profile_res.Ok as User)
    setSignupModal(false)
    toggleBodyScroll(false)
    localStorage.setItem('signed', 'true')
  } else {
    toast.error(`${profile_res.Err}`)
  }
  isLoading.value = false
}

const handleSignup = async () => {
  const before = Date.now()
  let profile_res = await actor.signup(
    username.value,
    isReferral.value && referralCode.value ? [Principal.fromText(referralCode.value)] : []
  )
  const after = Date.now()
  console.debug('Signup time:', after - before, 'ms')
  if ('Ok' in profile_res) {
    setProfile(profile_res.Ok as User)
    setSignupModal(false)
    toggleBodyScroll(false)
    localStorage.setItem('signed', 'true')
  } else {
    toast.error(`${profile_res.Err}`)
  }
  isLoading.value = false
}

const handleAuth = async (_identity: Identity) => {
  if (isSignup.value) {
    await handleSignup()
  } else {
    await handleSignIn()
  }
  isConnectingWithWallet.value = false
  isReferral.value = false
  referralCode.value = ''
  if (isReferral.value) {
    router.push('/')
  }
}

const handleCheckUserNameExist = async () => {
  if (username.value && username.value !== '') {
    usernameError.value = ''
    try {
      isCheckingUsernameExist.value = true
      const isExistUsername = await actor.user_handle_exists(username.value)
      if (isExistUsername) {
        usernameError.value = 'Username already exists!'
      }
    } catch (error) {
      console.error(error)
    } finally {
      isCheckingUsernameExist.value = false
    }
  } else {
    usernameError.value = 'Please input username!'
  }
}

const debouncedCheckUsernameExist = debounce(handleCheckUserNameExist, 300)

watch(username, () => debouncedCheckUsernameExist())

watch(isSignupModal, () => {
  if (sessionStorage.getItem('is_sign_up')) {
    if (isSignupModal.value) {
      isSignup.value = sessionStorage.getItem('is_sign_up') === 'true'
      return
    }

    sessionStorage.removeItem('is_sign_up')
    return
  }

  const signedState: boolean = localStorage.getItem('signed') === 'true'
  isSignup.value = !signedState
})
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
.modal-content-border {
  background: linear-gradient(180deg, rgba(151, 86, 42) 0%, rgba(109, 57, 23, 0.61) 100%);
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

.eclips1 {
  width: 540px;
  height: 540px;
  top: -452px;
  left: -258px;
  gap: 0px;
  opacity: 0px;
  background: linear-gradient(180deg, rgba(227, 217, 202, 0.2) 0%, rgba(5, 5, 5, 0.2) 100%);
}
.eclips2 {
  width: 1224px;
  height: 1224px;
  top: -1100px;
  left: -526px;
  gap: 0px;
  opacity: 0px;
  background: linear-gradient(180deg, rgba(227, 217, 202, 0.2) 0%, rgba(5, 5, 5, 0.2) 100%);
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

.ii-icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}
</style>
