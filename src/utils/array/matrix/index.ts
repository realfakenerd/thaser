import { Pad } from '@utils';

/**
 * Checks if an array can be used as a matrix.
 *
 * A matrix is a two-dimensional array (array of arrays), where all sub-arrays (rows)
 * have the same length. This is an example matrix:
 *
 * ```
 * [
 *    [ 1, 1, 1, 1, 1, 1 ],
 *    [ 2, 0, 0, 0, 0, 4 ],
 *    [ 2, 0, 1, 2, 0, 4 ],
 *    [ 2, 0, 3, 4, 0, 4 ],
 *    [ 2, 0, 0, 0, 0, 4 ],
 *    [ 3, 3, 3, 3, 3, 3 ]
 * ]
 * ```
 * @param matrix The array to check.
 */
function CheckMatrix<T>(matrix?: T[][]): boolean {
  if (!Array.isArray(matrix) || !Array.isArray(matrix[0])) return false;
  const size = matrix[0].length;
  let i = 1;
  const length = matrix.length;
  for (i; i < length; i++) {
    if (matrix[i].length !== size) return false;
  }
  return true;
}

/**
 * Generates a string (which you can pass to console.log) from the given Array Matrix.
 *
 * A matrix is a two-dimensional array (array of arrays), where all sub-arrays (rows)
 * have the same length. There must be at least two rows. This is an example matrix:
 *
 * ```
 * [
 *    [ 1, 1, 1, 1, 1, 1 ],
 *    [ 2, 0, 0, 0, 0, 4 ],
 *    [ 2, 0, 1, 2, 0, 4 ],
 *    [ 2, 0, 3, 4, 0, 4 ],
 *    [ 2, 0, 0, 0, 0, 4 ],
 *    [ 3, 3, 3, 3, 3, 3 ]
 * ]
 * ```
 * @param matrix A 2-dimensional array.
 */
function MatrixToString<T extends string>(matrix?: T[][]): string {
  let str = '';

  if (!CheckMatrix(matrix)) return str;

  let r = 0;
  const length = matrix!.length;
  for (r; r < length; r++) {
    let c = 0;
    const innerLength = matrix![r].length;
    for (c; c < innerLength; c++) {
      const cell = matrix![r][c].toString();
      if (cell !== 'undefined') {
        str += Pad(cell, 2);
      } else {
        str += '?';
      }
      if (c < matrix![r].length - 1) {
        str += ' |';
      }
    }
    if (r < matrix!.length - 1) {
      str += '\n';
      let i = 0;
      for (i; i < matrix![r].length; i++) {
        str += '---';
        if (i < matrix![r].length - 1) {
          str += '+';
        }
      }
      str += '\n';
    }
  }

  return str;
}

/**
 * Reverses the columns in the given Array Matrix.
 *
 * A matrix is a two-dimensional array (array of arrays), where all sub-arrays (rows)
 * have the same length. There must be at least two rows. This is an example matrix:
 *
 * ```
 * [
 *    [ 1, 1, 1, 1, 1, 1 ],
 *    [ 2, 0, 0, 0, 0, 4 ],
 *    [ 2, 0, 1, 2, 0, 4 ],
 *    [ 2, 0, 3, 4, 0, 4 ],
 *    [ 2, 0, 0, 0, 0, 4 ],
 *    [ 3, 3, 3, 3, 3, 3 ]
 * ]
 * ```
 * @param matrix The array matrix to reverse the columns for.
 */
function ReverseColumns<T>(matrix?: T[][]): T[][] {
  return matrix!.reverse();
}

/**
 * Reverses the rows in the given Array Matrix.
 *
 * A matrix is a two-dimensional array (array of arrays), where all sub-arrays (rows)
 * have the same length. There must be at least two rows. This is an example matrix:
 *
 * ```
 * [
 *    [ 1, 1, 1, 1, 1, 1 ],
 *    [ 2, 0, 0, 0, 0, 4 ],
 *    [ 2, 0, 1, 2, 0, 4 ],
 *    [ 2, 0, 3, 4, 0, 4 ],
 *    [ 2, 0, 0, 0, 0, 4 ],
 *    [ 3, 3, 3, 3, 3, 3 ]
 * ]
 * ```
 * @param matrix The array matrix to reverse the rows for.
 */
