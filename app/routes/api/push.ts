import {handlePush} from '@/server/push-handler.ts';
import {createAPIFileRoute} from '@tanstack/react-start/api';

export const APIRoute = createAPIFileRoute('/api/push')({
  GET: () => {
    return new Response('ok');
  },
  POST: async ({request}) => {
    const response = await handlePush(request);
    return Response.json(response);
  },
});
