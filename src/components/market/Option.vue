<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div
    class="flex xl:flex-row flex-col w-full border gap-[20px] delay-150 transition-all duration-300 ease-in-out overflow-hidden"
    :class="isExpand ? 'border-[rgb(63,63,69)] px-2 rounded-[24px] py-2' : 'border-transparent'"
  >
    <!-- option info -->
    <div
      class="w-full flex lg:flex-row flex-col sm:gap-[20px] gap-[1px] lg:items-center items-start"
    >
      <div class="flex flex-col justify-between" :class="isExpand ? 'h-full' : ''">
        <div
          class="flex flex-row inter text-[#FAFAF1] text-[16px] leading-[22px] break-words justify-between"
          v-if="!isExpand"
        >
          <span v-if="isMultiOutcome" class="w-min">{{ option.option }}</span>
          <span class="w-min">
            {{ (chance * 100).toFixed(2) }}% <span v-if="!isMultiOutcome">chance</span></span
          >
        </div>
        <div v-if="isExpand" class="space-grotesk flex flex-col gap-2 font-medium text-[#E4E4E7]">
          <span v-if="isMultiOutcome" class="text-[24px] leading-[32px]">{{ option.option }}</span>
          <span class="text-[40px] leading-[48px]">
            {{ (chance * 100).toFixed(2) }}%
            <span class="text-[16px]">chance</span>
          </span>
        </div>
        <div
          class="flex flex-row gap-[4px] rounded-[12px] p-[4px] text-[18px] leading-[24px] font-medium inter text-white border border-neutral-700 delay-150 transition-all duration-300 ease-in-out"
          :class="isExpand ? 'opacity-100 ' : 'opacity-0 max-h-0 p-0'"
        >
          <button
            class="rounded-[8px] py-[8px] px-[30.5px]"
            :class="orderType === 'buy' ? 'bg-[#4DA597]' : 'bg-neutral-700'"
            @click="() => (orderType = 'buy')"
          >
            Buy
          </button>
          <button
            class="rounded-[8px] py-[8px] px-[31px]"
            :class="orderType === 'sell' ? 'bg-[#C94B45]' : 'bg-neutral-700'"
            @click="() => (orderType = 'sell')"
          >
            Sell
          </button>
        </div>
      </div>
      <div
        class="flex flex-row w-full gap-3 delay-150 transition-all duration-300 ease-in-out sm:items-start items-center"
        :class="isExpand ? 'h-full' : ''"
      >
        <div class="flex flex-col" :class="isExpand ? 'gap-2' : 'gap-0'">
          <div class="flex flex-wrap md:gap-0 gap-2">
            <div class="flex flex-col gap-4 w-full">
              <div v-if="isExpand && orderType === 'sell'" class="flex w-full gap-2">
                <div class="border border-neutral-700 rounded-xl py-[10px] px-[14px] flex-grow">
                  <p
                    class="text-neutral-400 leading-[22px] text-[16px] font-medium flex items-center justify-between"
                  >
                    <template v-if="sellTokenPrice && bets[sellTokenIndex]">
                      <span> {{ sellTokenPrice }} Sats </span>
                      <span
                        :class="
                          'Yes' in bets[sellTokenIndex].betType ? 'bg-[#4DA597]' : 'bg-[#C94B45]'
                        "
                        class="px-2 py-[2px] rounded-full text-white"
                      >
                        {{ 'Yes' in bets[sellTokenIndex].betType ? 'Yes' : 'No' }}
                      </span>
                    </template>
                    <span v-else> Select your purchased token package to sell </span>
                  </p>
                </div>
                <dropdown
                  close-inside
                  button-classes="flex items-center inter text-[16px] leading-[20px] text-nowrap text-[#FEFEF1]"
                  trigger="click"
                >
                  <template #trigger>
                    <button
                      class="flex items-center border border-neutral-700 rounded-xl px-[14px] py-[10px] gap-2"
                    >
                      <Icon icon="fluent:filter-16-filled" color="#E4E4E7" width="20" height="20" />
                      <span class="text-neutral-400 inter leading-[22px] text-[16px] font-medium">
                        Select
                      </span>
                    </button>
                  </template>
                  <div
                    class="flex flex-col gap-3 bg-neutral-950 p-2 rounded-xl border border-neutral-700"
                    v-if="bets.length > 0"
                  >
                    <button
                      class="inter text-neutral-200 w-[83px] p-2 text-[12px] font-medium leading-4 rounded-lg"
                      :class="sellTokenIndex == index ? 'bg-neutral-800' : 'hover:bg-neutral-800'"
                      @click="() => onSelectedToken(index)"
                      v-for="(bet, index) in bets"
                      :key="index"
                    >
                      {{ bet.tokenPrice * Math.pow(10, DECIMAL) }} Sats
                    </button>
                  </div>
                  <div
                    class="flex flex-col gap-3 bg-neutral-950 p-2 rounded-xl border border-neutral-700"
                    v-else
                  >
                    <p
                      class="inter text-neutral-200 w-[83px] p-2 text-[12px] font-medium leading-4 rounded-lg"
                    >
                      No tokens
                    </p>
                  </div>
                </dropdown>
              </div>
              <div
                v-else
                class="grid gap-2"
                :class="version == MarketVersion.V1 ? 'grid-cols-2' : 'grid-cols-1'"
              >
                <div
                  class="rounded-[12px] border-[1px] border-[#a1a1a95e] p-1 flex items-center justify-between gap-2 xl:h-11"
                >
                  <div class="flex flex-row gap-[10px]">
                    <BtcIcon v-if="isBtc" />
                    <Icon
                      v-else
                      icon="hugeicons:dollar-02"
                      color="#A1A1A9"
                      width="16"
                      height="16"
                    />
                    <p class="inter font-[500] text-[#FAFAF1] text-[14px] leading-[20px] xl:w-16">
                      {{
                        isBtc
                          ? Math.floor(yesPrice)
                          : (convertSats2Btc(yesPrice) * btcPrice).toFixed(2)
                      }}
                      <!-- {{ yesPrice }} -->
                    </p>
                  </div>

                  <div
                    class="rounded-[8px] md:px-4 px-1 py-1 sm:px-[3px] px-[25px] inter font-[500] text-[14px] leading-[20px] text-[#FAFAFA] cursor-pointer"
                    :class="type !== 'Yes' && isExpand ? 'bg-[#27272A]' : 'bg-[#4DA597]'"
                    @click="() => onHandleShowBet('Yes', false)"
                  >
                    Bet
                    <span v-if="version == MarketVersion.V1"> Yes</span>
                  </div>
                </div>
                <div
                  class="rounded-[12px] border-[1px] border-[#A1A1A95E] p-1 flex items-center justify-between gap-2"
                  v-if="version == MarketVersion.V1"
                >
                  <div class="flex flex-row gap-[10px]">
                    <BtcIcon v-if="isBtc" />
                    <Icon
                      v-else
                      icon="hugeicons:dollar-02"
                      color="#A1A1A9"
                      width="16"
                      height="16"
                    />
                    <p class="inter font-[500] text-[#FAFAF1] text-[14px] leading-[20px]">
                      {{
                        isBtc
                          ? Math.floor(noPrice)
                          : (convertSats2Btc(noPrice) * btcPrice).toFixed(2)
                      }}
                      <!-- {{ noPrice }} -->
                    </p>
                  </div>

                  <div
                    class="rounded-[8px] md:px-4 px-1 py-1 inter font-[500] sm:text-[14px] text-[10px] leading-[20px] text-[#FAFAFA] cursor-pointer"
                    :class="type !== 'No' && isExpand ? 'bg-[#27272A]' : 'bg-[#C94B45]'"
                    @click="() => onHandleShowBet('No', false)"
                  >
                    Bet No
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- bet part -->
          <div
            ref="optionBetContainer"
            class="flex flex-col gap-4 delay-150 transition-all duration-300 ease-in-out"
            :class="isExpand ? 'opacity-100' : 'opacity-0'"
          >
            <!-- sell section -->
            <div
              v-if="orderType === 'sell'"
              :class="[
                'flex flex-col delay-150 transition-all duration-300 ease-in-out overflow-hidden text-neutral-200',
                isExpand ? 'opacity-100 max-h-[500px]' : 'opacity-0 max-h-0'
              ]"
            >
              <div class="grid grid-cols-2 pb-1">
                <div class="rounded-xl border-2 border-neutral-700 p-0.5 flex flex-col gap-[2px]">
                  <div
                    class="bg-neutral-700 rounded-t-lg p-2 text-[14px] font-[500] leading-[12px] delay-150 transition-all duration-3000 ease-in-out"
                  >
                    <p>Hold Tokens</p>
                    <div class="mt-2 flex gap-1">
                      <span>{{
                        sellTokenIndex >= 0
                          ? Number(
                              (bets[sellTokenIndex]?.tokenAmount / Math.pow(10, DECIMAL)).toFixed(2)
                            )
                          : 0
                      }}</span>
                    </div>
                  </div>
                  <div
                    class="bg-neutral-700 rounded-b-lg p-2 text-[14px] font-[500] leading-[12px] delay-150 transition-all duration-3000 ease-in-out"
                  >
                    <p>Return Amount</p>
                    <div class="mt-2 flex gap-1">
                      <span>{{ Number(sellTokenPrice * sellTokenAmount).toFixed() }} Sats</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- buy section -->
            <div
              v-else
              :class="[
                'flex flex-col delay-150 transition-all duration-300 ease-in-out overflow-hidden text-neutral-200',
                isExpand ? 'opacity-100 max-h-[500px]' : 'opacity-0 max-h-0'
              ]"
            >
              <div
                class="grid pb-1"
                :class="version == MarketVersion.V1 ? 'grid-cols-2' : 'grid-cols-1'"
              >
                <div class="rounded-xl border-2 border-[#27272A] p-0.5 flex flex-col gap-[2px]">
                  <div
                    class="bg-[#27272A] border-[#27272A] rounded-t-lg p-2 text-[14px] font-[500] leading-[12px] delay-150 transition-all duration-3000 ease-in-out"
                    :class="type == 'Yes' && 'text-[#4DA597]'"
                  >
                    <p class="inter font-[500]">Average Price</p>
                    <div class="mt-2 flex gap-1">
                      <span class="inter font-[500]">{{
                        isBtc
                          ? type === 'Yes'
                            ? Math.round(
                                bondingCurve(
                                  option.yesTokenAmount + tokenAmount,
                                  option.noTokenAmount
                                ) * Math.pow(10, DECIMAL)
                              )
                            : Math.round(yesPrice)
                          : (
                              ((type === 'Yes'
                                ? bondingCurve(
                                    option.yesTokenAmount + tokenAmount,
                                    option.noTokenAmount
                                  ) * Math.pow(10, DECIMAL)
                                : yesPrice) /
                                SATOSHIS_PER_BTC) *
                              btcPrice
                            ).toFixed(2)
                      }}</span>
                    </div>
                  </div>
                  <div
                    class="bg-[#27272A] p-2 text-[14px] font-[500] leading-[12px] delay-150 transition-all duration-3000 ease-in-out"
                    :class="type == 'Yes' && 'text-[#4DA597]'"
                  >
                    <p class="inter font-[500]">Tokens</p>
                    <div class="mt-2 flex gap-1">
                      <span class="inter font-[500]">{{
                        type === 'Yes'
                          ? tokenAmount
                            ? (tokenAmount / Math.pow(10, DECIMAL)).toFixed(1)
                            : 0
                          : 0
                      }}</span>
                    </div>
                  </div>
                  <div
                    class="bg-[#27272A] rounded-b-lg p-2 text-[14px] font-[500] leading-[12px] delay-150 transition-all duration-3000 ease-in-out"
                    :class="type == 'Yes' && 'text-[#55B5A6]'"
                  >
                    <p class="inter font-[500]">Potential Return</p>
                    <div class="mt-4 flex gap-1">
                      <span class="inter font-[500]">
                        {{
                          isBtc
                            ? type === 'Yes'
                              ? getPotentialReturn(
                                  option,
                                  version,
                                  totalBetAmount,
                                  betAmount,
                                  tokenAmount,
                                  type,
                                  btcPrice,
                                  isBtc
                                )
                              : 0
                            : type === 'Yes'
                              ? (
                                  (getPotentialReturn(
                                    option,
                                    version,
                                    totalBetAmount,
                                    betAmount,
                                    tokenAmount,
                                    type,
                                    btcPrice,
                                    isBtc
                                  ) *
                                    btcPrice) /
                                  SATOSHIS_PER_BTC
                                ).toFixed(2)
                              : 0
                        }}
                      </span>
                    </div>
                    <div class="mt-3 flex gap-1">
                      <span class="inter font-[500]">
                        {{
                          isBtc
                            ? type === 'Yes'
                              ? (
                                  (getPotentialReturn(
                                    option,
                                    version,
                                    totalBetAmount,
                                    betAmount,
                                    tokenAmount,
                                    type,
                                    btcPrice,
                                    isBtc
                                  ) /
                                    betAmount) *
                                  100
                                ).toFixed(1)
                              : 0
                            : type === 'Yes'
                              ? (
                                  (getPotentialReturn(
                                    option,
                                    version,
                                    totalBetAmount,
                                    betAmount,
                                    tokenAmount,
                                    type,
                                    btcPrice,
                                    isBtc
                                  ) /
                                    ((betAmount / btcPrice) * SATOSHIS_PER_BTC)) *
                                  100
                                ).toFixed(1)
                              : 0
                        }}
                        %
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  class="rounded-xl border-2 border-[#27272A] p-0.5 ml-1 flex flex-col gap-[2px]"
                  v-if="version == MarketVersion.V1"
                >
                  <div
                    class="bg-[#27272A] rounded-t-lg p-2 text-[14px] font-[500] leading-[12px] delay-150 transition-all duration-3000 ease-in-out"
                    :class="type == 'No' && 'text-[#C94B45]'"
                  >
                    <p class="inter font-[500]">Average Price</p>
                    <div class="mt-2 flex gap-1">
                      <span class="inter font-[500]">{{
                        isBtc
                          ? type === 'No'
                            ? Math.round(
                                2000 -
                                  bondingCurve(
                                    option.yesTokenAmount,
                                    option.noTokenAmount + tokenAmount
                                  ) *
                                    Math.pow(10, DECIMAL)
                              )
                            : Math.round(noPrice)
                          : (
                              ((type === 'No'
                                ? 2000 -
                                  bondingCurve(
                                    option.yesTokenAmount,
                                    option.noTokenAmount + tokenAmount
                                  ) *
                                    Math.pow(10, DECIMAL)
                                : noPrice) /
                                SATOSHIS_PER_BTC) *
                              btcPrice
                            ).toFixed(2)
                      }}</span>
                    </div>
                  </div>
                  <div
                    class="bg-[#27272A] p-2 text-[14px] font-[500] leading-[12px] delay-150 transition-all duration-3000 ease-in-out"
                    :class="type == 'No' && 'text-[#C94B45]'"
                  >
                    <p class="inter font-[500]">Tokens</p>
                    <div class="mt-2 flex gap-1">
                      <span class="inter font-[500]">{{
                        type === 'No'
                          ? tokenAmount
                            ? (tokenAmount / Math.pow(10, DECIMAL)).toFixed(1)
                            : 0
                          : 0
                      }}</span>
                    </div>
                  </div>
                  <div
                    class="bg-[#27272A] rounded-b-lg p-2 text-[14px] font-[500] leading-[12px] delay-150 transition-all duration-3000 ease-in-out"
                    :class="type == 'No' && 'text-[#C94B45]'"
                  >
                    <p class="inter font-[500]">Potential Return</p>
                    <div class="mt-4 flex gap-1">
                      <span class="inter font-[500]">
                        {{
                          isBtc
                            ? type === 'No'
                              ? getPotentialReturn(
                                  option,
                                  version,
                                  totalBetAmount,
                                  betAmount,
                                  tokenAmount,
                                  type,
                                  btcPrice,
                                  isBtc
                                )
                              : 0
                            : type === 'No'
                              ? (
                                  (getPotentialReturn(
                                    option,
                                    version,
                                    totalBetAmount,
                                    betAmount,
                                    tokenAmount,
                                    type,
                                    btcPrice,
                                    isBtc
                                  ) *
                                    btcPrice) /
                                  SATOSHIS_PER_BTC
                                ).toFixed(2)
                              : 0
                        }}
                      </span>
                    </div>
                    <div class="mt-3 flex gap-1">
                      <span class="inter font-[500]">
                        {{
                          isBtc
                            ? type === 'No'
                              ? (
                                  (getPotentialReturn(
                                    option,
                                    version,
                                    totalBetAmount,
                                    betAmount,
                                    tokenAmount,
                                    type,
                                    btcPrice,
                                    isBtc
                                  ) /
                                    betAmount) *
                                  100
                                ).toFixed(1)
                              : 0
                            : type === 'No'
                              ? (
                                  (getPotentialReturn(
                                    option,
                                    version,
                                    totalBetAmount,
                                    betAmount,
                                    tokenAmount,
                                    type,
                                    btcPrice,
                                    isBtc
                                  ) /
                                    ((betAmount / btcPrice) * SATOSHIS_PER_BTC)) *
                                  100
                                ).toFixed(1)
                              : 0
                        }}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex flex-col gap-1 sm:w-[300px]" v-if="orderType == 'buy'">
              <div class="flex w-full justify-between items-center">
                <p class="inter font-[500] text-[14px] leading-[20px] text-[#A1A1A9]">Amount</p>
                <div class="inter text-[12px] font-[500] leading-[16px] flex items-center gap-1">
                  <BtcIcon :fillColor="isBtc ? '#A1A1A9' : '#52525A'" />
                  <ToggleSwitch class="z-10" :toggled="isBtc" :onSwitch="onSwitchBtc" />
                  <Icon
                    icon="hugeicons:dollar-02"
                    :color="isBtc ? '#52525A' : '#A1A1A9'"
                    width="16"
                    height="16"
                  />
                </div>
              </div>
              <div>
                <form-input
                  placeholder="Amount"
                  class="items-center !py-1 border-neutral-500 hover:border-neutral-400 text-sm"
                  type="number"
                  v-model="betAmount"
                  :inputClasses="isBtc ? 'text-right' : 'text-left'"
                  min="0"
                  @keydown="
                    (event) => {
                      if (event.key === 'e' || event.key === 'E') {
                        event.preventDefault()
                      }
                    }
                  "
                >
                  <template #prefix v-if="!isBtc">
                    <span class="text-neutral-200"> $ </span>
                  </template>
                  <template v-if="betAmount !== undefined" #suffix>
                    <span class="text-neutral-200" v-if="isBtc"> SAT </span>
                    <div class="flex gap-1 -mr-3">
                      <button
                        @click="
                          () => {
                            if (isBtc) {
                              if (betAmount - 1000 > 0) {
                                betAmount = Number(betAmount) - 1000
                              } else {
                                betAmount = 1000
                              }
                              return
                            }
                            if (betAmount - 1 > 0) {
                              betAmount = Number(betAmount) - 1
                            } else {
                              betAmount = 1
                            }
                          }
                        "
                      >
                        <Icon icon="mdi:minus-box" color="#a3a3a3" width="20" />
                      </button>
                      <button
                        @click="
                          () => {
                            if (isBtc) {
                              betAmount = Number(betAmount) + 1000
                              return
                            }
                            betAmount = Number(betAmount) + 1
                          }
                        "
                      >
                        <Icon icon="mdi:plus-box" color="#a3a3a3" width="20" />
                      </button>
                    </div>
                  </template>
                </form-input>
              </div>
              <div class="flex items-center gap-1" v-if="isInsufficientBalance">
                <Icon icon="fluent-mdl2:error" color="#DD524C" width="14" height="14" />
                <p class="inter text-[12px] leading-[16px] text-[#DD524C] font-[400]">
                  Insufficient Balance
                </p>
              </div>
              <p
                v-else-if="type"
                class="inter font-[500] text-[14px] leading-[20px] text-[#A1A1A9] text-wrap"
              >
                You're betting
                {{
                  isBtc ? betAmount : Number(((betAmount / btcPrice) * SATOSHIS_PER_BTC).toFixed())
                }}
                <span v-if="version === MarketVersion.V1">on '{{ type }}'</span> for
                {{ option.option == 'Single' ? 'Option' : `'${option.option}'` }}.
              </p>
              <p class="inter font-[500] text-[14px] leading-[20px] text-[#A1A1A9]">
                10 Sats will cost as fee.
              </p>
            </div>
            <div class="flex flex-col gap-1" v-else>
              <div class="flex w-full justify-between items-center">
                <p class="inter font-[500] text-[14px] leading-[20px] text-[#A1A1A9]">Amount</p>
              </div>
              <div>
                <form-input
                  placeholder="Amount"
                  class="items-center !py-1 border-neutral-500 hover:border-neutral-400 text-sm"
                  type="number"
                  v-model="sellTokenAmount"
                  min="0"
                  @keydown="
                    (event) => {
                      if (event.key === 'e' || event.key === 'E') {
                        event.preventDefault()
                      }
                    }
                  "
                >
                  <template v-if="betAmount !== undefined" #suffix>
                    <span
                      class="text-neutral-200 rounded-[4px] bg-slate-800 px-1 -mr-1 cursor-pointer"
                      @click="selectMaxAmount"
                    >
                      Max
                    </span>
                    <div class="flex gap-1 -mr-3">
                      <button
                        @click="
                          () => {
                            if (sellTokenAmount - 1 > 0) {
                              sellTokenAmount = Number(sellTokenAmount) - 1
                            } else if (
                              Number(
                                (bets[sellTokenIndex].tokenAmount / Math.pow(10, DECIMAL)).toFixed(
                                  2
                                )
                              ) < 1
                            ) {
                              sellTokenAmount = Number(
                                (bets[sellTokenIndex].tokenAmount / Math.pow(10, DECIMAL)).toFixed(
                                  2
                                )
                              )
                            } else {
                              sellTokenAmount = 1
                            }
                          }
                        "
                      >
                        <Icon icon="mdi:minus-box" color="#a3a3a3" width="20" />
                      </button>
                      <button
                        @click="
                          () => {
                            // if (isBtc) {
                            //   betAmount = Number(betAmount) + 1000
                            //   return
                            // }
                            if (sellTokenIndex >= 0) {
                              if (
                                sellTokenAmount + 1 >
                                bets[sellTokenIndex].tokenAmount / Math.pow(10, DECIMAL)
                              )
                                sellTokenAmount = Number(
                                  (
                                    bets[sellTokenIndex].tokenAmount / Math.pow(10, DECIMAL)
                                  ).toFixed(2)
                                )
                              else sellTokenAmount = Number(sellTokenAmount) + 1
                            }
                          }
                        "
                      >
                        <Icon icon="mdi:plus-box" color="#a3a3a3" width="20" />
                      </button>
                    </div>
                  </template>
                </form-input>
              </div>
              <p class="inter font-[500] text-[14px] leading-[20px] text-[#A1A1A9]">
                10 Sats will cost as fee.
              </p>
            </div>
            <!-- bet button -->
            <div
              class="slider relative h-10 w-[184px] bg-zinc-800 rounded-xl border border-[#3F3F45] justify-start items-center inline-flex"
            >
              <div
                class="absolute top-[3px] left-[3px] w-8 h-8 oranj-button bg-[#ff9046] rounded-[8px] flex items-center justify-center cursor-pointer"
                ref="sliderButton"
                @mousedown="startSlide"
                @touchstart="startSlide"
              >
                <Icon
                  v-if="betLoading"
                  icon="eos-icons:bubble-loading"
                  color="#121212"
                  width="20"
                  height="20"
                />
                <Icon
                  v-else
                  icon="iconamoon:arrow-right-2-duotone"
                  color="#121212"
                  width="20"
                  height="20"
                  class="cursor-pointer"
                />
              </div>
              <div
                ref="sliderText"
                class="text-[#52525A] text-[16px] font-[500] inter leading-[22px] ml-[66px]"
              >
                Slide to {{ orderType == 'buy' ? 'Bet' : 'Sell' }}
              </div>
              <div
                class="absolute w-full h-full top-0 left-0 cursor-not-allowed"
                v-if="
                  type === '' ||
                  !type ||
                  (orderType === 'buy' && isInsufficientBalance) ||
                  marketStatus !== MarketStatus.Open
                "
              ></div>
              <div
                class="absolute w-full h-full top-0 left-0 cursor-not-allowed"
                v-if="
                  type === '' ||
                  !type ||
                  (orderType === 'sell' && sellTokenIndex == -1) ||
                  marketStatus !== MarketStatus.Open
                "
              ></div>
            </div>
          </div>
        </div>
        <div>
          <button
            class="w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] delay-150 transition-all duration-300 ease-in-out flex items-center justify-center border border-neutral-700 bg-[#1212121A] rounded-full"
            @click="onHandleShowBet(version === MarketVersion.V2 ? 'Yes' : '', true)"
          >
            <Icon
              :icon="isExpand ? 'system-uicons:minus' : 'system-uicons:plus'"
              color="#E4E4E7"
              width="24"
              height="24"
            />
          </button>
        </div>
      </div>
    </div>
    <div
      class="xl:w-2/5 delay-150 transition-all duration-300 ease-in-out"
      :class="isExpand ? '' : 'hidden'"
    >
      <div class="lg:pl-4 flex flex-col gap-[20px]">
        <div class="w-full flex justify-between items-center h-[40px]">
          <p class="inter text-[14px] font-[400] leading-[20px] text-neutral-400">
            Additional information
          </p>
        </div>
        <tabs v-model="currentAdditionalTab">
          <tab name="graph" title="Graph">
            <div
              class="text-neutral-200 flex flex-col lg:justify-start justify-center bg-[#18181B] p-[10px] rounded-[20px]"
            >
              <apexchart class="w-full" :options="chartOptions" :series="chartSeries" />
              <div class="flex justify-between pl-4 pr-2">
                <div class="flex gap-1 items-center">
                  <template v-if="version === MarketVersion.V1">
                    <span
                      v-if="type === 'Yes'"
                      class="inter text-[14px] leading-[20px] font-[500] text-green-500"
                    >
                      YES
                    </span>
                    <span
                      v-if="type === 'No'"
                      class="inter text-[14px] leading-[20px] font-[500] text-red-500"
                    >
                      NO
                    </span>
                  </template>
                  <span class="inter text-[14px] leading-[20px] font-[400]">
                    {{ (chance * 100).toFixed(2) }}%
                  </span>
                  <Stats
                    v-if="tokenAmountChange"
                    :stats="tokenAmountChange > 0 ? 'up' : 'down'"
                    :percent="Math.abs(tokenAmountChange)"
                    size="small"
                  />
                </div>
              </div>
            </div>
          </tab>
          <tab name="resolution" title="Resolution">
            <div class="text-neutral-200 min-h-[200px]">
              <a
                class="inter font-[500] text-[14px] leading-[20px] text-[#A1A1A9]"
                :href="resolveLink || '#'"
                :target="resolveLink ? '_blank' : ''"
                :rel="resolveLink ? 'noopener noreferrer' : ''"
                >{{ resolveLink }}</a
              >
              <p>{{ resolveDescription }}</p>
            </div>
          </tab>
        </tabs>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onBeforeMount, onMounted, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useRoute } from 'vue-router'
