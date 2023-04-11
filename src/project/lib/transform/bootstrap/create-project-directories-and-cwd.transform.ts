/*
Created by Franz Zemen 2/3/2023
License Type: MIT
*/


import {BootstrapOptions} from '../../../options/index.js';
import {Directories, DirectoryPath} from '../../../options/index.js';
import {ArrayTwoOrMore, Pipeline} from '../../../pipeline/index.js';
import {ChangeWorkingDirectory} from '../index.js';
import {CreateDirectoryTransform, CreateDirectoryPayload} from '../index.js';
import {TransformConstructor} from '../../../transform/transform.js';
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
      let parallelWork: CreateDirectoryPayload[] = [];
      let createDirectoryTransforms: TransformConstructor<any>[] = []
      let key: DirectoryPath | 'root';
      for(key in directories) {
        if(key == 'root') continue;
        if(!directories[key].autogenerated) {
          parallelWork.push({directory: directories[key], errorOnExists: false});
          createDirectoryTransforms.push(CreateDirectoryTransform);
        }
      }

      return Pipeline
        .options<string>({name: 'Create project directories', logDepth: this.depth + 1})
        .transform<CreateDirectoryTransform, CreateDirectoryPayload>(CreateDirectoryTransform, {directory: directories.root, errorOnExists: true})
        .parallels(createDirectoryTransforms, ['asPipedIn'], parallelWork)
        .transform<ChangeWorkingDirectory, undefined>(ChangeWorkingDirectory)
        .execute( directories.root.directoryPath)
        .then(() => {return;});
  }

  public transformContext(payload: BootstrapOptions): string | object {
    return payload;
  }

}

