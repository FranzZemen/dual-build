import { Log } from '../log/log.js';
export type TransformConstructor<CLASS extends Transform<any, any, any>> = new (logDepth: number) => CLASS;
/**
 * Abstract Transform class.  A Transform is a class that transforms data; data can be intrinsic (obtained by the class through internal means),
 * piped in (provided to the class by the starting Pipeline payload or by the previous Transform, SeriesPipe, or ParallelPipe piped out data, or
 * passed in directly when added to a Pipeline.
 *
 * The transform declares what kind of data it is sending down the Pipeline as output - this does not have to be the transformed data.
 */
export declare abstract class Transform<PASSED_IN, PIPED_IN, PIPE_OUT> {
    protected depth: number;
    protected log: Log;
    protected errorCondition: boolean;
    protected constructor(depth: number);
    set logDepth(depth: number);
    get logDepth(): number;
    get name(): string;
    execute(pipe_in: PIPED_IN, passedIn?: PASSED_IN): Promise<PIPE_OUT>;
    protected abstract executeImpl(pipeIn: PIPED_IN | undefined, passedIn?: PASSED_IN): Promise<PIPE_OUT>;
    protected abstract transformContext(pipeIn: PIPED_IN | undefined, passedIn?: PASSED_IN): string;
}
