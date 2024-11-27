<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <div class="flex flex-col gap-[40px]">
      <div class="flex items-start justify-end">
        <div class="flex gap-4">
          <dropdown
            close-inside
            button-classes="flex items-center inter text-[16px] leading-[20px] text-nowrap text-[#FEFEF1]"
            trigger="click"
          >
            <template #trigger>
              <button
                class="flex items-center border border-neutral-700 rounded-xl px-[14px] py-[6px] gap-2"
              >
                <Icon icon="fluent:filter-16-filled" color="#E4E4E7" width="16" height="16" />
                <span class="text-neutral-400 inter leading-[22px] text-[14px] font-medium">
                  Filter
                </span>
              </button>
            </template>
            <div
              class="flex flex-col gap-3 bg-neutral-950 p-2 rounded-xl border border-neutral-700"
            >
              <button
                v-for="(filter, index) in filters"
                class="inter text-neutral-200 w-[83px] p-2 text-[12px] font-medium leading-4 rounded-lg"
                :class="selectedFilter === filter.slug ? 'bg-neutral-800' : 'hover:bg-neutral-800'"
                @click="() => onSelectFilter(filter.slug)"
                :key="index"
              >
                {{ filter.title }}
              </button>
            </div>
          </dropdown>
        </div>
      </div>
      <div
        v-for="(notification, index) in notifications"
        :key="index"
        class="flex gap-[12px] overflow-hidden items-center"
      >
        <UserAvatar :user="notification.user"/>
        <div class="flex flex-col gap-2">
          <p
            v-if="notification.content"
            class="inter font-[400] leading-4 text-[12px] text-neutral-400"
          >
            {{ notification.content }}
          </p>
          <p
            class="inter font-[500] leading-5 text-[14px] text-neutral-200"
            :class="notification.types ? 'line-clamp-1' : 'line-clamp-2'"
          >
            {{
              `${notification.user.displayName || notification.user.handle} ${getNotificationTextFromType(notification)}`
            }}
          </p>
          <template v-if="Object.keys(notification.types)[0] == 'REPLY'">
            <button class="flex gap-[2px] items-center">
              <Icon icon="mingcute:message-4-line" width="12" height="12" color="#A1A1A9" />
              <p class="inter text-[12px] leading-4 font-[400] text-neutral-400">Reply</p>
            </button>
          </template>
        </div>
        <DateTime :timestamp="Number(notification.timestamp)"/>
        <div class="ml-auto flex items-center">
          <Icon
            v-if="!notification.viewed"
            class="cursor-pointer"
            icon="bx:envelope"
            color="#E4E4E7"
            width="23"
            height="23"
            @click="() => handleMarkAsRead(notification.id)"
          />
          <Icon v-else icon="bx:envelope-open" color="#E4E4E7" width="23" height="23" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import type { Notification } from '@/types/notificationTypes'
import { ref, onBeforeMount } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import Dropdown from '@/components/dropdown/Dropdown.vue'
import { Principal } from '@dfinity/principal'
import { getNotificationTextFromType } from '@/utils/notification'
import { useNotificationStore } from '@/stores/notification'
import type { ActivitySortType, NotificationType } from '@/backend/betbtc-backend.did'
import DateTime from '@/components/common/DateTime.vue'
import UserAvatar from '../common/UserAvatar.vue'

const authStore = useAuthStore()
const { profile, backendActor } = storeToRefs(authStore)
const isLoading = ref(false)
const actor = backendActor.value
const notifications = ref<Notification[]>([])
const notificationStore = useNotificationStore()
const { setNotification } = notificationStore

const handleMarkAsRead = async (id: string) => {
  try {
    notifications.value = notifications.value.map((notification) => ({
      ...notification,
      viewed: notification.id == id ? true : notification.viewed
    }))
    const result = await actor.view_notification(id)
    if (!result) {
      notifications.value = notifications.value.map((notification) => ({
        ...notification,
        viewed: notification.id == id ? false : notification.viewed
      }))
    }
  } catch (e) {
    setNotification({ title: 'Error', content: 'Mark as read failed', visible: true })
  }
}

const filters = ref<
  {
    slug: string
    title: string
  }[]
>([
  {
    slug: 'Reply',
    title: 'Comment'
  },
  {
    slug: 'Like',
    title: 'Like'
  },
  {
    slug: 'Unlike',
    title: 'Un Like'
  },
  {
    slug: 'ThumbUp',
    title: 'Thumb Up'
  },
  {
    slug: 'UnThumbUp',
    title: 'Un Thumb Up'
  },
  {
    slug: 'ThumbDown',
    title: 'Thumb Down'
  },
  {
    slug: 'UnThumbDown',
    title: 'Un Thumb Down'
  }
])

const selectedFilter = ref<string>('')

const filterParam = ref<NotificationType[]>([
  { Reply: null },
  { Like: null },
  { Unlike: null },
  { ThumbUp: null },
  { UnThumbUp: null },
  { ThumbDown: null },
  { UnThumbDown: null }
])

const onSelectFilter = (filter: string) => {
  selectedFilter.value = filter
  filterParam.value = [{ [filter]: null } as NotificationType]
}

onBeforeMount(() => {
  getNotifications()
})

const getNotifications = async () => {
  if (!profile.value) return
  isLoading.value = true
  try {
    const notificats = await actor.get_notifications(
      Principal.fromText(profile.value.id),
      filterParam.value
    )
    notifications.value = notificats.sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
  } catch (e) {
    console.log('Error: ', e)
  }
  isLoading.value = false
}
</script>
