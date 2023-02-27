import { TransformPayload } from '../transform-payload.js';
import { Transform } from '../transform.js';
export type DoubleDashFlag = `--${string}`;
export type DashFlag = `-${string}`;
export type Key = string | DashFlag | DoubleDashFlag;
export type Value = string;
export type KeyValueSep = `=` | ` = ` | ` ` | `  `;
export type KeyValuePair = `${Key}${KeyValueSep}${Value}`;
export type ExecArguments = (DoubleDashFlag | DashFlag | Value | KeyValuePair)[];
export declare function isDoubleDashFlag(flag: string | DoubleDashFlag): flag is DoubleDashFlag;
export declare function isDashFlag(flag: string | DashFlag): flag is DashFlag;
export declare function isKeyValuePair(kvp: string | KeyValuePair): kvp is KeyValuePair;
export type ExecutablePayload = {
    cwd?: string;
    executable: string;
    arguments: ExecArguments;
    batchTarget: boolean;
    synchronous: boolean;
};
export type ExexcutableTransformConstructor<CLASS extends Transform<ExecutableTransform, any, any>> = new (logDepth: number) => CLASS;
/**
 * The payload is either passed in or piped in, depending on which one extends/is ExecutablePayload
 */
export declare class ExecutableTransform extends TransformPayload<ExecutablePayload> {
    constructor(depth: number);
    protected executeImplPayload(payload: ExecutablePayload): Promise<void>;
    private processAsyncError;
    protected transformContext(pipeIn: any, payload: ExecutablePayload): string;
}
