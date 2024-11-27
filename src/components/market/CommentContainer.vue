<template>
  <Comment
    v-for="commentWithProfile in commentsWithProfile.sort(
      (a, b) => Number(b.createdAt) - Number(a.createdAt)
    )"
    :key="commentWithProfile.id"
    v-bind="commentWithProfile"
    :newReply="newReply"
  />
</template>
<script setup lang="ts">
import { ref, onBeforeMount, onMounted, onUnmounted } from 'vue'
import Comment from './Comment.vue'
import type { Comment as CommentType } from '@/types/marketDataTypes'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const { backendActor } = storeToRefs(authStore)
const props = defineProps(['marketId', 'newReply'])
const commentsWithProfile = ref<CommentType[]>([])
const actor = backendActor.value

onBeforeMount(() => {
  getComments()
})

let marketTimer: NodeJS.Timeout
onMounted(() => {
  marketTimer = setInterval(async () => {
    await getComments()
  }, 5000)
})

onUnmounted(() => clearInterval(marketTimer))

const getComments = async () => {
  const result = await actor.get_comments(props.marketId)
  commentsWithProfile.value = result
}
</script>
