import {Link} from '@tanstack/react-router';

export function AlbumLink({id, title}: {id: string; title: string}) {
  return <Link to={`/album/${id}`}>{title}</Link>;
}
