import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import type { UserAuthOptions } from '@commercetools/sdk-client-v2';
import type { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import type { DefaultAddressProps, UserSignUp, ApiResponse } from '@/types/types';
import { LocalStorageKeys } from '@/types/enums';
import { getClient } from './build-client';
import { authErrorHandler } from './error-handler';
import { handleUserData } from '../handle-signup-data';

const projectKey = import.meta.env.VITE_PROJECT_KEY;

class ApiClient {
  private api: ByProjectKeyRequestBuilder;

  constructor(user?: UserAuthOptions) {
    this.api = this.newFlow(user);
  }

  public call(): ByProjectKeyRequestBuilder {
    return this.api;
  }

  private newFlow(user?: UserAuthOptions): ByProjectKeyRequestBuilder {
    return createApiBuilderFromCtpClient(getClient(user)).withProjectKey({ projectKey });
  }

  public async createCustomer(data: UserSignUp, props: DefaultAddressProps): Promise<ApiResponse> {
    const body = handleUserData(data, props);
    try {
      await this.api.customers().post({ body }).execute();
      localStorage.removeItem(LocalStorageKeys.AnonId);
      return { ok: true };
    } catch (error) {
      return authErrorHandler(error);
    }
  }

  public async signInCustomer(user: UserAuthOptions): Promise<ApiResponse> {
    const passwordFlowApi = this.newFlow(user);
    try {
      await passwordFlowApi.me().get().execute();
      this.api = passwordFlowApi;
      return { ok: true };
    } catch (error) {
      return authErrorHandler(error);
    }
  }

  public async isEmailAvailable(email: string): Promise<ApiResponse> {
    const queryArgs = { where: `email="${email}"` };
    try {
      const { body } = await this.api.customers().get({ queryArgs }).execute();
      if (body.results.length) throw new Error('email not available');
      return { ok: true };
    } catch (error) {
      return authErrorHandler(error);
    }
  }

  public signOut(): void {
    this.api = this.newFlow();
  }
}

const api = new ApiClient();

export default api;
