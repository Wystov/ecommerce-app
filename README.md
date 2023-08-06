# eCommerce Application

eCommerce Application is a comprehensive online shopping portal that provides an interactive and seamless experience to users. In SPA format from product discovery to checkout, the application ensures a smooth journey for the user, enhancing their engagement and boosting their purchasing confidence.

### Key pages in the application include:

- Login and Registration pages
- Main page
- Catalog Product page
- Detailed Product page
- User Profile page
- Basket page
- About Us page

## Technology Overview

### Stack

- Language: [Typescript](https://www.typescriptlang.org/)
- Front-end: [Vue](https://vuejs.org)
  - Store: [Pinia](https://pinia.vuejs.org)
  - Routing: [Vue-router](https://router.vuejs.org)
- Back-end and database: [CommerceTools](https://commercetools.com)

### Utilities

- Linter: [ESLint](https://eslint.org) with [airbnb](https://www.npmjs.com/package/eslint-config-airbnb) style guide
- Formatter: [Prettier](https://prettier.io)
- Git-hook controller: [Husky](https://typicode.github.io/husky/)
- Test-framework: [Vitest](https://vitest.dev)
- Frontend-workshop: [Storybook](https://storybook.js.org)

## Run the project locally

To start working on the project on your local machine, please, make sure that you install [Git](https://git-scm.com/downloads) and [Node.js LTS](https://nodejs.org/en/download).

### Steps to start

- Clone [repository](https://github.com/Wystov/ecommerce-app)
- Run `npm install` or `npm i` to install all packages needed

If you'd like to see changes in the project right away, you can start dev-server by next steps:

- Run `npm run dev` to starts a local dev-server with [HMR](https://vitejs.dev/guide/features.html#hot-module-replacement) for development
- Press `o` to see the project in [Google Chrome](https://www.google.com/chrome/) or put `https://localhost:5173/` to the address bar of the preferable browser

### Available scripts

- `npm run dev` - run dev-server
- `npm run build-only` - build the project
- `npm run build` - build the project for production (with types check)
- `npm run build:dev` - build the project for development (add sourcemap, no minify, no types check)
- `npm run preview` - run builded project on dev-server
  (work correctly after run `npm run build` first)
- `npm run type-check` - run types check
- `npm run lint` - run eslint check with --fix
- `npm run format` - run formatting by prettier
- `npm run prepare` - enable Git hooks in automatically mode
- `test:unit` - run tests
- `npm run test-coverage` - run a table of coverage the project by tests in percentage
- `npm run storybook` - run storybook on `https://localhost:6006/`
- `npm run build-storybook` - build storybook for production
- `npm run init-msw` - initialize msw-library in the project


## Contributors

[Wystov](https://github.com/Wystov) | [Duxcoder](https://github.com/Duxcoder) | [CoracaoDoMundo](https://github.com/CoracaoDoMundo)

[RS school](https://rs.school)

