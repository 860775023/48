<template>
  <div class="chart-container">
    <h2 class="chart-title">员工活跃状况</h2>
    <vue-echarts :options="options" :autoresize="true" ref="chartRef" />
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import VueEcharts from 'vue-echarts';
import * as echarts from 'echarts';

export default {
  name: 'StaffActivityChart',
  components: {
    VueEcharts,
  },
  setup() {
    const chartRef = ref(null);
    let updateTimer = null;
    const totalUsers = ref(1000);

    const generateRandomData = (base, range) => {
      return Math.floor(Math.random() * range + base);
    };

    const options = ref({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        top: '5%',
        left: '3%',
        right: '8%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['0-20', '20-30', '30-50', '>50'],
        axisLine: {
          lineStyle: {
            color: 'rgba(0, 195, 255, 0.5)'
          }
        },
        axisLabel: {
          color: '#fff'
        }
      },
      yAxis: {
        type: 'value',
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
          color: '#fff'
        }
      },
      series: [{
        type: 'bar',
        barWidth: '40%',
        data: [295476, 495255, 715401, 195612],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#4D7EFF' },
            { offset: 1, color: '#0B4FA1' }
          ])
        },
        label: {
          show: true,
          position: 'top',
          color: '#fff',
          formatter: function(params) {
            return params.value.toLocaleString();
          }
        }
      }]
    });

    const updateData = () => {
      if (chartRef.value) {
        const newData = options.value.series[0].data.map(value => {
          return generateRandomData(value * 0.8, value * 0.4);
        });
        
        options.value.series[0].data = newData;
        totalUsers.value = newData.reduce((a, b) => a + b, 0);
        
        chartRef.value.setOption(options.value);
      }
    };

    onMounted(() => {
      if (chartRef.value) {
        chartRef.value.setOption(options.value);
        updateTimer = setInterval(updateData, 1500);
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
      totalUsers
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