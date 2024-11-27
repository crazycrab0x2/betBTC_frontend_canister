<!-- eslint-disable vue/multi-word-component-names -->
<template class="">
  <div class="p-2 bg-[#18181B] w-full">
    <div
      ref="keyboard"
      class="relative bg-[#121212] rounded-[12px] border-[#27272A] border-[1px] flex flex-col gap-8 w-full pb-12 pt-[32px] px-5 md:px-8 lg:px-16"
    >
      <div class="">
        <p class="space-grotesk font-[500] text-[32px] leading-[40px] text-[#FAFAFA]">
          {{ $t('profile-settings') }}
        </p>
      </div>
      <div class="flex flex-col gap-10 w-full">
        <div class="flex flex-col gap-1">
          <p class="inter font-[500] text-[18px] leading-[24px] text-[#FAFAFA]">
            {{ $t('profile-profile') }}
          </p>
          <p class="inter font-[400] text-[14px] leading-[20px] text-[#A1A1A9]">
            {{ $t('profile-update-your-photo') }}
          </p>
        </div>
        <div class="lg:grid lg:grid-cols-12 flex flex-col gap-4 lg:gap-3">
          <div class="xl:col-span-3 lg:col-span-4">
            <p class="inter font-[500] text-[14px] leading-[20px] text-[#FAFAFA]">
              {{ $t('profile-your-photo') }}
            </p>
            <p class="inter font-[400] text-[14px] leading-[20px] text-[#A1A1A9]">
              {{ $t('profile-this-will-be-displayed') }}
            </p>
          </div>
          <div class="xl:col-span-6 lg:col-span-7 flex lg:flex-row flex-col gap-5">
            <UserAvatar v-if="profile" :user="profile" />
            <div
              class="file-drop-area flex-grow flex gap-4 items-center border-[1px] border-[#3F3F45] rounded-[12px] px-6 py-4 cursor-pointer hover:bg-[#27272A]"
              @dragover.prevent="onDragOver"
              @dragleave="onDragLeave"
              @drop.prevent="onDrop"
              @click="onClick"
              :class="{ dragging: isDragging }"
            >
              <div
                class="border-[#3F3F45] border-[1px] rounded-[8px] w-10 h-10 flex items-center justify-center"
              >
                <Icon icon="ion:cloud-upload-outline" color="#A1A1A9" width="22" height="22" />
              </div>
              <div class="flex flex-col gap-1">
                <p class="inter font-[400] text-[14px] leading-[20px] text-[#A1A1A9]">
                  <span class="font-[500] text-[#E4E4E7]">{{ $t('profile-click-to-upload') }}</span>
                  {{ $t('profile-or') }}
                  <span class="font-[500] text-[#E4E4E7]">{{ $t('profile-drag-and-drop') }}</span>
                </p>
                <p class="inter font-[400] text-[12px] leading-[16px] text-[#A1A1A9]">
                  {{ $t('profile-avatar-type') }}
                </p>
              </div>
              <input
                id="file-upload"
                type="file"
                class="hidden"
                ref="fileInput"
                @change="onFileChange"
              />
            </div>
          </div>
        </div>

        <div class="lg:grid lg:grid-cols-12 flex flex-col gap-4 lg:gap-3">
          <div class="border-b-[#27272A] border-b-[1px] xl:col-span-9 lg:col-span-11"></div>
        </div>

        <div class="lg:grid lg:grid-cols-12 flex flex-col gap-4 lg:gap-4 w-full">
          <div class="xl:col-span-3 lg:col-span-4">
            <p class="inter font-[500] text-[14px] leading-[20px] text-[#FAFAFA]">
              {{ $t('profile-referral-link') }}
            </p>
            <p class="inter font-[400] text-[14px] leading-[20px] text-[#A1A1A9]">
              {{ $t('profile-invite-friends-and-family') }}
            </p>
          </div>
          <div class="xl:col-span-6 lg:col-span-7">
            <div
              class="w-full flex gap-2 rounded-[12px] px-[18px] py-[10px] border-[#3F3F45] border-[1px]"
            >
              <img src="/public/referral.svg" alt="referral" class="mr-2" />
              <div class="w-full flex flex-col gap-2">
                <div class="flex gap-2 group justify-between items-center">
                  <p
                    class="inter font-[500] text-[16px] leading-[22px] text-[#A1A1A9] w-fit group-hover:text-[#E4E4E7]"
                  >
                    {{ referralLink }}
                  </p>
                  <Icon
                    icon="icon-park-outline:copy"
                    width="16"
                    height="16"
                    class="w-4 h-4 cursor-pointer text-[#A1A1A9] group-hover:text-[#E4E4E7]"
                    @click="copyText(referralLink, 'Copied.')"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:grid lg:grid-cols-12 flex flex-col gap-4 lg:gap-3">
          <div class="border-b-[#27272A] border-b-[1px] xl:col-span-9 lg:col-span-11"></div>
        </div>

        <div class="flex flex-col gap-5">
          <div class="lg:grid lg:grid-cols-12 flex flex-col gap-4 lg:gap-4 w-full items-center">
            <p
              class="xl:col-span-3 lg:col-span-4 inter font-[500] text-[14px] leading-[20px] text-[#FAFAFA]"
            >
              {{ $t('profile-user-id') }}
            </p>
            <div class="xl:col-span-6 lg:col-span-7 flex flex-col gap-3">
              <div
                class="w-full flex gap-2 rounded-[12px] px-[18px] py-[10px] border-[#3F3F45] border-[1px]"
              >
                <div class="w-full flex flex-col gap-2">
                  <div :v-if="profile" class="flex gap-2 group justify-between items-center">
                    <div class="flex-grow flex items-center gap-2">
                      <Icon icon="humbleicons:fingerprint" color="#E4E4E7" width="20" height="20" />
                      <p class="inter font-[500] text-[16px] leading-[22px] text-[#E4E4E7] w-fit">
                        {{ profile!.id }}
                      </p>
                    </div>
                    <Icon
                      icon="icon-park-outline:copy"
                      width="16"
                      height="16"
                      class="w-4 h-4 cursor-pointer text-[#A1A1A9] group-hover:text-[#E4E4E7]"
                      @click="copyText(profile!.id, $t('profile-toast-copied'))"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="lg:grid lg:grid-cols-12 flex flex-col gap-4 lg:gap-4 w-full items-center">
            <p
              class="xl:col-span-3 lg:col-span-4 inter font-[500] text-[14px] leading-[20px] text-[#FAFAFA]"
            >
              {{ $t('profile-user-handle') }}
            </p>
            <div class="xl:col-span-6 lg:col-span-7">
              <div
                class="group w-full flex gap-2 rounded-[12px] px-[18px] py-[10px] border-[#3F3F45] hover:border-[#52525A] focus-within:!border-[#B56632] border-[1px]"
              >
                <Icon icon="ph:at" color="#A1A1A9" width="22" height="22" />
                <input
                  v-model="userhandle"
                  :placeholder="$t('profile-user-handle')"
                  class="outline-none bg-transparent placeholder-[#A1A1A9] inter font-[500] text-[16px] leading-[22px] text-[#E4E4E7] w-full"
                />
              </div>
            </div>
          </div>

          <div class="lg:grid lg:grid-cols-12 flex flex-col gap-4 lg:gap-4 w-full items-center">
            <p
              class="xl:col-span-3 lg:col-span-4 inter font-[500] text-[14px] leading-[20px] text-[#FAFAFA]"
            >
              {{ $t('profile-display-name') }}
            </p>
            <div class="xl:col-span-6 lg:col-span-7">
              <form-input :placeholder="$t('profile-display-name')" v-model="displayName">
                <template #prefix>
                  <Icon icon="ph:user-circle" color="#A1A1A9" width="22" height="22" />
                </template>
              </form-input>
            </div>
          </div>

          <div class="lg:grid lg:grid-cols-12 flex flex-col gap-4 lg:gap-4 w-full">
            <div class="xl:col-span-3 lg:col-span-4">
              <p class="inter font-[500] text-[14px] leading-[20px] text-[#FAFAFA]">
                {{ $t('profile-your-bio') }}
              </p>
              <p class="inter font-[400] text-[14px] leading-[20px] text-[#A1A1A9]">
                {{ $t('profile-write-a-short-introduction') }}
              </p>
            </div>
            <div class="xl:col-span-6 lg:col-span-7 flex flex-col gap-[6px]">
              <textarea
                v-model="bio"
                :placeholder="$t('profile-bio')"
                maxlength="300"
                class="w-full outline-none flex gap-2 rounded-[12px] px-[16px] py-[6px] sm:px-[18px] sm:py-[10px] bg-transparent border-[#3F3F45] hover:border-[#52525A] focus-within:!border-[#B56632] border-[1px] placeholder-[#A1A1A9] text-[#E4E4E7] text-[16px]"
                rows="6"
              ></textarea>
              <p class="inter font-[400] text-[#A1A1A9] text-[14px] leading-[20px]">
                {{ leftCharacter }} {{ $t('profile-characters-left') }}
              </p>
            </div>
          </div>
        </div>
        <div class="lg:grid lg:grid-cols-12 lg:gap-8 w-full">
          <div class="xl:col-span-4 xl:col-start-4 lg:col-span-4 lg:col-start-5">
            <div
              class="bg-[#FF9046] sm:rounded-[12px] sm:px-[18px] rounded-[8px] px-[12px] flex oranj-button w-full lg:w-[100px] h-[32px] sm:h-[42px] justify-center items-center"
              @click="onSave"
            >
              <Icon
                v-if="isLoading"
                icon="eos-icons:bubble-loading"
                color="#121212"
                width="22"
                height="22"
              />
              <p
                v-else
                class="inter font-[500] sm:leading-[22px] sm:text-[16px] leading-[20px] text-[14px] text-[#121212]"
              >
                {{ $t('profile-update') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { convertToDataURL } from '@/utils/image'
import { nanoid } from 'nanoid'
import { useAuthStore } from '@/stores/auth'
import { useLayoutStore } from '@/stores/layout'
import { useToast, TYPE } from 'vue-toastification'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import FormInput from '@/components/form/Input.vue'
import { Principal } from '@dfinity/principal'
import { useI18n } from 'vue-i18n'
import ToastWithSiginin from '../toast/ToastWithSiginin.vue'
import { copyText } from '@/utils/text'
import UserAvatar from '../common/UserAvatar.vue'
import config, { IS_DEVELOPMENT } from '@/config'

const t = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const layoutStore = useLayoutStore()
const toast = useToast()

const { setProfile } = authStore
const { profile, userPrincipal, authClient, backendActor } = storeToRefs(authStore)
const { keyboardHeight } = storeToRefs(layoutStore)
const isDragging = ref(false)
const isLoading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const imageByteArray = ref<Uint8Array | null>(null)
const userhandle = ref(profile.value?.handle)
const displayName = ref(profile.value?.displayName ?? '')
const principals = ref<string[]>(profile.value?.principals ?? [])
const bio = ref(profile.value?.bio)
const avatarLink = ref(profile.value?.avatar ?? '/default0.svg')
const avatarChanged = ref(false)
const leftCharacter = ref(300)
const keyboard = ref<HTMLInputElement | null>(null)
const actor = backendActor.value
const referralLink = `${window.location.origin}/?ref=${profile.value?.id}`

onBeforeMount(() => {
  if (!userPrincipal) router.push('/')
})

watch(
  () => keyboardHeight.value,
  () => {
    if (keyboard.value) keyboard.value.style.marginBottom = `${keyboardHeight.value}px`
  }
)

const _connect = async (type: number) => {
  let identityProvider
  if (type == 1) {
    identityProvider = config.VITE_CANISTER_ID_II
      ? `http://${config.VITE_CANISTER_ID_II}.localhost:4943/`
      : 'https://identity.ic0.app'
  } else {
    const APP_NAME = 'NFID example'
    const APP_LOGO = 'https://nfid.one/icons/favicon-96x96.png'
    const CONFIG_QUERY = `?applicationName=${APP_NAME}&applicationLogo=${APP_LOGO}`
    identityProvider = `https://nfid.one/authenticate${CONFIG_QUERY}`
  }
  if (!authClient.value) {
    toast.error('No authClient')
    return
  }
  authClient.value.login({
    identityProvider,
    onSuccess: async () => {
      const userPrincipal = authClient.value!.getIdentity().getPrincipal()
      if (principals.value.includes(userPrincipal.toText())) {
        toast.error('Principal already added.')
      } else {
        principals.value.push(userPrincipal.toText())
      }
    },
    windowOpenerFeatures: `
        left=${window.screen.width / 2 - 525 / 2},
        top=${window.screen.height / 2 - 705 / 2},
        toolbar=0,location=0,menubar=0,width=525,height=705
        `
  })
}

const onSave = async () => {
  if (!authClient.value) return
  let isAuthenticated = false
  try {
    isAuthenticated = await authClient.value.isAuthenticated()
  } catch {
    toast(ToastWithSiginin, {
      type: TYPE.ERROR
    })
  }
  if (!isAuthenticated) {
    toast(ToastWithSiginin, {
      type: TYPE.ERROR
    })
  } else {
    userhandle.value = userhandle.value?.trim()
    if (!userhandle.value) {
      toast.error('User Handle is empty!')
      return
    }
    isLoading.value = true
    if (avatarChanged.value && !!imageByteArray.value) {
      const avatarKey = nanoid()
      try {
        const uploadImageResult = (await actor.upload_avatar(
          avatarKey,
          imageByteArray.value
        )) as string

        const canisterId = config.VITE_CANISTER_ID_BACKEND
        avatarLink.value =
          config.VITE_DFX_NETWORK === 'ic'
            ? `https://${canisterId}.raw.icp0.io/image/${uploadImageResult}`
            : `http://${canisterId}.localhost:4943/image/${uploadImageResult}`
      } catch (e) {
        console.log('Error upload avatar: ', e)
      }
    }
    const updatedProfile_res = await actor.update_user(
      userhandle.value ?? '',
      displayName.value.trim(),
      bio.value ?? '',
      avatarLink.value ?? '',
      principals.value.map((p) => Principal.fromText(p))
    )
    if ('Err' in updatedProfile_res) {
      toast.error(updatedProfile_res.Err)
    } else {
      setProfile(updatedProfile_res.Ok)
      toast.success('Profile updated successfully!')
    }
    isLoading.value = false
  }
}

const onDragOver = () => {
  isDragging.value = true
}

const onDragLeave = () => {
  isDragging.value = false
}

const onDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = false

  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    handleFiles(files)
  }
}

