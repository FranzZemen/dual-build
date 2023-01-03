/*
Created by Franz Zemen 12/30/2022
License Type: 
*/
/*
Created by Franz Zemen 12/29/2022
License Type: MIT
*/

import * as chai from 'chai';
import _ from 'lodash';
import 'mocha';
import {existsSync, rmSync} from 'node:fs';
import {basename, join, sep} from 'node:path';
import {chdir, cwd} from 'node:process';
import {Log} from '../../toolx/log/log.js';
import {BootstrapOptions, bootstrapOptions} from '../../toolx/options/bootstrap-options.js';
import {ContainsGitOptions, GitOptions} from '../../toolx/options/git-options.js';
import {Directory} from '../../toolx/options/index.js';
import {Pipeline} from '../../toolx/pipeline/pipeline.js';
import {ChangeWorkingDirectory} from '../../toolx/transform/bootstrap/change-working-directory.transform.js';
import {CreateDirectories} from '../../toolx/transform/bootstrap/directories/create-directories.transform.js';
import {SetupGit} from '../../toolx/transform/bootstrap/git/setup-git.transform.js';
import {InstallGitignore} from '../../toolx/transform/bootstrap/install-gitignore.transform.js';
import {processUnknownError} from '../../toolx/util/process-unknown-error-message.js';
import '../transform/transform.test.js';

const should = chai.should();
const unreachableCode = false;

describe('dual-build tests', () => {
  describe('pipeline.test', () => {
    describe('Pipeline Integration', () => {
      it('should instantiate and execute transform', async function () {

        const projectDirectoryPath = './test-scaffolding';

        const _bootstrapOptions = _.merge({}, bootstrapOptions);
        const log = new Log();
        _bootstrapOptions.directories.root.directoryPath = projectDirectoryPath;
        _bootstrapOptions.directories.root.folder = basename(_bootstrapOptions.directories.root.directoryPath);
        try {
          const oldCwd = cwd();
          await Pipeline.options<BootstrapOptions, void>({name: 'test-scaffolding', logDepth: 0})
                        .transform<CreateDirectories,undefined, BootstrapOptions, Directory>(CreateDirectories)
                        .startSeries<ChangeWorkingDirectory, undefined, Directory, void>(ChangeWorkingDirectory)
                        .series<InstallGitignore, undefined>(InstallGitignore)
                        .endSeries<SetupGit, GitOptions>(SetupGit, _bootstrapOptions['git options'])
                        .execute(_bootstrapOptions);
          cwd().should.contain(join(`dual-build${sep}${projectDirectoryPath}`));
          chdir(oldCwd);
          existsSync(projectDirectoryPath).should.be.true;
        } catch (err) {
          log.error(processUnknownError(err));
          unreachableCode.should.be.true;
        } finally {
          rmSync(projectDirectoryPath, {recursive: true, force: true});
        }
      });
    });
  });
});


