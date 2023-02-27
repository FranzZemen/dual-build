/*
Created by Franz Zemen 12/01/2022
License Type:
*/
import { Readable } from 'node:stream';
import { Duplex } from 'stream';
class Command extends Readable {
    _read(size) {
        super._read(size);
    }
    constructor(options) {
        super(options);
    }
}
/*
function cli<CommandArguments>(cliOptions: CommandCliOptions<CommandArguments>): Arguments<CommandArguments> {
  let interim = yargs(hideBin(process.argv));
  if (cliOptions.yargsOptions) {
    interim = interim.gitOptions(cliOptions.yargsOptions);
  }
  if (cliOptions.yargsConflicts) {
    interim = interim.conflicts(cliOptions.yargsConflicts);
  }
  if (cliOptions.yargsCheckFunction) {
    interim = interim.check(cliOptions.yargsCheckFunction.function, cliOptions.yargsCheckFunction.global);
  }
  if (cliOptions.yargsUsage !== undefined) {
    interim = interim.usage(cliOptions.yargsUsage);
  }
  if (cliOptions.yargsCommand) {
    interim = interim.command(cliOptions.yargsCommand.command, cliOptions.yargsCommand.demandString);
    interim = interim.demandCommand(1, cliOptions.yargsCommand.demandString);
  }
  const args: Arguments<CommandArguments> = interim.parseSync() as Arguments<CommandArguments>;
  return args;
}

const bootstrapCliOptions: CommandCliOptions<BootstrapArguments> = {
  yargsUsage: 'Usage: $0 <path_to_project> [gitOptions]',
  yargsOptions: {
    'prompt': {
      alias: 'p',
      describe: 'Use prompts to verify/specify gitOptions',
      type: 'boolean',
      demandOption: true
    },
    'gitOptions': {
      alias: 'o',
      describe: 'Specify gitOptions file',
      type: 'string'
    },
    'verbose': {
      alias: 'v',
      describe: 'Specify log level (debug, info, warn or error)',
      type: 'string'
    },
    'logger': {
      alias: 'l',
      describe: 'Path to custom logger',
      type: 'string'
    }
  },
  yargsConflicts: {'prompt': ['gitOptions']},
  yargsCheckFunction: undefined, /* {
    function: (argv, gitOptions) => {

      let errorStr = undefined;

      if (argv.o !== undefined && argv.p) {
        return new Error('Only one of -p, --prompt and -o, --gitOptions may be specified');
      } else {
        return true;
      }
    }

  },
  */
//yargsCommand: {command: '<path_to_project>', description: 'Path to ..dual-build', demandString: 'Enter path_to_project'}
//};
// console.log(cli<BootstrapArguments>(bootstrapCliOptions));
class SideStream extends Duplex {
    constructor() {
        super();
    }
}
/*
class Bootstrap extends Readable {
  constructor() {
    super({objectMode: false});
  }

  _read(size: number) {
    this.push(JSON.stringify(cli<BootstrapArguments>(bootstrapCliOptions)));
    this.push(null);
  }
}

const bootstrap = new Bootstrap();

bootstrap.pipe(stdout);


/*
- Resolve gitOptions (focus v first on using default)
- Git Init
- Create noon toolx_ directories hierarchy
- Save gitOptions to gitOptions file
- Createxkages and tsconfigs from defaults
- create sample source _tests from defaults
- npm i
- build steps
- clean
- copy to build (incremental, last build)
- template replacement
- tsc (compiler template),constance template
-copy json, js, md, other sources, use template format)
- handle and document special dual cases, (make those the sample source)
-






- logger, file logger, timings, formatted output, use logger adapter.
 */
