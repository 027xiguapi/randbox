/**
 * Music module
 * Contains music-related generation functions like notes, chords, genres, etc.
 */

import { initOptions, RandBox } from './core.js';

// Genre choices:
// Rock,Pop,Hip-Hop,Jazz,Classical,Electronic,Country,R&B,Reggae,
// Blues,Metal,Folk,Alternative,Punk,Disco,Funk,Techno,
// Indie,Gospel,Dance,Children's,World

export function music_genre(this: RandBox, genre = 'general') {
    if (!(genre.toLowerCase() in (this.get('music_genres') || {}))) {
        throw new Error(`Unsupported genre: ${genre}`);
    }

    const genres = (this.get('music_genres') || {} as any)[genre.toLowerCase()];
    const randomIndex = this.integer({ min: 0, max: genres.length - 1 });

    return genres[randomIndex];
}

export function note(this: RandBox, options: any) {
    // choices for 'notes' option:
    // flatKey - chromatic scale with flat notes (default)
    // sharpKey - chromatic scale with sharp notes
    // flats - just flat notes
    // sharps - just sharp notes
    // naturals - just natural notes
    // all - naturals, sharps and flats
    options = initOptions(options, { notes : 'flatKey'});
    var scales: any = {
        naturals: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
        flats: ['D♭', 'E♭', 'G♭', 'A♭', 'B♭'],
        sharps: ['C♯', 'D♯', 'F♯', 'G♯', 'A♯']
    };
    scales.all = scales.naturals.concat(scales.flats.concat(scales.sharps))
    scales.flatKey = scales.naturals.concat(scales.flats)
    scales.sharpKey = scales.naturals.concat(scales.sharps)
    return this.pickone(scales[options.notes]);
}

export function midi_note(this: RandBox, options: any) {
    var min = 0;
    var max = 127;
    options = initOptions(options, { min : min, max : max });
    return this.integer({min: options.min, max: options.max});
}

export function chord_quality(this: RandBox, options: any) {
    options = initOptions(options, { jazz: true });
    var chord_qualities = ['maj', 'min', 'aug', 'dim'];
    if (options.jazz){
        chord_qualities = [
            'maj7',
            'min7',
            '7',
            'sus',
            'dim',
            'ø'
        ];
    }
    return this.pickone(chord_qualities);
}

export function chord(this: RandBox, options: any) {
    options = initOptions(options);
    return this.note(options) + this.chord_quality(options);
}

export function tempo(this: RandBox, options: any) {
    var min = 40;
    var max = 320;
    options = initOptions(options, {min: min, max: max});
    return this.integer({min: options.min, max: options.max});
}

// Export main music object
export const music = {
    music_genre,
    note,
    midi_note,
    chord_quality,
    chord,
    tempo
};
