import test from 'ava'
import { RandBox } from '../dist/index.esm.mjs'
import _ from 'lodash'

const randBox = new RandBox()

// randBox.android_id()
test('android_id() returns a proper android id', t => {
    _.times(1000, () => t.true(/APA91([0-9a-zA-Z-_]){178}/.test(randBox.android_id())))
})

// randBox.apple_token()
test('apple_token() returns a proper apple push token', t => {
    _.times(1000, () => t.true(/([0-9a-fA-F]){64}/.test(randBox.apple_token())))
})

// randBox.wp8_anid2()
test('wp8_anid2() returns a proper windows phone 8 anid2', t => {
    _.times(1000, () => t.true(/^([0-9a-zA-Z]){43}=$/.test(randBox.wp8_anid2())))
})

// randBox.wp7_anid()
test('wp7_anid() returns a proper windows phone 7 anid', t => {
    _.times(1000, () => t.true(/^A=[0-9A-F]{32}&E=[0-9a-f]{3}&W=\d$/.test(randBox.wp7_anid())))
})

test('bb_pin() returns a proper blackberry pin', t => {
    _.times(1000, () => t.true(/([0-9a-f]){8}/.test(randBox.bb_pin())))
})
