import type {Transaction} from '@rocicorp/zero';
import type {Schema} from './schema.ts';

export const mutators = {
  async upVote(tx: Transaction<Schema>, id: string) {
    const album = await tx.query.album.where('id', id).one();
    if (!album) {
      throw new Error(`Album ${id} not found`);
    }
    await tx.mutate.album.update({id, votes: album.votes + 1});
  },
};

export type Mutators = typeof mutators;
