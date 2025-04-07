<template>
  <header>
    <div class="nav-header">
      <router-link to="/" class="nav-text">时空维度·观天测地</router-link>
      <span class="nav-text active">星官体系·天人合一</span>
      <router-link to="/analysis" class="nav-text ">学术传承·道器相生</router-link>
    </div>
  </header>

  <div class="content">
    <div class="status-cards">
      <div class="status-card">
        <h3>二十八宿</h3>
        <div class="value">28</div>
      </div>
      <div class="status-card">
        <h3>四象</h3>
        <div class="value">4</div>
      </div>
      <div class="status-card">
        <h3>星官</h3>
        <div class="value">283</div>
      </div>
      <div class="status-card">
        <h3>观测仪器</h3>
        <div class="value">12</div>
      </div>
    </div>

    <div class="charts-container">
      <div class="chart-box">
        <h3>二十八宿星图</h3>
        <div class="constellation-content">
          <div class="star-map-container">
            <div class="star-map">
              <div ref="starMapCanvas"></div>
            </div>
            <div class="constellation-info" v-if="selectedConstellation">
              {{ selectedConstellation.description }}
            </div>
            <div class="navigation-controls">
              <button @click="zoomIn">放大</button>
              <button @click="zoomOut">缩小</button>
              <button @click="resetView">重置视图</button>
            </div>
          </div>
          <div class="control-panel">
            <div class="season-filter">
              <button :class="{ active: selectedSeason === '春' }" @click="selectSeason('春')">东宫苍龙</button>
              <button :class="{ active: selectedSeason === '夏' }" @click="selectSeason('夏')">南宫朱雀</button>
              <button :class="{ active: selectedSeason === '秋' }" @click="selectSeason('秋')">西宫白虎</button>
              <button :class="{ active: selectedSeason === '冬' }" @click="selectSeason('冬')">北宫玄武</button>
            </div>
          </div>
        </div>
      </div>

      <div class="chart-box">
        <h3>天文仪器发展时间轴</h3>
        <v-chart class="chart" :option="timelineOptions" autoresize />
      </div>
    </div>

    <div class="constellation-table">
      <h3>星官详细信息</h3>
      <table>
        <thead>
          <tr>
            <th>星官名称</th>
            <th>所属宿</th>
            <th>星数</th>
            <th>对应地理</th>
            <th>历史记载</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in constellationList" :key="item.id">
            <td>{{ item.name }}</td>
            <td>{{ item.mansion }}</td>
            <td>{{ item.starCount }}</td>
            <td>{{ item.geography }}</td>
            <td>
              <div class="history-text">{{ item.history }}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart, LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, TitleComponent, LegendComponent, TimelineComponent } from 'echarts/components';
import VChart from 'vue-echarts';
import * as d3 from 'd3';

use([
  CanvasRenderer,
  PieChart,
  LineChart,
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  TimelineComponent
]);

