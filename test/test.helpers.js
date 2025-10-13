import test from 'ava'
import { RandBox } from '../dist/index.esm.mjs'
import _ from 'lodash'

const randBox = new RandBox()

// randBox.capitalize()
test('capitalize() works as expected', t => {
    _.times(1000, () => {
        let word = randBox.capitalize(randBox.word())
        t.true(_.isString(word))
        t.true(/[A-Z]/.test(word))
    })
})

// randBox.n()
test('n() gives an array of n terms for the given function', t => {
    let arr = randBox.n(randBox.email, 25, { domain: 'example.com' })
    t.true(_.isArray(arr))
    t.is(arr.length, 25)
    arr.map((email) => {
        t.true(/example\.com$/.test(email))
    })
})

test('n() gives an array of 1 when n not given', t => {
    let arr = randBox.n(randBox.email)
    t.true(_.isArray(arr))
    t.is(arr.length, 1)
})

test('n() throws when first argument is not a function', t => {
    let testFns = [
        () => randBox.n(randBox.character({ pool: 'abcde' }), 10),
        () => randBox.n('foo', 10),
        () => randBox.n({}, 10),
        () => randBox.n(null, 10),
        () => randBox.n(undefined, 10),
        () => randBox.n(21, 10),
    ]
    testFns.map((fn) => {
        t.throws(fn, {message: 'RandBox: The first argument must be a function.'})
    })
})

test('n() gives an empty array when n is set to 0', t => {
    let arr = randBox.n(randBox.email, 0)
    t.true(_.isArray(arr))
    t.is(arr.length, 0)
})

// randBox.pick()
test('pick() returns a single element when called without a count argument', t => {
    let arr = ['a', 'b', 'c', 'd']
    _.times(1000, () => {
        let picked = randBox.pick(arr)
        t.is(picked.length, 1)
    })
})

test('pick() returns a multiple elements when called with a count argument', t => {
    let arr = ['a', 'b', 'c', 'd']
    _.times(1000, () => {
        let picked = randBox.pick(arr, 3)
        t.is(picked.length, 3)
    })
})

test('pick() does not destroy the original array', t => {
    let arr = ['a', 'b', 'c', 'd', 'e', 'f'];
    _.times(1000, () => {
        let cloned = _.clone(arr)
        let picked = randBox.pick(cloned, 3)
        t.is(cloned.length, 6)
        t.deepEqual(arr, cloned)
    })
})

test('pick() throws if zero elements in array', t => {
    const fn = () => randBox.pick([])
    t.throws(fn, {message: 'RandBox: Cannot pick() from an empty array'})
})

// randBox.pickone()
test('pickone() returns a single element', t => {
    let arr = ['a', 'b', 'c', 'd']
    _.times(1000, () => {
        let picked = randBox.pickone(arr)
        t.is(picked.length, 1)
        t.false(_.isArray(picked))
    })
})

test('pickone() throws if zero elements in array', t => {
    const fn = () => randBox.pickone([])
    t.throws(fn, {message: 'RandBox: Cannot pickone() from an empty array'})
})

// randBox.pickset()
test('pickset() returns empty array when count 0', t => {
    let arr = ['a', 'b', 'c', 'd']
    _.times(1000, () => {
        let picked = randBox.pickset(arr, 0)
        t.is(picked.length, 0)
        t.true(_.isArray(picked))
    })
})

test('pickset() throws if zero elements in array', t => {
    const fn = () => randBox.pickset([])
    t.throws(fn, {message: 'RandBox: Cannot pickset() from an empty array'})
})

test('pickset() returns single element array if no count provided', t => {
    let arr = ['a', 'b', 'c', 'd']
    _.times(1000, () => {
        let picked = randBox.pickset(arr)
        t.is(picked.length, 1)
        t.true(_.isArray(picked))
    })
})

test('pickset() throws if count is not positive number', t => {
    let arr = ['a', 'b', 'c', 'd']
    const fn = () => randBox.pickset(arr, -1)
    t.throws(fn, {message: 'RandBox: Count must be a positive number'})
})

test('pickset() returns single element array when called with count of 1', t => {
    let arr = ['a', 'b', 'c', 'd']
    _.times(1000, () => {
        let picked = randBox.pickset(arr, 1)
        t.is(picked.length, 1)
        t.true(_.isArray(picked))
    })
})

test('pickset() returns multiple elements when called with count > 1', t => {
    let arr = ['a', 'b', 'c', 'd']
    _.times(1000, () => {
        let picked = randBox.pickset(arr, 3)
        t.is(picked.length, 3)
        t.true(_.isArray(picked))
    })
})

test('pickset() returns no more values than the size of the array', t => {
    let arr = ['a', 'b', 'c', 'd']
    _.times(1000, () => {
        let picked = randBox.pickset(arr, 5)
        t.is(picked.length, 4)
    })
})

