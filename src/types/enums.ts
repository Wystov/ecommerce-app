enum NamePages {
  Home = 'Home',
  AboutUs = 'About us',
  Catalog = 'Catalog',
  Login = 'Log in',
  Logout = 'Log out',
  Registration = 'Sign Up',
  NotFound = 'Not found',
  Account = 'Account',
  Cart = 'Cart',
}

const enum PathPages {
  Home = '/',
  AboutUs = '/about-us',
  Catalog = '/catalog',
  Login = '/login',
  Logout = '/',
  Registration = '/registration',
  NotFound = '/:pathMatch(.*)*',
  Account = '/account',
  Cart = '/cart',
}

const enum LocalStorageKeys {
  Token = 'ecommerce-shop: refresh',
  AnonId = 'ecommerce-shop: anonid',
}

const enum InvalidMessage {
  Email = 'NB! Email address must contain a domain name and an "@" symbol.',
  Password = 'NB! Password must be at least 8 characters long and must contain at least one uppercase letter (A-Z), one lowercase letter (a-z) and one digit.',
}

export {
  NamePages, PathPages, LocalStorageKeys, InvalidMessage,
};
