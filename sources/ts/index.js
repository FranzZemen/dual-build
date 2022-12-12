const fs = require('fs');

fs.symlink('h:\\dev\\dual-build\\sources\\cjs', 'h:\\dev\\dual-build\\sources\\src\\root', 'junction', (err) =>  console.log(err));
