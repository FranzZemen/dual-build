/*
Created by Franz Zemen 01/05/2023
License Type: MIT
*/

import {writeFile} from 'fs/promises';
import {join} from 'node:path';
import {Directory, Options} from '../../../options/index.js';
import {processUnknownError} from '../../../util/index.js';
import {TransformPayload} from '../../../transform/transform-payload.js';

export type SaveOptionsPayload = Options & {
  directory: Directory;
}


export class SaveOptionsTransform extends TransformPayload<SaveOptionsPayload> {
  constructor(depth: number) {
    super(depth);
  }

  protected async executeImplPayload(payload: SaveOptionsPayload): Promise<void> {
    if (payload) {
      try {
        await writeFile(join(payload.directory.directoryPath, payload.filename),
                        JSON.stringify(payload).replaceAll('\n', '\r\n'),
                        {encoding: 'utf-8'});
      } catch (err) {
        throw processUnknownError(err, this.contextLog);
      }
    } else {
      throw new Error('Payload is undefined');
    }
    return Promise.resolve(undefined);
  }

  public transformContext(_undefined: undefined, payload?: SaveOptionsPayload): string {
    return payload?.filename ?? '';
  }



}
