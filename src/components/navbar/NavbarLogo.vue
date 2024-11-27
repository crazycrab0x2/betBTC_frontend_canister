<template>
  <component :is="componentName" :[linkAttr]="link">
    <img :src="imageUrl" :alt="alt" :class="imageClasses" :width="imageWidth" height="auto" />
    <span :class="textClasses">
      <slot />
    </span>
  </component>
</template>

<script lang="ts" setup>
import { computed, resolveComponent } from 'vue'

interface NavbarLogoProps {
  link?: string
  imageUrl?: string
  imageWidth?: string
  imageClasses?: string
  alt?: string
  component?: string
  linkAttr?: string
  textClasses?: string
}

const props = withDefaults(defineProps<NavbarLogoProps>(), {
  link: '/',
  imageUrl: '/horizontal_logo.svg',
  imageClasses: '',
  imageWidth: '100',
  alt: 'logo',
  component: 'a',
  linkAttr: 'href',
  textClasses: ''
})

const componentName = computed(() => {
  return props.component !== 'a' ? resolveComponent(props.component) : 'a'
})
</script>
