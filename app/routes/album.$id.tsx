import {ArtistLink} from '@/components/artist-link.tsx';
import {HomeLink} from '@/components/home-link.tsx';
import {useZero} from '@/hooks/use-zero.ts';
import {useQuery} from '@rocicorp/zero/react';
import {createFileRoute} from '@tanstack/react-router';

export const Route = createFileRoute('/album/$id')({
  ssr: false,
  component: RouteComponent,
});

function RouteComponent() {
  const {id} = Route.useParams();
  const z = useZero();
  const [album, result] = useQuery(
    z.query.album.where('id', id).one().related('artists'),
    {
      ttl: '1m',
    },
  );

  if (result.type === 'complete' && album === undefined) {
    return <div>Album not found</div>;
  }
  if (album === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <HomeLink />
      <h1>{album.title}</h1>
      <h2>
        {album.artists.map(artist => (
          <ArtistLink artist={artist} key={artist.id} />
        ))}
      </h2>
      <div>Votes: {album.votes}</div>
      <button onClick={() => z.mutate.upVote({id: album.id})}>👍</button>
      <button onClick={() => z.mutate.downVote({id: album.id})}>👎</button>
    </>
  );
}
