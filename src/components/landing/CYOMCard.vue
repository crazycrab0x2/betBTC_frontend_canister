<template>
  <div class="p-2 w-full min-h-[360px] md:min-h-[460px]">
    <div
      class="flex flex-col gap-4 p-3 rounded-3xl border border-[#3F3F45] relative justify-end w-full h-full"
    >
      <img
        src="/market/create_your_own_market.webp"
        class="object-cover w-full xl:absolute xl:top-0 xl:max-h-[300px] xl:left-0 xl:right-0"
        alt="Create your own market illustration"
      />
      <div class="flex flex-col items-start gap-4 h-hit relative z-10">
        <div class="flex flex-col gap-2">
          <h2
            class="inter space-grotesk font-medium text-[24px] leading-[44px] text-[#FAFAFA] tracking-tight"
          >
            Make your own market.
          </h2>
          <p class="inter text-[#F8F8F8] font-normal leading-[22px] text-[16px]">
            Your market — you set betting options, resolution details and start betting.
          </p>
        </div>
        <button
          class="py-[10px] px-[14px] border-orange-600 border rounded-xl transition-colors hover:bg-orange-950/20"
        >
          <p class="inter text-[#E88340] text-[16px] leading-[22px] font-medium">Coming soon</p>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.grad {
  background: linear-gradient(
    180deg,
    rgba(18, 18, 18, 0.1) 0%,
    rgba(18, 18, 18, 0.5) 50%,
    rgba(18, 18, 18, 0.9) 100%
  );
}
</style>
