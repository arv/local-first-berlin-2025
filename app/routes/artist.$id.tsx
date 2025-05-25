import {HomeLink} from '@/components/home-link.tsx';
import type {Mutators} from '@/mutators.ts';
import type {Schema} from '@/schema.ts';
import {useQuery, useZero} from '@rocicorp/zero/react';
import {createFileRoute} from '@tanstack/react-router';

export const Route = createFileRoute('/artist/$id')({
  ssr: false,
  component: RouteComponent,
});

function RouteComponent() {
  const {id} = Route.useParams();
  const z = useZero<Schema, Mutators>();
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
      <h1>{artist.name}</h1>
      <h2>Albums</h2>
      <ul>
        {artist.albums?.map(album => (
          <li className="artist-page-album-detail" key={album.id}>
            {album.title} <span className="album-year">({album.year})</span>{' '}
            <span className="votes-count-large">{album.votes} votes</span>{' '}
            <button
              onClick={() => z.mutate.upVote(album.id)}
              className="thumbs-up-button"
            >
              <i className="thumbs-up-icon">&#128077;</i>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
