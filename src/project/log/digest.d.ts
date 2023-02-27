export type DigestEntry = {
    uuid: string;
    timestamp: string;
    entry: string;
    data?: object;
};
export declare class Digest {
    protected filename: string;
    constructor(filename: string);
    digest(timestamp: Date, entry: string, data?: object): void;
}
