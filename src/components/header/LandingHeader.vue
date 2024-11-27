<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="sticky top-0 z-50 bg-black">
    <navbar @onHandleIsPage="onHandleIsShowLanding">
      <template #logo>
        <navbar-logo link="#" class="hidden lg:!block" />
        <navbar-logo class="lg:hidden" imageUrl="/horizontal_logo.svg" imageWidth="100" link="#" />
      </template>
      <template #default="{ isShowMenu, clickShowMobileMenu }">
        <div class="hidden xl:flex items-center grow justify-between">
          <div class="flex flex-row gap-1 ml-10">
            <button @click="() => selectCategory('All')">
              <p
                class="inter text-[16px] leading-[20px] text-nowrap px-2"
                :class="
                  category === 'All' ? 'font-[500] text-[#FF9046]' : 'font-[400] text-[#FEFEF1]'
                "
              >
                All
              </p>
            </button>
            <button class="relative rounded-full overflow-hidden" @click="handleFeatured">
              <div
                class="rounded-full bg-[#000] flex items-center gap-1 py-[6px] px-[12px] m-[1px]"
                :class="
                  category.indexOf('featured') !== -1
                    ? 'font-[500] text-[#FF9046]'
                    : 'text-neutral-200'
                "
              >
                <Icon icon="ph:lightning-bold" width="20" height="20" />
                <p class="inter text-[16px] text-nowrap font-medium leading-5">Featured</p>
              </div>
            </button>
            <button
              class="relative rounded-full overflow-hidden"
              @click="() => selectCategory('trending')"
            >
              <div
                class="rounded-full bg-[#000] flex items-center gap-1 py-[6px] px-[12px] m-[1px]"
                :class="category === 'trending' ? 'font-[500] text-[#FF9046]' : 'text-neutral-200'"
              >
                <Icon icon="ph:trend-up-bold" width="20" height="20" />
                <p class="inter text-[16px] text-nowrap font-medium leading-5">Trending</p>
              </div>
            </button>
            <dropdown
              text="More"
              button-classes="flex items-center inter text-[16px] leading-[20px] text-nowrap text-[#FEFEF1] px-3"
              trigger="hover"
            >
              <div
                class="flex flex-col min-w-[420px] border border-[#27272A] bg-[#121212] rounded-2xl inter"
              >
                <div class="flex flex-col p-8 gap-8">
                  <div class="flex flex-col gap-1">
                    <span class="font-[500] text-[16px] leading-[22px] text-[#E4E4E7]"
                      >Market Categories</span
                    >
                    <span class="font-[400] text-[14px] leading-[20px] text-[#A1A1A9]"
                      >List of all categories of markets available on betBTC.</span
                    >
                  </div>
                  <div class="flex flex-row gap-12">
                    <div
                      class="flex flex-col font-[500] text-[16px] text-[#A1A1A9] leading-[22px] gap-3 items-start"
                    >
                      <button
                        v-for="(nav, index) in navs"
                        :key="index"
                        :class="selectedNav === nav.title ? 'text-[#FF9046]' : ''"
                        @click="() => selectNav(nav.title)"
                      >
                        {{ nav.title }}
                      </button>
                    </div>
                    <div class="flex flex-col gap-2 grow">
                      <!-- <span class="font-[500] text-[14px] leading-[20px] text-[#A1A1A9]">Market Options</span> -->
                      <button
                        class="flex flex-row gap-2 px-3 py-2 text-[#A1A1A9] hover:text-white rounded-full"
                        v-for="(navValue, index) in selectedNavValues"
                        :key="index"
                        :class="
                          category.toLocaleLowerCase() === navValue.slug.toLocaleLowerCase()
                            ? 'bg-[#27272A]'
                            : ''
                        "
                        @click="() => selectCategory(navValue.slug)"
                      >
                        <img v-if="navValue.icon" :src="navValue.icon" width="20" />
                        <span class="font-[500] text-[16px] leading-[22px]">
                          {{ navValue.title }}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  class="flex flex-col gap-6 border-t-[1px] border-[#27272A] bg-[#18181B] px-8 py-6 rounded-b-2xl text-[16px] leading-[22px]"
                >
                  <a
                    href="https://youtu.be/x3zSuUcQsDs?si=eoiflo76TRxey1yf"
                    target="_blank"
                    class="flex flex-row gap-2 items-center text-[#A1A1A9]"
                  >
                    <Icon icon="hugeicons:play-square" width="20"></Icon>
                    <span>Demo - How To Bet on betBTC?</span>
                  </a>
                  <div class="flex flex-row gap-2 items-center text-[#52525A]">
                    <Icon icon="tabler:square-plus-2" width="20" />
                    <span>Make Your Own Market (Coming Soon)</span>
                  </div>
                </div>
              </div>
            </dropdown>
          </div>
          <div class="2xl:mx-8 2xl:max-w-[400px] max-w-[200px]">
            <form-input placeholder="Search Markets" v-model="searchText">
              <template #prefix>
                <Icon icon="icon-park-outline:search" color="#A1A1A9" width="22" height="22" />
              </template>
            </form-input>
          </div>
        </div>
        <navbar-collapse :is-show-menu="isShowMenu">
          <template #logo>
            <div class="flex items-center justify-between">
              <navbar-logo class="py-8" imageUrl="/horizontal_logo.svg" imageWidth="100" link="#" />
              <div class="flex gap-2">
                <button class="p-2 border border-[#3F3F45] rounded-lg" v-if="profile">
                  <Icon icon="lucide:bell" color="#a3a3a3" width="20" />
                </button>
                <RouterLink v-if="profile" to="/profile">
                  <UserAvatar :user="profile" />
                </RouterLink>
                <button class="p-2 rounded-lg" @click="clickShowMobileMenu">
                  <Icon icon="ic:round-close" color="#FF9046" width="20" />
                </button>
              </div>
            </div>
          </template>
          <template #default>
            <BalanceSwitch/>
            <div class="relative" ref="notificationRef">
              <button
                v-if="profile"
                class="relative border rounded-[12px] border-neutral-700 p-2 xl:block hidden"
                @click="toggleNotification"
              >
                <Icon icon="lucide:bell" color="#a3a3a3" width="25" />
                <div
                  class="absolute top-[8px] left-[22px] h-[8px] w-[8px] rounded-lg bg-[#FF9046]"
                  v-if="notifications.length > 0"
                ></div>
              </button>
              <div
                class="absolute bottom-[-5px] right-0 rounded-md translate-y-[100%] border border-[#3F3F45] min-w-[350px] text-white p-3 bg-[#121212]"
                v-if="isOpenNotification"
              >
                <ul>
                  <NotificationItem
                    v-for="notification in notifications"
                    :notification="notification"
                    :key="notification.id"
                  />
                  <li v-if="notifications.length === 0">No new notifications</li>
                </ul>
              </div>
            </div>
            <RouterLink v-if="profile" to="/profile">
              <UserAvatar :user="profile" />
            </RouterLink>
            <div class="flex items-center">
              <div class="flex flex-row" v-if="!profile">
                <button
                  class="inter !font-[500] text-[16px] leading-[22px] text-[#E4E4E7] px-4 py-2 rounded-[8px]"
                  @click="handleLogin"
                >
                  Sign In
                </button>
                <button
                  class="inter !font-[500] text-[16px] leading-[22px] text-[#121212] bg-[#FF9046] px-4 py-2 rounded-[8px] shadow-[inset_0_3px_5px_rgba(255,255,255,0.6)]"
                  @click="handleSignup"
                >
                  Sign Up
                </button>
              </div>
              <button
                v-else
                @click="handleLogout"
                class="border rounded-[12px] border-neutral-700 p-2 hover:border-[#FF9046] group"
              >
                <Icon
                  icon="hugeicons:logout-04"
                  color="#a3a3a3"
                  width="25"
                  class="group-hover:hidden"
                />
                <Icon
                  icon="hugeicons:logout-04"
                  color="#FF9046"
                  width="25"
                  class="group-hover:block hidden"
                />
              </button>
            </div>
          </template>
          <template #mobile>
            <div class="flex flex-col flex-grow justify-between gap-12">
              <div class="flex flex-col gap-6">
                <div class="flex justify-between">
                  <BalanceSwitch/>             
                </div>
                <div>
                  <form-input placeholder="Search Markets" v-model="searchText">
                    <template #prefix>
                      <Icon
                        icon="icon-park-outline:search"
                        color="#A1A1A9"
                        width="22"
                        height="22"
                      />
                    </template>
                  </form-input>
                </div>
                <div class="flex flex-col gap-6">
                  <div class="flex">
                    <button class="w-full" @click="() => selectCategory('All')">
                      <p
                        class="text-left inter text-[16px] leading-[20px] text-nowrap"
                        :class="
                          category === 'All'
                            ? 'font-[500] text-[#FF9046]'
                            : 'font-[400] text-[#FEFEF1]'
                        "
                      >
                        All
                      </p>
                    </button>
                  </div>
                  <div class="flex">
                    <button class="relative overflow-hidden w-full" @click="handleFeatured">
                      <div
                        class="flex items-center gap-1"
                        :class="
                          category.indexOf('featured') !== -1
                            ? 'font-[500] text-[#FF9046]'
                            : 'text-neutral-200'
                        "
                      >
                        <Icon icon="ph:lightning-bold" width="20" height="20" />
                        <p class="inter text-[16px] text-nowrap font-medium leading-5">Featured</p>
                      </div>
                    </button>
                  </div>
                  <div class="flex">
                    <button
                      class="relative overflow-hidden w-ful"
                      @click="() => selectCategory('trending')"
                    >
                      <div
                        class="flex items-center gap-1"
                        :class="
                          category === 'trending' ? 'font-[500] text-[#FF9046]' : 'text-neutral-200'
                        "
                      >
                        <Icon icon="ph:trend-up-bold" width="20" height="20" />
                        <p class="inter text-[16px] text-nowrap font-medium leading-5">Trending</p>
                      </div>
                    </button>
                  </div>
                  <div class="flex flex-col gap-4">
                    <button
                      class="flex flex-row gap-1 items-center"
                      @click="
                        () => {
                          seeMore = !seeMore
                        }
                      "
                    >
                      <span class="inter font-[500] text-[16px] leading-5 text-[#E4E4E7]"
                        >More</span
                      >
                      <Icon icon="fe:arrow-up" color="#E4E4E7" />
                    </button>
                    <div
                      class="rounded-xl bg-[#121212] inter font-[500] text-[16px] text-[#A1A1A9] overflow-hidden items-start transition-all duration-300 ease-in-out"
                      :class="seeMore ? 'max-h-[800px] border border-[#3F3F45]' : 'max-h-0'"
                    >
                      <div class="flex flex-col gap-4 p-4">
                        <div
                          class="flex flex-col"
                          v-for="(nav, index) in navs"
                          :key="index"
                          @click="() => selectNav(nav.title)"
                        >
                          <button
                            class="flex flex-row gap-1 items-center"
                            :class="selectedNav === nav.title ? 'text-[#FF9046]' : ''"
                          >
                            <span>{{ nav.title }}</span>
                            <Icon
                              :icon="selectedNav === nav.title ? 'octicon:dash-16' : 'tabler:plus'"
                              width="16"
                            />
                          </button>
                          <div
                            class="flex flex-col gap-1 overflow-hidden items-start transition-all duration-300 ease-in-out"
                            :class="selectedNav === nav.title ? 'max-h-[600px] mt-4' : 'max-h-0'"
                          >
                            <button
                              class="flex flex-row gap-2 px-3 py-2 text-[#A1A1A9] hover:text-white rounded-full w-full"
                              v-for="(navValue, index) in nav.values"
                              :key="index"
                              :class="
                                category.toLocaleLowerCase() === navValue.slug.toLocaleLowerCase()
                                  ? 'bg-[#27272A]'
                                  : ''
                              "
                              @click="() => selectCategory(navValue.slug)"
                            >
                              <img v-if="navValue.icon" :src="navValue.icon" width="20" />
                              <span class="font-[500] text-[16px] leading-[22px]">
                                {{ navValue.title }}
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div
                        class="flex flex-col gap-6 border-t-[1px] border-[#27272A] bg-[#18181B] p-4 rounded-b-xl text-[16px] leading-[22px]"
                      >
                        <a
                          href="https://youtu.be/x3zSuUcQsDs?si=eoiflo76TRxey1yf"
                          target="_blank"
                          class="flex flex-row gap-2 text-[#A1A1A9]"
                        >
                          <Icon icon="hugeicons:play-square" width="25"></Icon>
                          <span class="mt-[2px]">Demo - How To Bet on betBTC?</span>
                        </a>
                        <div class="flex flex-row gap-2 text-[#52525A]">
                          <Icon icon="tabler:square-plus-2" width="25" />
                          <span class="mt-[2px]">Make Your Own Market (Coming Soon)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex items-center mb-[20px]">
                <button
                  v-if="!profile"
                  class="w-full text-center border border-[#FF9046] py-2 rounded-xl"
                  @click="
                    () => {
                      handleLogin()
                      clickShowMobileMenu()
                    }
                  "
                >
                  <span class="text-[#FF9046]"> Sign In </span>
                </button>
                <button
                  v-else
                  @click="handleLogout"
                  class="w-full text-center border border-[#FF9046] py-2 rounded-xl"
                >
                  <span class="text-[#FF9046]">Sign Out</span>
                </button>
              </div>
            </div>
          </template>
        </navbar-collapse>
      </template>
    </navbar>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, onBeforeMount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { Icon } from '@iconify/vue'
