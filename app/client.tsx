import {mutators} from '@/mutators.ts';
import {schema} from '@/schema.ts';
import {Zero} from '@rocicorp/zero';
import {ZeroProvider} from '@rocicorp/zero/react';
import {StartClient} from '@tanstack/react-start';
import {hydrateRoot} from 'react-dom/client';
import {createRouter} from './router.tsx';

const router = createRouter();

const zero = new Zero({
  userID: 'anon',
  server: import.meta.env.VITE_PUBLIC_SERVER,
  schema,
  mutators,
});

hydrateRoot(
  document,
  <ZeroProvider zero={zero}>
    <StartClient router={router} />
  </ZeroProvider>,
);
