<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="flex flex-col gap-8 md:px-12 px-6 py-12">
        <div class="flex justify-end fixed bottom-4 sm:right-10 right-2" :style="{ bottom: `${scrollButton}px` }">
            <button
                @click="onScrollToTop"
                class="flex items-center border py-[10px] px-[14px] border-neutral-700 rounded-xl gap-1 bg-black transition-all duration-300 ease-in-out"                
                v-show="isShowedScrollToTop"
            >
                <span class="font-medium text-neutral-400 leading-[22px] text-[16px] sm:block hidden">
                    Scroll to Top
                </span>
                <Icon icon="mdi:arrow-top" color="#A1A1A9" width="18" height="18" />
            </button>
        </div>
        <div class="flex md:flex-row flex-col justify-between md:gap-0 gap-8" ref="footerRef">
            <navbar-logo link="#" />
            <div class="flex md:flex-row flex-col md:gap-16 gap-8">
                <a href="mailto:hello@oranj.co" target="_blank" rel="external" class="text-[14px] font-medium leading-5 text-neutral-400">
                    Contact Us
                </a>
                <a href="https://study.betbtc.win" target="_blank" rel="external" class="text-[14px] font-medium leading-5 text-neutral-400">
                    Documentation
                </a>
                <a href="https://study.betbtc.win/terms-of-use" target="_blank" rel="external" class="text-[14px] font-medium leading-5 text-neutral-400">
                    Terms of use
                </a>
                <a href="https://study.betbtc.win/privacy-policy" target="_blank" rel="external" class="text-[14px] font-medium leading-5 text-neutral-400">
                    Privacy Policy
                </a>
            </div>
        </div>
        <div class="flex justify-between py-8 md:flex-row md:items-center flex-col md:gap-0 gap-8">
            <div class="flex items-center gap-5">
                <a href="https://x.com/betbtcwin" target="_blank" rel="external">
                    <Icon icon="bi:twitter-x" width="20" height="20" color="#A1A1A9" />
                </a>
                <a href="https://discord.gg/betbtcwin" target="_blank" rel="external">
                    <Icon icon="akar-icons:discord-fill" width="25" height="25" color="#A1A1A9" />
                </a>
                <!-- <a href="#">
                    <Icon icon="bi:github" width="20" height="20" color="#A1A1A9" />
                </a>
                <a href="#">
                    <Icon icon="bi:linkedin" width="20" height="20" color="#A1A1A9" />
                </a> -->
      </div>
      <!-- <img src="/ICP-badge-with-text.png" class="md:w-[400px] w-[250px]" alt="" width="400" /> -->
      <p class="leading-5 text-neutral-400 font-medium text-[14px]">
        © 2024 betBTC. All rights reserved.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import NavbarLogo from '../navbar/NavbarLogo.vue'

const isShowedScrollToTop = ref<boolean>(false)
const scrollButton = ref<number>(0)
const footerRef = ref<HTMLElement | null>(null);

const onScrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
const updateFooterHeight = () => {
    if (footerRef.value) {
        const footerRect = footerRef.value.getBoundingClientRect()
        const buttonHeight = 20               
        if ( window.innerHeight - footerRect.top  >= 0 ) {
            scrollButton.value = window.innerHeight - footerRect.top + buttonHeight + 20
        } else {
            scrollButton.value = 20
        }
    }
}

onMounted(() => {
    window.addEventListener('scroll', () => {
        if (window?.scrollY > 150) {
            isShowedScrollToTop.value = true
        } else {
            isShowedScrollToTop.value = false
        }
        updateFooterHeight();
    })
    window.addEventListener('size', () => {
        updateFooterHeight();
    })
})
</script>
