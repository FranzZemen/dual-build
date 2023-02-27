export function enumToCollections (theEnum: any): [set: Set<string>, array: string[]] {
  const set = new Set<string>();
  const array: string[] = [];
  Object.keys(theEnum).forEach(key => {
    set.add(key);
    array.push(key);
  });
  return [set, array];
}

