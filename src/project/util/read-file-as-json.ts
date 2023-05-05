import {readFile} from "fs/promises";

export type isT<T> = (t: T | any) => t is T;

export function readFileAsJson<T>(filename: string, isT?: isT<T>): Promise<T> {
    return readFile(filename, {encoding: 'utf-8'})
        .then(fileContents => {
            const t =  JSON.parse(fileContents);
            if(isT) {
                if(!isT(t)) {
                    throw new Error(`File ${filename} is not of type ${isT.name}`);
                }
            }
            return t;
        });
}
