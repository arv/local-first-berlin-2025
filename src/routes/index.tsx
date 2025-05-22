import {createFileRoute} from '@tanstack/react-router';
import {useZero} from '../hooks/use-zero.js';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  const z = useZero();
  return (
    <div className="p-2">
      <h3>Zero version: {z.version}!!!</h3>
    </div>
  );
}