function ReverseRows<T>(matrix?: T[][]): T[][] {
  let i = 0;
  const length = matrix!.length;
  for (i; i < length; i++) {
    matrix![i].reverse();
  }

  return matrix!;
}

/**
 * Rotates the array matrix 180 degrees.
 *
 * A matrix is a two-dimensional array (array of arrays), where all sub-arrays (rows)
 * have the same length. There must be at least two rows. This is an example matrix:
 *
 * ```
 * [
 *    [ 1, 1, 1, 1, 1, 1 ],
 *    [ 2, 0, 0, 0, 0, 4 ],
 *    [ 2, 0, 1, 2, 0, 4 ],
 *    [ 2, 0, 3, 4, 0, 4 ],
 *    [ 2, 0, 0, 0, 0, 4 ],
 *    [ 3, 3, 3, 3, 3, 3 ]
 * ]
 * ```
 * @param matrix The array to rotate.
 */
function Rotate180<T>(matrix?: T[][]): T[][] {
  return RotateMatrix(matrix, 180);
}

/**
 * Rotates the array matrix to the left (or 90 degrees)
 *
 * A matrix is a two-dimensional array (array of arrays), where all sub-arrays (rows)
 * have the same length. There must be at least two rows. This is an example matrix:
 *
 * ```
 * [
 *    [ 1, 1, 1, 1, 1, 1 ],
 *    [ 2, 0, 0, 0, 0, 4 ],
 *    [ 2, 0, 1, 2, 0, 4 ],
 *    [ 2, 0, 3, 4, 0, 4 ],
 *    [ 2, 0, 0, 0, 0, 4 ],
 *    [ 3, 3, 3, 3, 3, 3 ]
 * ]
 * ```
 * @param matrix The array to rotate.
 */
function RotateLeft<T>(matrix?: T[][]): T[][] {
  return RotateMatrix(matrix, 90);
}

/**
 * Rotates the array matrix based on the given rotation value.
 *
 * The value can be given in degrees: 90, -90, 270, -270 or 180,
 * or a string command: `rotateLeft`, `rotateRight` or `rotate180`.
 *
 * Based on the routine from {@link http://jsfiddle.net/MrPolywhirl/NH42z/}.
 *
 * A matrix is a two-dimensional array (array of arrays), where all sub-arrays (rows)
 * have the same length. There must be at least two rows. This is an example matrix:
 *
 * ```
 * [
 *    [ 1, 1, 1, 1, 1, 1 ],
 *    [ 2, 0, 0, 0, 0, 4 ],
 *    [ 2, 0, 1, 2, 0, 4 ],
 *    [ 2, 0, 3, 4, 0, 4 ],
 *    [ 2, 0, 0, 0, 0, 4 ],
 *    [ 3, 3, 3, 3, 3, 3 ]
 * ]
 * ```
 * @param matrix The array to rotate.
 * @param direction The amount to rotate the matrix by. Default 90.
 */
function RotateMatrix<T>(
  matrix?: T[][],
  direction: string | number = 90
): T[][] {
  if (!CheckMatrix(matrix)) return null as any;

  if (typeof direction !== 'string') {
    direction = ((direction % 360) + 360) % 360;
  }

  if (direction === 90 || direction === -270 || direction === 'rotateLeft') {
    matrix = TransposeMatrix(matrix);
    matrix!.reverse();
  } else if (
    direction === -90 ||
    direction === 270 ||
    direction === 'rotateRight'
  ) {
    matrix!.reverse();
    matrix = TransposeMatrix(matrix);
  } else if (
    Math.abs(parseInt(direction as string)) === 180 ||
    direction === 'rotate180'
  ) {
    for (var i = 0; i < matrix!.length; i++) {
      matrix![i].reverse();
    }

    matrix!.reverse();
  }

  return matrix!;
}

