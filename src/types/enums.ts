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
  Token = 'crunch-shop: refresh',
  AnonId = 'crunch-shop: anonid',
  Country = 'crunch-shop: country',
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
  NotMatch = 'Passwords are not similar',
  WrongPassword = 'Old password is incorrect, please, try again',
}

const enum Roles {
  Wystov = 'Team lead',
  Duxcoder = 'Second pilot',
  Coracao = 'The girl',
}

const enum Names {
  Wystov = 'Kostya',
  Duxcoder = 'Zhenya',
  Coracao = 'Anya',
}

const enum GHNicks {
  Wystov = '@Wystov',
  Duxcoder = '@Duxcoder',
  Coracao = '@CoracaoDoMundo',
}

const enum GHLinks {
  Wystov = 'https://github.com/Wystov',
  Duxcoder = 'https://github.com/Duxcoder',
  Coracao = 'https://github.com/CoracaoDoMundo',
}

const enum Bios {
  Wystov = 'The team lead really pushed and drove the development of the project, created an excellent design of the site, was each time putting together a puzzle of tasks completed by all team members and scrupulously checked and complement on each PR with very detailed and usuful remarks. It is safe to say that if not Kostya this project would never be possible.',
  Duxcoder = 'Zhenya invested in the development of the project to the maximum. Thanks to his focused and hard work, the project acquired Husky and Jest for tests, cool routing and registration form, error page, product page and much, much, much more. Zhenya delivered tasks quickly and efficiently, which helped keep all implementations on timeline.',
  Coracao = 'Came to frontend development after 13 years in car dealership marketing. Has the least knowlege level on the team, but comparable desire to make a great product and grow as a professional in her future profession. Thanks to Anya’s efforts, the project received a storybook and a user login page, several basic components, a task board and a user page, lazy loading and some other features.',
}

export {
  NamePages,
  PathPages,
  LocalStorageKeys,
  Country,
  InvalidMessage,
  Roles,
  Names,
  GHNicks,
  GHLinks,
  Bios,
};
