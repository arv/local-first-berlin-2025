import {Zero} from '@rocicorp/zero';
import {ZeroProvider} from '@rocicorp/zero/react';
import {useState} from 'react';
import {Album} from './Album.tsx';
import './App.css';
import {Artist} from './Artist.tsx';
import {Artists} from './Artists.tsx';
import {schema} from './schema.ts';
import {mutators} from './shared/mutators.ts';

export function App() {
  const zero = new Zero({
    userID: 'anon',
    server: import.meta.env.VITE_PUBLIC_SERVER,
    schema,
    mutators,
  });

  return (
    <ZeroProvider zero={zero}>
      <Root />
    </ZeroProvider>
  );
}

function Root() {
  const [artistID, setArtistID] = useState<string | null>(null);
  const [albumID, setAlbumID] = useState<string | null>(null);

  return (
    <div className="app">
      <h1>Music</h1>
      {albumID ? (
        <Album albumID={albumID} />
      ) : artistID ? (
        <Artist artistID={artistID} onAlbumClick={setAlbumID} />
      ) : (
        <Artists onAlbumClick={setArtistID} />
      )}
    </div>
  );
}
