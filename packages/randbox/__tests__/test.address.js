import test from 'ava'
import { RandBox } from '../dist/index.esm.mjs'
import _ from 'lodash'
import phoneNumber from './helpers/phoneNumber.min.js'

const randBox = new RandBox()

// randBox.address()
test('address() returns a string', t => {
    t.true(_.isString(randBox.address()))
})

test('address() starts with a number', t => {
    _.times(1000, () => t.true(/[0-9]+.+/.test(randBox.address())))
})

test('address() can take a short_suffix arg and obey it', t => {
    _.times(1000, () => {
        let address = randBox.address({ short_suffix: true })
        t.true(address.split(' ')[2].length < 5)
    })
})

// randBox.altitude()
test('altitude() looks right', t => {
    t.is(typeof randBox.altitude(), 'number')
})

test('altitude() is in the right range', t => {
    _.times(1000, () => {
        let altitude = randBox.altitude()
        t.true(altitude > 0)
        t.true(altitude < 8848)
    })
})

test('altitude() will accept a min and obey it', t => {
    _.times(1000, () => {
        let min = randBox.floating({ min: 0, max: 8848 })
        let altitude = randBox.altitude({ min: min })
        t.true(altitude > min)
        t.true(altitude < 8848)
    })
})

test('altitude() will accept a max and obey it', t => {
    _.times(1000, () => {
        let max = randBox.floating({ min: 0, max: 8848 })
        let altitude = randBox.altitude({ max: max })
        t.true(altitude > 0)
        t.true(altitude < max)
    })
})

// randBox.areacode()
test('areacode() looks right', t => {
    _.times(1000, () => {
        let areacode = randBox.areacode()
        t.true(_.isString(areacode))
        t.true(/^\(([2-9][0-8][0-9])\)$/.test(areacode))
    })
})

test('areacode() can take parens', t => {
    _.times(1000, () => {
        let areacode = randBox.areacode({ parens: false })
        t.true(_.isString(areacode))
        t.true(/^([2-9][0-8][0-9])$/.test(areacode))
    })
})

// randBox.city()
test('city() looks right', t => {
    _.times(1000, () => {
        let city = randBox.city()
        t.true(_.isString(city))
        t.true(/[a-zA-Z]+/.test(city))
    })
})

// randBox.coordinates()
test('coordinates() looks right', t => {
    _.times(1000, () => {
        let coordinates = randBox.coordinates()
        t.true(_.isString(coordinates))
        t.is(coordinates.split(',').length, 2)
    })
})

test('coordinates() returns coordinates in DD format as default', t => {
    _.times(1000, () => {
        const CHARS_NOT_TO_CONTAIN = ['°', '’', '”']
        
        let coordinates = randBox.coordinates()
        let [ latitude, longitude ] = coordinates.split(',')

        t.true(_.isString(coordinates))
        t.is(coordinates.split(',').length, 2)
        t.true(CHARS_NOT_TO_CONTAIN.every(char => !latitude.includes(char)))
        t.true(CHARS_NOT_TO_CONTAIN.every(char => !longitude.includes(char)))
    })
})

test('coordinates() will obey DD format', t => {
    _.times(1000, () => {
        const CHARS_NOT_TO_CONTAIN = ['°', '’', '”']
        
        let coordinates = randBox.coordinates({format: 'dd'})
        let [ latitude, longitude ] = coordinates.split(',')

        t.true(_.isString(coordinates))
        t.is(coordinates.split(',').length, 2)
        t.true(CHARS_NOT_TO_CONTAIN.every(char => !latitude.includes(char)))
        t.true(CHARS_NOT_TO_CONTAIN.every(char => !longitude.includes(char)))
    })
})

test('coordinates() will obey DDM format', t => {
    _.times(1000, () => {
        const CHARS_TO_CONTAIN = ['°']
        const CHARS_NOT_TO_CONTAIN = ['’', '”']
        
        let coordinates = randBox.coordinates({format: 'ddm'})
        let [ latitude, longitude ] = coordinates.split(',')

        t.true(_.isString(coordinates))
        t.is(coordinates.split(',').length, 2)
        t.true(CHARS_TO_CONTAIN.every(char => latitude.includes(char)))
        t.true(CHARS_TO_CONTAIN.every(char => longitude.includes(char)))
        t.true(CHARS_NOT_TO_CONTAIN.every(char => !latitude.includes(char)))
        t.true(CHARS_NOT_TO_CONTAIN.every(char => !longitude.includes(char)))
    })
})

