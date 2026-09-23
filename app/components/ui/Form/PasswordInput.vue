<script setup lang="ts">
import LockIcon from "~/components/icons/LockIcon.vue";
import EyeIcon from "~/components/icons/EyeIcon.vue";
import EyeOffIcon from "~/components/icons/EyeOffIcon.vue";
import Input from "./Input.vue";

const password = defineModel<string>({
  type: String,
  required: true,
});

defineOptions({
  inheritAttrs: false,
});

const showPassword = ref(false);
</script>

<template>
  <div class="relative">
    <LockIcon
      class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
    />
    <Input
      id="password"
      v-model="password"
      :type="showPassword ? 'text' : 'password'"
      required
      class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
      placeholder="••••••••"
      minlength="8"
      v-bind="$attrs"
    />
    <button
      type="button"
      class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
      @click="showPassword = !showPassword"
    >
      <EyeIcon v-if="!showPassword" class="w-5 h-5" />
      <EyeOffIcon v-else class="w-5 h-5" />
    </button>
  </div>
</template>
