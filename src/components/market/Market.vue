<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="p-2 bg-[#18181B] w-full min-h-screen">
    <div
      class="w-screen flex-grow z-20 flex items-center justify-center h-full"
      v-if="isLoading && !currentMarket"
    >
      <Loading
        animationPath="/loadingLottie.json"
        width="200px"
        height="200px"
        :loop="true"
        :autoplay="true"
      />
    </div>
    <div
      ref="keyboard"
      class="relative bg-[#121212] rounded-[12px] border-[#27272A] border-[1px] flex flex-col gap-8 w-full pt-[32px] pb-12 px-5 md:px-8 lg:px-16 h-full"
      v-else-if="currentMarket"
    >
      <!-- back button and balance -->
      <div class="flex items-center justify-between flex-wrap">
        <div
          class="justify-center bg-[#27272A] rounded-[8px] px-[12px] py-[6px] flex gap-1 black-button w-full sm:w-auto"
          @click="$router.push('/')"
        >
          <Icon icon="mdi:arrow-left" width="20" height="20" class="text-[#FAFAFA]" />
          <p class="inter font-[500] leading-[20px] text-[#FAFAFA]">Go Back</p>
        </div>

        <BalanceSwitch />
      </div>
      <!-- market info -->
      <container class="flex items-start sm:gap-7 gap-4">
        <img
          v-lazy="currentMarket?.image"
          width="200"
          class="sm:rounded-2xl rounded-lg flex-shrink-0 sm:w-[200px] w-[80px]"
          v-if="marketStatus === MarketStatus.Open"
        />
        <div class="flex flex-col gap-5 flex-grow sm:w-auto w-[221px]">
          <p
            class="inter font-[500] text-[#FAFAF1] sm:text-[26px] text-[20px] leading-[36px] break-all"
          >
            {{ currentMarket?.title }}
          </p>
          <div class="flex flex-col gap-3">
            <div class="flex flex-row items-center gap-1">
              <Icon icon="iconoir:coins" color="#E4E4E7" width="25" height="25" />
              <div class="flex items-center">
                <p class="inter text-[#E4E4E7] text-[14px] leading-[30px] font-[400]">
                  {{
                    isBtc
                      ? convertSats2Btc(totalVolume).toFixed(8)
                      : convertSats2Btc(totalVolume * btcPrice).toFixed(2)
                  }}
                </p>
                <Icon
                  v-if="isBtc"
                  icon="ic:twotone-currency-bitcoin"
                  color="#E4E4E7CC"
                  width="16"
                />
                <Icon v-else icon="bx:dollar" color="#E4E4E7CC" width="16" />
              </div>
            </div>
            <div class="flex flex-row items-center gap-1">
              <Icon icon="akar-icons:calendar" color="#E4E4E7" width="25" height="25" />
              <p class="inter text-[#E4E4E7] text-[14px] leading-[21px] font-[400]">
                Ends at {{ formatDate(Number(currentMarket!.expireAt)) }}
              </p>
            </div>
          </div>
          <div class="flex sm:flex-row flex-col sm:items-center items-start gap-3">
            <button
              @click="handleShareLink"
              class="flex flex-row gap-1 border border-[#3F3F45] rounded-lg p-2 sm:w-auto w-[166px] justify-start"
            >
              <Icon icon="tdesign:link" color="#A1A1A9" width="20" height="20" />
              <div class="inter font-[500] leading-[20px] text-[#A1A1A9]">Market link</div>
            </button>
            <button
              class="flex flex-row gap-1 border border-[#3F3F45] rounded-lg p-2 cursor-pointer w-[166px]"
              @click="onMarkMarket"
            >
              <Icon
                v-if="markLoading"
                icon="eos-icons:bubble-loading"
                color="#A1A1A9"
                width="20"
                height="20"
              />
              <Icon
                icon="bi:bookmark-check-fill"
                color="#A1A1A9"
                width="20"
                height="20"
                v-else-if="profile && markedUsers.includes(profile?.id)"
              />
              <Icon icon="mage:bookmark-plus" color="#A1A1A9" width="20" height="20" v-else />
              <div class="inter font-[500] leading-[20px] text-[#A1A1A9]">
                <span v-if="isMarked">Remove from watchlist </span>
                <span v-else>Add to watchlist</span>
              </div>
            </button>
          </div>
        </div>
      </container>
      <!-- options -->
      <div
        class="flex flex-col items-start sm:gap-2 gap-4"
        v-if="marketStatus === MarketStatus.Open"
      >
        <Option
          v-for="(option, index) in currentMarket.options"
          :key="index"
          :option="option"
          :totalBetAmount="totalBetAmount!"
          :id="index"
          :selectOption="selectOption"
          :isExpand="optionIndex[index] ?? false"
          :balance="balance"
          :isMultiOutcome="currentMarket.options.length > 1"
          :bets="option.betters.filter((better) => better.user.id == profile?.id)"
          :resolveLink="currentMarket.resolveLink"
          :resolveDescription="currentMarket.description"
          :chance="getChance(currentMarket, index)"
          :isSingleOption="currentMarket.options.length > 1 ? false : true"
          :marketStatus="marketStatus"
          :hasResult="!!currentMarket.result"
          :version="currentMarket.version"
          :currentMarket="currentMarket"
          :optionId="index"
          @placeBet="placeBet"
        />
      </div>
      <!-- resolved -->
      <container class="flex flex-col items-start gap-[40px]" v-else>
        <Resolved
          :image="currentMarket?.image"
          :options="currentMarket?.options.map((option) => option.option)"
          :result="currentMarket.result"
          :resolutionLink="currentMarket.resolveLink"
          :isSingleOption="currentMarket.options.length > 1 ? false : true"
          :marketStatus="marketStatus"
        />
      </container>
      <hr class="border-gray-700" />
      <tabs v-model="currentTab">
        <tab name="comments" title="Comments">
          <container class="flex flex-col justify-center gap-6">
            <div class="flex items-start gap-4 -mb-4">
              <div
                class="flex items-center justify-between gap-3 flex-grow px-2"
                v-if="replyComment.id"
              >
                <div class="flex items-center gap-2">
                  <Icon
                    icon="fluent-mdl2:reply-all-mirrored"
                    color="#E4E4E7"
                    width="16 "
                    height="16"
                  />
                  <UserAvatar v-if="profile" :user="replyComment" />
                  <p class="inter text-[12px] leading-[14px] font-[400] text-[#E4E4E7]">
                    {{ displayName }}
                  </p>
                  <p class="inter text-[12px] leading-[14px] font-[400] text-[#E4E4E7] flex-grow">
                    {{ replyComment.content }}
                  </p>
                </div>
                <Icon
                  icon="carbon:close-outline"
                  width="16"
                  height="16"
                  class="cursor-pointer text-[#E4E4E7] hover:text-[#B56632]"
                  @click="removeReply"
                />
              </div>
            </div>
            <div class="flex items-start gap-4">
              <UserAvatar v-if="profile" :user="profile" />
              <div class="flex flex-col gap-1 flex-grow">
                <div
                  class="group w-full flex gap-2 rounded-[12px] px-[18px] py-[10px] border-[#3F3F45] hover:border-[#52525A] focus-within:!border-[#B56632] border-[1px]"
                >
                  <textarea
                    v-model="commentContent"
                    spellcheck="false"
                    ref="textareaRef"
                    placeholder="Add a comment"
                    class="outline-none bg-transparent placeholder-[#A1A1A9] inter font-[500] text-[16px] leading-[22px] text-[#E4E4E7] w-full"
                    @keydown="handleKeyDown"
                    @input="autoResize"
                    rows="1"
                  />
                  <Icon
                    v-if="addCommentLoading"
                    icon="eos-icons:bubble-loading"
                    color="#FF9046"
                    width="20"
                    height="20"
                  />
                  <Icon
                    v-else
                    icon="tdesign:send"
                    width="22"
                    height="22"
                    class="cursor-pointer text-[#A1A1A9] hover:text-[#B56632]"
                    @click="addComment"
                  />
                </div>
              </div>
            </div>
            <CommentContainer :newReply="newReply" :marketId="marketId" />
          </container>
        </tab>
        <tab name="top_holders" title="Top Holders">
          <container>
            <Table>
              <table-head>
                <table-head-cell> Username </table-head-cell>
                <table-head-cell> Option </table-head-cell>
                <table-head-cell v-if="currentMarket.version == MarketVersion.V1">
                  Yes/No
                </table-head-cell>
                <table-head-cell> Volume (Token)</table-head-cell>
              </table-head>
              <table-body v-if="topHolders.length > 0">
                <table-row v-for="(holder, index) in topHolders" :key="index">
                  <table-cell>
                    <div class="flex items-center gap-3">
                      <UserAvatar :user="holder.user" />
                      <span class="max-w-[100px] truncate overflow-hidden whitespace-nowrap">
                        {{ getDisplayName(holder.user) }}
                      </span>
                    </div>
                  </table-cell>
                  <table-cell> {{ holder.option }} </table-cell>
                  <table-cell v-if="currentMarket.version == MarketVersion.V1">
                    <span v-if="holder.type === 'Yes'" class="text-green-600"> Yes </span>
                    <span v-else class="text-red-600"> No </span>
                  </table-cell>
                  <table-cell class="w-60"> {{ holder.volume }} </table-cell>
                </table-row>
              </table-body>
              <table-body v-else>
                <table-row>
                  <td colspan="4">
                    <p
                      class="inter text-[#FEFEFA] text-[14px] font-[400] text-center leading-[44px]"
                    >
                      No record
                    </p>
                  </td>
                </table-row>
              </table-body>
            </Table>
          </container>
        </tab>
        <tab name="transactions" title="Transactions">
          <div class="overflow-x-auto w-full" v-if="transactions.length > 0">
            <container class="flex flex-col gap-5 min-w-[600px]">
              <TransactionTable :transactions="transactions" :version="currentMarket.version" />
            </container>
          </div>
          <div class="flex flex-col gap-5 max-w-[350px]" v-else>
            <p class="inter text-[#FEFEFA] text-[14px] font-[400] text-center">No record</p>
          </div>
        </tab>
      </tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeMount, onMounted, onUnmounted, computed, nextTick } from 'vue'
