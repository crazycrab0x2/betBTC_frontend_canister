<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { onBeforeMount, watch, ref } from 'vue'
import { useLayoutStore } from '@/stores/layout'
import { useAuthStore } from '@/stores/auth'
import { Icon } from '@iconify/vue'
import { useRouter, useRoute } from 'vue-router'
import { isTMA, initCloudStorage } from '@tma.js/sdk'
import { Ed25519KeyIdentity } from '@dfinity/identity'
import { storeToRefs } from 'pinia'
import Loading from '../landing/Loading.vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Zoom, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/zoom'

const layoutStore = useLayoutStore()
const { keyboardHeight } = storeToRefs(layoutStore)
const keyboard = ref<HTMLInputElement | null>(null)
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const referral = ref('')
const isLoading = ref(false)
const status = ref('')
const { setSignupModal, setIsTelegramMiniApp } = layoutStore
const { isTelegramMiniApp } = storeToRefs(layoutStore)
const { setPrincipal, setProfile } = authStore
const { userPrincipal } = storeToRefs(authStore)
const modules = [Zoom, Autoplay, Pagination, Navigation]
const IDENITITY_KEY = 'BetBTC_Telegram_Mini_App'

const posts = [
  {
    url: 'https://x.com/betbtcwin/status/1821248431714619541',
    image: '/partnership/INK.svg'
  },
  {
    url: 'https://x.com/betbtcwin/status/1821599954638663980',
    image: '/partnership/Pizza Ninjas.svg'
  },
  {
    url: 'https://x.com/betbtcwin/status/1821985379668689186',
    image: '/partnership/DeGods.svg'
  },
  {
    url: 'https://x.com/betbtcwin/status/1823434441181573124',
    image: '/partnership/ABC.png'
  },
  {
    url: 'https://x.com/betbtcwin/status/1823754270707212375',
    image: '/partnership/aeons.svg'
  },
  {
    url: 'https://x.com/betbtcwin/status/182415146158195135',
    image: '/partnership/wizard.svg'
  },
  {
    url: 'https://x.com/betbtcwin/status/1825606578814464202',
    image: '/partnership/on1.png'
  },
  {
    url: 'https://x.com/betbtcwin/status/1826307510250467514',
    image: '/partnership/frucks.png'
  },
  {
    url: 'https://x.com/betbtcwin/status/1826706870536671469',
    image: '/partnership/extraordinals.png'
  },
  {
    url: 'https://x.com/betbtcwin/status/1827054997458104788',
    image: '/partnership/bitmap_emporium_2.png'
  },
  {
    url: 'https://x.com/betbtcwin/status/1828144110030725182',
    image: '/partnership/jiurn.png'
  },
  {
    url: 'https://x.com/betbtcwin/status/1828506962625024208',
    image: '/partnership/bitfinity.png'
  },
  {
    url: 'https://x.com/betbtcwin/status/1828866845086027902',
    image: '/partnership/omnity.png'
  },
  {
    url: 'https://x.com/betbtcwin/status/1831417075325399148',
    image: '/partnership/bitdogs.png'
  }
]

watch(
  () => keyboardHeight.value,
  () => {
    if (keyboard.value) keyboard.value.style.marginBottom = `${keyboardHeight.value}px`
  }
)

onBeforeMount(async () => {
  // if (userPrincipal.value) router.push('/profile')
  const _isTMA = await isTMA()
  setIsTelegramMiniApp(_isTMA)
  if (route.query.ref) referral.value = route.query.ref as string
})

const onLogin = async () => {
  if (userPrincipal.value) router.push('/profile')
  else if (isTelegramMiniApp.value) {
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
    // const canisterId = process.env.VUE_APP_BACKEND as string
    // const agent = new HttpAgent({ host: 'https://ic0.app' })
    // const actor = Actor.createActor(idlFactory, { agent, canisterId })
    // let profile = (await actor.signup(identity.getPrincipal().toString(), nanoid(), "")) as Profile
    // setProfile(profile)
    // setPrincipal(identity.getPrincipal().toString())
    // isLoading.value = false
    // router.push('/profile')
  } else {
    setSignupModal(true)
  }
}

const onSwiper = (swiper: any) => {}
const onSlideChange = () => {}
</script>

