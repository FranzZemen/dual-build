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
import {simpleGit, SimpleGit} from 'simple-git';
import {Log} from '../../toolx/log/log.js';
import {BootstrapOptions, bootstrapOptions} from '../../toolx/options/bootstrap-options.js';
import {Directory, GitOptions} from '../../toolx/options/index.js';
import {Pipeline} from '../../toolx/pipeline/pipeline.js';
import {ChangeWorkingDirectory} from '../../toolx/transform/bootstrap/change-working-directory.transform.js';
import {CreateDirectories} from '../../toolx/transform/bootstrap/directories/create-directories.transform.js';
import {SetupGit} from '../../toolx/transform/bootstrap/git/setup-git.transform.js';
import {InstallGitignore} from '../../toolx/transform/bootstrap/git/install-gitignore.transform.js';
import {SaveOptionsPayload, SaveOptionsTransform} from '../../toolx/transform/bootstrap/save-options.transform.js';
import {
  GenerateBaseTsConfigTransform,
  GenerateBaseTsConfigTransformPayload
} from '../../toolx/transform/bootstrap/tsconfig/generate-base-ts-config.transform.js';
import {processUnknownError} from '../../toolx/util/process-unknown-error-message.js';
import '../transform/transform.test.js';

const should = chai.should();
const unreachableCode = false;

describe('dual-build tests', () => {
  describe('pipeline.test', () => {
    describe('Pipeline Integration', () => {
      it('should instantiate and execute transform', async function () {

        const projectDirectoryPath = './test-scaffolding';

        const _bootstrapOptions: BootstrapOptions = _.merge({}, bootstrapOptions);
        _bootstrapOptions['git options'].username = 'SomeUser';
        const log = new Log();
        _bootstrapOptions.directories.root.directoryPath = projectDirectoryPath;
        _bootstrapOptions.directories.root.folder = basename(_bootstrapOptions.directories.root.directoryPath);
        const oldCwd = cwd();

        const baseTsConfigPayload: GenerateBaseTsConfigTransformPayload = {
          '.dual-build/tsconfigs': _bootstrapOptions.directories['.dual-build/tsconfigs'],
        }

        try {
          await Pipeline.options<BootstrapOptions, void>({name: 'test-scaffolding', logDepth: 0})
                        .transform<CreateDirectories,undefined, BootstrapOptions, Directory>(CreateDirectories)
                        .startSeries<ChangeWorkingDirectory, undefined, Directory, void>(ChangeWorkingDirectory)
                        .series<InstallGitignore, undefined>(InstallGitignore)
                        .series<SetupGit, GitOptions>(SetupGit, _bootstrapOptions['git options'])
                        .endSeries<SaveOptionsTransform, SaveOptionsPayload>(SaveOptionsTransform, {directory: _bootstrapOptions.directories['.dual-build/options'], ..._bootstrapOptions})
                        .transform<GenerateBaseTsConfigTransform, GenerateBaseTsConfigTransformPayload, undefined, undefined>(GenerateBaseTsConfigTransform, baseTsConfigPayload)
                        .execute(_bootstrapOptions);
          cwd().should.contain(join(`dual-build${sep}${projectDirectoryPath}`));

          const git: SimpleGit = simpleGit();
          const remotes = await git.getRemotes(true);
          ///log.info(inspect(remotes, false, 10, true));
          Array.isArray(remotes).should.be.true;
          remotes.length.should.equal(1);
          remotes[0]['name'].should.equal('origin');
        } catch (err) {
          log.error(processUnknownError(err));
          unreachableCode.should.be.true;
        } finally {
          chdir(oldCwd);
          log.info(`reverting working directory to ${oldCwd}`);
          existsSync(projectDirectoryPath).should.be.true;
          // rmSync(projectDirectoryPath, {recursive: true, force: true});
        }
      });
    });
  });
});