import { useToast, TYPE } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import { useMarketStore } from '@/stores/market'
import { useLayoutStore } from '@/stores/layout'
import { storeToRefs } from 'pinia'
import Tabs from '@/components/tabs/Tabs.vue'
import Tab from '@/components/tabs/Tab.vue'
import FormInput from '@/components/form/Input.vue'
import ToggleSwitch from '@/components/button/ToggleButton.vue'
import Dropdown from '@/components/dropdown/Dropdown.vue'
import Stats from '../icon/Stats.vue'
import BtcIcon from '../icon/BtcIcon.vue'
import { bondingCurve, DECIMAL } from '@/utils/market'
import {
  type Better,
  type MarketOption,
  type Market,
  MarketStatus,
  MarketVersion
} from '@/types/marketDataTypes'
import ToastWithSiginin from '../toast/ToastWithSiginin.vue'
import type { ActivityType } from '@/backend/betbtc-backend.did'
import { useHelpers, SATOSHIS_PER_BTC } from '@/composables/useHelpers'
import { getPotentialReturn, generateMarketGraphData } from '@/utils/market'
import { MARKET_GRAPH_LINE_COLOR_LIST } from '@/config/market'

const props = defineProps<{
  option: MarketOption
  totalBetAmount: number
  isExpand: boolean
  id: number
  selectOption: (id: number) => void
  balance: number
  isMultiOutcome: boolean
  bets: Better[]
  resolveLink?: string
  resolveDescription: string
  chance: number
  isSingleOption: boolean
  marketStatus: number
  version: MarketVersion
  currentMarket: Market
  optionId: number
}>()

