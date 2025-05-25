```ts
// api/push.ts

import {schema} from '@/schema.ts';
import {mutators} from '@/shared/mutators.ts';
import {
  PostgresJSConnection,
  PushProcessor,
  ZQLDatabase,
} from '@rocicorp/zero/pg';
import {createAPIFileRoute} from '@tanstack/react-start/api';
import postgres from 'postgres';

const processor = new PushProcessor(
  new ZQLDatabase(
    new PostgresJSConnection(postgres(process.env.ZERO_UPSTREAM_DB as string)),
    schema,
  ),
);

export async function handlePush(request: Request) {
  return processor.process(mutators, request);
}

export const APIRoute = createAPIFileRoute('/api/push')({
  GET: () => {
    return new Response('ok');
  },
  POST: async ({request}) => {
    const response = await handlePush(request);
    return Response.json(response);
  },
});
```

```ts
// src/mutators.ts
import type {Transaction} from '@rocicorp/zero';
import type {Schema} from './schema.ts';

export const mutators = {
  async upVote(tx: Transaction<Schema>, id: string) {
    // implement me
  },
};

export type Mutators = typeof mutators;
```
