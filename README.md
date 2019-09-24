# TypeScript Total Functions
A collection of total functions to replace TypeScript's built-in [partial functions](https://wiki.haskell.org/Partial_functions).

## The Functions

### `get` (type-safe array index operator)

The [array index operator is not well-typed](https://github.com/Microsoft/TypeScript/issues/13778) in TypeScript:

```typescript
const a: object[] = [];
const b = a[0]; // b has type object, not object | undefined as you might expect
b.toString(); // boom
```

`get` (below) is a safe alternative. I'll get around to publishing an npm package eventually, but for now you can copy and paste this:

```typescript
/**
 * A total function (one that doesn't lie about the possibility of returning undefined)
 * to replace the default (partial) array index operator.
 * @see https://github.com/Microsoft/TypeScript/issues/13778
 */
const get = <T, A extends { readonly [n: number]: T }, I extends number>(
  a: A,
  i: I,
): typeof a[number] extends typeof a[typeof i]
  ? typeof a[typeof i] | undefined
  : typeof a[typeof i] =>
  a[i] as typeof a[number] extends typeof a[typeof i]
    ? typeof a[typeof i] | undefined
    : typeof a[typeof i];
```

Usage examples:

```typescript
// tuple
const xs = [1, 2, 3] as const;
const x1 = get(xs, 1); // 2
const x100 = get(xs, 100); // undefined
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
const as = [1, 2, 3] as ReadonlyArray<1 | 2 | 3>;
const a1 = get(as, 1); // 1 | 2 | 3 | undefined
const a100 = get(as, 100); // 1 | 2 | 3 | undefined

// record
const record = { 1: "asdf" } as Record<number, string>;
const record1 = get(record, 1); // string | undefined
const record100 = get(record, 100); // string | undefined
```

Here's a corresponding ESLint rule to ban the unsafe array index operator.

I'll get around to publishing an ESLint plugin eventually, but for now you can use it as a [runtime rule](https://eslint.org/docs/developer-guide/working-with-rules#runtime-rules).

`no-array-subscript.js`:

```javascript
"use strict";

// An ESLint rule to ban usage of the array index operator, which is not well-typed in TypeScript.
// See https://github.com/Microsoft/TypeScript/issues/13778
// See https://eslint.org/docs/developer-guide/working-with-rules#runtime-rules
module.exports = {
  create: context => ({
    MemberExpression: node => {
      if (Number.isInteger(node.property.value)) {
        context.report({
          node: node,
          message: "Array index operator is not type-safe in TypeScript.",
        });
      }
    },
  }),
};
```


# See Also
* https://github.com/danielnixon/readonly-types
