<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <comment-card v-bind="{ ...props }" :isChild="false" />
    <div :class="[replies.length ? 'mt-6' : '', 'ml-14']">
      <comment-card
        v-for="(reply, index) in replyComments"
        :key="index"
        v-bind="{ ...reply }"
        :isChild="true"
      />
      <button
        class="flex gap-1 mt-2 items-center"
        v-if="replies.length && replyComments.length == 0"
        @click="getReplies"
        :class="loadComment ? 'cursor-not-allowed' : 'cursor-pointer'"
      >
        <Icon icon="ic:baseline-plus" color="lightgrey" />
        <span class="text-xs text-neutral-200">
          {{ replies.length ? 'Show replies' : 'Load more replies' }} ({{ replies.length }})
        </span>
        <Icon
          v-if="loadComment"
          icon="eos-icons:bubble-loading"
          color="#FF9046"
          width="20"
          height="20"
        />
      </button>
      <button class="flex gap-1 mt-2" v-if="replyComments.length" @click="replyComments = []">
        <Icon icon="ic:baseline-minus" color="lightgrey" />
        <span class="text-xs text-neutral-200"> Hide replies </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import CommentCard from './CommentCard.vue'
import type { Comment } from '@/types/marketDataTypes'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

interface CommentWithNewReply extends Comment {
  newReply: Comment | undefined
}

const props = defineProps<CommentWithNewReply>()
const loadComment = ref(false)
const replyComments = ref<Comment[]>([])
const authStore = useAuthStore()
const { backendActor } = storeToRefs(authStore)
const actor = backendActor.value
watch(
  () => props.newReply,
  () => {
    if (props.newReply && props.newReply.parentCommentId == props.id) {
      replyComments.value.unshift(props.newReply)
      replyComments.value.sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
    }
  }
)

const getReplies = async () => {
  loadComment.value = true
  const replies = await actor.get_replies(props.id)
  replies.sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
  replyComments.value = replies
  loadComment.value = false
}
</script>
