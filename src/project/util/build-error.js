/*
Created by Franz Zemen 01/05/2023
License Type: MIT
*/
export var BuildErrorNumber;
(function (BuildErrorNumber) {
    BuildErrorNumber["UnreachableCode"] = "Error 1: Unreachable code or unexpected logic path";
    BuildErrorNumber["DirectoryAlreadyExists"] = "Error 50: Directory already exists";
    // Child Process Errors
    BuildErrorNumber["NoExecutablePayload"] = "Error 500: No payload provided for ExecutableTransform";
    BuildErrorNumber["AsyncExecError"] = "Error 501: Asynchronous executable errored out";
    BuildErrorNumber["SyncExecError"] = "Error 502: Synchronous executable errored out";
    // Miscellaneous
    BuildErrorNumber["VersionIsNotSemver"] = "Error 5000: Version string does not represent a semver";
})(BuildErrorNumber = BuildErrorNumber || (BuildErrorNumber = {}));
export class BuildError extends Error {
    errorNumber;
    constructor(message, options, errorNumber) {
        super(message, options);
        this.errorNumber = errorNumber;
    }
}
