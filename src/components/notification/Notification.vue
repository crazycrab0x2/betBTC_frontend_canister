<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { storeToRefs } from 'pinia'
import { useNotificationStore } from '@/stores/notification'
import { useLayoutStore } from '@/stores/layout'
import SignupModal from '../landing/SignupModal.vue'
import { useHelpers } from '@/composables/useHelpers'

const notificationStore = useNotificationStore()
const layoutStore = useLayoutStore()
const { setSignupModal } = layoutStore
const { setNotification } = notificationStore
const { notification } = storeToRefs(notificationStore)
const visible = ref(false)
const { toggleBodyScroll } = useHelpers()

watch(
  () => notification.value.visible,
  () => {
    if (notification.value.visible) {
      visible.value = true
      setTimeout(
        () => {
          visible.value = false
        },
        notification.value.content == 'Auth key expired! Please sign in again.' ||
          notification.value.content == 'Anonymous call not allowed'
          ? 5000
          : 3000
      )
    }
  }
)
watch(
  () => visible.value,
  () => {
    if (!visible.value) {
      setTimeout(() => {
        setNotification({ title: '', content: '', visible: false })
      }, 200)
    }
  }
)

const onSignin = () => {
  visible.value = false
  setSignupModal(true)
  toggleBodyScroll()
}

const close = () => {
  visible.value = false
}
</script>
<template>
  <div
    v-if="notification.visible"
    class="fixed z-[300] bottom-5 sm:bottom-7 sm:right-5 right-[50%] translate-x-[50%] sm:translate-x-[0%] bg-[#27272A] w-[334px] text-white px-4 py-2 shadow-lg flex space-x-2 animate-fade border-[#FF90464D] border-[1px] rounded-xl"
    :class="visible ? 'animate-fade-in' : 'animate-fade-out'"
  >
    <div class="w-[24px] h-[24px]">
      <Icon
        v-if="notification.title == 'Error'"
        icon="ph:warning-circle-bold"
        color="#DD524C"
        width="24"
        height="24"
      />
      <Icon
        v-if="notification.title == 'Info'"
        icon="ph:warning-circle-bold"
        color="#55B5A6"
        width="24"
        height="24"
      />
      <Icon
        v-if="notification.title == 'Success'"
        icon="gg:check-o"
        color="#55B5A6"
        width="24"
        height="24"
      />
    </div>
    <div class="inter text-[14px] w-full">
      <div class="font-[500] text-[#FAFAFA] my-[2px]">{{ notification.title }}</div>
      <div class="font-[400] text-[#E4E4E7] break-all">{{ notification.content }}</div>
      <button
        v-if="
          notification.content == 'Auth key expired! Please sign in again.' ||
          notification.content == 'Anonymous call not allowed'
        "
        @click="onSignin"
        class="oranj-button bg-[#ff9046] flex items-center justify-center inter w-full !font-[500] rounded-[5px] h-[30px] text-[16px] text-[#121212] mt-2"
      >
        Sign In
      </button>
    </div>
    <button @click="close" class="absolute top-[5px] right-[5px]">
      <Icon
        icon="ic:baseline-close"
        color="#ffffff"
        width="17"
        height="17"
        class="cursor-pointer"
      />
    </button>
  </div>
  <SignupModal />
</template>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');

.inter {
  font-family: 'Inter', sans-serif;
  font-optical-sizing: auto;
  font-weight: normal;
  font-style: normal;
  font-variation-settings: 'slnt' 0;
}

@media (min-width: 640px) {
  @keyframes fadeIn {
    0% {
      opacity: 0;
      transform: translateY(50px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes fadeOut {
    0% {
      opacity: 1;
      transform: translateY(0);
    }
    100% {
      opacity: 0;
      transform: translateY(50px);
    }
  }
}

@media (max-width: 640px) {
  @keyframes fadeIn {
    0% {
      opacity: 0;
      transform: translateX(0);
    }
    100% {
      opacity: 1;
      transform: translateX(50%);
    }
  }
  @keyframes fadeOut {
    0% {
      opacity: 1;
      transform: translateX(50%);
    }
    100% {
      opacity: 0;
      transform: translateX(0);
    }
  }
}

.animate-fade-out {
  animation: fadeOut 0.3s ease-in-out;
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
</style>
