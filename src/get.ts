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

export type GetReturnType<
  A extends Record<string | number | symbol, unknown> | ArrayLike<unknown>,
  I extends keyof A
> = A extends ArrayLike<unknown>
  ? ArrayIndexReturnValue<A, I>
  : A extends { readonly [i in I]: unknown }
  ? A[I]
  : A[I] | undefined;

/**
 * If `undefined` is in `GetReturnType<A, I>` but NOT in `A[I]` then
 * we can safely assume the return type is undefined. This allows us
 * to give a better return type for negative number array indices.
 *
 * Compare:
 *
 * Without the hack:
 * GetReturnType<ReadonlyArray<1 | 2 | 3>, -1>; // 1 | 2 | 3 | undefined
 *
 * With the hack:
 * GetReturnTypeWithNegativeHack<ReadonlyArray<1 | 2 | 3>, -1>; // undefined
 */
export type GetReturnTypeWithNegativeHack<
  A extends Record<string | number | symbol, unknown> | ArrayLike<unknown>,
  I extends keyof A
> = undefined extends GetReturnType<A, I>
  ? undefined extends A[I]
    ? GetReturnType<A, I>
    : undefined
  : GetReturnType<A, I>;

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
  i: I
): GetReturnTypeWithNegativeHack<A, I> =>
  a[i] as GetReturnTypeWithNegativeHack<A, I>;
