<template>
  <div class="item-seven">
    <div class="left">
      <div class="title">运单状态</div>
      <div class="content" ref="leftContent">
        <div class="scroll-list" :style="{ transform: `translateY(${scrollTop}px)` }">
          <div class="item" v-for="item in leftData" :key="item.id">
            <span>{{ item.id }}</span>
            <span>{{ item.orderNo }}</span>
            <span>{{ item.time }}</span>
            <div class="progress">
              <div class="bar" :style="{ width: item.progress + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="title">运单跟踪</div>
      <div class="content" ref="rightContent">
        <div class="scroll-list" :style="{ transform: `translateY(${scrollTop}px)` }">
          <div class="item" v-for="item in rightData" :key="item.id">
            <span>{{ item.id }}</span>
            <span>{{ item.orderNo }}</span>
            <span>{{ item.time }}</span>
            <span>{{ item.status }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'ItemSeven',
  setup() {
    const scrollTop = ref(0)
    const leftContent = ref(null)
    const rightContent = ref(null)
    let timer = null

    // 左侧数据
    const originalLeftData = [
      { id: '01', orderNo: '202002010001', time: '3小时20分', progress: 33 },
      { id: '02', orderNo: '202002010001', time: '3小时20分', progress: 30 },
      { id: '03', orderNo: '202002010001', time: '3小时20分', progress: 95 },
      { id: '04', orderNo: '202002010001', time: '3小时20分', progress: 96 },
    ]

    // 右侧数据
    const originalRightData = [
      { id: '12', orderNo: '202002010001', time: '3小时20分', status: '已发货' },
      { id: '13', orderNo: '202002010001', time: '3小时20分', status: '运输中' },
      { id: '14', orderNo: '202002010001', time: '3小时20分', status: '已签收' },
      { id: '15', orderNo: '202002010001', time: '3小时20分', status: '已完成' },
    ]

    // 用于显示的数据（包含复制的数据以实现无缝滚动）
    const leftData = ref([...originalLeftData, ...originalLeftData])
    const rightData = ref([...originalRightData, ...originalRightData])

    // 滚动动画
    const startScroll = () => {
      const itemHeight = 40 // 每个项目的高度
      const totalHeight = itemHeight * originalLeftData.length
      
      timer = setInterval(() => {
        scrollTop.value--
        
        // 当滚动到第一组数据底部时，重置位置
        if (Math.abs(scrollTop.value) >= totalHeight) {
          scrollTop.value = 0
        }
      }, 50) // 控制滚动速度
    }

    // 鼠标悬停时暂停滚动
    const stopScroll = () => {
      if (timer) {
        clearInterval(timer)
        timer = null
      }
    }

    // 鼠标离开时继续滚动
    const resumeScroll = () => {
      if (!timer) {
        startScroll()
      }
    }

    onMounted(() => {
      startScroll()
      // 添加鼠标事件监听
      if (leftContent.value) {
        leftContent.value.addEventListener('mouseenter', stopScroll)
        leftContent.value.addEventListener('mouseleave', resumeScroll)
      }
      if (rightContent.value) {
        rightContent.value.addEventListener('mouseenter', stopScroll)
        rightContent.value.addEventListener('mouseleave', resumeScroll)
      }
    })

    onUnmounted(() => {
      if (timer) {
        clearInterval(timer)
      }
      // 移除事件监听
      if (leftContent.value) {
        leftContent.value.removeEventListener('mouseenter', stopScroll)
        leftContent.value.removeEventListener('mouseleave', resumeScroll)
      }
      if (rightContent.value) {
        rightContent.value.removeEventListener('mouseenter', stopScroll)
        rightContent.value.removeEventListener('mouseleave', resumeScroll)
      }
    })

    return {
      scrollTop,
      leftData,
      rightData,
      leftContent,
      rightContent
    }
  }
}
</script>

<style scoped lang="less">
.item-seven {
  height: 100%;
  display: flex;
  justify-content: space-between;
  color: #fff;
  
  .left, .right {
    flex: 1;
    display: flex;
    flex-direction: column;
    
    .title {
      height: 40px;
      line-height: 40px;
      text-align: center;
      font-size: 16px;
      background-color: rgba(0,195,255,0.1);
    }
    
    .content {
      flex: 1;
      overflow: hidden;
      position: relative;
    }

    .scroll-list {
      transition: transform 0.05s linear;
    }

    .item {
      height: 40px;
      display: flex;
      align-items: center;
      padding: 0 10px;
      border-bottom: 1px solid rgba(0,195,255,0.1);
      
      span {
        flex: 1;
        text-align: center;
      }
      
      .progress {
        flex: 1;
        height: 6px;
        background-color: rgba(255,255,255,0.1);
        border-radius: 3px;
        overflow: hidden;
        
        .bar {
          height: 100%;
          background-color: #00ff00;
          transition: width 0.3s;
        }
      }
    }
  }
}
</style>