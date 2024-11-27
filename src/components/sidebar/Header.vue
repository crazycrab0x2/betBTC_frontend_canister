<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div
    class="transition-all duration-200 sticky top-0 bg-[#121212] border-b-[1px] border-b-[#27272a]"
    :class="isHeaderExpand ? 'min-h-[100dvh] overflow-y-auto' : 'h-[64px] overflow-y-hidden'"
  >
    <expand-button
      class="md:hidden absolute right-3 top-3 z-20"
      @click="onExpand"
      :is-expand="isHeaderExpand"
    />
    <div
      class="flex flex-col justify-between h-[100dvh] overflow-auto bg-[#18181B]"
      :class="isHeaderExpand ? 'w-[280px]' : 'w-full'"
    >
      <div class="pb-3 flex flex-col gap-3">
        <div class="py-3 sticky top-0 bg-[#18181B]">
          <div class="flex justify-between items-center px-4 h-[40px]">
            <img
              src="/horizontal_logo.svg"
              width="80"
              height="40"
              class="cursor-pointer"
              @click="$router.push('/')"
            />
            <UserAvatar v-if="profile" :user="profile" @click="$router.push('/profile')" />           
          </div>
        </div>
        <div class="flex flex-col px-4 gap-6">
          <div class="border-b-[1px] border-b-[#27272A]"></div>
          <div class="flex flex-col gap-3">
            <p class="inter px-5 font-[400] text-[12px] leading-[16px] text-[#A1A1A9]">
              {{ $t('header-core-functionality') }}
            </p>
            <div class="flex flex-col gap-1">
              <RouterLink
                class="group py-[10px] px-[18px] flex items-center gap-2 cursor-pointer rounded-[12px]"
                :class="route.path == '/' && 'bg-[#27272A]'"
                to="/"
              >
                <Icon
                  icon="carbon:home"
                  class="group-hover:text-[#FAFAFA] text-[#A1A1A9]"
                  width="20"
                  height="20"
                />
                <p class="inter text-[16px] font-[500] leading-[22px] text-[#E4E4Ea]">
                  {{ $t('header-home') }}
                </p>
              </RouterLink>
              <RouterLink
                class="group py-[10px] px-[18px] flex items-center gap-2 cursor-pointer rounded-[12px]"
                :class="route.path == '/watchlist' && 'bg-[#27272A]'"
                to="/watchlist"
              >
                <Icon
                  icon="solar:heart-outline"
                  class="group-hover:text-[#FAFAFA] text-[#A1A1A9]"
                  width="20"
                  height="20"
                />
                <p class="inter text-[16px] font-[500] leading-[22px] text-[#E4E4Ea]">
                  {{ $t('header-leaderboard') }}
                </p>
              </RouterLink>
            </div>
          </div>
          <div class="border-b-[1px] border-b-[#27272A]"></div>
          <div class="flex flex-col gap-3">
            <p class="inter px-5 font-[400] text-[12px] leading-[16px] text-[#A1A1A9]">
              {{ $t('header-user-engagement') }}
            </p>
            <div class="flex flex-col gap-1">
              <RouterLink
                class="group py-[10px] px-[18px] flex items-center gap-2 cursor-pointer rounded-[12px]"
                :class="route.path == '/activity' && 'bg-[#27272A]'"
                to="/activity"
              >
                <Icon
                  icon="lucide:bell"
                  class="group-hover:text-[#FAFAFA] text-[#A1A1A9]"
                  width="20"
                  height="20"
                />
                <p class="inter text-[16px] font-[500] leading-[22px] text-[#E4E4Ea]">
                  {{ $t('header-activity') }}
                </p>
              </RouterLink>
              <RouterLink
                class="group py-[10px] px-[18px] flex items-center gap-2 cursor-pointer rounded-[12px]"
                :class="route.path == '/leaderboard' && 'bg-[#27272A]'"
                to="/leaderboard"
              >
                <Icon
                  icon="lucide:user-round-plus"
                  class="group-hover:text-[#FAFAFA] text-[#A1A1A9]"
                  width="20"
                  height="20"
                />
                <p class="inter text-[16px] font-[500] leading-[22px] text-[#E4E4Ea]">
                  {{ $t('header-leaderboard') }}
                </p>
              </RouterLink>
              <!-- <button
                class="group py-[10px] px-[18px] flex items-center gap-2 cursor-pointer rounded-[12px]"
                :class="route.path == '/rewards' && 'bg-[#27272A]'"
                @click="
                  () => {
                    $router.push('/rewards')
                    onExpand()
                  }
                "
              >
                <Icon
                  icon="ion:gift-outline"
                  class="group-hover:text-[#FAFAFA] text-[#A1A1A9]"
                  width="20"
                  height="20"
                />
                <p class="inter text-[16px] font-[500] leading-[22px] text-[#E4E4Ea]">Rewards</p>
              </button> -->
            </div>
          </div>
          <div class="border-b-[1px] border-b-[#27272A]"></div>
          <div class="flex flex-col gap-3">
            <p class="inter px-5 font-[400] text-[12px] leading-[16px] text-[#A1A1A9]">
              {{ $t('header-settings-and-information') }}
            </p>
            <div class="flex flex-col gap-1">
              <a
                href="https://study.betbtc.win"
                target="_blank"
                class="group py-[10px] px-[18px] flex items-center gap-2 cursor-pointer rounded-[12px]"
              >
                <Icon
                  icon="mynaui:book-open"
                  class="text-[#A1A1A9] group-hover:text-[#FAFAFA]"
                  width="20"
                  height="20"
                />
                <p class="inter text-[16px] font-[500] leading-[22px] text-[#E4E4Ea]">
                  {{ $t('header-study') }}
                </p>
              </a>
              <RouterLink
                class="group py-[10px] px-[18px] flex items-center gap-2 cursor-pointer rounded-[12px]"
                :class="route.path == '/wallet' && 'bg-[#27272A]'"
                to="/wallet"
              >
                <Icon
                  icon="solar:wallet-money-linear"
                  class="group-hover:text-[#FAFAFA] text-[#A1A1A9]"
                  width="20"
                  height="20"
                />
                <p class="inter text-[16px] font-[500] leading-[22px] text-[#E4E4Ea]">
                  {{ $t('header-wallet') }}
                </p>
              </RouterLink>
              <RouterLink
                class="group py-[10px] px-[18px] flex items-center gap-2 cursor-pointer rounded-[12px]"
                :class="route.path == '/profile' && 'bg-[#27272A]'"
                to="/profile"
              >
                <Icon
                  icon="ep:setting"
                  class="group-hover:text-[#FAFAFA] text-[#A1A1A9]"
                  width="20"
                  height="20"
                />
                <p class="inter text-[16px] font-[500] leading-[22px] text-[#E4E4Ea]">
                  {{ $t('header-settings') }}
                </p>
              </RouterLink>
            </div>
          </div>
          <div class="border-b-[1px] border-b-[#27272A]"></div>
          <button
            class="group py-[10px] px-[18px] flex items-center gap-2 cursor-pointer rounded-[12px]"
            :class="route.path == '/setting' && 'bg-[#27272A]'"
            @click="
              () => {
                onLogout()
              }
            "
          >
            <Icon
              icon="ri:logout-circle-r-line"
              class="group-hover:text-[#FAFAFA] text-[#A1A1A9]"
              width="20"
              height="20"
            />
            <p class="inter text-[16px] font-[500] leading-[22px] text-[#E4E4Ea]">
              {{ $t('header-sign-out') }}
            </p>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import ExpandButton from '@/components/button/ExpandButton.vue'
import { useLayoutStore } from '@/stores/layout'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import User from '../admin/users/User.vue'
import UserAvatar from '../common/UserAvatar.vue'

const t = useI18n()
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { setPrincipal, setProfile } = authStore
const { profile } = storeToRefs(authStore)
const layoutStore = useLayoutStore()
const { setHeaderExpand } = layoutStore
const { isHeaderExpand } = storeToRefs(layoutStore)
// const search = ref('')
const onExpand = () => {
  setHeaderExpand(!isHeaderExpand.value)
}
const onLogout = () => {
  setPrincipal(null)
  setProfile(null)
  router.push('/')
}
</script>
