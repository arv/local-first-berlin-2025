import {useQuery} from '@rocicorp/zero/react';
import {useZero} from './hooks/use-zero.ts';

export function Album({albumID}: {albumID: string}) {
  const z = useZero();

  const [album] = useQuery(
    z.query.album.where('id', albumID).related('artists').one(),
    {
      ttl: '1m',
    },
  );

  if (!album) {
    return null;
  }

  return (
    <div>
      <h3>
        {album.artists?.map((artist) => artist.name).join(', ')} - {album.title}
      </h3>

      <h2>Votes: {album.votes}</h2>
      <p>
        <button onClick={() => z.mutate.upVote({id: albumID})}>👍</button>
        <button onClick={() => z.mutate.downVote({id: albumID})}>👎</button>
      </p>
    </div>
  );
}
