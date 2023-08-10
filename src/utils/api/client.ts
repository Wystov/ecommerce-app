import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import type { UserAuthOptions } from '@commercetools/sdk-client-v2';
import type { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import type { UserSignUp } from '@/types/types';
import { LocalStorageKeys } from '@/types/enums';
import { getClient } from './build-client';
import { authErrorHandler } from './error-handler';
import { handleUserData } from '../handle-signup-data';

const projectKey = import.meta.env.VITE_PROJECT_KEY;

export class ApiClient {
  private api: ByProjectKeyRequestBuilder;

  constructor(user?: UserAuthOptions) {
    this.api = this.newFlow(user);
  }

  public call(): ByProjectKeyRequestBuilder {
    return this.api;
  }

  private newFlow(user?: UserAuthOptions): ByProjectKeyRequestBuilder {
    return createApiBuilderFromCtpClient(getClient(user))
      .withProjectKey({ projectKey });
  }

  public async createCustomer(data: UserSignUp): Promise<string> {
    const { user, userFullData } = handleUserData(data);
    try {
      await this.api
        .customers()
        .post({ body: userFullData })
        .execute();
      localStorage.removeItem(LocalStorageKeys.AnonId);
      await this.signInCustomer(user);
      return 'ok';
    } catch (error) {
      return authErrorHandler(error);
    }
  }

  public async signInCustomer(user: UserAuthOptions): Promise<string> {
    const passwordFlowApi = this.newFlow(user);
    try {
      await passwordFlowApi.me().get().execute();
      this.api = passwordFlowApi;
      return 'ok';
    } catch (error) {
      return authErrorHandler(error);
    }
  }
}
