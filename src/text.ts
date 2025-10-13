/**
 * Text module for RandBox.js
 * Contains text generation functions like paragraphs, sentences, words, etc.
 */

import { initOptions, testRange, MAX_INT, RandBox } from './core.js';

export interface ParagraphOptions {
    sentences?: number;
    linebreak?: boolean;
}

export interface SentenceOptions {
    words?: number;
    punctuation?: boolean;
}

export interface WordOptions {
    syllables?: number;
    length?: number;
    capitalize?: boolean;
}

export function paragraph(this: RandBox, options?: ParagraphOptions): string {
    const opts = initOptions(options, {}) as any;

    const sentences = opts.sentences || this.natural({min: 3, max: 7});
    const sentence_array = this.n(() => this.sentence(), sentences);
    const separator = opts.linebreak === true ? '\n' : ' ';

    return sentence_array.join(separator);
}

// Could get smarter about this than generating random words and
// chaining them together. Such as: http://vq.io/1a5ceOh
export function sentence(this: RandBox, options?: SentenceOptions): string {
    const opts = initOptions(options, {}) as any;

    const words = opts.words || this.natural({min: 12, max: 18});
    const punctuation = opts.punctuation;
    let text: string;
    const word_array = this.n(() => this.word(), words);

    text = word_array.join(' ');

    // Capitalize first letter of sentence
    text = this.capitalize(text);

    // Make sure punctuation has a usable value
    if (punctuation !== false && !/[.!?;:]$/.test(text)) {
        text += '.';
    }

    return text;
}

export function syllable(this: RandBox, options?: { capitalize?: boolean }): string {
    const opts = initOptions(options, { capitalize: false }) as any;
    const length = this.natural({min: 2, max: 3});
    const consonants = 'bcdfghjklmnpqrstvwxyz';
    const vowels = 'aeiou';
    let text = '';

    for (let i = 0; i < length; i++) {
        if (i % 2 === 0) {
            text += this.character({pool: consonants});
        } else {
            text += this.character({pool: vowels});
        }
    }

    if (opts.capitalize) {
        text = text.toUpperCase();
    }

    return text;
}

export function word(this: RandBox, options?: WordOptions): string {
    const opts = initOptions(options, { capitalize: false }) as any;

    testRange(
        opts.syllables && opts.length,
        "RandBox: Cannot specify both syllables AND length."
    );

    let syllables = opts.syllables || this.natural({min: 1, max: 3});

    if (opts.length) {
        const targetLength = opts.length;
        // Generate syllables until we hit roughly the target length
        syllables = Math.max(1, Math.round(targetLength / 3));
    }

    let text = '';
    for (let i = 0; i < syllables; i++) {
        text += this.syllable();
    }

    if (opts.length && text.length !== opts.length) {
        // Adjust length if needed
        if (text.length < opts.length) {
            text += this.string({length: opts.length - text.length, pool: 'aeiou'});
        } else {
            text = text.substring(0, opts.length);
        }
    }

    if (opts.capitalize && text.length > 0) {
        text = text.charAt(0).toUpperCase() + text.slice(1);
    }

    return text;
}

export function emoji(this: RandBox, options?: { length?: number; category?: string }): string {
    const opts = initOptions(options, { length: 1 }) as any;

    // Validate length parameter
    testRange(
        opts.length < 1 || opts.length > MAX_INT,
        `RandBox: length must be between 1 and ${MAX_INT}`
    );

    // Common emoji ranges with categories
    const emojiRanges: { [key: string]: [number, number][] } = {
        'emoticons': [[0x1F600, 0x1F64F]], // Emoticons
        'symbols': [[0x1F300, 0x1F5FF]], // Misc Symbols
        'transport': [[0x1F680, 0x1F6FF]], // Transport
        'misc': [[0x2600, 0x26FF]], // Misc symbols
        'dingbats': [[0x2700, 0x27BF]], // Dingbats
    };

    // Validate category if specified
    if (opts.category) {
        testRange(
            !emojiRanges[opts.category],
            `RandBox: Unrecognised emoji category: [${opts.category}].`
        );
    }

    // Get available ranges
    let availableRanges: [number, number][];
    if (opts.category) {
        availableRanges = emojiRanges[opts.category];
    } else {
        // Use all ranges if no category specified
        availableRanges = Object.values(emojiRanges).flat();
    }

    let result = '';
    for (let i = 0; i < opts.length; i++) {
        const range = this.pick(availableRanges);
        const codePoint = this.integer({min: range[0], max: range[1]});
        result += String.fromCodePoint(codePoint);
    }

    return result;
}

// Export collection for easy prototype extension
export const text = {
    paragraph,
    sentence,
    syllable,
    word,
    emoji
};