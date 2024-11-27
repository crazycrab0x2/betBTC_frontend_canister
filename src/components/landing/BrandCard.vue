<template>
  <div class="p-2 w-full min-h-[360px] md:min-h-[460px]">
    <div
      class="flex flex-col gap-4 p-3 rounded-3xl border border-[#3F3F45] relative justify-end w-full h-full"
    >
      <img
        src="/market/btc-win.webp"
        class="object-cover w-full xl:top-0 xl:absolute xl:max-h-[300px] xl:left-0 xl:right-0"
        alt="Brand market illustration"
      />
      <div class="flex flex-col items-start gap-4 h-hit relative z-20">
        <div class="flex flex-col gap-2">
          <h2
            class="inter space-grotesk font-medium text-[24px] leading-[44px] text-[#FAFAFA] tracking-tight"
          >
            Bet, predict and win BTC.
          </h2>
          <p class="inter text-[#F8F8F8] font-normal leading-[22px] text-[16px]">
            Bet on any market, predict the outcome and win big if your prediction matches.
          </p>
        </div>
        <div class="flex gap-1.5">
          <!-- <button
            class="oranj-btn bg-[#ff9046] inter font-[500] rounded-[12px] text-[16px] leading-[22px] text-[#121212] px-[18px] py-[10px]"
            @click="handleStartBetting"
          >
            Start Betting
          </button> -->
          <a
            href="https://youtu.be/x3zSuUcQsDs?si=eoiflo76TRxey1yf"
            target="_blank"
            class="black-btn bg-[#27272A] inter font-[500] rounded-[12px] text-[16px] leading-[22px] text-[#FAFAFA] px-[18px] py-[10px]"
          >
            Watch Demo
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
const emit = defineEmits(['onLogin'])
const props = defineProps(['userPrincipal'])

const handleStartBetting = () => {
  if (props.userPrincipal) {
    return
  }
  // Add more logic to check if the user sign in or not
  emit('onLogin')
}
</script>

<style scoped>
.grad {
  background: linear-gradient(
    180deg,
    rgba(18, 18, 18, 0.08) 0%,
    rgba(18, 18, 18, 0.4) 50%,
    rgba(18, 18, 18, 0.72) 100%
  );
}
.black-btn {
  box-shadow: 0px 2px 2px 2px #3f3f45 inset;
}
.oranj-btn {
  box-shadow: 0px 2px 2px 2px #ffb583 inset;
}
</style>
