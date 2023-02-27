import { Transform } from './transform.js';
export type TransformInConstructor<CLASS extends TransformIn<PIPE_IN>, PIPE_IN> = new (logDepth: number) => CLASS;
/**
 * Abstract class that enforces behavior such that:
 *
 * Derived classes consume pipeline payload (piped in):    true
 * Derived classes consume passed in payload (passed in):  false
 * Derived classes produce pipeline data (piped out):      false
 * Pipeline data is altered:                               false
 * Pipeline out is = Pipeline In
 *
 * The pipeline data out (piped out) is simply what was piped in.  Thus pipeline data is not impacted.
 * piped in data.
 *
 * If paylo@ad is passed in, it is ignored.
 */
export declare abstract class TransformIn<PIPED_IN> extends Transform<undefined, PIPED_IN, PIPED_IN> {
    protected constructor(depth: number);
    execute(pipeIn: PIPED_IN, passedIn?: undefined): Promise<PIPED_IN>;
    protected executeImpl(pipeIn: PIPED_IN, passedIn: undefined): Promise<PIPED_IN>;
    protected abstract executeImplIn(pipedIn: PIPED_IN): Promise<void>;
}