import { Icon } from '@iconify/vue'
import { useLayoutStore } from '@/stores/layout'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import Option from './Option.vue'
import Resolved from './Resolved.vue'
import { useToast, TYPE } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import { useMarketStore } from '@/stores/market'
import Container from '@/components/container/Container.vue'
import Tabs from '@/components/tabs/Tabs.vue'
import Tab from '@/components/tabs/Tab.vue'
import Table from '@/components/table/Table.vue'
import TableBody from '@/components/table/TableBody.vue'
import TableCell from '@/components/table/TableCell.vue'
import TableHead from '@/components/table/TableHead.vue'
import TableHeadCell from '@/components/table/TableHeadCell.vue'
import TableRow from '@/components/table/TableRow.vue'
import CommentContainer from './CommentContainer.vue'
import TransactionTable from './TransactionTable.vue'
import Loading from '../landing/Loading.vue'
import {
  type Market,
  type HolderType,
  type Comment,
  type PickedUser,
  MarketStatus,
  MarketVersion
} from '@/types/marketDataTypes'
import { getDisplayName } from '@/utils/user'
import { getChance } from '@/utils/market'
import ToastWithSiginin from '../toast/ToastWithSiginin.vue'
import type { Transaction } from '@/types/notificationTypes'
import { useHelpers } from '@/composables/useHelpers'
import UserAvatar from '../common/UserAvatar.vue'
import BalanceSwitch from '../common/BalanceSwitch.vue'

