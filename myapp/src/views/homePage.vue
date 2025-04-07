<template>
  <div class="home-container">
    <header>
      <div>
        <router-link to="/" class="nav-text">仓储实况</router-link>
        <router-link to="/monitor" class="nav-text">实时监测</router-link>
        <router-link to="/analysis" class="nav-text">数据分析</router-link>
      </div>
      
    </header>
    <!-- 大容器 -->
    <section class="container">
      <!-- 添加科技感边框容器 -->
      <div class="tech-border">
        <div class="corner-lt"></div>
        <div class="corner-rt"></div>
        <div class="corner-lb"></div>
        <div class="corner-rb"></div>
        <!-- 原有内容 -->
        <section class="itemLeft">
          
        </section>
        <section class="itemCenter">
          <div><MapPage/></div>
        </section>
        <section class="itemRight">
        </section>
      </div>
    </section>
  </div>
</template>

<script>
import ItemPage from "@/components/itemPage.vue";

import ItemOne from "@/components/itemOne.vue"
import ItemTwo from "@/components/itemTwo.vue"
import ItemThree from "@/components/itemThree.vue"
import ItemFour from "@/components/itemFour.vue"
import ItemFive from "@/components/itemFive.vue";
import ItemSix from "@/components/itemSix.vue";
import MapPage from "@/components/mapPage.vue"
import ItemSeven from "@/components/itemSeven.vue";

import {inject} from "vue"

export default {
  components: {
    ItemPage,ItemOne,ItemTwo,ItemThree,ItemFour,MapPage,ItemFive,ItemSix,ItemSeven
  },

  setup(){
    let $echarts=inject("echarts")
    let $http=inject("axios")
    console.log($echarts)
    console.log($http)
  }
};
</script>

<style lang="less">
header {
  height: 10000px;
  width: 100%;
  background-color: rgba(0, 0, 255, 0.2);
  display: flex;
  align-items: center;
  padding: 0 1rem;
  
  div:first-child {
    display: flex;
    gap: 30px;
    font-size: 15px;
  }

 
}

@keyframes borderGlow {
  0%, 100% {
    opacity: 0.5;
    filter: drop-shadow(0 0 5px rgba(0, 195, 255, 0.3));
  }
  50% {
    opacity: 0.8;
    filter: drop-shadow(0 0 15px rgba(0, 195, 255, 0.5));
  }
}

// 添加扫描线动画
@keyframes scanline {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100%);
  }
}

// 添加光晕动画
@keyframes glow {
  0%, 100% {
    box-shadow: 0 0 5px rgba(0, 195, 255, 0.3),
                0 0 10px rgba(0, 195, 255, 0.2),
                0 0 15px rgba(0, 195, 255, 0.1);
  }
  50% {
    box-shadow: 0 0 10px rgba(0, 195, 255, 0.4),
                0 0 20px rgba(0, 195, 255, 0.3),
                0 0 30px rgba(0, 195, 255, 0.2);
  }
}

.nav-text {
  color: hsl(120, 4%, 95%);
  text-decoration: none;
  cursor: pointer;
  
  &:hover {
    color: #1890ff;
  }
}

// 大容器的样式
.container {
  min-width: 1200px;
  max-width: 2048px;
  margin: 0 auto;
  padding: 0.125rem 0.125rem 0;
  
  .tech-border {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    padding: 20px;
    
    
    // 四个角的装饰
    .corner-lt,
    .corner-rt,
    .corner-lb,
    .corner-rb {
      position: absolute;
      width: 20px;
      height: 20px;
      
      &:before,
      &:after {
        content: '';
        position: absolute;
        background: #00c3ff;
      }
    }
    
    // 左上角
    .corner-lt {
      top: 0;
      left: 0;
      
      &:before {
        top: 0;
        left: 0;
        width: 2px;
        height: 40px;
        box-shadow: 0 0 10px #00c3ff;
      }
      
      &:after {
        top: 0;
        left: 0;
        width: 40px;
        height: 2px;
        box-shadow: 0 0 10px #00c3ff;
      }
    }
    
    // 右上角
    .corner-rt {
      top: 0;
      right: 0;
      
      &:before {
        top: 0;
        right: 0;
        width: 2px;
        height: 40px;
        box-shadow: 0 0 10px #00c3ff;
      }
      
      &:after {
        top: 0;
        right: 0;
        width: 40px;
        height: 2px;
        box-shadow: 0 0 10px #00c3ff;
      }
    }
    
    // 左下角
    .corner-lb {
      bottom: 0;
      left: 0;
      
      &:before {
        bottom: 0;
        left: 0;
        width: 2px;
        height: 40px;
        box-shadow: 0 0 10px #00c3ff;
      }
      
      &:after {
        bottom: 0;
        left: 0;
        width: 40px;
        height: 2px;
        box-shadow: 0 0 10px #00c3ff;
      }
    }
    
    // 右下角
    .corner-rb {
      bottom: 0;
      right: 0;
      
      &:before {
        bottom: 0;
        right: 0;
        width: 2px;
        height: 40px;
        box-shadow: 0 0 10px #00c3ff;
      }
      
      &:after {
        bottom: 0;
        right: 0;
        width: 40px;
        height: 2px;
        box-shadow: 0 0 10px #00c3ff;
      }
    }
    
    // 添加边框动画
    &:before {
      content: '';
      position: absolute;
      top: 10px;
      left: 10px;
      right: 10px;
      bottom: 10px;
      border: 1px solid rgba(0,195,255,0.3);
      animation: borderGlow 2s infinite;
    }
  }

  // 保持原有的布局样式
  .itemLeft,
  .itemRight {
    flex: 3;
  }

  .itemCenter {
    flex: 5;
    height: 567px;
    padding: 0.125rem;
    margin: .25rem;
  }

  .y{
     // 确保宽度与.itemCenter一致
  position: absolute; 
  width: 780px;
    border: 1px solid blue;
    background-color: rgba(12,130,255,.85);
   height: 273px;
   left: 463px; 
  }

}

.nav-menu {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 20px 0;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 25px;
  background: rgba(25, 118, 210, 0.1);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none; /* 移除下划线 */
}

.nav-item:hover {
  background: rgba(25, 118, 210, 0.2);
  transform: translateY(-2px);
}

.nav-item i {
  font-size: 24px;
  margin-bottom: 8px;
  color: #1890ff;
}

.nav-item span {
  color: #fff;
  font-size: 16px;
}

/* 激活状态的样式 */
.router-link-active {
  background: rgba(25, 118, 210, 0.3);
}

// 边框发光动画
@keyframes borderGlow {
  0% {
    box-shadow: 0 0 5px rgba(0,195,255,0.3) inset;
  }
  50% {
    box-shadow: 0 0 20px rgba(0,195,255,0.5) inset;
  }
  100% {
    box-shadow: 0 0 5px rgba(0,195,255,0.3) inset;
  }
}
</style>