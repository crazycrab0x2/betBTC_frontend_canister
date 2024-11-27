<template>
  <div class="sticky top-0 h-screen w-[312px] bg-[#18181B] overflow-auto">
    <div class="flex flex-col justify-between h-full">
      <div class="flex flex-col">
        <div class="flex justify-between items-center px-4 sticky top-0 py-8 bg-[#18181B]">
          <img
            src="/horizontal_logo.svg"
            width="80"
            class="cursor-pointer"
            @click="$router.push('/')"
          />
          <UserAvatar v-if="profile" :user="profile" />
        </div>
        <div class="flex flex-col px-4 gap-6 mb-8">
          <div class="border-b-[1px] border-b-[#27272A]"></div>
          <!-- Admin -->
          <div class="flex flex-col gap-3" v-if="profile && isAdmin">
            <p class="inter px-5 font-[400] text-[12px] leading-[16px] text-[#A1A1A9]">
              {{ $t('sidebar-admin') }}
            </p>
            <div class="flex flex-col gap-1">
              <RouterLink
                class="group py-[10px] px-[18px] flex items-center gap-2 cursor-pointer rounded-[12px]"
                :class="route.path == '/admin' && 'bg-[#27272A]'"
                to="/admin"
              >
                <Icon
                  icon="carbon:home"
                  class="group-hover:text-[#FAFAFA] text-[#A1A1A9]"
                  width="20"
                  height="20"
                />
                <p class="inter text-[16px] font-[500] leading-[22px] text-[#E4E4Ea]">
                  {{ $t('sidebar-admin') }}
                </p>
              </RouterLink>
            </div>
          </div>
          <div class="flex flex-col gap-3">
            <p class="inter px-5 font-[400] text-[12px] leading-[16px] text-[#A1A1A9]">
              {{ $t('sidebar-core-functionality') }}
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
                  {{ $t('sidebar-home') }}
                </p>
              </RouterLink>
              <RouterLink
                v-if="profile"
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
                  {{ $t('sidebar-watchlist') }}
                </p>
              </RouterLink>
            </div>
          </div>
          <div class="border-b-[1px] border-b-[#27272A]"></div>
          <div class="flex flex-col gap-3">
            <p class="inter px-5 font-[400] text-[12px] leading-[16px] text-[#A1A1A9]">
              {{ $t('sidebar-user-engagement') }}
            </p>
            <div class="flex flex-col gap-1">
              <RouterLink
                v-if="profile"
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
                  {{ $t('sidebar-activity') }}
                </p>
              </RouterLink>
              <RouterLink
                class="group py-[10px] px-[18px] flex items-center gap-2 cursor-pointer rounded-[12px]"
                :class="route.path == '/leaderboard' && 'bg-[#27272A]'"
                to="/leaderboard"
              >
                <Icon
                  icon="tabler:chart-bar-popular"
                  class="group-hover:text-[#FAFAFA] text-[#A1A1A9]"
                  width="20"
                  height="20"
                />
                <p class="inter text-[16px] font-[500] leading-[22px] text-[#E4E4Ea]">
                  {{ $t('sidebar-leaderboard') }}
                </p>
              </RouterLink>
            </div>
          </div>
          <div class="border-b-[1px] border-b-[#27272A]"></div>
          <div class="flex flex-col gap-3">
            <p class="inter px-5 font-[400] text-[12px] leading-[16px] text-[#A1A1A9]">
              {{ $t('sidebar-settings-and-information') }}
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
                  {{ $t('sidebar-study') }}
                </p>
              </a>
              <RouterLink
                v-if="profile"
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
                  {{ $t('sidebar-wallet') }}
                </p>
              </RouterLink>
              <RouterLink
                v-if="profile"
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
                  {{ $t('sidebar-settings') }}
                </p>
              </RouterLink>
            </div>
          </div>
          <div class="border-b-[1px] border-b-[#27272A]"></div>
          <button
            v-if="profile"
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
              {{ $t('sidebar-sign-out') }}
            </p>
          </button>
          <button
            v-else
            class="group py-[10px] px-[18px] flex items-center gap-2 cursor-pointer rounded-[12px]"
            @click="() => setSignupModal(true)"
          >
            <Icon
              icon="ri:logout-circle-r-line"
              class="group-hover:text-[#FAFAFA] text-[#A1A1A9]"
              width="20"
              height="20"
            />
            <p class="inter text-[16px] font-[500] leading-[22px] text-[#E4E4Ea]">
              {{ $t('sidebar-sign-in') }}
            </p>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { useLayoutStore } from '@/stores/layout'
import { useI18n } from 'vue-i18n'
import UserAvatar from '../common/UserAvatar.vue'

const t = useI18n()
const router = useRouter()
const route = useRoute()
const layoutStore = useLayoutStore()
const authStore = useAuthStore()
const { setPrincipal, setProfile } = authStore
const { setSignupModal } = layoutStore
const { profile, isAdmin } = storeToRefs(authStore)

const onLogout = () => {
  setPrincipal(null)
  setProfile(null)
  router.push('/')
}
</script>
<style scoped>
::-webkit-scrollbar {
  width: 0px;
  height: 10px;
}
::-webkit-scrollbar-track {
  border-radius: 0px;
  background: transparent;
}
::-webkit-scrollbar-thumb {
  border-radius: 0px;
}
</style>
