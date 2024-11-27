<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="flex flex-col gap-[20px] w-full">
    <template v-if="isSingleOption">
      <ResolvedResult title="Proposed Outcome" :type="getResolveType(0)" />
    </template>
    <template v-else>
      <ResolvedResult
        v-for="(option, index) in options"
        :key="index"
        :title="option"
        :type="getResolveType(index)"
      />
    </template>
  </div>
  <ResolvedPanel
    :image="image"
    :result="result"
    :resolutionLink="resolutionLink"
    :winningOption="result && options[result.optionId]"
    :isSingleOption="isSingleOption"
    :marketStatus="marketStatus"
  />
</template>

<script setup lang="ts">
import ResolvedResult from './ResolvedResult.vue'
import ResolvedPanel from './ResolvedPanel.vue'

const props = defineProps<{
  image: string
  options: string[]
  result: any
  resolutionLink: string | undefined
  isSingleOption: boolean
  marketStatus: number
}>()

const getResolveType = (index: number): string => {
  if (!props.result) return 'Coming'

  let betType = Object.keys(props.result.betType)[0]
  return props.result.optionId === index ? betType : betType === 'Yes' ? 'No' : 'Yes'
}
</script>
