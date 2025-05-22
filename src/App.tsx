import {Zero} from '@rocicorp/zero';
import {
  useQuery,
  useZero as useZeroWithTypeParams,
  ZeroProvider,
} from '@rocicorp/zero/react';
import './App.css';
import {schema, type Schema} from './schema.ts';

// eslint-disable-next-line react-refresh/only-export-components
export const useZero = useZeroWithTypeParams<Schema>;

export function App() {
  const zero = new Zero({
    userID: 'anon',
    server: import.meta.env.VITE_PUBLIC_SERVER,
    schema,
  });

  return (
    <ZeroProvider zero={zero}>
      <div style={{display: 'flex', flexDirection: 'row'}}>
        {/* <Artists /> */}
        <Artists />
      </div>
    </ZeroProvider>
  );
}

function Artists() {
  const z = useZero();
  const [artists] = useQuery(
    z.query.artist
      .where('beginDate', 'IS NOT', null)
      .limit(1000)
      .orderBy('sortName', 'asc'),
    {ttl: '1m'},
  );
  return (
    <div>
      {artists.map((artist) => (
        <div key={artist.id}>
          {artist.name} - {artist.type}-{' '}
          {artist.beginDate && new Date(artist.beginDate).getFullYear()} -
          {artist.endDate && new Date(artist.endDate).getFullYear()}
        </div>
      ))}
    </div>
  );
}
