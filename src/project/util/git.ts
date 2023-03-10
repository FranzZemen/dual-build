/*
Created by Franz Zemen 03/07/2023
License Type: 
*/

import {simpleGit, SimpleGit, CommitResult} from 'simple-git';

export type GitCommitResult = CommitResult;

export interface Git {
  add(filesSpec: string[]): Promise<string>;
  commit(comment: string): Promise<GitCommitResult>;
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
}



let gitImplementation: Git = new SimpleGitWrapper();

export function setGitImplemenation(impl: Git) {
  gitImplementation = impl;
}

export function getGitImplementation(): Git {return gitImplementation}



export function git(): Git {
  return gitImplementation;
}
