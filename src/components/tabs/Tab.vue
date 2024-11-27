<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <template v-if="directive === 'if'">
    <div v-if="activeTab === name">
      <slot />
    </div>
  </template>
  <template v-else-if="directive === 'show'">
    <div v-show="activeTab === name">
      <slot />
    </div>
  </template>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { TAB_ACTIVE_NAME_INJECTION_KEY, TAB_VISIBILITY_DIRECTIVE_INJECTION_KEY } from './config'

interface TabProps {
  name: string
  title: string
  disabled?: boolean
}

withDefaults(defineProps<TabProps>(), {
  name: '',
  title: '',
  disabled: false
})

const activeTab = inject(TAB_ACTIVE_NAME_INJECTION_KEY, '')
const directive = inject(TAB_VISIBILITY_DIRECTIVE_INJECTION_KEY, 'if')
</script>
