<template>
  <div class="analysis-container">
    <div class="nav-header">
      <router-link to="/" class="nav-text">时空维度·观天测地</router-link>
      <router-link to="/monitor" class="nav-text">星官体系·天人合一</router-link>
      <span class="nav-text active">学术传承·道器相生</span>
    </div>
    
    <div class="content">
      <div class="charts-grid">
        <!-- 学者著作关系图 -->
        <div class="chart-box relationship-chart">
          <div class="chart-title">天文学术传承谱系</div>
          <div class="legend">
            <div class="legend-item">
              <span class="dot scholar"></span>学者
            </div>
            <div class="legend-item">
              <span class="dot book"></span>著作
            </div>
            <div class="legend-item">
              <span class="line"></span>撰写/传承关系
            </div>
          </div>
          <vue-echarts 
            ref="relationshipChart"
            :option="relationshipOptions" 
            class="chart" 
            :autoresize="true"
          />
        </div>

        <!-- 学术流派分布 -->
        <div class="chart-box">
          <div class="chart-title">学术流派分布</div>
          <vue-echarts 
            ref="schoolChart"
            :option="schoolOptions" 
            class="chart" 
            :autoresize="true"
          />
        </div>

        <!-- 重要著作年代分布 -->
        <div class="chart-box">
          <div class="chart-title">重要天文著作年代分布</div>
          <vue-echarts 
            ref="timelineChart"
            :option="timelineOptions" 
            class="chart" 
            :autoresize="true"
          />
        </div>

        <!-- 学术影响力分析 -->
        
      </div>
    </div>
  </div>
</template>

<style scoped>
.analysis-container {
  padding: 0;
  color: #fff;
  height: 98vh;
  display: flex;
  flex-direction: column;
}

.nav-header {
  height: 60px;
  padding: 40px 20px;
  display: flex;
  align-items: center;
  gap: 30px;
  background: rgba(13, 15, 44, 0.6);
  position: relative;
  border: 1px solid rgba(0, 195, 255, 0.3);
}

.nav-header::before,
.nav-header::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
}

.nav-header::before {
  top: -1px;
  left: -1px;
  border-top: 2px solid #00c3ff;
  border-left: 2px solid #00c3ff;
  box-shadow: -2px -2px 10px rgba(0, 195, 255, 0.5);
}

.nav-header::after {
  bottom: -1px;
  right: -1px;
  border-bottom: 2px solid #00c3ff;
  border-right: 2px solid #00c3ff;
  box-shadow: 2px 2px 10px rgba(0, 195, 255, 0.5);
}

.nav-text {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 16px;
  transition: all 0.3s ease;
  position: relative;
  padding: 5px 15px;
}

.nav-text:hover {
  color: #00c3ff;
  text-shadow: 0 0 10px rgba(0, 195, 255, 0.5);
}

.nav-text.active {
  color: #00c3ff;
  background: rgba(0, 195, 255, 0.1);
  border: 1px solid rgba(0, 195, 255, 0.3);
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  overflow: hidden;
}

.charts-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  padding: 20px;
  border: 1px solid #4a90e2;
  border-radius: 12px;
  background: rgba(13, 15, 44, 0.85);
  min-height: 0;
}

