import {IdType} from '../types';

export function getNonNullProjections<T>(
  ids: IdType[],
  projectionFn: (id: IdType) => T | null,
): T[] {
  return ids
    .map(id => projectionFn(id))
    .filter(projection => projection !== null) as T[];
}
