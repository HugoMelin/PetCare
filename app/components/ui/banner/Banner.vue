<script setup lang="ts">
import type { Component, HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
import { type BannerVariants, bannerVariantClasses } from ".";

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"];
    icon?: Component;
    variant?: `${BannerVariants}`;
  }>(),
  { class: undefined, icon: undefined, variant: "default" },
);
</script>

<template>
  <div
    data-slot="banner"
    :class="
      cn(
        'flex flex-row items-start lg:items-center gap-4 rounded-lg border p-6 shadow-md',
        bannerVariantClasses[props.variant],
        props.class,
      )
    "
  >
    <template v-if="props.icon">
      <component :is="props.icon" class="size-5 mt-1 lg:mt-0" />
    </template>
    <div
      class="w-full flex flex-col lg:flex-row lg:justify-between lg:items-center"
    >
      <slot />
      <slot name="action" />
    </div>
  </div>
</template>
