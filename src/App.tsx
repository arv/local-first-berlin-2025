import {Zero} from '@rocicorp/zero';
import {
  useQuery,
  useZero as useZeroWithTypeParams,
  ZeroProvider,
} from '@rocicorp/zero/react';
import {useState} from 'react';
import './App.css';
import {schema, type Schema} from './schema.ts';

// eslint-disable-next-line react-refresh/only-export-components
export const useZero = useZeroWithTypeParams<Schema>;

export function App() {
  const zero = new Zero({
    userID: 'anon',
    server: import.meta.env.VITE_PUBLIC_SERVER,
    schema,
  });

  return (
    <ZeroProvider zero={zero}>
      <Root />
    </ZeroProvider>
  );
}

function Root() {
  const [artistID, setArtistID] = useState<string | null>(null);
  const [albumID, setAlbumID] = useState<string | null>(null);

  const z = useZero();
  const q = z.query.album.where(
    'artistID',
    '69ee3720-a7cb-4402-b48d-a02c366f2bcf',
  );

  const [albums] = useQuery(q, {ttl: '1m'});
  console.log('albums', albums);

  return (
    <div className="app">
      <h1>Music</h1>
      {albumID ? (
        <Album albumID={albumID} />
      ) : artistID ? (
        <Albums artistID={artistID} onAlbumClick={setAlbumID} />
      ) : (
        <Artists onAlbumClick={setArtistID} />
      )}
    </div>
  );
}

function Artists({onAlbumClick}: {onAlbumClick?: (albumID: string) => void}) {
  const [textFilter, setTextFilter] = useState<string | null>(null);
  const z = useZero();
  let q = z.query.artist
    .related('albums')
    .orderBy('sortName', 'asc')
    .limit(1000);

  if (textFilter) {
    q = q.where('sortName', 'ILIKE', `%${textFilter}%`);
  }

  const [artists] = useQuery(q, {ttl: '1m'});

  return (
    <div>
      <input
        type="text"
        className="search-input"
        value={textFilter ?? ''}
        onChange={(e) => setTextFilter(e.currentTarget.value)}
        placeholder="Search…"
        autoFocus={true}
      />
      {artists.map((artist) => (
        <div key={artist.id} onClick={() => onAlbumClick?.(artist.id)}>
          {artist.name}
        </div>
      ))}
    </div>
  );
}

function Albums({
  artistID,
  onAlbumClick,
}: {
  artistID: string;
  onAlbumClick: (albumID: string) => void;
}) {
  const z = useZero();
  const q = z.query.album
    // .related('tracks')
    .where('artistID', artistID)
    .orderBy('year', 'asc');

  const [albums] = useQuery(q, {ttl: '1m'});

  return (
    <div>
      <h3>Albums {artistID}</h3>
      {albums.map((album) => (
        <div key={album.id} onClick={() => onAlbumClick(album.id)}>
          {album.title} ({album.year})
        </div>
      ))}
    </div>
  );
}

function Album({albumID}: {albumID: string}) {
  const z = useZero();
  const q = z.query.track
    .where('albumID', albumID)
    .orderBy('discNumber', 'asc')
    .orderBy('position', 'asc');
  const [tracks] = useQuery(q, {ttl: '1m'});
  const [album] = useQuery(z.query.album.where('id', albumID).one(), {
    ttl: '1m',
  });

  return (
    <div>
      <h3>Album {album?.title}</h3>
      {tracks.map((track) => (
        <div key={track.id}>
          <div>
            {track.discNumber} - {track.position} - {track.title}
            {track.duration ? ` (${track.duration}ms)` : ''}
          </div>
        </div>
      ))}
    </div>
  );
}
