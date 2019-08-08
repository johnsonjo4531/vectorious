import { get_type } from '../util';

import { NDArray } from './';

let nlapack: any;
try {
  nlapack = require('nlapack');
} catch (err) {}

NDArray.lu_factor = <T extends NDArray>(x: T): [T, Int32Array] => x.copy().lu_factor();

NDArray.prototype.lu_factor = function<T extends NDArray>(this: T): [T, Int32Array] {
  const [n] = this.shape;
  const ipiv: Int32Array = new Int32Array(n);

  try {
    if (!['float32', 'float64'].includes(this.dtype)) {
      this.dtype = 'float32';
      this.data = get_type(this.dtype).from(this.data);
    }

    if (this.dtype === 'float64') {
      nlapack.dgetrf(n, n, this.data, n, ipiv);
    } else if (this.dtype === 'float32') {
      nlapack.sgetrf(n, n, this.data, n, ipiv);
    }
  } catch (err) {
    let max: number;
    let abs: number;
    let diag: number;
    let p: number;

    let i: number;
    let j: number;
    let k: number;
    for (k = 0; k < n; k += 1) {
      p = k;
      max = Math.abs(this.get(k, k));
      for (j = k + 1; j < n; j += 1) {
        abs = Math.abs(this.get(j, k));
        if (max < abs) {
          max = abs;
          p = j;
        }
      }

      ipiv[k] = p + 1;

      if (p !== k) {
        this.swap(k, p);
      }

      diag = this.get(k, k);
      for (i = k + 1; i < n; i += 1) {
        this.set(i, k, this.get(i, k) / diag);
      }

      for (i = k + 1; i < n; i += 1) {
        for (j = k + 1; j < n - 1; j += 2) {
          this.set(i, j, this.get(i, j) - this.get(i, k) * this.get(k, j));
          this.set(i, j + 1, this.get(i, j + 1) - this.get(i, k) * this.get(k, j + 1));
        }

        if (j === n - 1) {
          this.set(i, j, this.get(i, j) - this.get(i, k) * this.get(k, j));
        }
      }
    }
  }

  return [this, ipiv];
};