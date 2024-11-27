<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div
    class="flex flex-row flex-wrap p-2 border border-[#3F3F45] sm:rounded-2xl rounded-lg w-full gap-[10px] justify-between"
  >
    <div class="w-[200px]">
      <img
        v-lazy="image"
        width="200"
        class="sm:rounded-2xl rounded-lg flex-shrink-0 sm:w-[200px] w-[80px]"
      />
    </div>
    <div
      class="flex flex-col p-[20px] border border-[#3F3F45] sm:rounded-xl rounded-lg bg-[#18181B] p-[10px] w-[400px] gap-[50px]"
    >
      <div class="flex flex-row gap-1 w-full">
        <Icon :icon="state.icon" :class="`text-[${state.iconColor}]`" width="20" height="20" />
        <div class="inter font-[400] text-[12px] text-[#E4E4E7] leading-[16px] my-auto">
          {{ state.text }}
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <div class="flex flex-row gap-1 w-full">
          <div class="inter font-[400] text-[16px] text-[#E4E4E7] leading-[16px] my-auto">
            Final Outcome :
          </div>
          <div class="inter text-[16px]" :class="`text-[${result ? '#55B5A6' : '#A1A1A9'}]`">
            {{ result ? Object.keys(result.betType)[0] : 'Yet to be determined' }}
          </div>
        </div>
        <div
          class="flex flex-row gap-1 w-full"
          v-if="marketStatus === MarketStatus.Resolved && !isSingleOption"
        >
          <div class="inter font-[400] text-[16px] text-[#E4E4E7] leading-[16px] my-auto">
            Winning Option :
          </div>
          <div class="inter text-[16px] text-[#FF9046]">
            {{ winningOption }}
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-[40px]">
        <div class="flex flex-row gap-[20px] relative">
          <Icon
            icon="vaadin:password"
            class="px-1 py-2 border sm:rounded-md rounded-lg"
            :class="`text-[${state.iconColors[STATUS.EXPIRED]}] border-[${state.iconColors[STATUS.EXPIRED]}]`"
            width="40"
            height="40"
          />
          <hr
            class="border-[2px] rotate-90 absolute -bottom-[21px]"
            :class="`border-[${state.hrColor[STATUS.EXPIRED]}]`"
            width="42"
          />
          <div class="flex flex-col">
            <div
              class="inter font-[500] text-[16px] leading-[22px]"
              :class="`text-[${state.textColors[STATUS.EXPIRED]}]`"
            >
              Proposed Outcome
            </div>
            <div class="inter font-[500] text-[14px] text-[#A1A1A9] leading-[20px]">
              {{ state.stateTexts[STATUS.EXPIRED] }}
            </div>
          </div>
        </div>
        <div class="flex flex-row gap-[20px] relative">
          <Icon
            icon="mynaui:scan"
            class="px-1 py-2 border sm:rounded-md rounded-lg"
            :class="`text-[${state.iconColors[STATUS.RESOLVING]}] border-[${state.iconColors[STATUS.RESOLVING]}]`"
            width="40"
            height="40"
          />
          <hr
            class="border-[2px] rotate-90 absolute -bottom-[21px]"
            :class="`border-[${state.hrColor[STATUS.RESOLVING]}]`"
            width="42"
          />
          <div class="flex flex-col">
            <div
              class="inter font-[500] text-[16px] leading-[22px]"
              :class="`text-[${state.textColors[STATUS.RESOLVING]}]`"
            >
              Checking for Disputes
            </div>
            <div class="inter font-[500] text-[14px] text-[#A1A1A9] leading-[20px]">
              {{ state.stateTexts[STATUS.RESOLVING] }}
            </div>
          </div>
        </div>
        <div class="flex flex-row gap-[20px] relative">
          <Icon
            icon="heroicons:lock-closed"
            class="p-[1px] rounded-full absolute top-[21px] left-[20px] rounded-full bg-[#121212]"
            :class="`text-[${state.iconColors[STATUS.RESOLVED]}]`"
            width="13"
            height="13"
          />
          <Icon
            icon="vaadin:password"
            class="px-1 py-2 border sm:rounded-md rounded-lg"
            :class="`text-[${state.iconColors[STATUS.RESOLVED]}] border-[${state.iconColors[STATUS.RESOLVED]}]`"
            width="40"
            height="40"
          />
          <hr
            class="border-[2px] rotate-90 absolute -bottom-[21px]"
            :class="`border-[${state.hrColor[STATUS.RESOLVED]}]`"
            width="42"
          />
          <div class="flex flex-col">
            <div
              class="inter font-[500] text-[16px] leading-[22px]"
              :class="`text-[${state.textColors[STATUS.RESOLVED]}]`"
            >
              Final Outcome
            </div>
            <div class="inter font-[500] text-[14px] text-[#A1A1A9] leading-[20px]">
              {{ state.stateTexts[STATUS.RESOLVED] }}
            </div>
          </div>
        </div>
        <div class="flex flex-row gap-[20px] relative">
          <Icon
            :icon="state.payoutIcon"
            class="px-1 py-2 border sm:rounded-md rounded-lg"
            :class="`text-[${state.iconColors[STATUS.PAYOUT]}] border-[${state.iconColors[STATUS.PAYOUT]}]`"
            width="40"
            height="40"
          />
          <div class="flex flex-col">
            <div
              class="inter font-[500] text-[16px] leading-[22px]"
              :class="`text-[${state.textColors[STATUS.PAYOUT]}]`"
            >
              Payout Status
            </div>
            <div class="inter font-[500] text-[14px] text-[#A1A1A9] leading-[20px]">
              {{ state.stateTexts[STATUS.PAYOUT] }}
            </div>
          </div>
        </div>
      </div>

      <div>
        <a
          target="_blank"
          :href="resolutionLink"
          class="flex flex-row justify-center gap-2 px-3 py-1 border border-[#3F3F45] sm:rounded-xl rounded-lg w-40"
        >
          <div class="inter font-[500] text-[14px] text-[#A1A1A9] leading-[20px] my-auto">
            Resolution link
          </div>
          <Icon icon="tabler:arrow-up-right" class="text-[#A1A1A9]" width="24" height="24" />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MarketStatus } from '@/types/marketDataTypes';
