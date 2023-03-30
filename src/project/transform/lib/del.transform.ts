/*
Created by Franz Zemen 03/23/2023
License Type: 
*/

import FastGlob from 'fast-glob';
import {rm} from 'fs/promises';
import {join} from 'node:path';
import {cwd} from 'node:process';
import {BuildError, BuildErrorNumber} from '../../util/index.js';
import {TransformPayload} from '../core/transform-payload.js';

export type DelPayload = {
  pattern: string | '**/*.*', // Can be a specific directory, symbolic link or file or a glob relative to project directory
  ignoreGlob?: string[],
  globReportsOnlyFiles?: boolean
  globFollowsSymbolicLinks?: boolean
}

/**
 * A transform that deletes globs indescriminately.  Best to subclass or wrap it for protections needed.
 * Although indescriminate below project directory, it will not allow a patterns to include ../ i.e. pattern cannot exit project directory.
 */
export class DelTransform extends TransformPayload<DelPayload> {
  constructor(depth: number) {super(depth);}


  private async _delSpecific(filtered: string): Promise<void> {
    if(filtered.trim().length === 0) {
      this.contextLog.info(`{filtered} was filtered out, no deletion resulted`);
      return;
    }
    const absolute = join(cwd(), filtered);
    return rm(absolute)
      .catch((err:unknown) => {
        const error = new BuildError(`Error deleting ${absolute}`, {cause: err}, BuildErrorNumber.RmError)
        this.contextLog.error(error);
        throw error;
      });
  }

  private delSpecific(payload: DelPayload): Promise<void> {
    const filtered = this.filter(payload.pattern);
      return filtered.then(filteredFromPromise => {
        if(typeof filteredFromPromise === 'string') {
          return this._delSpecific(filteredFromPromise);
        } else {
          const error = new BuildError('Unreachable code', undefined, BuildErrorNumber.UnreachableCode);
          this.contextLog.error(error);
          throw error;
        }
      })
  }

  protected async executeImplPayload(payload: DelPayload): Promise<void> {
    if (/\.\.\//.test(payload.pattern)) {
      const error = new BuildError('Attempt to delete a backtracked pattern (contains ../)', undefined, BuildErrorNumber.BacktrackedDeletion);
      this.contextLog.error(error);
      throw error;
    }
    if (/\*/.test(payload.pattern)) {
      return this.delSpecific(payload);
    } else {
      const currentWorkingDirectory = cwd();
      return FastGlob(payload.pattern,
                     {
                       cwd: currentWorkingDirectory,
                       onlyFiles: payload.globReportsOnlyFiles ?? false,
                       followSymbolicLinks: payload.globFollowsSymbolicLinks ?? true,
                       ignore: payload.ignoreGlob ?? []
                     })
        .then(async files => {
          const promises: Promise<void>[] = [];
          const candidates: string[] =[];
          const filteredFilesPromise = this.filter(files);
          const filteredFiles = await filteredFilesPromise;
          if(typeof filteredFiles === 'string') {
            const error = new BuildError('Unreachable code', undefined, BuildErrorNumber.UnreachableCode);
            this.contextLog.error(error);
            throw error;
          }
          filteredFiles.forEach(file => {
            // Use Promise.all to aggregate all the file copies
            const candidate = join(currentWorkingDirectory, file);
            candidates.push(candidate);
            this.contextLog.debug(`deleting ${candidate}`, 'context');
            promises.push(rm(candidate)); // Note we don't use the recursive flag.  We let the glob pattern decide that, including whther todelete directories
          });
          return Promise.allSettled(promises)
            .then(results => {
              const errors: BuildError[] = [];
              results.forEach((result, ndx) => {
                if(result.status === 'rejected') {
                  const error = new BuildError(`Error deleting ${candidates[ndx]}`, {cause: result.reason}, BuildErrorNumber.RmError);
                  this.contextLog.error(error);
                  errors.push(error);
                }
              });
              if(errors.length) {
                throw new BuildError(`Error deleting glob items`, {cause: errors}, BuildErrorNumber.RmGlob);
              }
              return;
            });
        });
    }
  }

  protected transformContext(pipeIn: undefined, passedIn: DelPayload | undefined): string | object | Promise<string | object> {
    return passedIn ?? '';
  }


  protected filter(targets: string | string[]): Promise<string | string[]> {
    if(typeof targets === 'string') {
      return Promise.resolve('');
    } else {
      return Promise.resolve([]);
    }
  }

}
