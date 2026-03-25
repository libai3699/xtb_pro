import { createRouter, createWebHistory } from 'vue-router';
import BasicLayout from '@/layouts/BasicLayout.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: BasicLayout,
      redirect: '/dashboard',
      children: [
        {
          path: 'dashboard',
          component: () => import('@/views/dashboard/index.vue'),
        },
        {
          path: 'campaign',
          component: () => import('@/views/campaign/index.vue'),
        },
        {
          path: 'agent',
          component: () => import('@/views/agent/index.vue'),
        },
        {
          path: 'lead',
          component: () => import('@/views/lead/index.vue'),
        },
        {
          path: 'order',
          component: () => import('@/views/order/index.vue'),
        },
      ],
    },
  ],
});

export default router;