<template>
  <div class="relative min-h-screen h-full w-full m-0 flex items-center justify-center bg-black">
    <div class="relative w-full min-h-screen" ref="keyboard">
      <div class="grid-back absolute top-0 left-0 w-full h-full opacity-85"></div>
      <div class="grid absolute top-0 left-0 w-full h-full"></div>
      <div class="absolute top-0 left-0 w-full h-full">
        <div
          class="h-full border-x-[#3F3B3B] border-x-[1px] mx-[20px] sm:mx-[54px] md:mx-[88px] lg:mx-[122px] xl:mx-[158px]"
        ></div>
      </div>
      <div class="relative flex flex-col items-center justify-around inter w-full min-h-screen">
        <div
          class="mt-16 flex justify-between items-center w-full px-[40px] sm:px-[74px] md:px-[108px] lg:px-[142px] xl:px-[176px]"
        >
          <img src="/horizontal_logo.svg" width="132px" class="hidden sm:!block" />
          <img src="/Logomark.svg" width="32px" class="sm:hidden" />
          <div class="flex items-center">
            <a
              href="https://study.betbtc.win"
              target="_blank"
              class="inter text-[16px] text-[#E4E4E7] !font-[500] leading-[20px] mr-8 hidden sm:!block hover:underline"
            >
              Study
            </a>
            <button
              class="inter !font-[500] text-[14px] leading-[20px] text-[#FF9046] border-[#FF9046] border-[1px] px-[20px] py-[6px] bg-[#FF90460D] rounded-[8px]"
              @click="onLogin"
            >
              Sign In
            </button>
          </div>
        </div>
        <div
          class="glow-box bg-[#1E1815] rounded-full w-[170px] sm:w-[190px] h-[26px] sm:h-[30px] flex justify-center items-center mt-10 md:mt-5"
        >
          <p class="text-[#E4E4E7] text-[12px] md:text-[14px]">Partnerships Inbound</p>
        </div>
        <div class="sm:hidden text-[40px] mt-8 w-full space-grotesk tracking-tighter !font-[500]">
          <p
            class="leading-[27px] border-b-[1px] border-[#3F3B3B] flex items-end justify-between text-[#FAFAFA] mb-6"
          >
            <span class="flex flex-col justify-end translate-y-[60%] ml-[17px]">
              <Icon icon="mdi:star-four-points-outline" color="#FF9046" width="7" height="7" />
            </span>
            A prediction
            <span class="flex flex-col justify-end translate-y-[60%] mr-[17px]">
              <Icon icon="mdi:star-four-points-outline" color="#FF9046" width="7" height="7" />
            </span>
          </p>
          <p
            class="leading-[27px] border-b-[1px] border-[#3F3B3B] flex items-end justify-between text-[#FAFAFA] mb-6"
          >
            <span class="flex flex-col justify-end translate-y-[60%] ml-[17px]">
              <Icon icon="mdi:star-four-points-outline" color="#FF9046" width="7" height="7" />
            </span>
            <span>market on <span class="text-[#FF9046]">Bitcoin</span></span>
            <span class="flex flex-col justify-end translate-y-[60%] mr-[17px]">
              <Icon icon="mdi:star-four-points-outline" color="#FF9046" width="7" height="7" />
            </span>
          </p>
        </div>
        <div
          class="hidden sm:!block text-[50px] md:text-[64px] lg:text-[80px] xl:text-[96px] mt-8 w-full space-grotesk tracking-tighter !font-[500]"
        >
          <p
            class="leading-[34px] md:leading-[43px] lg:leading-[54px] xl:leading-[66px] border-b-[1px] border-[#3F3B3B] flex items-end justify-between text-[#FAFAFA] mb-6"
          >
            <span
              class="flex flex-col justify-end translate-y-[60%] ml-[51px] md:ml-[85px] lg:ml-[119px] xl:ml-[155px]"
            >
              <Icon icon="mdi:star-four-points-outline" color="#FF9046" width="7" height="7" />
            </span>
            A prediction market
            <span
              class="flex flex-col justify-end translate-y-[60%] mr-[51px] md:mr-[85px] lg:mr-[119px] xl:mr-[155px]"
            >
              <Icon icon="mdi:star-four-points-outline" color="#FF9046" width="7" height="7" />
            </span>
          </p>
          <p
            class="text-[#FF9046] leading-[34px] md:leading-[43px] lg:leading-[54px] xl:leading-[66px] border-b-[1px] border-[#3F3B3B] flex items-end justify-between mb-[20px]"
          >
            <span
              class="flex flex-col justify-end translate-y-[60%] ml-[51px] md:ml-[85px] lg:ml-[119px] xl:ml-[155px]"
            >
              <Icon icon="mdi:star-four-points-outline" color="#FF9046" width="7" height="7" />
            </span>
            <span><span class="text-[#FAFAFA]">on</span> Bitcoin</span>
            <span
              class="flex flex-col justify-end translate-y-[60%] mr-[51px] md:mr-[85px] lg:mr-[119px] xl:mr-[155px]"
            >
              <Icon icon="mdi:star-four-points-outline" color="#FF9046" width="7" height="7" />
            </span>
          </p>
        </div>
        <p
          class="w-[80%] sm:w-[69%] md:w-[58%] lg:w-[47%] xl:w-[35%] text-[#E4E4E7] text-[16px] sm:text-[17px] md:text-[18px] lg:text-[19px] xl:text-[20px] text-center mt-5"
        >
          BetBTC allows users to trade contracts based on the outcome of future events using ckBTC.
        </p>
        <div class="w-[70%] lg:w-[60%] hidden md:!block my-8">
          <swiper
            direction="horizontal"
            :slides-per-view="2"
            :space-between="20"
            :loop="true"
            :autoplay="{
              delay: 2000,
              disableOnInteraction: false
            }"
            @swiper="onSwiper"
            @slideChange="onSlideChange"
            :modules="modules"
            class="!pt-[12px]"
          >
            <swiper-slide :zoom="true" v-for="(post, index) in posts" :key="index">
              <a
                :href="post.url"
                class="hover:-translate-y-2 duration-200 group relative rounded-[12px] overflow-hidden border-[1px] border-[#3F3F45]"
                target="_blank"
              >
                <img :src="post.image" class="w-[329px] sm:w-[478px] md:w-[329px] lg:w-[478px]" />
                <div
                  class="hidden md:!block absolute w-full h-full top-0 left-0 bg-[#121212] opacity-20 group-hover:opacity-0 transition-opacity duration-100"
                ></div>
              </a>
            </swiper-slide>
          </swiper>
        </div>
        <div class="md:hidden my-8">
          <swiper
            direction="vertical"
            :slides-per-view="2"
            :space-between="20"
            :loop="true"
            :autoplay="{
              delay: 2000,
              disableOnInteraction: false
            }"
            @swiper="onSwiper"
            @slideChange="onSlideChange"
            :modules="modules"
            class="!pt-[12px] h-[400px] sm:h-[560px]"
          >
            <swiper-slide :zoom="true" v-for="(post, index) in posts" :key="index">
              <a
                :href="post.url"
                class="rounded-[12px] overflow-hidden border-[1px] border-[#3F3F45]"
                target="_blank"
              >
                <img :src="post.image" class="w-[329px] sm:w-[478px] md:w-[329px] lg:w-[478px]" />
              </a>
            </swiper-slide>
          </swiper>
        </div>
        <a href="https://x.com/betbtcwin" class="flex mb-16">
          <p class="text-[18px] text-[#FAFAFA] cursor-pointer mr-2">Follow us</p>
          <span class="flex items-center">
            <Icon icon="ri:twitter-x-line" color="#FF9046" width="20" height="20" />
          </span>
        </a>
      </div>
    </div>
  </div>
  <div
    class="absolute w-screen h-screen top-0 left-0 bg-opacity-80 bg-[#717179] z-20 flex items-center justify-center"
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
  <!-- <SignupModal :referral="referral" /> -->
</template>

<style scoped>
@media (min-width: 640px) {
  .grid {
    background: radial-gradient(circle at 50% -30%, transparent 5%, black 65%);
  }
}

@media (max-width: 640px) {
  .grid {
    background: radial-gradient(circle at 50% -55%, transparent 0%, black 70%);
  }
}

.grid-back {
  background-image: radial-gradient(circle, #ff9046 1px, transparent 2px);
  background-size: 25px 25px;
}

.button {
  color: #121212;
  background-color: #ff9046;
  @apply shadow-none; /* reset any existing shadow */
  box-shadow:
    0px 2px 2px 2px #ffa66b inset,
    0px 0px 0px 1px #ff9046;
}

.button:hover {
  @apply shadow-none; /* reset any existing shadow */
  box-shadow:
    0px -2px 2px 0px #e88340 inset,
    0px 0px 0px 1px #ff9046;
}

.button:active {
  @apply shadow-none; /* reset any existing shadow */
  box-shadow:
    0px 2px 2px 2px #ffa66b inset,
    0px 0px 0px 1px #ff9046,
    0px 0px 0px 4px #ff904633;
}
/* .swiper-wrapper {
  padding-top: 12px !important;
} */
</style>
