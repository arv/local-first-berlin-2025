import {HomeLink} from '@/components/home-link.tsx';
import {useZero} from '@/hooks/use-zero.ts';
import {useQuery} from '@rocicorp/zero/react';
import {createFileRoute} from '@tanstack/react-router';

export const Route = createFileRoute('/artist/$id')({
  ssr: false,
  component: RouteComponent,
});

function RouteComponent() {
  const {id} = Route.useParams();
  const z = useZero();
  const [artist, result] = useQuery(
    z.query.artist
      .where('id', id)
      .one()
      .related('albums', q => q.orderBy('year', 'asc')),
    {ttl: '1m'},
  );

  if (result.type === 'complete' && artist === undefined) {
    return <div>Artist not found</div>;
  }
  if (artist === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <HomeLink />
      <h2>{artist.name}</h2>
      <h2>Albums</h2>
      <ul>
        {artist.albums?.map(album => (
          <li key={album.id}>
            {album.title} ({album.year}) votes: {album.votes}{' '}
            <button onClick={() => z.mutate.upVote(album.id)}>👍</button>
          </li>
        ))}
      </ul>
    </>
  );
}