const emits = defineEmits(['placeBet'])
const { convertSats2Btc } = useHelpers()
const authStore = useAuthStore()
const marketStore = useMarketStore()
const layoutStore = useLayoutStore()
const toast = useToast()
const route = useRoute()
const { btcPrice } = storeToRefs(marketStore)
const { profile, authClient, backendActor } = storeToRefs(authStore)
const { updateBalance } = authStore

const betLoading = ref(false)
const { isBtc } = storeToRefs(layoutStore)
const betAmount = ref<number>(isBtc.value ? 1000 : 1)
const actor = backendActor.value
const sellTokenIndex = ref<number>(-1)
const sellTokenPrice = ref<number>(0)
const sellTokenAmount = ref<number>(0)
const tokenAmountChange = ref<number>(0)
const optionBetContainer = ref<HTMLDivElement>()
const sliderButton = ref<HTMLDivElement | null>(null)
const sliderText = ref<HTMLDivElement | null>(null)
const type = ref('')
const orderType = ref<'buy' | 'sell'>('buy')
const yesPrice = ref<number>(0)
const noPrice = ref<number>(0)
const tokenPrice = ref<number>(1)
const currentAdditionalTab = ref('graph')
const currentGraphTab = ref('All')
const _graphTabs = ['1H', '6H', '12H', '1D', '1W', '1M', 'All']
const chartOptions = ref({
  chart: {
    id: 'TokenAmountChart',
    type: 'line',

    toolbar: {
      show: false,
      tools: {
        download: false,
        selection: false,
        zoom: false,
        zoomin:
          '<button class="!w-[40px] !h-[40px] flex items-center justify-center border border-neutral-700 rounded-full absolute -top-[110px] right-[5px]"><img src="/plus.svg" width="20"></button>',
        zoomout:
          '<button class="!w-[40px] !h-[40px] flex items-center justify-center border border-neutral-700 rounded-full absolute -top-[110px]"><img src="/minus.svg" width="20"></button>',
        pan: false,
        reset: false
      }
    }
  },
  colors: [],
  tooltip: {
    enabled: true,
    cssClass: 'text-black'
    // x: {
    //   show: false
    // },
    // y: {
    //   formatter: function(value: any, { series, seriesIndex, dataPointIndex, w }) {
    //     return value
    //   }
    // }
  },
  stroke: {
    width: 3
  },
  xaxis: {
    // type: 'numeric',
    labels: {
      show: false
    },
    axisTicks: {
      show: false
    },
    categories: []
  }
})
const chartSeries = ref<{ name: string; data: number[] }[]>([])
const tokenAmountSeries = ref<number[]>([])

