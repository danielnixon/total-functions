/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statement */

import { get, getOrUndefined } from "./get";

describe("get", () => {
  it("provides a safe alternative to array subscript access", () => {
    // tuple
    const xs = [1, 2, 3] as const;

    expect<2>(get(xs, 1)).toBe(2);
    expect<undefined>(get(xs, 100)).toBe(undefined); // TODO can we make this fail to compile?
    expect<undefined>(get(xs, -1)).toBe(undefined);
    // @ts-expect-error
    get(xs, "length");

    // array
    const ys = [1, 2, 3];
    expect<number | undefined>(get(ys, 1)).toBe(2);
    expect<number | undefined>(get(ys, 100)).toBe(undefined);
    expect<number | undefined>(get(ys, -1)).toBe(undefined);

    // sparse array
    // eslint-disable-next-line no-sparse-arrays
    const zs = [1, , 2, 3];
    expect<number | undefined>(get(zs, 1)).toBe(undefined);
    expect<number | undefined>(get(zs, 100)).toBe(undefined);
    expect<number | undefined>(get(zs, -1)).toBe(undefined);

    // readonly array
    const as = [1, 2, 3] as ReadonlyArray<1 | 2 | 3>;
    expect<1 | 2 | 3 | undefined>(get(as, 1)).toBe(2);
    expect<1 | 2 | 3 | undefined>(get(as, 100)).toBe(undefined);
    expect<1 | 2 | 3 | undefined>(get(as, -1)).toBe(undefined);

    // semi-tuple
    const bs: readonly [number, ...(readonly string[])] = [1, "a", "b"];
    expect<number | undefined>(get(bs, 0)).toBe(1); // TODO: can we exclude undefined here?
    expect<string | undefined>(get(bs, 1)).toBe("a");
    expect<string | undefined>(get(bs, 100)).toBe(undefined);
    expect<string | number | undefined>(get(bs, -1)).toBe(undefined);
    // @ts-expect-error
    get(bs, "length");

    // record
    const record = { 1: "asdf" } as Record<number, string>;
    expect<string | undefined>(get(record, 1)).toBe("asdf");
    expect<string | undefined>(get(record, 100)).toBe(undefined);

    // object
    const obj = { 1: "asdf" };
    expect<string>(get(obj, 1)).toBe("asdf");
    // @ts-expect-error
    get(obj, 100);

    // const object
    const constObj = { 1: "asdf" } as const;
    expect<"asdf">(get(constObj, 1)).toBe("asdf");
    // @ts-expect-error
    get(constObj, 100);

    // string
    const str = "foo" as const;
    expect<string | undefined>(get(str, 1)).toBe("o");
  });
});

describe("getOrUndefined", () => {
  it("provides a safe alternative to array subscript access", () => {
    const xs = [1, 2, 3];
    expect<number | undefined>(getOrUndefined(xs, 1)).toBe(2);
    expect<number | undefined>(getOrUndefined(xs, 100)).toBe(undefined);
    expect<number | undefined>(getOrUndefined(xs, -1)).toBe(undefined);
  });
});
