<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: "default",
  },
  size: {
    type: String,
    default: "default",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const variantClasses = {
  default: "bg-primary text-primary-foreground hover:opacity-80",
  destructive:
    "bg-destructive text-white hover:opacity-80 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
  outline:
    "border bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
  secondary: "bg-secondary text-secondary-foreground hover:opacity-80",
  ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:opacity-50",
  link: "text-primary underline-offset-4 hover:underline hover:bg-gray-100 rounded-lg transition-colors",
  socialAuth: "border border-gray-300 bg-white hover:bg-gray-100",
};

const sizeClasses = {
  default: "h-9 px-4 py-2 has-[>svg]:px-3",
  sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
  lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
  icon: "size-9 rounded-md",
};
</script>

<template>
  <button
    :class="[
      'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
      variantClasses[props.variant],
      sizeClasses[props.size],
    ]"
    :disabled="props.disabled"
    :style="{
      padding: props.variant === 'link' ? '0' : undefined,
    }"
  >
    <slot />
  </button>
</template>
