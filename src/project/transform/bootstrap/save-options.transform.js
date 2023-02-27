/*
Created by Franz Zemen 01/05/2023
License Type: MIT
*/
import { writeFile } from 'fs/promises';
import { join } from 'node:path';
import { processUnknownError } from '../../util/index.js';
import { TransformPayload } from '../transform-payload.js';
export class SaveOptionsTransform extends TransformPayload {
    constructor(depth) {
        super(depth);
    }
    async executeImplPayload(payload) {
        if (payload) {
            try {
                await writeFile(join(payload.directory.directoryPath, payload.filename), JSON.stringify(payload).replaceAll('\n', '\r\n'), { encoding: 'utf-8' });
            }
            catch (err) {
                throw processUnknownError(err, this.log);
            }
        }
        else {
            throw new Error('Payload is undefined');
        }
        return Promise.resolve(undefined);
    }
    transformContext(_undefined, payload) {
        return payload?.filename ?? '';
    }
}
