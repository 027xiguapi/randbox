import test from 'ava'
import { RandBox } from '../dist/index.esm.mjs'
import _ from 'lodash'

const randBox = new RandBox()

// randBox.coin()
test('coin() returns a coin', t => {
    _.times(1000, () => {
        t.true(/(heads|tails)/.test(randBox.coin()))
    })
})

// randBox.d4()
test('d4() returns a properly bounded d4', t => {
    _.times(1000, () => {
        let die = randBox.d4()
        t.true(die >= 1)
        t.true(die <= 4)
    })
})

// randBox.d6()
test('d6() returns a properly bounded d6', t => {
    _.times(1000, () => {
        let die = randBox.d6()
        t.true(die >= 1)
        t.true(die <= 6)
    })
})

// randBox.d8()
test('d8() returns a properly bounded d8', t => {
    _.times(1000, () => {
        let die = randBox.d8()
        t.true(die >= 1)
        t.true(die <= 8)
    })
})

// randBox.d10()
test('d10() returns a properly bounded d10', t => {
    _.times(1000, () => {
        let die = randBox.d10()
        t.true(die >= 1)
        t.true(die <= 10)
    })
})

// randBox.d12()
test('d12() returns a properly bounded d12', t => {
    _.times(1000, () => {
        let die = randBox.d12()
        t.true(die >= 1)
        t.true(die <= 12)
    })
})

// randBox.d20()
test('d20() returns a properly bounded d20', t => {
    _.times(1000, () => {
        let die = randBox.d20()
        t.true(die >= 1)
        t.true(die <= 20)
    })
})

// randBox.d30()
test('d30() returns a properly bounded d30', t => {
    _.times(1000, () => {
        let die = randBox.d30()
        t.true(die >= 1)
        t.true(die <= 30)
    })
})

// randBox.d100()
test('d100() returns a properly bounded d100', t => {
    _.times(1000, () => {
        let die = randBox.d100()
        t.true(die >= 1)
        t.true(die <= 100)
    })
})


// randBox.emotion()
test('emotion() returns a random emotion', t => {
    _.times(1000, () => {
        let emotion = randBox.emotion()
        t.true(_.isString(emotion))
        t.true(emotion.length >= 2)
        t.true(emotion.length <= 30)
    })
})

// randBox.guid()
test('guid() returns a proper guid', t => {
    _.times(1000, () => {
        t.true(/([0-9a-fA-F]){8}(-([0-9a-fA-F]){4}){3}-([0-9a-fA-F]){12}/.test(randBox.guid()))
    })
})

