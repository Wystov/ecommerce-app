import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import type { UserAuthOptions } from '@commercetools/sdk-client-v2';
import type { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import router from '@/router/index';
import { getClient } from './build-client';

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
    return createApiBuilderFromCtpClient(getClient(user)).withProjectKey({ projectKey });
  }

  public async createCustomer(email: string, password: string): Promise<void> {
    try {
      const response = await this.api.customers().post({ body: { email, password } }).execute();
      if (response.statusCode === 201) {
        this.signInCustomer(email, password);
      }
    } catch (error) {
      console.log(error);
    }
  }

  public async signInCustomer(email: string, password: string): Promise<void> {
    const passwordFlowApi = this.newFlow({ username: email, password });
    try {
      const response = await passwordFlowApi.me().get().execute();
      if (response.statusCode === 200) {
        this.api = passwordFlowApi;
        router.push('/');
      }
    } catch (error) {
      console.log(error);
    }
  }
}
