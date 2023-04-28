/*
Created by Franz Zemen 03/11/2023
License Type: MIT
*/

import {join} from 'node:path';
import {
  BuildError,
  BuildErrorNumber,
  DelPayload, DelTransform,
  CheckInTransform,
  CommitPayload,
  CommitTransform,
  CopyPayload,
  CopyTransform,
  CreateDirectoryPayload,
  CreateDirectoryTransform,
  CreatePackagePayload,
  CreatePackageTransform,
  ExecutablePayload,
  ExecutableTransform,
  MaleatePackagePayload,
  MaleatePackageTransform,
  ModuleType,
  Pipeline,
  PushBranchTransform,
  defaultDirectories
} from 'dual-build/project';

export enum BuildPipelineType {
  Clean   = 'Clean',
  Build   = 'Build',
  CheckIn = 'CheckIn',
  Push = 'Push',
  Publish = 'Publish',
}


export function getBuildPipeline(type: BuildPipelineType): Pipeline<any, any> {

  let pipeline: Pipeline<any, any> = Pipeline.options({name: type, logDepth: 0});
  switch (type) {
    case BuildPipelineType.Clean:
      return pipeline.transform<DelTransform, DelPayload>(DelTransform, {pattern: './out', recursive: true});
    case BuildPipelineType.Build:
    case BuildPipelineType.CheckIn:
    case BuildPipelineType.Push:
    case BuildPipelineType.Publish:
      pipeline = pipeline
        .transform<CreateDirectoryTransform, CreateDirectoryPayload>(CreateDirectoryTransform, {
          directory: defaultDirectories['out/dist/bin'],
          errorOnExists: false
        })
        .startParallel<CreatePackageTransform, CreatePackagePayload>(CreatePackageTransform, {
          targetPath: join(defaultDirectories['out/dist/esm'].directoryPath, 'package.json'),
          package: {
            type: ModuleType.module
          }
        })
        .parallel<CreatePackageTransform, CreatePackagePayload>(CreatePackageTransform, {
          targetPath: join(defaultDirectories['out/dist/cjs'].directoryPath, 'package.json'),
          package: {
            type: ModuleType.commonjs
          }
        })
        .endParallel<CreatePackageTransform, CreatePackagePayload>(CreatePackageTransform, ['void'], {
          targetPath: join(defaultDirectories['out/dist/bin'].directoryPath, 'package.json'),
          package: {
            type: ModuleType.module
          }
        })
        .transform<CopyTransform, CopyPayload>(CopyTransform, {
          src: './doc/project',
          dest: './out/dist',
          glob: '**/*.md',
          overwrite: true
        });
      break;
    default:
      throw new BuildError('Unrecognized BuildPipelineType', undefined, BuildErrorNumber.UnreachableCode);
  }
  switch (type) {
    case BuildPipelineType.Build:
      pipeline = pipeline
        .transform<MaleatePackageTransform, MaleatePackagePayload>(MaleatePackageTransform, {
          targetPath: './out/dist/package.json',
          exclusions: ['type', 'scripts', 'imports', 'exports', 'bin', 'devDependencies', 'nodemonConfig'],
          inclusions: {
            bin: {
              "bootstrap": "./bin/bootstrap"
            },
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
      return pipeline;
    case BuildPipelineType.CheckIn:
    case BuildPipelineType.Push:
    case BuildPipelineType.Publish:
      pipeline = pipeline
        .transform<CheckInTransform>(CheckInTransform)
        .transform<CommitTransform, CommitPayload>(CommitTransform, {comment: 'testing'});
      break;
  }
  switch (type) {
    case BuildPipelineType.CheckIn:
      return pipeline;
    case BuildPipelineType.Push:
      pipeline = pipeline
        .transform<PushBranchTransform>(PushBranchTransform);
      return pipeline;
    case BuildPipelineType.Publish:
      pipeline = pipeline
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
            bin: {
              "bootstrap": "./bin/bootstrap"
            },
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
        .transform<PushBranchTransform>(PushBranchTransform);
      return pipeline;
  }
}


