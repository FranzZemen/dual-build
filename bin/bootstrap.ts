#!/usr/bin-command/env node

import {CommandHook, BootstrapCommand, Hooks} from '../publish/index.js';

const hooks: Hooks = {
  beforeCommand: () => console.log('before command')
}

@CommandHook({
  beforeCommand: () => console.log('before command')
} satisfies Hooks)
class HookedBootstrapCommand extends BootstrapCommand {
  constructor() {
    super();
  }


}
(new HookedBootstrapCommand()).execute();