import { useAuthStore } from '@/stores/auth'
import Navbar from '@/components/navbar/Navbar.vue'
import NavbarCollapse from '@/components/navbar/NavbarCollapse.vue'
import NavbarLogo from '@/components/navbar/NavbarLogo.vue'
import FormInput from '@/components/form/Input.vue'
import Dropdown from '@/components/dropdown/Dropdown.vue'
import { useLayoutStore } from '@/stores/layout'
import { useMarketStore } from '@/stores/market'
import type { Notification } from '@/types/notificationTypes'
import { Principal } from '@dfinity/principal'
import { onClickOutside } from '@vueuse/core'
import NotificationItem from '@/components/header/NotificationItem.vue'
import { useHelpers } from '@/composables/useHelpers'
import UserAvatar from '../common/UserAvatar.vue'
import BalanceSwitch from '../common/BalanceSwitch.vue'

const { convertSats2Btc } = useHelpers()
const emit = defineEmits(['onLogin', 'onHandleIsShowLanding'])

const router = useRouter()
const authStore = useAuthStore()
const layoutStore = useLayoutStore()
const marketStore = useMarketStore()
const category = ref<string>('')
const isOpenNotification = ref<boolean>(false)
const notifications = ref<Notification[]>([])
const seeMore = ref<boolean>(false)

