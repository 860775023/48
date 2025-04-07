<template>
  <div class="chart-container">
    <h2 class="chart-title">货物储量</h2>
    <vue-echarts :options="options" ref="chartRef" />
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import VueEcharts from 'vue-echarts';
import * as echarts from 'echarts';

export default {
  name: 'ProductSalesAreaChart',
  components: {
    VueEcharts,
  },
  setup() {
    const chartRef = ref(null);
    let updateTimer = null;

    const generateRandomData = (baseValue, range) => {
      return Math.floor(Math.random() * range + baseValue);
    };

    const options = ref({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        data: ['产品1', '产品2', '产品3', '产品4', '产品5', '产品6'],
        top: '5%',
        textStyle: {
          color: '#fff'
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['第1周', '第2周', '第3周', '第4周', '第5周', '第6周', '第7周', '第8周'],
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
      animationDuration: 1000,
      animationEasing: 'cubicOut',
      animationDelay: function (idx) {
        return idx * 200;
      },
      series: [
        {
          name: '产品1',
          type: 'line',
          stack: '总量',
          areaStyle: {
            opacity: 0.3
          },
          emphasis: {
            focus: 'series'
          },
          data: [120, 132, 101, 134, 90, 230, 210, 180]
        },
        {
          name: '产品2',
          type: 'line',
          stack: '总量',
          areaStyle: {
            opacity: 0.3
          },
          emphasis: {
            focus: 'series'
          },
          data: [220, 182, 191, 234, 290, 330, 310, 320]
        },
        {
          name: '产品3',
          type: 'line',
          stack: '总量',
          areaStyle: {
            opacity: 0.3
          },
          emphasis: {
            focus: 'series'
          },
          data: [150, 232, 201, 154, 190, 330, 410, 380]
        },
        {
          name: '产品4',
          type: 'line',
          stack: '总量',
          areaStyle: {
            opacity: 0.3
          },
          emphasis: {
            focus: 'series'
          },
          data: [320, 332, 301, 334, 390, 330, 320, 310]
        },
        {
          name: '产品5',
          type: 'line',
          stack: '总量',
          areaStyle: {
            opacity: 0.3
          },
          emphasis: {
            focus: 'series'
          },
          data: [820, 932, 901, 934, 1290, 1230, 1210, 1180]
        },
        {
          name: '产品6',
          type: 'line',
          stack: '总量',
          areaStyle: {
            opacity: 0.3
          },
          emphasis: {
            focus: 'series'
          },
          data: [820, 932, 901, 934, 1290, 1230, 1210, 1180]
        }
      ]
    });

    const updateData = () => {
      if (chartRef.value) {
        const newData = options.value.series.map(series => {
          const lastValue = series.data[series.data.length - 1];
          const newValue = generateRandomData(lastValue * 0.9, lastValue * 0.2);
          return [...series.data.slice(1), newValue];
        });

        // 更新每个系列的数据
        options.value.series.forEach((series, index) => {
          series.data = newData[index];
        });

        // 更新x轴时间
        const currentWeek = parseInt(options.value.xAxis.data[7].match(/\d+/)[0]);
        options.value.xAxis.data = options.value.xAxis.data.slice(1).concat([`第${currentWeek + 1}周`]);

        // 修改这里的更新方式
        chartRef.value.setOption(options.value);
      }
    };

    onMounted(() => {
      if (chartRef.value) {
        chartRef.value.setOption(options.value);
        updateTimer = setInterval(updateData, 2000);
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
}

.chart-title {
  color: #fff;
  font-size: 16px;
  text-align: center;
  margin-bottom: 10px;
}

:deep(.echarts) {
  width: 100% !important;
  height: calc(100% - 30px) !important;
}
</style>