/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statement */

import { get } from ".";

describe("get", () => {
  it("provides a safe alternative to array subscript access", async () => {
    // tuple
    const xs = [1, 2, 3] as const;
    expect<2>(get(xs, 1)).toBe(2);
    expect<undefined>(get(xs, 100)).toBe(undefined);
    expect<1 | 2 | 3 | undefined>(get(xs, -1)).toBe(undefined); // TODO improve this

    // array
    const ys = [1, 2, 3];
    expect<number | undefined>(get(ys, 1)).toBe(2);
    expect<number | undefined>(get(ys, 100)).toBe(undefined);

    // sparse array
    // eslint-disable-next-line no-sparse-arrays
    const zs = [1, , 2, 3];
    expect<number | undefined>(get(zs, 1)).toBe(undefined);
    expect<number | undefined>(get(zs, 100)).toBe(undefined);

    // readonly array
    const as = [1, 2, 3] as ReadonlyArray<1 | 2 | 3>;
    expect<1 | 2 | 3 | undefined>(get(as, 1)).toBe(2);
    expect<1 | 2 | 3 | undefined>(get(as, 100)).toBe(undefined);

    // record
    const record = { 1: "asdf" } as Record<number, string>;
    expect<string | undefined>(get(record, 1)).toBe("asdf");
    expect<string | undefined>(get(record, 100)).toBe(undefined);

    // object
    const obj = { 1: "asdf" };
    expect<string>(get(obj, 1)).toBe("asdf");
    // const obj100 = get(obj, 100); // doesn't compile

    // const object
    const constObj = { 1: "asdf" } as const;
    expect<string>(get(constObj, 1)).toBe("asdf");
    // const constObj100 = get(constObj, 100); // doesn't compile
  });
});
