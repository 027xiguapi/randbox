import test from "ava";
import { RandBox } from "../dist/index.esm.mjs";
import _ from "lodash";

const randBox = new RandBox();

test("fileWithContent() returns a random filename but extention of .gif", (t) => {
  _.times(1, () => {
    const file = randBox.fileWithContent({
      fileExtension: "gif",
      fileSize: 1024,
    });
    t.true(_.isBuffer(file.fileData));
    t.is(file.fileName.split(".")[1], "gif");
  });
});

test("fileWithContent() returns a file with a distinct name", (t) => {
  _.times(1, () => {
    const file = randBox.fileWithContent({
      fileSize: 2048,
      fileName: "coolFileName",
    });
    t.is(file.fileName.split(".")[0], "coolFileName");
  });
});

test("fileWithContent() returns a file of distinct size", (t) => {
  _.times(1, () => {
    const file = randBox.fileWithContent({ fileSize: 2048 });
    t.is(file.fileData.length, 2048);
  });
});

test("fileWithContent() throws if fileSize is missing", (t) => {
  _.times(1, () => {
    const fn = () => randBox.fileWithContent({});
    t.throws(fn, {message: "File size must be an integer"});
  });
});

test("fileWithContent() throws if bad fileSize options is provided", (t) => {
  _.times(1, () => {
    const fn = () => randBox.fileWithContent({ fileSize: "Large" });
    t.throws(fn, {message: "File size must be an integer"});
  });
});

test("fileWithContent() throws if bad fileSize is less than 0", (t) => {
  _.times(1, () => {
    const fn = () => randBox.fileWithContent({ fileSize: -1 });
    t.throws(fn, {message: "RandBox: Length cannot be less than zero."});
  });
});
