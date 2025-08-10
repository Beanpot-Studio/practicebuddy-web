<template>
  <div class="card card-blue">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg text-gray-800 font-bold">Practice Over Time</h3>
      <span class="text-xs text-gray-500">Last 14 days</span>
    </div>
    <div class="h-64">
      <Line v-if="chartData && chartData.datasets[0].data.length" :data="chartData" :options="chartOptions" />
      <div v-else class="h-full flex items-center justify-center text-gray-500 text-sm">No recent practice data</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const props = defineProps({
  userId: {
    type: String,
    required: true
  }
})

const chartData = ref({ labels: [], datasets: [{ data: [] }] })

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: { beginAtZero: true, title: { display: true, text: 'Minutes' } },
    x: { title: { display: true, text: 'Day' } }
  },
  plugins: {
    legend: { display: false },
    tooltip: { mode: 'index', intersect: false }
  },
  elements: {
    line: { tension: 0.3 }
  }
}

const buildLastNDays = (n) => {
  const days = []
  const today = new Date()
  for (let i = n - 1; i >= 0; i -= 1) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const key = d.toISOString().slice(0, 10) // YYYY-MM-DD
    days.push(key)
  }
  return days
}

const loadData = async () => {
  if (!props.userId) return
  try {
    const { getStudentPractices } = await import('../../lib/auth.js')
    const result = await getStudentPractices(props.userId)
    if (!result.success) return

    // Aggregate minutes by day (YYYY-MM-DD)
    const minutesByDay = new Map()
    result.practices.forEach((p) => {
      const dateKey = (p.timestamp ? new Date(p.timestamp) : new Date()).toISOString().slice(0, 10)
      const minutes = Number(p.practiceMinutes ?? p.roundedDuration ?? p.actualDuration ?? 0)
      minutesByDay.set(dateKey, (minutesByDay.get(dateKey) || 0) + minutes)
    })

    const labels = buildLastNDays(14)
    const data = labels.map((d) => minutesByDay.get(d) || 0)

    chartData.value = {
      labels,
      datasets: [
        {
          label: 'Practice Minutes',
          data,
          borderColor: '#4f46e5',
          backgroundColor: 'rgba(79, 70, 229, 0.2)',
          fill: true,
          pointRadius: 3
        }
      ]
    }
  } catch (e) {
    // fail silently in UI
    chartData.value = { labels: [], datasets: [{ data: [] }] }
  }
}

onMounted(loadData)
watch(() => props.userId, loadData)
</script>

<style scoped>
.card {
  padding: 1rem;
  border-radius: 1rem;
  background: white;
  border: 2px solid #d1d5db;
}
.card-blue {
  border-color: #2563eb;
}
</style>

