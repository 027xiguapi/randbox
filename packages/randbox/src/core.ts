/**
 * Core RandBox.js module
 * Contains the main constructor, constants, and utility functions
 */

// Types
export type SeedValue = string | number | (() => number) | null;

export interface RandBoxConstructor {
    new (seed?: SeedValue): RandBox;
    (seed?: SeedValue): RandBox;
}

// Constants
export const MAX_INT = 9007199254740992;
export const MIN_INT = -MAX_INT;
export const NUMBERS = '0123456789';
export const CHARS_LOWER = 'abcdefghijklmnopqrstuvwxyz';
export const CHARS_UPPER = CHARS_LOWER.toUpperCase();
export const HEX_POOL = NUMBERS + "abcdef";

// Errors
export class UnsupportedError extends Error {
    name = 'UnsupportedError';

    constructor(message?: string) {
        super(message || 'This feature is not supported on this platform');
        this.name = 'UnsupportedError';
    }
}

// Cached array helpers
export const slice = Array.prototype.slice;

// Utility functions
/**
 * Initialize options with defaults
 * @param options - Options to initialize
 * @param defaults - Default values to use
 * @returns Merged options with defaults
 */
export function initOptions<T extends Record<string, any>>(
    options?: Partial<T> | undefined,
    defaults?: T
): T {
    options = options || {};

    if (defaults) {
        for (var i in defaults) {
            if (typeof options[i] === 'undefined') {
                options[i] = defaults[i];
            }
        }
    }

    return options as T;
}

/**
 * Generate an array of numbers from 0 to size-1
 * @param size - The size of the array to generate
 * @returns Array of numbers from 0 to size-1
 */
export function range(size: number): number[] {
    return Array.apply(null, Array(size)).map((_, i) => i);
}

/**
 * Test a condition and throw a RangeError if true
 * @param test - The condition to test
 * @param errorMessage - The error message to throw
 * @throws {RangeError} When test condition is true
 */
export function testRange(test: boolean, errorMessage: string): void {
    if (test) {
        throw new RangeError(errorMessage);
    }
}

/**
 * Encode the input string with Base64.
 */
let base64: (input: string) => string = function() {
    throw new Error('No Base64 encoder available.');
};

// Select proper Base64 encoder.
(function determineBase64Encoder() {
    if (typeof btoa === 'function') {
        base64 = btoa;
    } else if (typeof Buffer === 'function') {
        base64 = function(input: string): string {
            return Buffer.from(input).toString('base64');
        };
    }
})();

export { base64 };

// BlueImpMD5 Implementation
export class BlueImpMD5 {
    VERSION = '1.0.1';

