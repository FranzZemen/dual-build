/*
Created by Franz Zemen 01/25/2023
License Type: 
*/

/**
 * Defines how we think about where the test files are.
 *
 * Note that the directory test in Directories needs to be consistent
 */
export type TestLocationStrategy =
  'commingled'    // Source files and test files in same folder, ex: src/foo.ts, src/foo.test.ts
  | 'collocated'  // Source files and test files under same root, ex: src/foo.ts, src/bar/bar.ts, src/test/foo.test.ts, src/test//bar/bar.test.ts
  | 'distinct';   // Source files and test files in distinct root folders, ex: src/foo.ts, test/foo.ts

export type TestFileImportStrategy =
  'explicit-collocated'     // Test import relative paths point explicitly to source locations, which must be matched after transpilation
  | 'explicit-distribution' // Test import relative paths point to the distribution root..i.e. hard coded to point to "dist/.." for example, and types must exist there as well
  | 'self-referencing'      // Test import relative paths point back to the package - moduleResolution = Node16, NodeNext only
  | 'imports'               // Test import relative paths point to imports declarations = moduleResolution = Node16, NodeNext only
  | 'rootDirs'              // Test import relative paths are in a virtual root, different real locations, which must be matched after transpilation
  | 'baseUrl'               // Test import relative paths are relative to a baseUrl, implying collocation/commingling, which must be matched after transpilation
  | 'paths'                 // Test import relative paths are relative to paths mapping, which must be matched after transpilation


export type TestStrategy = {
  locationStrategy: TestLocationStrategy;
  importStrategy: TestFileImportStrategy;
  packageTesting: boolean;          // Package testing is a set of tests that are run against an installed version of the package
  testFilePatterns: string[];
  packageTestFilePatterns: string[];
}

export const defaultTestStrategy: TestStrategy = {
  locationStrategy: 'distinct',
  importStrategy: 'rootDirs',
  packageTesting: true,
  testFilePatterns: ["**/*.test.js", "**/*.spec.js"],
  packageTestFilePatterns: ["**/*.package-test.js", "**/*.package-spec.js"]
}
