import {
  ANYONE_CAN_DO_ANYTHING,
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
  })
  .primaryKey('id');

const track = table('track')
  .columns({
    id: string(),
    albumID: string().from('album_id'),
    position: number(),
    discNumber: number().from('disc_number').optional(),
    title: string(),
    duration: number().from('duration_ms').optional(),
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
  tracks: many({
    sourceField: ['id'],
    destField: ['albumID'],
    destSchema: track,
  }),
  artists: many({
    sourceField: ['artistID'],
    destField: ['id'],
    destSchema: artist,
  }),
}));

const trackRelations = relationships(track, ({many, one}) => ({
  album: one({
    sourceField: ['albumID'],
    destField: ['id'],
    destSchema: album,
  }),
  artists: many(
    {
      sourceField: ['albumID'],
      destField: ['id'],
      destSchema: album,
    },
    {
      sourceField: ['artistID'],
      destField: ['id'],
      destSchema: artist,
    },
  ),
}));

export const schema = createSchema({
  tables: [artist, album, track],

  relationships: [artistRelations, albumRelations, trackRelations],
});

export type Schema = typeof schema;

export const permissions = definePermissions(schema, () => ({
  artist: ANYONE_CAN_DO_ANYTHING,
  album: ANYONE_CAN_DO_ANYTHING,
  track: ANYONE_CAN_DO_ANYTHING,
}));
