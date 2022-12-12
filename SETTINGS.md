# Using NodeJS  `package.json.imports` (see Node Documentation)

When running pure javascript, this works as documented.

However, for typescript, say for an internal `"imports": {"#dep"}`, typescript will not know how to load `#dep`.  To 
get this to work, set `tsconfig.json.compilerOptions.moduleResolution=Node16 | NodeNext`.  Why?  Lesser values such 
as `classic` and `Node` where created prior to the imports feature being introduced.

Tested this setting with `tsconfig.json.compilerOptions.target=ES6 => ES2022` and `tsconfig.json.compilerOptions.
module=CommonJS => NodeNext => ES2022`

Unlike some documentation out there, you don't need `tsconfig.json.compilerOptions.paths` set.

As a result of this, the bootstrapping process 
