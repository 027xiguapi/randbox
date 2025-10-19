import test from 'ava'
import { RandBox } from '../dist/index.esm.mjs'
import _ from 'lodash'

const randBox = new RandBox()

const timeout = (seconds) => {
  new Promise((resolve, reject) => {
    setTimeout(() => resolve(), seconds)
  })
}

//randBox.animal()

test('returns an animal', t => {
  _.times(1000, () => {
    let animal = randBox.animal({
      type: "desert"
    })
    t.true(_.isString(animal))
    t.true(animal.length >= 2)
  })
})

test('returns an animal even if type is not specified', t => {
  _.times(1000, () => {
    let animal = randBox.animal()
    t.true(_.isString(animal))
    t.true(animal.length >= 2)
  })
})

test('throws an error if the type is not part of the animals object', t => {
  _.times(1000, () => {
    const fn = () => randBox.animal({
      type: "banana"
    })
    t.throws(fn, {message: "Please pick from desert, ocean, grassland, forest, zoo, pets, farm."})
  })
})
