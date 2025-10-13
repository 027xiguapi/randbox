/**
 * Basics module for RandBox.js (TypeScript version)
 * Contains basic random generation functions
 */

import {
    initOptions,
    testRange,
    MAX_INT,
    MIN_INT,
    NUMBERS,
    CHARS_LOWER,
    CHARS_UPPER,
    HEX_POOL,
    UnsupportedError,
    RandBox
} from './core.js';

import {
    BoolOptions,
    FalsyOptions,
    AnimalOptions,
    CharacterOptions,
    FloatingOptions,
    IntegerOptions,
    NaturalOptions,
    PrimeOptions,
    HexOptions,
    LetterOptions,
    StringOptions,
    BufferOptions
} from './types.js';

/**
 *  Return a random bool, either true or false
 */
export function bool(this: RandBox, options?: Partial<BoolOptions>): boolean {
    // likelihood of success (true)
    const opts = initOptions(options, { likelihood: 50 } as BoolOptions);

    // Note, we could get some minor perf optimizations by checking range
    // prior to initializing defaults, but that makes code a bit messier
    // and the check more complicated as we have to check existence of
    // the object then existence of the key before checking constraints.
    // Since the options initialization should be minor computationally,
    // decision made for code cleanliness intentionally. This is mentioned
    // here as it's the first occurrence, will not be mentioned again.
    testRange(
        opts.likelihood < 0 || opts.likelihood > 100,
        "RandBox: Likelihood accepts values from 0 to 100."
    );

    return this.random() * 100 < opts.likelihood;
}

export function falsy(this: RandBox, options?: Partial<FalsyOptions>): any {
    const opts = initOptions(options, { pool: [false, null, 0, NaN, '', undefined] } as FalsyOptions);
    const pool = opts.pool;
    const index = this.integer({ min: 0, max: pool.length - 1 });
    return pool[index];
}

export function animal(this: RandBox, options?: AnimalOptions): string {
    const opts = initOptions(options, {}) as AnimalOptions;

    if (typeof opts.type !== 'undefined') {
        testRange(
            !this.get("animals")[opts.type.toLowerCase()],
            "Please pick from desert, ocean, grassland, forest, zoo, pets, farm."
        );
        return this.pick(this.get("animals")[opts.type.toLowerCase()]);
    }

    const animalTypeArray = ["desert", "forest", "ocean", "zoo", "farm", "pet", "grassland"];
    return this.pick(this.get("animals")[this.pick(animalTypeArray)]);
}

/**
 *  Return a random character.
 */
export function character(this: RandBox, options?: CharacterOptions): string {
    const opts = initOptions(options, {} as CharacterOptions);

    const symbols = "!@#$%^&*()[]";
    let letters: string;
    let pool: string;

    if (opts.casing === 'lower') {
        letters = CHARS_LOWER;
    } else if (opts.casing === 'upper') {
        letters = CHARS_UPPER;
    } else {
        letters = CHARS_LOWER + CHARS_UPPER;
    }

    if (opts.pool) {
        pool = opts.pool;
    } else {
        pool = '';
        if (opts.alpha) {
            pool += letters;
        }
        if (opts.numeric) {
            pool += NUMBERS;
        }
        if (opts.symbols) {
            pool += symbols;
        }
        if (!pool) {
            pool = letters + NUMBERS + symbols;
        }
    }

    return pool.charAt(this.natural({ max: pool.length - 1 }));
}

/**
 *  Return a random floating point number
 */
export function floating(this: RandBox, options?: Partial<FloatingOptions>): number {
    const opts = initOptions(options, { fixed: 4 } as FloatingOptions);

    testRange(
        !!(opts.fixed && opts.precision),
        "RandBox: Cannot specify both fixed and precision."
    );

    const fixed = Math.pow(10, opts.fixed);
    const max = MAX_INT / fixed;
    const min = -max;

    testRange(
        !!(opts.min && opts.fixed && opts.min < min),
        "RandBox: Min specified is out of range with fixed. Min should be, at least, " + min
    );
    testRange(
        !!(opts.max && opts.fixed && opts.max > max),
        "RandBox: Max specified is out of range with fixed. Max should be, at most, " + max
    );

    const finalOpts = initOptions(opts, { min, max } as FloatingOptions);

    const num = this.integer({ min: finalOpts.min * fixed, max: finalOpts.max * fixed });
    const numFixed = (num / fixed).toFixed(finalOpts.fixed);

    return parseFloat(numFixed);
}

/**
 *  Return a random integer
 */
