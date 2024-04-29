/**
 * This package provides implementations of `Map.prototype.emplace`
 * and `WeakMap.prototype.emplace` which have been proposed in
 * https://github.com/tc39/proposal-upsert.
 *
 * ## Examples
 *
 * ### `emplaceMap`
 *
 * ```ts
 * const map = new Map([["foo", 9]]);
 *
 * emplaceMap(map, "foo", {
 *     insert() {
 *         return 7;
 *     },
 *     update(oldValue) {
 *         return oldValue * 3;
 *     },
 * });
 *
 * emplaceMap(map, "bar", {
 *     insert() {
 *         return 7;
 *     },
 *     update(oldValue) {
 *         return oldValue * 3;
 *     },
 * });
 *
 * console.log(map); // Map(2) { "foo": 27, "bar": 7 }
 * ```
 *
 * ### `emplaceWeakMap`
 *
 * ```ts
 * const map = new WeakMap<WeakKey, number>();
 * const o1 = {};
 * const o2 = function () {};
 *
 * map.set(o1, 21);
 *
 * emplaceWeakMap(map, o1, {
 *     insert() {
 *         return 100;
 *     },
 *     update(oldValue) {
 *         return oldValue + 50;
 *     },
 * });
 *
 * emplaceWeakMap(map, o2, {
 *     insert() {
 *         return 100;
 *     },
 *     update(oldValue) {
 *         return oldValue + 50;
 *     },
 * });
 *
 * console.log(map.get(o1)); // 71
 * console.log(map.get(o2)); // 100
 * ```
 *
 * @module
 */

/** Handlers for {@linkcode emplaceMap} function. */
export interface MapEmplaceHandler<K, V> {
    /** A handler to update the existing value at `key`. */
    update?: (value: V, key: K, map: Map<K, V>) => V;
    /** A handler to insert a new value to `key`. */
    insert?: (key: K, map: Map<K, V>) => V;
}

/** Handlers for {@linkcode emplaceWeakMap} function. */
export interface WeakMapEmplaceHandler<K extends WeakKey, V> {
    /** A handler to update the existing value at `key`. */
    update?: (value: V, key: K, map: WeakMap<K, V>) => V;
    /** A handler to insert a new value to `key`. */
    insert?: (key: K, map: WeakMap<K, V>) => V;
}

/**
 * Inserts a value to a map if `key` does not exist.
 * Otherwise, updates the existing value at `key`.
 *
 * @param map The map to be modified.
 * @param key The given key.
 * @param handler Custom `update` and `insert` handlers.
 * @returns Returns the updated or inserted value.
 * @throws If `key` does not exist but no `insert` handler is provided.
 *
 * @example
 * ```ts
 * const map = new Map([["foo", 9]]);
 *
 * emplaceMap(map, "foo", {
 *     insert() {
 *         return 7;
 *     },
 *     update(oldValue) {
 *         return oldValue * 3;
 *     },
 * });
 *
 * emplaceMap(map, "bar", {
 *     insert() {
 *         return 7;
 *     },
 *     update(oldValue) {
 *         return oldValue * 3;
 *     },
 * });
 *
 * console.log(map); // Map(2) { "foo": 27, "bar": 7 }
 * ```
 */
export function emplaceMap<K, V>(
    map: Map<K, V>,
    key: K,
    handler: MapEmplaceHandler<K, V> = {},
): V {
    if (map.has(key)) {
        let value = map.get(key) as V;

        if (handler.update) {
            value = handler.update(value, key, map);
            map.set(key, value);
        }

        return value;
    }

    if (!handler.insert) {
        throw new Error(
            `Key "${
                String(key)
            }" does not exist in map but no "insert" handler is provided!`,
        );
    }

    const inserted = handler.insert(key, map);
    map.set(key, inserted);

    return inserted;
}

/**
 * Inserts a value to a weak map if `key` does not exist.
 * Otherwise, updates the existing value at `key`.
 *
 * @param map The weak map to be modified.
 * @param key The given key.
 * @param handler Custom `update` and `insert` handlers.
 * @returns Returns the updated or inserted value.
 * @throws If `key` does not exist but no `insert` handler is provided.
 *
 * @example
 * ```ts
 * const map = new WeakMap<WeakKey, number>();
 * const o1 = {};
 * const o2 = function () {};
 *
 * map.set(o1, 21);
 *
 * emplaceWeakMap(map, o1, {
 *     insert() {
 *         return 100;
 *     },
 *     update(oldValue) {
 *         return oldValue + 50;
 *     },
 * });
 *
 * emplaceWeakMap(map, o2, {
 *     insert() {
 *         return 100;
 *     },
 *     update(oldValue) {
 *         return oldValue + 50;
 *     },
 * });
 *
 * console.log(map.get(o1)); // 71
 * console.log(map.get(o2)); // 100
 * ```
 */
export function emplaceWeakMap<K extends WeakKey, V>(
    map: WeakMap<K, V>,
    key: K,
    handler: WeakMapEmplaceHandler<K, V> = {},
): V {
    if (map.has(key)) {
        let value = map.get(key) as V;

        if (handler.update) {
            value = handler.update(value, key, map);
            map.set(key, value);
        }

        return value;
    }

    if (!handler.insert) {
        throw new Error(
            `Key "${
                String(key)
            }" does not exist in map but no "insert" handler is provided!`,
        );
    }

    const inserted = handler.insert(key, map);
    map.set(key, inserted);

    return inserted;
}
