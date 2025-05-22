import {useQuery} from '@rocicorp/zero/react';
import {useZero} from './hooks/use-zero.ts';

export function Artist({
  artistID,
  onAlbumClick,
}: {
  artistID: string;
  onAlbumClick: (albumID: string) => void;
}) {
  const z = useZero();
  const q = z.query.artist
    .related('albums', (q) => q.orderBy('year', 'asc'))
    .where('id', artistID)
    .one();

  const [artist] = useQuery(q, {ttl: '1m'});

  return (
    <div>
      <h2>{artist?.name}</h2>
      <h3>Albums </h3>
      {artist?.albums.map((album) => (
        <div key={album.id} onClick={() => onAlbumClick(album.id)}>
          {album.title} ({album.year})
        </div>
      ))}
    </div>
  );
}
