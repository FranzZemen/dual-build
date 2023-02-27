import { TransformIndependent } from '../../transform-independent.js';
/**
 * Assumes cwd has been set, but verifies it
 */
export declare class InstallGitignore extends TransformIndependent {
    constructor(logDepth: number);
    executeImplIndependent(): Promise<void>;
    transformContext(rootPath: undefined): string;
}
