/*
Created by Franz Zemen 02/06/2023
License Type:
*/

import {
  CheckInTransform,
  CommitPayload,
  CommitTransform,
  CopyTransform,
  CopyPayload,
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
import {publishPayload, transpilePayload} from './default-payloads.js';


const pipeline = Pipeline.options({name: 'Build', logDepth: 0})
  // Compile all typescript - what's needed for the local build as well as for the package build via tsc project
                         .transform<ExecutableTransform, ExecutablePayload>(ExecutableTransform, transpilePayload)
  // For published distribution, maleate package.json appropriately
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
                           glob: '**/*.md' 
                         })
                         .transform<CheckInTransform>(CheckInTransform)
                         .transform<CommitTransform, CommitPayload>(CommitTransform, undefined)
                         .transform<ExecutableTransform, ExecutablePayload>(ExecutableTransform, {
                           executable: 'npm version',
                           arguments: ['patch'],
                           batchTarget: false,
                           synchronous: true,
                           cwd: './'
                         })
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
                         .transform<ExecutableTransform, ExecutablePayload>(ExecutableTransform, publishPayload)
                         .transform<CheckInTransform>(CheckInTransform)
                         .transform<CommitTransform, CommitPayload>(CommitTransform, {comment: 'published'})
                         .transform<PushBranchTransform>(PushBranchTransform)
                         .execute(undefined);



