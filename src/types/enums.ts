enum NamePages {
  Home = 'Home',
  AboutUs = 'About us',
  Catalog = 'Catalog',
  Login = 'Login',
  Logout = 'Logout',
  Registration = 'Registration',
}

const enum PathPages {
  Home = '/',
  AboutUs = '/about-us',
  Catalog = '/catalog',
  Login = '/login',
  Logout = '/',
  Registration = '/registration',
}

const enum LocalStorageKeys {
  Token = 'ecommerce-shop: refresh',
  AnonId = 'ecommerce-shop: anonid',
}

const enum Country {
  US = 'United States',
  GB = 'United Kingdom',
}

export {
  NamePages, PathPages, LocalStorageKeys, Country,
};
