import {Link} from '@tanstack/react-router';

export function ArtistLink({id, name}: {id: string; name: string}) {
  return <Link to={`/artist/${id}`}>{name}</Link>;
}
