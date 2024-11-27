<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue'
import { useLayoutStore } from '@/stores/layout'
import { useAuthStore } from '@/stores/auth'
import { isTMA } from '@tma.js/sdk'
import { storeToRefs } from 'pinia'
import Loading from '../landing/Loading.vue'
import MarketCard from '../landing/MarketCard.vue'
import { type Market } from '@/types/marketDataTypes'
import { Principal } from '@dfinity/principal'

const layoutStore = useLayoutStore()
const authStore = useAuthStore()
const isShowedLanding = ref<boolean>(true)
const isLoading = ref(false)
const category = ref<string>('')
const { setIsTelegramMiniApp, setSearchText } = layoutStore
const { searchText } = storeToRefs(layoutStore)
const { profile, backendActor } = storeToRefs(authStore)
const bookmarkedMarkets = ref<Market[]>([])
const actor = backendActor.value

onBeforeMount(async () => {
  if (!profile.value) return
  setSearchText('')
  const _isTMA = await isTMA()
  setIsTelegramMiniApp(_isTMA)
  isLoading.value = true
  bookmarkedMarkets.value = await actor.get_watchlist(Principal.fromText(profile.value.id))
  isLoading.value = false
})

watch(
  () => searchText.value,
  () => {
    filter(category.value, searchText.value)
  }
)

const filter = (category: string, text: string) => {
  let result: Market[]
  if (category == 'All') result = bookmarkedMarkets.value as Market[]
  else {
    result = bookmarkedMarkets.value.filter((market) =>
      market.categories.includes(category)
    ) as Market[]
  }

  if (text != '') {
    result = result.filter((market: Market) =>
      market.title.toLowerCase().includes(text.toLowerCase())
    )
  }
  bookmarkedMarkets.value = result
}

const remove = (marketId: string) => {
  bookmarkedMarkets.value = bookmarkedMarkets.value.filter((a) => a.id != marketId)
}
</script>

<template>
  <div class="relative min-h-screen h-full w-full m-0 flex items-center justify-center bg-black">
    <div class="relative w-full min-h-screen">
      <div
        v-if="isLoading || bookmarkedMarkets.length > 0"
        class="relative flex flex-col inter w-full min-h-screen"
      >
        <div
          class="relative grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 sm:px-[30px]"
          :class="isShowedLanding ? 'grid' : 'lg:grid hidden'"
          v-if="!isLoading"
        >
          <MarketCard
            :data="market as Market"
            v-for="(market, index) in bookmarkedMarkets"
            :key="index"
            :removeMarket="remove"
          />
        </div>
        <div
          class="w-full flex-grow z-20 flex items-center justify-center"
          :class="isShowedLanding ? 'flex' : 'lg:flex hidden'"
          v-if="isLoading"
        >
          <Loading
            animationPath="/loadingLottie.json"
            width="200px"
            height="200px"
            :loop="true"
            :autoplay="true"
          />
        </div>
      </div>
      <div v-else class="flex justify-center items-center min-h-screen p-2 w-full">
        <p
          class="text-neutral-50 text-[32px] font-medium space-grotesk leading-10 text-center px-[32px]"
        >
          Watchlist is empty!
        </p>
      </div>
    </div>
  </div>
</template>

<style>
.landing-view .swiper-pagination-bullet-active {
  background: #ff9046;
}

.landing-view .swiper-pagination-bullet {
  width: 5px;
  height: 5px;
}

.landing-view .swiper-pagination-bullets {
  display: flex;
  padding: 30px;
}

.landing-view .swiper-button-next {
  @apply bg-[#1212121A] border-[1px] border-[#12121233] p-1 rounded-full;
  top: unset;
  bottom: 22px;
  right: 22px;
  z-index: 99999;
  width: 36px;
  height: 36px;
}

.landing-view .swiper-button-next::after {
  content: 'a';
  background-image: url('/arrow_right.svg');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
  width: 26px;
  height: 26px;
}

.landing-view .swiper-button-prev {
  @apply bg-[#1212121A] border-[1px] border-[#12121233] p-1 rounded-full;
  top: unset;
  bottom: 22px;
  left: unset;
  right: 66px;
  z-index: 99999;
  width: 36px;
  height: 36px;
}

.landing-view .swiper-button-prev::after {
  content: 'a';
  background-image: url('/arrow_left.svg');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
  width: 26px;
  height: 26px;
}
</style>
