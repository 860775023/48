import { createRouter, createWebHashHistory } from 'vue-router'
import Test from '@/views/Test.vue'
import RealTimeMonitor from '../components/RealTimeMonitor.vue'
import DataAnalysis from '../components/DataAnalysis.vue'
import MapPage from '../components/mapPage.vue'
import MobileCamera from '../components/MobileCamera.vue'

const routes = [

  {
    path:"/test",
    name:'Test',
    component:Test
  },{
    path: '/',
    name: 'SpaceTimeDimension',
    component: () => import('@/components/SpaceTimeDimension.vue')
  },
  {
    path: '/warehouse',
    name: 'Warehouse',
    component: MapPage
  },
  {
    path: '/monitor',
    name: 'Monitor',
    component: RealTimeMonitor
  },
  {
    path: '/analysis',
    name: 'Analysis',
    component: DataAnalysis
  },
  {
    path: '/mobile-camera',
    name: 'MobileCamera',
    component: MobileCamera
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