const isInsufficientBalance = computed(() => {
  if (!type.value || type.value === '') {
    return false
  }
  const amountInSats = isBtc.value
    ? betAmount.value
    : Number(((betAmount.value / btcPrice.value) * SATOSHIS_PER_BTC).toFixed())
  return (
    amountInSats + 10 > props.balance ||
    type.value === '' ||
    (type.value == 'Yes' &&
      Number(
        isBtc.value
          ? Math.floor(yesPrice.value)
          : (convertSats2Btc(yesPrice.value) * btcPrice.value).toFixed(2)
      ) >
        betAmount.value * Math.pow(10, DECIMAL)) ||
    (type.value == 'No' &&
      Number(
        isBtc.value
          ? Math.floor(noPrice.value)
          : (convertSats2Btc(noPrice.value) * btcPrice.value).toFixed(2)
      ) >
        betAmount.value * Math.pow(10, DECIMAL))
  )
})

const tokenAmount = computed(() => {
  const betAmountInSats = isBtc.value
    ? betAmount.value
    : (betAmount.value * SATOSHIS_PER_BTC) / btcPrice.value

  // tokenPrice is currently in Token/Satoshis not decimal/sathshi
  return Number(((betAmountInSats * Math.pow(10, DECIMAL)) / tokenPrice.value).toFixed(1))
})

