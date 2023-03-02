/*
Created by Franz Zemen 12/30/2022
License Type: 
*/
/*
Created by Franz Zemen 12/29/2022
License Type: MIT
*/

import * as chai from 'chai';
import {
  BaseTsConfigTransform,
  BaseTsConfigTransformPayload,
  BootstrapOptions,
  bootstrapOptions,
  CreateProjectDirectoriesAndCwd,
  defaultTargetOptions,
  GenerateTsConfigsPayload,
  GitOptions,
  Log,
  Pipeline,
  processUnknownError,
  SaveOptionsPayload,
  SaveOptionsTransform,
  SetupGit,
  TargetEnvTsConfigsTransform
} from 'dual-build/project';
import _ from 'lodash';
import 'mocha';
import {existsSync} from 'node:fs';
import {basename, join, sep} from 'node:path';
import {chdir, cwd} from 'node:process';
import {simpleGit, SimpleGit} from 'simple-git';
import {InstallGitignore} from 'dual-build/project';

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
        _bootstrapOptions.directories.root.directoryPath = basename(_bootstrapOptions.directories.root.directoryPath);
        const oldCwd = cwd();

        const baseTsConfigPayload: BaseTsConfigTransformPayload = {
          '.dual-build/tsconfigs': _bootstrapOptions.directories['.dual-build/tsconfigs'],
        }

        try {
          await Pipeline.options<BootstrapOptions>({name: 'Bootstrap', logDepth: 0})
                        .transform<CreateProjectDirectoriesAndCwd, undefined>(CreateProjectDirectoriesAndCwd)
                        .startSeries<InstallGitignore, undefined>(InstallGitignore)
                        .series<SetupGit, GitOptions>(SetupGit, _bootstrapOptions['git options'])
                        .endSeries<SaveOptionsTransform, SaveOptionsPayload>(
                          SaveOptionsTransform,
                          {
                            directory: _bootstrapOptions.directories['.dual-build/options'],
                            ..._bootstrapOptions}
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
                          )
                        .execute(_bootstrapOptions);

          cwd().should.contain(join(`dual-build${sep}${projectDirectoryPath}`));
          const git: SimpleGit = simpleGit();
          const remotes = await git.getRemotes(true);
          ///log.info(inspect(remotes, false, 10, true));
          Array.isArray(remotes).should.be.true;
          remotes.length.should.equal(1);
          // @ts-ignore
          remotes[0]['name'].should.equal('origin');
        } catch (err) {
          processUnknownError(err, log);
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


