/*
Created by Franz Zemen 03/12/2023
License Type: 
*/


import {SpawnSyncReturns} from 'child_process';

export type ExecSyncError = Error & {
  pid: number;
  output: [];
  stdout: Buffer | string;
  stderr: Buffer | string;
  status: number | null;
  signal: string | null;
}

export function isExecSyncErrorThenStringifyBuffers(err: Error | any): err is ExecSyncError {
  if('pid' in err && 'output' in err && 'stdout' in err && 'stderr' in err && 'status' in err && 'signal' in err) {
    const spawnError = err as SpawnSyncReturns<any>;
    for(let i = 0; i < spawnError.output.length; i++) {
      const entry = spawnError.output[i];
      if(entry instanceof Buffer) {
        spawnError.output[i] = entry.toString('utf-8');
      }
    }
    if(spawnError.stdout instanceof Buffer) {
      spawnError.stdout = spawnError.stdout.toString('utf-8')
    }
    if(spawnError.stderr instanceof Buffer) {
      spawnError.stderr = spawnError.stderr.toString('utf-8');
    }
    return true;
  }
  return false;
}