import { Icon } from '@iconify/vue'
import { computed } from 'vue'

const props = defineProps<{
  image: string
  result: any
  resolutionLink: string | undefined
  winningOption: string | undefined
  isSingleOption: boolean
  marketStatus: number
}>()

const STATUS = {
  EXPIRED:   0,
  RESOLVING: 1,
  RESOLVED:  2,
  PAYOUT:    3
}

const state = computed(() => {
  
  switch (props.marketStatus) {
    case MarketStatus.Closed:
      return {
        iconColor: '#55B5A6',
        text: 'This Market has been resolved and payouted.',
        icon: 'solar:shield-check-outline',
        payoutIcon: 'iconoir:check-circle',
        textColors: ['#E4E4E7', '#E4E4E7', '#E4E4E7', '#E4E4E7'],
        iconColors: ['#FF9046', '#FF9046', '#FF9046', '#FF9046'],
        hrColor: ['#FF9046', '#FF9046', '#FF9046'],
        stateTexts: [
          `Outcome has been proposed as ${Object.keys(props.result.betType)[0]}.`,
          'No dispute found.',
          `Final Outcome is ${Object.keys(props.result.betType)[0]}.`,
          'Payout successful, check your wallet.'
        ]
      }
    case MarketStatus.Resolved:
      return {
        iconColor: '#55B5A6',
        text: 'This Market has been resolved.',
        icon: 'solar:shield-check-outline',
        payoutIcon: 'ep:loading',
        textColors: ['#E4E4E7', '#E4E4E7', '#E4E4E7', '#A1A1A9'],
        iconColors: ['#FF9046', '#FF9046', '#FF9046', '#E4E4E7'],
        hrColor: ['#FF9046', '#FF9046', '#FF9046'],
        stateTexts: [
          `Outcome has been proposed as ${Object.keys(props.result.betType)[0]}.`,
          'No dispute found.',
          `Final Outcome is ${Object.keys(props.result.betType)[0]}.`,
          'Payout initiated.'
        ]
      }
    case MarketStatus.Resolving:
      return {
        iconColor: '#A1A1A9',
        text: 'This Market is undergoing resolution.',
        icon: 'mingcute:safe-shield-2-line',
        payoutIcon: 'hugeicons:alert-square',
        textColors: ['#E4E4E7', '#E4E4E7', '#A1A1A9', '#A1A1A9'],
        iconColors: ['#FF9046', '#E4E4E7', '#A1A1A9', '#A1A1A9'],
        hrColor: ['#FF9046', '#3F3F45', '#3F3F45'],
        stateTexts: [
          `Outcome has been proposed as ${Object.keys(props.result.betType)[0]}.`,
          'No dispute found.',
          'Final Outcome is yet to be determined.',
          'Payout yet to be initiated.'
        ]
      }
    case MarketStatus.Expired:
      return {
        iconColor: '#A1A1A9',
        text: 'This Market will be resolved, betting time is over.',
        icon: 'solar:shield-minimalistic-outline',
        payoutIcon: 'hugeicons:alert-square',
        textColors: ['#E4E4E7', '#A1A1A9', '#A1A1A9', '#A1A1A9'],
        iconColors: ['#E4E4E7', '#A1A1A9', '#A1A1A9', '#A1A1A9'],
        hrColor: ['#3F3F45', '#3F3F45', '#3F3F45'],
        stateTexts: [
          'Outcome will be resolved soon.',
          'Yet to check for disputes.',
          'Final Outcome is yet to be determined.',
          'Payout yet to be initiated.'
        ]
      }

    default:
      return {
        status: -1,
        iconColor: '',
        text: '',
        icon: '',
        payoutIcon: '',
        textColors: new Array(3),
        iconColors: new Array(3),
        hrColor: new Array(2),
        stateTexts: new Array(3)
      }
  }
})
</script>
