import {
  PostgresJSConnection,
  PushProcessor,
  ZQLDatabase,
} from '@rocicorp/zero/pg';
import postgres from 'postgres';
import {schema} from '../schema.ts';
import {mutators} from '../shared/mutators.ts';

const processor = new PushProcessor(
  new ZQLDatabase(
    new PostgresJSConnection(postgres(process.env.ZERO_UPSTREAM_DB as string)),
    schema,
  ),
);

export async function handlePush(request: Request) {
  return processor.process(mutators, request);
}
