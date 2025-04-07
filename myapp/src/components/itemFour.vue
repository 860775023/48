<template>
  <div class="chart-container">
    <h2 class="chart-title">货物分布情况</h2>
    <vue-echarts :options="options" :autoresize="true" ref="chartRef" />
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import VueEcharts from 'vue-echarts';
import * as echarts from 'echarts';

export default {
  name: 'IrregularPieChart',
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
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['货物A', '货物B', '货物C', '货物D', '货物E'],
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
          name: '销量',
          type: 'pie',
          radius: [0, '50%'],
          roseType: 'radius',
          label: {
            show: true,
            formatter: '{b}: {d}%'
          },
          labelLine: {
            show: true
          },
          data: [
            { value: 1048, name: '货物A' },
            { value: 735, name: '货物B' },
            { value: 580, name: '货物C', itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 1 } },
            { value: 484, name: '货物D', itemStyle: { borderRadius: 20, borderColor: '#fff', borderWidth: 1 } },
            { value: 300, name: '货物E', itemStyle: { borderRadius: 30, borderColor: '#fff', borderWidth: 1 } }
          ]
        }
      ]
    });

    const updateData = () => {
      if (chartRef.value) {
        const newData = options.value.series[0].data.map((item, index) => ({
          ...item,
          value: generateRandomData(300, 800)
        }));

        options.value.series[0].data = newData;
        chartRef.value.setOption(options.value);
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