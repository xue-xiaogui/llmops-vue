<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import * as echarts from 'echarts/core'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import { GridComponent, LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

// 按需注册常用图表与组件，避免全量引入 ECharts 导致产物过大
echarts.use([
  BarChart,
  LineChart,
  PieChart,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  CanvasRenderer,
])

const props = defineProps({
  /** ECharts 配置项，变化后自动更新图表 */
  option: { type: Object, required: true },
  /** 图表容器高度 */
  height: { type: String, default: '320px' },
  /** 已注册的 ECharts 主题名，留空使用默认主题 */
  theme: { type: String, default: '' },
})

const containerRef = ref(null)
const chart = shallowRef(null)
let resizeObserver = null

/**
 * 初始化图表。容器宽高为 0（如尚未布局、隐藏状态）时跳过，
 * 由 ResizeObserver 在尺寸就绪后再次触发，避免 echarts 报尺寸警告。
 */
function initChart() {
  if (chart.value || !containerRef.value) return
  const { width, height } = containerRef.value.getBoundingClientRect()
  if (width === 0 || height === 0) return

  chart.value = echarts.init(containerRef.value, props.theme || undefined)
  chart.value.setOption(props.option, true)
}

function handleResize() {
  if (!chart.value) {
    initChart()
    return
  }
  chart.value.resize()
}

function handleOptionChange() {
  if (!chart.value) {
    initChart()
    return
  }
  chart.value.setOption(props.option, true)
}

watch(() => props.option, handleOptionChange, { deep: true })

// 切换主题需要重新初始化实例
watch(
  () => props.theme,
  () => {
    chart.value?.dispose()
    chart.value = null
    initChart()
  }
)

onMounted(async () => {
  await nextTick()
  initChart()
  if (containerRef.value) {
    resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(containerRef.value)
  }
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  resizeObserver = null
  chart.value?.dispose()
  chart.value = null
})
</script>

<template>
  <div ref="containerRef" class="w-full" :style="{ height }" />
</template>
