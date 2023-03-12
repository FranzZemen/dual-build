/*
Created by Franz Zemen 03/12/2023
License Type: 
*/


export type ExecSyncError = Error & {
  pid: number;
  output: [];
  stdout: Buffer | string;
  stderr: Buffer | string;
  status: number | null;
  signal: string | null;
}

export function isExecSyncError(err: Error | any): err is ExecSyncError {
  return 'pid' in err && 'output' in err && 'stdout' in err && 'stderr' in err && 'status' in err && 'signal' in err;
}
