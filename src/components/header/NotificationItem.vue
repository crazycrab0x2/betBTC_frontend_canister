<template>
  <li class="py-1">
    <div class="flex">
      <UserAvatar :user="notification.user"/>
      <div class="ml-2">
        <div>
          {{ notification.user.displayName || notification.user.handle }}
        </div>
        <div>{{ getNotificationTextFromType(notification) }}</div>
      </div>
      <div class="ml-auto flex items-center">
        <Icon
          v-if="!isRead"
          class="cursor-pointer"
          icon="bx:envelope"
          color="#E4E4E7"
          width="23"
          height="23"
          @click="handleMarkAsRead"
        />
        <Icon v-else icon="bx:envelope-open" color="#E4E4E7" width="23" height="23" />
      </div>
    </div>
  </li>
</template>

<script lang="ts" setup>
import type { Notification } from '@/types/notificationTypes'
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import { getNotificationTextFromType } from '@/utils/notification'
import UserAvatar from '../common/UserAvatar.vue'

const { notification } = defineProps<{
  notification: Notification
}>()

const { backendActor } = useAuthStore()
const toast = useToast()
const isRead = ref<Boolean>(false)

const handleMarkAsRead = async () => {
  try {
    isRead.value = true
    isRead.value = await backendActor.view_notification(notification.id)
  } catch (e) {
    isRead.value = false
    toast.error('Mark as read failed')
  }
}
</script>
