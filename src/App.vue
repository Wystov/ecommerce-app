<script lang="ts">
import { ApiClient } from './utils/api/client';

export default {
  mounted(): void {
    const api = new ApiClient();

    // anonymous flow
    api.call().get().execute();
    // api.createCustomer('12467asdfadsf@asd.com', '123');

    // password flow
    // api.signInCustomer('1246asdfadsf@asd.com', '123');
  },
};
</script>
