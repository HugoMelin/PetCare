<script setup>
import { Home, Scale, Pill, PanelLeftOpen, PanelLeftClose } from 'lucide-vue-next';

const isExpanded = ref(false);

const navItems = [
  { to: '/', label: 'Dashboard', icon: Home },
  { to: '/poids', label: 'Poids', icon: Scale },
  { to: '/vermifuge', label: 'Vermifuge', icon: Pill },
];

const route = useRoute();

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value;
};

const isActive = (path) => {
  if (path === '/') return route.path === '/';
  return route.path.startsWith(path);
};
</script>

<template>
    <!-- Mobile Navigation -->
    <nav
      class="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20"
    >
      <div class="grid grid-cols-3 gap-1">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex flex-col items-center py-3 px-2 transition-colors"
          :class="isActive(item.to)
            ? 'text-primary'
            : 'text-gray-500 hover:text-gray-700'"
        >
          <component :is="item.icon" class="w-6 h-6 mb-1" />
          <span class="text-xs">{{ item.label }}</span>
        </NuxtLink>
      </div>
    </nav>

    <!-- Desktop Navigation -->
    <nav
      class="hidden lg:block fixed left-0 top-0 bottom-0 bg-white border-r border-gray-200 pt-20 z-0 transition-all duration-300"
      :class="isExpanded ? 'w-64' : 'w-20'"
    >
      <!-- Toggle Button -->
      <div class="absolute top-24 -right-3 z-10">
        <button
          class="bg-white border border-gray-200 rounded-full p-1.5 shadow-sm hover:bg-gray-50 transition-colors"
          @click="toggleExpanded"
        >
          <PanelLeftClose
            v-if="isExpanded"
            class="w-4 h-4 text-gray-600"
          />
          <PanelLeftOpen
            v-else
            class="w-4 h-4 text-gray-600"
          />
        </button>
      </div>

      <div class="px-3 space-y-2">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors"
          :class="[
            isActive(item.to)
              ? 'bg-[#269394]/10 text-primary'
              : 'text-gray-700 hover:bg-gray-100',
            !isExpanded ? 'justify-center' : ''
          ]"
          :title="!isExpanded ? item.label : undefined"
        >
          <component
            :is="item.icon"
            class="w-5 h-5 flex-shrink-0"
          />
          <span v-if="isExpanded">{{ item.label }}</span>
        </NuxtLink>
      </div>
    </nav>

    <!-- Desktop spacer -->
    <div
      class="hidden lg:block transition-all duration-300"
      :class="isExpanded ? 'w-64' : 'w-20'"
    />
</template>
