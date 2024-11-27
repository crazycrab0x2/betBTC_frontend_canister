<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="flex items-start gap-4">
    <!-- TODO: fix avatar -->
    <UserAvatar :user="user"/>
    <div class="flex flex-col items-start gap-2">
      <div class="flex items-center gap-2">
        <p class="text-neutral-200 text-lg">
          {{ displayName }}
        </p>
        <DateTime :timestamp="Number(createdAt)" timestampClass ="text-neutral-400 text-xs"/>
      </div>
      <div class="flex flex-col items-start gap-1">
        <p class="text-neutral-200 whitespace-pre-wrap">{{ content }}</p>
        <!-- <button class="text-neutral-400" v-if="true"> Read More </button> -->
      </div>
      <div class="flex gap-12">
        <div class="flex gap-3">
          <div class="flex items-center gap-1">
            <button v-if="isLiked" @click="likeComment">
              <!-- <Icon
                v-if="isLikeLoading"
                icon="eos-icons:bubble-loading"
                color="#FF9046"
                width="16"
                height="16"
              /> -->
              <Icon icon="fluent:heart-32-filled" color="lightgrey" />
            </button>
            <button v-else @click="likeComment">
              <!-- <Icon
                v-if="isLikeLoading"
                icon="eos-icons:bubble-loading"
                color="#FF9046"
                width="16"
                height="16"
              /> -->
              <Icon icon="fluent:heart-32-regular" color="lightgrey" />
            </button>
            <span class="text-neutral-200"> {{ like.length }} </span>
          </div>
          <div class="flex items-center gap-1">
            <button v-if="isThumbUped" @click="thumbupComment">
              <!-- <Icon
                v-if="isThumbUpLoading"
                icon="eos-icons:bubble-loading"
                color="#FF9046"
                width="16"
                height="16"
              /> -->
              <Icon icon="material-symbols:thumb-up" color="lightgrey" />
            </button>
            <button v-else @click="thumbupComment">
              <!-- <Icon
                v-if="isThumbUpLoading"
                icon="eos-icons:bubble-loading"
                color="#FF9046"
                width="16"
                height="16"
              /> -->
              <Icon icon="material-symbols:thumb-up-outline" color="lightgrey" />
            </button>
            <span class="text-neutral-200"> {{ thumbUp.length }} </span>
          </div>
          <div class="flex items-center gap-1">
            <button v-if="isThumbDowned" @click="thumbdownComment">
              <!-- <Icon
                v-if="isThumbDownLoading"
                icon="eos-icons:bubble-loading"
                color="#FF9046"
                width="16"
                height="16"
              /> -->
              <Icon icon="material-symbols:thumb-down" color="lightgrey" />
            </button>
            <button v-else @click="thumbdownComment">
              <!-- <Icon
                v-if="isThumbDownLoading"
                icon="eos-icons:bubble-loading"
                color="#FF9046"
                width="16"
                height="16"
              /> -->
              <Icon icon="material-symbols:thumb-down-outline" color="lightgrey" />
            </button>
            <span class="text-neutral-200"> {{ thumbDown.length }} </span>
          </div>
        </div>
        <button class="text-neutral-400" @click="selectReply" v-if="!isChild">Reply</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
// import Badge from './Badge.vue'
import type { Comment } from '@/types/marketDataTypes'
import { useMarketStore } from '@/stores/market'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import { storeToRefs } from 'pinia'
import DateTime from '@/components/common/DateTime.vue'
import UserAvatar from '../common/UserAvatar.vue'

interface CommentPropsType extends Comment {
  isChild: boolean
}

const props = defineProps<CommentPropsType>()

const marketStore = useMarketStore()
const authStore = useAuthStore()
const toast = useToast()
const { setReplyComment } = marketStore
const { profile, authClient, backendActor } = storeToRefs(authStore)

const displayName = computed(() => {
  if (props.user.displayName) {
    return props.user.displayName
  } else if (props.user.handle) {
    return props.user.handle
  }
  return props.user.id
})

const isLikeLoading = ref(false)
const isThumbUpLoading = ref(false)
const isThumbDownLoading = ref(false)
const isLiked = ref(profile.value && props.like.includes(profile.value.id))
const isThumbUped = ref(profile.value && props.thumbUp.includes(profile.value.id))
const isThumbDowned = ref(profile.value && props.thumbDown.includes(profile.value.id))
const actor = backendActor.value

const selectReply = () => {
  setReplyComment(props)
}

const handleCommentAction = async (
  action: () => Promise<boolean>,
  loadingState: any,
  currentState: any
) => {
  if (!authClient.value) return

  loadingState.value = true
  let isAuthenticated = false

  try {
    isAuthenticated = await authClient.value.isAuthenticated()
  } catch {
    showAuthErrorNotification()
    loadingState.value = false
    return
  }

  if (!isAuthenticated) {
    showAuthErrorNotification()
  } else {
    currentState.value = !currentState.value
    const result = await action()
    if (!result) {
      currentState.value = !currentState.value
      toast.error('Something went wrong')
    }
  }

  loadingState.value = false
}

const showAuthErrorNotification = () => {
  toast.error('Auth key expired! Please sign in again.')
}

const likeComment = async () => {
  await handleCommentAction(() => actor.like_comment(props.user.id), isLikeLoading, isLiked)
}

const thumbupComment = async () => {
  await handleCommentAction(
    () => actor.thumb_up_comment(props.user.id),
    isThumbUpLoading,
    isThumbUped
  )
}

const thumbdownComment = async () => {
  await handleCommentAction(
    () => actor.thumb_down_comment(props.user.id),
    isThumbDownLoading,
    isThumbDowned
  )
}
</script>
