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
          path: 'business/product',
          component: () => import('@/views/product/index.vue'),
          meta: {
            title: '商品管理',
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
          path: 'business/user',
          component: () => import('@/views/user/index.vue'),
          meta: {
            title: '用户管理',
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
          path: 'operation/content',
          component: () => import('@/views/content/index.vue'),
          meta: {
            title: '内容管理',
          },
        },
        {
          path: 'operation/reward-goods',
          component: () => import('@/views/reward-goods/index.vue'),
          meta: {
            title: '积分商品',
          },
        },
        {
          path: 'operation/reward-redeem-order',
          component: () => import('@/views/reward-redeem-order/index.vue'),
          meta: {
            title: '兑换订单',
          },
        },
        {
          path: 'operation/message',
          component: () => import('@/views/message/index.vue'),
          meta: {
            title: '消息中心',
          },
        },
        {
          path: 'operation/certificate',
          component: () => import('@/views/certificate/index.vue'),
          meta: {
            title: '证书管理',
          },
        },
        {
          path: 'operation/learning-record',
          component: () => import('@/views/learning-record/index.vue'),
          meta: {
            title: '学习记录',
          },
        },
        {
          path: 'operation/agent-review',
          component: () => import('@/views/agent-review/index.vue'),
          meta: {
            title: '代理评价',
          },
        },
        {
          path: 'operation/feedback',
          component: () => import('@/views/feedback/index.vue'),
          meta: {
            title: '意见反馈',
          },
        },
        {
          path: 'system/admin-user',
          component: () => import('@/views/admin-user/index.vue'),
          meta: {
            title: '管理员',
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
