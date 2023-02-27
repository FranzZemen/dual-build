export declare enum BuildErrorNumber {
    UnreachableCode = "Error 1: Unreachable code or unexpected logic path",
    DirectoryAlreadyExists = "Error 50: Directory already exists",
    NoExecutablePayload = "Error 500: No payload provided for ExecutableTransform",
    AsyncExecError = "Error 501: Asynchronous executable errored out",
    SyncExecError = "Error 502: Synchronous executable errored out",
    VersionIsNotSemver = "Error 5000: Version string does not represent a semver"
}
export declare class BuildError extends Error {
    readonly errorNumber?: BuildErrorNumber | undefined;
    constructor(message?: string, options?: ErrorOptions, errorNumber?: BuildErrorNumber | undefined);
}
