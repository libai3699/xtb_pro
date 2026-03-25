import { createRouter, createWebHistory } from 'vue-router';
import BasicLayout from '@/layouts/BasicLayout.vue';
import { getAdminToken } from '@/utils/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      component: () => import('@/views/login/index.vue'),
      meta: {
        title: '登录',
      },
    },
    {
      path: '/',
      component: BasicLayout,
      redirect: '/dashboard',
      children: [
        {
          path: 'dashboard',
          component: () => import('@/views/dashboard/index.vue'),
          meta: {
            title: '工作台',
          },
        },
        {
          path: 'business/campaign',
          component: () => import('@/views/campaign/index.vue'),
          meta: {
            title: '活动管理',
          },
        },
        {
          path: 'business/agent',
          component: () => import('@/views/agent/index.vue'),
          meta: {
            title: '代理管理',
          },
        },
        {
          path: 'business/lead',
          component: () => import('@/views/lead/index.vue'),
          meta: {
            title: '线索管理',
          },
        },
        {
          path: 'business/order',
          component: () => import('@/views/order/index.vue'),
          meta: {
            title: '订单管理',
          },
        },
        {
          path: 'system/login-log',
          component: () => import('@/views/login-log/index.vue'),
          meta: {
            title: '登录日志',
          },
        },
      ],
    },
  ],
});

router.beforeEach((to) => {
  const token = getAdminToken();

  if (to.path === '/login') {
    if (token) {
      return '/dashboard';
    }
    return true;
  }

  if (!token) {
    return '/login';
  }

  return true;
});

export default router;

