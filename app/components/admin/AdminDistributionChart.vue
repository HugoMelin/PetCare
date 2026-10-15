<script setup lang="ts">
import { Doughnut } from "vue-chartjs";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  type ChartOptions,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip);
const props = defineProps<{
  title: string;
  description: string;
  items: { label: string; value: number }[];
}>();
const colors = [
  "#269394",
  "#72bdb0",
  "#e5b96b",
  "#8b90be",
  "#e29b91",
  "#718096",
];
const total = computed(() =>
  props.items.reduce((sum, item) => sum + item.value, 0),
);
const percent = (value: number) =>
  `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 }).format(total.value ? (value / total.value) * 100 : 0)} %`;
const chartData = computed(() => ({
  labels: props.items.map((item) => item.label),
  datasets: [
    {
      data: props.items.map((item) => item.value),
      backgroundColor: props.items.map((_, i) => colors[i % colors.length]),
      borderWidth: 3,
      borderColor: "#ffffff",
      hoverOffset: 4,
    },
  ],
}));
const options: ChartOptions<"doughnut"> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "72%",
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (context) =>
          `${context.label} : ${context.parsed} (${percent(context.parsed)})`,
      },
    },
  },
};
</script>

<template>
  <section
    class="min-w-0 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
  >
    <h2 class="text-base font-semibold text-gray-900">{{ title }}</h2>
    <p class="mt-1 min-h-10 text-sm text-gray-500">{{ description }}</p>
    <template v-if="total">
      <div class="relative mx-auto my-5 h-48 w-48" aria-hidden="true">
        <ClientOnly
          ><Doughnut :data="chartData" :options="options"
        /></ClientOnly>
        <div
          class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
        >
          <span class="text-2xl font-semibold">{{
            total.toLocaleString("fr-FR")
          }}</span>
          <span class="text-xs text-gray-500">au total</span>
        </div>
      </div>
      <ul class="space-y-3" :aria-label="title">
        <li
          v-for="(item, index) in items"
          :key="item.label"
          class="flex items-center gap-2 text-sm"
        >
          <span
            class="size-2.5 shrink-0 rounded-full"
            :style="{ backgroundColor: colors[index % colors.length] }"
          />
          <span class="min-w-0 flex-1 break-words text-gray-600">{{
            item.label
          }}</span>
          <span class="shrink-0 font-medium tabular-nums">{{
            percent(item.value)
          }}</span>
          <span
            class="w-10 shrink-0 text-right text-xs tabular-nums text-gray-400"
            >{{ item.value }}</span
          >
        </li>
      </ul>
    </template>
    <p
      v-else
      class="flex min-h-64 items-center justify-center text-sm text-gray-500"
    >
      Aucune donnée pour le moment.
    </p>
  </section>
</template>
