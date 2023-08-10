import { createRouter, createWebHistory } from 'vue-router';
import MainView from '@/views/MainView.vue';
import LoginView from '@/views/LoginView.vue';
import RegistrationView from '@/views/RegistrationView.vue';
import AboutUsView from '@/views/AboutUsView.vue';
import CatalogView from '@/views/CatalogView.vue';
import { NamePages, PathPages } from '@/types/enums';

const {
  Home, AboutUs, Catalog, Login, Registration,
} = NamePages;

const routes = [
  {
    name: Home,
    path: PathPages.Home,
    component: MainView,
    meta: {
      title: Home,
    },
  },
  {
    name: AboutUs,
    path: PathPages.AboutUs,
    component: AboutUsView,
    meta: {
      title: AboutUs,
    },
  },
  {
    name: Catalog,
    path: PathPages.Catalog,
    component: CatalogView,
    meta: {
      title: Catalog,
    },
  },
  {
    name: Login,
    path: PathPages.Login,
    component: LoginView,
    meta: {
      title: Login,
    },
  },
  {
    name: Registration,
    path: PathPages.Registration,
    component: RegistrationView,
    meta: {
      title: Registration,
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