const { setSearchText } = layoutStore
const { isBtc } = storeToRefs(layoutStore)
const route = useRoute()

const { handleSignout, backendActor } = authStore
const { profile, balance, isLoadingBalance } = storeToRefs(authStore)
const { btcPrice } = storeToRefs(marketStore)

onBeforeMount(async () => {
  const categoryQuery = route.query.category
  category.value = categoryQuery ? (categoryQuery as string) : 'All'
})

const notificationRef = ref()

onClickOutside(notificationRef, () => {
  isOpenNotification.value = false
})

const navs = ref<
  {
    title: string
    values: {
      title: string
      slug: string
      icon?: string
    }[]
  }[]
>([
  {
    title: 'Regional',
    values: [
      {
        title: 'US',
        slug: 'US',
        icon: '/US.svg'
      },
      {
        title: 'Japan',
        slug: 'Japan',
        icon: '/JP.svg'
      },
      {
        title: 'China',
        slug: 'China',
        icon: '/CN.svg'
      },
      {
        title: 'Latin America',
        slug: 'latin-america',
        icon: '/earth.svg'
      }
    ]
  },
  {
    title: 'Finances',
    values: [
      {
        title: 'Crypto',
        slug: 'Crypto'
      },
      {
        title: 'Finance',
        slug: 'Finance'
      },
      {
        title: 'Bitcoin',
        slug: 'Bitcoin'
      }
    ]
  },
  {
    title: 'Sports',
    values: [
      {
        title: 'UEFA',
        slug: 'UEFA'
      },
      {
        title: 'NFL',
        slug: 'NFL'
      }
    ]
  },
  {
    title: 'Exotic',
    values: [
      {
        title: 'Saylor',
        slug: 'Saylor'
      },
      {
        title: 'GCR',
        slug: 'GCR'
      },
      {
        title: 'E-Sports',
        slug: 'E-Sports'
      }
    ]
  }
])
const selectedNav = ref<string>(navs.value[0].title)
const selectedNavValues = ref<
  {
    title: string
    slug: string
    icon?: string
  }[]
