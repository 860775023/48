<template>
  <div class="map-container" ref="mapContainer">
    <h2 style="color: aliceblue;">全国物流情况</h2>
    <div id="myecharts" ref="myecharts"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import { zh } from '../assets/zh.js'; // 确保路径正确

export default {
  name: 'CitySalesMap',
  mounted() {
    this.initMap();
    window.addEventListener('resize', () => {
      try {
        this.resizeChart();
      } catch (error) {
        console.warn('Resize handler warning:', error);
      }
    });
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.resizeChart);
    if (this.chart) {
      this.chart.dispose();
    }
  },
  methods: {
    initMap() {
      const chartDom = this.$refs.myecharts;
      const myChart = echarts.init(chartDom);
      echarts.registerMap('China', zh);

      const logisticsData = [
        { name: '天津市', value: [116.46, 39.92, 178546] },
        { name: '湖南省', value: [113.08, 28.23, 125687] },
        
  { name: '江苏省', value: [118.78, 32.06, 45879] },
  { name: '海南省', value: [110.35, 20.02, 28584] },
  { name: '四川省', value: [104.06, 30.67, 14852] },
  { name: '香港特别行政区', value: [114.16, 22.28, 2563] },
        // 添加更多物流数据
      ];

      const option = {
        tooltip: {
          trigger: 'item',
          formatter: function(params) {
            if (params.seriesType === 'lines') {
              return params.name;
            }
            return params.name;
          }
        },
        visualMap: {
          min: 0,
          max: 200000,
          left: 'left',
          top: 'bottom',
          text: ['高', '低'],
          calculable: true,
          inRange: {
            color: ['#e0ffff', '#1890ff']
          },
          textStyle: {
            color: '#fff'
          }
        },
        geo: {
          map: 'China',
          roam: false,
          label: {
            show: false,
            color: '#fff',
            fontSize: 10
          },
          itemStyle: {
            areaColor: '#1890ff',
            borderColor: '#fff',
            borderWidth: 1
          },
          emphasis: {
            itemStyle: {
              areaColor: '#1890ff'
            },
            label: {
              show: false
            }
          }
        },
        series: [
          {
            name: '物流流向',
            type: 'lines',
            zlevel: 2,
            effect: {
              show: true,
              period: 3,
              trailLength: 0.6,
              symbol: 'arrow',
              symbolSize: 8,
              color: '#ffeb3b'
            },
            lineStyle: {
              normal: {
                color: '#ffeb3b',
                width: 2,
                opacity: 0.8,
                curveness: 0.3
              }
            },
            data: [
              { coords: [[116.46, 39.92], [121.48, 31.22]], name: '北京-上海' },
              { coords: [[113.08, 28.23], [113.23, 23.16]], name: '长沙-广州' },
              { coords: [[118.78, 32.06], [120.19, 30.26]], name: '南京-杭州' },
              { coords: [[104.06, 30.67], [113.23, 23.16]], name: '成都-广州' },
              { coords: [[121.48, 31.22], [120.19, 30.26]], name: '上海-杭州' },
              { coords: [[114.16, 22.28], [121.48, 31.22]], name: '香港-上海' }
            ]
          },
          {
            name: '物流节点',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            zlevel: 3,
            rippleEffect: {
              brushType: 'stroke'
            },
            label: {
              show: true,
              position: 'right',
              formatter: '{b}',
              color: '#fff'
            },
            symbolSize: 12,
            itemStyle: {
              color: '#ffeb3b'
            },
            data: [
              { name: '北京', value: [116.46, 39.92] },
              { name: '上海', value: [121.48, 31.22] },
              { name: '长沙', value: [113.08, 28.23] },
             
              { name: '南京', value: [118.78, 32.06] },
              { name: '杭州', value: [120.19, 30.26] },
              { name: '成都', value: [104.06, 30.67] },
              { name: '香港', value: [114.16, 22.28] }
            ]
          }
        ]
      };

      myChart.setOption(option);
    },
    resizeChart() {
      if (this.chart && this.$refs.chartContainer) {
        try {
          this.chart.resize();
        } catch (error) {
          console.warn('Chart resize warning:', error);
        }
      }
    }
  }
};
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 576px; /* 容器高度自适应 */
  display: flex;
  flex-direction: column;
  align-items: center;
  
}

#myecharts {
  width: 100%;
  height: 100%;
}
</style>