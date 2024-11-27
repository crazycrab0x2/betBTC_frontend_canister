<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed, onBeforeMount, ref, watch } from 'vue'
import { useLayoutStore } from '@/stores/layout'
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'
import { isTMA, initCloudStorage } from '@tma.js/sdk'
import { Ed25519KeyIdentity } from '@dfinity/identity'
import { storeToRefs } from 'pinia'
import Loading from './Loading.vue'
import MarketCard from './MarketCard.vue'
import Header from '@/components/header/LandingHeader.vue'
import { useMarketStore } from '@/stores/market'
import { useToast } from 'vue-toastification'
import { useHelpers } from '@/composables/useHelpers'
import { Icon } from '@iconify/vue'
import Footer from '../footer/Footer.vue'
import type { User } from '@/types/profileDataTypes'
import { debounce } from '@syncfusion/ej2-base'
import TopMarketCardContainer from './TopMarketCardContainer.vue'
import { MarketVersion } from '@/types/marketDataTypes'

import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/zoom'

const MARKET_PER_PAGE = 18

const router = useRouter()
const route = useRoute()
const layoutStore = useLayoutStore()
const authStore = useAuthStore()
const marketStore = useMarketStore()
const toast = useToast()

const isShowedLanding = ref<boolean>(true)
const isLoading = ref(false)
const isLoadingMore = ref<boolean>(false)
const category = ref<string>('')

const { setSignupModal, setIsTelegramMiniApp, setSearchText } = layoutStore
const { isTelegramMiniApp, searchText } = storeToRefs(layoutStore)
const { setPrincipal, setProfile } = authStore
const { backendActor } = storeToRefs(authStore)
const { setMarkets, setCategories } = marketStore
const { markets } = storeToRefs(marketStore)
const onHandleIsShowLanding = () => {
  isShowedLanding.value = !isShowedLanding.value
}
const { toggleBodyScroll } = useHelpers()
const actor = backendActor.value
const pageNumber = ref<number>(0)
const totalNumber = ref<number>(0)
const isShowLoadMore = computed<boolean>(() => {
  if (
    totalNumber.value &&
    totalNumber.value > 16 &&
    pageNumber.value < Math.floor(totalNumber.value / 16)
  ) {
    return true
  }
  return false
})

const IDENITITY_KEY = 'BetBTC_Telegram_Mini_App'

const sortedMarkets = computed(() => {
  return [...markets.value].sort((a, b) => {
    const isTrendingA = a.categories.includes('trending')
    const isTrendingB = b.categories.includes('trending')
    const isFeaturedA = a.categories.includes('featured')
    const isFeaturedB = b.categories.includes('featured')
    const isV2A = a.version === MarketVersion.V2
    const isV2B = b.version === MarketVersion.V2
    const isBitcoinA = a.categories.includes('bitcoin')
    const isBitcoinB = b.categories.includes('bitcoin')
    if (isFeaturedA !== isFeaturedB) {
      return isFeaturedB ? 1 : -1
    }
    if (isV2A !== isV2B) {
      return isV2B ? 1 : -1
    }
    if (isBitcoinA !== isBitcoinB) {
      return isBitcoinB ? 1 : -1
    }
    return isTrendingB === isTrendingA ? 0 : isTrendingB ? 1 : -1
  })
})

onBeforeMount(async () => {
  const { category: categoryQuery, ref: referralId } = route.query
  if (referralId) {
    setSignupModal(true)
  }
  isLoading.value = true
  isLoadingMore.value = true

  const _isTMA = await isTMA()
  setIsTelegramMiniApp(_isTMA)
  setSearchText('')
  const categories = categoryQuery ? [categoryQuery as string] : undefined
  if (categoryQuery) category.value = categoryQuery as string

  const getMarketFetch = actor.get_markets(
    categories ? (categories as [string]) : [],
    [],
    MARKET_PER_PAGE,
    pageNumber.value
  )
  const getCategoriesFetch = actor.get_categories([])

  Promise.all([getMarketFetch, getCategoriesFetch])
    .then(([marketResult, categoryResult]) => {
      if ('markets' in marketResult) {
        const markets = marketResult.markets
        setMarkets(markets)
        totalNumber.value = marketResult.total
      }

      setCategories(categoryResult)
    })
    .catch((error) => {
      console.error(error)
    })
    .finally(() => {
      isLoading.value = false
      isLoadingMore.value = false
    })
})

