<template>
  <div class="space-time-container">
    <div class="nav-header">
      <span class="nav-text active">时空维度·观天测地</span>
      <router-link to="/monitor" class="nav-text">星官体系·天人合一</router-link>
      <router-link to="/analysis" class="nav-text">学术传承·道器相生</router-link>
    </div>
    
    <div class="content">
      <!-- 地图容器 -->
      <div class="map-container">
        <div class="map-controls">
          <div class="dynasty-filter">
            <button 
              v-for="dynasty in dynasties" 
              :key="dynasty.value"
              :class="['dynasty-btn', { active: currentDynasty === dynasty.value }]"
              @click="selectDynasty(dynasty.value)"
            >
              {{ dynasty.label }}
            </button>
          </div>
          <div class="layer-controls">
            <label class="layer-toggle">
              <input type="checkbox" v-model="showHeatmap">
              热力图层
            </label>
            <label class="layer-toggle">
              <input type="checkbox" v-model="showSites">
              遗址标记
            </label>
            <label class="layer-toggle">
              <input type="checkbox" v-model="showObservatories">
              天文台
            </label>
          </div>
        </div>
        <div id="map" class="map"></div>
        <div class="site-info" v-if="selectedSite" :class="{ visible: siteInfoVisible }">
          <h3>{{ selectedSite.name }}</h3>
          <p>{{ selectedSite.description }}</p>
          <div class="site-images">
            <div v-for="(img, index) in selectedSite.images" 
                 :key="index" 
                 class="image-container">
              <img :src="img.url" 
                   :alt="img.caption"
                   @error="handleImageError">
              <div class="image-caption">{{ img.caption }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 时间轴 -->
      <div class="timeline-container">
        <div class="timeline-controls">
          <button @click="playTimeline" :disabled="isPlaying">
            {{ isPlaying ? '播放中...' : '播放时间轴' }}
          </button>
          <button @click="stopTimeline" :disabled="!isPlaying">停止</button>
        </div>
        <div class="timeline">
          <div class="timeline-events">
            <div v-for="event in timelineEvents" 
                 :key="event.year" 
                 :class="['timeline-event', { active: currentYear >= event.year }]"
                 :style="{ left: `${getEventPosition(event.year)}%` }"
                 @click="selectEvent(event)">
              <div class="event-dot"></div>
              <div class="event-label">{{ event.name }}</div>
              <div class="event-year">{{ event.year }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import beijing1 from '../assets/北宋观星台.png';
import beijing2 from '../assets/天文观测仪器.png';
import hh1 from '../assets/古观象台全景.png';
import hh2 from '../assets/浑天仪.png';
import nanjing1 from '../assets/紫金山观景台.png';
import nanjing2 from '../assets/天文观测仪器.png';
import luoyang1 from '../assets/测景台遗址.png';
import luoyang2 from '../assets/日影测量仪器.png';
import xian1 from '../assets/天文台遗址.png';
import xian2 from '../assets/出土天文仪器.png';

export default {
  name: 'SpaceTimeDimension',
  setup() {
    const map = ref(null);
    const currentDynasty = ref('all');
    const showHeatmap = ref(true);
    const showSites = ref(true);
    const showObservatories = ref(true);
    const selectedSite = ref(null);
    const isPlaying = ref(false);
    const currentYear = ref(-2000);
    const siteInfoVisible = ref(false);

    const dynasties = [
      { label: '全部', value: 'all' },
      { label: '先秦', value: 'pre-qin' },
      { label: '秦汉', value: 'qin-han' },
      { label: '魏晋南北朝', value: 'wei-jin' },
      { label: '隋唐', value: 'sui-tang' },
      { label: '宋元', value: 'song-yuan' },
      { label: '明清', value: 'ming-qing' }
    ];

    const timelineEvents = [
      { year: -2000, name: '甲骨文天象记录', description: '商代甲骨文中记载天象' },
      { year: -1000, name: '周代观星台建立', description: '周代设立观象台' },
      { year: 100, name: '张衡制浑天仪', description: '东汉张衡制造浑天仪' },
      { year: 724, name: '僧一行测量子午线', description: '唐朝僧一行主持测量子午线' },
      { year: 1092, name: '苏颂水运仪象台', description: '北宋苏颂建造水运仪象台' },
      { year: 1276, name: '郭守敬改革历法', description: '元代郭守敬主持授时历改革' }
    ];

    // 初始化地图
    const initMap = () => {
      map.value = L.map('map').setView([34.5, 108.5], 5);
      
      // 使用深色地图主题
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        className: 'map-tiles'
      }).addTo(map.value);

      // 添加地图样式
      const style = document.createElement('style');
      style.textContent = `
        .map-tiles {
          filter: grayscale(100%) invert(100%) brightness(0.8) sepia(30%) hue-rotate(180deg);
        }
      `;
      document.head.appendChild(style);

      // 添加古代天文遗址标记
      addSiteMarkers();
    };

    // 添加遗址标记
    const addSiteMarkers = () => {
      const sites = [
        {
          name: '登封观星台',
          location: [34.5, 113.0],
          dynasty: 'song-yuan',
          description: '北宋时期重要的天文观测站，郭守敬主持修建',
          images: [
            { url: beijing1, caption: '观星台全景' },
            { url: beijing2, caption: '古代观测仪器' }
          ]
        },
        {
          name: '北京古观象台',
          location: [39.9, 116.4],
          dynasty: 'ming-qing',
          description: '明清两代皇家天文台，保存有浑天仪等珍贵仪器',
          images: [
            { url: hh1, caption: '古观象台全景' },
            { url: hh2, caption: '浑天仪' }
          ]
        },
        {
          name: '南京紫金山天文台',
          location: [32.1, 118.8],
          dynasty: 'ming-qing',
          description: '明代天文台遗址，现为现代天文台',
          images: [
            { url: nanjing1, caption: '紫金山天文台' },
            { url: nanjing2, caption: '古代天文仪器' }
          ]
        },
        {
          name: '洛阳周公测景台',
          location: [34.6, 112.4],
          dynasty: 'pre-qin',
          description: '周代周公测量日影的重要遗址',
          images: [
            { url: luoyang1, caption: '测景台遗址' },
            { url: luoyang2, caption: '日影测量仪器' }
          ]
        },
        {
          name: '西安天文台遗址',
          location: [34.3, 108.9],
          dynasty: 'qin-han',
          description: '秦汉时期重要的天文观测中心',
          images: [
            { url: xian1, caption: '天文台遗址' },
            { url: xian2, caption: '出土天文仪器' }
          ]
        }
      ];

      // 清除现有标记
      if (map.value) {
        map.value.eachLayer((layer) => {
          if (layer instanceof L.Marker) {
            map.value.removeLayer(layer);
          }
        });
      }

      // 添加新标记
      sites.forEach(site => {
        if (showSites.value && (currentDynasty.value === 'all' || site.dynasty === currentDynasty.value)) {
          const customIcon = L.divIcon({
            className: 'custom-marker',
            html: `<div class="marker-content">
                    <div class="marker-dot"></div>
                    <div class="marker-label">${site.name}</div>
                  </div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
          });

          L.marker(site.location, { icon: customIcon })
            .addTo(map.value)
            .on('click', () => {
              selectedSite.value = site;
              showSiteInfo();
            });
        }
      });
    };

    // 添加图片错误处理
    const handleImageError = (e) => {
      console.error('Image failed to load:', e.target.src);
      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzMzMzMzMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiNmZmZmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7lm77niYfliqDovb3lpLHotKU8L3RleHQ+PC9zdmc+';
    };

    // 修改显示遗址信息的方法
    const showSiteInfo = async () => {
      siteInfoVisible.value = false;
      await nextTick();
      siteInfoVisible.value = true;
    };

    // 时间轴控制
    const playTimeline = () => {
      isPlaying.value = true;
      const animate = () => {
        if (!isPlaying.value) return;
        if (currentYear.value < 1900) {
          currentYear.value += 10;
          // 更新地图显示
          updateMapForYear(currentYear.value);
          requestAnimationFrame(animate);
        } else {
          stopTimeline();
        }
      };
      requestAnimationFrame(animate);
    };

    const stopTimeline = () => {
      isPlaying.value = false;
    };

    const updateMapForYear = (year) => {
      // 根据年份更新地图显示
      const zoom = map.value.getZoom();
      const center = map.value.getCenter();
      
      // 添加过渡动画
      map.value.flyTo(center, zoom, {
        duration: 0.5,
        easeLinearity: 0.25
      });
    };

    const getEventPosition = (year) => {
      const totalYears = 3900; // from -2000 to 1900
      return ((year + 2000) / totalYears) * 100;
    };

    const selectEvent = (event) => {
      currentYear.value = event.year;
      updateMapForYear(event.year);
    };

    const selectDynasty = (dynasty) => {
      console.log(`Selected dynasty: ${dynasty}`); // 调试信息
      currentDynasty.value = dynasty;
      addSiteMarkers();
    };

    onMounted(() => {
      initMap();
    });

    onUnmounted(() => {
      if (map.value) {
        map.value.remove();
      }
    });

    return {
      currentDynasty,
      showHeatmap,
      showSites,
      showObservatories,
      selectedSite,
      dynasties,
      timelineEvents,
      isPlaying,
      currentYear,
      siteInfoVisible,
      playTimeline,
      stopTimeline,
      getEventPosition,
      selectEvent,
      selectDynasty,
      handleImageError,
    };
  }
};
</script>

<style scoped>
.space-time-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(to bottom, rgba(13, 15, 44, 0.95), rgba(13, 15, 44, 0.85));
  position: relative;
  padding: 20px;
}

.space-time-container::before {
  content: '';
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  border: 1px solid rgba(0,195,255,0.3);
  animation: borderGlow 2s infinite;
  pointer-events: none;
}

.nav-header {
  height: 60px;
  padding: 0 20px;
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
  padding: 20px;
  gap: 20px;
}

.map-container {
  flex: 1;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid rgba(0, 195, 255, 0.3);
  background: rgba(13, 15, 44, 0.3);
  box-shadow: 0 0 20px rgba(0, 195, 255, 0.1);
}

#map {
  height: 100%;
  width: 100%;
  background: rgba(13, 15, 44, 0.3);
}

.map-controls {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1000;
  background: rgba(13, 15, 44, 0.9);
  padding: 15px;
  border-radius: 4px;
  border: 1px solid rgba(0, 195, 255, 0.3);
  box-shadow: 0 0 15px rgba(0, 195, 255, 0.2);
}

.dynasty-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
}

.dynasty-btn {
  padding: 8px 15px;
  border: 1px solid rgba(0, 195, 255, 0.3);
  background: rgba(13, 15, 44, 0.6);
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.dynasty-btn:hover {
  background: rgba(0, 195, 255, 0.2);
  border-color: rgba(0, 195, 255, 0.5);
}

.dynasty-btn.active {
  background: rgba(0, 195, 255, 0.3);
  border-color: rgba(0, 195, 255, 0.8);
  box-shadow: 0 0 10px rgba(0, 195, 255, 0.3);
}

.layer-controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.layer-toggle {
  color: #fff;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.site-info {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(13, 15, 44, 0.95);
  padding: 20px;
  border-radius: 8px;
  border: 1px solid rgba(0, 195, 255, 0.3);
  color: #fff;
  max-width: 400px;
  box-shadow: 0 0 20px rgba(0, 195, 255, 0.2);
  backdrop-filter: blur(10px);
  transform: translateY(20px);
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 1000;
}

.site-info.visible {
  transform: translateY(0);
  opacity: 1;
}

.site-info h3 {
  margin: 0 0 10px 0;
  color: #00c3ff;
  font-size: 18px;
  text-shadow: 0 0 10px rgba(0, 195, 255, 0.3);
}

.site-info p {
  margin: 0 0 15px 0;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
}

.site-images {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 15px;
}

.image-container {
  position: relative;
  width: 100%;
  height: 150px;
  overflow: hidden;
  border-radius: 4px;
  border: 1px solid rgba(0, 195, 255, 0.3);
}

.site-images img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.image-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(13, 15, 44, 0.8);
  color: #fff;
  padding: 4px 8px;
  font-size: 12px;
  text-align: center;
}

.timeline-container {
  height: 150px;
  background: rgba(13, 15, 44, 0.7);
  border-radius: 4px;
  padding: 20px;
  border: 1px solid rgba(0, 195, 255, 0.3);
  position: relative;
}

.timeline-container::before,
.timeline-container::after {
  content: '';
  position: absolute;
  width: 15px;
  height: 15px;
}

.timeline-container::before {
  top: -1px;
  left: -1px;
  border-top: 2px solid #00c3ff;
  border-left: 2px solid #00c3ff;
}

.timeline-container::after {
  bottom: -1px;
  right: -1px;
  border-bottom: 2px solid #00c3ff;
  border-right: 2px solid #00c3ff;
}

.timeline-controls {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.timeline-controls button {
  padding: 8px 15px;
  background: rgba(0, 195, 255, 0.1);
  border: 1px solid rgba(0, 195, 255, 0.3);
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.timeline-controls button:hover:not(:disabled) {
  background: rgba(0, 195, 255, 0.2);
  border-color: rgba(0, 195, 255, 0.5);
}

.timeline-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.timeline {
  position: relative;
  height: 60px;
  background: rgba(74, 144, 226, 0.1);
  border-radius: 30px;
}

.timeline-events {
  position: relative;
  height: 100%;
}

.timeline-event {
  position: absolute;
  transform: translateX(-50%);
  cursor: pointer;
}

.event-dot {
  width: 12px;
  height: 12px;
  background: #4a90e2;
  border-radius: 50%;
  margin-bottom: 5px;
}

.event-label {
  color: #fff;
  font-size: 12px;
  white-space: nowrap;
  transform: rotate(-45deg);
  transform-origin: left top;
}

.event-year {
  color: rgba(255, 255, 255, 0.6);
  font-size: 10px;
}

.timeline-event.active .event-dot {
  background: #f5c842;
  box-shadow: 0 0 10px rgba(245, 200, 66, 0.5);
}

@keyframes borderGlow {
  0%, 100% {
    box-shadow: 0 0 5px rgba(0, 195, 255, 0.3);
  }
  50% {
    box-shadow: 0 0 15px rgba(0, 195, 255, 0.5);
  }
}

.custom-marker {
  background: transparent;
  border: none;
}

.marker-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.marker-dot {
  width: 12px;
  height: 12px;
  background: #00c3ff;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(0, 195, 255, 0.5);
  animation: pulse 2s infinite;
}

.marker-label {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(13, 15, 44, 0.9);
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  border: 1px solid rgba(0, 195, 255, 0.3);
  box-shadow: 0 0 10px rgba(0, 195, 255, 0.2);
  opacity: 0;
  transition: opacity 0.3s;
}

.marker-content:hover .marker-label {
  opacity: 1;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(0, 195, 255, 0.4);
  }
  70% {
    transform: scale(1.2);
    box-shadow: 0 0 0 10px rgba(0, 195, 255, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(0, 195, 255, 0);
  }
}
</style> 