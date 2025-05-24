import {Link} from './link.tsx';

export function AlbumLink({album}: {album: {id: string; title: string}}) {
  return <Link href={`/album/${album.id}`}>{album.title}</Link>;
}