watch(
  () => route.query.category,
  (category, oldCategory) => {
    if (category === oldCategory) return
    debouncedFilter(category ? category : '', searchText.value)
  }
)

watch(
  () => searchText.value,
  () => debouncedFilter(category.value, searchText.value)
)

const filter = async (category: string, text: string, isAppend = false) => {
  if (isLoadingMore.value) {
    return
  }
  isLoadingMore.value = true
  if (isAppend) {
    pageNumber.value = pageNumber.value + 1
  } else {
    pageNumber.value = 0
  }

  actor
    .get_markets(
      category === '' ? [] : [category],
      text === '' ? [] : [text],
      MARKET_PER_PAGE,
      pageNumber.value
    )
    .then((result) => {
      if ('markets' in result) {
        const marketsResult = result.markets
        if (!isAppend) {
          setMarkets(marketsResult)
        } else {
          setMarkets([...markets.value, ...marketsResult])
        }
        totalNumber.value = result.total
      }
    })
    .catch((error) => {
      console.error(error)
    })
    .finally(() => {
      isLoadingMore.value = false
    })
}

const debouncedFilter = debounce(filter, 300)

const handleLoadMore = () => debouncedFilter(category.value, searchText.value, true)

const onLogin = async () => {
  if (isTelegramMiniApp.value) {
    isLoading.value = true
    const cloudStorage = initCloudStorage()
    const restoredIdentity = await cloudStorage.get(IDENITITY_KEY)

    let identity: Ed25519KeyIdentity
    if (!restoredIdentity) {
      identity = await Ed25519KeyIdentity.generate()
      await cloudStorage.set(IDENITITY_KEY, JSON.stringify(identity.toJSON()))
    } else {
      identity = Ed25519KeyIdentity.fromJSON(restoredIdentity)
    }

    // setMiniAppIdentity(identity)

    let profile_res = await actor.signup('', [])
    if ('Ok' in profile_res) {
      setProfile(profile_res.Ok as User)
      setPrincipal(identity.getPrincipal().toText())
      router.push('/profile')
    } else {
      toast.error('Something went wrong.')
    }
    isLoading.value = false
  } else {
    setSignupModal(true)
    toggleBodyScroll()
  }
}
</script>

<template>
  <div class="relative min-h-screen h-full w-full m-0 flex items-center justify-center bg-black">
    <div class="relative w-full min-h-screen">
      <div class="relative flex flex-col inter w-full min-h-screen">
        <Header @onLogin="onLogin" @onHandleIsShowLanding="onHandleIsShowLanding" />
        <div class="flex flex-wrap md:mx-[40px] sm:mx-4 mx-2" v-if="!isLoading">
          <TopMarketCardContainer />
          <div
            v-for="market in sortedMarkets"
            :key="market.id"
            class="flex w-full md:w-6/12 xl:w-3/12"
          >
            <MarketCard :data="market" />
          </div>
          <div
            class="w-full col-span-2 flex justify-center items-center mt-8"
            v-if="!isLoading && isShowedLanding && isShowLoadMore"
          >
            <button
              class="group flex items-center border py-[10px] px-[14px] border-neutral-700 rounded-xl gap-1 bg-black transition-all duration-300 ease-in-out"
              @click="handleLoadMore"
            >
              <span
                class="inter font-medium text-neutral-400 group-hover:text-neutral-200 leading-[22px] text-[16px]"
              >
                Load more
              </span>
              <Icon
                v-if="isLoadingMore"
                icon="eos-icons:bubble-loading"
                color="#FF9046"
                width="20"
                height="20"
              />
            </button>
          </div>
        </div>
        <div
          class="w-screen flex-grow z-20 flex lg:flex items-center justify-center"
          :class="isShowedLanding ? 'flex' : 'hidden'"
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
      <Footer />
    </div>
  </div>
</template>
