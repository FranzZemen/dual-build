import { Directory } from '../../options/directories.js';
import { TransformPayloadIn } from '../transform-payload-in.js';
export type CreateDirectoryPayload = {
    directory: Directory;
    errorOnExists: boolean;
};
/**
 * Creates a directory asynchronously.  The piped in object is the root name or undefined.  If undefined, the path (relative or absolute) contained
 * in the Directory payload is used. If defined, that path is joined to the root path.
 */
export declare class CreateDirectory extends TransformPayloadIn<CreateDirectoryPayload, string | undefined> {
    constructor(logDepth: number);
    executeImplPayloadIn(root: string | undefined, directoryPayload: CreateDirectoryPayload): Promise<void>;
    transformContext(root: string | undefined, directoryPayload: CreateDirectoryPayload): string;
}
