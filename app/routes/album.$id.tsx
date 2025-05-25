import {ArtistLink} from '@/components/artist-link.tsx';
import {HomeLink} from '@/components/home-link.tsx';
import type {Mutators} from '@/mutators.ts';
import type {Schema} from '@/schema.ts';
import {useQuery, useZero} from '@rocicorp/zero/react';
import {createFileRoute} from '@tanstack/react-router';

export const Route = createFileRoute('/album/$id')({
  ssr: false,
  component: RouteComponent,
});

function RouteComponent() {
  const {id} = Route.useParams();
  const z = useZero<Schema, Mutators>();
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
      <button onClick={() => z.mutate.upVote(album.id)}>👍</button>
    </>
  );
}
