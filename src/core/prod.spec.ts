import {
  deepStrictEqual,
} from 'assert';

import v = require('..');

describe('(v) prod', () => {
  it('should work as expected', () => {
    const x: v = v.random(3);

    deepStrictEqual(x.reduce((acc: number, value: number) => acc * value, 1), x.prod());
  });

  it('should work as the static equivalent', () => {
    const x: v = v.random(3);

    deepStrictEqual(x.reduce((acc: number, value: number) => acc * value, 1), v.prod(x));
  });
});