const onClick = () => {
  fileInput.value?.click()
}

const onFileChange = () => {
  const files = fileInput.value?.files
  if (files) {
    handleFiles(files)
  }
}

const handleFiles = (files: FileList) => {
  avatarChanged.value = true
  const reader = new FileReader()

  reader.onload = async () => {
    const arrayBuffer = await files[0].arrayBuffer()
    const byteArray = new Uint8Array(arrayBuffer)
    imageByteArray.value = byteArray
    const chunks = []
    chunks.push(new Uint8Array(byteArray))

    const blob = new Blob(chunks, { type: 'image/jpeg' })

    let new_url = await convertToDataURL(blob)

    if (!new_url) return

    avatarLink.value = new_url as string
  }

  reader.readAsArrayBuffer(files[0])
}

const _removePrincipal = (principal: string) => {
  principals.value = principals.value.filter((p) => p !== principal)
}

watch(
  () => bio.value,
  () => {
    leftCharacter.value = 300 - (bio.value?.length ?? 0)
  }
)
</script>
<style scoped>
.file-drop-area {
  transition:
    background-color 0.3s,
    border-color 0.3s;
}
.file-drop-area.dragging {
  background-color: #2d3748;
}
.noaccess {
  user-select: none !important;
  pointer-events: none !important;
}
</style>
