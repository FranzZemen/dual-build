import {readFileAsJson} from "../util/index.js"

export type BootstrapConfiguration = {
    type: 'bootstrap',
}

export function isConfiguration(t: any): t is BootstrapConfiguration {
    return t && typeof t === 'object' && typeof t.type === 'string' && t.type === 'bootstrap';
}

export function loadConfiguration(filename: string): Promise<BootstrapConfiguration> {
  return readFileAsJson<BootstrapConfiguration>(filename, isConfiguration);
}
