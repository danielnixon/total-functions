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
export type ArrayIndexReturnValue<
  A extends ArrayLike<unknown>,
  I extends string | number | symbol
  // If this is a tuple we don't need to add undefined to the return type,
  // but if it's just a plain old array we have to add undefined to the return type.
  // This also catches negative indices passed to tuples.
> = I extends number
  ? A[number] extends A[I]
    ? A[I] | undefined
    : A[I]
  : never;

/**
 * A total function (one that doesn't lie about the possibility of returning undefined)
 * to replace the default (partial) array index operator.
 *
 * @see https://github.com/Microsoft/TypeScript/issues/13778
 */
export const get = <
  A extends Record<string | number | symbol, unknown> | ArrayLike<unknown>,
  I extends keyof A
>(
  a: A,
  i: I,
): A extends ArrayLike<unknown>
  ? ArrayIndexReturnValue<A, typeof i>
  : typeof a extends { readonly [i in I]: unknown }
  ? A[I]
  : A[I] | undefined => a[i] as any;
```

Usage examples:

```typescript
// tuple
const xs = [1, 2, 3] as const;
const x1 = get(xs, 1); // 2
const x100 = get(xs, 100); // undefined
const xMinus1 = get(xs, -1); // 1 | 2 | 3 | undefined // TODO improve this
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

// object
const obj = { 1: "asdf" };
const obj1 = get(obj, 1); // string
const obj100 = get(obj, 100); // doesn't compile

// const object
const constObj = { 1: "asdf" } as const;
const constObj1 = get(constObj, 1); // "asdf"
const constObj100 = get(constObj, 100); // doesn't compile
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
      // TODO leverage type information here.
      // https://github.com/typescript-eslint/typescript-eslint#can-we-write-rules-which-leverage-type-information
      if (node.computed) {
        context.report({
          node: node,
          message: "Array subscript access is not type-safe in TypeScript.",
        });
      }
    },
  }),
};
```

# See Also
* https://github.com/danielnixon/readonly-types
