<script setup lang="ts">
import Admin from '@/components/admin/Admin.vue'
import SideBar from '@/components/sidebar/SideBar.vue'
import Header from '@/components/sidebar/Header.vue'
import Notification from '@/components/notification/Notification.vue'
</script>

<template>
  <div class="relative flex flex-col bg-[#18181B] min-h-screen">
    <Header class="md:hidden z-10" />
    <div class="flex flex-grow">
      <SideBar class="hidden md:!block" />
      <Admin />
      <Notification />
    </div>
  </div>
</template>
