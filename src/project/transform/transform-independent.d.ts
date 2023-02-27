import { Transform } from './transform.js';
export type TransformIndependentConstructor<CLASS extends TransformIndependent<PIPED_IN>, PIPED_IN> = new (logDepth: number) => CLASS;
/**
 * Abstract class that enforces behavior such that:
 *
 * Derived classes consume pipeline payload (piped in):    false
 * Derived classes consume passed in payload (passed in):  false
 * Derived classes produce pipeline data (piped out):      false
 * Pipeline data is altered:                               false
 * Pipeline out = Pipeline in
 */
export declare abstract class TransformIndependent<PIPED_IN = any> extends Transform<undefined, PIPED_IN, PIPED_IN> {
    protected constructor(depth: number);
    execute(pipeIn: PIPED_IN, passedIn?: undefined): Promise<PIPED_IN>;
    protected executeImpl(pipeIn: PIPED_IN, passedIn: undefined): Promise<PIPED_IN>;
    protected abstract executeImplIndependent(): Promise<void>;
}
