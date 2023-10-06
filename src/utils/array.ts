import {FilterCondition} from '../types';

export function flatten<T>(arr: (T | T[])[]): T[] {
  let result: T[] = [];
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      result = result.concat(flatten(arr[i] as T[]));
    } else {
      result.push(arr[i] as T);
    }
  }
  return result;
}

export class ArrayFilters<T> {
  filters: FilterCondition<T>[];
  constructor(filters: FilterCondition<T>[]) {
    this.filters = filters;
  }
  apply(dataArray: T[]): T[] {
    let resultsArray = dataArray;
    this.filters.forEach((condition: FilterCondition<T>) => {
      resultsArray = resultsArray.filter(condition);
    });
    return resultsArray;
  }
}

export function uniqueBy<T, K>(array: T[], getKey: (item: T) => K): T[] {
  const seen = new Set<K>();
  return array.filter(item => {
    const key = getKey(item);
    if (!seen.has(key)) {
      seen.add(key);
      return true;
    }
    return false;
  });
}