export function integer(this: RandBox, options?: Partial<IntegerOptions>): number {
    const opts = initOptions(options, { min: MIN_INT, max: MAX_INT } as IntegerOptions);
    testRange(opts.min > opts.max, "RandBox: Min cannot be greater than Max.");

    return Math.floor(this.random() * (opts.max - opts.min + 1) + opts.min);
}

/**
 *  Return a random natural number
 */
export function natural(this: RandBox, options?: Partial<NaturalOptions>): number {
    let opts = initOptions(options, { min: 0, max: MAX_INT } as NaturalOptions);

    if (typeof opts.numerals === 'number') {
        testRange(opts.numerals < 1, "RandBox: Numerals cannot be less than one.");
        opts.min = Math.pow(10, opts.numerals - 1);
        opts.max = Math.pow(10, opts.numerals) - 1;
    }

    testRange(opts.min < 0, "RandBox: Min cannot be less than zero.");

    if (opts.exclude) {
        testRange(!Array.isArray(opts.exclude), "RandBox: exclude must be an array.");

        for (const exclusionIndex in opts.exclude) {
            testRange(!Number.isInteger(opts.exclude[exclusionIndex]), "RandBox: exclude must be numbers.");
        }

        let random = opts.min + this.natural({ max: opts.max - opts.min - opts.exclude.length });
        const sortedExclusions = opts.exclude.sort((a, b) => a - b);

        for (const sortedExclusionIndex in sortedExclusions) {
            if (random < sortedExclusions[sortedExclusionIndex]) {
                break;
            }
            random++;
        }
        return random;
    }

    return this.integer(opts);
}

/**
 *  Return a random prime number
 *
 *  NOTE the max and min are INCLUDED in the range.
 *
 *  @param {Object} [options={}] can specify a min and/or max
 *  @returns {Number} a single random prime number
 *  @throws {RangeError} min cannot be greater than max nor negative
 */
export function prime(this: RandBox, options?: Partial<PrimeOptions>): number {
    const opts = initOptions(options, { min: 0, max: 10000 } as PrimeOptions);

    testRange(opts.min < 0, "RandBox: Min cannot be less than zero.");
    testRange(opts.min > opts.max, "RandBox: Min cannot be greater than Max.");

    const primes = this.get('primes');
    let primesList = primes ? [...primes] : [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];

    // Extend primes list if needed
    const maxPrime = Math.max(...primesList);
    if (opts.max > maxPrime) {
        // Start checking from the next odd number after maxPrime
        let candidate = maxPrime % 2 === 0 ? maxPrime + 1 : maxPrime + 2;

        while (candidate <= opts.max) {
            if (this.is_prime(candidate)) {
                primesList.push(candidate);
            }
            candidate += 2; // Only check odd numbers (except 2)
        }
    }

    // Filter primes within the specified range (inclusive)
    const targetPrimes = primesList.filter((p: number) => p >= opts.min && p <= opts.max);

    if (targetPrimes.length === 0) {
        throw new RangeError(`RandBox: No primes found between ${opts.min} and ${opts.max}`);
    }

    return this.pick(targetPrimes);
}

/**
 * Determine whether a given number is prime or not.
 *
 * Uses an optimized trial division algorithm that checks only
 * numbers of the form 6k±1 after handling special cases.
 *
 * @param {Number} n the number to test for primality
 * @returns {Boolean} true if n is prime, false otherwise
 */
export function is_prime(this: RandBox, n: number): boolean {
    // Handle non-integers and numbers less than 2
    if (n % 1 !== 0 || n < 2) {
        return false;
    }

    // Handle small primes
    if (n === 2 || n === 3) {
        return true;
    }

    // All primes > 3 are of the form 6k ± 1
    // Numbers divisible by 2 or 3 are not prime (except 2 and 3)
    if (n % 2 === 0 || n % 3 === 0) {
        return false;
    }

    // Check for divisors of the form 6k ± 1 up to √n
    const limit = Math.sqrt(n);
    for (let i = 5; i <= limit; i += 6) {
        if (n % i === 0 || n % (i + 2) === 0) {
            return false;
        }
    }

    return true;
}

/**
 *  Return a random hex number as string
 */
export function hex(this: RandBox, options?: Partial<HexOptions>): string {
    const opts = initOptions(options, { min: 0, max: MAX_INT, casing: 'lower' } as HexOptions);
    testRange(opts.min < 0, "RandBox: Min cannot be less than zero.");

    const integerValue = this.natural({ min: opts.min, max: opts.max });

    if (opts.casing === 'upper') {
        return integerValue.toString(16).toUpperCase();
    }
    return integerValue.toString(16);
}

