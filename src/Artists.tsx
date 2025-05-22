import {useQuery} from '@rocicorp/zero/react';
import {useState} from 'react';
import {useZero} from './hooks/use-zero.ts';

export function Artists({
  onAlbumClick,
}: {
  onAlbumClick?: (albumID: string) => void;
}) {
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