watch(
  () => props.option,
  () => {
    yesPrice.value =
      bondingCurve(props.option.yesTokenAmount, props.option.noTokenAmount) * Math.pow(10, DECIMAL)
    noPrice.value = 2000 - yesPrice.value
  }
)

watch(
  () => props.isExpand,
  () => {
    let optionBetContainerDiv = optionBetContainer.value
    if (props.isExpand) {
      if (optionBetContainerDiv) {
        optionBetContainerDiv.style.maxHeight = '500px'
      }
    } else {
      if (optionBetContainerDiv) {
        optionBetContainerDiv.style.maxHeight = '0px'
      }
    }
  }
)

watch(
  () => type.value,
  () => {
    tokenPrice.value = type.value === 'Yes' ? yesPrice.value : noPrice.value
    const len = tokenAmountSeries.value.length
    if (len > 1) {
      const prevVal = tokenAmountSeries.value[len - 2]
      const currentVal = tokenAmountSeries.value[len - 1]
      if (prevVal === 0 || 2000 - prevVal === 0) return
      if (type.value == 'Yes') {
        tokenAmountChange.value = Number(((currentVal - prevVal) / prevVal).toFixed(4))
      } else {
        tokenAmountChange.value = Number(((prevVal - currentVal) / (2000 - prevVal)).toFixed(4))
      }
    }
  }
)

