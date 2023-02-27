/*
Created by Franz Zemen 01/02/2023
License Type: MIT
*/
import { deepCopy } from '../util/deep-copy.js';
import { Transform } from './transform.js';
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
export class TransformIn extends Transform {
    constructor(depth) {
        super(depth);
    }
    async execute(pipeIn, passedIn = undefined) {
        return super.execute(pipeIn, undefined);
    }
    executeImpl(pipeIn, passedIn) {
        const pipedInCopy = deepCopy(pipeIn);
        return this.executeImplIn(pipedInCopy)
            .then(() => pipeIn);
    }
}
