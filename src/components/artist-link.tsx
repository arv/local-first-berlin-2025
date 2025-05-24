import {Link} from './link.tsx';

export function ArtistLink({artist}: {artist: {id: string; name: string}}) {
  return <Link href={`/artist/${artist.id}`}>{artist.name}</Link>;
}
