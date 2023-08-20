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

const enum Country {
  US = 'United States',
  GB = 'United Kingdom',
}

const enum InvalidMessage {
  Email = 'NB! Email address must contain a domain name and an "@" symbol.',
  Password = 'NB! Password must be at least 8 characters long and must contain at least one uppercase letter (A-Z), one lowercase letter (a-z) and one digit.',
  FirstName = 'First Name is not correct. Must contain at least one character and no special characters or numbers',
  LastName = 'Last Name is not correct. Must contain at least one character and no special characters or numbers',
  Date = 'Date of birth is not correct. A valid date input ensuring the user is above a certain age (e.g., 13 years old or older)',
  Street = 'Street is not correct. Must contain at least one character',
  City = 'City is not correct. Must contain at least one character and no special characters or numbers',
  PostalCode = 'Postal Code is not correct. Must follow the format for the country',
}

export {
  NamePages, PathPages, LocalStorageKeys, Country, InvalidMessage,
};
