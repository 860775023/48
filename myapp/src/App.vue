<template>
  <div id="app">
    <div class="title-container">
        <div class="cyber-title-wrapper">
          <h1 class="cyber-title">天文成就可视化系统</h1>
          <div class="title-decor left-decor"></div>
          <div class="title-decor right-decor"></div>
        </div>
      </div>
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>
<script>
import { provide, ref, nextTick } from 'vue'
import * as echarts from "echarts"
import axios from "axios"

// 设置基准路径
axios.defaults.baseURL = process.env.NODE_ENV === 'production'
  ? 'https://your-app-name.up.railway.app'  // 替换为你的 Railway 应用域名
  : 'http://localhost:3000';

export default {
  setup() {
    const isRouterAlive = ref(true)
    
    // 提供 echarts 实例
    provide('echarts', echarts)
    provide('axios', axios)
    
    // 提供重载方法
    const reload = () => {
      isRouterAlive.value = false
      nextTick(() => {
        isRouterAlive.value = true
      })
    }
    
    provide('reload', reload)
    
    return {
      isRouterAlive
    }
  }
}
</script>

<style lang="less">
body{
 
  background-color: rgb(13, 15, 44);
  background-size: cover;
  color: #fff;
}
*{
  margin:0px;
  padding: 0px;
  box-sizing: border-box;
}
.title-container {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 1%;
    z-index: 10;
    margin: 11px;
    background: rgba(13, 15, 44, 0.8);
    padding: 5px 30px;
    border: 1px solid rgba(0, 195, 255, 0.3);
    border-radius: 4px;
    box-shadow: 0 0 20px rgba(0, 195, 255, 0.2);
  }

  .cyber-title-wrapper {
    position: relative;
    padding: 0 40px;
    display: flex;
    align-items: center;
    justify-content: center;

    .title-decor {
      position: absolute;
      width: 30px;
      height: 2px;
      background: linear-gradient(90deg, 
        transparent,
        #00c3ff,
        transparent
      );
      
      &:before, &:after {
        content: '';
        position: absolute;
        width: 8px;
        height: 8px;
        background: #00c3ff;
        transform: rotate(45deg);
        box-shadow: 0 0 10px rgba(0, 195, 255, 0.5);
      }
      
      &.left-decor {
        left: 0;
        
        &:before {
          left: -4px;
          top: -3px;
        }
        
        &:after {
          right: -4px;
          top: -3px;
        }
      }
      
      &.right-decor {
        right: 0;
        
        &:before {
          left: -4px;
          top: -3px;
        }
        
        &:after {
          right: -4px;
          top: -3px;
        }
      }
    }
  }

  .cyber-title {
    font-size: 18px;
    color: #fff;
    position: relative;
    padding: 10px 20px;
    margin: 0;
    font-family: "Microsoft YaHei", sans-serif;
    letter-spacing: 4px;
    text-transform: uppercase;
    text-shadow: 0 0 10px rgba(0, 195, 255, 0.5);
    background: linear-gradient(180deg, #fff, #00c3ff);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border: 1px solid rgba(0, 195, 255, 0.5);
      clip-path: polygon(
        0 10px, 10px 0,
        calc(100% - 10px) 0, 100% 10px,
        100% calc(100% - 10px), calc(100% - 10px) 100%,
        10px 100%, 0 calc(100% - 10px)
      );
    }
    
    &:after {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: linear-gradient(45deg,
        rgba(0, 195, 255, 0.3),
        transparent 40%,
        transparent 60%,
        rgba(0, 195, 255, 0.3)
      );
      clip-path: polygon(
        0 12px, 12px 0,
        calc(100% - 12px) 0, 100% 12px,
        100% calc(100% - 12px), calc(100% - 12px) 100%,
        12px 100%, 0 calc(100% - 12px)
      );
      animation: borderGlow 3s infinite;
    }
  }
  @keyframes borderGlow {
    0%, 100% {
      opacity: 0.5;
      box-shadow: 0 0 5px rgba(0, 195, 255, 0.3);
    }
    50% {
      opacity: 0.8;
      box-shadow: 0 0 15px rgba(0, 195, 255, 0.5);
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
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 5px 15px;
  border: 1px solid transparent;
  
  &:hover {
    color: #00c3ff;
    text-shadow: 0 0 10px rgba(0, 195, 255, 0.5);
    border-color: rgba(0, 195, 255, 0.3);
    background: rgba(0, 195, 255, 0.1);
  }
}

#app {
  min-height: 100vh;
  background: linear-gradient(to bottom, 
    rgba(13, 15, 44, 0.95),
    rgba(13, 15, 44, 0.85)
  );
}

</style>
