import { test } from "@cross/test";
import { assertEquals, assertThrows } from "@std/assert";
import { emplaceMap, emplaceWeakMap } from "./mod.ts";

test("emplaceMap() inserts new value to map if key does not exist", () => {
    const data = new Map<string, string>();

    const fooValue = emplaceMap(data, "foo", {
        insert() {
            return "bar";
        },
    });
    const oneValue = emplaceMap(data, "one", {
        insert(key) {
            return key + key;
        },
    });

    assertEquals(data.get("foo"), "bar");
    assertEquals(data.get("one"), "oneone");
    assertEquals(fooValue, "bar");
    assertEquals(oneValue, "oneone");
});

test("emplaceMap() updates the existing value", () => {
    const data = new Map<string, number>();
    data.set("a", 3);
    data.set("b", 5);

    const aValue = emplaceMap(data, "a", {
        update(old) {
            return old * 3;
        },
    });
    const bValue = emplaceMap(data, "b", {
        update(old) {
            return old * 2;
        },
    });

    assertEquals(data.get("a"), 9);
    assertEquals(data.get("b"), 10);
    assertEquals(aValue, 9);
    assertEquals(bValue, 10);
});

test("emplaceMap() throws if `key` does not exist but no `insert` handler is provided", () => {
    const data = new Map<string, number>();
    assertThrows(() =>
        emplaceMap(data, "a", {
            update(v) {
                return v + 10;
            },
        })
    );
});

test("emplaceWeakMap() inserts new value to map if key does not exist", () => {
    const data = new WeakMap<object, string>();
    const foo = { name: "foo" };
    const one = { name: "one" };

    const fooValue = emplaceWeakMap(data, foo, {
        insert() {
            return "bar";
        },
    });
    const oneValue = emplaceWeakMap(data, one, {
        insert() {
            return "oneone";
        },
    });

    assertEquals(data.get(foo), "bar");
    assertEquals(data.get(one), "oneone");
    assertEquals(fooValue, "bar");
    assertEquals(oneValue, "oneone");
});

test("emplaceWeakMap() updates the existing value", () => {
    const data = new WeakMap<object, number>();
    const a = {};
    const b = function () {};

    data.set(a, 3);
    data.set(b, 5);

    const aValue = emplaceWeakMap(data, a, {
        update(old) {
            return old * 3;
        },
    });
    const bValue = emplaceWeakMap(data, b, {
        update(old) {
            return old * 2;
        },
    });

    assertEquals(data.get(a), 9);
    assertEquals(data.get(b), 10);
    assertEquals(aValue, 9);
    assertEquals(bValue, 10);
});

test("emplaceWeakMap() throws if `key` does not exist but no `insert` handler is provided", () => {
    const data = new WeakMap<object, number>();
    assertThrows(() =>
        emplaceWeakMap(data, {}, {
            update(v) {
                return v + 10;
            },
        })
    );
});
