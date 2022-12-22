/*
Created by Franz Zemen 12/12/2022
License Type: MI
*/
import {simpleGit, SimpleGit, SimpleGitOptions} from 'simple-git';
import {ContainsDirectories} from '../../options/directories.js';
import {ContainsGitOptions, GitOptions} from '../../options/git-options.js';
import {Action} from '../action.js';


export type ContainsSetupGitOptions = ContainsGitOptions & ContainsDirectories
/*
export class SetupGit extends Action<ContainsSetupGitOptions, ContainsSetupGitOptions> {
  options: SimpleGitOptions;
  constructor() {
    super();

  }

  execute(payload: ContainsSetupGitOptions): Promise<ContainsSetupGitOptions> {
    // Git init

  }
}



 */

//7onst options: SimpleGitOptions = {
  /**
   * Base directory for all tasks run through this `simple-git` instance
   */
  //baseDir: string;
  /**
   * Name of the binary the child processes will spawn - defaults to `git`
   */
  //binary: string;
  /**
   * Limit for the number of child processes that will be spawned concurrently from a `simple-git` instance
   */
  //maxConcurrentProcesses: number;
  /**
   * Per-command configuration parameters to be passed with the `-c` switch to `git`
   */
  //config: string[];
  /**
   * Enable trimming of trailing white-space in `git.raw`
   */
  //trimmed: boolean;
//};
