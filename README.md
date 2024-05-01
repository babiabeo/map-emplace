# map-emplace

[![ci status](https://github.com/babiabeo/map-emplace/actions/workflows/ci.yml/badge.svg)](https://github.com/babiabeo/map-emplace/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/babiabeo/map-emplace/graph/badge.svg?token=K419Z9KMJ9)](https://codecov.io/gh/babiabeo/map-emplace)
[![JSR](https://jsr.io/badges/@polyfill/map-emplace)](https://jsr.io/@polyfill/map-emplace)
[![JSR Score](https://jsr.io/badges/@polyfill/map-emplace/score)](https://jsr.io/@polyfill/map-emplace)

> [!IMPORTANT]
> This package has been moved from
> [`@babia/map-emplace`](https://jsr.io/@babia/map-emplace) to
> [`@polyfill/map-emplace`](https://jsr.io/@polyfill/map-emplace)

Polyfill of `Map.prototype.emplace` and `WeakMap.prototype.emplace` for
JavaScript based on
[`tc39/proposal-upsert`](https://github.com/tc39/proposal-upsert) specification.

## Install

### Bun

```sh
bunx jsr add @polyfill/map-emplace
```

### Deno

```sh
deno add @polyfill/map-emplace
```

or use import specifier:

```ts
import { emplaceMap } from "jsr:@polyfill/map-emplace";
```

### Node

```sh
# npm
npx jsr add @polyfill/map-emplace

# yarn
yarn dlx jsr add @polyfill/map-emplace

# pnpm
pnpm dlx jsr add @polyfill/map-emplace
```

## Why?

As mentioned in the proposal:

> Adding and updating values of a `Map` are tasks that developers often perform
> in conjunction. There are currently no `Map` prototype methods for either of
> those two things, let alone a method that does both. The workarounds involve
> multiple lookups and developer inconvenience while avoiding encouraging code
> that is surprising or is potentially error prone.

Therefore, `emplace` method has been proposed as a solution for this problem.

## Examples

```ts
emplaceMap(map, "foo", {
    // If map does not include "foo", sets "foo" to 1
    insert() {
        return 1;
    },
    // Otherwise, updates its value.
    update(oldValue) {
        return oldValue + 2;
    },
});
```

### Insert if absent

You might want to set a new value to a key if it does not exist in map, and then
use that value in code:

```ts
if (!map.has("foo")) {
    map.set("foo", "bar");
}

const foo = map.get("foo");

// do something with "foo"...
```

With `emplace`:

```ts
const foo = emplaceMap(map, "foo", {
    insert() {
        return "bar";
    },
});

// do something with "foo"...
```

### Update if present

You might want to update the value only if the key is exist:

```ts
if (map.has("foo")) {
    map.set("foo", "foobar");
}
```

With `emplace`:

```ts
emplaceMap(map, "foo", {
    update() {
        return "foobar";
    },
});
```

## Specification

- [`Map.prototype.emplace`](https://tc39.es/proposal-upsert/#sec-map.prototype.emplace)
- [`WeakMap.prototype.emplace`](https://tc39.es/proposal-upsert/#sec-weakmap.prototype.emplace)

## See also

- [tc39/proposal-upsert](https://github.com/tc39/proposal-upsert)
- [Polyfill in core-js](https://github.com/zloirock/core-js?tab=readme-ov-file#mapprototypeemplace)
