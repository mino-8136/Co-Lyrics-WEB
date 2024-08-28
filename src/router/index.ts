import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import EditView from '../views/EditView.vue'
import DebugView from '../views/DebugView.vue'
import PlayView from '../views/PlayView.vue'
import ConfigView from '../views/ConfigView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/edit',
      name: 'edit',
      component: EditView
    },
    {
      path: '/debug',
      name: 'debug',
      component: DebugView
    },
    {
      path: '/play',
      name: 'play',
      component: PlayView
    },
    {
      path: '/config',
      name: 'config',
      component: ConfigView
    }
  ]
})

export default router
