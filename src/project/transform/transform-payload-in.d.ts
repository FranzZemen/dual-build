import { Transform } from './transform.js';
export type TransformPayloadInConstructor<CLASS extends TransformPayloadIn<PASSED_IN, PIPE_IN>, PASSED_IN, PIPE_IN> = new (logDepth: number) => CLASS;
/**
 * Abstract class that enforces behavior such that:
 *
 * Derived classes consume pipeline payload (piped in):    true
 * Derived classes consume passed in payload (passed in):  true
 * Derived classes produce pipeline data (piped out):      false
 * Pipeline data is altered:                               false
 * Pipeline out = Pipeline in
 */
export declare abstract class TransformPayloadIn<PASSED_IN, PIPE_IN> extends Transform<PASSED_IN, PIPE_IN, PIPE_IN> {
    protected constructor(depth: number);
    execute(pipeIn: PIPE_IN, passedIn?: PASSED_IN): Promise<PIPE_IN>;
    protected executeImpl(pipeIn: PIPE_IN, passedIn: PASSED_IN): Promise<PIPE_IN>;
    protected abstract executeImplPayloadIn(pipeIn: PIPE_IN, passedIn: PASSED_IN): Promise<void>;
}
