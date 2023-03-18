/*
Created by Franz Zemen 03/07/2023
License Type: 
*/

import {simpleGit, SimpleGit, CommitResult, PushResult} from 'simple-git';

export type GitCommitResult = CommitResult;

export interface Git {
  add(filesSpec: string[]): Promise<string>;
  commit(comment: string): Promise<GitCommitResult>;
  push(): Promise<PushResult>;
  currentBranch(): Promise<string>;
}

class SimpleGitWrapper implements Git {
  constructor() {}
  protected git: SimpleGit = simpleGit();

  add(filesSpec: string[]): Promise<string> {
    return this.git.add(filesSpec);
  }

  commit(comment: string): Promise<GitCommitResult> {
   return this.git.commit(comment);
  }

  push(): Promise<PushResult> {
    return this.git.push();
  }

  currentBranch(): Promise<string> {
    return this.git.branch().then(summary => summary.current);
  }
}



let gitImplementation: Git = new SimpleGitWrapper();

export function setGitImplemenation(impl: Git) {
  gitImplementation = impl;
}

export function getGitImplementation(): Git {return gitImplementation}



export function git(): Git {
  return gitImplementation;
}
