# Commands

Commands are the top level API and are intended to be called both through the package manager (assume npx for the 
purposes of this documentation, but could also be pnmp/yarn dlx) or programmatically.  Therefore, commands are 
propagated both to the public index.js and to the public package.json/bin locations.

Typically, commands will orchestrate actions, which in turn will be composed of tasks.  In the edge cases, for 
example ``clean`` the command ``clean`` has the same name as the action ``clean``, which is composed of the task 
wrapped around``del``, a popular third party package.

````
  npx clean -
