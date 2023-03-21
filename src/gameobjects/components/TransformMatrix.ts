import { CONST as MATH_CONST, Vector2 } from '@thaser/math';
import { Vector2Like } from '@thaser/types/math';

export default class TransformMatrix {
  /**
   *
   * @param a The Scale X value. Default 1.
   * @param b The Skew Y value. Default 0.
   * @param c The Skew X value. Default 0.
   * @param d The Scale Y value. Default 1.
   * @param tx The Translate X value. Default 0.
   * @param ty The Translate Y value. Default 0.
   */
  constructor(a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0) {
    this.matrix = new Float32Array([a, b, c, d, tx, ty, 0, 0, 1]);
  }

  /**
   * The matrix values.
   */
  matrix: Float32Array;

  /**
   * The decomposed matrix.
   */
  decomposedMatrix = {
    translateX: 0,
    translateY: 0,
    scaleX: 1,
    scaleY: 1,
    rotation: 0
  };

  /**
   * The Scale X value.
   */
  get a() {
    return this.matrix[0];
  }
  set a(val) {
    this.matrix[0] = val;
  }

  /**
   * The Skew Y value.
   */
  get b() {
    return this.matrix[1];
  }
  set b(val) {
    this.matrix[1] = val;
  }

  /**
   * The Skew X value.
   */
  get c() {
    return this.matrix[2];
  }
  set c(val) {
    this.matrix[2] = val;
  }

  /**
   * The Scale Y value.
   */
  get d() {
    return this.matrix[3];
  }
  set d(val) {
    this.matrix[3] = val;
  }

  /**
   * The Translate X value.
   */
  get e() {
    return this.matrix[4];
  }
  set e(val) {
    this.matrix[4] = val;
  }

  /**
   * The Translate Y value.
   */
  get f() {
    return this.matrix[5];
  }
  set f(val) {
    this.matrix[5] = val;
  }

  /**
   * The Translate X value.
   */
  get tx() {
    return this.matrix[4];
  }
  set tx(val) {
    this.matrix[4] = val;
  }

  /**
   * The Translate Y value.
   */
  get ty() {
    return this.matrix[5];
  }
  set ty(val) {
    this.matrix[5] = val;
  }

  /**
   * The rotation of the Matrix. Value is in radians.
   */
  get rotation() {
    return (
      Math.acos(this.a / this.scaleX) *
      (Math.atan(-this.c / this.a) < 0 ? -1 : 1)
    );
  }

  /**
   * The rotation of the Matrix, normalized to be within the Phaser right-handed
   * clockwise rotation space. Value is in radians.
   */
  get rotationNormalized() {
    const matrix = this.matrix;
    const a = matrix[0];
    const b = matrix[1];
    const c = matrix[2];
    const d = matrix[3];

    if (a || b)
      return b > 0 ? Math.acos(a / this.scaleX) : -Math.acos(a / this.scaleX);
    else if (c || d)
      return (
        MATH_CONST.TAU -
        (d > 0 ? Math.acos(-c / this.scaleY) : -Math.acos(c / this.scaleY))
      );
    else return 0;
  }

  /**
   * The decomposed horizontal scale of the Matrix. This value is always positive.
   */
  get scaleX() {
    return Math.sqrt(this.a * this.a + this.b * this.b);
  }

  /**
   * The decomposed vertical scale of the Matrix. This value is always positive.
   */
  get scaleY() {
    return Math.sqrt(this.c * this.c + this.d * this.d);
  }

  /**
   * Reset the Matrix to an identity matrix.
   */
  loadIdentity() {
    const matrix = this.matrix;

    matrix[0] = 1;
    matrix[1] = 0;
    matrix[2] = 0;
    matrix[3] = 1;
    matrix[4] = 0;
    matrix[5] = 0;

    return this;
  }

  /**
   * Translate the Matrix.
   * @param x The horizontal translation value.
   * @param y The vertical translation value.
   */
  translate(x: number, y: number) {
    const matrix = this.matrix;
    matrix[4] = matrix[0] * x + matrix[2] * y + matrix[4];
    matrix[5] = matrix[1] * x + matrix[3] * y + matrix[5];
  }

  /**
   * Scale the Matrix.
   * @param x The horizontal scale value.
   * @param y The vertical scale value.
   */
  scale(x: number, y: number) {
    const matrix = this.matrix;

    matrix[0] *= x;
    matrix[1] *= x;
    matrix[2] *= y;
    matrix[3] *= y;

    return this;
  }

  /**
   * Rotate the Matrix.
   * @param angle The angle of rotation in radians.
   */
  rotate(angle: number) {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);

