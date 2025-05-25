import {mutators} from '@/mutators';
import {schema} from '@/schema.ts';
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

export const APIRoute = createAPIFileRoute('/api/push')({
  GET: () => {
    return new Response('ok');
  },
  POST: async ({request}) => {
    const response = await processor.process(mutators, request);
    return Response.json(response);
  },
});
