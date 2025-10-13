import test from "ava";
import { RandBox } from "../dist/index.esm.mjs";
import _ from "lodash";

const randBox = new RandBox();

// randBox.buffer()
test("buffer() returns a random buffer", t => {
  _.times(1000, () => {
    let buffer = randBox.buffer();
    t.true(_.isBuffer(buffer));
    let len = buffer.byteLength;
    t.true(len >= 5);
    t.true(len <= 20);
  });
});

// randBox.buffer()
test("buffer() will obey bounds", t => {
  _.times(1000, () => {
    let buffer = randBox.buffer({ length: 12 });
    t.true(_.isBuffer(buffer));
    t.is(buffer.byteLength, 12);
  });
});

// randBox.buffer()
test("buffer() throws if length < 0", t => {
  const fn = () => randBox.buffer({ length: -3 });
  t.throws(fn, {message: "RandBox: Length cannot be less than zero."});
});
