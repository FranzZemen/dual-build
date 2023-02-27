import { Directory, Options } from '../../options/index.js';
import { TransformPayload } from '../transform-payload.js';
export type SaveOptionsPayload = Options & {
    directory: Directory;
};
export declare class SaveOptionsTransform extends TransformPayload<SaveOptionsPayload> {
    constructor(depth: number);
    protected executeImplPayload(payload: SaveOptionsPayload): Promise<void>;
    transformContext(_undefined: undefined, payload?: SaveOptionsPayload): string;
}