onMounted(() => {
  let optionBetContainerDiv = optionBetContainer.value

  if (optionBetContainerDiv) {
    optionBetContainerDiv.style.maxHeight = '0px'
  }
})

onBeforeMount(() => {
  let yesPriceSeries: Array<number> = []
  let noPriceSeries: Array<number> = []
  const { yesTokenAmount, noTokenAmount } = props.option
  yesPrice.value = bondingCurve(yesTokenAmount, noTokenAmount) * Math.pow(10, DECIMAL)
  noPrice.value = 2000 - yesPrice.value

  // TODO: Check this logic
  const { graphYSeries, graphXSeries } = generateMarketGraphData(
    props.currentMarket,
    props.optionId
  )
  tokenAmountSeries.value = graphYSeries
  chartOptions.value.xaxis.categories = graphXSeries as never[]
  yesPriceSeries = graphYSeries.map((a) =>
    isBtc.value ? Number(a.toFixed(2)) : Number((convertSats2Btc(a) * btcPrice.value).toFixed(2))
  )
  noPriceSeries = graphYSeries.map((a) =>
    isBtc.value
      ? Number((2000 - a).toFixed(2))
      : Number((convertSats2Btc(2000 - a) * btcPrice.value).toFixed(2))
  )
  if (props.version === MarketVersion.V2) {
    type.value = 'Yes'
    props.currentMarket.options.map((option, index) => {
      const { graphYSeries } = generateMarketGraphData(props.currentMarket, index)
      if (index <= MARKET_GRAPH_LINE_COLOR_LIST.length) {
        chartOptions.value.colors.push(MARKET_GRAPH_LINE_COLOR_LIST[index] as never)
      } else {
        chartOptions.value.colors.push(
          MARKET_GRAPH_LINE_COLOR_LIST[index - MARKET_GRAPH_LINE_COLOR_LIST.length] as never
        )
      }
      chartSeries.value.push({ name: option.option, data: graphYSeries })
    })
  } else {
    chartOptions.value.colors.push(MARKET_GRAPH_LINE_COLOR_LIST[0] as never)
    chartOptions.value.colors.push(MARKET_GRAPH_LINE_COLOR_LIST[1] as never)
    chartSeries.value.push({ name: 'Yes', data: yesPriceSeries })
    chartSeries.value.push({ name: 'No', data: noPriceSeries })
  }
})

