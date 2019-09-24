# total-functions
A collection of total functions to replace TypeScript's built-in partial functions.

`no-array-subscript.js`:

```javascript
"use strict";

// An ESLint rule to ban useage of the array index operator, which is not well-typed in TypeScript.
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


# See Also
* https://github.com/danielnixon/readonly-types
