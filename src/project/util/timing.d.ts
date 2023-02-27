import { LogInterface } from '../log/log-interface.js';
export type TimingUnit = 'µs' | 'ms' | 's';
export declare function startTiming(key: string, log: LogInterface): boolean;
export declare function endTiming(key: string, log: LogInterface): `in ${number} ${TimingUnit}` | '';
export declare function isTimingNotFound(timing: `${number} ${TimingUnit}` | `timing key ${string} not found`): timing is `timing key ${string} not found`;
export declare function clearTiming(key: string): void;
