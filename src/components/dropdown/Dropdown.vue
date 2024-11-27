<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div ref="wrapper" class="inline-flex relative">
    <div
      class="inline-flex items-center"
      @click="onToggle"
      @mouseenter="onToggleByHover"
      @mouseleave="startCloseTimer"
    >
      <slot name="trigger">
        <button :class="buttonClasses">
          {{ text }}
          <svg
            class="w-4 h-4 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 9l-7 7-7-7"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            />
          </svg>
        </button>
      </slot>
    </div>
    <transition :name="transitionName">
      <div
        v-if="visible"
        ref="content"
        :class="[contentClasses]"
        :style="contentStyles"
        @click="onHide"
        @mouseenter="cancelCloseTimer"
        @mouseleave="startCloseTimer"
      >
        <slot />
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, toRef, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'
import type { DropdownPlacement } from './types'
import { useDropdownClasses } from './composables/useDropdownClasses'

const visible = ref(false)

const onHide = () => {
  if (props.closeInside) visible.value = false
}

let closeTimer: any = null
const startCloseTimer = () => {
  if (props.trigger === 'hover') {
    closeTimer = setTimeout(() => {
      visible.value = false
    }, 100)
  }
}
const cancelCloseTimer = () => {
  clearTimeout(closeTimer)
}
const onToggleByHover = () => {
  if (props.trigger === 'hover') {
    clearTimeout(closeTimer)
    visible.value = true
  }
}
const onToggle = () => {
  if (props.trigger === 'click') visible.value = !visible.value
}
const props = withDefaults(
  defineProps<{
    placement?: DropdownPlacement
    text?: string
    transition?: string
    closeInside?: boolean
    alignToEnd?: boolean
    buttonClasses?: string
    trigger?: 'hover' | 'click'
  }>(),
  {
    placement: 'bottom',
    text: '',
    transition: '',
    closeInside: false,
    alignToEnd: false,
    buttonClasses: '',
    trigger: 'click'
  }
)

const emit = defineEmits<{
  show: []
  hide: []
}>()

watch(visible, (isVisible: boolean) => {
  if (isVisible) {
    emit('show')
  } else {
    emit('hide')
  }
})

const placementTransitionMap: Record<DropdownPlacement, string> = {
  bottom: 'to-bottom',
  left: 'to-left',
  right: 'to-right',
  top: 'to-top'
}

const transitionName = computed(() => {
  if (props.transition === null) return placementTransitionMap[props.placement]
  return props.transition
})

const content = ref<HTMLDivElement>()
const wrapper = ref<HTMLDivElement>()

const { contentClasses, contentStyles } = useDropdownClasses({
  placement: toRef(props, 'placement'),
  alignToEnd: toRef(props, 'alignToEnd'),
  visible,
  contentRef: content
})

onClickOutside(wrapper, () => {
  if (!visible.value) return
  visible.value = false
})
</script>

<style scoped>
/* transitions */
.to-bottom-enter-active,
.to-bottom-leave-active,
.to-left-enter-active,
.to-left-leave-active,
.to-right-enter-active,
.to-right-leave-active,
.to-top-enter-active,
.to-top-leave-active {
  transition: all 250ms;
}

/* to top */
.to-top-enter-active,
.to-top-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
.to-top-leave,
.to-top-enter-to {
  opacity: 1;
  transform: translateY(0);
}

/* to right */
.to-right-enter-active,
.to-right-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
.to-right-leave,
.to-right-enter-to {
  opacity: 1;
  transform: translateX(0);
}

/* to bottom */
.to-bottom-enter-active,
.to-bottom-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.to-bottom-leave,
.to-bottom-enter-to {
  opacity: 1;
  transform: translateY(0);
}

/* to left */
.to-left-enter-active,
.to-left-leave-to {
  opacity: 0;
  transform: translateX(10px);
}
.to-left-leave,
.to-left-enter-to {
  opacity: 1;
  transform: translateX(0);
}
</style>
