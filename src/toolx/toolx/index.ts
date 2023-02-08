/*
Created by Franz Zemen 12/10/2022
License Type: 
*/


import _ from 'lodash';
import {basename} from 'node:path';
import {argv, exit} from 'node:process';
import {Log} from '../log/log.js';
// import {SetupGit} from '../transform/bootstrap/setup-git.js';
import {bootstrapOptions} from '../options/index.js';
//import {CreateDirectories} from '../transform/bootstrap/directories/create-directories.transform.js';
import {processUnknownError} from '../util/index.js';

const options = _.merge({}, bootstrapOptions);

const log = new Log();

if(argv.length === 3 && argv[2].trim().length > 0) {
  options.directories.root.directoryPath = argv[2];
  options.directories.root.directoryPath = basename(options.directories.root.directoryPath);
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

