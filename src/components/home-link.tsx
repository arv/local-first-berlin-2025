import {Link} from './link.tsx';

export function HomeLink() {
  return (
    <Link href="/">
      <span className="home-link">&larr; Home</span>
    </Link>
  );
}
