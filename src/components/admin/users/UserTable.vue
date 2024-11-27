<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <div v-if="isLoading">
      <div class="py-3 px-[8px] sm:px-6">
        <p class="text-[#A1A1A9] inter font-[500] text-[16px] leading-[20px] text-center">
          Loading...
        </p>
      </div>
    </div>
    <div v-else class="max-w-[1040px]">
      <Table>
        <table-head>
          <table-head-cell class="text-center">
            <input class="cursor-pointer" type="checkbox" />
          </table-head-cell>
          <table-head-cell>
            <div class="flex flex-row justify-between items-center">
              <span>Market</span>
              <Icon
                icon="fluent:chevron-up-down-24-regular"
                color="#E4E4E7"
                width="16"
                height="16"
              />
            </div>
          </table-head-cell>
          <table-head-cell>
            <div class="flex flex-row justify-between items-center">
              <span>User ID</span
              ><Icon
                icon="fluent:chevron-up-down-24-regular"
                color="#E4E4E7"
                width="16"
                height="16"
              />
            </div>
          </table-head-cell>
          <table-head-cell>
            <div class="flex flex-row justify-between items-center">
              <span>ckBTC Link</span
              ><Icon
                icon="fluent:chevron-up-down-24-regular"
                color="#E4E4E7"
                width="16"
                height="16"
              />
            </div>
          </table-head-cell>
          <table-head-cell>
            <div class="flex flex-row justify-between">
              <span>Action</span>
            </div>
          </table-head-cell>
        </table-head>
        <table-body v-if="users.length > 0">
          <UserRow
            v-for="user in users"
            :key="user.id"
            :user="user"
            :onClick="onClickMarket"
            :onRemove="actor.remove_market"
          />
        </table-body>
        <table-body v-else>
          <table-row>
            <td colspan="5">
              <p class="inter text-[#FEFEFA] text-[14px] font-[400] text-center leading-[44px]">
                No Market
              </p>
            </td>
          </table-row>
        </table-body>
      </Table>
      <div v-if="total > perPage && users.length > 0" class="flex gap-[3px] mt-8 justify-between">
        <!-- prev -->
        <div
          class="flex items-center gap-1 rounded-[8px] py-[4px] px-[2px] sm:px-[10px] sm:py-[6px] sm:rounded-[10px] border-[1px] w-fit"
          :class="
            pageNumber == 1
              ? 'bg-[#27272A] border-[#27272A] text-[#3F3F45] cursor-not-allowed'
              : 'bg-transparent border-[#3F3F45] text-[#A1A1A9] hover:border-[#FAFAFA] hover:text-[#FAFAFA] cursor-pointer'
          "
          @click="onPrev"
        >
          <Icon icon="codicon:arrow-left" width="18" height="18" />
          <p class="hidden sm:!block px-1 inter font-[500] text-[16px] leading-[22px]">Prev</p>
        </div>
        <div class="flex">
          <div
            v-for="(page, index) in visiblePages"
            :key="index"
            class="rounded-[8px] py-[4px] w-[31px] sm:w-[35px] sm:py-[6px] sm:rounded-[10px] border-[1px] inter font-[500] text-[14px] hover:text-[#E4E4E7]"
            :class="[
              pageNumber === page
                ? 'bg-[#27272A] border-[#27272A] text-[#E4E4E7]'
                : 'border-transparent bg-transparent text-[#A1A1A9]',
              Number(page) ? 'hover:border-[#27272A] cursor-pointer' : 'cursor-not-allowed'
            ]"
            @click="() => onClickPage(Number(page))"
          >
            <p v-if="page !== '...'" class="text-center">{{ page }}</p>
            <p v-else class="text-center">...</p>
          </div>
        </div>
        <div
          class="flex items-center gap-1 rounded-[8px] py-[4px] px-[2px] sm:px-[10px] sm:py-[6px] sm:rounded-[10px] border-[1px] w-fit"
          :class="
            pageNumber == totalPages
              ? 'bg-[#27272A] border-[#27272A] text-[#3F3F45] cursor-not-allowed'
              : 'bg-transparent border-[#3F3F45] text-[#A1A1A9] hover:border-[#FAFAFA] hover:text-[#FAFAFA] cursor-pointer'
          "
          @click="onNext"
        >
          <p class="hidden sm:!block px-1 inter font-[500] text-[16px] leading-[22px]">Next</p>
          <Icon icon="codicon:arrow-right" width="18" height="18" />
        </div>
      </div>
    </div>
    <MarketModal :visible="visible" :onClose="onClose" :market="setlectedUser!" />
  </div>
</template>
<script setup lang="ts">
import { onBeforeMount, ref, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { Icon } from '@iconify/vue'
import { Table, TableRow, TableBody, TableHead, TableHeadCell } from '@/components/table'
import UserRow from './UserRow.vue'
import type { User } from '@/types/profileDataTypes'

const authStore = useAuthStore()
const { backendActor } = storeToRefs(authStore)
const actor = backendActor.value
const total = ref<number>(0)
const perPage = ref<number>(10)
const pageNumber = ref<number>(1)
const users = ref<User[]>([])
const isLoading = ref<boolean>(false)
const visible = ref<boolean>(false)
const setlectedUser = ref<User>()

const props = defineProps({
  searchTxt: String
})

onBeforeMount(() => {
  fetchMarkets()
})

const totalPages = computed(() => {
  return Math.ceil(total.value / perPage.value)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisiblePages = 5
  const startPage = Math.max(1, pageNumber.value - 2)
  const endPage = Math.min(totalPages.value, startPage + maxVisiblePages - 1)
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }
  if (startPage > 1) {
    if (startPage > 2) pages.unshift('...')
    pages.unshift(1)
  }
  if (endPage < totalPages.value) {
    if (endPage < totalPages.value - 1) pages.push('...')
    pages.push(totalPages.value)
  }
  return pages
})

watch(
  () => props.searchTxt,
  () => {
    pageNumber.value = 1
    fetchMarkets()
  }
)

watch(
  () => [perPage.value, pageNumber.value],
  () => {
    fetchMarkets()
  }
)

const fetchMarkets = async () => {
  isLoading.value = true
  const [fetchedUsers, totalUsers] = await actor.get_users(perPage.value, pageNumber.value - 1)
  users.value = fetchedUsers
  total.value = totalUsers
  isLoading.value = false
}

const onClickMarket = (marketID: string) => {
  setlectedUser.value = users.value.find((a) => a.id === marketID)
  visible.value = true
}

const onClickPage = (page: number) => {
  if (page && page >= 0 && page <= totalPages.value) pageNumber.value = page
}

const onNext = () => {
  if (pageNumber.value < Math.ceil(total.value / perPage.value)) pageNumber.value += 1
}

const onPrev = () => {
  if (pageNumber.value > 1) pageNumber.value -= 1
}

const onClose = () => {
  visible.value = false
}
</script>
