<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <Pagination v-slot="{ page }" :total="total" :sibling-count="1" show-edges :default-page="pageNumber" class="w-full gap-[3px] mt-8 justify-between items-center">
    <PaginationList v-slot="{ items }" class="flex justify-center items-center gap-3 bg-none">
      <PaginationFirst @click="handleFirstPage" class="bg-[#27272A]  text-white border-0 h-12 w-12" />
      <PaginationPrev @click="handlePrevPage(page)" class="bg-[#27272A]  text-white border-0 h-12 w-12" />
      <template v-for="(item, index) in items" :key="index">
        <PaginationListItem v-if="item.type === 'page'" :value="item.value" as-child @click="handlePageClick(item.value)" >
          <Button class="w-12 h-12 p-0 bg-[#27272A] border-0" :class="item.value ===page ? 'text-gray-300': 'text-gray-500'"  :variant="item.value === page ? 'default' : 'outline'">
            {{ item.value }}
          </Button>
        </PaginationListItem>
        <PaginationEllipsis v-else :key="item.type" :index="index" class="text-gray-500"/>
      </template>
      <PaginationNext class="bg-[#27272A]  text-white border-0 h-12 w-12" @click="handleNextPage(page, total)" />
      <PaginationLast class="bg-[#27272A]  text-white border-0 h-12 w-12" @click="handleLastPage(total, pageSize)" />
    </PaginationList>
  </Pagination>
</template>

<script setup lang="ts">
import {
  Button,
} from '@/components/ui/button'

import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
} from '@/components/ui/pagination'

defineProps<{
    total: number
    pageNumber: number
    items: any[]
    pageSize: number 
}>()

const emit = defineEmits<{
  (e: 'page-change', page: number): void
}>()

const handlePageClick = (page: number) => {
  emit('page-change', page)
}

const handleFirstPage = () => {
  emit('page-change', 1)
}

const handlePrevPage = (page: number) => {
  emit('page-change', Math.max(1, page - 1))
}

const handleNextPage = (page: number, total: number) => {
  emit('page-change', Math.min(total, page + 1))
}

const handleLastPage = (total: number, pageSize: number) => {
  emit('page-change', Math.ceil(total/pageSize))
}
</script>
