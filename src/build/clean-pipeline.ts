/*
Created by Franz Zemen 03/30/2023
License Type: 
*/


import {DelPayload, DelTransform, Pipeline, MergeType} from 'dual-build/project';

export const cleanPipeline = Pipeline
  .options({name: 'clean', logDepth: 0})
  .parallels([DelTransform, DelTransform], ['void'], [{pattern: './out', recursive: true}, {pattern: './bin', recursive: true}])
  //.transform<DelTransform, DelPayload>(DelTransform, {pattern: './out', recursive: true});
