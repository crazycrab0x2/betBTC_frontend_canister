<script setup lang="ts">
import SideBar from '@/components/sidebar/SideBar.vue'
import Header from '@/components/sidebar/Header.vue'
import Referral from '@/components/referral/Referral.vue'
import Notification from '@/components/notification/Notification.vue'
</script>

<template>
  <div class="relative flex flex-col bg-[#18181B] min-h-screen">
    <Header class="md:hidden z-10" />
    <div class="flex flex-grow">
      <SideBar class="hidden md:!block" />
      <Referral />
      <Notification />
    </div>
  </div>
</template>
