import {
  ANYONE_CAN,
  createSchema,
  definePermissions,
  number,
  relationships,
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

const album = table('album')
  .columns({
    id: string(),
    artistID: string().from('artist_id'),
    title: string(),
    year: number().optional(),
    votes: number(),
  })
  .primaryKey('id');

const artistRelations = relationships(artist, ({many}) => ({
  albums: many({
    sourceField: ['id'],
    destField: ['artistID'],
    destSchema: album,
  }),
}));

const albumRelations = relationships(album, ({many}) => ({
  artists: many({
    sourceField: ['artistID'],
    destField: ['id'],
    destSchema: artist,
  }),
}));

export const schema = createSchema({
  tables: [album, artist],
  relationships: [albumRelations, artistRelations],
});

export type Schema = typeof schema;

export const permissions = definePermissions(schema, () => ({
  artist: {row: {select: ANYONE_CAN}},
  album: {row: {select: ANYONE_CAN}},
}));
