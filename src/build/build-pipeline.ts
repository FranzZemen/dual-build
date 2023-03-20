/*
Created by Franz Zemen 03/11/2023
License Type: MIT
*/


import {
  CheckInTransform,
  CommitPayload,
  CommitTransform,
  CopyPayload,
  CopyTransform,
  CreatePackagePayload,
  CreatePackageTransform,
  ExecutablePayload,
  ExecutableTransform,
  MaleatePackagePayload,
  MaleatePackageTransform,
  ModuleType,
  Pipeline,
  PushBranchTransform
} from 'dual-build/project';


const pipeline = Pipeline.options({name: 'Build', logDepth: 0})
                         .transform<CreatePackageTransform, CreatePackagePayload>(CreatePackageTransform, {
                           targetPath: './out/dist/esm/package.json',
                           package: {type: ModuleType.module}
                         })
                         .transform<CreatePackageTransform, CreatePackagePayload>(CreatePackageTransform, {
                           targetPath: './out/dist/cjs/package.json',
                           package: {type: ModuleType.commonjs}
                         })
                         .transform<CopyTransform, CopyPayload>(CopyTransform, {
                           src: './doc/project',
                           dest: './out/dist',
                           glob: '**/*.md',
                           overwrite: true
                         })

                         .transform<CheckInTransform>(CheckInTransform)
                         //.transform<CommitTransform, CommitPayload>(CommitTransform, undefined)

                      .transform<CommitTransform, CommitPayload>(CommitTransform, {comment:'testing'})
                      .transform<ExecutableTransform, ExecutablePayload>(ExecutableTransform, {
                        executable: 'npm version',
                        arguments: ['patch'],
                        batchTarget: false,
                        synchronous: true,
                        cwd: './'
                      })
                         /*
                      .transform<MaleatePackageTransform, MaleatePackagePayload>(MaleatePackageTransform, {
                        targetPath: './out/dist/package.json',
                        exclusions: ['type', 'scripts', 'imports', 'exports', 'bin', 'devDependencies', 'nodemonConfig'],
                        inclusions: {
                          exports: {
                            '.': {
                              types: './types',
                              import: './esm/index.js',
                              require: './cjs/index.js'
                            }
                          },
                          main: './cjs/index.js',
                          types: './types'
                        }
                      })
                      .transform<ExecutableTransform, ExecutablePayload>(ExecutableTransform, {
                        executable: 'npm publish',
                        cwd: './',
                        arguments: ['./out/dist'],
                        batchTarget: false,
                        synchronous: false
                      })
                      .transform<CheckInTransform>(CheckInTransform)
                      .transform<CommitTransform, CommitPayload>(CommitTransform, {comment: 'published'})
                      .transform<PushBranchTransform>(PushBranchTransform)
*/
                         .execute(undefined);



