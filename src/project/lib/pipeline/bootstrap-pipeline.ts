/*
Created by Franz Zemen 04/04/2023
License Type: MIT
*/

import _ from 'lodash';
import {basename} from 'node:path';
import {cwd} from 'node:process';
import {bootstrapOptions, BootstrapOptions, defaultTargetOptions, GitOptions} from '../../options/index.js';
import {
  BaseTsConfigTransform,
  BaseTsConfigTransformPayload,
  CreateProjectDirectoriesAndCwd, GenerateTsConfigsPayload,
  InstallGitignore,
  SaveOptionsPayload,
  SaveOptionsTransform,
  SetupGit, TargetEnvTsConfigsTransform
} from '../../transform/index.js';
import {Pipeline} from '../../pipeline/index.js';

const projectDirectoryPath = './test-scaffolding';

const _bootstrapOptions: BootstrapOptions = _.merge({}, bootstrapOptions);
_bootstrapOptions['git options'].username = 'SomeUser';
// const log = new Log();
_bootstrapOptions.directories.root.directoryPath = projectDirectoryPath;
_bootstrapOptions.directories.root.directoryPath = basename(_bootstrapOptions.directories.root.directoryPath);
const oldCwd = cwd();

const baseTsConfigPayload: BaseTsConfigTransformPayload = {
  '.dual-build/tsconfigs': _bootstrapOptions.directories['.dual-build/tsconfigs']
};


export const bootstrapPipeline =
               Pipeline
                 .options<BootstrapOptions>(
                   {
                     name: 'Bootstrap',
                     logDepth: 0
                   })
                 .transform<CreateProjectDirectoriesAndCwd, undefined>(CreateProjectDirectoriesAndCwd)
                 .startSeries<InstallGitignore, undefined, BootstrapOptions, BootstrapOptions>(InstallGitignore)
                 .series<SetupGit, GitOptions>(SetupGit, _bootstrapOptions['git options'])
                 .endSeries<SaveOptionsTransform, SaveOptionsPayload>(
                   SaveOptionsTransform,
                   {
                     directory: _bootstrapOptions.directories['.dual-build/options'],
                     ..._bootstrapOptions
                   }
                 )
                 .startParallel<BaseTsConfigTransform, BaseTsConfigTransformPayload>(
                   BaseTsConfigTransform,
                   baseTsConfigPayload
                 )
                 .endParallel<TargetEnvTsConfigsTransform, GenerateTsConfigsPayload>(
                   TargetEnvTsConfigsTransform,
                   ['void'],
                   {
                     path: _bootstrapOptions.directories['.dual-build/tsconfigs'].directoryPath,
                     targetOptions: defaultTargetOptions
                   }
                 );
//.execute(_bootstrapOptions);