const { convertSats2Btc } = useHelpers()
const authStore = useAuthStore()
const marketStore = useMarketStore()
const isLoading = ref(false)
const toast = useToast()
const { profile, authClient, backendActor, balance, isLoadingBalance } = storeToRefs(authStore)
const { updateBalance } = authStore
const { replyComment, btcPrice } = storeToRefs(marketStore)
const { setReplyComment } = marketStore

const route = useRoute()
const layoutStore = useLayoutStore()
const { setSignupModal } = layoutStore
const { keyboardHeight } = storeToRefs(layoutStore)

const { isBtc } = storeToRefs(layoutStore)

const keyboard = ref<HTMLInputElement | null>(null)
const marketId = ref('')
const optionIndex = ref<boolean[]>([])
const currentTab = ref('comments')
const currentMarket = ref<Market>()
// const marketOptions = ref<MarketOption[]>([])
const markedUsers = ref<string[]>([])
const markLoading = ref(false)
const totalVolume = ref(0)
const topHolders = ref<HolderType[]>([])
const transactions = ref<Transaction[]>([])
const commentContent = ref('')
const addCommentLoading = ref(false)
const comments = ref<Comment[]>([])
const newReply = ref<Comment>()
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const isMarked = ref<boolean>(false)
const actor = backendActor.value

