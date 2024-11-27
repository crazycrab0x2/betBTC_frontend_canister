<template>
  <Table class="table-fixed">
    <table-head>
      <table-head-cell colspan="2" class="sm:!px-3"> User </table-head-cell>
      <table-head-cell class="sm:!px-3">
        <div class="flex items-center cursor-pointer" @click="handleSortByOption">
          Option
          <Icon v-if="isSortByOption === 'up'" icon="charm:arrow-up" />
          <Icon v-else-if="isSortByOption === 'down'" icon="charm:arrow-down" />
          <Icon v-else icon="fluent:chevron-up-down-24-filled" />
        </div>
      </table-head-cell>
      <table-head-cell class="sm:!px-3" v-if="version == MarketVersion.V1">
        <div class="flex items-center cursor-pointer" @click="handleSortByBet">
          Bet
          <Icon v-if="isSortByBet === 'up'" icon="charm:arrow-up" />
          <Icon v-else-if="isSortByBet === 'down'" icon="charm:arrow-down" />
          <Icon v-else icon="fluent:chevron-up-down-24-filled" />
        </div>
      </table-head-cell>
      <table-head-cell class="sm:!px-3 w-52">
        Amount {{ isBtc ? '(BTC)' : '(USD)' }}
      </table-head-cell>
      <table-head-cell colspan="2" class="sm:!px-3"> Time </table-head-cell>
    </table-head>
    <table-body v-if="sortedTransactions.length > 0">
      <table-row v-for="(transaction, index) in sortedTransactions" :key="index">
        <table-cell colspan="2" class="sm:!px-3">
          <div class="flex items-center gap-3">
            <UserAvatar :user="transaction.user" />
            <span class="max-w-[80px] truncate overflow-hidden whitespace-nowrap">
              {{ getDisplayName(transaction.user) }}
            </span>
          </div>
        </table-cell>
        <table-cell class="sm:!px-3"> {{ transaction.optionTitle }} </table-cell>
        <table-cell class="sm:!px-3" v-if="version == MarketVersion.V1">
          <span v-if="'Yes' in transaction.types" class="capitalize text-green-600"> Bet Yes </span>
          <span v-else-if="'No' in transaction.types" class="capitalize text-red-600">
            Bet No
          </span>
          <span v-else-if="'SYes' in transaction.types" class="capitalize text-green-600">
            Sold Yes
          </span>
          <span v-else class="capitalize text-red-600"> Sold No </span>
        </table-cell>
        <table-cell class="sm:!px-3">
          {{
            isBtc
              ? convertSats2Btc(transaction.tokenAmount * transaction.tokenPrice).toFixed(8)
              : convertSats2Btc(
                  transaction.tokenAmount * transaction.tokenPrice * btcPrice
                ).toFixed(2)
          }}
        </table-cell>
        <table-cell colspan="2" class="sm:!px-3">
          <DateTime :timestamp="Number(transaction.timestamp)" timestampClass="sm:!px-3" />
        </table-cell>
      </table-row>
    </table-body>
    <table-body v-else>
      <table-row>
        <td colspan="4">
          <p class="inter text-[#FEFEFA] text-[14px] font-[400] text-center leading-[44px]">
            No record
          </p>
        </td>
      </table-row>
    </table-body>
  </Table>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import Table from '@/components/table/Table.vue'
import TableBody from '@/components/table/TableBody.vue'
import TableCell from '@/components/table/TableCell.vue'
import TableHead from '@/components/table/TableHead.vue'
import TableHeadCell from '@/components/table/TableHeadCell.vue'
import TableRow from '@/components/table/TableRow.vue'
import { Icon } from '@iconify/vue'
import { getDisplayName } from '@/utils/user'
import type { Transaction } from '@/types/notificationTypes'
import DateTime from '@/components/common/DateTime.vue'
import UserAvatar from '../common/UserAvatar.vue'
import { storeToRefs } from 'pinia'
import { useLayoutStore } from '@/stores/layout'
import { useHelpers } from '@/composables/useHelpers'
import { useMarketStore } from '@/stores/market'
import { MarketVersion } from '@/types/marketDataTypes'

const layoutStore = useLayoutStore()
const marketStore = useMarketStore()

const props = defineProps<{
  transactions: Array<Transaction>
  version: MarketVersion
}>()

const sortedTransactions = ref<Transaction[]>(props.transactions)
const isSortByOption = ref<String>('')
const isSortByBet = ref<String>('')
const { isBtc } = storeToRefs(layoutStore)
const { btcPrice } = storeToRefs(marketStore)
const { convertSats2Btc } = useHelpers()

const handleSortByOption = () => {
  if (isSortByOption.value === '') {
    isSortByOption.value = 'up'
    sortedTransactions.value = sortedTransactions.value.sort((a, b) =>
      a.optionTitle.toLowerCase().localeCompare(b.optionTitle.toLowerCase())
    )
  } else if (isSortByOption.value === 'up') {
    isSortByOption.value = 'down'
    sortedTransactions.value = sortedTransactions.value.sort((a, b) =>
      b.optionTitle.toLowerCase().localeCompare(a.optionTitle.toLowerCase())
    )
  } else {
    isSortByOption.value = ''
  }
  isSortByBet.value = ''
}

const handleSortByBet = () => {
  if (isSortByBet.value === '') {
    isSortByBet.value = 'up'
    sortedTransactions.value = sortedTransactions.value.sort((a, b) =>
      Object.keys(a.types)[0].toLowerCase().localeCompare(Object.keys(b.types)[0].toLowerCase())
    )
  } else if (isSortByBet.value === 'up') {
    isSortByBet.value = 'down'
    sortedTransactions.value = sortedTransactions.value.sort((a, b) =>
      Object.keys(b.types)[0].toLowerCase().localeCompare(Object.keys(a.types)[0].toLowerCase())
    )
  } else {
    isSortByBet.value = ''
  }
  isSortByOption.value = ''
}

watch(
  () => props.transactions,
  () => {
    sortedTransactions.value = props.transactions
  }
)
</script>