>(navs.value[0].values)
const selectNav = (nav: string) => {
  selectedNav.value = nav
  for (let i = 0; i < navs.value.length; i++) {
    if (navs.value[i].title === nav) {
      selectedNavValues.value = navs.value[i].values
      break
    }
  }
}
const searchText = ref('')
const selectCategory = (selectedCategory: string) => {
  if (selectedCategory === 'All') {
    router.push(`/`)
  } else {
    router.push(`/?category=${selectedCategory}`)
  }
  category.value = selectedCategory
}
const handleFeatured = () => {
  router.push(`/?category=featured`)
  category.value = 'featured'
}
const handleLogin = () => {
  sessionStorage.setItem('is_sign_up', 'false')
  emit('onLogin')
}
const handleSignup = () => {
  sessionStorage.setItem('is_sign_up', 'true')
  emit('onLogin')
}
const onHandleIsShowLanding = () => {
  emit('onHandleIsShowLanding')
}
const handleLogout = () => {
  handleSignout()
  router.push('/')
}

const fetchNewNotifications = async () => {
  if (!profile.value) {
    return
  }
  notifications.value = await backendActor.get_new_notifications(Principal.from(profile.value.id))
}

onMounted(() => {
  fetchNewNotifications()
})

const toggleNotification = async () => {
  isOpenNotification.value = !isOpenNotification.value
}

watch(
  () => searchText.value,
  () => {
    setSearchText(searchText.value)
  }
)
</script>

<style scoped>
.gradient-border {
  border-radius: 12px;
  background: linear-gradient(200deg, #121212, #ff9046);
  padding: 1px; /* This creates the border width */
}
.content {
  height: 100%;
  border-radius: 12px; /* Slightly less than parent */
  display: flex;
  align-items: center;
  justify-content: center;
}
.border-glow-animation::before {
  content: '';
  display: block;
  background: conic-gradient(#ff9046 0deg, #ff90463a 360deg);
  height: 200px;
  width: 200px;
  position: absolute;
  animation: rotate 10s linear infinite;
  z-index: -1;
  top: calc(50% - 100px);
  left: calc(50% - 100px);
}
@keyframes rotate {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(-360deg);
  }
}
</style>
