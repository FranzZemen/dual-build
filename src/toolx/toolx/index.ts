/*
Created by Franz Zemen 12/10/2022
License Type: 
*/


import {basename} from 'node:path';
import {argv,exit} from 'node:process';
import _ from 'lodash';
import {ChangeWorkingDirectory} from '../transform/bootstrap/change-working-directory.transform.js';
//import {CreateDirectories} from '../transform/bootstrap/directories/create-directories.transform.js';
import {CreateRootDirectory} from '../transform/bootstrap/directories/create-root-directory.transform.js';
import {InstallGitignore} from '../transform/bootstrap/git/install-gitignore.transform.js';
import {Log} from '../log/log.js';
// import {SetupGit} from '../transform/bootstrap/setup-git.js';
import {BootstrapOptions, bootstrapOptions} from '../options/bootstrap-options.js';
import {Directories} from '../options/index.js';
import {DefaultPayload} from '../pipeline/pipeline-aliases.js';
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
  /*
  await Pipeline
    .gitOptions<BootstrapOptions>({name: 'bootstrap', logDepth:0})
    .startSeries<CreateDirectories<BootstrapOptions>>(CreateDirectories)
    .endSeries<InstallGitignore<BootstrapOptions>, BootstrapOptions>(InstallGitignore)
    .execute(gitOptions);

    .startSeries<CreateDirectories<BootstrapOptions>, BootstrapOptions,BootstrapOptions,BootstrapOptions,BootstrapOptions>(new CreateDirectories<BootstrapOptions>(), 'toolx', logDepth)
    .series<BootstrapOptions, BootstrapOptions>(new ChangeWorkingDirectory<BootstrapOptions>('root'))
    .endSeries<BootstrapOptions>(new InstallGitignore<BootstrapOptions>())*/
    //.execute(gitOptions)

} catch (err) {
  processUnknownError(err, log);
}

