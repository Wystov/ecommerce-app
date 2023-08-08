import {
  createApiBuilderFromCtpClient,
  type ClientResponse,
  type CustomerSignInResult,
  type Customer,
} from '@commercetools/platform-sdk';
import type { UserAuthOptions } from '@commercetools/sdk-client-v2';
import type { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import { getClient } from './build-client';

const projectKey = import.meta.env.VITE_PROJECT_KEY;

export class ApiClient {
  private api: ByProjectKeyRequestBuilder;

  constructor(user?: UserAuthOptions) {
    this.api = this.newFlow(user);
  }

  public request(): ByProjectKeyRequestBuilder {
    return this.api;
  }

  private newFlow(user?: UserAuthOptions): ByProjectKeyRequestBuilder {
    return createApiBuilderFromCtpClient(getClient(user))
      .withProjectKey({ projectKey });
  }

  public async createCustomer(
    email: string,
    password: string,
  ): Promise<ClientResponse<CustomerSignInResult> | undefined> {
    try {
      const response = await this.api
        .customers()
        .post({ body: { email, password } })
        .execute();
      return response;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  public async signInCustomer(
    email: string,
    password: string,
  ): Promise<ClientResponse<Customer> | undefined> {
    const passwordFlowApi = this.newFlow({ username: email, password });
    try {
      const response = await passwordFlowApi
        .me()
        .get()
        .execute();
      if (response.statusCode === 200) {
        this.api = passwordFlowApi;
        return response;
      }
      throw new Error(JSON.stringify(response));
    } catch (error) {
      console.log(JSON.parse(error as string));
      return undefined;
    }
  }
}