test('coordinates() will obey DMS format', t => {
    _.times(1000, () => {
        const CHARS_TO_CONTAIN = ['°', '’', '”']
        
        let coordinates = randBox.coordinates({format: 'dms'})
        let [ latitude, longitude ] = coordinates.split(',')

        t.true(_.isString(coordinates))
        t.is(coordinates.split(',').length, 2)
        t.true(CHARS_TO_CONTAIN.every(char => latitude.includes(char)))
        t.true(CHARS_TO_CONTAIN.every(char => longitude.includes(char)))
    })
})

// randBox.counties()
test('counties() returns an array of counties', t => {
    t.true(_.isArray(randBox.counties()))
})

test('counties() returns a (long) county name', t => {
    _.times(1000, () => t.true(randBox.counties({ full: true }).length > 2))
})

test('counties() can return a random (long) county name', t => {
    _.times(1000, () => {
        t.true(randBox.counties({ full: true, country: 'uk' }).length > 2)
    })
})

// randBox.countries()
test('countries() returns an array of countries', t => {
    t.true(_.isArray(randBox.countries()))
})

// randBox.country()
test('country() returns a random (short) country name', t => {
    _.times(1000, () => {
        t.is(randBox.country().length, 2)
    })
})

test('country() returns a random (long) country name', t => {
    _.times(1000, () => {
        t.true(randBox.country({ full: true }).length > 2)
    })
})

// randBox.county()
test('county() returns a random county name', t => {
    _.times(1000, () => {
        t.true(_.isString(randBox.county()))
    })
})

// randBox.depth()
test('depth() looks right', t => {
    t.is(typeof randBox.depth(), 'number')
})

test('depth() is in the right range', t => {
    _.times(1000, () => {
        let depth = randBox.depth()
        t.true(depth > -10994)
        t.true(depth < 0)
    })
})

test('depth() will accept a min and obey it', t => {
    _.times(1000, () => {
        let min = randBox.floating({ min: -10994, max: 0 })
        let depth = randBox.depth({ min: min })
        t.true(depth > min)
        t.true(depth < 0)
    })
})

test('depth() will accept a max and obey it', t => {
    _.times(1000, () => {
        let max = randBox.floating({ min: -10994, max: 0 })
        let depth = randBox.depth({ max: max })
        t.true(depth > -10994)
        t.true(depth < max)
    })
})

// randBox.geohash
test('geohash() looks right', t => {
    let geohash = randBox.geohash()
    t.true(_.isString(geohash))
    t.is(geohash.length, 7)
})

test('geohash() will accept a length and obey it', t => {
    _.times(1000, () => {
        let length = randBox.d10()
        let geohash = randBox.geohash({ length: length })
        t.is(geohash.length, length)
    })
})

// randBox.latitude()
test('latitude() looks right', t => {
    t.is(typeof randBox.latitude(), 'number')
})

test('latitude() is in the right range', t => {
    _.times(1000, () => {
        let latitude = randBox.latitude()
        t.true(latitude >= -90)
        t.true(latitude <= 90)
    })
})

test('latitude() will accept a min and obey it', t => {
    _.times(1000, () => {
        let min = randBox.floating({ min: -90, max: 90 })
        let latitude = randBox.latitude({ min: min })
        t.true(latitude >= min)
        t.true(latitude <= 90)
    })
})

test('latitude() will accept a max and obey it', t => {
    _.times(1000, () => {
        let max = randBox.floating({ min: -90, max: 90 })
        let latitude = randBox.latitude({ max: max })
        t.true(latitude >= -90)
        t.true(latitude <= max)
    })
})

test('latitude() returns latitude in DD format as default', t => {
    _.times(1000, () => {
        const CHARS_NOT_TO_CONTAIN = ['°', '’', '”']
        
        let latitude = randBox.latitude()

        t.is(typeof latitude, 'number')
        t.true(CHARS_NOT_TO_CONTAIN.every(char => !latitude.toString().includes(char)))
    })
})

test('latitude() will obey DD format', t => {
    _.times(1000, () => {
        const CHARS_NOT_TO_CONTAIN = ['°', '’', '”']
        
        let latitude = randBox.latitude({format: 'dd'})

        t.is(typeof latitude, 'number')
        t.true(CHARS_NOT_TO_CONTAIN.every(char => !latitude.toString().includes(char)))
    })
})

