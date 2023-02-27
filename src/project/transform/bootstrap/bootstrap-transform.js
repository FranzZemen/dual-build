/*
Created by Franz Zemen 02/03/2023
License Type:
*/
import { TransformPayloadIn } from '../transform-payload-in.js';
export class BootstrapTransform extends TransformPayloadIn {
    executeImplPayloadIn(pipeIn, passedIn) {
        return this.executeBootstrapImpl(pipeIn, passedIn);
    }
}
