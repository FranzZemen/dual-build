import { Transform } from './transform.js';
export type TransformPayloadConstructor<CLASS extends TransformPayload<PASSED_IN>, PASSED_IN> = new (logDepth: number) => CLASS;
/**
 * Abstract class that enforces behavior such that:
 *
 * Derived classes consume pipeline payload (piped in):    false
 * Derived classes consume passed in payload (passed in):  true
 * Derived classes produce pipeline data (piped out):      false
 * Pipeline data is altered:                               false
 * Pipeline out = Pipeline in
 */
export declare abstract class TransformPayload<PASSED_IN> extends Transform<PASSED_IN, undefined, void> {
    protected constructor(depth: number);
    execute(pipeIn: undefined, passedIn: PASSED_IN): Promise<void>;
    protected executeImpl(pipeIn: undefined, passedIn: PASSED_IN): Promise<void>;
    protected abstract executeImplPayload(payload: PASSED_IN): Promise<void>;
}
