import {useZero as useZeroWithParams} from '@rocicorp/zero/react';
import type {Schema} from '../schema.js';
import type {Mutators} from '../shared/mutators.js';

export const useZero = useZeroWithParams<Schema, Mutators>;
