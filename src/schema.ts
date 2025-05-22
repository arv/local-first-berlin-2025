import {
  ANYONE_CAN_DO_ANYTHING,
  createSchema,
  definePermissions,
  number,
  string,
  table,
} from '@rocicorp/zero';

const artist = table('artist')
  .columns({
    id: string(),
    name: string(),
    sortName: string().from('sort_name'),
    type: string(),
    beginDate: number().from('begin_date'),
    endDate: number().from('end_date'),
  })
  .primaryKey('id');

export const schema = createSchema({
  tables: [artist],

  relationships: [],
});

export type Schema = typeof schema;

export const permissions = definePermissions(schema, () => ({
  artist: ANYONE_CAN_DO_ANYTHING,
}));
