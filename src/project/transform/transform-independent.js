/*
Created by Franz Zemen 01/02/2023
License Type: MIT
*/
import { Transform } from './transform.js';
/**
 * Abstract class that enforces behavior such that:
 *
 * Derived classes consume pipeline payload (piped in):    false
 * Derived classes consume passed in payload (passed in):  false
 * Derived classes produce pipeline data (piped out):      false
 * Pipeline data is altered:                               false
 * Pipeline out = Pipeline in
 */
export class TransformIndependent extends Transform {
    constructor(depth) {
        super(depth);
    }
    async execute(pipeIn, passedIn = undefined) {
        return super.execute(pipeIn, undefined)
            .then(output => { return pipeIn; });
    }
    executeImpl(pipeIn, passedIn) {
        return this.executeImplIndependent()
            .then(() => pipeIn);
    }
}
