/*
Created by Franz Zemen 02/13/2023
License Type:
*/
import _ from 'lodash';
import { readFile, writeFile } from 'fs/promises';
export class MergeJsonTransformBase {
    constructor() {
    }
    executeImplIndependent() {
        return readFile(this.getTargetPath(), { encoding: 'utf-8' })
            .then(jsonTarget => {
            const target = JSON.parse(jsonTarget);
            return readFile(this.getSourcePath(), { encoding: 'utf-8' })
                .then(jsonSource => {
                const source = JSON.parse(jsonSource);
                const result = _.merge(target, source);
                return writeFile(this.getMergePath(), JSON.stringify(result), { encoding: 'utf-8' })
                    .then(() => {
                    return;
                });
            });
        });
    }
}