onBeforeMount(async () => {
  window.scrollTo(0, 0)
  setReplyComment({})
  getMarketData()
  optionIndex.value = new Array(currentMarket.value?.options.length).fill(false)
  updateBalance()
})

watch(
  () => currentMarket.value,
  async () => {
    if (!profile.value || !currentMarket.value) return

    if (currentMarket.value.marked.includes(profile.value.id)) isMarked.value = true
    else isMarked.value = false
  }
)

watch(
  () => replyComment.value,
  () => {
    if (replyComment.value) {
      textareaRef.value?.focus()
    }
  }
)

const autoResize = () => {
  nextTick(() => {
    if (textareaRef.value) {
      textareaRef.value.style.height = 'auto'
      textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`
    }
  })
}

const displayName = computed(() => {
  return getDisplayName(replyComment as unknown as PickedUser)
})

const marketStatus = computed(() => {
  const isExpired =
    !!currentMarket.value?.expireAt && currentMarket.value.expireAt.getTime() < Date.now()
  const isResolved =
    !!currentMarket.value?.resolvedAt && currentMarket.value.resolvedAt.getTime() < Date.now()
  const isClosed =
    !!currentMarket.value?.closedAt && currentMarket.value.closedAt.getTime() < Date.now()
  const hasResult = !!currentMarket.value?.result

  if (isClosed) {
    return MarketStatus.Closed
  } else if (isResolved && hasResult) {
    return MarketStatus.Resolved
  } else if ((isExpired && hasResult) || (!isResolved && hasResult)) {
    return MarketStatus.Resolving
  } else if (isExpired && !hasResult) {
    return MarketStatus.Expired
  } else {
    return MarketStatus.Open
  }
})

let marketTimer: any

const totalBetAmount = computed(() => {
  if (currentMarket.value?.options && currentMarket.value.options.length > 0)
    return currentMarket.value?.options.reduce((a, b) => a + b.noBetAmount + b.yesBetAmount, 0)
  else return 0
})

onMounted(async () => {
  autoResize()
  marketTimer = setInterval(async () => {
    await getMarketData()
  }, 5000)
})

onUnmounted(() => clearInterval(marketTimer))

const getMarketData = async () => {
  marketId.value = (route.query.id || route.params.id) as string
  try {
    isLoading.value = true
    const market = await actor.get_market_by_id((route.query.id || route.params.id) as string)
    if (!market) {
      toast.error('Market not found')
      setTimeout(() => {
        window.location.href = '/'
      }, 3000)
    } else {
      currentMarket.value = market
      totalVolume.value = market.options.reduce(
        (sum, option) => sum + option.yesBetAmount + option.noBetAmount,
        0
      )
      transactions.value = await actor.get_transaction_activity(
        [],
        [market.id],
        [{ Yes: null }, { No: null }, { SYes: null }, { SNo: null }],
        { Time: null }
      )

      filterData(market)
      if (market.marked) {
        markedUsers.value = market.marked
      }
    }
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const filterData = (data: Market) => {
  const tokenHolder: HolderType[] = []
  data.options.map((option) => {
    option.betters.map((better) => {
      const { user } = better
      const existingHolder = tokenHolder.find((holder: HolderType) => {
        let holding = 'Yes'
        if ('Yes' in better.betType) {
          holding = 'Yes'
        } else {
          holding = 'No'
        }

        return (
          holder.user.id === better.user.id &&
          holder.option === option.option &&
          holder.type === holding
        )
      })

      if (existingHolder) {
        existingHolder.volume += better.betAmount
      } else {
        let holding = 'Yes'
        if ('Yes' in better.betType) {
          holding = 'Yes'
        } else {
          holding = 'No'
        }
        const holder: HolderType = {
          user,
          option: option.option,
          type: holding,
          volume: better.betAmount
        }
        tokenHolder.push(holder)
      }
    })
  })
  topHolders.value = tokenHolder.sort((a: any, b: any) => b.volume - a.volume)

  transactions.value = transactions.value.sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
}

watch(
  () => keyboardHeight.value,
  () => {
    if (keyboard.value) keyboard.value.style.marginBottom = `${keyboardHeight.value}px`
  }
)

const selectOption = (id: number) => {
  if (currentMarket.value) {
    if (optionIndex.value[id] == true) optionIndex.value[id] = false
    else {
      optionIndex.value = new Array(currentMarket.value.options.length).fill(false)
      optionIndex.value[id] = true
    }
  }
}

const onMarkMarket = async () => {
  if (!authClient.value) return
  markLoading.value = true
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
    const markMarketResult = await actor.mark_market(marketId.value)
    if (markMarketResult) {
      if (!profile.value) return
      if (markedUsers.value.includes(profile.value.id)) {
        markedUsers.value = markedUsers.value.filter((user) => user != profile.value?.id)
        isMarked.value = false
        toast.success('Market removed from your watchlist')
      } else {
        markedUsers.value.push(profile.value.id)
        isMarked.value = true
        toast.success('Market added to your watchlist')
      }
    } else {
      toast.error('Something went wrong')
    }
  }
  markLoading.value = false
}

const formatDate = (millisecs: number) => {
  const date = new Date(millisecs)
  return date.toLocaleString()
}

const handleShareLink = () => {
  navigator.clipboard.writeText(window.location.href)
  toast.success('Link copied to clipboard')
}

const addComment = async () => {
  if (!commentContent.value) return
  if (!authClient.value || !profile.value) {
    setSignupModal(true)
    return
  }
  addCommentLoading.value = true
  try {
    const isAuthenticated = await authClient.value.isAuthenticated()
    if (!isAuthenticated) {
      throw new Error('Auth key expired! Please sign in again.')
    }
  } catch {
    toast.error('Auth key expired! Please sign in again.')
    addCommentLoading.value = false
    return
  }

  try {
    const res = await actor.add_comment(
      marketId.value,
      replyComment.value.id ? [replyComment.value.id] : [],
      commentContent.value
    )

    if (res.success && res.comment) {
      if (replyComment.value.id) {
        comments.value.forEach((comment) => {
          if (comment.id == replyComment.value.id) {
            // ?? Not sure why we push profile id to comment replies
            // comment.replies.push(profile.value?.id)
          }
        })
      } else comments.value.unshift(res.comment)
      commentContent.value = ''
      newReply.value = res.comment
      setReplyComment({})
    } else {
      throw new Error("Can't place your comment")
    }
  } catch (err) {
    console.log('Error: ', err)
    toast.error("Can't place your comment")
  }
  addCommentLoading.value = false
  autoResize()
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    if (event.ctrlKey) {
      addComment()
      return
    }
    commentContent.value += '\n'
  }
}

const removeReply = () => {
  setReplyComment({})
}

interface PlaceBetType {
  user: PickedUser
  optionId: number
  option: string
  type: string
  bet_amount: number
  amount: number
  tokenPrice: number
}

const placeBet = (params: PlaceBetType) => {
  const { user, option, type, bet_amount, amount, tokenPrice } = params
  if (
    topHolders.value.filter(
      (holder) => holder.user.id == user.id && holder.option == option && holder.type == type
    ).length > 0
  ) {
    topHolders.value.filter(
      (holder) => holder.user.id == user.id && holder.option == option && holder.type == type
    )[0].volume += bet_amount
  } else {
    let holder: HolderType = {
      user,
      option,
      type,
      volume: bet_amount
    }
    topHolders.value.push(holder)
  }
  topHolders.value = topHolders.value.sort((a, b) => b.volume - a.volume)

  const types = type === 'Yes' ? { Yes: null } : { No: null }

  const tx: Transaction = {
    user,
    optionTitle: option,
    types,
    tokenPrice,
    tokenAmount: amount,
    marketId: currentMarket.value!.id,
    // Okay with dummy data
    id: (transactions.value.length + 1).toString(),
    optionId: 0,
    totalAmount: 0,
    marketTitle: currentMarket.value!.title,
    marketImage: currentMarket.value!.image,
    version: currentMarket.value!.version,
    timestamp: BigInt(Date.now())
  }
  transactions.value.push(tx)
  transactions.value = transactions.value.sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
}
</script>