    /*
    * Add integers, wrapping at 2^32. This uses 16-bit operations internally
    * to work around bugs in some JS interpreters.
    */
    /**
     * Add integers, wrapping at 2^32. This uses 16-bit operations internally
     * to work around bugs in some JS interpreters.
     * @param x - First number
     * @param y - Second number
     * @returns Sum with wraparound
     */
    safe_add(x: number, y: number): number {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF),
            msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }

    /*
    * Bitwise rotate a 32-bit number to the left.
    */
    /**
     * Bitwise rotate a 32-bit number to the left.
     * @param num - Number to rotate
     * @param cnt - Number of bits to rotate
     * @returns Rotated number
     */
    bit_roll(num: number, cnt: number): number {
        return (num << cnt) | (num >>> (32 - cnt));
    }

    /*
    * These functions implement the five basic operations the algorithm uses.
    */
    /**
     * These functions implement the five basic operations the algorithm uses.
     * @param q - Q value
     * @param a - A value
     * @param b - B value
     * @param x - X value
     * @param s - S value
     * @param t - T value
     * @returns Common MD5 operation result
     */
    md5_cmn(q: number, a: number, b: number, x: number, s: number, t: number): number {
        return this.safe_add(this.bit_roll(this.safe_add(this.safe_add(a, q), this.safe_add(x, t)), s), b);
    }

    /**
     * MD5 FF function
     * @param a - A value
     * @param b - B value
     * @param c - C value
     * @param d - D value
     * @param x - X value
     * @param s - S value
     * @param t - T value
     * @returns MD5 FF result
     */
    md5_ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
        return this.md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }

    /**
     * MD5 GG function
     * @param a - A value
     * @param b - B value
     * @param c - C value
     * @param d - D value
     * @param x - X value
     * @param s - S value
     * @param t - T value
     * @returns MD5 GG result
     */
    md5_gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
        return this.md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }

    /**
     * MD5 HH function
     * @param a - A value
     * @param b - B value
     * @param c - C value
     * @param d - D value
     * @param x - X value
     * @param s - S value
     * @param t - T value
     * @returns MD5 HH result
     */
    md5_hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
        return this.md5_cmn(b ^ c ^ d, a, b, x, s, t);
    }

    /**
     * MD5 II function
     * @param a - A value
     * @param b - B value
     * @param c - C value
     * @param d - D value
     * @param x - X value
     * @param s - S value
     * @param t - T value
     * @returns MD5 II result
     */
    md5_ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
        return this.md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
    }

    /*
    * Calculate the MD5 of an array of little-endian words, and a bit length.
    */
    /**
     * Calculate the MD5 of an array of little-endian words, and a bit length.
     * @param x - Array of little-endian words
     * @param len - Bit length
     * @returns MD5 hash as array of little-endian words
     */
    binl_md5(x: number[], len: number): number[] {
        /* append padding */
        x[len >> 5] |= 0x80 << (len % 32);
        x[(((len + 64) >>> 9) << 4) + 14] = len;

        var i, olda, oldb, oldc, oldd,
            a =  1732584193,
            b = -271733879,
            c = -1732584194,
            d =  271733878;

        for (i = 0; i < x.length; i += 16) {
            olda = a;
            oldb = b;
            oldc = c;
            oldd = d;

            a = this.md5_ff(a, b, c, d, x[i],       7, -680876936);
            d = this.md5_ff(d, a, b, c, x[i +  1], 12, -389564586);
            c = this.md5_ff(c, d, a, b, x[i +  2], 17,  606105819);
            b = this.md5_ff(b, c, d, a, x[i +  3], 22, -1044525330);
            a = this.md5_ff(a, b, c, d, x[i +  4],  7, -176418897);
            d = this.md5_ff(d, a, b, c, x[i +  5], 12,  1200080426);
            c = this.md5_ff(c, d, a, b, x[i +  6], 17, -1473231341);
            b = this.md5_ff(b, c, d, a, x[i +  7], 22, -45705983);
            a = this.md5_ff(a, b, c, d, x[i +  8],  7,  1770035416);
            d = this.md5_ff(d, a, b, c, x[i +  9], 12, -1958414417);
            c = this.md5_ff(c, d, a, b, x[i + 10], 17, -42063);
            b = this.md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
            a = this.md5_ff(a, b, c, d, x[i + 12],  7,  1804603682);
            d = this.md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
            c = this.md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
            b = this.md5_ff(b, c, d, a, x[i + 15], 22,  1236535329);

            a = this.md5_gg(a, b, c, d, x[i +  1],  5, -165796510);
            d = this.md5_gg(d, a, b, c, x[i +  6],  9, -1069501632);
            c = this.md5_gg(c, d, a, b, x[i + 11], 14,  643717713);
            b = this.md5_gg(b, c, d, a, x[i],      20, -373897302);
            a = this.md5_gg(a, b, c, d, x[i +  5],  5, -701558691);
            d = this.md5_gg(d, a, b, c, x[i + 10],  9,  38016083);
            c = this.md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
            b = this.md5_gg(b, c, d, a, x[i +  4], 20, -405537848);
            a = this.md5_gg(a, b, c, d, x[i +  9],  5,  568446438);
            d = this.md5_gg(d, a, b, c, x[i + 14],  9, -1019803690);
            c = this.md5_gg(c, d, a, b, x[i +  3], 14, -187363961);
            b = this.md5_gg(b, c, d, a, x[i +  8], 20,  1163531501);
            a = this.md5_gg(a, b, c, d, x[i + 13],  5, -1444681467);
            d = this.md5_gg(d, a, b, c, x[i +  2],  9, -51403784);
            c = this.md5_gg(c, d, a, b, x[i +  7], 14,  1735328473);
            b = this.md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

            a = this.md5_hh(a, b, c, d, x[i +  5],  4, -378558);
            d = this.md5_hh(d, a, b, c, x[i +  8], 11, -2022574463);
            c = this.md5_hh(c, d, a, b, x[i + 11], 16,  1839030562);
            b = this.md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
            a = this.md5_hh(a, b, c, d, x[i +  1],  4, -1530992060);
            d = this.md5_hh(d, a, b, c, x[i +  4], 11,  1272893353);
            c = this.md5_hh(c, d, a, b, x[i +  7], 16, -155497632);
            b = this.md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
            a = this.md5_hh(a, b, c, d, x[i + 13],  4,  681279174);
            d = this.md5_hh(d, a, b, c, x[i],      11, -358537222);
            c = this.md5_hh(c, d, a, b, x[i +  3], 16, -722521979);
            b = this.md5_hh(b, c, d, a, x[i +  6], 23,  76029189);
            a = this.md5_hh(a, b, c, d, x[i +  9],  4, -640364487);
            d = this.md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
            c = this.md5_hh(c, d, a, b, x[i + 15], 16,  530742520);
            b = this.md5_hh(b, c, d, a, x[i +  2], 23, -995338651);

            a = this.md5_ii(a, b, c, d, x[i],       6, -198630844);
            d = this.md5_ii(d, a, b, c, x[i +  7], 10,  1126891415);
            c = this.md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
            b = this.md5_ii(b, c, d, a, x[i +  5], 21, -57434055);
            a = this.md5_ii(a, b, c, d, x[i + 12],  6,  1700485571);
            d = this.md5_ii(d, a, b, c, x[i +  3], 10, -1894986606);
            c = this.md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
            b = this.md5_ii(b, c, d, a, x[i +  1], 21, -2054922799);
            a = this.md5_ii(a, b, c, d, x[i +  8],  6,  1873313359);
            d = this.md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
            c = this.md5_ii(c, d, a, b, x[i +  6], 15, -1560198380);
            b = this.md5_ii(b, c, d, a, x[i + 13], 21,  1309151649);
            a = this.md5_ii(a, b, c, d, x[i +  4],  6, -145523070);
            d = this.md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
            c = this.md5_ii(c, d, a, b, x[i +  2], 15,  718787259);
            b = this.md5_ii(b, c, d, a, x[i +  9], 21, -343485551);

            a = this.safe_add(a, olda);
            b = this.safe_add(b, oldb);
            c = this.safe_add(c, oldc);
            d = this.safe_add(d, oldd);
        }
        return [a, b, c, d];
    }

    /*
    * Convert an array of little-endian words to a string
    */
    /**
     * Convert an array of little-endian words to a string
     * @param input - Array of little-endian words
     * @returns Raw string representation
     */
    binl2rstr(input: number[]): string {
        var i,
            output = '';
        for (i = 0; i < input.length * 32; i += 8) {
            output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
        }
        return output;
    }

    /*
    * Convert a raw string to an array of little-endian words
    * Characters >255 have their high-byte silently ignored.
    */
    /**
     * Convert a raw string to an array of little-endian words
     * Characters >255 have their high-byte silently ignored.
     * @param input - Raw string
     * @returns Array of little-endian words
     */
    rstr2binl(input: string): number[] {
        var i,
            output: number[] = [];
        output[(input.length >> 2) - 1] = undefined as any;
        for (i = 0; i < output.length; i += 1) {
            output[i] = 0;
        }
        for (i = 0; i < input.length * 8; i += 8) {
            output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
        }
        return output;
    }

    /*
    * Calculate the MD5 of a raw string
    */
    /**
     * Calculate the MD5 of a raw string
     * @param s - Raw string
     * @returns MD5 hash as raw string
     */
    rstr_md5(s: string): string {
        return this.binl2rstr(this.binl_md5(this.rstr2binl(s), s.length * 8));
    }

    /*
    * Calculate the HMAC-MD5, of a key and some data (raw strings)
    */
    /**
     * Calculate the HMAC-MD5, of a key and some data (raw strings)
     * @param key - HMAC key
     * @param data - Data to hash
     * @returns HMAC-MD5 hash as raw string
     */
    rstr_hmac_md5(key: string, data: string): string {
        var i,
            bkey = this.rstr2binl(key),
            ipad: number[] = [],
            opad: number[] = [],
            hash;
        ipad[15] = opad[15] = undefined as any;
        if (bkey.length > 16) {
            bkey = this.binl_md5(bkey, key.length * 8);
        }
        for (i = 0; i < 16; i += 1) {
            ipad[i] = bkey[i] ^ 0x36363636;
            opad[i] = bkey[i] ^ 0x5C5C5C5C;
        }
        hash = this.binl_md5(ipad.concat(this.rstr2binl(data)), 512 + data.length * 8);
        return this.binl2rstr(this.binl_md5(opad.concat(hash), 512 + 128));
    }

    /*
    * Convert a raw string to a hex string
    */
    /**
     * Convert a raw string to a hex string
     * @param input - Raw string
     * @returns Hex string representation
     */
    rstr2hex(input: string): string {
        var hex_tab = '0123456789abcdef',
            output = '',
            x,
            i;
        for (i = 0; i < input.length; i += 1) {
            x = input.charCodeAt(i);
            output += hex_tab.charAt((x >>> 4) & 0x0F) +
                hex_tab.charAt(x & 0x0F);
        }
        return output;
    }

    /*
    * Encode a string as utf-8
    */
    /**
     * Encode a string as utf-8
     * @param input - Input string
     * @returns UTF-8 encoded string
     */
    str2rstr_utf8(input: string): string {
        return unescape(encodeURIComponent(input));
    }

    /*
    * Take string arguments and return either raw or hex encoded strings
    */
    /**
     * Calculate raw MD5 hash of a string
     * @param s - Input string
     * @returns Raw MD5 hash
     */
    raw_md5(s: string): string {
        return this.rstr_md5(this.str2rstr_utf8(s));
    }

    /**
     * Calculate hex MD5 hash of a string
     * @param s - Input string
     * @returns Hex MD5 hash
     */
    hex_md5(s: string): string {
        return this.rstr2hex(this.raw_md5(s));
    }

    /**
     * Calculate raw HMAC-MD5 hash
     * @param k - HMAC key
     * @param d - Data to hash
     * @returns Raw HMAC-MD5 hash
     */
    raw_hmac_md5(k: string, d: string): string {
        return this.rstr_hmac_md5(this.str2rstr_utf8(k), this.str2rstr_utf8(d));
    }

    /**
     * Calculate hex HMAC-MD5 hash
     * @param k - HMAC key
     * @param d - Data to hash
     * @returns Hex HMAC-MD5 hash
     */
    hex_hmac_md5(k: string, d: string): string {
        return this.rstr2hex(this.raw_hmac_md5(k, d));
    }

    /**
     * Calculate MD5 hash with optional HMAC and raw output
     * @param string - Input string to hash
     * @param key - Optional HMAC key
     * @param raw - Return raw output instead of hex
     * @returns MD5 hash
     */
    md5(string: string, key?: string, raw?: boolean): string {
        if (!key) {
            if (!raw) {
                return this.hex_md5(string);
            }

            return this.raw_md5(string);
        }

        if (!raw) {
            return this.hex_hmac_md5(key, string);
        }

        return this.raw_hmac_md5(key, string);
    }
}

