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
  - Store-library: [Pinia](https://pinia.vuejs.org)
  - Routing: [Vue-router](https://router.vuejs.org)
- Back-end and database: [CommerceTools](https://commercetools.com)

### Utilities

- Linter: [ESLint](https://eslint.org) [config-airbnb](https://www.npmjs.com/package/eslint-config-airbnb)
- Formatter: [Prettier](https://prettier.io)
- Git-hook controller: [Husky](https://typicode.github.io/husky/) 
- Test-framework: [Vitest](https://vitest.dev)
- Frontend-workshop: [Storybook](https://storybook.js.org)

## Run the project locally

To start working on the project on your local machine, please, make sure that you install version control system [Git](https://git-scm.com/downloads) and pre-built installer [Node.js LTS](https://nodejs.org/en/download).

### Steps to start

- Clone [repository](https://github.com/Wystov/ecommerce-app)
- Run `npm install` or `npm i` to install all packages needed
- Run `npm run prepare` to prepare Husky script to work

If you'd like to see changes in the project right away, you can start dev-server by next steps:

- Run `npm run dev` to starts a local dev-server with [HMR](https://vitejs.dev/guide/features.html#hot-module-replacement) for development
- Open `https://localhost:3000` in a preferable browser
