/*
Created by Franz Zemen 03/30/2023
License Type: 
*/


import {DelPayload} from 'dual-build/project';
import {Pipeline} from 'dual-build/project';
import {DelTransform} from  'dual-build/project';

Pipeline
  .options({name:'clean', logDepth: 0})
  .transform<DelTransform, DelPayload>(DelTransform, {pattern: './out/bin'})
  .execute(undefined);