test('pickset() does not destroy the original array', t => {
    let arr = ['a', 'b', 'c', 'd', 'e', 'f'];
    _.times(1000, () => {
        let cloned = _.clone(arr)
        let picked = randBox.pickset(cloned, 3)
        t.is(cloned.length, 6)
        t.deepEqual(arr, cloned)
    })
})

test('pickset() returns unique values', t => {
    let arr = ['a', 'b', 'c', 'd']
    _.times(1000, () => {
        let picked = randBox.pickset(arr, 4)
        t.not(picked.indexOf('a'), -1)
        t.not(picked.indexOf('b'), -1)
        t.not(picked.indexOf('c'), -1)
        t.not(picked.indexOf('d'), -1)
    })
})

// randBox.shuffle()
test('shuffle() returns an array of the same size', t => {
    let arr = ['a', 'b', 'c', 'd', 'e']
    _.times(1000, () => {
        let shuffled = randBox.shuffle(_.clone(arr))
        t.is(shuffled.length, 5)
        t.not(shuffled.indexOf('a'), -1)
    })
})

test('shuffle() returns a well shuffled array', t => {
    // See http://vq.io/1lEhbim checking it isn't doing that!
    let arr = ['a', 'b', 'c', 'd', 'e'];
    let positions = {
        a: [0, 0, 0, 0, 0],
        b: [0, 0, 0, 0, 0],
        c: [0, 0, 0, 0, 0],
        d: [0, 0, 0, 0, 0],
        e: [0, 0, 0, 0, 0]
    };

    let shuffled = _.clone(arr)
    _.times(10000, () => {
        shuffled = randBox.shuffle(shuffled)
        shuffled.map((item, index) => {
            // Accumulate the position of the item each time
            positions[item][index]++
        })
    })

    Object.keys(positions).map((index) => {
        let position = positions[index]
        position.map((item) => {
            // This should be around 20% give or take a bit since there are
            // 5 elements and they should be evenly distributed
            t.true(item >= 1800)
            t.true(item <= 2200)
        })
    })
})

test('shuffle() does not destroy original array', t => {
    let arr = ['a', 'b', 'c', 'd', 'e']
    _.times(1000, () => {
        let cloned = _.clone(arr)
        let shuffled = randBox.shuffle(cloned)
        t.is(shuffled.length, 5)
        t.deepEqual(arr, cloned)
    })
})

// randBox.unique()
test('unique() gives a unique array of the selected function', t => {
    _.times(500, () => {
        let arr = randBox.unique(randBox.character, 25, { pool: "abcdefghijklmnopqrstuvwxyz" })
        t.true(_.isArray(arr))
        t.is(_.uniq(arr).length, 25)
    })
})

test('unique() works properly with options', t => {
    _.times(500, () => {
        let arr = randBox.unique(randBox.date, 20, { year: 2016 })
        t.true(_.isArray(arr))
        t.is(_.uniq(arr).length, 20)
    })
})

test('unique() throws when num is likely out of range', t => {
    const fn = () => randBox.unique(randBox.character, 10, { pool: 'abcde' })
    t.throws(fn, {message: 'RandBox: num is likely too large for sample set'})
})

test('unique() throws when first argument is not a function', t => {
    const fn = () => randBox.unique(randBox.character({ pool: 'abcde' }), 10)
    t.throws(fn, {message: 'RandBox: The first argument must be a function.'})
})

test('unique() will take a custom comparator for comparing complex objects', t => {
    const comparator = (arr, val) => {
        // If this is the first element, we know it doesn't exist
        if (arr.length === 0) {
            return false
        } else {
            // If a match has been found, short circuit check and just return
            return arr.reduce((acc, item) => acc ? acc : item.name === val.name, false)
        }
    }
    let arr = randBox.unique(randBox.currency, 25, { comparator: comparator })
    t.is(_.uniq(arr).length, 25)
})

test('unique() works without a third argument', t => {
    _.times(200, () => {
        t.true(_.isArray(randBox.unique(randBox.character, 10)))
    })
})

// randBox.weighted()
test('weighted() returns an element', t => {
    _.times(1000, () => {
        let picked = randBox.weighted(['a', 'b', 'c', 'd'], [1, 1, 1, 1])
        t.true(_.isString(picked))
        t.is(picked.length, 1)
    })
})

test('weighted() works with just 2 items', t => {
    // Use Math.random as the random function rather than our Mersenne twister
    //   just tospeed things up here because this test takes awhile to gather
    //   enough data to have a large enough sample size to adequately test. This
    //   increases speed by a few orders of magnitude at the cost of
    //   repeatability (which we aren't using here)
    let randBox = new RandBox(Math.random)
    var picked = { a: 0, b: 0 }

    // This makes it a tad slow, but we need a large enough sample size to
    //   adequately test
    _.times(50000, () => {
        picked[randBox.weighted(['a', 'b'], [1, 100])]++
    })

    // This range is somewhat arbitrary, but good enough to test our constraints
    let ratio = picked.b / picked.a
    t.true(ratio > 80)
    t.true(ratio < 120)
})

