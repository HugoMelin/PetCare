<script setup>
defineProps({
  modelValue: {
    type: [String, Number],
    default: "",
  },
  rows: {
    type: Number,
    default: 4,
  },
  placeholder: {
    type: String,
    default: "",
  },
})
</script>

<template>
  <textarea
    :rows="rows"
    :placeholder="placeholder"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
  ></textarea>
</template>