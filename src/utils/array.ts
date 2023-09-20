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
