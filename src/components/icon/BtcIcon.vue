<template>
  <svg
    viewBox="0 0 16 28"
    :fill="fillColor"
    :width="width"
    :height="height"
    xlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M8 23.7493C8.62133 23.7493 9.12502 24.253 9.12502 24.8743V26.3743C9.12502 26.9956 8.62133 27.4993 8 27.4993C7.37868 27.4993 6.87499 26.9956 6.87499 26.3743V24.8743C6.87499 24.253 7.37868 23.7493 8 23.7493Z"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M15.5001 20.0007C15.5001 20.6221 14.9964 21.1258 14.3751 21.1258H1.62496C1.00363 21.1258 0.499947 20.6221 0.499947 20.0007C0.499947 19.3794 1.00363 18.8757 1.62496 18.8757H14.3751C14.9964 18.8757 15.5001 19.3794 15.5001 20.0007Z"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M15.5001 14C15.5001 14.6213 14.9964 15.125 14.3751 15.125H1.62498C1.00366 15.125 0.499969 14.6213 0.499969 14C0.499969 13.3787 1.00365 12.875 1.62498 12.875H14.3751C14.9964 12.875 15.5001 13.3787 15.5001 14Z"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M15.5002 7.99928C15.5002 8.62061 14.9965 9.12429 14.3751 9.12429H1.62501C1.00368 9.12429 0.499992 8.62061 0.499992 7.99928C0.499992 7.37795 1.00368 6.87427 1.625 6.87427H14.3751C14.9965 6.87427 15.5002 7.37795 15.5002 7.99928Z"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M8.00003 0.499878C8.62135 0.499878 9.12504 1.00356 9.12504 1.62489V3.12491C9.12504 3.74623 8.62135 4.24992 8.00003 4.24992C7.3787 4.24992 6.87502 3.74623 6.87502 3.12491V1.62489C6.87502 1.00356 7.3787 0.499878 8.00003 0.499878Z"
    />
  </svg>
</template>

<script setup lang="ts">
defineProps({
  fillColor: {
    type: String,
    default: '#A1A1A9'
  },
  width: {
    type: [Number, String],
    default: 16
  },
  height: {
    type: [Number, String],
    default: 16
  }
})
</script>
