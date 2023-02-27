/*
Created by Franz Zemen 02/25/2023
License Type:
*/
import { TransformPayload } from '../transform-payload.js';
export class CompileTargetOptionTransform extends TransformPayload {
    constructor(depth) { super(depth); }
    async executeImplPayload(payload) {
    }
    transformContext(pipeIn, passedIn) {
        return `compiling target option ${passedIn?.nickName}`;
    }
}
