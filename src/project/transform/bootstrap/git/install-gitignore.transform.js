/*
Created by Franz Zemen 12/11/2022
License Type:
*/
import { writeFile } from 'node:fs/promises';
import { EOL } from 'os';
import { gitignore } from '../../../options/index.js';
import { processUnknownError } from '../../../util/index.js';
import { TransformIndependent } from '../../transform-independent.js';
/**
 * Assumes cwd has been set, but verifies it
 */
export class InstallGitignore extends TransformIndependent {
    constructor(logDepth) {
        super(logDepth);
    }
    async executeImplIndependent() {
        try {
            let file = '';
            gitignore.forEach(ignore => file += ignore + EOL);
            const path = './.gitignore';
            await writeFile(path, file, { encoding: 'utf-8' });
        }
        catch (err) {
            throw processUnknownError(err, this.log);
        }
    }
    transformContext(rootPath) {
        return '';
    }
}
