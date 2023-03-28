/*
Created by Franz Zemen 03/23/2023
License Type: 
*/

import {TransformPayload} from '../core/transform-payload.js';

export type DelPayload = {
  glob: string | '**/*.*',
  ignoreGlob?: string[],
  onlyFiles?: boolean
  deleteEmptyDirectories?: boolean,
  followSymbolicLinks?: boolean
}

/**
 * A transform that deletes globs indescriminately.  Best to subclass or wrap it for protections needed.
 */
export class DelTransform extends TransformPayload<DelPayload> {
  constructor(depth: number) {super(depth);}

  protected executeImplPayload(payload: DelPayload): Promise<void> {
    return Promise.resolve(undefined);
  }

  protected transformContext(pipeIn: undefined, passedIn: DelPayload | undefined): string | object | Promise<string | object> {
    return passedIn ?? {};
  }

  protected filter(targets: string[]): string[] | Promise<string[]> {
    return [];
  }

}
