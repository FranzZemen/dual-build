/*
Created by Franz Zemen 02/06/2023
License Type: 
*/

import {
  CheckInTransform,
  CommitPayload,
  CommitTransform,
  CreatePackagePayload,
  CreatePackageTransform,
  MaleatePackagePayload,
  MaleatePackageTransform,
  ExecutablePayload,
  ExecutableTransform,
  ModuleType,
  Pipeline,
  PushBranchTransform
} from 'dual-build/project';
import {transpilePayload} from './default-payloads.js';


const pipeline = Pipeline.options({name: 'Build', logDepth: 0})
  // Compile all typescript - what's needed for the local build as well as for the package build via tsc project
                         .transform<ExecutableTransform, ExecutablePayload>(ExecutableTransform, transpilePayload)
  // For local usage maleate package.json to "out" and point exports/imports to real code
  /*
  .transform<MaleatePackageTransform, MaleatePackagePayload>(MaleatePackageTransform, {
    targetPath: './out/package.json',
    exclusions: ['type', 'scripts', 'imports', 'exports', 'bin', 'devDependencies', 'nodemonConfig'],
    inclusions: {
      './project': {
        'types': './dist/types/index.d.ts',
        'import': './dist/esm/index.js'
      }
      ,
      'imports': {
        '#project': './dist/esm/index.js'
      }
    }
  })

   */
  // For published distribution, maleate package.json appropriately
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
                         .transform<CreatePackageTransform, CreatePackagePayload>(CreatePackageTransform, {
                           targetPath: './out/dist/esm/package.json',
                           package: {type: ModuleType.module}
                         })
                         .transform<CreatePackageTransform, CreatePackagePayload>(CreatePackageTransform, {
                           targetPath: './out/dist/cjs/package.json',
                           package: {type: ModuleType.commonjs}
                         })
                         .transform<CheckInTransform>(CheckInTransform)
                         .transform<CommitTransform, CommitPayload>(CommitTransform, undefined)
                         .transform<PushBranchTransform>(PushBranchTransform)
                         .execute(undefined);



