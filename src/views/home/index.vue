<script setup>
import BaseChart from '@/components/BaseChart.vue'
import { formatDateTime } from '@/utils'

// ===== 以下全部为模拟数据，仅用于界面演示，不代表真实业务数据 =====
const updatedAt = formatDateTime(new Date())

const statCards = [
  { label: '总调用次数', value: '128,640', change: '+12.4%', positive: true, note: '较上周' },
  { label: '平均响应耗时', value: '286 ms', change: '-8.1%', positive: true, note: '较上周' },
  { label: '活跃应用', value: '32', change: '+3', positive: true, note: '较上周' },
  { label: '失败率', value: '1.8%', change: '+0.2%', positive: false, note: '较上周' },
]

const lineOption = {
  color: ['#2563eb', '#22c55e'],
  tooltip: { trigger: 'axis' },
  legend: { data: ['调用次数', '成功次数'], top: 0, right: 0, itemWidth: 14, itemHeight: 8 },
  grid: {
    top: 44,
    left: 12,
    right: 16,
    bottom: 8,
    outerBoundsMode: 'same',
    outerBoundsContain: 'axisLabel',
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    axisLine: { lineStyle: { color: '#cbd5e1' } },
    axisLabel: { color: '#64748b' },
  },
  yAxis: {
    type: 'value',
    axisLabel: { color: '#64748b' },
    splitLine: { lineStyle: { color: '#eef2f7' } },
  },
  series: [
    {
      name: '调用次数',
      type: 'line',
      smooth: true,
      symbolSize: 6,
      data: [1200, 1680, 1420, 1890, 2100, 2450, 2310],
      areaStyle: { opacity: 0.12 },
    },
    {
      name: '成功次数',
      type: 'line',
      smooth: true,
      symbolSize: 6,
      data: [1180, 1650, 1390, 1850, 2060, 2400, 2250],
      areaStyle: { opacity: 0.08 },
    },
  ],
}

const barOption = {
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: {
    top: 16,
    left: 12,
    right: 16,
    bottom: 8,
    outerBoundsMode: 'same',
    outerBoundsContain: 'axisLabel',
  },
  xAxis: {
    type: 'category',
    data: ['模型 A', '模型 B', '模型 C', '模型 D', '模型 E'],
    axisLine: { lineStyle: { color: '#cbd5e1' } },
    axisLabel: { color: '#64748b' },
  },
  yAxis: {
    type: 'value',
    axisLabel: { color: '#64748b' },
    splitLine: { lineStyle: { color: '#eef2f7' } },
  },
  series: [
    {
      name: '调用次数',
      type: 'bar',
      barWidth: 28,
      data: [4200, 3600, 2800, 2100, 1500],
      itemStyle: {
        borderRadius: [6, 6, 0, 0],
        color: '#3b82f6',
      },
    },
  ],
}

const pieOption = {
  color: ['#22c55e', '#ef4444', '#f59e0b', '#94a3b8'],
  tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
  legend: { bottom: 0, icon: 'circle', itemWidth: 8, itemHeight: 8, textStyle: { fontSize: 12 } },
  series: [
    {
      name: '任务状态',
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['50%', '45%'],
      avoidLabelOverlap: true,
      itemStyle: { borderRadius: 6, borderColor: '#ffffff', borderWidth: 2 },
      label: { show: false },
      emphasis: {
        label: { show: true, fontSize: 14, fontWeight: 'bold' },
      },
      data: [
        { value: 9850, name: '成功' },
        { value: 210, name: '失败' },
        { value: 156, name: '超时' },
        { value: 84, name: '取消' },
      ],
    },
  ],
}
</script>

<template>
  <div>
    <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="text-lg font-semibold text-slate-900">工作台</h2>
        <p class="mt-1 text-xs text-slate-500">数据更新于 {{ updatedAt }}</p>
      </div>
      <el-tag type="info" effect="plain">模拟数据</el-tag>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <el-card v-for="card in statCards" :key="card.label" shadow="never" class="h-full">
        <p class="text-xs text-slate-500">{{ card.label }}</p>
        <p class="mt-2 text-2xl font-semibold text-slate-900">{{ card.value }}</p>
        <p class="mt-2 text-xs">
          <span :class="card.positive ? 'text-emerald-600' : 'text-red-500'">
            {{ card.change }}
          </span>
          <span class="ml-1 text-slate-400">{{ card.note }}</span>
        </p>
      </el-card>
    </div>

    <div class="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
      <el-card shadow="never" class="xl:col-span-2" :body-style="{ padding: '16px' }">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-slate-700">近 7 天调用趋势</span>
            <span class="text-xs text-slate-400">单位：次</span>
          </div>
        </template>
        <BaseChart :option="lineOption" height="320px" />
      </el-card>

      <el-card shadow="never" :body-style="{ padding: '16px' }">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-slate-700">任务状态分布</span>
            <span class="text-xs text-slate-400">本周</span>
          </div>
        </template>
        <BaseChart :option="pieOption" height="320px" />
      </el-card>

      <el-card shadow="never" class="xl:col-span-3" :body-style="{ padding: '16px' }">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-slate-700">模型调用排行</span>
            <span class="text-xs text-slate-400">单位：次</span>
          </div>
        </template>
        <BaseChart :option="barOption" height="300px" />
      </el-card>
    </div>
  </div>
</template>
