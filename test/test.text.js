import test from 'ava'
import { RandBox } from '../dist/index.esm.mjs'
import _ from 'lodash'

const randBox = new RandBox()

// randBox.sentence()
test('sentence() returns a random sentence', t => {
    _.times(1000, () => {
        let sentence = randBox.sentence()
        t.true(_.isString(sentence))
        let len = sentence.split(' ').length
        t.true(len > 11)
        t.true(len < 19)
    })
})

test('sentence() will obey bounds', t => {
    _.times(1000, () => {
        let sentence = randBox.sentence({ words: 5 })
        t.true(_.isString(sentence))
        t.is(sentence.split(' ').length, 5)
        t.true(/[a-zA-Z]+ [a-zA-Z]+ [a-zA-Z]+ [a-zA-Z]+ [a-zA-Z]+.?/m.test(sentence))
    })
})

// randBox.syllable()
test('syllable() returns a random syllable', t => {
    _.times(1000, () => {
        let syllable = randBox.syllable()
        t.true(_.isString(syllable))
        t.true(syllable.length > 1)
        t.true(syllable.length < 4)
    })
})

test('syllable() obeys the capitalize option', t => {
    _.times(1000, () => {
        let syllable = randBox.syllable({ capitalize: true })
        t.true(_.isString(syllable))
        t.true(syllable.length > 1)
        t.true(syllable.length < 4)
        t.true(/[A-Z]+/.test(syllable))
    })
})

// randBox.word()
test('word() returns a random word', t => {
    _.times(1000, () => {
        let word = randBox.word()
        t.true(_.isString(word))
        t.true(word.length > 1)
        t.true(word.length < 10)
    })
})

test('word() obeys the capitalize option', t => {
    _.times(1000, () => {
        let word = randBox.word({ capitalize: true })
        t.true(_.isString(word))
        t.true(word.length > 1)
        t.true(word.length < 10)
        t.true(word.charAt(0) === word.charAt(0).toUpperCase())
    })
})

test('word() can have a set number of syllables', t => {
    _.times(1000, () => {
        let word = randBox.word({ syllables: 3 })
        t.true(_.isString(word))
        t.true(word.length > 5)
        t.true(word.length < 10)
    })
})

test('word() can have a set length', t => {
    _.times(1000, () => {
        let word = randBox.word({ length: 5 })
        t.true(_.isString(word))
        t.is(word.length, 5)
    })
})

test('word() throws if both syllables and length specified', t => {
    const fn = () => randBox.word({ syllables: 3, length: 20 })
    t.throws(fn, {message: 'RandBox: Cannot specify both syllables AND length.'})
})

// randBox.paragraph()
test('paragraph() returns a random paragraph', t => {
    _.times(100, () => {
        let paragraph = randBox.paragraph()
        t.true(_.isString(paragraph))

        let len = paragraph.split('.').length
        t.true(len > 2)
        t.true(len < 9)
    })
})

test('paragraph() will obey bounds', t => {
    _.times(100, () => {
        let paragraph = randBox.paragraph({ sentences: 5 })
        t.true(_.isString(paragraph))

        // Have to account for the fact that the period at the end will add
        // to the count of sentences. This is the fault of our hackish way
        // of detecting sentences -- by splitting on '.'
        let len = paragraph.split('.').length
        t.is(len, 6)
    })
})

test('paragraph) will obey line breaks', t => {
    _.times(100, () => {
        let rand = _.random(1, 50);
        let paragraph = randBox.paragraph({ sentences: rand, linebreak: true })
        t.true(_.isString(paragraph))

        let len = paragraph.split('\n').length
        t.is(len, rand);
    })
})

test('emoji() will return a single emoji by default', t => {
    let emoji = randBox.emoji();

    t.true(_.isString(emoji));
    t.is([...emoji].length, 1);
})

test('emoji() will return as many emojis as you tell it to', t => {
    _.times(100, () => {
        let rand = _.random(1, 50);
        let emoji = randBox.emoji({ length: rand });

        t.true(_.isString(emoji));
        t.is([...emoji].length, rand);
    })
})

test('emoji() will throw an error when category is unrecognised', t => {
    let fn = () => randBox.emoji({ category: 'something-incorrect' });
    t.throws(fn, {message: "RandBox: Unrecognised emoji category: [something-incorrect]."});
})

test('emoji() will throw an error when length is 0', t => {
    let fn = () => randBox.emoji({ length: 0 });
    t.throws(fn, {message: "RandBox: length must be between 1 and 9007199254740992"});
})

test('emoji() will throw an error when length is negative', t => {
    let fn = () => randBox.emoji({ length: -1 });
    t.throws(fn, {message: "RandBox: length must be between 1 and 9007199254740992"});
})

test('emoji() will throw an error when length is greater than 9007199254740992', t => {
    let fn = () => randBox.emoji({ length: BigInt('9007199254740993') });
    t.throws(fn, {message: "RandBox: length must be between 1 and 9007199254740992"});
})