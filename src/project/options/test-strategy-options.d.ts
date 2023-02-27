/**
 * Defines how we think about where the test files are.
 *
 * Note that the directory test in Directories needs to be consistent
 */
export type TestLocationStrategy = 'commingled' | 'collocated' | 'distinct';
export type TestFileImportStrategy = 'explicit-collocated' | 'explicit-distribution' | 'self-referencing' | 'imports' | 'rootDirs' | 'baseUrl' | 'paths';
export type TestStrategy = {
    locationStrategy: TestLocationStrategy;
    importStrategy: TestFileImportStrategy;
    packageTesting: boolean;
    testFilePatterns: string[];
    packageTestFilePatterns: string[];
};
export declare const defaultTestStrategy: TestStrategy;
