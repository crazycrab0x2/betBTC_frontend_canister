<!-- eslint-disable vue/require-v-for-key -->
<template>
  <div
    class="relative m-2 p-[1px] overflow-hidden w-full h-[260px] sm:rounded-[24px] rounded-2xl"
    :class="isFeaturedCard ? 'border-glow-animation' : ''"
    ref="marketFullContainer"
  >
    <div
      class="relative sm:rounded-[24px] rounded-2xl overflow-hidden flex flex-col w-full h-full p-3 inter"
      :class="[
        isExpanded ? 'gap-0' : 'gap-2',
        isFeaturedCard ? '!bg-[#1B2039]' : 'border-[1px]',
        isBitCoinCard ? 'bg-[#2e1708] border-[#452510] ' : 'bg-[#18181B] border-[#3F3F45]'
      ]"
      ref="marketContainer"
    >
      <div
        ref="marketContainer"
        class="flex flex-row gap-3 delay-100 transition-all duration-150 ease-in-out"
        :class="isExpanded ? 'opacity-0 max-h-0' : 'opacity-100 max-h-[500px]'"
      >
        <div class="flex flex-col gap-2">
          <div
            class="sm:rounded-[12px] rounded-xl w-20 h-20 bg-no-repeat bg-cover"
            v-lazy:background-image="data.image"
          ></div>
          <div
            class="flex flex-row gap-1 py-[2px] bg-[#293056] border border-[#363F72] text-[#E4E4E7] items-center justify-center rounded"
            :class="isFeaturedCard ? 'visible' : 'invisible'"
          >
            <Icon icon="ph:lightning-bold" width="12" height="12" />
            <span class="inter font-[400] text-[12px] leading-[16px]">Featured</span>
          </div>
        </div>
        <div class="flex flex-col justify-between">
          <RouterLink
            class="font-[500] text-[14px] text-[#FAFAFA] leading-[20px] overflow-hidden cursor-pointer webkit-box-limit"
            :to="`/market/${data.id}`"
          >
            {{ data.title }}
          </RouterLink>
          <div class="flex flex-wrap gap-1" v-if="!isExpanded">
            <BadgeItem
              v-for="(category, index) in data.categories.filter(
                (cat) => cat !== 'featured' && cat !== 'v2'
              )"
              :key="index"
              :categoryId="category.trim()"
              :setCategory="selectCategory"
              :class="[
                isFeaturedCard ? '!bg-[#293056] border !border-[#363F72]' : 'border ',
                isBitCoinCard ? 'bg-[#2e1708] border-[#452510]' : 'bg-[#27272A] border-[#3F3F45]'
              ]"
            />
          </div>
        </div>
      </div>
      <div
        class="flex flex-row gap-2 delay-100 transition-all duration-150 ease-in-out"
        :class="isExpanded ? 'opacity-0 max-h-0' : 'opacity-100 max-h-[500px]'"
      >
        <template v-if="data.version == MarketVersion.V2">
          <div
            class="rounded-full border-[1px] flex flex-row gap-[5px] px-[6px] py-1 bg-v2-icon items-center cursor-pointer"
            :class="isFeaturedCard ? 'border-[#363F72]' : 'border-[#452510]'"
            @click="() => selectCategory('v2')"
          >
            <Icon icon="mynaui:dice-two" color="white" width="16" height="16" />
            <span class="inter text-[#E4E4E7] text-[12px]">V2</span>
          </div>
        </template>
        <template v-if="is24hrCard && marketStatus === MarketStatus.Open">
          <div class="flex gap-[2px]">
            <span
              class="font-[400] text-[12px] leading-[16px] pl-2 pr-1 py-[2px] text-[#FF9046] rounded-l-2xl rounded-r"
              :class="isFeaturedCard ? 'bg-[#293056]' : 'bg-[#27272A]'"
            >
              24h
            </span>
            <span
              class="font-[400] text-[12px] leading-[16px] text-center py-[2px] text-[#E4E4E7] bg-[#27272A] rounded-r-2xl rounded-l w-16"
              :class="isFeaturedCard ? 'bg-[#293056]' : 'bg-[#27272A]'"
            >
              {{ leftTimeStr }}
            </span>
          </div>
        </template>
        <template v-else>
          <div class="flex items-center gap-1">
            <Icon icon="akar-icons:calendar" color="#E4E4E7" width="16" height="16" />
            <p class="inter text-[#E4E4E7] text-[12px] leading-[16px] font-[400]">
              Ends at
              {{ DateTime.fromMillis(Number(data.expireAt)).toFormat('dd LLL yy') }}
            </p>
          </div>
        </template>
        <div class="flex items-center gap-[2px] grow">
          <Icon icon="hugeicons:coins-01" color="#E4E4E7" width="16" height="16" />
          <div class="flex items-center">
            <span
              class="text-[#E4E4E7] text-[12px] leading-4 font-normal ml-[3px] mr-[1px]"
              v-if="isBtc"
            >
              ₿
            </span>
            <span
              class="text-[#E4E4E7] text-[12px] leading-4 font-normal ml-[3px] mr-[1px]"
              v-if="!isBtc"
            >
              $
            </span>
            <p class="inter text-[#E4E4E7] text-[12px] leading-[16px] font-[400]">
              {{
                isBtc
                  ? convertSats2Btc(totalVolume).toFixed(8)
                  : convertSats2Btc(totalVolume * btcPrice).toFixed(2)
              }}
            </p>
          </div>
        </div>
        <div v-if="!isExpanded" class="flex cursor-pointer" @click="onMarkMarket">
          <Icon
            v-if="markLoading"
            icon="eos-icons:bubble-loading"
            color="#FF9046"
            width="20"
            height="20"
          />
          <Icon
            icon="bi:bookmark-check-fill"
            color="#FF9046"
            width="20"
            height="20"
            v-else-if="profile?.id && markedUsers.includes(profile?.id)"
          />
          <Icon icon="bi:bookmark-plus-fill" color="#FAFAFA" width="20" height="20" v-else />
        </div>
      </div>
      <template v-if="marketStatus === MarketStatus.Open">
        <div
          class="flex flex-col gap-1 grow justify-end overflow-hidden"
          v-if="data.options.length == 1"
        >
          <SingleOption
            :image="data.image"
            :option="data.options[0]"
            :marketId="data.id"
            :index="0"
            :isExpand="marketOptions[0]"
            :optionExpand="optionExpand"
            :isFeaturedCard="isFeaturedCard"
            :isBitcoinCard="isBitCoinCard"
          />
        </div>
        <div class="flex flex-col gap-1 grow justify-end" v-else-if="data.options.length > 2">
          <template
            v-for="(option, index) in data.options.filter((item: any, index: any) => index < 2)"
          >
            <MultiOption
              v-if="marketOptions[index] ? true : !marketOptions.find((e) => e === true)"
              :key="index"
              :image="data.image"
              :option="option"
              :marketId="data.id"
              :index="index"
              :isExpand="marketOptions[index]"
              :optionExpand="optionExpand"
              :outcome="getChance(data, index)"
              :isFeaturedCard="isFeaturedCard"
              :isBitcoinCard="isBitCoinCard"
              :version="data.version"
            />
          </template>
          <SeeMoreOption v-if="!isExpanded" :id="data.id" />
        </div>
        <div class="flex flex-col gap-1 grow justify-end" v-else>
          <template v-for="(option, index) in data.options">
            <MultiOption
              v-if="marketOptions[index] ? true : !marketOptions.find((e) => e === true)"
              :key="index"
              :image="data.image"
              :option="option"
              :marketId="data.id"
              :index="index"
              :isExpand="marketOptions[index]"
              :optionExpand="optionExpand"
              :outcome="getChance(data, index)"
              :isFeaturedCard="isFeaturedCard"
              :isBitcoinCard="isBitCoinCard"
              :version="data.version"
            />
          </template>
        </div>
      </template>
      <template v-else>
        <div class="flex flex-col gap-1 grow justify-end">
          <template v-for="(option, index) in data.options.slice(0, 2)">
            <div
              class="flex flex-row content-center justify-between border rounded-full p-[1px] pl-2"
              :class="[
                isFeaturedCard ? 'border-[#363F72]' : '',
                isBitCoinCard ? 'border-[#452510]' : 'border-[#3F3F45]'
              ]"
            >
              <div class="inter font-[500] text-[12px] leading-[16px] text-[#E4E4E7] my-auto">
                {{ data.options.length === 1 ? 'Final Outcome' : option.option }}
              </div>
              <div
                class="flex flex-row gap-2 inter font-[500] text-[12px] leading-[16px] text-[#E4E4E7]"
              >
                <div class="my-auto">{{ getResolveData(getResolveType(index)).text }}</div>
                <Icon
                  :icon="`${getResolveData(getResolveType(index)).icon}`"
                  :class="`${getResolveData(getResolveType(index)).color}`"
                  width="28"
                  height="28"
                />
              </div>
            </div>
          </template>
          <SeeMoreOption v-if="data.options.length > 2" :id="data.id" />
        </div>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onBeforeMount, watch, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { useToast } from 'vue-toastification'
