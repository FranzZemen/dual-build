import { Transform } from './transform.js';
export type TransformInOutConstructor<CLASS extends TransformInOut<PIPE_IN, PIPE_OUT>, PIPE_IN, PIPE_OUT> = new (logDepth: number) => CLASS;
/**
 * Abstract class that enforces behavior such that:
 *
 * Derived classes consume pipeline payload (piped in):    true
 * Derived classes consume passed in payload (passed in):  false
 * Derived classes produce pipeline data (piped out):      true
 * Pipeline data is altered:                               true
 * Pipeline out = Derived class out
 *
 */
export declare abstract class TransformInOut<PIPE_IN, PIPE_OUT> extends Transform<undefined, PIPE_IN, PIPE_OUT> {
    protected constructor(depth: number);
    execute(payload: PIPE_IN, passedIn?: undefined): Promise<PIPE_OUT>;
    protected executeImpl(pipeIn: PIPE_IN, passedIn?: undefined): Promise<PIPE_OUT>;
    protected abstract executeImplInOut(pipedIn: PIPE_IN): Promise<PIPE_OUT>;
}
