import {useQuery} from '@rocicorp/zero/react';
import {useZero} from './hooks/use-zero.ts';

export function Album({albumID}: {albumID: string}) {
  const z = useZero();

  const [album] = useQuery(
    z.query.album
      .where('id', albumID)
      .related('artists')
      .related('tracks', (q) =>
        q.orderBy('discNumber', 'asc').orderBy('position', 'asc'),
      )
      .one(),
    {
      ttl: '1m',
    },
  );

  return (
    <div>
      <h3>
        {album?.artists?.map((artist) => artist.name).join(', ')} -{' '}
        {album?.title}
      </h3>

      {album?.tracks.map((track) => (
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
