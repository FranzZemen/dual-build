/*
Created by Franz Zemen 12/03/2022
License Type: MIT
*/
import { Log } from '../log/log.js';
import { processUnknownError } from '../util/process-unknown-error-message.js';
import { endTiming, startTiming } from '../util/timing.js';
/**
 * Abstract Transform class.  A Transform is a class that transforms data; data can be intrinsic (obtained by the class through internal means),
 * piped in (provided to the class by the starting Pipeline payload or by the previous Transform, SeriesPipe, or ParallelPipe piped out data, or
 * passed in directly when added to a Pipeline.
 *
 * The transform declares what kind of data it is sending down the Pipeline as output - this does not have to be the transformed data.
 */
export class Transform {
    depth;
    log;
    errorCondition = false;
    constructor(depth) {
        this.depth = depth;
        this.log = new Log(depth);
    }
    set logDepth(depth) {
        this.log.depth = depth;
    }
    get logDepth() {
        return this.log.depth;
    }
    get name() {
        return this.constructor.name;
    }
    async execute(pipe_in, passedIn) {
        const transformContext = this.transformContext(pipe_in, passedIn);
        const maxLineLength = 100;
        if (`transform ${this.name}${transformContext.length ? ' on ' + transformContext : ''} starting...`.length > maxLineLength) {
            this.log.info(`transform ${this.name}`);
            this.log.info(`  on ${transformContext} starting...`);
        }
        else {
            this.log.info(`transform ${this.name}${transformContext.length ? ' on ' + transformContext : ''} starting...`);
        }
        let startTimingSuccessful = true;
        const timingMark = `Timing ${Transform.name}:${transformContext}:${this.name}.execute`;
        try {
            startTimingSuccessful = startTiming(timingMark, this.log);
            return await this.executeImpl(pipe_in, passedIn);
        }
        catch (err) {
            return Promise.reject(processUnknownError(err, this.log));
        }
        finally {
            if (`...transform ${this.name}${transformContext.length ? ' on ' + transformContext : ''} ${this.errorCondition ? 'failed' : 'completed'}`.length > maxLineLength) {
                this.log.info(`...transform ${this.name}`, this.errorCondition ? 'error' : 'task-done');
                this.log.info(`  on ${transformContext} ${this.errorCondition ? 'failed' : 'completed'}  ${startTimingSuccessful ? endTiming(timingMark, this.log) : ''}`, this.errorCondition ? 'error' : 'task-done');
            }
            else {
                this.log.info(`...transform ${this.name}${transformContext.length ? ' on ' + transformContext : ''} ${this.errorCondition ? 'failed' : 'completed'} ${startTimingSuccessful ? endTiming(timingMark, this.log) : ''}`, this.errorCondition ? 'error' : 'task-done');
            }
        }
    }
}
