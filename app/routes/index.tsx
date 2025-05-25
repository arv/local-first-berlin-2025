import {ArtistLink} from '@/components/artist-link.tsx';
import {useZero} from '@/hooks/use-zero.ts';
import '@/index.css';
import type {schema} from '@/schema.ts';
import type {Row} from '@rocicorp/zero';
import {useQuery} from '@rocicorp/zero/react';
import {createFileRoute} from '@tanstack/react-router';
import {useState} from 'react';

export const Route = createFileRoute('/')({
  ssr: false,
  component: Home,
});

function Home() {
  return (
    <>
      <h1>ZTunes</h1>

      <div className="main-container">
        <AllAlbums />
        <TopTen />
      </div>
    </>
  );
}

function TopTen() {
  const z = useZero();
  const [topTen] = useQuery(
    z.query.album
      .where('votes', '>', 0)
      .related('artists')
      .orderBy('votes', 'desc')
      .limit(10),
    {ttl: '10m'},
  );

  return (
    <div className="top-ten">
      <h2>Top Ten Albums</h2>
      <div>
        {topTen.length > 0 ? (
          <AlbumArtistsAndVotes album={topTen[0]} />
        ) : (
          'None'
        )}
      </div>

      {topTen.slice(1).map(album => (
        <div key={album.id}>
          <AlbumArtistsAndVotes album={album} />
        </div>
      ))}
    </div>
  );
}

type AlbumRow = Row<typeof schema.tables.album>;
type ArtistRow = Row<typeof schema.tables.artist>;

function AlbumArtistsAndVotes({
  album,
}: {
  album: AlbumRow & {artists: readonly ArtistRow[]};
}) {
  return (
    <div className="top-ten-list">
      <span>{album.votes} votes</span> {album.title} &nbsp;-&nbsp;{' '}
      {commas(
        album.artists.map(artist => (
          <ArtistLink key={artist.id} artist={artist} />
        )),
      )}{' '}
    </div>
  );
}

// adds commas between items in an array
function commas<T>(array: T[]): (T | ', ')[] {
  return array.reduce(
    (acc, item, index) => {
      if (index > 0) {
        acc.push(', ');
      }
      acc.push(item);
      return acc;
    },
    [] as (T | ', ')[],
  );
}

function AllAlbums() {
  const z = useZero();
  const [textFilter, setTextFilter] = useState<string | null>(null);
  let q = z.query.artist
    .related('albums')
    .orderBy('sortName', 'asc')
    .limit(100 + 1);

  if (textFilter) {
    q = q.where('sortName', 'ILIKE', `%${textFilter}%`);
  }

  const [artists] = useQuery(q, {ttl: '1m'});

  return (
    <div className="album-search">
      <h2>All Albums</h2>
      <input
        type="text"
        value={textFilter ?? ''}
        onChange={e => setTextFilter(e.currentTarget.value)}
        placeholder="Search…"
        autoFocus={true}
      />
      <ul>
        {artists.slice(0, 100).map(artist => (
          <li>
            <ArtistLink artist={artist} />
          </li>
        ))}
        {artists.length > 100 && <li>And more...</li>}
      </ul>
    </div>
  );
}
