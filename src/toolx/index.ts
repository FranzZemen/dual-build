/*
Created by Franz Zemen 12/10/2022
License Type: 
*/


import {basename} from 'node:path';
import {argv,exit} from 'node:process';
import _ from 'lodash';
import {ChangeWorkingDirectory} from '../action/bootstrap/change-working-directory.js';
import {CreateDirectories} from '../action/bootstrap/create-directories.js';
import {InstallGitignore} from '../action/bootstrap/install-gitignore.js';
// import {SetupGit} from '../action/bootstrap/setup-git.js';
import {BootstrapOptions, bootstrapOptions} from '../options/bootstrap-options.js';
import {Pipeline} from '../pipeline/pipeline.js';

const options = _.merge({}, bootstrapOptions);

if(argv.length === 3 && argv[2].trim().length > 0) {
  options.directories.root.directoryPath = argv[2];
  options.directories.root.folder = basename(options.directories.root.directoryPath);
} else {
  console.log('No folder provided.  Specify project folder');
  exit(1);
}



try {
  await Pipeline
    .startSeries<BootstrapOptions,BootstrapOptions,BootstrapOptions,BootstrapOptions>(new CreateDirectories<BootstrapOptions>())
    .series<BootstrapOptions, BootstrapOptions>(new ChangeWorkingDirectory<BootstrapOptions>('root'))
    .endSeries<BootstrapOptions>(new InstallGitignore<BootstrapOptions>())
    .execute(options)
} catch (err) {
  console.log(err);
}

