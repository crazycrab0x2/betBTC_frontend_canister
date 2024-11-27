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
    <container v-else>
      <Table>
        <table-head class="text-center">
          <table-head-cell class="text-center">Rank</table-head-cell>
          <table-head-cell class="text-center">Username</table-head-cell>
          <table-head-cell class="text-center">Points</table-head-cell>
          <table-head-cell class="text-center">Volume({{ isBtc ? 'BTC' : 'USD' }})</table-head-cell>
          <table-head-cell class="text-center">Profit({{ isBtc ? 'BTC' : 'USD' }})</table-head-cell>
        </table-head>
        <table-body v-if="tableData.length">
          <table-row v-for="(user, index) in tableData" :key="index">
            <table-cell>
              <div class="flex items-center gap-3 justify-center">
                <img v-if="user.rank === 1" src="/first_rank.svg" alt="" width="32" />
                <img v-else-if="user.rank === 2" src="/second_rank.svg" alt="" width="32" />
                <img v-else-if="user.rank === 3" src="/third_rank.svg" alt="" width="32" />
                <p v-else class="text-[#A1A1A9] inter font-[500] text-[14px] leading-[20px]">
                  {{ user.rank }}
                </p>
              </div>
            </table-cell>
            <table-cell>
              <div class="flex items-center gap-3">
                <UserAvatar :user="user.user" @error="setFallbackImage"/>
                <p
                  class="text-[#A1A1A9] inter font-[500] text-[14px] leading-[20px] overflow-hidden"
                >
                  {{ user.user.displayName || user.user.handle }}
                </p>
              </div>
            </table-cell>
            <table-cell>
              <div class="text-center">
                {{ user.point }}
              </div>
            </table-cell>
            <table-cell>
              <div class="text-center">
                {{
                  isBtc
                    ? convertSats2Btc(user.volume).toFixed(8)
                    : convertSats2Btc(user.volume * btcPrice).toFixed(2)
                }}
              </div>
            </table-cell>
            <table-cell
              ><div class="text-center">
                {{
                  isBtc
                    ? convertSats2Btc(user.profit).toFixed(8)
                    : convertSats2Btc(user.profit * btcPrice).toFixed(2)
                }}
              </div>
            </table-cell>
          </table-row>
        </table-body>
        <table-body v-else>
          <table-row>
            <td colspan="6">
              <p class="inter text-[#FEFEFA] text-[14px] font-[400] text-center leading-[44px]">
                No record
              </p>
            </td>
          </table-row>
        </table-body>
      </Table>
      <Pagination
        :total="total"
        :pageNumber="pageNumber"
        :items="tableData"
        :pageSize="perPage"
        @page-change="handlePageChange"        
      />
    </container>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { onBeforeMount } from 'vue'
import type { LeaderBoardOutput } from '@/types/profileDataTypes'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { Table, TableRow, TableBody, TableHead, TableCell, TableHeadCell } from '@/components/table'
import { useHelpers } from '@/composables/useHelpers'
import Container from '@/components/container/Container.vue'
import PaginationTemplate from '@/components/common/Pagination.vue'
import { useLayoutStore } from '@/stores/layout'
import { useMarketStore } from '@/stores/market'
import UserAvatar from '../common/UserAvatar.vue'
import Pagination from '@/components/common/Pagination.vue'

const { convertSats2Btc } = useHelpers()

const props = defineProps(['duration', 'username'])
const authStore = useAuthStore()
const layoutStore = useLayoutStore()
const marketStore = useMarketStore()
const { btcPrice } = storeToRefs(marketStore)

const { backendActor } = storeToRefs(authStore)
const { isBtc } = storeToRefs(layoutStore)
const tableData = ref<LeaderBoardOutput[]>([])
const isLoading = ref(false)
const perPage = ref(10)
const pageNumber = ref(1)
const total = ref(0)

const actor = backendActor.value

const fetchLeaderboardData = async () => {
  try {
    isLoading.value = true
    const { users, count } = await actor.get_leaderboard(
      props.duration,
      perPage.value,
      pageNumber.value,
      props.username
    )
    total.value = count
    tableData.value = users
  } catch (error) {
    console.error('Error fetching leaderboard data:', error)
  } finally {
    isLoading.value = false
  }
}

watch(
  () => [props.username, props.duration],
  async () => {
    pageNumber.value = 1
    await fetchLeaderboardData()
  }
)

onBeforeMount(async () => {
  await fetchLeaderboardData()
})

const setFallbackImage = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = '/default2.svg'
}

const handlePageChange = (newPage: number) => {
  pageNumber.value = newPage
  fetchLeaderboardData()
}

</script>
