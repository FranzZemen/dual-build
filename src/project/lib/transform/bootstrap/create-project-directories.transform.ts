import {TransformConstructor, TransformPayload} from "../../../transform/index.js";
import {Directories, DirectoryPath} from "../../../options/index.js";
import {cwd} from "node:process";
import {basename} from "node:path";
import {Pipeline} from "../../../pipeline/index.js";
import {CreateDirectoryPayload, CreateDirectoryTransform} from "../create-directory.transform.js";
import {ChangeWorkingDirectory} from "../change-working-directory.transform.js";

// Payload type that contains the Directories type and ProjectName
export type CreateProjectPayload = {
  directories: Directories;
}


/**
 * This class is responsible for creating the project directories.  It begins by looking for the directory called 'root'
 * using the directory path specified in the payload.  If it does not exist, it creates it with the name directoryPath.
 * It then creates all the directories specified in the Directories type as subdirectories.  If the current directory specified
 * by cwd() already exists as the directoryPath named by root, it does not create it, but cdw()s to it.
 */
export class CreateProjectDirectoriesTransform extends TransformPayload<CreateProjectPayload> {
  constructor(logDepth: number) {
    super(logDepth);
  }

  protected executeImplPayload(payload: CreateProjectPayload): Promise<void> {
    // Find the entry in payload.directories that has the name 'root'
    const root = payload.directories.root;
    if (!root) {
      throw new Error('No root directory specified in payload.directories');
    }
    const innerPipeline = Pipeline.options({logDepth: this.logDepth + 1, name: 'create-project-directories'});
    // Check if cwd() is the same as root.directoryPath
    // If it is, then do not create the directory, but cdw() to it
    // If it is not, queue to create the directory and cdw() to it
    const currPath = cwd();
    const rootPath = root.directoryPath as string;
    if (basename(currPath) !== rootPath) {
      innerPipeline
        // create the root directory
        .transform<CreateDirectoryTransform, CreateDirectoryPayload>(CreateDirectoryTransform, {
          directory: rootPath,
          errorOnExists: true
        })
        // cwd into the root directory
        .transform<ChangeWorkingDirectory, string>(ChangeWorkingDirectory, rootPath);
    }
    let parallelWork: CreateDirectoryPayload[] = [];
    let createDirectoryTransforms: TransformConstructor<any>[] = []
    // Create all the subdirectories
    let key: DirectoryPath | 'root';
    for ( key in payload.directories) {
      if (key === 'root') {
        continue;
      }
      if (!payload.directories[key].autogenerated) {
        parallelWork.push({directory: payload.directories[key].directoryPath, errorOnExists: false});
        createDirectoryTransforms.push(CreateDirectoryTransform);
      }
    }
    innerPipeline.parallels(createDirectoryTransforms, ['asPipedIn'], parallelWork);
    return innerPipeline.execute(undefined);
  }

  protected transformContext(pipeIn: undefined,
                             payload: CreateProjectPayload | undefined): string | object | Promise<string | object> {
    return payload ?? '';
  }
}