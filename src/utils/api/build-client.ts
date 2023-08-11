import {
  ClientBuilder,
  type HttpMiddlewareOptions,
  type PasswordAuthMiddlewareOptions,
  type AnonymousAuthMiddlewareOptions,
  type UserAuthOptions,
  type Client,
  type RefreshAuthMiddlewareOptions,
} from '@commercetools/sdk-client-v2';
import type { TokenResponse } from '@/types/types';
import { LocalStorageKeys } from '@/types/enums';

const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_SECRET;
const authUrl = import.meta.env.VITE_AUTH_URL;
const projectKey = import.meta.env.VITE_PROJECT_KEY;
const scopes = [import.meta.env.VITE_SCOPE];
const apiUrl = import.meta.env.VITE_API_URL;

async function fetcher(...args: Parameters<typeof fetch>): Promise<Response> {
  const response = await fetch(...args);
  const clone = response.clone();
  const data: TokenResponse = await clone.json();

  if (data.refresh_token) localStorage.setItem(LocalStorageKeys.Token, data.refresh_token);

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

const getAnonymousOptions = (): AnonymousAuthMiddlewareOptions => {
  const options: AnonymousAuthMiddlewareOptions = {
    ...baseAuthOptions,
    credentials: {
      ...credentials,
      anonymousId: `${Date.now()}-id`,
    },
  };
  const { anonymousId } = options.credentials;
  if (anonymousId) localStorage.setItem(LocalStorageKeys.AnonId, anonymousId);
  return options;
};

const getPasswordOptions = (user: UserAuthOptions): PasswordAuthMiddlewareOptions => {
  const options: PasswordAuthMiddlewareOptions = {
    ...baseAuthOptions,
    credentials: {
      ...credentials,
      user,
    },
  };
  return options;
};

const getRefreshOptions = (refreshToken: string): RefreshAuthMiddlewareOptions => {
  const options: RefreshAuthMiddlewareOptions = {
    ...baseAuthOptions,
    credentials,
    refreshToken,
  };
  return options;
};

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: apiUrl,
  fetch,
};

export const getClient = (user?: UserAuthOptions): Client => {
  const refreshToken = localStorage.getItem(LocalStorageKeys.Token);
  const api = new ClientBuilder();
  if (user) {
    api.withPasswordFlow(getPasswordOptions(user));
  } else if (typeof refreshToken === 'string') {
    api.withRefreshTokenFlow(getRefreshOptions(refreshToken));
  } else {
    api.withAnonymousSessionFlow(getAnonymousOptions());
  }
  return api.withHttpMiddleware(httpMiddlewareOptions).build();
};