export default {
  name: 'StarSystemVisualization',
  components: { VChart },
  setup() {
    // 星图相关数据
    const selectedConstellation = ref(null);
    const selectedSeason = ref('春');
    const starMapCanvas = ref(null);
    let zoom = null;
    let svg = null;
    let g = null;

    // 星官数据
    const constellationList = ref([
      {
        id: 1,
        name: '角宿',
        mansion: '东宫苍龙',
        starCount: 12,
        geography: '齐地',
        history: '《史记·天官书》：角，天门，郊祀前望。'
      },
      {
        id: 2,
        name: '亢宿',
        mansion: '东宫苍龙',
        starCount: 4,
        geography: '宋地',
        history: '《史记·天官书》：亢，阙庭，人主奉邑。'
      },
      // ... 其他星官数据
    ]);

    // 时间轴配置
    const timelineOptions = ref({
      baseOption: {
        timeline: {
          axisType: 'category',
          autoPlay: true,
          playInterval: 3000,
          data: ['商周', '春秋战国', '秦汉', '魏晋南北朝', '隋唐', '宋元', '明清'],
          label: {
            color: '#fff'
          }
        },
        title: {
          text: '中国古代天文仪器发展史',
          textStyle: {
            color: '#fff',
            fontSize: 16
          }
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(0,0,0,0.7)',
          borderColor: 'rgba(255,255,255,0.5)',
          textStyle: {
            color: '#fff'
          }
        },
        xAxis: {
          type: 'category',
          data: ['圭表', '浑天仪', '简仪', '漏刻', '浑象', '圭表'],
          axisLabel: { 
            color: '#fff',
            fontSize: 14
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: { 
            color: '#fff',
            fontSize: 14
          }
        },
        series: [{
          type: 'line',
          data: [10, 25, 40, 55, 70, 85],
          lineStyle: {
            width: 5,
            color: '#00b8d4'
          },
          symbolSize: 12,
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: 'rgba(0,184,212,0.3)'
              }, {
                offset: 1,
                color: 'rgba(0,184,212,0.05)'
              }]
            }
          }
        }]
      },
      options: [
        {
          title: { text: '商周时期' },
          series: [{ data: [10, 15, 20, 25, 30, 35] }]
        },
        {
          title: { text: '春秋战国时期' },
          series: [{ data: [15, 25, 35, 45, 55, 65] }]
        },
        {
          title: { text: '秦汉时期' },
          series: [{ data: [20, 35, 50, 65, 80, 95] }]
        },
        {
          title: { text: '魏晋南北朝时期' },
          series: [{ data: [25, 40, 55, 70, 85, 100] }]
        },
        {
          title: { text: '隋唐时期' },
          series: [{ data: [30, 45, 60, 75, 90, 105] }]
        },
        {
          title: { text: '宋元时期' },
          series: [{ data: [35, 50, 65, 80, 95, 110] }]
        },
        {
          title: { text: '明清时期' },
          series: [{ data: [40, 55, 70, 85, 100, 115] }]
        }
      ]
    });

    // 初始化星图
    const initStarMap = () => {
      if (!starMapCanvas.value) return;

      const container = starMapCanvas.value;
      const width = container.clientWidth;
      const height = container.clientHeight;

      // 清除现有内容
      d3.select(container).selectAll("*").remove();

      // 创建SVG容器
      svg = d3.select(container)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("background-color", "rgba(0, 0, 0, 0.5)");

      // 添加缩放功能
      zoom = d3.zoom()
        .scaleExtent([0.5, 5])
        .on("zoom", (event) => {
          g.attr("transform", event.transform);
        });
      
      svg.call(zoom);

      // 创建主绘图组
      g = svg.append("g");

      // 定义二十八宿数据
      const constellations = [
        // 春季星宿 (东宫苍龙)
        { name: "角宿", x: width * 0.2, y: height * 0.3, stars: 12, season: "春", description: "角宿：12颗星，象征龙角" },
        { name: "亢宿", x: width * 0.25, y: height * 0.35, stars: 4, season: "春", description: "亢宿：4颗星，象征龙颈" },
        { name: "氐宿", x: width * 0.3, y: height * 0.4, stars: 4, season: "春", description: "氐宿：4颗星，象征龙胸" },
        { name: "房宿", x: width * 0.35, y: height * 0.45, stars: 4, season: "春", description: "房宿：4颗星，象征龙腹" },
        { name: "心宿", x: width * 0.4, y: height * 0.5, stars: 3, season: "春", description: "心宿：3颗星，象征龙心" },
        { name: "尾宿", x: width * 0.45, y: height * 0.55, stars: 9, season: "春", description: "尾宿：9颗星，象征龙尾" },
        { name: "箕宿", x: width * 0.5, y: height * 0.6, stars: 4, season: "春", description: "箕宿：4颗星，象征龙尾末端" },
        
        // 夏季星宿 (南宫朱雀)
        { name: "井宿", x: width * 0.6, y: height * 0.3, stars: 8, season: "夏", description: "井宿：8颗星，象征朱雀头部" },
        { name: "鬼宿", x: width * 0.65, y: height * 0.35, stars: 5, season: "夏", description: "鬼宿：5颗星，象征朱雀颈部" },
        { name: "柳宿", x: width * 0.7, y: height * 0.4, stars: 8, season: "夏", description: "柳宿：8颗星，象征朱雀胸部" },
        { name: "星宿", x: width * 0.75, y: height * 0.45, stars: 7, season: "夏", description: "星宿：7颗星，象征朱雀腹部" },
        { name: "张宿", x: width * 0.8, y: height * 0.5, stars: 6, season: "夏", description: "张宿：6颗星，象征朱雀翅膀" },
        { name: "翼宿", x: width * 0.85, y: height * 0.55, stars: 22, season: "夏", description: "翼宿：22颗星，象征朱雀翅膀" },
        { name: "轸宿", x: width * 0.9, y: height * 0.6, stars: 4, season: "夏", description: "轸宿：4颗星，象征朱雀尾部" },
        
        // 秋季星宿 (西宫白虎)
        { name: "奎宿", x: width * 0.2, y: height * 0.7, stars: 16, season: "秋", description: "奎宿：16颗星，象征白虎头部" },
        { name: "娄宿", x: width * 0.25, y: height * 0.75, stars: 3, season: "秋", description: "娄宿：3颗星，象征白虎颈部" },
        { name: "胃宿", x: width * 0.3, y: height * 0.8, stars: 3, season: "秋", description: "胃宿：3颗星，象征白虎胸部" },
        { name: "昴宿", x: width * 0.35, y: height * 0.85, stars: 7, season: "秋", description: "昴宿：7颗星，象征白虎腹部" },
        { name: "毕宿", x: width * 0.4, y: height * 0.9, stars: 8, season: "秋", description: "毕宿：8颗星，象征白虎前腿" },
        { name: "觜宿", x: width * 0.45, y: height * 0.95, stars: 3, season: "秋", description: "觜宿：3颗星，象征白虎嘴巴" },
        { name: "参宿", x: width * 0.5, y: height * 1.0, stars: 7, season: "秋", description: "参宿：7颗星，象征白虎后腿" },
        
        // 冬季星宿 (北宫玄武)
        { name: "斗宿", x: width * 0.6, y: height * 0.7, stars: 6, season: "冬", description: "斗宿：6颗星，象征玄武头部" },
        { name: "牛宿", x: width * 0.65, y: height * 0.75, stars: 6, season: "冬", description: "牛宿：6颗星，象征玄武颈部" },
        { name: "女宿", x: width * 0.7, y: height * 0.8, stars: 4, season: "冬", description: "女宿：4颗星，象征玄武胸部" },
        { name: "虚宿", x: width * 0.75, y: height * 0.85, stars: 2, season: "冬", description: "虚宿：2颗星，象征玄武腹部" },
        { name: "危宿", x: width * 0.8, y: height * 0.9, stars: 3, season: "冬", description: "危宿：3颗星，象征玄武前腿" },
        { name: "室宿", x: width * 0.85, y: height * 0.95, stars: 2, season: "冬", description: "室宿：2颗星，象征玄武后腿" },
        { name: "壁宿", x: width * 0.9, y: height * 1.0, stars: 2, season: "冬", description: "壁宿：2颗星，象征玄武尾部" }
      ];

      // 过滤当前季节的星宿
      const filteredConstellations = constellations.filter(c => 
        c.season === selectedSeason.value
      );

      // 绘制连线
      g.selectAll("line")
        .data(filteredConstellations.slice(0, -1))
        .enter()
        .append("line")
        .attr("x1", d => d.x)
        .attr("y1", d => d.y)
        .attr("x2", (d, i) => filteredConstellations[i + 1].x)
        .attr("y2", (d, i) => filteredConstellations[i + 1].y)
        .attr("stroke", "#4a90e2")
        .attr("stroke-width", 2)
        .attr("stroke-opacity", 0.6);

      // 绘制星点
      g.selectAll("circle")
        .data(filteredConstellations)
        .enter()
        .append("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", 5)
        .attr("fill", "#fff")
        .attr("stroke", "#4a90e2")
        .attr("stroke-width", 2)
        .on("mouseover", function(event, d) {
          d3.select(this)
            .attr("r", 8)
            .attr("fill", "#4a90e2");
          
          selectedConstellation.value = d;
        })
        .on("mouseout", function() {
          d3.select(this)
            .attr("r", 5)
            .attr("fill", "#fff");
          
          selectedConstellation.value = null;
        });

      // 添加文字标签
      g.selectAll("text")
        .data(filteredConstellations)
        .enter()
        .append("text")
        .attr("x", d => d.x + 10)
        .attr("y", d => d.y + 5)
        .text(d => d.name)
        .attr("fill", "#fff")
        .attr("font-size", "12px");

      // 自动调整视图
      setTimeout(() => {
        const bbox = g.node().getBBox();
        const hRatio = width / bbox.width;
        const vRatio = height / bbox.height;
        const scale = 0.85 * Math.min(hRatio, vRatio);
        const translateX = (width - bbox.width * scale) / 2 - bbox.x * scale;
        const translateY = (height - bbox.height * scale) / 2 - bbox.y * scale;

        svg.transition()
          .duration(500)
          .call(zoom.transform, d3.zoomIdentity
            .translate(translateX, translateY)
            .scale(scale));
      }, 0);
    };

    // 选择季节
    const selectSeason = (season) => {
      selectedSeason.value = season;
      initStarMap();
    };

    // 缩放控制
    const zoomIn = () => {
      if (svg) {
        const currentTransform = d3.zoomTransform(svg.node());
        svg.transition()
          .duration(300)
          .call(zoom.scaleBy, 1.5);
      }
    };

    const zoomOut = () => {
      if (svg) {
        const currentTransform = d3.zoomTransform(svg.node());
        svg.transition()
          .duration(300)
          .call(zoom.scaleBy, 0.75);
      }
    };

    const resetView = () => {
      if (svg) {
        const container = starMapCanvas.value;
        const width = container.clientWidth;
        const height = container.clientHeight;
        const bbox = g.node().getBBox();
        const hRatio = width / bbox.width;
        const vRatio = height / bbox.height;
        const scale = 0.85 * Math.min(hRatio, vRatio);
        const translateX = (width - bbox.width * scale) / 2 - bbox.x * scale;
        const translateY = (height - bbox.height * scale) / 2 - bbox.y * scale;

        svg.transition()
          .duration(500)
          .call(zoom.transform, d3.zoomIdentity
            .translate(translateX, translateY)
            .scale(scale));
      }
    };

    // 响应式调整
    const handleResize = () => {
      if (starMapCanvas.value) {
        initStarMap();
      }
    };

    onMounted(() => {
      initStarMap();
      window.addEventListener('resize', handleResize);
    });

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
    });

    return {
      selectedConstellation,
      selectedSeason,
      constellationList,
      timelineOptions,
      starMapCanvas,
      selectSeason,
      zoomIn,
      zoomOut,
      resetView
    };
  }
};
</script>

