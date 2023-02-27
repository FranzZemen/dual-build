import _ from 'lodash';
import { Log } from '../../log/log.js';
import { processUnknownError } from '../../util/index.js';
export class ParallelPipe {
    _pipeline;
    log;
    _pipe = [];
    _mergeStrategy = ['asAttributes'];
    _mergeFunction;
    constructor(_pipeline, depth) {
        this._pipeline = _pipeline;
        this.log = new Log(depth);
    }
    static start(transformClass, pipeline, payloadOverride) {
        // ----- Multiline Declaration Separator ----- //
        const pipe = new ParallelPipe(pipeline, pipeline.log.depth + 1);
        return pipe.parallel(transformClass, payloadOverride);
    }
    parallel(transformClass, payloadOverride) {
        // ----- Multiline Declaration Separator ----- //
        this._pipe.push([new transformClass(this.log.depth + 1), payloadOverride]);
        return this;
    }
    endParallel(transformClass, mergeStrategy = ['asPipedIn'], payloadOverride) {
        // ----- Multiline Declaration Separator ----- //
        this._pipe.push([new transformClass(this.log.depth + 1), payloadOverride]);
        this._mergeStrategy = mergeStrategy;
        return this._pipeline;
    }
    async execute(payload) {
        this.log.info('starting parallel pipe...', 'pipeline');
        const transformPromises = [];
        try {
            for (let i = 0; i < this._pipe.length; i++) {
                const thisPipeI = this._pipe[i];
                if (thisPipeI !== undefined) {
                    const [transform, payloadOverride] = thisPipeI;
                    transformPromises.push(transform.execute(payload, payloadOverride));
                }
            }
            const settlement = await Promise.allSettled(transformPromises);
            let filteredErrors = settlement.filter(settled => settled.status === 'rejected');
            if (filteredErrors.length) {
                return Promise.reject(processUnknownError(filteredErrors, this.log));
            }
            else {
                switch (this._mergeStrategy[0]) {
                    case 'asAttributes':
                        let output;
                        const self = this;
                        settlement.forEach((settled, ndx) => {
                            if (settled.status === 'fulfilled') {
                                if (settled.value !== undefined) {
                                    if (output === undefined) {
                                        output = {};
                                    }
                                    // @ts-ignore
                                    output[self._pipe[ndx][0].constructor.name + (ndx === 0 ? '' : `_${ndx}`)] = settled.value;
                                }
                            }
                        });
                        return output;
                    case 'void': {
                        return undefined;
                    }
                    case 'asPipedIn': {
                        // Ignore any payload from parallel transforms and return what was piped in.
                        return payload;
                    }
                    case 'asMergeFunction':
                    case 'asMerged': {
                        //let initialValue: any[] | undefined = undefined;
                        const outputs = settlement.reduce((previousValue, currentValue) => {
                            if (currentValue.status === 'fulfilled') {
                                if (currentValue.value !== undefined) {
                                    if (previousValue === undefined) {
                                        previousValue = [];
                                    }
                                    previousValue.push(currentValue);
                                }
                            }
                            return previousValue;
                        }, undefined);
                        if (outputs === undefined) {
                            return outputs;
                        }
                        else if (this._mergeStrategy[0] === 'asMerged') {
                            return _.merge({}, ...outputs);
                        }
                        else if (this._mergeStrategy[1]) {
                            return this._mergeStrategy[1](outputs);
                        }
                        else {
                            return Promise.reject(new Error(`Merge strategy is 'asMergeFunction' with undefined function`));
                        }
                    }
                    default:
                        return this._mergeStrategy[0];
                }
            }
        }
        catch (err) {
            return Promise.reject(processUnknownError(err, this.log));
        }
        finally {
            this.log.info('...completing paralell pipe', 'pipeline');
        }
    }
}