const onSelectedToken = (index: number) => {
  sellTokenIndex.value = index
  sellTokenPrice.value = props.bets[index].tokenPrice * Math.pow(10, DECIMAL)
  sellTokenAmount.value = Number((props.bets[index].tokenAmount / Math.pow(10, DECIMAL)).toFixed(2))
  if ('Yes' in props.bets[index].betType) {
    type.value = 'Yes'
  } else {
    type.value = 'No'
  }
}

const onSwitchBtc = () => {
  isBtc.value = !isBtc.value
  if (isBtc.value) {
    betAmount.value = 1000
    if (props.version == MarketVersion.V1) {
      chartSeries.value[1].data = tokenAmountSeries.value.map((a) => Number((2000 - a).toFixed(2)))
    }
  } else {
    betAmount.value = 1
    if (props.version == MarketVersion.V1) {
      chartSeries.value[1].data = tokenAmountSeries.value.map((a) =>
        Number((convertSats2Btc(2000 - a) * btcPrice.value).toFixed(2))
      )
    }
  }
}

const selectMaxAmount = () => {
  if (sellTokenIndex.value >= 0)
    sellTokenAmount.value = Number(
      (props.bets[sellTokenIndex.value].tokenAmount / Math.pow(10, DECIMAL)).toFixed(2)
    )
}