test('latitude() will obey DDM format', t => {
    _.times(1000, () => {
        const CHARS_TO_CONTAIN = ['°']
        const CHARS_NOT_TO_CONTAIN = ['’', '”']
        
        let latitude = randBox.latitude({format: 'ddm'})

        t.true(_.isString(latitude))
        t.true(CHARS_TO_CONTAIN.every(char => latitude.includes(char)))
        t.true(CHARS_NOT_TO_CONTAIN.every(char => !latitude.includes(char)))
    })
})

test('latitude() will obey DMS format', t => {
    _.times(1000, () => {
        const CHARS_TO_CONTAIN = ['°', '’', '”']
        
        let latitude = randBox.latitude({format: 'dms'})

        t.true(_.isString(latitude))
        t.true(CHARS_TO_CONTAIN.every(char => latitude.includes(char)))
    })
})

// randBox.longitude()
test('longitude() looks right', t => {
    t.is(typeof randBox.longitude(), 'number')
})

test('longitude() is in the right range', t => {
    _.times(1000, () => {
        let longitude = randBox.longitude()
        t.true(longitude >= -180)
        t.true(longitude <= 180)
    })
})

test('longitude() will accept a min and obey it', t => {
    _.times(1000, () => {
        let min = randBox.floating({ min: -180, max: 180 })
        let longitude = randBox.longitude({ min: min })
        t.true(longitude >= min)
        t.true(longitude <= 180)
    })
})

test('longitude() will accept a max and obey it', t => {
    _.times(1000, () => {
        let max = randBox.floating({ min: -180, max: 180 })
        let longitude = randBox.longitude({ max: max })
        t.true(longitude >= -180)
        t.true(longitude <= max)
    })
})

test('longitude() returns longitude in DD format as default', t => {
    _.times(1000, () => {
        const CHARS_NOT_TO_CONTAIN = ['°', '’', '”']
        
        let longitude = randBox.longitude()

        t.is(typeof longitude, 'number')
        t.true(CHARS_NOT_TO_CONTAIN.every(char => !longitude.toString().includes(char)))
    })
})

test('longitude() will obey DD format', t => {
    _.times(1000, () => {
        const CHARS_NOT_TO_CONTAIN = ['°', '’', '”']
        
        let longitude = randBox.longitude({format: 'dd'})

        t.is(typeof longitude, 'number')
        t.true(CHARS_NOT_TO_CONTAIN.every(char => !longitude.toString().includes(char)))
    })
})

test('longitude() will obey DDM format', t => {
    _.times(1000, () => {
        const CHARS_TO_CONTAIN = ['°']
        const CHARS_NOT_TO_CONTAIN = ['’', '”']
        
        let longitude = randBox.longitude({format: 'ddm'})

        t.true(_.isString(longitude))
        t.true(CHARS_TO_CONTAIN.every(char => longitude.includes(char)))
        t.true(CHARS_NOT_TO_CONTAIN.every(char => !longitude.includes(char)))
    })
})

test('longitude() will obey DMS format', t => {
    _.times(1000, () => {
        const CHARS_TO_CONTAIN = ['°', '’', '”']
        
        let longitude = randBox.longitude({format: 'dms'})

        t.true(_.isString(longitude))
        t.true(CHARS_TO_CONTAIN.every(char => longitude.includes(char)))
    })
})

// randBox.phone()
test('phone() returns a string', t => {
    t.true(_.isString(randBox.phone()))
})

test('phone() looks like an actual phone number', t => {
    t.true(/^\(([2-9][0-8][0-9])\)?[\-. ]?([2-9][0-9]{2,2})[\-. ]?([0-9]{4,4})$/.test(randBox.phone()))
})

test('phone() obeys formatted option', t => {
    _.times(1000, () => {
        let phone = randBox.phone({ formatted: false })
        t.true(_.isString(phone))
        t.true(/^[2-9][0-8]\d[2-9]\d{6,6}$/.test(phone))
    })
})

test('phone() obeys formatted option and parens option', t => {
    _.times(1000, () => {
        let phone = randBox.phone({ formatted: false, parens: true })
        t.true(_.isString(phone))
        t.true(/^[2-9][0-8]\d[2-9]\d{6,6}$/.test(phone))
    })
})

test("phone() obeys exampleNumber option", (t) => {
  _.times(1000, () => {
    let phone = randBox.phone({ exampleNumber: true });
    t.true(_.isString(phone));
    t.true(/^\(555\)?[\-. ]?([2-9][0-9]{2,2})[\-. ]?([0-9]{4,4})$/.test(phone));
  });
});

