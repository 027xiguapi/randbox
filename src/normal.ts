/**
 * Normal distribution module for RandBox.js
 * Contains normal distribution generation functions
 */

import { RandBox, initOptions, testRange } from "./core.js";

// Normal distribution
export function normal(this: RandBox, options?: any) {
    options = initOptions(options, { mean: 0, dev: 1, pool: [] });

    testRange(
        options.pool.constructor !== Array,
        "RandBox: The pool option must be a valid array."
    );
    testRange(
        typeof options.mean !== 'number',
        "RandBox: Mean (mean) must be a number"
    );
    testRange(
        typeof options.dev !== 'number',
        "RandBox: Standard deviation (dev) must be a number"
    );

    // If a pool has been passed, then we are returning an item from that pool,
    // using the normal distribution settings that were passed in
    if (options.pool.length > 0) {
        return this.normal_pool(options);
    }

    // The Marsaglia Polar method
    var s: number, u: number, v: number, norm: number,
        mean = options.mean,
        dev = options.dev;

    do {
        // U and V are from the uniform distribution on (-1, 1)
        u = this.random() * 2 - 1;
        v = this.random() * 2 - 1;

        // S = U^2 + V^2
        s = u * u + v * v;
    } while (s >= 1);

    // Math.sqrt(-2 * Math.log(s) / s) * u;
    norm = Math.sqrt(-2 * Math.log(s) / s) * u;
    return dev * norm + mean;
}

// Normal distribution from pool
export function normal_pool(this: RandBox, options?: any) {
    var performanceCounter = 0;
    do {
        var idx = Math.round(this.normal({ mean: options.mean, dev: options.dev }));
        if (idx < options.pool.length && idx >= 0) {
            return options.pool[idx];
        } else {
            performanceCounter++;
        }
    } while (performanceCounter < 100);

    throw new RangeError("RandBox: Your pool is too small for the given mean and standard deviation. Please adjust.");
}

export const normal_module = {
    normal,
    normal_pool
};
