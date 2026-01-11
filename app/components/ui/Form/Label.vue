<script setup>
defineProps({
  htmlFor: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <label :for="htmlFor" class="block text-gray-700 mb-2">
    <slot></slot>
  </label>
</template>
