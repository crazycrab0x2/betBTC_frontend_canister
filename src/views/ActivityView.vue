<script setup lang="ts">
import SideBar from '@/components/sidebar/SideBar.vue'
import Header from '@/components/sidebar/Header.vue'
import Activity from '@/components/activity/Activity.vue'
import Notification from '@/components/notification/Notification.vue'
import AuthProvider from '@/components/provider/Auth.vue'
</script>

<template>
  <AuthProvider>
    <div class="relative flex flex-col bg-[#18181B] min-h-screen">
      <Header class="md:hidden z-10" />
      <div class="flex flex-grow">
        <SideBar class="hidden md:!block" />
        <Activity />
        <Notification />
      </div>
    </div>
  </AuthProvider>
</template>
