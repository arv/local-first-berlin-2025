import {Zero} from '@rocicorp/zero';
import {ZeroProvider} from '@rocicorp/zero/react';
import {createFileRoute} from '@tanstack/react-router';
import {useZero} from '../hooks/use-zero.js';
import {schema} from '../schema.js';

export const Route = createFileRoute('/')({
  ssr: false,
  component: Home,
});

function Home() {
  const zero = new Zero({
    userID: 'anon',
    server: import.meta.env.VITE_PUBLIC_SERVER,
    schema,
  });

  return (
    <ZeroProvider zero={zero}>
      <Root />
    </ZeroProvider>
  );
}

function Root() {
  const z = useZero();
  return (
    <div className="p-2">
      <h3>Zero version: {z.version}!!!</h3>
    </div>
  );
}
