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
): GetReturnType<A, I> => a[i] as GetReturnType<A, I>;
