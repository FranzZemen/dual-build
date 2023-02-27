# Code Generation

| target |  module  | moduleResolution | type | loading | node features | consistent | notes |
|:------:|:--------:|:----------------:|:----:|:-------:|:-------------:|:----------:|:------|
|  es6   | commonjs |       node       | n/a  |   esm   |     basic     |    yes     |       |
|  es6   |          |                  |      |         |               |            |       |

Note: Package.json "imports" and "exports" need to point to distribution js and types file as 
expected for run time behavior, but also for typescript - typescript is compatible, but you don't 
point to source folders, you point to the code-generation location.