test("phone() obeys formatted option and exampleNumber option", (t) => {
  _.times(1000, () => {
    let phone = randBox.phone({ exampleNumber: true, formatted: false });
    t.true(_.isString(phone));
    t.true(/^555[2-9]\d{6,6}$/.test(phone));
  });
});

test('phone() with uk option works', t => {
    t.true(_.isString(randBox.phone({ country: 'uk' })))
})

test('phone() with uk option works and mobile option', t => {
    t.true(_.isString(randBox.phone({ country: 'uk', mobile: true })))
})

test('phone() with uk country looks right', t => {
    t.true(phoneNumber.isValid(randBox.phone({ country: 'uk' })))
})

test('phone() with uk country unformatted looks right', t => {
    t.true(phoneNumber.isValid(phoneNumber.format(randBox.phone({
        country: 'uk',
        formatted: false
    }))))
})

test('phone() with uk country and mobile option looks right', t => {
    _.times(1000, () => {
        t.true(phoneNumber.isValid(randBox.phone({
            country: 'uk',
            mobile: true
        })))
    })
})

test('phone() with uk country and mobile option unformatted looks right', t => {
    _.times(1000, () => {
        t.true(phoneNumber.isValid(phoneNumber.format(randBox.phone({
            country: 'uk',
            mobile: true,
            formatted: false
        }))))
    })
})

test('phone() with fr country works', t => {
    t.true(_.isString(randBox.phone({ country: 'fr' })))
})

test('phone() with fr country works with mobile option', t => {
    t.true(_.isString(randBox.phone({ country: 'fr', mobile: true })))
})

test('phone() with fr country looks right', t => {
    _.times(1000, () => {
        t.true(/0[123459] .. .. .. ../.test(randBox.phone({ country: 'fr' })))
    })
})

test('phone() with fr country looks right unformatted', t => {
    _.times(1000, () => {
        t.true(/0........./.test(randBox.phone({
            country: 'fr',
            formatted: false
        })))
    })
})

test('phone() with fr country on mobile looks right', t => {
    _.times(1000, () => {
        t.true(/0[67] .. .. .. ../.test(randBox.phone({
            country: 'fr',
            mobile: true
        })))
    })
})

test('phone() with fr country on mobile, unformatted looks right', t => {
    _.times(1000, () => {
        t.true(/0[67]......../.test(randBox.phone({
            country: 'fr',
            mobile: true,
            formatted: false
        })))
    })
})

test('phone() with br country option works', t => {
    t.true(_.isString(randBox.phone({ country: 'br' })))
})

test('phone() with br country and mobile option works', t => {
    t.true(_.isString(randBox.phone({ country: 'br', mobile: true })))
})

test('phone() with br country and formatted false option return a correct format', t => {
    t.true(/([0-9]{2})([2-5]{1})([0-9]{3})([0-9]{4})/.test(randBox.phone({
        country: 'br',
        mobile: false,
        formatted: false
    })))
})

test('phone() with br country, formatted false and mobile option return a correct format', t => {
    t.true(/([0-9]{2})\9([0-9]{4})([0-9]{4})/.test(randBox.phone({
        country: 'br',
        mobile: true,
        formatted: false
    })))
})

test('phone() with br country and formatted option apply the correct mask', t => {
    t.true(/\(([0-9]{2})\) ([2-5]{1})([0-9]{3})\-([0-9]{4})/.test(randBox.phone({
        country: 'br',
        mobile: false,
        formatted: true
    })))
})

test('phone() with br country, formatted and mobile option apply the correct mask', t => {
    t.true(/\(([0-9]{2})\) 9([0-9]{4})\-([0-9]{4})/.test(randBox.phone({
        country: 'br',
        mobile: true,
        formatted: true
    })))
})

// randBox.postal()
test('postal() returns a valid basic postal code', t => {
    _.times(1000, () => {
        let postal = randBox.postal()
        t.is(postal.length, 7)
        postal.split('').map((char) => {
            t.is(char.toUpperCase(), char)
        })
    })
})

test('postcode() returns a valid basic postcode', t => {
    _.times(10, () => {
        let postcode = randBox.postcode();
        t.regex(postcode, /^[A-Z]{1,2}\d[A-Z\d]? \d[A-Z]{2}$/);
    })
})

// randBox.province()
test('province() returns a random (short) province name', t => {
    _.times(1000, () => t.true(randBox.province().length < 3))
})

test('province() can return a long random province name', t => {
    _.times(1000, () => t.true(randBox.province({ full: true }).length > 2))
})

