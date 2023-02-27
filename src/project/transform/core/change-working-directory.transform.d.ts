import { TransformIn } from '../transform-in.js';
export type ChangeWorkingDirectoryPayload = {
    rootPath: string;
};
export declare class ChangeWorkingDirectory extends TransformIn<string> {
    constructor(logDepth: number);
    executeImplIn(rootDirectorPath: string): Promise<void>;
    transformContext(rootDirectoryPath: string): string;
}
