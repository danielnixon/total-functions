export type ArrayIndexReturnValue<
  A extends ArrayLike<unknown>,
  I extends PropertyKey
  // If this is a tuple we don't need to add undefined to the return type,
  // but if it's just a plain old array we have to add undefined to the return type.
  // This also catches negative indices passed to tuples.
> = I extends number
  ? A[number] extends A[I]
    ? number extends A["length"]
      ? A[I] | undefined // we don't have a defined length - have to include undefined
      : undefined // we have a defined length - this must be undefined
    : number extends A["length"]
    ? A[I] | undefined // Semi-tuple - need undefined. TODO: exclude undefined for the tuple portions of this array
    : A[I] // Tuple - don't need undefined
  : undefined;

export type GetReturnType<
  A extends Record<PropertyKey, unknown> | ArrayLike<unknown>,
  I extends A extends ArrayLike<unknown> ? number : keyof A
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
  A extends Record<PropertyKey, unknown> | ArrayLike<unknown>,
  I extends A extends ArrayLike<unknown> ? number : keyof A
>(
  a: A,
  i: I
): GetReturnType<A, I> => a[i] as GetReturnType<A, I>;

/**
 * An escape hatch for when you can't make the types line up in `get` and are willing
 * to accept undefined always being included in the return type.
 */
export const getOrUndefined = <A, I extends keyof A>(
  a: A,
  i: I
): A[I] | undefined => a[i];
