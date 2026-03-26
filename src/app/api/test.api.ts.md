# API Usage

## Client Side

```ts
import apiClient from '@/app/api/client';

apiClient
  .get('/users/me')
  .then((response) => {
    console.log(response.data);
  })
  .catch((err) => {
    console.error(err);
  });
```

## For Server side

```ts
import { createServerAxiosClient } from '@/app/api/serverClient';

const api = createServerAxiosClient();
let data = null;
let error = null;

try {
  const response = await api.get('/users/me');
  data = response.data;
} catch (err: any) {
  error = err.message;
}
```