import MultiOption from './MultiOption.vue'
import SingleOption from './SingleOption.vue'
import BadgeItem from './BadgeItem.vue'
import { RouterLink, useRouter } from 'vue-router'
import { type Market, MarketStatus, MarketVersion } from '@/types/marketDataTypes'
import { getChance } from '@/utils/market'
import SeeMoreOption from './SeeMoreOption.vue'
import { useLayoutStore } from '@/stores/layout'
import { useMarketStore } from '@/stores/market'
import { useHelpers } from '@/composables/useHelpers'
import { DateTime } from 'luxon'

const { convertSats2Btc } = useHelpers()
const marketStore = useMarketStore()
const { btcPrice } = storeToRefs(marketStore)
const props = defineProps<{
  data: Market
  removeMarket?: (marketId: string) => void
}>()

const isFeaturedCard = computed(() => props.data.categories.includes('featured'))

const isBitCoinCard = computed(() => props.data.categories.includes('bitcoin'))

const is24hrCard = computed(() => props.data.categories.includes('24'))

const marketStatus = computed(() => {
  const isExpired = props.data.expireAt.getTime() < Date.now()
  const isResolved = !!props.data.resolvedAt && props.data.resolvedAt.getTime() < Date.now()
  const isClosed = !!props.data.closedAt && props.data.closedAt.getTime() < Date.now()
  const hasResult = !!props.data.result

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

const isExpanded = computed(() => marketOptions.value.indexOf(true) !== -1)

const getResolveType = (index: number): string => {
  if (!props.data.result) return 'Coming'

  let betType = Object.keys(props.data.result.betType)[0]
  return props.data.result.optionId === index ? betType : betType === 'Yes' ? 'No' : 'Yes'
}

const getResolveData = (type: string) => {
  let data = { icon: '', color: '', text: '' }

  switch (type) {
    case 'Coming':
      data = { icon: 'noto:hourglass-done', color: 'text-[#E4E4E7]', text: 'Resolving soon' }
      break
    case 'Yes':
      data = { icon: 'mingcute:check-circle-fill', color: 'text-[#4DA597]', text: 'Result is Yes' }
      break
    case 'No':
      data = { icon: 'mingcute:close-circle-fill', color: 'text-[#C94B45]', text: 'Result is No' }
      break

    default:
      break
  }

  return data
}

const totalVolume = ref(0)
const authStore = useAuthStore()
const toast = useToast()
const layoutStore = useLayoutStore()

const { setSignupModal } = layoutStore
const { isBtc } = storeToRefs(layoutStore)
const { profile, authClient, backendActor } = storeToRefs(authStore)
const markedUsers = ref<string[]>([])
const markLoading = ref(false)
const marketContainer = ref<HTMLDivElement>()
const marketFullContainer = ref<HTMLDivElement>()
const marketOptions = ref<boolean[]>([])
const actor = backendActor.value
const router = useRouter()

const leftTimeStr = ref('')
const leftTimeId = ref<any>(0)

onBeforeMount(() => {
  if (is24hrCard.value) {
    leftTimeId.value = setInterval(calcLeftTime, 1000)
  }
  if (props.data.marked) {
    markedUsers.value = props.data.marked
  }
  props.data.options.forEach((option) => {
    totalVolume.value += option.yesBetAmount + option.noBetAmount
  })
  marketOptions.value = new Array(props.data.options.length).fill(false)
})

watch(
  () => props.data,
  () => {
    if (props.data.marked) {
      markedUsers.value = props.data.marked
    }
    props.data.options.forEach((option) => {
      totalVolume.value += option.yesBetAmount + option.noBetAmount
    })
    marketOptions.value = new Array(props.data.options.length).fill(false)
  }
)

const calcLeftTime = () => {
  const curDate = new Date()
  const leftSeconds = Math.floor((props.data.expireAt.getTime() - curDate.getTime()) / 1000)
  if (leftSeconds < 0) {
    leftTimeStr.value = ''
    clearInterval(leftTimeId.value)
    return
  }

  const hr = Math.floor(leftSeconds / 3600)
  const min = Math.floor((leftSeconds % 3600) / 60)
  const sec = leftSeconds % 60

  leftTimeStr.value = `${hr}:${min}:${sec}`
    .replace(/^(\d:)/g, '0$1')
    .replace(/:(\d):/g, ':0$1:')
    .replace(/:(\d)$/g, ':0$1')
}

const selectCategory = (category: string) => {
  router.push(`/?category=${category}`)
}

const onMarkMarket = async () => {
  if (!authClient.value) return

  let isAuthenticated = false
  try {
    isAuthenticated = await authClient.value.isAuthenticated()
  } catch {
    isAuthenticated = false
  }

  if (!isAuthenticated) {
    setSignupModal(true)
    return
  }

  markLoading.value = true

  const markMarketResult = (await actor.mark_market(props.data.id)) as boolean

  //doesn't works so good
  if (markMarketResult) {
    if (!profile.value) return
    if (markedUsers.value.includes(profile.value.id)) {
      markedUsers.value = markedUsers.value.filter((user) => user != profile.value?.id)
      if (props.removeMarket) props.removeMarket(props.data.id)
      toast.success('Market removed from your watchlist')
    } else {
      markedUsers.value.push(profile.value.id)
      toast.success('Market added to your watchlist')
    }
  } else {
    toast.error('Something went wrong')
  }

  markLoading.value = false
}

const optionExpand = (id: number) => {
  if (marketOptions.value[id] == true) marketOptions.value[id] = false
  else {
    marketOptions.value = new Array(marketOptions.value.length).fill(false)
    marketOptions.value[id] = true
  }
}
</script>
<style scoped>
.flip-card {
  background-color: transparent;
  perspective: 1000px;
}
.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.flip-card:hover .flip-card-inner {
  transform: rotateX(180deg);
}

.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

.flip-card-back {
  color: white;
  transform: rotateX(180deg);
}
.grad {
  background: linear-gradient(
    180deg,
    rgba(18, 18, 18, 0.1) 0%,
    rgba(18, 18, 18, 0.5) 50%,
    rgba(18, 18, 18, 0.9) 100%
  );
}
.gradient-border {
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  border-bottom-right-radius: 16px;
  background: linear-gradient(200deg, #121212, #ff9046);
  padding: 1px; /* This creates the border width */
}

.bg-v2-icon {
  background: linear-gradient(to bottom right, #ff9046 0%, #121212 50%);
}
.content {
  height: 100%;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  border-bottom-right-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.border-glow-animation::before {
  content: '';
  display: block;
  background: conic-gradient(#3e4784 0deg, #121212 360deg);
  height: 1000px;
  width: 1000px;
  position: absolute;
  animation: rotate 15s linear infinite;
  z-index: 0;
  top: calc(50% - 500px);
  left: calc(50% - 500px);
}
@keyframes rotate {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(-360deg);
  }
}
.webkit-box-limit {
  display: -webkit-box;
  line-clamp: 3;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
