import {Zero} from '@rocicorp/zero';
import {ZeroProvider} from '@rocicorp/zero/react';
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router';
import type {ReactNode} from 'react';
import {DefaultCatchBoundary} from '~/components/DefaultCatchBoundary';
import {NotFound} from '~/components/NotFound';
import appCss from '~/styles/app.css?url';
import {schema} from '../schema.js';

export const Route = createRootRoute({
  ssr: false,
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
    ],
    links: [{rel: 'stylesheet', href: appCss}],
  }),
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    );
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({children}: {children: ReactNode}) {
  const zero = new Zero({
    userID: 'anon',
    server: import.meta.env.VITE_PUBLIC_SERVER,
    schema,
  });

  return (
    <ZeroProvider zero={zero}>
      <html>
        <head>
          <HeadContent />
        </head>
        <body>
          {children}
          <Scripts />
        </body>
      </html>
    </ZeroProvider>
  );
}
