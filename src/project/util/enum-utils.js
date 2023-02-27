export function enumToCollections(theEnum) {
    const set = new Set();
    const array = [];
    Object.keys(theEnum).forEach(key => {
        set.add(key);
        array.push(key);
    });
    return [set, array];
}