test('weighted() works with trim', t => {
    _.times(1000, () => {
        let picked = randBox.weighted(['a', 'b', 'c', 'd'], [1, 1, 1, 1], true)
        t.true(_.isString(picked))
        t.is(picked.length, 1)
    })
})

test('weighted() throws error if called with an array of weights different from options', t => {
    const fn = () => randBox.weighted(['a', 'b', 'c', 'd'], [1, 2, 3])
    t.throws(fn, {message: 'RandBox: Length of array and weights must match'})
})

test('weighted() does not throw error if called with good weights', t => {
    const fn = () => randBox.weighted(['a', 'b', 'c', 'd'], [1, 2, 3, 4])
    t.notThrows(fn)
})

test('weighted() throws error if weights invalid', t => {
    const fn = () => randBox.weighted(['a', 'b', 'c', 'd'], [0, 0, 0, 0])
    t.throws(fn, {message: 'RandBox: No valid entries in array weights'})
})

test('weighted() throws error if called with an array of weights different from options 2', t => {
    const fn = () => randBox.weighted(['a', 'b', 'c', 'd'], [1, 2, 3, 4, 5])
    t.throws(fn, {message: 'RandBox: Length of array and weights must match'})
})

test('weighted() throws error if weights contains NaN', t => {
    const fn = () => randBox.weighted(['a', 'b', 'c', 'd'], [1, NaN, 1, 1])
    t.throws(fn, {message: 'RandBox: All weights must be numbers'})
})

test('weighted() returns results properly weighted', t => {
    // Use Math.random as the random function rather than our Mersenne twister
    //   just tospeed things up here because this test takes awhile to gather
    //   enough data to have a large enough sample size to adequately test. This
    //   increases speed by a few orders of magnitude at the cost of
    //   repeatability (which we aren't using here)
    let randBox = new RandBox(Math.random)
    let picked = { a: 0, b: 0, c: 0, d: 0 }
    _.times(50000, () => {
        picked[randBox.weighted(['a', 'b', 'c', 'd'], [1, 100, 100, 1])]++
    })

    // This range is somewhat arbitrary, but good enough to test our constraints
    let baRatio = picked.b / picked.a
    t.true(baRatio > 60)
    t.true(baRatio < 140)

    let cdRatio = picked.c / picked.d
    t.true(cdRatio > 60)
    t.true(cdRatio < 140)

    let cbRatio = (picked.c / picked.b) * 100
    t.true(cbRatio > 50)
    t.true(cbRatio < 150)
})

test('weighted() works with fractional weights', t => {
    // Use Math.random as the random function rather than our Mersenne twister
    //   just tospeed things up here because this test takes awhile to gather
    //   enough data to have a large enough sample size to adequately test. This
    //   increases speed by a few orders of magnitude at the cost of
    //   repeatability (which we aren't using here)
    let randBox = new RandBox(Math.random)
    let picked = { a: 0, b: 0, c: 0, d: 0 }
    _.times(50000, () => {
        picked[randBox.weighted(['a', 'b', 'c', 'd'], [0.001, 0.1, 0.1, 0.001])]++
    })

    // This range is somewhat arbitrary, but good enough to test our constraints
    let baRatio = picked.b / picked.a
    t.true(baRatio > 60)
    t.true(baRatio < 140)

    let cdRatio = picked.c / picked.d
    t.true(cdRatio > 60)
    t.true(cdRatio < 140)

    let cbRatio = (picked.c / picked.b) * 100
    t.true(cbRatio > 50)
    t.true(cbRatio < 150)
})

test('weighted() works with weight of 0', t => {
    _.times(1000, () => {
        let picked = randBox.weighted(['a', 'b', 'c'], [1, 0, 1])
        t.true(_.isString(picked))
        t.true(picked !== 'b')
    })
})

test('weighted() works with negative weight', t => {
    _.times(1000, () => {
        let picked = randBox.weighted(['a', 'b', 'c'], [1, -2, 1])
        t.true(_.isString(picked))
        t.true(picked !== 'b')
    })
})

// randBox.pad()
test('pad() always returns same number when width same as length of number', t => {
    _.times(1000, () => {
        let num = randBox.natural({ min: 10000, max: 99999 })
        let padded = randBox.pad(num, 5)
        t.true(_.isString(padded))
        t.is(padded.length, 5)
    })
})

test('pad() will pad smaller number to the right width', t => {
    _.times(1000, () => {
        let num = randBox.natural({ max: 99999 })
        let padded = randBox.pad(num, 10)
        t.true(_.isString(padded))
        t.is(padded.length, 10)
        t.not(padded.indexOf('00000'), -1)
    })
})

test('pad() can take a pad e.lement', t => {
    _.times(1000, () => {
        let num = randBox.natural({ max: 99999 })
        let padded = randBox.pad(num, 10, 'V')
        t.true(_.isString(padded))
        t.is(padded.length, 10)
        t.not(padded.indexOf('VVVVV'), -1)
    })
})
