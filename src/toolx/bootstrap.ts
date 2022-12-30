/*
Created by Franz Zemen 12/01/2022
License Type: 
*/


import process from 'node:process';
import {stdout} from 'node:process'
import {Readable} from 'node:stream';
import {Duplex, ReadableOptions, Writable} from 'stream';
import yargs, {Arguments, Options} from 'yargs';
import {hideBin} from 'yargs/helpers';


type CommandOptions = ReadableOptions & {}

abstract class Command extends Readable {
  _read(size: number) {
    super._read(size);
  }

  constructor(options: CommandOptions) {
    super(options);
  }

}

type CommandArguments = {
  p?: boolean;
  prompt?: boolean;
  o?: string;
  options?: string;
  v?: string;
  verbose?: string;
  l?: string;
  logger?: string;
}


type BootstrapArguments = CommandArguments & {}

type YargsOptions = { [key: string]: Options };
type YargsCheckFunction<T> = (argv: Arguments<T>, aliases: { [alias: string]: string }) => any;

type CommandCliOptions<CommandArguments> = {
  yargsUsage?: string;
  yargsOptions?: YargsOptions; // Use demandOption attribute to automatically demand option
  yargsCheckFunction?: { function: YargsCheckFunction<CommandArguments>, global?: boolean }
  yargsCommand?: { command: string, description: string, demandString: string }
  yargsConflicts?: { [key: string]: string[] }
}
/*
function cli<CommandArguments>(cliOptions: CommandCliOptions<CommandArguments>): Arguments<CommandArguments> {
  let interim = yargs(hideBin(process.argv));
  if (cliOptions.yargsOptions) {
    interim = interim.options(cliOptions.yargsOptions);
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
  yargsUsage: 'Usage: $0 <path_to_project> [options]',
  yargsOptions: {
    'prompt': {
      alias: 'p',
      describe: 'Use prompts to verify/specify options',
      type: 'boolean',
      demandOption: true
    },
    'options': {
      alias: 'o',
      describe: 'Specify options file',
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
  yargsConflicts: {'prompt': ['options']},
  yargsCheckFunction: undefined, /* {
    function: (argv, options) => {

      let errorStr = undefined;

      if (argv.o !== undefined && argv.p) {
        return new Error('Only one of -p, --prompt and -o, --options may be specified');
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
- Resolve options (focus v first on using default)
- Git Init
- Create noon toolx_ directories hierarchy
- Save options to options file
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
