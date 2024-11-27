<template>
  <div class="relative p-2 w-full h-[460px]">
    <div
      class="w-full h-full relative sm:rounded-[24px] rounded-2xl border-[1px] border-[#27272A] overflow-hidden"
    >
      <img src="/market/bet_on_us.webp" class="object-cover w-full h-full" />
      <div class="absolute w-full h-full top-0 left-0 p-1 flex flex-col justify-end">
        <div
          class="rounded-[20px] border-[1px] border-[#12121233] grad flex gap-4 h-fit text-bg p-2"
        >
          <img src="/white-logomark.svg" width="24" />
          <p
            class="space-grotesk font-[500] text-[32px] leading-[40px] text-[#FAFAFA] tracking-tight"
          >
            Bet on us.
          </p>
        </div>
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
.text-bg {
  background: linear-gradient(
    180deg,
    rgba(18, 18, 18, 0.08) 0%,
    rgba(18, 18, 18, 0.4) 50%,
    rgba(18, 18, 18, 0.72) 100%
  );
}
</style>
