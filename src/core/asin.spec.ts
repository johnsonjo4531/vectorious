import {
  deepStrictEqual,
} from 'assert';

import v = require('..');

describe('(v) asin', () => {
  it('should work as expected', () => {
    const x: v = v.random(3);

    deepStrictEqual(x.map((value: number) => Math.asin(value)), x.asin());
  });

  it('should work as the static equivalent', () => {
    const x: v = v.random(3);

    deepStrictEqual(x.map((value: number) => Math.asin(value)), v.asin(x));
  });
});
