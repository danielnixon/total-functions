/* eslint-disable total-functions/no-array-subscript */

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
  I extends A extends ArrayLike<unknown> ? ArrayIndex<A> : keyof A
> = A extends ArrayLike<unknown>
  ? ArrayIndexReturnValue<A, I>
  : A extends { readonly [i in I]: unknown }
  ? A[I]
  : A[I] | undefined;

type ArrayIndex<A extends ArrayLike<unknown>> = number extends A["length"]
  ? number
  : 0 extends A["length"]
  ? never
  : 1 extends A["length"]
  ? 0
  : 2 extends A["length"]
  ? 0 | 1
  : 3 extends A["length"]
  ? 0 | 1 | 2
  : 4 extends A["length"]
  ? 0 | 1 | 2 | 3
  : 5 extends A["length"]
  ? 0 | 1 | 2 | 3 | 4
  : 6 extends A["length"]
  ? 0 | 1 | 2 | 3 | 4 | 5
  : 7 extends A["length"]
  ? 0 | 1 | 2 | 3 | 4 | 5 | 6
  : 8 extends A["length"]
  ? 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
  : 9 extends A["length"]
  ? 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
  : number;

/**
 * A total function (one that doesn't lie about the possibility of returning undefined)
 * to replace the default (partial) array index operator.
 *
 * @see https://github.com/Microsoft/TypeScript/issues/13778
 */
export const get = <
  A extends Record<PropertyKey, unknown> | ArrayLike<unknown>,
  I extends A extends ArrayLike<unknown> ? ArrayIndex<A> : keyof A
>(
  a: A,
  i: I
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
): GetReturnType<A, I> => a[i] as GetReturnType<A, I>; // type-coverage:ignore-line

/**
 * An escape hatch for when you can't make the types line up in `get` and are willing
 * to accept undefined always being included in the return type.
 */
export const getOrUndefined = <A, I extends keyof A>(
  a: A,
  i: I
): A[I] | undefined => a[i];
