<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <div class="flex flex-row gap-[8px] justify-between items-center py-7">
      <div
        class="group max-w-[480px] flex gap-2 rounded-[12px] px-[18px] py-[10px] border-[#3F3F45] hover:border-[#52525A] focus-within:!border-[#B56632] border-[1px]"
      >
        <Icon icon="wpf:search" color="#A1A1A9" width="20" height="20" />
        <input
          v-model="searchTxt"
          placeholder="Search"
          class="outline-none bg-transparent placeholder-[#A1A1A9] inter font-[500] text-[16px] leading-[22px] text-[#E4E4E7] w-full"
        />
      </div>
      <button
        class="flex flex-row gap-[4px] items-center border-[1px] border-[#8C4F27] rounded-[8px] py-[6px] px-[12px] text-[#E88340] text-[13px] font-[500] leading-[20px]"
        @click="onClickNewBtn"
      >
        <Icon icon="system-uicons:plus" color="#E88340" width="24" height="24" />
        <span>New</span>
      </button>
    </div>
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
              <span>Market ID</span
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
              <span>End Time</span
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
              <span> ckBTC Account </span>
              <Icon
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
        <table-body v-if="allMarket.length > 0">
          <MarketTableRow
            v-for="market in allMarket"
            :key="market.id"
            :market="market"
            :onClick="onClickMarket"
            :onRemove="actor.remove_market"
            :onEdit="onClickEditBtn"
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
      <Pagination
        :total="total"
        :pageNumber="pageNumber"
        :items="allMarket"
        :page-size="perPage"
        @page-change="handlePageChange"        
      />
    </div>
    <MarketModal
      :market="selectedMarket"
      :visible="marketModalVisible"
      :onClose="onCloseMarketModal"
    />
    <MarketResolveModal
      v-if="selectedMarket"
      :visible="resolveModalVisible"
      :onClose="onCloseResolveModal"
      :market="selectedMarket!"
    />
  </div>
</template>
<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { Icon } from '@iconify/vue'
import type { Market } from '@/types/marketDataTypes'
import { Table, TableRow, TableBody, TableHead, TableHeadCell } from '@/components/table'
import MarketTableRow from './MarketTableRow.vue'
import MarketResolveModal from './MarketResolveModal.vue'
import MarketModal from './MarketModal.vue'
import Pagination from '@/components/common/Pagination.vue'

const authStore = useAuthStore()
const { backendActor } = storeToRefs(authStore)
const actor = backendActor.value
const total = ref<number>(0)
const perPage = ref<number>(10)
const pageNumber = ref<number>(1)
const allMarket = ref<Market[]>([])
const isLoading = ref<boolean>(false)
const resolveModalVisible = ref<boolean>(false)
const selectedMarket = ref<Market>()
const searchTxt = ref<string>('')
const marketModalVisible = ref<boolean>(false)

onBeforeMount(() => {
  fetchMarkets()
})

watch(
  () => searchTxt.value,
  () => {
    pageNumber.value = 1
    fetchMarkets()
  }
)

const fetchMarkets = async () => {
  isLoading.value = true
  const getMarketsFetch = await actor.get_markets(
    [],
    [searchTxt.value ?? ''],
    perPage.value,
    pageNumber.value - 1
  )
  allMarket.value = getMarketsFetch.markets
  total.value = getMarketsFetch.total
  isLoading.value = false
}

const onClickMarket = (marketID: string) => {
  selectedMarket.value = allMarket.value.find((a) => a.id === marketID)
  resolveModalVisible.value = true
}

const onClickNewBtn = () => {
  marketModalVisible.value = true
}

const handlePageChange = (newPage: number) => {
  pageNumber.value = newPage
  fetchMarkets()
}

const onCloseResolveModal = () => {
  resolveModalVisible.value = false
  selectedMarket.value = undefined
}

const onCloseMarketModal = () => {
  marketModalVisible.value = false
  selectedMarket.value = undefined
}

const onClickEditBtn = (marketID: string) => {
  selectedMarket.value = allMarket.value.find((a) => a.id === marketID)
  marketModalVisible.value = true
}
</script>
