import test from 'ava'
import { RandBox } from '../dist/index.esm.mjs'
import _ from 'lodash'

const randBox = new RandBox()

// randBox.cf()
test('cf() returns a valid random cf', t => {
    _.times(1000, () => {
        let cf = randBox.cf()
        t.true(_.isString(cf))
        t.is(cf.length, 16)
        t.true(/[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]/.test(cf))
    })
})

test('cf() returns a consistent cf', t => {
    let testCases = [{
        item: {
            first: 'Aldo',
            last: 'Fabrizi',
            gender: 'Male',
            birthday: new Date(1905,10,1),
            city: 'h501'
        },
        cf: 'FBRLDA05S01H501A'
    }, {
        item: {
            first: 'Sophia',
            last: 'Loren',
            gender: 'Female',
            birthday: new Date(1934,8,20),
            city: 'h501'
        },
        cf: 'LRNSPH34P60H501G'
    }, {
        item: {
            first: 'Claudia',
            last: 'Cardinale',
            gender: 'Female',
            birthday: new Date(1938,3,15),
            city: 'z352'
        },
        cf: 'CRDCLD38D55Z352Q'
    }, {
        item: {
            first: 'Sergio',
            last: 'Leone',
            gender: 'Male',
            birthday: new Date(1929,0,3),
            city: 'h501'
        },
        cf: 'LNESRG29A03H501W'
    }, {
        item: {
            first: 'Claudio',
            last: 'Marchisio',
            gender: 'Male',
            birthday: new Date(1986,0,19),
            city: 'l219'
        },
        cf: 'MRCCLD86A19L219F'
    }, {
        item: {
            first: 'Eu',
            last: 'Ho',
            gender: 'Male',
            birthday: new Date(2012,3,12),
            city: 'z210'
        },
        cf: 'HOXEUX12D12Z210Q'
    }];

    testCases.map((test) => {
        t.is(randBox.cf(test.item), test.cf)
    })
})

// randBox.pl_nip()
test('pl_nip() returns a valid NIP number', t => {
    _.times(1000, () => {
        let nip = randBox.pl_nip()
        t.true(_.isString(nip))
        t.is(nip.length, 10)
    })
})

// randBox.pl_pesel()
test('pl_pesel() returns a valid PESEL number', t => {
    _.times(1000, () => {
        let pesel = randBox.pl_pesel()
        t.true(_.isString(pesel))
        t.is(pesel.length, 11)
    })
})

// randBox.pl_regon()
test('pl_regon() returns a valid REGON number', t => {
    _.times(1000, () => {
        let regon = randBox.pl_regon()
        t.true(_.isString(regon))
        t.is(regon.length, 9)
    })
})

// randBox.vat()
test('vat() returns a valid italian vat number', t => {
    _.times(1000, () => {
        let vat = randBox.vat({ country: 'it' })
        t.true(_.isString(vat))
        t.is(vat.length, 11)
        let first = vat.charAt(0)
        t.true(first === '0' || first === '1')
        t.true(randBox.luhn_check(vat))
    })
})
