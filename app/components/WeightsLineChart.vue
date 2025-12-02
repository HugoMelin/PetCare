<script setup>
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
)

const props = defineProps({
  weights: {
    type: Array,
    default: () => [],
  },
  height: {
    type: Number,
    default: 256,
  },
})

const chartData = computed(() => {
  if (!props.weights || !props.weights.length) {
    return {
      labels: [],
      datasets: [],
    }
  }

  const byDay = new Map()

  for (const w of props.weights) {
    const dayKey = w.date.slice(0, 10) // '2025-12-02'
    const current = byDay.get(dayKey)

    if (!current) {
      byDay.set(dayKey, w)
    } else {
      if (new Date(w.date) > new Date(current.date)) {
        byDay.set(dayKey, w)
      }
    }
  }

  const sortedEntries = Array.from(byDay.entries()).sort(
    (a, b) => new Date(a[0]) - new Date(b[0]),
  )

  const labels = sortedEntries.map(([day]) =>
    new Date(day).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
    }),
  )

  const data = sortedEntries.map(([, w]) => w.weight)

  return {
    labels,
    datasets: [
      {
        label: 'Poids (kg)',
        data,
        tension: 0.2, // courbe un peu arrondie
        borderColor: '#269394',
        pointBackgroundColor: '#269394',
        borderWidth: 2,
        pointRadius: 3,
        fill: true,
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    }
  },
  scales: {
    x: {
      ticks: {
        autoSkip: true,
        maxTicksLimit: 7,
      },
    },
    y: {
      beginAtZero: false,
    },
  },
}
</script>

<template>
  <div>
    <Line
      v-if="chartData.labels.length"
      :data="chartData"
      :options="chartOptions"
    />

    <p v-else class="text-sm text-gray-500">
      Aucune donnée de poids à afficher.
    </p>
  </div>
</template>