<script lang="ts">
import { ApiClient } from './utils/api/client';

export default {
  mounted(): void {
    const api = new ApiClient();

    // anonymous flow
    api.request().get().execute();
    // api.createCustomer('124asdfadsf@asd.com', '123');

    // password flow
    // api.signInCustomer('124asdfadsf@asd.com', '123');
  },
};
</script>
