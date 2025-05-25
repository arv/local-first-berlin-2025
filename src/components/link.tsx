import {useNavigate} from '@tanstack/react-router';
import type {KeyboardEvent, MouseEvent, ReactNode} from 'react';

export function Link({href, children}: {href: string; children: ReactNode}) {
  const navigate = useNavigate();
  const handleMouseDown = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    navigate({href});
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLAnchorElement>) => {
    // In html links are not activated by space key, but we want to it to be
    // more consistent with buttons, especially since it is hard to determine
    // what is a link vs a button in our UI.

    if (e.key === 'Enter' || e.key === ' ') {
      navigate({href});
      e.preventDefault();
    }
  };

  return (
    <a href={href} onMouseDown={handleMouseDown} onKeyDown={handleKeyDown}>
      {children}
    </a>
  );
}