// MersenneTwister Implementation
export class MersenneTwister {
    N: number;
    M: number;
    MATRIX_A: number;
    UPPER_MASK: number;
    LOWER_MASK: number;
    mt: number[];
    mti: number;

    /**
     * Initialize Mersenne Twister with optional seed
     * @param seed - Random seed (optional)
     */
    constructor(seed?: number) {
        if (seed === undefined) {
            // kept random number same size as time used previously to ensure no unexpected results downstream
            seed = Math.floor(Math.random()*Math.pow(10,13));
        }
        /* Period parameters */
        this.N = 624;
        this.M = 397;
        this.MATRIX_A = 0x9908b0df;   /* constant vector a */
        this.UPPER_MASK = 0x80000000; /* most significant w-r bits */
        this.LOWER_MASK = 0x7fffffff; /* least significant r bits */

        this.mt = new Array(this.N); /* the array for the state vector */
        this.mti = this.N + 1; /* mti==N + 1 means mt[N] is not initialized */

        this.init_genrand(seed);
    }

    /* initializes mt[N] with a seed */
    /**
     * Initialize mt[N] with a seed
     * @param s - Seed value
     */
    init_genrand(s: number): void {
        this.mt[0] = s >>> 0;
        for (this.mti = 1; this.mti < this.N; this.mti++) {
            s = this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30);
            this.mt[this.mti] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253) + this.mti;
            /* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */
            /* In the previous versions, MSBs of the seed affect   */
            /* only MSBs of the array mt[].                        */
            /* 2002/01/09 modified by Makoto Matsumoto             */
            this.mt[this.mti] >>>= 0;
            /* for >32 bit machines */
        }
    }

    /* initialize by an array with array-length */
    /* init_key is the array for initializing keys */
    /* key_length is its length */
    /* slight change for C++, 2004/2/26 */
    /**
     * Initialize by an array with array-length
     * @param init_key - Array for initializing keys
     * @param key_length - Length of init_key
     */
    init_by_array(init_key: number[], key_length: number): void {
        var i = 1, j = 0, k, s;
        this.init_genrand(19650218);
        k = (this.N > key_length ? this.N : key_length);
        for (; k; k--) {
            s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30);
            this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1664525) << 16) + ((s & 0x0000ffff) * 1664525))) + init_key[j] + j; /* non linear */
            this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
            i++;
            j++;
            if (i >= this.N) { this.mt[0] = this.mt[this.N - 1]; i = 1; }
            if (j >= key_length) { j = 0; }
        }
        for (k = this.N - 1; k; k--) {
            s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30);
            this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1566083941) << 16) + (s & 0x0000ffff) * 1566083941)) - i; /* non linear */
            this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
            i++;
            if (i >= this.N) { this.mt[0] = this.mt[this.N - 1]; i = 1; }
        }

        this.mt[0] = 0x80000000; /* MSB is 1; assuring non-zero initial array */
    }

    /* generates a random number on [0,0xffffffff]-interval */
    /**
     * Generate a random number on [0,0xffffffff]-interval
     * @returns Random 32-bit integer
     */
    genrand_int32(): number {
        var y;
        var mag01 = new Array(0x0, this.MATRIX_A);
        /* mag01[x] = x * MATRIX_A  for x=0,1 */

        if (this.mti >= this.N) { /* generate N words at one time */
            var kk;

            if (this.mti === this.N + 1) {   /* if init_genrand() has not been called, */
                this.init_genrand(5489); /* a default initial seed is used */
            }
            for (kk = 0; kk < this.N - this.M; kk++) {
                y = (this.mt[kk]&this.UPPER_MASK)|(this.mt[kk + 1]&this.LOWER_MASK);
                this.mt[kk] = this.mt[kk + this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
            }
            for (;kk < this.N - 1; kk++) {
                y = (this.mt[kk]&this.UPPER_MASK)|(this.mt[kk + 1]&this.LOWER_MASK);
                this.mt[kk] = this.mt[kk + (this.M - this.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
            }
            y = (this.mt[this.N - 1]&this.UPPER_MASK)|(this.mt[0]&this.LOWER_MASK);
            this.mt[this.N - 1] = this.mt[this.M - 1] ^ (y >>> 1) ^ mag01[y & 0x1];

            this.mti = 0;
        }

        y = this.mt[this.mti++];

        /* Tempering */
        y ^= (y >>> 11);
        y ^= (y << 7) & 0x9d2c5680;
        y ^= (y << 15) & 0xefc60000;
        y ^= (y >>> 18);

        return y >>> 0;
    }

    /* generates a random number on [0,0x7fffffff]-interval */
    /**
     * Generate a random number on [0,0x7fffffff]-interval
     * @returns Random 31-bit integer
     */
    genrand_int31(): number {
        return (this.genrand_int32() >>> 1);
    }

    /* generates a random number on [0,1]-real-interval */
    /**
     * Generate a random number on [0,1]-real-interval
     * @returns Random number between 0 and 1 (inclusive)
     */
    genrand_real1(): number {
        return this.genrand_int32() * (1.0 / 4294967295.0);
        /* divided by 2^32-1 */
    }

    /* generates a random number on [0,1)-real-interval */
    /**
     * Generate a random number on [0,1)-real-interval
     * @returns Random number between 0 (inclusive) and 1 (exclusive)
     */
    random(): number {
        return this.genrand_int32() * (1.0 / 4294967296.0);
        /* divided by 2^32 */
    }

    /* generates a random number on (0,1)-real-interval */
    /**
     * Generate a random number on (0,1)-real-interval
     * @returns Random number between 0 and 1 (exclusive)
     */
    genrand_real3(): number {
        return (this.genrand_int32() + 0.5) * (1.0 / 4294967296.0);
        /* divided by 2^32 */
    }

    /* generates a random number on [0,1) with 53-bit resolution*/
    /**
     * Generate a random number on [0,1) with 53-bit resolution
     * @returns High-precision random number
     */
    genrand_res53(): number {
        var a = this.genrand_int32()>>>5, b = this.genrand_int32()>>>6;
        return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0);
    }
}

// Main RandBox interface
export interface RandBox {
    VERSION: string;
    seed?: number;
    mt: MersenneTwister;
    bimd5: BlueImpMD5;
    random(): number;
    mersenne_twister(seed?: number): MersenneTwister;
    blueimp_md5(): BlueImpMD5;
    mac_address(options?: any): string;
    [key: string]: any;
}

// Constructor
/**
 * RandBox constructor - creates a new random number generator instance
 * @param seed - Optional seed value (string, number, function, or null)
 * @returns RandBox instance
 */
export function RandBox(this: RandBox, seed?: SeedValue): RandBox {
    if (!(this instanceof RandBox)) {
        if (!seed) { seed = null; }
        return seed === null ? new (RandBox as any)(null) : new (RandBox as any)(seed);
    }

    // if user has provided a function, use that as the generator
    if (typeof seed === 'function') {
        this.random = seed;
        return this;
    }

    // Handle null seed by generating a time-based random seed
    if (seed === null) {
        this.seed = new Date().getTime() + Math.random() * 1000000;
    } else if (arguments.length) {
        // set a starting value of zero so we can add to it
        this.seed = 0;
    }

    // otherwise, leave this.seed blank so that MT will receive a blank

    for (let i = 0; i < arguments.length; i++) {
        let seedling = 0;
        if (arguments[i] === null) {
            // Skip null values in processing
            continue;
        }
        if (Object.prototype.toString.call(arguments[i]) === '[object String]') {
            for (let j = 0; j < arguments[i].length; j++) {
                // create a numeric hash for each argument, add to seedling
                let hash = 0;
                for (let k = 0; k < arguments[i].length; k++) {
                    hash = arguments[i].charCodeAt(k) + (hash << 6) + (hash << 16) - hash;
                }
                seedling += hash;
            }
        } else {
            seedling = arguments[i];
        }
        this.seed! += (arguments.length - i) * seedling;
    }

    this.mersenne_twister = function (seed) {
        return new MersenneTwister(seed);
    };

    this.blueimp_md5 = function () {
        return new BlueImpMD5();
    };

    // If no generator function was provided, use our MT
    this.mt = this.mersenne_twister(this.seed);

    this.bimd5 = this.blueimp_md5();

    this.random = function() {
        return this.mt.random();
    };

    return this;
}

(RandBox as any).prototype.VERSION = "1.0.0";
