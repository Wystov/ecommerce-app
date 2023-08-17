enum NamePages {
  Home = 'Home',
  AboutUs = 'About us',
  Catalog = 'Catalog',
  Login = 'Login',
  Logout = 'Logout',
  Registration = 'Registration',
  NotFound = 'Not found',
}

const enum PathPages {
  Home = '/',
  AboutUs = '/about-us',
  Catalog = '/catalog',
  Login = '/login',
  Logout = '/',
  Registration = '/registration',
  NotFound = '/:pathMatch(.*)*',
}

const enum LocalStorageKeys {
  Token = 'ecommerce-shop: refresh',
  AnonId = 'ecommerce-shop: anonid',
}

export { NamePages, PathPages, LocalStorageKeys };
