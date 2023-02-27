/*
Created by Franz Zemen 12/15/2022
License Type: MIT
*/
import { v4 as uuidV4 } from 'uuid';
import { Log } from '../../log/log.js';
import { BuildError, BuildErrorNumber } from '../../util/index.js';
import { processUnknownError } from '../../util/process-unknown-error-message.js';
import { clearTiming, endTiming, startTiming } from '../../util/timing.js';
import { ParallelPipe } from './parallel-pipe.js';
import { SeriesPipe } from './series-pipe.js';
import { TransformPipe } from './transform-pipe.js';
export function defaultPipelineOptions() {
    return {
        name: `Pipeline-${uuidV4()}`,
        logDepth: 0
    };
}
/**
 * PIPELINE_SERIES_AND_PIPE_IN = The payload starting the pipeline
 * PIPELINE_OUT = The payload coming out of the pipeline (by default the payload remains the same throughout
 */
export class Pipeline {
    static index = 1;
    log;
    name;
    //logDepth: number;
    _pipes = [];
    constructor(options) {
        this.name = options.name;
        //this.logDepth = gitOptions.logDepth;
        this.log = new Log(options.logDepth);
    }
    /**
     * If this is not called, the defaultOptions function will be use.
     *
     * @param options
     */
    static options(options) {
        if (options === undefined) {
            options = defaultPipelineOptions();
        }
        return new Pipeline(options);
    }
    /**
     * Execute a single Transform
     *
     * By default, the pipeline payload flows without altereration, so unless a pipeline element changed the payload upstream or the transform changes
     * the output, the transform payload stays the same as the pipeline.  Otherwise the appropriate template types must be supplied
     *
     */
    transform(transformClass, passedIn) {
        // ----- Declaration separator ----- //
        this._pipes.push(TransformPipe.transform(transformClass, this, passedIn));
        return this;
    }
    ;
    transforms(transformClasses, passedIns) {
        if (Array.isArray(transformClasses)) {
            if (passedIns) {
                if (Array.isArray(passedIns)) {
                    // Size of arrays must match, we are still 1:1 not mxn.
                    if (transformClasses.length === passedIns.length) {
                        return transformClasses.reduce((previousValue, currentValue, currentIndex) => {
                            return previousValue.transform(currentValue, passedIns[currentIndex]);
                        }, this);
                    }
                    else {
                        throw new Error('transforms:  transform classes array and payload array do not match');
                    }
                }
                else {
                    return transformClasses.reduce((previousValue, currentValue) => {
                        return previousValue.transform(currentValue, passedIns);
                    }, this);
                }
            }
            else {
                return transformClasses.reduce((previousValue, currentValue) => {
                    return previousValue.transform(currentValue);
                }, this);
            }
        }
        else {
            if (passedIns) {
                if (Array.isArray(passedIns)) {
                    return passedIns.reduce((previousValue, currentValue) => {
                        return previousValue.transform(transformClasses, currentValue);
                    }, this);
                }
                else {
                    return this.transform(transformClasses, passedIns);
                }
            }
            else {
                return this.transform(transformClasses);
            }
        }
    }
    /**
     * Start a series of transforms.  Default is for the pipeline payload to be maintained (not altered)
     */
    startSeries(transformClass, passedIn) {
        // ----- Declaration separator ----- //
        const seriesPipe = SeriesPipe.start(transformClass, this, passedIn);
        this._pipes.push(seriesPipe);
        return seriesPipe;
    }
    ;
    /**
     * Continue the series, by default with the pipeline payload
     */
    series(transformClasses, passedIns) {
        return transformClasses.reduce((previousValue, currentValue, currentIndex) => {
            // Even though ArrayTwoOrMore guards minimum length from a type perspective, let's put in a run time check.  We have to match lengths between
            // Arrays anyway
            if (transformClasses.length != passedIns.length) {
                throw new Error('Array lengths do not match');
            }
            else if (passedIns.length < 2) {
                throw new Error('Minimum array length is 2 for a series');
            }
            if (previousValue === undefined) {
                return this.startSeries(currentValue, passedIns[currentIndex]);
            }
            else if (currentIndex === passedIns?.length - 1) {
                return previousValue.endSeries(currentValue, passedIns[currentIndex]);
            }
            else {
                return previousValue.series(currentValue, passedIns[currentIndex]);
            }
        }, undefined);
    }
    /**
     * Start parallel transforms, defaulting to pipeline payload in and out (and appropriate merge flag)
     **/
    startParallel(transformClass, passedIn) {
        // ----- Declaration separator ----- //
        const parallelPipe = ParallelPipe.start(transformClass, this, passedIn);
        this._pipes.push(parallelPipe);
        return parallelPipe;
    }
    ;
    parallels(transformClasses, mergeStrategy = ['asAttributes'], passedIns) {
        return transformClasses.reduce((previousValue, currentValue, currentIndex) => {
            if (transformClasses.length != passedIns.length) {
                throw new Error('Array lengths do not match');
            }
            else if (passedIns.length < 2) {
                throw new Error('Minimum array length is 2 for a parallel');
            }
            if (previousValue === undefined) {
                return this.startParallel(currentValue, passedIns[currentIndex]);
            }
            else if (currentIndex === transformClasses.length - 1) {
                return previousValue.endParallel(currentValue, mergeStrategy, passedIns[currentIndex]);
            }
            else {
                return previousValue.parallel(currentValue, passedIns[currentIndex]);
            }
        }, undefined);
    }
    // Pipeline.gitOptions()
    // .forEach(directories, predicate or predicate array [], will take the last of 'transform', 'series' , 'parallel', in nothing defaults to aciton
    async execute(pipelineIn) {
        this.log.info(`starting pipeline ${this.name}...`, 'pipeline');
        const timingMark = `Timing ${Pipeline.name}:${this.name}.execute`;
        const startTimingSuccessful = startTiming(timingMark, this.log);
        let inputPayload = pipelineIn;
        let outputPayload;
        // const results: ExecutionResult<any, any, any, any> [] = [];
        try {
            for (let i = 0; i < this._pipes.length; i++) {
                const pipe = this._pipes[i];
                if (pipe) {
                    let result = await pipe.execute(inputPayload);
                    inputPayload = result;
                    outputPayload = result;
                }
                else {
                    throw new BuildError('Unreachable code', undefined, BuildErrorNumber.UnreachableCode);
                }
            }
            this.log.info(`...pipeline ${this.name} completed ${startTimingSuccessful ? endTiming(timingMark, this.log) : ''}`, 'pipeline');
            return outputPayload;
        }
        catch (err) {
            this.log.info(`...pipeline ${this.name} failed`, 'error');
            throw processUnknownError(err, this.log);
        }
        finally {
            clearTiming(timingMark);
        }
    }
}