test('province() can return a random long "it" province', t => {
    _.times(1000, () => {
        t.true(randBox.province({country: 'it', full: true }).length > 2)
    })
})

// randBox.provinces()
test('provinces() returns an array of provinces', t => {
    t.true(_.isArray(randBox.provinces()))
})

test('provinces() supports internationalization', t => {
    t.not(randBox.provinces(), randBox.provinces({ country: 'it' }))
})

// randBox.state()
test('state() returns a random (short) state name', t => {
    _.times(1000, () => t.true(randBox.state().length < 3))
})

test('state() can take a country and return a state', t => {
    _.times(1000, () => t.true(randBox.state({ country: 'it' }).length === 3))
})

test('state() can return full state name', t => {
    _.times(1000, () => {
        t.true(randBox.state({
            full: true
        }).length > 2)
    })
})

test('state() with country returns a long state name', t => {
    _.times(1000, () => {
        t.true(randBox.state({
            country: 'it',
            full: true
        }).length > 2)
    })
    _.times(1000, () => {
        t.true(randBox.state({
            country: 'uk',
            full: true
        }).length > 2)
    })
})

// randBox.states()
test('states() returns an array of states', t => {
    t.true(_.isArray(randBox.states()))
})

test('states() returns all 50 states and DC', t => {
    t.is(randBox.states().length, 51)
})

test('states() with territories returns 50 US states, DC, and 7 US territories', t => {
    t.is(randBox.states({
        territories: true
    }).length, 58)
})

test('states() without us states and dc returns 7 US territories', t => {
    t.is(randBox.states({
        territories: true,
        us_states_and_dc: false
    }).length, 7)
})

test('states() with armed forces returns 50 states, DC, and 3 armed forces military states', t => {
    t.is(randBox.states({
        armed_forces: true
    }).length, 54)
})

test('states() with armed forces without states returns 3 armed forces states', t => {
    t.is(randBox.states({
        armed_forces: true,
        us_states_and_dc: false
    }).length, 3)
})

test('states() with all options returns 61 items', t => {
    t.is(randBox.states({
        territories: true,
        armed_forces: true
    }).length, 61)
})

test('states() without states returns 7 territories and 3 armed forces states', t => {
    t.is(randBox.states({
        territories: true,
        armed_forces: true,
        us_states_and_dc: false
    }).length, 10)
})

test('states() with country of "it" returns 20 regions', t => {
    t.is(randBox.states({
        country: 'it'
    }).length, 20)
})

test('states() with country of "uk" returns 129 UK counties', t => {
    t.is(randBox.states({
        country: 'uk'
    }).length, 129)
})

test('states() with country of "mx" returns 32 MX states', t => {
    t.is(randBox.states({
        country: 'mx'
    }).length, 32)
})

// randBox.street()
test('street() works', t => {
    _.times(100, () => t.is(typeof randBox.street(), 'string'))
})

test('street() works with it country', t => {
    _.times(100, () => t.is(typeof randBox.street({ country: 'it' }), 'string'))
})

// randBox.street_suffix()
test('street_suffix() returns a single suffix', t => {
    _.times(1000, () => {
        let suffix = randBox.street_suffix()
        t.is(typeof suffix, 'object')
        t.is(typeof suffix.name, 'string')
        t.is(typeof suffix.abbreviation, 'string')
    })
})

// randBox.street_suffixes()
test('street_suffixes() returns the suffix array', t => {
    let suffixes = randBox.street_suffixes()
    t.true(_.isArray(suffixes))
    suffixes.map((suffix) => {
        t.truthy(suffix.name)
        t.truthy(suffix.abbreviation)
    })
})

test('street_suffixes() are short', t => {
    let suffixes = randBox.street_suffixes()
    suffixes.map((suffix) => {
        t.true(suffix.abbreviation.length < 5)
    })
})

test('street_suffixes() are longish', t => {
    let suffixes = randBox.street_suffixes()
    suffixes.map((suffix) => {
        t.true(suffix.name.length > 2)
    })
})

// randBox.zip()
test('zip() returns a valid basic zip code', t => {
    _.times(1000, () => {
        let zip = randBox.zip()
        t.is(zip.length, 5)
        t.true(/(^\d{5}$)|(^\d{5}-\d{4}$)/.test(zip))
    })
})

test('zip() returns a valid zip+4 code', t => {
    _.times(1000, () => {
        let zip = randBox.zip({ plusfour: true })
        t.is(zip.length, 10)
        t.true(/(^\d{5}$)|(^\d{5}-\d{4}$)/.test(zip))
    })
})
