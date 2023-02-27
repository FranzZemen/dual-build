/*
Created by Franz Zemen 01/25/2023
License Type:
*/
export const defaultTestStrategy = {
    locationStrategy: 'distinct',
    importStrategy: 'rootDirs',
    packageTesting: true,
    testFilePatterns: ["**/*.test.js", "**/*.spec.js"],
    packageTestFilePatterns: ["**/*.package-test.js", "**/*.package-spec.js"]
};
