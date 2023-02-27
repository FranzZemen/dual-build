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
 * Derived classes consume passed in payload (passed in):  true
 * Derived classes produce pipeline data (piped out):      false
 * Pipeline data is altered:                               false
 * Pipeline out = Pipeline in
 */
export class TransformPayloadIn extends Transform {
    constructor(depth) {
        super(depth);
    }
    async execute(pipeIn, passedIn) {
        return super.execute(pipeIn, passedIn);
    }
    executeImpl(pipeIn, passedIn) {
        const pipedInCopy = deepCopy(pipeIn);
        return this.executeImplPayloadIn(pipedInCopy, passedIn)
            .then(() => pipeIn);
    }
}