<style scoped>
/* 保持原有样式不变 */
.content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  color: #fff;
  height: calc(97vh - 60px);
  border: 1px solid #4a90e2;
  border-radius: 12px;
  margin: 15px 20px;
  background: linear-gradient(to bottom, rgba(13, 15, 44, 0.95), rgba(13, 15, 44, 0.85));
  box-shadow: 0 0 20px rgba(74, 144, 226, 0.3);
}

.status-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.status-card {
  background: rgba(13, 15, 44, 0.7);
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  border: 1px solid rgba(74, 144, 226, 0.6);
  transition: all 0.3s ease;
  height: 160px;
  backdrop-filter: blur(10px);
}

.status-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(74, 144, 226, 0.4);
}

.status-card h3 {
  margin: 0;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

.value {
  font-size: 32px;
  font-weight: bold;
  margin-top: 15px;
  background: linear-gradient(45deg, #4a90e2, #64b5f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.charts-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.chart-box {
  background: rgba(13, 15, 44, 0.7);
  border-radius: 8px;
  padding: 20px;
  border: 1px solid rgba(74, 144, 226, 0.6);
  height: 450px;
  backdrop-filter: blur(10px);
}

.constellation-content {
  display: flex;
  gap: 20px;
  height: 380px;
}

.star-map-container {
  flex: 1;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  position: relative;
}

.star-map {
  width: 100%;
  height: 100%;
}

.constellation-info {
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  background: rgba(13, 15, 44, 0.9);
  color: white;
  padding: 15px;
  border-radius: 4px;
  font-size: 14px;
  line-height: 1.6;
  border: 1px solid rgba(74, 144, 226, 0.4);
}

.navigation-controls {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 10px;
}

.control-panel {
  width: 150px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.season-filter {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.season-filter button {
  width: 100%;
  padding: 12px;
  background: rgba(74, 144, 226, 0.2);
  color: white;
  border: 1px solid rgba(74, 144, 226, 0.4);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.season-filter button.active {
  background: rgba(74, 144, 226, 0.8);
  border-color: #4a90e2;
}

.season-filter button:hover:not(.active) {
  background: rgba(74, 144, 226, 0.4);
}

.constellation-table {
  background: rgba(13, 15, 44, 0.7);
  border-radius: 8px;
  padding: 20px;
  border: 1px solid rgba(74, 144, 226, 0.6);
  backdrop-filter: blur(10px);
}

.constellation-table h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
  text-align: center;
  color: #fff;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid rgba(74, 144, 226, 0.2);
  color: #fff;
}

th {
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  background: rgba(74, 144, 226, 0.1);
}

.history-text {
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chart {
  width: 100%;
  height: 100%;
}

button {
  font-family: "Microsoft YaHei", sans-serif;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 星空动画效果 */
@keyframes twinkle {
  0% { opacity: 0.3; }
  50% { opacity: 1; }
  100% { opacity: 0.3; }
}

.star-map::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 1%);
  background-size: 15px 15px;
  animation: twinkle 3s infinite;
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
</style>