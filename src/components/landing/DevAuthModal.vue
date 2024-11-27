<template>
  <Dialog :open="visible">
    <DialogContent class="bg-[#0a0a0a] border-0">
      <button class="close-button relative" @click="onClose">
        <Icon
          icon="ic:baseline-close"
          color="#ffffff"
          width="24"
          height="24"
          class="cursor-pointer"
        />
      </button>
      <DialogHeader>
        <DialogTitle></DialogTitle>
        <DialogDescription>
          <div class="flex items-center justify-center h-[200px]">
            <img
              src="/horizontal_logo.svg"
              alt="betBTC Logo"
              class="logo w-[134px] my-24 mx-auto z-[1]"
            />
          </div>
        </DialogDescription>
      </DialogHeader>
      <RadioGroup
        :default-value="config.currentEnvironmentId"
        v-model="selectedEnvironmentId"
        class="flex sm:flex-row flex-col justify-between"
      >
        <div
          class="flex flex-row gap-[10px] hover:cursor-pointer"
          v-for="env in environments"
          :key="env.id"
        >
          <RadioGroupItem :id="env.id" :value="env.id" />
          <Label class="text-white font-[500] hover:cursor-pointer" :for="env.id">{{
            env.name
          }}</Label>
        </div>
      </RadioGroup>
      <div
        class="flex flex-col border border-green-800 p-1 gap-2 my-[20px]"
        v-if="!config.IS_IN_PRODUCTION"
      >
        <div v-for="account in testAccounts" :key="account.name">
          <button
            @click="() => onClickTestAccount(account.name)"
            class="w-full bg-neutral-900 text-white rounded-xl p-3 hover:opacity-80 transition-opacity duration-200"
          >
            <span
              >Continue with <span class="font-bold">{{ account.name }}</span></span
            >
          </button>
        </div>
      </div>
      <div
        class="absolute inset-0 z-10 backdrop-blur-sm bg-opacity-75 transition-opacity"
        v-if="isLoading"
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
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { Icon } from '@iconify/vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { useLayoutStore } from '@/stores/layout'
import { testAccounts, type TestAccountKeys } from '@/config/test-accounts'
import type { User } from '@/types/profileDataTypes'
import { useHelpers } from '@/composables/useHelpers'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Label } from '../ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import config, { ENV_KEY, environments } from '@/config'

const router = useRouter()
const toast = useToast()
const layoutStore = useLayoutStore()
const authStore = useAuthStore()
const { setProfile, handleTestAccountLogin } = authStore
const { backendActor } = storeToRefs(authStore)
const actor = backendActor.value
const { toggleBodyScroll } = useHelpers()
const { setSignupModal } = layoutStore

const { visible, onClose } = defineProps<{
  visible: boolean
  onClose: () => void
}>()

const selectedEnvironmentId = ref(config.currentEnvironmentId)
const isLoading = ref<boolean>(false)

const onClickTestAccount = async (key: TestAccountKeys) => {
  isLoading.value = true
  try {
    await handleTestAccountLogin(key)
    const profile_res = await actor.signin()
    if ('Ok' in profile_res) {
      setProfile(profile_res.Ok as User)
      setSignupModal(false)
      toggleBodyScroll(false)
      localStorage.setItem('signed', 'true')
    } else {
      toast.error(`${profile_res.Err}`)
    }
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
    onClose()
  }
}

watch(
  () => selectedEnvironmentId.value,
  (environmentId) => {
    localStorage.setItem(ENV_KEY, environmentId)
    router.go(0)
  }
)
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
</style>