/**
 * Rotates the array matrix to the left (or -90 degrees)
 *
 * A matrix is a two-dimensional array (array of arrays), where all sub-arrays (rows)
 * have the same length. There must be at least two rows. This is an example matrix:
 *
 * ```
 * [
 *    [ 1, 1, 1, 1, 1, 1 ],
 *    [ 2, 0, 0, 0, 0, 4 ],
 *    [ 2, 0, 1, 2, 0, 4 ],
 *    [ 2, 0, 3, 4, 0, 4 ],
 *    [ 2, 0, 0, 0, 0, 4 ],
 *    [ 3, 3, 3, 3, 3, 3 ]
 * ]
 * ```
 * @param matrix The array to rotate.
 */
function RotateRight<T>(matrix?: T[][]): T[][] {
  return RotateMatrix(matrix, -90);
}

/**
 * Translates the given Array Matrix by shifting each column and row the
 * amount specified.
 *
 * A matrix is a two-dimensional array (array of arrays), where all sub-arrays (rows)
 * have the same length. There must be at least two rows. This is an example matrix:
 *
 * ```
 * [
 *    [ 1, 1, 1, 1, 1, 1 ],
 *    [ 2, 0, 0, 0, 0, 4 ],
 *    [ 2, 0, 1, 2, 0, 4 ],
 *    [ 2, 0, 3, 4, 0, 4 ],
 *    [ 2, 0, 0, 0, 0, 4 ],
 *    [ 3, 3, 3, 3, 3, 3 ]
 * ]
 * ```
 * @param matrix The array matrix to translate.
 * @param x The amount to horizontally translate the matrix by. Default 0.
 * @param y The amount to vertically translate the matrix by. Default 0.
 */
function Translate<T>(matrix?: T[][], x = 0, y = 0): T[][] {
  if (y !== 0) {
    if (y < 0) {
      // @ts-ignore
      RotateLeft(matrix, Math.abs(y));
    } else {
      // @ts-ignore
      RotateRight(matrix, y);
    }
  }

  //  Horizontal translation

  if (x !== 0) {
    let i = 0;
    for (i; i < matrix!.length; i++) {
      const row = matrix![i];

      if (x < 0) {
        // @ts-ignore
        RotateLeft(row, Math.abs(x));
      } else {
        // @ts-ignore
        RotateRight(row, x);
      }
    }
  }

  return matrix!;
}

/**
 * Transposes the elements of the given matrix (array of arrays).
 *
 * The transpose of a matrix is a new matrix whose rows are the columns of the original.
 *
 * A matrix is a two-dimensional array (array of arrays), where all sub-arrays (rows)
 * have the same length. There must be at least two rows. This is an example matrix:
 *
 * ```
 * [
 *    [ 1, 1, 1, 1, 1, 1 ],
 *    [ 2, 0, 0, 0, 0, 4 ],
 *    [ 2, 0, 1, 2, 0, 4 ],
 *    [ 2, 0, 3, 4, 0, 4 ],
 *    [ 2, 0, 0, 0, 0, 4 ],
 *    [ 3, 3, 3, 3, 3, 3 ]
 * ]
 * ```
 * @param array The array matrix to transpose.
 */
function TransposeMatrix<T>(array?: T[][]): T[][] {
  const sourceRowCount = array!.length;
  const sourceColCount = array![0].length;

  const result = new Array(sourceColCount);

  let i = 0;
  for (i; i < sourceColCount; i++) {
    result[i] = new Array(sourceRowCount);

    let j = sourceRowCount;
    for (j - 1; j > -1; j--) {
      result[i][j] = array![j][i];
    }
  }

  return result;
}

export {
  CheckMatrix,
  MatrixToString,
  ReverseColumns,
  ReverseRows,
  Rotate180,
  RotateLeft,
  RotateMatrix,
  RotateRight,
  Translate,
  TransposeMatrix
};