    const matrix = this.matrix;

    const a = matrix[0];
    const b = matrix[1];
    const c = matrix[2];
    const d = matrix[3];

    matrix[0] = a * cos + c * sin;
    matrix[1] = b * cos + d * sin;
    matrix[2] = a * -sin + c * cos;
    matrix[3] = b * -sin + d * cos;
  }

  /**
   * Multiply this Matrix by the given Matrix.
   *
   * If an `out` Matrix is given then the results will be stored in it.
   * If it is not given, this matrix will be updated in place instead.
   * Use an `out` Matrix if you do not wish to mutate this matrix.
   * @param rhs The Matrix to multiply by.
   * @param out An optional Matrix to store the results in.
   */
  multiply(rhs: TransformMatrix, out?: TransformMatrix) {
    const matrix = this.matrix;
    const source = rhs.matrix;

    const localA = matrix[0];
    const localB = matrix[1];
    const localC = matrix[2];
    const localD = matrix[3];
    const localE = matrix[4];
    const localF = matrix[5];

    const sourceA = source[0];
    const sourceB = source[1];
    const sourceC = source[2];
    const sourceD = source[3];
    const sourceE = source[4];
    const sourceF = source[5];

    const destinationMatrix = out === undefined ? this : out;

    destinationMatrix.a = sourceA * localA + sourceB * localC;
    destinationMatrix.b = sourceA * localB + sourceB * localD;
    destinationMatrix.c = sourceC * localA + sourceD * localC;
    destinationMatrix.d = sourceC * localB + sourceD * localD;
    destinationMatrix.e = sourceE * localA + sourceF * localC + localE;
    destinationMatrix.f = sourceE * localB + sourceF * localD + localF;

    return destinationMatrix;
  }

  /**
   * Multiply this Matrix by the matrix given, including the offset.
   *
   * The offsetX is added to the tx value: `offsetX * a + offsetY * c + tx`.
   * The offsetY is added to the ty value: `offsetY * b + offsetY * d + ty`.
   * @param src The source Matrix to copy from.
   * @param offsetX Horizontal offset to factor in to the multiplication.
   * @param offsetY Vertical offset to factor in to the multiplication.
   */
  multiplyWithOffset(src: TransformMatrix, offsetX: number, offsetY: number) {
    const matrix = this.matrix;
    const otherMatrix = src.matrix;

    const a0 = matrix[0];
    const b0 = matrix[1];
    const c0 = matrix[2];
    const d0 = matrix[3];
    const tx0 = matrix[4];
    const ty0 = matrix[5];

    const pse = offsetX * a0 + offsetY * c0 + tx0;
    const psf = offsetX * b0 + offsetY * d0 + ty0;

    const a1 = otherMatrix[0];
    const b1 = otherMatrix[1];
    const c1 = otherMatrix[2];
    const d1 = otherMatrix[3];
    const tx1 = otherMatrix[4];
    const ty1 = otherMatrix[5];

    matrix[0] = a1 * a0 + b1 * c0;
    matrix[1] = a1 * b0 + b1 * d0;
    matrix[2] = c1 * a0 + d1 * c0;
    matrix[3] = c1 * b0 + d1 * d0;
    matrix[4] = tx1 * a0 + ty1 * c0 + pse;
    matrix[5] = tx1 * b0 + ty1 * d0 + psf;

    return this;
  }

  /**
   * Transform the Matrix.
   * @param a The Scale X value.
   * @param b The Shear Y value.
   * @param c The Shear X value.
   * @param d The Scale Y value.
   * @param tx The Translate X value.
   * @param ty The Translate Y value.
   */
  transform(
    a: number,
    b: number,
    c: number,
    d: number,
    tx: number,
    ty: number
  ) {
    const matrix = this.matrix;

    const a0 = matrix[0];
    const b0 = matrix[1];
    const c0 = matrix[2];
    const d0 = matrix[3];
    const tx0 = matrix[4];
    const ty0 = matrix[5];

    matrix[0] = a * a0 + b * c0;
    matrix[1] = a * b0 + b * d0;
    matrix[2] = c * a0 + d * c0;
    matrix[3] = c * b0 + d * d0;
    matrix[4] = tx * a0 + ty * c0 + tx0;
    matrix[5] = tx * b0 + ty * d0 + ty0;

    return this;
  }

  /**
   * Transform a point in to the local space of this Matrix.
   * @param x The x coordinate of the point to transform.
   * @param y The y coordinate of the point to transform.
   * @param point Optional Point object to store the transformed coordinates in.
   */
  transformPoint(
    x: number,
    y: number,
    point: Vector2Like = {
      x: 0,
      y: 0
    }
  ): Vector2Like {
    const matrix = this.matrix;

    const a = matrix[0];
    const b = matrix[1];
    const c = matrix[2];
    const d = matrix[3];
    const tx = matrix[4];
    const ty = matrix[5];

    point.x = x * a + y * c + tx;
    point.y = x * b + y * d + ty;

    return point;
  }

  /**
   * Invert the Matrix.
   */
  invert() {
    const matrix = this.matrix;

    const a = matrix[0];
    const b = matrix[1];
    const c = matrix[2];
    const d = matrix[3];
    const tx = matrix[4];
    const ty = matrix[5];

    const n = a * d - b * c;

    matrix[0] = d / n;
    matrix[1] = -b / n;
    matrix[2] = -c / n;
    matrix[3] = a / n;
    matrix[4] = (c * ty - d * tx) / n;
    matrix[5] = -(a * ty - b * tx) / n;

    return this;
  }

  /**
   * Set the values of this Matrix to copy those of the matrix given.
   * @param src The source Matrix to copy from.
   */
  copyFrom(src: TransformMatrix) {
    const matrix = this.matrix;

    matrix[0] = src.a;
    matrix[1] = src.b;
    matrix[2] = src.c;
    matrix[3] = src.d;
    matrix[4] = src.e;
    matrix[5] = src.f;

    return this;
  }

  /**
   * Set the values of this Matrix to copy those of the array given.
   * Where array indexes 0, 1, 2, 3, 4 and 5 are mapped to a, b, c, d, e and f.
   * @param src The array of values to set into this matrix.
   */
  copyFromArray(src: any[]) {
    const matrix = this.matrix;

    matrix[0] = src[0];
    matrix[1] = src[1];
    matrix[2] = src[2];
    matrix[3] = src[3];
    matrix[4] = src[4];
    matrix[5] = src[5];

    return this;
  }

  /**
   * Copy the values from this Matrix to the given Canvas Rendering Context.
   * This will use the Context.transform method.
   * @param ctx The Canvas Rendering Context to copy the matrix values to.
   */
  copyToContext(ctx: CanvasRenderingContext2D): CanvasRenderingContext2D {
    const matrix = this.matrix;
    ctx.transform(
      matrix[0],
      matrix[1],
      matrix[2],
      matrix[3],
      matrix[4],
      matrix[5]
    );
    return ctx;
  }

  /**
   * Copy the values from this Matrix to the given Canvas Rendering Context.
   * This will use the Context.setTransform method.
   * @param ctx The Canvas Rendering Context to copy the matrix values to.
   */
  setToContext(ctx: CanvasRenderingContext2D): CanvasRenderingContext2D {
    const matrix = this.matrix;
    ctx.setTransform(
      matrix[0],
      matrix[1],
      matrix[2],
      matrix[3],
      matrix[4],
      matrix[5]
    );
    return ctx;
  }

  /**
   * Copy the values in this Matrix to the array given.
   *
   * Where array indexes 0, 1, 2, 3, 4 and 5 are mapped to a, b, c, d, e and f.
   * @param out The array to copy the matrix values in to.
   */
  copyToArray(out?: any[]): any[] {
    const matrix = this.matrix;

    if (out === undefined) {
      out = [matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]];
    } else {
      out[0] = matrix[0];
      out[1] = matrix[1];
      out[2] = matrix[2];
      out[3] = matrix[3];
      out[4] = matrix[4];
      out[5] = matrix[5];
    }

    return out;
  }

  /**
   * Set the values of this Matrix.
   * @param a The Scale X value.
   * @param b The Shear Y value.
   * @param c The Shear X value.
   * @param d The Scale Y value.
   * @param tx The Translate X value.
   * @param ty The Translate Y value.
   */
  setTransform(
    a: number,
    b: number,
    c: number,
    d: number,
    tx: number,
    ty: number
  ) {
    const matrix = this.matrix;

    matrix[0] = a;
    matrix[1] = b;
    matrix[2] = c;
    matrix[3] = d;
    matrix[4] = tx;
    matrix[5] = ty;

    return this;
  }

  /**
   * Decompose this Matrix into its translation, scale and rotation values using QR decomposition.
   *
   * The result must be applied in the following order to reproduce the current matrix:
   *
   * translate -> rotate -> scale
   */
  decomposeMatrix(): Record<any, any> {
    const decomposedMatrix = this.decomposedMatrix;

    const matrix = this.matrix;

    const a = matrix[0];
    const b = matrix[1];
    const c = matrix[2];
    const d = matrix[3];

    const determ = a * d - b * c;

    decomposedMatrix.translateX = matrix[4];
    decomposedMatrix.translateY = matrix[5];

    if (a || b) {
      const r = Math.sqrt(a * a + b * b);

      decomposedMatrix.rotation = b > 0 ? Math.acos(a / r) : -Math.acos(a / r);
      decomposedMatrix.scaleX = r;
      decomposedMatrix.scaleY = determ / r;
    } else if (c || d) {
      const s = Math.sqrt(c * c + d * d);

      decomposedMatrix.rotation =
        Math.PI * 0.5 - (d > 0 ? Math.acos(-c / s) : -Math.acos(c / s));
      decomposedMatrix.scaleX = determ / s;
      decomposedMatrix.scaleY = s;
    } else {
      decomposedMatrix.rotation = 0;
      decomposedMatrix.scaleX = 0;
      decomposedMatrix.scaleY = 0;
    }

    return decomposedMatrix;
  }

  /**
   * Apply the identity, translate, rotate and scale operations on the Matrix.
   * @param x The horizontal translation.
   * @param y The vertical translation.
   * @param rotation The angle of rotation in radians.
   * @param scaleX The horizontal scale.
   * @param scaleY The vertical scale.
   */
  applyITRS(
    x: number,
    y: number,
    rotation: number,
    scaleX: number,
    scaleY: number
  ): this {
    const matrix = this.matrix;

    const radianSin = Math.sin(rotation);
    const radianCos = Math.cos(rotation);

    // Translate
    matrix[4] = x;
    matrix[5] = y;

    // Rotate and Scale
    matrix[0] = radianCos * scaleX;
    matrix[1] = radianSin * scaleX;
    matrix[2] = -radianSin * scaleY;
    matrix[3] = radianCos * scaleY;

    return this;
  }

  /**
   * Takes the `x` and `y` values and returns a new position in the `output` vector that is the inverse of
   * the current matrix with its transformation applied.
   *
   * Can be used to translate points from world to local space.
   * @param x The x position to translate.
   * @param y The y position to translate.
   * @param output A Vector2, or point-like object, to store the results in.
   */
  applyInverse(x: number, y: number, output = new Vector2()): Vector2 {
    const matrix = this.matrix;

    const a = matrix[0];
    const b = matrix[1];
    const c = matrix[2];
    const d = matrix[3];
    const tx = matrix[4];
    const ty = matrix[5];

    const id = 1 / (a * d + c * -b);

    output.x = d * id * x + -c * id * y + (ty * c - tx * d) * id;
    output.y = a * id * y + -b * id * x + (-ty * a + tx * b) * id;

    return output;
  }

  /**
   * Returns the X component of this matrix multiplied by the given values.
   * This is the same as `x * a + y * c + e`.
   * @param x The x value.
   * @param y The y value.
   */
  getX(x: number, y: number): number {
    return x * this.a + y * this.c + this.e;
  }

  /**
   * Returns the Y component of this matrix multiplied by the given values.
   * This is the same as `x * b + y * d + f`.
   * @param x The x value.
   * @param y The y value.
   */
  getY(x: number, y: number): number {
    return x * this.b + y * this.d + this.f;
  }

  /**
   * Returns the X component of this matrix multiplied by the given values.
   *
   * This is the same as `x * a + y * c + e`, optionally passing via `Math.round`.
   * @param x The x value.
   * @param y The y value.
   * @param round Math.round the resulting value? Default false.
   */
  getXRound(x: number, y: number, round = false): number {
    let v = this.getX(x, y);
    if (round) {
      v = Math.round(v);
    }
    return v;
  }

  /**
   * Returns the Y component of this matrix multiplied by the given values.
   *
   * This is the same as `x * b + y * d + f`, optionally passing via `Math.round`.
   * @param x The x value.
   * @param y The y value.
   * @param round Math.round the resulting value? Default false.
   */
  getYRound(x: number, y: number, round = false): number {
    let v = this.getY(x, y);
    if (round) {
      v = Math.round(v);
    }
    return v;
  }

  /**
   * Returns a string that can be used in a CSS Transform call as a `matrix` property.
   */
  getCSSMatrix(): string {
    const m = this.matrix;
    return (
      'matrix(' +
      m[0] +
      ',' +
      m[1] +
      ',' +
      m[2] +
      ',' +
      m[3] +
      ',' +
      m[4] +
      ',' +
      m[5] +
      ')'
    );
  }

  /**
   * Destroys this Transform Matrix.
   */
  destroy(): void {
    this.matrix = null as any;
    this.decomposeMatrix = null as any;
  }
}