const startSlide = (event: any) => {
  event.preventDefault()
  document.addEventListener('mousemove', slide)
  document.addEventListener('mouseup', stopSlide)
  document.addEventListener('touchmove', slide)
  document.addEventListener('touchend', stopSlide)
}

const slide = (event: any) => {
  if (betLoading.value) {
    return
  }
  if (!sliderButton.value) return
  const slider = sliderButton.value.parentElement
  if (!slider) return
  const sliderRect = slider.getBoundingClientRect()
  let clientX
  if (event.touches) {
    clientX = event.touches[0].clientX
  } else {
    clientX = event.clientX
  }
  let newLeft = clientX - sliderRect.left - sliderButton.value.offsetWidth / 2
  if (newLeft < 0) newLeft = 0
  if (newLeft > sliderRect.width - sliderButton.value.offsetWidth - 10) {
    newLeft = sliderRect.width - sliderButton.value.offsetWidth - 10
    triggerEvent()
    stopSlide()
    return
  }
  sliderButton.value.style.left = newLeft + 'px'
}

const stopSlide = () => {
  document.removeEventListener('mousemove', slide)
  document.removeEventListener('mouseup', stopSlide)
  document.removeEventListener('touchmove', slide)
  document.removeEventListener('touchend', stopSlide)
}

const triggerEvent = async () => {
  if (!authClient.value || !profile.value) return
  if (!sliderButton.value) return
  sliderButton.value.style.left = '142px'
  if (!sliderText.value) return
  sliderText.value.style.marginLeft = '30px'
  sliderText.value.textContent = 'Processing'
  //place
  betLoading.value = true
  let isAuthenticated = false
  try {
    isAuthenticated = await authClient.value.isAuthenticated()
  } catch {
    toast(ToastWithSiginin, {
      type: TYPE.ERROR
    })
  }
  if (!isAuthenticated) {
    toast(ToastWithSiginin, {
      type: TYPE.ERROR
    })
  } else {
    let activityType: ActivityType = { Yes: null }

    if (type.value == 'Yes') {
      activityType = { Yes: null }
    } else if (type.value == 'No') {
      activityType = { No: null }
    }

    const marketId = (route.query.id || route.params.id) as string
    if (orderType.value === 'buy') {
      const betResult = await actor.bet(
        marketId,
        props.id,
        activityType,
        isBtc.value
          ? BigInt(betAmount.value)
          : BigInt(((betAmount.value / btcPrice.value) * SATOSHIS_PER_BTC).toFixed())
      )
      if (betResult) {
        emits('placeBet', {
          user: {
            id: profile.value.id,
            handle: profile.value.handle,
            displayName: profile.value.displayName,
            avatar: profile.value.avatar
          },
          option: props.option.option,
          type: type.value,
          bet_amount: betAmount.value,
          amount: tokenAmount.value,
          tokenPrice: tokenPrice.value
        })
        updateBalance()
        toast.success('Your bet placed successfully')
      } else {
        toast.error("Can't place a bet")
      }
    } else {
      const sellResult = await actor.sell(
        marketId,
        props.id,
        props.bets[sellTokenIndex.value].betType,
        BigInt(sellTokenAmount.value * Math.pow(10, DECIMAL)),
        BigInt(sellTokenPrice.value / Math.pow(10, DECIMAL))
      )
      if ('Ok' in sellResult) {
        sellTokenIndex.value = -1
        sellTokenPrice.value = 0
        sellTokenAmount.value = 0
        updateBalance()
        toast.success('Sold tokens successfully.')
      } else {
        toast.error(sellResult.Err)
      }
    }
  }
  betLoading.value = false
  sliderText.value.textContent = 'Slide to Bet'
  sliderButton.value.style.left = '0px'
  sliderText.value.style.marginLeft = '66px'
}

const onHandleShowBet = (value: string, expand: boolean) => {
  type.value = value
  if ((!props.isExpand && !expand) || expand) props.selectOption(props.id)
}

const _graphTabsonHandlerGraphTabClick = (tab: string) => {
  currentGraphTab.value = tab
}
</script>
<style scoped>
.slider {
  /* box-shadow: 1px 1px 1px 1px #000000 inset; */
  border: 1px solid var(--neutral-700, #3f3f45);
}
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* For Firefox */
input[type='number'] {
  appearance: textfield;
  -moz-appearance: textfield;
}
</style>
