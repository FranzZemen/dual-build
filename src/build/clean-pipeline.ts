/*
Created by Franz Zemen 03/30/2023
License Type: 
*/


import {DelPayload, DelTransform, Pipeline} from 'dual-build/project';

export const cleanPipeline = Pipeline
  .options({name: 'clean', logDepth: 0})
  .transform<DelTransform, DelPayload>(DelTransform, {pattern: './out', recursive: true});
