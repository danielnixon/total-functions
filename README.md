# TypeScript Total Functions

[![Build Status](https://travis-ci.org/danielnixon/total-functions.svg?branch=master)](https://travis-ci.org/danielnixon/total-functions)
[![type-coverage](https://img.shields.io/badge/dynamic/json.svg?label=type-coverage&prefix=%E2%89%A5&suffix=%&query=$.typeCoverage.atLeast&uri=https%3A%2F%2Fraw.githubusercontent.com%2Fdanielnixon%2Ftotal-functions%2Fmaster%2Fpackage.json)](https://github.com/plantain-00/type-coverage)
[![Known Vulnerabilities](https://snyk.io/test/github/danielnixon/total-functions/badge.svg?targetFile=package.json)](https://snyk.io/test/github/danielnixon/total-functions?targetFile=package.json)
[![npm](https://img.shields.io/npm/v/total-functions.svg)](https://www.npmjs.com/package/total-functions)

[![dependencies Status](https://david-dm.org/danielnixon/total-functions/status.svg)](https://david-dm.org/danielnixon/total-functions)
[![devDependencies Status](https://david-dm.org/danielnixon/total-functions/dev-status.svg)](https://david-dm.org/danielnixon/total-functions?type=dev)

A collection of total functions to replace TypeScript's built-in [partial functions](https://wiki.haskell.org/Partial_functions).

Intended to be used with [strictNullChecks](https://www.typescriptlang.org/docs/handbook/compiler-options.html) enabled.

## Installation

```sh
# yarn
yarn add total-functions

# npm
npm install total-functions
```

## The Functions

### `get` (type-safe member and indexed access operator)

Prior to TypeScript 4.1's [noUncheckedIndexedAccess](https://devblogs.microsoft.com/typescript/announcing-typescript-4-1-beta/#no-unchecked-indexed-access) option,  member access for arrays and records was not type safe. For example:

```typescript
const a: string[] = [];
const b = a[0]; // b has type string, not string | undefined as you might expect
b.toUpperCase(); // This explodes at runtime

const record: Record<string, string> = { foo: "foo" };
const bar = record["bar"]; // bar has type string, not string | undefined
bar.toUpperCase(); // This explodes at runtime

const baz = record.baz; // baz has type string, not string | undefined
baz.toUpperCase(); // This explodes at runtime

const str = "";
const s = str[0]; // s has type string, not string | undefined
s.toUpperCase(); // This explodes at runtime
```

`get` is a safe alternative:

```typescript
import { get } from "total-functions";

const b = get(a, 0); // b has type object | undefined

const bar = get(record, "bar"); // bar has type string | undefined
```

Note that `get` will exclude `undefined` from the return type when there is enough type information to be confident that the result cannot be undefined. See the object and tuple examples below for examples where `undefined` is not included in the return type.

More usage examples:

```typescript
// tuple
const xs = [1, 2, 3] as const;
const x1 = get(xs, 1); // 2
const x100 = get(xs, 100); // undefined
const xMinus1 = get(xs, -1); // undefined
xs.map(x => x /* 1 | 2 | 3 */);

// array
const ys = [1, 2, 3];
const y1 = get(ys, 1); // number | undefined
const y100 = get(ys, 100); // number | undefined
ys.map(y => y /* number */);

// sparse array
const zs = [1, , 2, 3];
const z1 = get(zs, 1); // number | undefined
const z100 = get(zs, 100); // number | undefined
zs.map(z => z /* number | undefined */);

// readonly array
const as: ReadonlyArray<1 | 2 | 3> = [1, 2, 3];
const a1 = get(as, 1); // 1 | 2 | 3 | undefined
const a100 = get(as, 100); // 1 | 2 | 3 | undefined

// record
const record: Record<number, string> = { 1: "asdf" };
const record1 = get(record, 1); // string | undefined
const record100 = get(record, 100); // string | undefined

// object
const obj = { 1: "asdf" };
const obj1 = get(obj, 1); // string
const obj100 = get(obj, 100); // doesn't compile

// const object
const constObj = { 1: "asdf" } as const;
const constObj1 = get(constObj, 1); // "asdf"
const constObj100 = get(constObj, 100); // doesn't compile
```

You only need to use this if you are stuck on Typescript < 4.1.

## ESLint

There's a corresponding ESLint plugin to enforce the use of `noUncheckedIndexedAccess` and/or ban the partial functions replaced by this library.

See https://github.com/danielnixon/eslint-plugin-total-functions

# See Also
* [TypeScript for Functional Programmers](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-func.html)
* https://github.com/danielnixon/readonly-types
* https://github.com/danielnixon/eslint-plugin-total-functions
* https://github.com/jonaskello/eslint-plugin-functional
* https://github.com/danielnixon/eslint-config-typed-fp
