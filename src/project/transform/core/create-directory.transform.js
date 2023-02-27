/*
Created by Franz Zemen 2/3/2023
License Type: MIT
*/
import { access } from 'fs/promises';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { cwd } from 'node:process';
import { BuildError, BuildErrorNumber } from '../../util/build-error.js';
import { TransformPayloadIn } from '../transform-payload-in.js';
/**
 * Creates a directory asynchronously.  The piped in object is the root name or undefined.  If undefined, the path (relative or absolute) contained
 * in the Directory payload is used. If defined, that path is joined to the root path.
 */
export class CreateDirectory extends TransformPayloadIn {
    constructor(logDepth) {
        super(logDepth);
    }
    executeImplPayloadIn(root, directoryPayload) {
        if (directoryPayload?.directory?.directoryPath) {
            let path;
            if (root) {
                path = join(cwd(), join(root, directoryPayload.directory.directoryPath));
            }
            else {
                path = directoryPayload.directory.directoryPath;
            }
            return access(path)
                .then(() => {
                if (directoryPayload.errorOnExists) {
                    throw new BuildError(`Directory ${directoryPayload.directory.name} with path ${path} already exists and rules = 'error on exist'`, undefined, BuildErrorNumber.DirectoryAlreadyExists);
                }
                else {
                    const msg = `Project folder ${path} already exists, skipping`;
                    this.log.warn(msg);
                    return;
                }
            })
                .catch((err) => {
                if (err instanceof BuildError) {
                    throw err;
                }
                else {
                    return mkdir(path, { recursive: true })
                        .then(() => {
                        this.log.info(`created ${path}`, 'task-internal');
                        return;
                    });
                }
            });
        }
        else {
            throw new Error('Undefined directory path');
        }
    }
    transformContext(root, directoryPayload) {
        let path;
        if (root) {
            path = join(cwd(), join(root, directoryPayload.directory.directoryPath));
        }
        else {
            path = directoryPayload.directory.directoryPath;
        }
        return path;
    }
}
