<template>
  <div class="chart-container">
    <h2 class="chart-title">仓库走势</h2>
    <vue-echarts :options="options" :autoresize="true" ref="chartRef" />
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import VueEcharts from 'vue-echarts';
import * as echarts from 'echarts';

export default {
  name: 'WarehouseUsageTrend',
  components: {
    VueEcharts,
  },
  setup() {
    const chartRef = ref(null);
    let updateTimer = null;

    const options = ref({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line',
          lineStyle: {
            color: 'rgba(0, 195, 255, 0.3)',
            width: 1,
            type: 'solid'
          }
        }
      },
      grid: {
        top: '15%',
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
        axisLine: {
          lineStyle: {
            color: 'rgba(0, 195, 255, 0.5)'
          }
        },
        axisLabel: {
          color: '#fff',
          fontSize: 12
        }
      },
      yAxis: {
        type: 'value',
        name: '使用率(%)',
        nameTextStyle: {
          color: '#fff'
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(0, 195, 255, 0.1)'
          }
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(0, 195, 255, 0.5)'
          }
        },
        axisLabel: {
          color: '#fff',
          fontSize: 12
        }
      },
      series: [
        {
          name: 'A区使用率',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          showSymbol: false,
          lineStyle: {
            width: 2,
            color: '#00c3ff'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: 'rgba(0, 195, 255, 0.3)'
              }, {
                offset: 1,
                color: 'rgba(0, 195, 255, 0.1)'
              }]
            }
          },
          data: [45, 52, 38, 78, 85, 68, 75, 58]
        },
        {
          name: 'B区使用率',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          showSymbol: false,
          lineStyle: {
            width: 2,
            color: '#00ff9d'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: 'rgba(0, 255, 157, 0.3)'
              }, {
                offset: 1,
                color: 'rgba(0, 255, 157, 0.1)'
              }]
            }
          },
          data: [35, 45, 48, 62, 55, 72, 65, 50]
        }
      ],
      animationDuration: 1000,
      animationEasing: 'cubicOut',
      animationDelay: function (idx) {
        return idx * 200;
      },
    });

    const updateData = () => {
      if (chartRef.value) {
        const newA = options.value.series[0].data.slice(1)
        newA.push(Math.floor(Math.random() * 40 + 45))
        const newB = options.value.series[1].data.slice(1)
        newB.push(Math.floor(Math.random() * 30 + 35))
        
        options.value.series[0].data = newA
        options.value.series[1].data = newB
        
        chartRef.value.setOption(options.value)
      }
    };

    onMounted(() => {
      if (chartRef.value) {
        chartRef.value.setOption(options.value);
        updateTimer = setInterval(updateData, 3000);
      }
    });

    onUnmounted(() => {
      if (updateTimer) {
        clearInterval(updateTimer);
      }
    });

    return {
      options,
      chartRef,
    };
  }
};
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  animation: containerFade 0.5s ease-in-out;
}

@keyframes containerFade {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chart-title {
  color: #fff;
  font-size: 16px;
  margin: 0;
  text-align: center;
  height: 30px;
  line-height: 30px;
  animation: slideIn 0.5s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

:deep(.echarts) {
  width: 100% !important;
  height: calc(100% - 30px) !important;
}
</style>