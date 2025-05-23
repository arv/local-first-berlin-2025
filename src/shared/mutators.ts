import type {Transaction} from '@rocicorp/zero';
import type {Schema} from '../schema.ts';

export const mutators = {
  async upVote(tx: Transaction<Schema>, {id}: {id: string}) {
    console.log('upVote', id);
    await change(tx, id, 1);
  },
  async downVote(tx: Transaction<Schema>, {id}: {id: string}) {
    console.log('downVote', id);
    await change(tx, id, -1);
  },
};

async function change(tx: Transaction<Schema>, id: string, delta: number) {
  const album = await tx.query.album.where('id', id).one();
  if (!album) {
    throw new Error(`Album ${id} not found`);
  }
  if (album.votes + delta < 0) {
    throw new Error(`Album ${id} votes cannot be negative`);
  }
  tx.mutate.album.update({id, votes: album.votes + delta});
}

export type Mutators = typeof mutators;
