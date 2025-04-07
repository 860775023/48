<template>
  <div class="chart-container">
    <h2 class="chart-title">货物流向分布</h2>
    <vue-echarts :options="options" :autoresize="true" ref="chartRef" />
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import VueEcharts from 'vue-echarts';
import * as echarts from 'echarts';

export default {
  name: 'CargoFlowChart',
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
        trigger: 'item'
      },
      legend: {
        top: '5%',
        left: 'center',
        textStyle: {
          color: '#fff'
        }
      },
      animationDuration: 1000,
      animationEasing: 'cubicOut',
      animationDelay: function (idx) {
        return idx * 200;
      },
      series: [
        {
          name: '流向分布',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            position: 'center',
            color: '#fff'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '20',
              fontWeight: 'bold',
              color: '#fff'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            {
              value: 1048,
              name: '华东地区',
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#4D7EFF' },
                  { offset: 1, color: '#0B4FA1' }
                ])
              }
            },
            {
              value: 735,
              name: '华南地区',
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#95CF76' },
                  { offset: 1, color: '#4A9F35' }
                ])
              }
            },
            {
              value: 580,
              name: '华北地区',
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#FDB36A' },
                  { offset: 1, color: '#F87B3E' }
                ])
              }
            }
          ]
        }
      ]
    });

    const updateData = () => {
      if (chartRef.value) {
        const newData = options.value.series[0].data.map(item => ({
          ...item,
          value: generateRandomData(500, 600)
        }));

        options.value.series[0].data = newData;
        chartRef.value.setOption(options.value);
      }
    };

    onMounted(() => {
      if (chartRef.value) {
        chartRef.value.setOption(options.value);
        updateTimer = setInterval(updateData, 2300);
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