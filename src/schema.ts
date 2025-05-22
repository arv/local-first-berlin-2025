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

const artistAlbum = relationships(artist, ({many}) => ({
  albums: many({
    sourceField: ['id'],
    destField: ['artistID'],
    destSchema: album,
  }),
}));

const albumTrack = relationships(album, ({many}) => ({
  tracks: many({
    sourceField: ['id'],
    destField: ['albumID'],
    destSchema: track,
  }),
}));

export const schema = createSchema({
  tables: [artist, album, track],

  relationships: [artistAlbum, albumTrack],
});

export type Schema = typeof schema;

export const permissions = definePermissions(schema, () => ({
  artist: ANYONE_CAN_DO_ANYTHING,
  album: ANYONE_CAN_DO_ANYTHING,
  track: ANYONE_CAN_DO_ANYTHING,
}));
