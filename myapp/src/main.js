import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引用插件
import "lib-flexible/flexible.js"
import "echarts";
import ECharts from "vue-echarts";

createApp(App).component("vue-echarts", ECharts).use(store).use(router).mount('#app')


