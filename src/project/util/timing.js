/*
Created by Franz Zemen 12/24/2022
License Type: MIT
*/
import { performance } from 'node:perf_hooks';
const keys = [];
export function startTiming(key, log) {
    if (keys.includes(key)) {
        log.info(`timing key ${key} already used`, 'error');
        return false;
    }
    keys.push(key);
    performance.mark(key);
    return true;
}
export function endTiming(key, log) {
    if (keys.includes(key)) {
        const measure = performance.measure(key, key);
        let units = 'ms';
        let value = Math.ceil(measure.duration);
        if (measure.duration < 1) {
            units = 'µs';
            value = Math.ceil(measure.duration * 1000);
        }
        else if (measure.duration > 1000) {
            units = 's';
            value = Math.ceil(measure.duration / 1000);
        }
        clearTiming(key);
        return `in ${value} ${units}`;
    }
    else {
        log.info(`timing key ${key} not found`, 'error');
        return '';
    }
}
export function isTimingNotFound(timing) {
    return timing.startsWith('timing');
}
export function clearTiming(key) {
    const ndx = keys.indexOf(key);
    if (ndx > -1) {
        keys.splice(ndx, 1);
    }
    performance.clearMarks(key);
    performance.clearMeasures(key);
}
