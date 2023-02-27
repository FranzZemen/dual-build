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
 * Derived classes produce pipeline data (piped out):      true
 * Pipeline data is altered:                               true
 * Pipeline out = Derived class out
 */
export class TransformOut extends Transform {
    constructor(depth) {
        super(depth);
    }
    async execute(pipeIn = undefined, passedIn = undefined) {
        return super.execute(undefined, undefined);
    }
    executeImpl(pipeIn, passedIn) {
        return this.executeImplOut();
    }
}
