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
  Wystov = 'With a decade of experience in the automotive industry, took a sharp career turn in December 2022, diving headlong into the world of web development at the Rolling Scopes School. Armed with zero prior experience in the field, Kostya dedicated over 1000 hours to gaining valuable knowledge, honing skills and creating digital solutions that bring ideas to life. The team lead really pushed and drove the development of the project by scrupulously checking and complementing each PR with very detailed and useful remarks. Kostya gave to the project base configuration, created an excellent design of the site, product catalog page, customer basket and so on and so on.',
  Duxcoder = 'Mechanical engineer by training. Christian by religion. Programmer by vocation. Zhenya broke into frontend developing in mid-2022 and to this day he is moving forward to achieve the goal of becoming a specialist, mastering technology after technology. Zhenya  definitely invested in the development of the project to the maximum. Thanks to his focused and hard work, the project acquired Husky and Jest for tests, cool routing and registration form, error page, product page and much, much, much more. Zhenya delivered tasks quickly and efficiently, which helped keep all implementations on timeline.',
  Coracao = 'Came to frontend development after 13 years in car dealership marketing in 2022 inspired by a possibility to change her life and work tracks and forced by the political situation around. In the beginning of the study process Anya has no  any particular knowledges in the frontend field, but she changed this situation quickly and continue to change it daily with a strong desire to make a great product here and now and grow as a professional in her future profession. Thanks to Anya’s efforts, the project received a storybook and a user login page, several basic components, a task board and a user page, lazy loading and some other features.',
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
