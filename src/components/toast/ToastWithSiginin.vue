<template>
  <div>
    <p>Auth key expired! Please sign in again.</p>
    <button
      @click.stop="onSignin"
      class="oranj-button bg-[#ff9046] flex items-center justify-center inter w-full !font-[500] rounded-[5px] h-[30px] text-[16px] text-[#121212] mt-2"
    >
      Sign In
    </button>
  </div>
</template>

<script lang="ts" setup>
import { useHelpers } from '@/composables/useHelpers'
import { useLayoutStore } from '@/stores/layout'

const { toggleBodyScroll } = useHelpers()
const { setSignupModal } = useLayoutStore()

const onSignin = () => {
  setSignupModal(true)
  toggleBodyScroll()
}
</script>
