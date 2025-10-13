import test from 'ava'
import { RandBox } from '../dist/index.esm.mjs'
import _ from 'lodash'

const randBox = new RandBox()

test('cnpj() returns a random valid taxpayer number for Brazil companies (CNPJ)', t => {
    _.times(1000, () => {
        let cnpj = randBox.cnpj()
        t.true(_.isString(cnpj))
        t.true(/^\d{2}.\d{3}.\d{3}\/\d{4}-\d{2}$/m.test(cnpj))
        t.is(cnpj.length, 18)
    })
})

