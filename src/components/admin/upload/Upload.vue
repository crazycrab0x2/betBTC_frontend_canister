<template>
  <div class="text-white">
    <h3>Upload images</h3>
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
          <span class="font-[500] text-[#E4E4E7]">Click to upload</span> or
          <span class="font-[500] text-[#E4E4E7]">drag and drop</span>
        </p>
        <p class="inter font-[400] text-[12px] leading-[16px] text-[#A1A1A9]">
          PNG or JPG or GIF (max. 800x400px)
        </p>
      </div>
      <input id="file-upload" type="file" class="hidden" ref="fileInput" @change="onFileChange" />
    </div>
    <img class="w-32 h-32" v-if="imageUrl" :src="imageUrl" alt="Uploaded image" />
    <p v-if="isUploaded">
      Uploaded URL
      <a :href="imageUrl" target="_blank" rel="noopener noreferrer">{{ imageUrl }}</a>
    </p>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { nanoid } from 'nanoid'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import { useAuthStore } from '@/stores/auth'
import { convertToDataURL } from '@/utils/image'
import config from '@/config'

const isDragging = ref(false)
const isUploading = ref(false)
const isUploaded = ref(false)
const imageUrl = ref('')
const authStore = useAuthStore()
const { backendActor } = storeToRefs(authStore)

const fileInput = ref<HTMLInputElement | null>(null)

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
  const reader = new FileReader()

  reader.onload = async () => {
    const arrayBuffer = await files[0].arrayBuffer()
    const byteArray = new Uint8Array(arrayBuffer)
    const chunks = []
    chunks.push(new Uint8Array(byteArray))

    const blob = new Blob(chunks, { type: 'image/jpeg' })

    imageUrl.value = (await convertToDataURL(blob)) as string

    const avatarKey = nanoid()
    try {
      isUploading.value = true
      const uploadImageResult = (await backendActor.value.upload_market_image(
        avatarKey,
        byteArray
      )) as string
      isUploaded.value = true
      const canisterId = config.VITE_CANISTER_ID_BACKEND
      imageUrl.value =
        config.VITE_DFX_NETWORK === 'ic'
          ? `https://${canisterId}.raw.icp0.io/market/${uploadImageResult}`
          : `http://${canisterId}.localhost:4943/market/${uploadImageResult}`
    } catch (e) {
      console.log('Error upload avatar: ', e)
    } finally {
      isUploading.value = false
    }
  }

  reader.readAsArrayBuffer(files[0])
}
</script>
