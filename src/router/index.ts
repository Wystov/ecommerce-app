import { createRouter, createWebHistory } from 'vue-router';
import MainView from '@/views/MainView.vue';

const routes = [
  {
    name: 'main',
    path: '/',
    component: MainView,
    meta: {
      title: 'Main',
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = `eCommerce app - ${to.meta.title} page`;
  next();
});

export default router;
