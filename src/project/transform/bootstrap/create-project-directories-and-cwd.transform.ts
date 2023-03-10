/*
Created by Franz Zemen 2/3/2023
License Type: MIT
*/


import {BootstrapOptions} from '../../options/index.js';
import {Directories, DirectoryPath} from '../../options/index.js';
import {Pipeline} from '../../pipeline/index.js';
import {ChangeWorkingDirectory} from '../core/index.js';
import {CreateDirectory, CreateDirectoryPayload} from '../core/index.js';
import {TransformConstructor} from '../transform.js';
import {BootstrapTransform} from './bootstrap-transform.js';

/**
 * Creates project directories, if they don't exist, applying bootstrap rules that impact which directories actually should be created.
 *
 * Does not create project directories if they already exist.
 *
 * Warns of project directories that should not exist under bootstrap options, but are found to be there.
 */
export class CreateProjectDirectoriesAndCwd extends BootstrapTransform<undefined> {
  constructor(logDepth: number) {
    super(logDepth);
  }

  public executeBootstrapImpl(bootstrapOptions: BootstrapOptions): Promise<void> {
      const directories: Directories = bootstrapOptions.directories;
      const parallelWork: CreateDirectoryPayload[] = [];
      let createDirectoryTransforms: TransformConstructor<any>[] = []
      let key: DirectoryPath | 'root';
      for(key in directories) {
        if(key == 'root') continue;
        if(!directories[key].autogenerated) {
          parallelWork.push({directory: directories[key], errorOnExists: false});
          createDirectoryTransforms.push(CreateDirectory);
        }
      }

      return Pipeline
        .options<string>({name: 'Create project directories', logDepth: this.depth + 1})
        .transform<CreateDirectory, CreateDirectoryPayload>(CreateDirectory, {directory: directories.root, errorOnExists: true})
        .parallels(createDirectoryTransforms, ['asPipedIn'], parallelWork as any [])
        .transform<ChangeWorkingDirectory, undefined>(ChangeWorkingDirectory)
        .execute( directories.root.directoryPath)
        .then(() => {return;});

  }

  public transformContext(payload: BootstrapOptions): string {
    return '';
  }

}

