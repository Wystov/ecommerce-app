import {
  ClientBuilder,
  type HttpMiddlewareOptions,
  type PasswordAuthMiddlewareOptions,
  type AnonymousAuthMiddlewareOptions,
  type UserAuthOptions,
  type Client,
} from '@commercetools/sdk-client-v2';

const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_SECRET;
const authUrl = import.meta.env.VITE_AUTH_URL;
const projectKey = import.meta.env.VITE_PROJECT_KEY;
const scopes = [import.meta.env.VITE_SCOPE];
const apiUrl = import.meta.env.VITE_API_URL;

async function fetcher(...args: Parameters<typeof fetch>): Promise<Response> {
  const response = await fetch(...args);
  const clone = response.clone();
  const token = await clone.json();

  localStorage.setItem('ecommerce-shop', token.refresh_token);

  return response;
}

const credentials = {
  clientId,
  clientSecret,
};

const baseAuthOptions = {
  host: authUrl,
  projectKey,
  scopes,
  fetch: fetcher,
};

const anonymousOptions: AnonymousAuthMiddlewareOptions = {
  ...baseAuthOptions,
  credentials: {
    ...credentials,
    anonymousId: `${Date.now()}-id`,
  },
};

const passwordOptions = (user: UserAuthOptions): PasswordAuthMiddlewareOptions => {
  const options: PasswordAuthMiddlewareOptions = {
    ...baseAuthOptions,
    credentials: {
      ...credentials,
      user,
    },
  };
  return options;
};

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: apiUrl,
  fetch,
};

export const getClient = (user?: UserAuthOptions): Client => {
  if (user) {
    return new ClientBuilder()
      .withPasswordFlow(passwordOptions(user))
      .withHttpMiddleware(httpMiddlewareOptions)
      .withLoggerMiddleware()
      .build();
  }
  return new ClientBuilder()
    .withAnonymousSessionFlow(anonymousOptions)
    .withHttpMiddleware(httpMiddlewareOptions)
    .withLoggerMiddleware()
    .build();
};