.chart-box {
  background: rgba(13, 15, 44, 0.7);
  padding: 20px;
  border-radius: 8px;
  border: 1px solid rgba(74, 144, 226, 0.6);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.relationship-chart {
  grid-column: span 2;
  height: 500px;
}

.chart {
  flex: 1;
  min-height: 0;
}

.chart-title {
  color: #fff;
  font-size: 18px;
  margin-bottom: 20px;
  padding-left: 20px;
  font-weight: 500;
}

.legend {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
  padding-left: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.9);
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.dot.scholar {
  background: #4a90e2;
}

.dot.book {
  background: #f5c842;
}

.line {
  width: 20px;
  height: 2px;
  background: rgba(255, 255, 255, 0.6);
}
</style>

<script>
import { ref, onMounted } from 'vue';
import VueEcharts from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { GraphChart, TreeChart, LineChart, SunburstChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent
} from 'echarts/components';

use([
  CanvasRenderer,
  GraphChart,
  TreeChart,
  LineChart,
  SunburstChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent
]);

export default {
  name: 'AcademicInheritance',
  components: { VueEcharts },
  setup() {
    // 关系图配置
    const relationshipOptions = ref({
      tooltip: {},
      toolbox: {
        feature: {
          dataZoom: {},
          restore: {}
        }
      },
      legend: {
        data: ['学者', '著作'],
        textStyle: { color: '#fff' }
      },
      series: [{
        type: 'graph',
        layout: 'force',
        animation: true,
        draggable: true,
        data: [
          // 学者节点
          { name: '张衡', category: 0, symbolSize: 50, value: 100 },
          { name: '僧一行', category: 0, symbolSize: 45, value: 90 },
          { name: '沈括', category: 0, symbolSize: 40, value: 85 },
          { name: '郭守敬', category: 0, symbolSize: 50, value: 95 },
          // 著作节点
          { name: '灵宪', category: 1, symbolSize: 35, value: 80 },
          { name: '大衍历', category: 1, symbolSize: 30, value: 75 },
          { name: '梦溪笔谈', category: 1, symbolSize: 40, value: 85 },
          { name: '授时历', category: 1, symbolSize: 45, value: 90 }
        ],
        links: [
          { source: '张衡', target: '灵宪', value: 10 },
          { source: '僧一行', target: '大衍历', value: 8 },
          { source: '沈括', target: '梦溪笔谈', value: 9 },
          { source: '郭守敬', target: '授时历', value: 10 }
        ],
        categories: [
          { name: '学者' },
          { name: '著作' }
        ],
        force: {
          repulsion: 200,
          gravity: 0.1,
          edgeLength: 120
        },
        itemStyle: {
          normal: {
            borderColor: '#fff',
            borderWidth: 1,
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.3)'
          }
        },
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.6)',
          curveness: 0.3
        },
        emphasis: {
          focus: 'adjacency',
          lineStyle: {
            width: 4
          }
        },
        label: {
          show: true,
          color: '#fff'
        }
      }]
    });

    // 学术流派分布配置
    const schoolOptions = ref({
      tooltip: {
        trigger: 'item'
      },
      series: [{
        type: 'sunburst',
        data: [{
          name: '天文学派',
          children: [{
            name: '历法学派',
            value: 40,
            children: [
              { name: '大衍历', value: 15 },
              { name: '授时历', value: 25 }
            ]
          }, {
            name: '星象学派',
            value: 35,
            children: [
              { name: '天文星象', value: 20 },
              { name: '占星术', value: 15 }
            ]
          }, {
            name: '器物学派',
            value: 25,
            children: [
              { name: '浑天仪', value: 15 },
              { name: '圭表', value: 10 }
            ]
          }]
        }],
        radius: ['0%', '95%'],
        itemStyle: {
          borderRadius: 7,
          borderWidth: 2,
          borderColor: '#000'
        },
        label: {
          show: true,
          color: '#fff'
        }
      }]
    });

    // 时间轴配置
    const timelineOptions = ref({
      tooltip: {
        trigger: 'axis',
        formatter: '{b}: {c}'
      },
      xAxis: {
        type: 'category',
        data: ['汉代', '魏晋', '隋唐', '宋', '元', '明', '清'],
        axisLabel: { color: '#fff' },
        axisLine: { lineStyle: { color: '#fff' } }
      },
      yAxis: {
        type: 'value',
        name: '著作数量',
        nameTextStyle: { color: '#fff' },
        axisLabel: { color: '#fff' },
        axisLine: { lineStyle: { color: '#fff' } }
            },
            series: [{
        data: [3, 4, 8, 12, 6, 9, 7],
        type: 'line',
        smooth: true,
        symbolSize: 10,
        lineStyle: {
          width: 4,
          color: '#4a90e2'
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
              color: 'rgba(74,144,226,0.4)'
            }, {
              offset: 1,
              color: 'rgba(74,144,226,0.1)'
            }]
          }
        }
      }]
    });

    // 影响力分析配置
    const influenceOptions = ref({
      tooltip: {
        trigger: 'item'
      },
      series: [{
        type: 'tree',
        data: [{
          name: '中国古代天文学',
          children: [
            {
              name: '张衡',
              children: [
                { name: '灵宪' },
                { name: '浑天仪说' }
              ]
            },
            {
              name: '僧一行',
              children: [
                { name: '大衍历经' },
                { name: '测天论' }
              ]
            }
          ]
        }],
        top: '5%',
        left: '7%',
        bottom: '5%',
        right: '7%',
        symbol: 'emptyCircle',
        symbolSize: 10,
        label: {
          position: 'left',
          color: '#fff',
          fontSize: 14
        },
        leaves: {
          label: {
            position: 'right',
            color: '#fff'
          }
        },
        emphasis: {
          focus: 'descendant'
        },
        expandAndCollapse: true,
        animationDuration: 550,
        animationDurationUpdate: 750,
        lineStyle: {
          color: '#4a90e2',
          width: 2
        }
      }]
    });

    onMounted(() => {
      // 这里可以添加一些初始化逻辑
    });

    return {
      relationshipOptions,
      schoolOptions,
      timelineOptions,
      influenceOptions
    };
  }
};
</script> 