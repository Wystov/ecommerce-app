import { createRouter, createWebHistory } from 'vue-router';
import MainView from '@/views/MainView.vue';
import LoginView from '@/views/LoginView.vue';
import RegistrationView from '@/views/RegistrationView.vue';
import AboutUsView from '@/views/AboutUsView.vue';
import CatalogView from '@/views/CatalogView.vue';
import NotFoundView from '@/views/NotFoundView.vue';
import CartView from '@/views/CartView.vue';
import { NamePages, PathPages } from '@/types/enums';
import AccountView from '@/views/AccountView.vue';
import { useUserStore } from '@/stores/user';
import ProductView from '@/views/ProductView.vue';

const {
  Home, AboutUs, Catalog, Login, Registration, NotFound, Cart, Account,
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
    path: '/catalog',
    component: CatalogView,
    meta: {
      title: Catalog,
    },
  },
  {
    path: '/catalog/:categorySlug',
    name: 'Category',
    component: CatalogView,
    props: true,
  },
  {
    path: '/catalog/:categorySlug/:subcategorySlug',
    name: 'Subcategory',
    component: CatalogView,
    props: true,
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
  {
    name: NotFound,
    path: PathPages.NotFound,
    component: NotFoundView,
    meta: {
      title: NotFound,
    },
  },
  {
    name: Cart,
    path: PathPages.Cart,
    component: CartView,
    meta: {
      title: Cart,
    },
  },
  {
    name: Account,
    path: PathPages.Account,
    component: AccountView,
    meta: {
      title: Account,
    },
  },
  {
    name: 'Product',
    path: '/product/:slug',
    component: ProductView,
    props: true,
    meta: {
      title: 'Product page',
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const { authorized } = useUserStore();
  const isNeedRedirectToMain = authorized && (to.name === Login || to.name === Registration);
  const isNeedRedirectToLogin = !authorized && to.name === Account;

  if (isNeedRedirectToMain) {
    next(PathPages.Home);
  } else if (isNeedRedirectToLogin) {
    next(PathPages.Login);
  } else {
    document.title = `Crunch! ${to.meta.title}`;
    next();
  }
});

export default router;
