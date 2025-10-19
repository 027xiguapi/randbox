import test from 'ava'
import { RandBox } from '../dist/index.esm.mjs'
import _ from 'lodash'

const randBox = new RandBox()

// randBox.note()
test('note() returns a valid note', t => {
    _.times(1000, () => {
      let note = randBox.note()
      t.true(_.isString(note))
      t.true(note.length <= 2)
    })
})

// randBox.midi_note()
test('midi_note() returns a valid midi note between 0 and 127', t => {
    _.times(1000, () => {
        let midi_note = randBox.midi_note()
        t.true(_.isNumber(midi_note))
        t.true(midi_note >= 0)
        t.true(midi_note <= 127)
    })
})

// randBox.chord_quality()
test('chord_quality() returns a valid chord quality', t => {
    _.times(1000, () => {
        let chord_quality = randBox.chord_quality()
        t.true(_.isString(chord_quality))
        t.true(chord_quality.length <= 4)
    })
})

// randBox.chord()
test('chord() returns a valid chord', t => {
    _.times(1000, () => {
        let chord = randBox.chord()
        t.true(_.isString(chord))
        t.true(chord.length <= 6)
    })
})

// randBox.tempo()
test('tempo() returns a valid tempo between 40 and 320', t => {
    _.times(1000, () => {
        let tempo = randBox.tempo()
        t.true(_.isNumber(tempo))
        t.true(tempo >= 40)
        t.true(tempo <= 320)
    })
})

//randBox.music_genre()

const music_genres = [
    'Rock',
    'Pop',
    'Hip-Hop',
    'Jazz',
    'Classical',
    'Electronic',
    'Country',
    'R&B',
    'Reggae',
    'Blues',
    'Metal',
    'Folk',
    'Alternative',
    'Punk',
    'Disco',
    'Funk',
    'Techno',
    'Indie',
    'Gospel',
    'Dance',
    'Children\'s',
    'World'
]

test('music_genre() returns an error if category given is invalid', t => {
    t.throws(() => {
        randBox.music_genre('UnknownGenre');
    }, {instanceOf: Error, message: 'Unsupported genre: UnknownGenre'});
})

test('music_genre() returns a valid genre for general category', t => {
    const randomGenre = randBox.music_genre('general');
    t.true(typeof randomGenre === 'string');
});

music_genres.forEach(category => {
    test(`music_genre() returns a valid genre in the ${category} category`, t => {
        const genre = randBox.music_genre(category.toLowerCase());
        t.true(typeof genre === 'string');
    });
})

