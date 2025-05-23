import type {ReadonlyJSONValue} from '@rocicorp/zero';
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

export async function handlePush(
  params: Record<string, string> | URLSearchParams,
  body: ReadonlyJSONValue,
) {
  return processor.process(mutators, params, body);
}
