import {expect} from "chai";
import React from "react/addons";

import Util from "../../js/helpers/Util";

describe("Util", function () {

  describe("extendObject", function () {

    it("returns a new object with merged properties", function () {
      var objA = {hello: "world", foo: "bar"};
      var objB = {hello: "there", baz: "foo"};
      var expectedResult = {hello: "there", foo: "bar", baz: "foo"};
      var result = Util.extendObject(objA, objB);
      expect(result).to.deep.equal(expectedResult);
    });

    it("returns a new object without modifying the source", function () {
      var objA = {hello: "world", foo: "bar"};
      var objB = {hello: "there", baz: "foo"};
      var result = Util.extendObject(objA, objB);
      expect(objA).to.deep.equal({hello: "world", foo: "bar"});
    });

    it("accepts several sources", function () {
      var objA = {hello: "world", foo: "bar"};
      var objB = {hello: "there", baz: "foo"};
      var objC = {id: null, flag: true};
      var expectedResult = {
        hello: "there",
        foo: "bar",
        baz: "foo",
        id: null,
        flag: true
      };

      var result = Util.extendObject(objA, objB, objC);
      expect(result).to.deep.equal(expectedResult);
    });

    it("always returns an object", function () {
      var expectedResult = {"0": "faz", "1": "bar"};
      var result = Util.extendObject(["foo", "bar"], ["faz"]);
      expect(result).to.deep.equal(expectedResult);
    });

    it("treats accessors", function () {
      var counter = 0;

      var obj = {
        get count() {
          return ++counter;
        }
      };

      var newObj = Util.extendObject({}, obj);

      expect(newObj.count).to.equal(1);
      expect(newObj.count).to.equal(2);
    });
  });

  describe("initKeyValue", function () {

    it("initialises a value for a given key", function () {
      let obj = {};
      Util.initKeyValue(obj, "key", []);
      expect(obj).to.have.property("key");
      expect(obj.key).to.eql([]);
    });

  });

  describe("isArray", function () {

    it("array is an array", function () {
      expect(Util.isArray([])).to.be.true;
    });

    it("object is not an array", function () {
      expect(Util.isArray({})).to.be.false;
    });

  });

  describe("isNumber", function () {

    it("detects numbers", function () {
      expect(Util.isNumber(1)).to.be.true;
      expect(Util.isNumber(2.3)).to.be.true;
      expect(Util.isNumber(-5)).to.be.true;
    });

    it("string is not a number", function () {
      expect(Util.isNumber("666")).to.be.false;
    });

  });

  describe("isObject", function () {

    it("object is an object", function () {
      expect(Util.isObject({})).to.be.true;
    });

    it("array is not an object", function () {
      expect(Util.isObject([])).to.be.false;
    });

    it("primitives are not objects", function () {
      expect(Util.isObject(new Number(1))).to.be.false;
      expect(Util.isObject(2)).to.be.false;
      expect(Util.isObject(true)).to.be.false;
      expect(Util.isObject(new String("string"))).to.be.false;
      expect(Util.isObject("")).to.be.false;
      expect(Util.isObject(Symbol("unique"))).to.be.false;
    });

  });

  describe("isString", function () {

    it("detects strings", function () {
      expect(Util.isString("1")).to.be.true;
      expect(Util.isString("abc")).to.be.true;
    });

    it("number is not a string", function () {
      expect(Util.isString(123)).to.be.false;
    });

    it("function is not a string", function () {
      expect(Util.isString(function () {})).to.be.false;
    });

  });

  describe("isStringAndEmpty", function () {

    it("handles bad input", function () {
      expect(Util.isStringAndEmpty({"Object": true})).to.be.false;
      expect(Util.isStringAndEmpty([1, 2, 3])).to.be.false;
      expect(Util.isStringAndEmpty(null)).to.be.false;
    });

    it("detects empty srting", function () {
      expect(Util.isStringAndEmpty("")).to.be.true;
    });

    it("detects a non-empty string", function () {
      expect(Util.isStringAndEmpty(" ")).to.be.false;
      expect(Util.isStringAndEmpty("not empty")).to.be.false;
    });

  });

  describe("detectPathsInObject", function () {
    it("detects all non object paths in an object recursively", function () {
      var obj = {
        obj1: {
          string2: "string2",
          number2: 2,
          obj2: {
            string3: "string3",
            number3: 3,
            obj3: {
              array2: ["a", "b"],
              number3: 3
            }
          }
        },
        string1: "string1",
        number1: 1,
        array1: [1, 2]
      };

      expect(Util.detectObjectPaths(obj)).to.deep.equal([
        "obj1.string2",
        "obj1.number2",
        "obj1.obj2.string3",
        "obj1.obj2.number3",
        "obj1.obj2.obj3.array2",
        "obj1.obj2.obj3.number3",
        "string1",
        "number1",
        "array1"
      ]);
    });

    it("detects all non object paths in an prefixed object", function () {
      var obj = {
        obj1: {
          obj2: {
            string3: "string3",
          },
          string2: "string2"
        },
        string1: "don't see me"
      };

      expect(Util.detectObjectPaths(obj, "obj1")).to.deep.equal([
        "obj1.obj2.string3",
        "obj1.string2"
      ]);
    });

    it("excludes an object for parsing", function () {
      var obj = {
        obj1: {
          obj2: {
            string3: "string3",
          },
          string2: "string2"
        },
        string1: "don't see me"
      };

      expect(Util.detectObjectPaths(obj, "obj1", ["obj1.obj2"]))
        .to.deep.equal([
          "obj1.obj2",
          "obj1.string2"
        ]);
    });
  });

  describe("objectPathSet", function () {
    it("should work on inital null-values", function () {
      var obj = {
        a: null
      };

      Util.objectPathSet(obj, "a.b.c", "true");

      expect(obj).to.deep.equal({
        a: {
          b: {
            c: "true"
          }
        }
      });
    });
  });

  describe("deepFreeze", function () {

    it("shouldn't mutate an nested object-property", function () {
      var obj = {
        a: {
          b: "immutable"
        }
      };

      Util.deepFreeze(obj);

      expect(function () {
        obj.a.b = "modified";
      }).to.throw(TypeError);
    });

    it("shouldn't mutate an nested array-value", function () {
      var obj = {
        a: [
          {},
          "immutable"
        ]
      };

      Util.deepFreeze(obj);

      expect(function () {
        obj.a[1] = "modified";
      }).to.throw(TypeError);
    });

    it("shouldn't mutate first level property", function () {
      var obj = {
        a: 5
      };

      Util.deepFreeze(obj);

      expect(function () {
        obj.a = 8;
      }).to.throw(TypeError);
    });

    it("does not freeze non-object types", function () {
      var number = 5;

      Util.deepFreeze(number);

      expect(function () {
        number = 8;
      }).to.not.throw(TypeError);

      expect(number).to.equal(8);
    });

  });

  describe("filesize", function () {
    beforeEach(function () {
      this.baseSize = 796;
    });

    // Regular tests
    it("should convert to correct unit of B", function () {
      expect(Util.filesize(this.baseSize)).to.equal("796 B");
    });

    it("should convert to correct unit of KiB", function () {
      expect(Util.filesize(this.baseSize * 1024)).to.equal("796 KiB");
    });

    it("should convert to correct unit of MiB", function () {
      var factorize = Math.pow(1024, 2);
      expect(Util.filesize(this.baseSize * factorize)).to.equal("796 MiB");
    });

    it("should convert to correct unit of GiB", function () {
      var factorize = Math.pow(1024, 3);
      expect(Util.filesize(this.baseSize * factorize)).to.equal("796 GiB");
    });

    it("should convert to correct unit of PiB", function () {
      var factorize = Math.pow(1024, 5);
      expect(Util.filesize(this.baseSize * factorize)).to.equal("796 PiB");
    });

    it("should convert to correct unit of large PiB", function () {
      var factorize = Math.pow(1024, 6);
      expect(Util.filesize(this.baseSize * factorize)).to.equal("815104 PiB");
    });

    it("should convert to correct unit of MiB", function () {
      expect(Util.filesize((this.baseSize + 108) * 1024)).to.equal("0.88 MiB");
    });

    it("should convert to correct unit of GiB", function () {
      var factorize = Math.pow(1024, 2);
      expect(Util.filesize((this.baseSize + 128) * factorize))
        .to.equal("0.9 GiB");
    });

    it("should convert to correct unit of TiB", function () {
      var factorize = Math.pow(1024, 3);
      expect(Util.filesize((this.baseSize + 158) * factorize))
        .to.equal("0.93 TiB");
    });

    it("should convert to correct unit of PiB", function () {
      var factorize = Math.pow(1024, 5);
      expect(Util.filesize((this.baseSize + 230) * factorize))
        .to.equal("1026 PiB");
    });

    // Special tests
    it("should return '0 B' for vales of zero", function () {
      expect(Util.filesize(0, 0)).to.equal("0 B");
    });

    it("does not show decimals if set to 0", function () {
      var size = (this.baseSize + 352) * 1024;
      var filesize = Util.filesize(size, 0, 1024);
      expect(filesize).to.equal("1 MiB");
    });

    it("trims trailing zeroes from the mantissa", function () {
      var size = (this.baseSize + 102) * 1024;
      var filesize = Util.filesize(size, 4);
      expect(filesize).to.equal("0.877 MiB");
    });

    it("shows decimals places to the specified accuracy", function () {
      var size = (this.baseSize + 116) * 1024;
      var filesize = Util.filesize(size, 4);
      expect(filesize).to.equal("0.8906 MiB");
    });

    it("has correct custom unit and threshold", function () {
      var size = (this.baseSize + 24) * 1024 * 1024;
      var filesize = Util.filesize(size, 2, 500, 1024, ["byte", "KB", "MB", "GB"]);
      expect(filesize).to.equal("0.8 GB");
    });

    it("has correct amount of 0 digits", function () {
      var size = 1000 * 1024;
      var filesize = Util.filesize(size, 2, 1024);
      expect(filesize).to.equal("1000 KiB");
    });

  });

  describe("compareProperties", function () {
    it("returns true when all properties match", function () {
      expect(Util.compareProperties(
        {a: 1, b: 2, c: 3},
        {a: 1, b: 2, c: 3},
        "a", "b", "c"
      )).to.equal(true);
    });
    it("returns true when only specified properties match", function () {
      expect(Util.compareProperties(
        {a: 1, b: 2, c: 3, d: 4},
        {a: 1, b: 2, c: 3, d: 5},
        "a", "b", "c"
      )).to.equal(true);
    });
    it("returns false when some specified properties do not match",
        function () {
      expect(Util.compareProperties(
        {a: 1, b: 2, c: 3, d: 4},
        {a: 1, b: 2, c: 3, d: 5},
        "a", "b", "d"
      )).to.equal(false);
    });
    it("correctly identifies and compares similar arrays", function () {
      expect(Util.compareProperties(
        {a: ["a", "b", "c"]},
        {a: ["a", "b", "c"]},
        "a"
      )).to.equal(true);
    });
    it("correctly identifies and compares dissimilar arrays", function () {
      expect(Util.compareProperties(
        {a: ["a", "b", "c"]},
        {a: ["a", "banana", "c"]},
        "a"
      )).to.equal(false);
    });
    it("correctly identifies and compares similar objects", function () {
      expect(Util.compareProperties(
        {a: {a: 1}},
        {a: {a: 1}},
        "a"
      )).to.equal(true);
    });
    it("correctly identifies and compares dissimilar objects", function () {
      expect(Util.compareProperties(
        {a: {a: 1}},
        {a: {a: 1, b: 2}},
        "a"
      )).to.equal(false);
    });
  });

  describe("isEgal", function () {

    it("compares primitives strictly", function () {
      expect(Util.isEgal(0, 0)).to.equal(true);
      expect(Util.isEgal(1, 1)).to.equal(true);
      expect(Util.isEgal(10, -10)).to.equal(false);
      expect(Util.isEgal(0, -0)).to.equal(true);
      expect(Util.isEgal("abc", "abc")).to.equal(true);
      expect(Util.isEgal("abc", "cba")).to.equal(false);
      expect(Util.isEgal(2.0, 2.0)).to.equal(true);
      expect(Util.isEgal(19.1, 19.2)).to.equal(false);
      expect(Util.isEgal(true, true)).to.equal(true);
      expect(Util.isEgal(false, false)).to.equal(true);
      expect(Util.isEgal(false, true)).to.equal(false);
      expect(Util.isEgal(false, null)).to.equal(false);
      expect(Util.isEgal("123", 123)).to.equal(false);
    });
    it("distinguishes null from undefined inputs", function () {
      expect(Util.isEgal(null, null)).to.equal(true);
      expect(Util.isEgal(undefined, undefined)).to.equal(true);
      expect(Util.isEgal(undefined, null)).to.equal(false);
    });
    it("treats NaN as equal to NaN", function () {
      expect(Util.isEgal(NaN, NaN)).to.equal(true);
    });

    it("compares arrays", function () {
      expect(Util.isEgal(
        [1, "abc", true],
        [1, "abc", true]
      )).to.equal(true);
      expect(Util.isEgal(
        [1, "abc", false],
        [1, "abc", true]
      )).to.equal(false);
    });
    it("compares objects", function () {
      expect(Util.isEgal(
        {a: 1, b: "abc", c: true},
        {a: 1, b: "abc", c: true}
      )).to.equal(true);
      expect(Util.isEgal(
        {a: 1, b: "abc", c: true},
        {a: 1, b: "abc", c: false}
      )).to.equal(false);
      expect(Util.isEgal(
        {a: 1, b: "abc", c: true},
        {a: 1, b: "abc", c: true, d: null}
      )).to.equal(false);
    });

    it("compares nested arrays", function () {
      expect(Util.isEgal(
        [[1,2,3], "b", "c"],
        [[1,2,3], "b", "c"]
      )).to.equal(true);
      expect(Util.isEgal(
        [[1,2,3], "b", "c"],
        [[1,4,3], "b", "c"]
      )).to.equal(false);
    });

    it("compares nested objects", function () {
      expect(Util.isEgal({
        a: [{a: 1}, {b: 2}, {c: 3}, 4],
        b: {a: [1,2,3], b: [4,5,6], c: 7}
      }, {
        a: [{a: 1}, {b: 2}, {c: 3}, 4],
        b: {a: [1,2,3], b: [4,5,6], c: 7}
      })).to.equal(true);
      expect(Util.isEgal({
        a: [{a: 1}, {b: 2}, {c: 3}, 4],
        b: {a: [1,2,3], b: [4,5,6], c: 7}
      }, {
        a: [{a: 1}, {b: 2}, {c: 3}, 4],
        b: {a: [1,2,3], b: [4,5], c: 7}
      })).to.equal(false);
    });
  });

  describe("deepCopy", function () {

    it("it returns an actual deep copy", function () {
      var currentDate = new Date();

      var originalObject = {
        obj1: {
          string2: "string2",
          number2: 2,
          func: function () {
            return true;
          },
          obj2: {
            string3: "string3",
            number3: 3,
            date: currentDate,
            obj3: {
              array2: ["a", "b"],
              number3: 3
            }
          }
        },
        string1: "string1",
        number1: 1,
        array1: [1, 2]
      };

      var copiedObject = Util.deepCopy(originalObject);
      expect(copiedObject).to.eql(originalObject);
    });

    it("mutating the copy does not affect the original", function () {
      var currentDate = new Date();

      var originalObject = {
        obj1: {
          obj2: {
            string3: "string3",
            number3: 3,
            date: currentDate,
            obj3: {
              array2: ["a", "b"],
              number3: 3
            }
          }
        },
        string1: "string1",
        number1: 1,
        array1: [1, 2]
      };

      // An exact replica of the originalObject
      var originalObject2 = {
        obj1: {
          obj2: {
            string3: "string3",
            number3: 3,
            date: currentDate,
            obj3: {
              array2: ["a", "b"],
              number3: 3
            }
          }
        },
        string1: "string1",
        number1: 1,
        array1: [1, 2]
      };

      var copiedObject = Util.deepCopy(originalObject);

      copiedObject.obj1.obj2 = null;
      expect(copiedObject).to.not.eql(originalObject);
      expect(originalObject2).to.eql(originalObject);
    });

    it("does not clone out of bounds arrays", function () {
      var originalObject = {
        obj1: {
          array1: [1, 2]
        }
      };

      var number = 83864234234;
      originalObject.obj1.array1[number] = 3;

      var copiedObject = Util.deepCopy(originalObject);
      expect(copiedObject).to.not.eql(originalObject);
    });

    it("does clone an array with normal indices", () => {
      var originalObject = {
        array: []
      };
      originalObject.array[0] = "test";

      var expectedObject = {
        array: []
      };
      expectedObject.array[0] = "test";

      expect(Util.deepCopy(originalObject)).to.deep.equal(expectedObject);
    });

    it("does clone an array with unusual small indices", () => {
      var originalObject = {
        array: []
      };
      originalObject.array[2] = "test";

      var expectedObject = {
        array: []
      };
      expectedObject.array[2] = "test";

      expect(Util.deepCopy(originalObject)).to.deep.equal(expectedObject);
    });

    it("does clone an array with with in max range indices", () => {
      var originalObject = {
        array: []
      };
      originalObject.array[1145529089] = "test";

      var expectedObject = {
        array: []
      };
      expectedObject.array[1145529089] = "test";

      expect(Util.deepCopy(originalObject)).to.deep.equal(expectedObject);
    });

    // IF this test fails change remove the not if that works we are good.
    it("does clone an array with unusual indices", () => {
      var originalObject = {
        array: []
      };
      originalObject.array[11455290885778] = "test";

      var expectedObject = {
        array: []
      };
      expectedObject.array[11455290885778] = "test";

      expect(Util.deepCopy(originalObject)).to.not.deep.equal(expectedObject);
    });
  });
  describe("sortBy", () => {
    it("is not null", () => {
      expect(Util.sortBy).to.not.be.null;
    });

    it("sorts alphabetical", () => {
      var originalUnsortedArray = [
        {"a": "z"},
        {"a": "a"}
      ];
      var expectedSortedArray = [
        {"a": "a"},
        {"a": "z"}
      ];

      expect(originalUnsortedArray.sort(Util.sortBy("a")))
        .to.deep.equal(expectedSortedArray);
    });

    it("sorts alphabetical reverse", () => {
      var originalUnsortedArray = [
        {"a": "a"},
        {"a": "z"}
      ];
      var expectedSortedArray = [
        {"a": "z"},
        {"a": "a"}
      ];

      expect(originalUnsortedArray.sort(Util.sortBy("a", true)))
        .to.deep.equal(expectedSortedArray);
    });

    it("sorts alphabetical with multiple letters", () => {
      var originalUnsortedArray = [
        {"a": "ab"},
        {"a": "aa"}
      ];
      var expectedSortedArray = [
        {"a": "aa"},
        {"a": "ab"}
      ];

      expect(originalUnsortedArray.sort(Util.sortBy("a")))
        .to.deep.equal(expectedSortedArray);
    });

    it("sorts alphnumeric", () => {
      var originalUnsortedArray = [
        {"a": "z"},
        {"a": "0"},
        {"a": "a"}
      ];
      var expectedSortedArray = [
        {"a": "0"},
        {"a": "a"},
        {"a": "z"}
      ];
      expect(originalUnsortedArray.sort(Util.sortBy("a")))
        .to.deep.equal(expectedSortedArray);
    });

    it("sorts null fields to the end", () => {
      var originalUnsortedArray = [
        {"a": "z"},
        {"a": "0"},
        {"b": "a"},
        {"a": "a"}
      ];
      var expectedSortedArray = [
        {"a": "0"},
        {"a": "a"},
        {"a": "z"},
        {"b": "a"}
      ];

      expect(originalUnsortedArray.sort(Util.sortBy("a")))
        .to.deep.equal(expectedSortedArray);
    });
  });

  describe("isComponentOf", function () {
    var TestComponentA = React.createClass({
       render: function () {
         return null;
       }
    });

    var TestComponentB = React.createClass({
       render: function () {
         return null;
       }
    });

    it("should return true for same component type", function () {
      expect(Util.isComponentOf(<TestComponentA />, TestComponentA))
        .to.be.true;
    });

    it("should return false if components are different", function () {
      expect(Util.isComponentOf(<TestComponentB />, TestComponentA))
        .to.be.false;
    });

    it("should return true if all components are same", function () {
      expect(Util.isComponentOf([
        <TestComponentA />,
        <TestComponentA />
      ], TestComponentA)).to.be.true;
    });

    it("should return false if not all components are same", function () {
      expect(Util.isComponentOf([
        <TestComponentA />,
        <TestComponentB />
      ], TestComponentA)).to.be.false;
    });

    it("should return false if prop is null", function () {
      expect(Util.isComponentOf(null,TestComponentA)).to.be.false;
    });
  });
});
