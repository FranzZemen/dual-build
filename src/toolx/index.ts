/*
Created by Franz Zemen 12/10/2022
License Type: 
*/


import {basename} from 'node:path';
import {argv,exit} from 'node:process';
import _ from 'lodash';
import {ChangeWorkingDirectory} from '../action/bootstrap/change-working-directory.js';
import {CreateDirectories} from '../action/bootstrap/directories/create-directories.action.js';
import {CreateRootDirectory} from '../action/bootstrap/directories/create-root-directory.task.js';
import {InstallGitignore} from '../action/bootstrap/install-gitignore.js';
import {Log} from '../log/log.js';
// import {SetupGit} from '../action/bootstrap/setup-git.js';
import {BootstrapOptions, bootstrapOptions} from '../options/bootstrap-options.js';
import {Directories} from '../options/index.js';
import {Pipeline} from '../pipeline/pipeline.js';
import {processUnknownError} from '../util/process-unknown-error-message.js';

const options = _.merge({}, bootstrapOptions);

const log = new Log();

if(argv.length === 3 && argv[2].trim().length > 0) {
  options.directories.root.directoryPath = argv[2];
  options.directories.root.folder = basename(options.directories.root.directoryPath);
} else {
  log.info('No folder provided.  Specify project folder');
  exit(1);
}

const logDepth =0;
try {
  await Pipeline
    .startSeries(CreateDirectories)
    .endSeries(InstallGitignore)
    .execute(options);

    /*
    .startSeries<CreateDirectories<BootstrapOptions>, BootstrapOptions,BootstrapOptions,BootstrapOptions,BootstrapOptions>(new CreateDirectories<BootstrapOptions>(), 'toolx', logDepth)
    .series<BootstrapOptions, BootstrapOptions>(new ChangeWorkingDirectory<BootstrapOptions>('root'))
    .endSeries<BootstrapOptions>(new InstallGitignore<BootstrapOptions>())*/
    //.execute(options)
} catch (err) {
  log.error(processUnknownError(err));
}

