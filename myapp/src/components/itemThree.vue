<template>
  <div class="chart-container">
    <h2 class="chart-title">出入库数量</h2>
    <vue-echarts :options="options" :autoresize="true" ref="chartRef" />
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import VueEcharts from 'vue-echarts';
import * as echarts from 'echarts';

export default {
  name: 'StockInOutChart',
  components: {
    VueEcharts,
  },
  setup() {
    const chartRef = ref(null);
    let updateTimer = null;

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
      legend: {
        data: ['入库', '出库'],
        textStyle: {
          color: '#fff'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
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
        axisLine: {
          lineStyle: {
            color: 'rgba(0, 195, 255, 0.5)'
          }
        },
        axisLabel: {
          color: '#fff'
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(0, 195, 255, 0.1)'
          }
        }
      },
      // 添加动画配置
      animationDuration: 1000,
      animationEasing: 'cubicOut',
      animationDelay: function (idx) {
        return idx * 200;
      },
      series: [
        {
          name: '入库',
          type: 'bar',
          data: [120, 200, 150, 80, 70, 110, 130]
        },
        {
          name: '出库',
          type: 'bar',
          data: [100, 180, 140, 90, 60, 100, 120]
        }
      ]
    });

    const updateData = () => {
      if (chartRef.value) {
        const newInData = options.value.series[0].data.map(value => 
          generateRandomData(value * 0.7, value * 0.6));
        const newOutData = options.value.series[1].data.map(value => 
          generateRandomData(value * 0.7, value * 0.6));

        options.value.series[1].data = newInData;
        options.value.series[1].data = newOutData;

        chartRef.value.setOption(options.value);
      }
    };

    onMounted(() => {
      if (chartRef.value) {
        chartRef.value.setOption(options.value);
        updateTimer = setInterval(updateData, 1800);
      }
    });

    onUnmounted(() => {
      if (updateTimer) {
        clearInterval(updateTimer);
      }
    });

    return {
      options,
      chartRef
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
  align-items: center;
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
  text-align: center;
  margin-bottom: 10px;
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