export function letter(this: RandBox, options?: Partial<LetterOptions>): string {
    const opts = initOptions(options, { casing: 'lower' } as LetterOptions);
    const pool = "abcdefghijklmnopqrstuvwxyz";
    let letterValue = this.character({ pool });

    if (opts.casing === 'upper') {
        letterValue = letterValue.toUpperCase();
    }
    return letterValue;
}

/**
 *  Return a random string
 *
 *  @param {Object} [options={}] can specify a length or min and max
 *  @returns {String} a string of random length
 *  @throws {RangeError} length cannot be less than zero
 */
export function string(this: RandBox, options?: Partial<StringOptions>): string {
    const opts = initOptions(options, { min: 5, max: 20 } as StringOptions);

    if (opts.length !== 0 && !opts.length) {
        opts.length = this.natural({ min: opts.min, max: opts.max });
    }

    testRange((opts.length || 0) < 0, "RandBox: Length cannot be less than zero.");
    const length = opts.length || 0;
    const text = this.n(this.character, length, opts);

    return text.join("");
}

/**
 *  Return a random string matching the given template.
 *
 *  The template consists of any number of "character replacement" and
 *  "character literal" sequences. A "character replacement" sequence
 *  starts with a left brace, has any number of special replacement
 *  characters, and ends with a right brace. A character literal can be any
 *  character except a brace or a backslash. A literal brace or backslash
 *  character can be included in the output by escaping with a backslash.
 *
 *  The following replacement characters can be used in a replacement
 *  sequence:
 *
 *      "#": a random digit
 *      "a": a random lower case letter
 *      "A": a random upper case letter
 *
 *  Example: chance.template('{AA###}-{##}')
 *
 *  @param {String} template string.
 *  @returns {String} a random string matching the template.
 */
export function template(this: RandBox, templateStr?: string): string {
    if (!templateStr) {
        throw new Error('Template string is required');
    }

    interface Token {
        c: string;
        substitute(chance?: RandBox): string;
    }

    function CopyToken(this: Token, c: string): void {
        this.c = c;
    }

    CopyToken.prototype = {
        substitute: function () {
            return this.c;
        }
    };

    function EscapeToken(this: Token, c: string): void {
        this.c = c;
    }

    EscapeToken.prototype = {
        substitute: function () {
            if (!/[{}\\]/.test(this.c)) {
                throw new Error('Invalid escape sequence: "\\' + this.c + '".');
            }
            return this.c;
        }
    };

    function ReplaceToken(this: Token & { replacers: any }, c: string): void {
        this.c = c;
    }

    ReplaceToken.prototype = {
        replacers: {
            '#': function (chance: RandBox) { return chance.character({ pool: NUMBERS }); },
            'A': function (chance: RandBox) { return chance.character({ pool: CHARS_UPPER }); },
            'a': function (chance: RandBox) { return chance.character({ pool: CHARS_LOWER }); },
        },

        substitute: function (chance: RandBox) {
            const replacer = this.replacers[this.c];
            if (!replacer) {
                throw new Error('Invalid replacement character: "' + this.c + '".');
            }
            return replacer(chance);
        }
    };

    function parseTemplate(template: string) {
        const tokens: any[] = [];
        let mode = 'identity';

        for (let i = 0; i < template.length; i++) {
            const c = template[i];
            switch (mode) {
                case 'escape':
                    tokens.push(new (EscapeToken as any)(c));
                    mode = 'identity';
                    break;
                case 'identity':
                    if (c === '{') {
                        mode = 'replace';
                    } else if (c === '\\') {
                        mode = 'escape';
                    } else {
                        tokens.push(new (CopyToken as any)(c));
                    }
                    break;
                case 'replace':
                    if (c === '}') {
                        mode = 'identity';
                    } else {
                        tokens.push(new (ReplaceToken as any)(c));
                    }
                    break;
            }
        }
        return tokens;
    }

    const tokens = parseTemplate(templateStr);
    return tokens.map(token => token.substitute(this)).join('');
}

/**
 *  Return a random buffer
 */
export function buffer(this: RandBox, options?: Partial<BufferOptions>): Buffer {
    if (typeof Buffer === 'undefined') {
        throw new UnsupportedError('Sorry, the buffer() function is not supported on your platform');
    }

    const opts = initOptions(options, { length: this.natural({ min: 5, max: 20 }) } as BufferOptions);
    testRange(opts.length < 0, "RandBox: Length cannot be less than zero.");

    const content = this.n(() => this.character(opts), opts.length, opts);
    return Buffer.from(content);
}

// Export collection for easy prototype extension
export const basics = {
    bool,
    falsy,
    animal,
    character,
    floating,
    integer,
    natural,
    prime,
    is_prime,
    hex,
    letter,
    string,
    template,
    buffer
};