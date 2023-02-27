import { BootstrapOptions } from '../../options/bootstrap.options.js';
import { BootstrapTransform } from './bootstrap-transform.js';
/**
 * Creates project directories, if they don't exist, applying bootstrap rules that impact which directories actually should be created.
 *
 * Does not create project directories if they already exist.
 *
 * Warns of project directories that should not exist under bootstrap options, but are found to be there.
 */
export declare class CreateProjectDirectoriesAndCwd extends BootstrapTransform<undefined> {
    constructor(logDepth: number);
    executeBootstrapImpl(bootstrapOptions: BootstrapOptions): Promise<void>;
    transformContext(payload: BootstrapOptions): string;
}
