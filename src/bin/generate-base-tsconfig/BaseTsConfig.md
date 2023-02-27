# base-ts-config

This bin command regenerates the default `./tsconfig.base.json` based on the latest available
programmatic type in the source (which is assumed to keep up with typescript specs).

`./tsconfig.base.json` is a git tracked file and by design the bin command does **not** check it
back into git automatically.