test('guid() returns a proper version 1 guid', t => {
    _.times(1000, () => {
        t.true(/([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-1([0-9a-fA-F]){3}-([ab89])([0-9a-fA-F]){3}-([0-9a-fA-F]){12}/.test(randBox.guid({ version: 1 })))
    })
})

test('guid() returns a proper version 2 guid', t => {
    _.times(1000, () => {
        t.true(/([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-2([0-9a-fA-F]){3}-([ab89])([0-9a-fA-F]){3}-([0-9a-fA-F]){12}/.test(randBox.guid({ version: 2 })))
    })
})

test('guid() returns a proper version 3 guid', t => {
    _.times(1000, () => {
        t.true(/([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-3([0-9a-fA-F]){3}-([ab89])([0-9a-fA-F]){3}-([0-9a-fA-F]){12}/.test(randBox.guid({ version: 3 })))
    })
})

test('guid() returns a proper version 4 guid', t => {
    _.times(1000, () => {
        t.true(/([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-4([0-9a-fA-F]){3}-([ab89])([0-9a-fA-F]){3}-([0-9a-fA-F]){12}/.test(randBox.guid({ version: 4 })))
    })
})

test('guid() returns a proper version 5 guid', t => {
    _.times(1000, () => {
        t.true(/([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-5([0-9a-fA-F]){3}-([ab89])([0-9a-fA-F]){3}-([0-9a-fA-F]){12}/.test(randBox.guid({ version: 5 })))
    })
})

// randBox.hash()
test('hash() returns a proper hash', t => {
    _.times(1000, () => {
        let hash = randBox.hash()
        t.true(/([0-9a-f]){40}/.test(hash))
        t.is(hash.length, 40)
    })
})

test('hash() obeys length, if supplied', t => {
    _.times(1000, () => {
        let length = randBox.natural({ min: 1, max: 64 })
        let hash = randBox.hash({ length: length })
        t.is(hash.length, length)
    })
})

// randBox.mac_address()
test('mac_address() returns a proper mac address', t => {
    _.times(1000, () => {
        t.true(/([0-9a-fA-F]){2}:([0-9a-fA-F]){2}:([0-9a-fA-F]){2}:([0-9a-fA-F]){2}:([0-9a-fA-F]){2}:([0-9a-fA-F]){2}/.test(randBox.mac_address()))
    })
})

test('mac_address() returns a proper colon separated mac address', t => {
    _.times(1000, () => {
        t.true(/([0-9a-fA-F]){2}:([0-9a-fA-F]){2}:([0-9a-fA-F]){2}:([0-9a-fA-F]){2}:([0-9a-fA-F]){2}:([0-9a-fA-F]){2}/.test(randBox.mac_address({ separator: ':' })))
    })
})

test('mac_address() returns a proper hyphen separated mac address', t => {
    _.times(1000, () => {
        t.true(/([0-9a-fA-F]){2}-([0-9a-fA-F]){2}-([0-9a-fA-F]){2}-([0-9a-fA-F]){2}-([0-9a-fA-F]){2}-([0-9a-fA-F]){2}/.test(randBox.mac_address({ separator: '-' })))
    })
})

test('mac_address() returns a proper network version mac address', t => {
    _.times(1000, () => {
        t.true(/([0-9a-fA-F]){4}.([0-9a-fA-F]){4}.([0-9a-fA-F]){4}/.test(randBox.mac_address({ networkVersion: true })))
    })
})

// randBox.mixin()
test('mixin() works with a simple function', t => {
    randBox.mixin({
        user: () => {
            return {
                first: randBox.first(),
                last: randBox.last(),
                email: randBox.email()
            }
        }
    })
    t.truthy(randBox.user)
    _.times(1000, () => {
        let user = randBox.user()
        t.truthy(user)
        t.truthy(user.first)
        t.true(_.isString(user.last))
        t.true(_.isString(user.email))
    })
})

test('mixin() multiple work, we can call previously defined mixins', t => {
    randBox.mixin({
        user: () => {
            return {
                first: randBox.first(),
                last: randBox.last(),
                email: randBox.email()
            }
        },
        social_user: () => {
            let user = randBox.user()
            user.network = randBox.pick(['facebook', 'twitter'])
            return user
        }
    })
    t.truthy(randBox.user)
    t.truthy(randBox.social_user)
    _.times(1000, () => {
        let social_user = randBox.social_user()
        t.truthy(social_user)
        t.truthy(social_user.first)
        t.truthy(social_user.network)
        t.true(social_user.network === 'facebook' ||
               social_user.network === 'twitter')
    })
})

// randBox.radio()
test('radio() works as expected', t => {
    _.times(1000, () => {
        let radio = randBox.radio()
        t.true(_.isString(radio))
        t.is(radio.length, 4)
        t.true(/^[KW][A-Z][A-Z][A-Z]/.test(radio))
    })
})

test('radio() accepts east', t => {
    _.times(1000, () => {
        let radio = randBox.radio({ side: 'east' })
        t.true(_.isString(radio))
        t.is(radio.length, 4)
        t.true(/^[W][A-Z][A-Z][A-Z]/.test(radio))
    })
})

test('radio() accepts west', t => {
    _.times(1000, () => {
        let radio = randBox.radio({ side: 'west' })
        t.true(_.isString(radio))
        t.is(radio.length, 4)
        t.true(/^[K][A-Z][A-Z][A-Z]/.test(radio))
    })
})

// randBox.rpg()
test('rpg() appears to work as expected', t => {
    _.times(1000, () => {
        let dice = randBox.rpg('5d20')
        t.true(_.isArray(dice))
        t.is(dice.length, 5)
        dice.map((die) => {
            t.true(die >= 1)
            t.true(die <= 20)
        })
    })
})

test('rpg() without a die roll throws an error', t => {
    t.throws(() => randBox.rpg(), {message: 'RandBox: A type of die roll must be included'})
})

test('rpg() throws errors where it should', t => {
    const errorFns = [
        () => randBox.rpg('3'),
        () => randBox.rpg('hd23'),
        () => randBox.rpg('3d23d2'),
        () => randBox.rpg('d20')
    ]
    errorFns.map((fn) => {
        t.throws(fn, {message: 'RandBox: Invalid format provided. Please provide #d# where the first # is the number of dice to roll, the second # is the max of each die'})
    })
})

test('rpg() will take and obey a sum', t => {
    _.times(1000, () => {
        let rpg = randBox.rpg('4d20', { sum: true })
        t.true(_.isNumber(rpg))
        t.true(rpg >= 4)
        t.true(rpg <= 80)
    })
})

// randBox.tv()
test('tv() works as expected', t => {
    _.times(1000, () => {
        let tv = randBox.tv()
        t.true(_.isString(tv))
        t.is(tv.length, 4)
        t.true(/^[KW][A-Z][A-Z][A-Z]/.test(tv))
    })
})
