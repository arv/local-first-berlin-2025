import '@/index.css';
import {createFileRoute} from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  ssr: false,
  component: Home,
});

function Home() {
  return (
    <>
      <h2>Zero Music</h2>
    </>
  );
}
