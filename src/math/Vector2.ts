import type { Vector2Like } from '../types/math';
import { Equal } from './fuzzy';

/**
 * A representation of a vector in 2D space.
 *
 * A two-component vector.
 */
export default class Vector2 {
  /**
   * @param x The x component, or an object with `x` and `y` properties. Default 0.
   * @param y The y component. Default x.
   */
  constructor(public x: number | Vector2Like = 0, public y: number = 0) {
    if (typeof x === 'object') {
      this.x = x.x || 0;
      this.y = x.y || 0;
    }
  }

  /**
   * Make a clone of this Vector2.
   */
  clone() {
    return new Vector2(this.x, this.y);
  }

  /**
   * Copy the components of a given Vector into this Vector.
   * @param src The Vector to copy the components from.
   */
  copy(src: Vector2Like) {
    this.x = src.x || 0;
    this.y = src.y || 0;
    return this;
  }

  /**
   * Set the component values of this Vector from a given Vector2Like object.
   * @param obj The object containing the component values to set for this Vector.
   */
  setFromObject(obj: Vector2Like) {
    this.x = obj.x || 0;
    this.y = obj.y || 0;
    return this;
  }

  /**
   * Set the `x` and `y` components of the this Vector to the given `x` and `y` values.
   * @param x The x value to set for this Vector.
   * @param y The y value to set for this Vector. Default x.
   */
  set(x: number, y = x) {
    this.x = x;
    this.y = y;
  }

  /**
   * This method is an alias for `Vector2.set`.
   * @param x The x value to set for this Vector.
   * @param y The y value to set for this Vector. Default x.
   */
  setTo(x: number, y = x) {
    return this.set(x, y);
  }

  /**
   * Sets the `x` and `y` values of this object from a given polar coordinate.
   * @param azimuth The angular coordinate, in radians.
   * @param radius The radial coordinate (length). Default 1.
   */
  setToPolar(azimuth: number, radius = 1) {
    this.x = Math.cos(azimuth) * radius;
    this.y = Math.sin(azimuth) * radius;

    return this;
  }

  /**
   * Check whether this Vector is equal to a given Vector.
   *
   * Performs a strict equality check against each Vector's components.
   * @param v The vector to compare with this Vector.
   */
  equals(v: Vector2Like): boolean {
    return this.x === v.x && this.y === v.y;
  }

  /**
   * Check whether this Vector is approximately equal to a given Vector.
   * @param v The vector to compare with this Vector.
   * @param epsilon The tolerance value. Default 0.0001.
   */
  fuzzyEquals(v: Vector2Like, epsilon = 0.0001): boolean {
    return (
      Equal(this.x as number, v.x!, epsilon) && Equal(this.y, v.y!, epsilon)
    );
  }

  /**
   * Calculate the angle between this Vector and the positive x-axis, in radians.
   */
  angle(): number {
    let angle = Math.atan2(this.y, this.x as number);
    if (angle < 0) {
      angle += 2 * Math.PI;
    }
    return angle;
  }

  /**
   * Set the angle of this Vector.
   * @param angle The angle, in radians.
   */
  setAngle(angle: number) {
    return this.setToPolar(angle, this.length());
  }

  /**
   * Add a given Vector to this Vector. Addition is component-wise.
   * @param src The Vector to add to this Vector.
   */
  add(src: Vector2Like) {
    (this.x as number) += src.x!;
    this.y += src.y!;

    return this;
  }

  /**
   * Subtract the given Vector from this Vector. Subtraction is component-wise.
   * @param src The Vector to subtract from this Vector.
   */
  subtract(src: Vector2Like) {
    (this.x as number) -= src.x!;
    this.y -= src.y!;

    return this;
  }

  /**
   * Perform a component-wise multiplication between this Vector and the given Vector.
   *
   * Multiplies this Vector by the given Vector.
   * @param src The Vector to multiply this Vector by.
   */
  multiply(src: Vector2Like) {
    (this.x as number) *= src.x!;
    this.y *= src.y!;

    return this;
  }

  /**
   * Scale this Vector by the given value.
   * @param value The value to scale this Vector by.
   */
  scale(value: number) {
    if (isFinite(value)) {
      (this.x as number) *= value;
      this.y *= value;
    } else {
      this.x = 0;
      this.y = 0;
    }

    return this;
  }

  /**
   * Perform a component-wise division between this Vector and the given Vector.
   *
   * Divides this Vector by the given Vector.
   * @param src The Vector to divide this Vector by.
   */
  divide(src: Vector2Like) {
    (this.x as number) /= src.x!;
    this.y /= src.y!;

    return this;
  }

  /**
   * Negate the `x` and `y` components of this Vector.
   */
  negate() {
    (this.x as number) = -this.x;
    this.y = -this.y;

    return this;
  }

  /**
   * Calculate the distance between this Vector and the given Vector.
   * @param src The Vector to calculate the distance to.
   */
  distance(src: Vector2Like): number {
    const dx = src.x! - (this.x as number);
    const dy = src.y! - this.y;

    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Calculate the distance between this Vector and the given Vector, squared.
   * @param src The Vector to calculate the distance to.
   */
  distanceSq(src: Vector2Like): number {
    const dx = src.x! - (this.x as number);
    const dy = src.y! - this.y;

    return dx * dx + dy * dy;
  }

  /**
   * Calculate the length (or magnitude) of this Vector.
   */
  length(): number {
    const x = this.x as number;
    const y = this.y;

    return Math.sqrt(x * x + y * y);
  }

  /**
   * Set the length (or magnitude) of this Vector.
   */
  setLength(length: number) {
    return this.normalize().scale(length);
  }

  /**
   * Calculate the length of this Vector squared.
   */
  lengthSq(): number {
    const x = this.x as number;
    const y = this.y;

    return x * x + y * y;
  }

  /**
   * Normalize this Vector.
   *
   * Makes the vector a unit length vector (magnitude of 1) in the same direction.
   */
  normalize() {
    const x = this.x as number;
    const y = this.y;
    let len = x * x + y * y;

    if (len > 0) {
      len = 1 / Math.sqrt(len);
      this.x = x * len;
      this.y = y * len;
    }

    return this;
  }

  /**
   * Rotate this Vector to its perpendicular, in the positive direction.
   */
  normalizeRightHand() {
    const x = this.x as number;

    this.x = this.y * -1;
    this.y = x;

    return this;
  }

  /**
   * Rotate this Vector to its perpendicular, in the negative direction.
   */
  normalizeLeftHand() {
    const x = this.x as number;

    this.x = this.y;
    this.y = x * -1;

    return this;
  }

  /**
   * Calculate the dot product of this Vector and the given Vector.
   * @param src The Vector2 to dot product with this Vector2.
   */
  dot(src: Vector2Like): number {
    return (this.x as number) * src.x! + this.y * src.y!;
  }

  /**
   * Calculate the cross product of this Vector and the given Vector.
   * @param src The Vector2 to cross with this Vector2.
   */
  cross(src: Vector2Like): number {
    return (this.x as number) * src.y! - this.y * src.x!;
  }

  /**
   * Linearly interpolate between this Vector and the given Vector.
   *
   * Interpolates this Vector towards the given Vector.
   * @param src The Vector2 to interpolate towards.
   * @param t The interpolation percentage, between 0 and 1. Default 0.
   */
  lerp(src: Vector2Like, t = 0) {
    const ax = this.x as number;
    const ay = this.y;

    this.x = ax + t * (src.x! - ax);
    this.y = ay + t * (src.y! - ay);

    return this;
  }

  /**
   * Transform this Vector with the given Matrix.
   * @param mat The Matrix3 to transform this Vector2 with.
   */
  //   transformMat3(mat: Phaser.Math.Matrix3)

  /**
   * Transform this Vector with the given Matrix.
   * @param mat The Matrix4 to transform this Vector2 with.
   */
  //   transformMat4(mat: Phaser.Math.Matrix4)

  /**
   * Make this Vector the zero vector (0, 0).
   */
  reset() {
    this.x = 0;
    this.y = 0;

    return this;
  }

  /**
   * Limit the length (or magnitude) of this Vector.
   * @param max The maximum length.
   */
  limit(max: number) {
    const len = this.length();

    if (len && len > max) {
      this.scale(max / len);
    }

    return this;
  }

  /**
   * Reflect this Vector off a line defined by a normal.
   * @param normal A vector perpendicular to the line.
   */
  reflect(normal: Vector2) {
    normal = normal.clone().normalize();
    return this.subtract(
      normal.scale(2 * this.dot(normal as Vector2Like)) as Vector2Like
    );
  }

  /**
   * Reflect this Vector across another.
   * @param axis A vector to reflect across.
   */
  mirror(axis: Vector2) {
    return this.reflect(axis).negate();
  }

  /**
   * Rotate this Vector by an angle amount.
   * @param delta The angle to rotate by, in radians.
   */
  rotate(delta: number) {
    const cos = Math.cos(delta);
    const sin = Math.sin(delta);

    return this.set(
      cos * (this.x as number) - sin * this.y,
      sin * (this.x as number) + cos * this.y
    );
  }

  /**
   * Project this Vector onto another.
   * @param src The vector to project onto.
   */
  project(src: Vector2) {
    const scalar = this.dot(src as Vector2Like) / src.dot(src as Vector2Like);

    return this.copy(src as Vector2Like).scale(scalar);
  }

  /**
   * A static zero Vector2 for use by reference.
   *
   * This constant is meant for comparison operations and should not be modified directly.
   */
  static readonly ZERO = new Vector2();

  /**
   * A static right Vector2 for use by reference.
   *
   * This constant is meant for comparison operations and should not be modified directly.
   */
  static readonly RIGHT = new Vector2(1, 0);

  /**
   * A static left Vector2 for use by reference.
   *
   * This constant is meant for comparison operations and should not be modified directly.
   */
  static readonly LEFT = new Vector2(-1, 0);

  /**
   * A static up Vector2 for use by reference.
   *
   * This constant is meant for comparison operations and should not be modified directly.
   */
  static readonly UP = new Vector2(0, -1);

  /**
   * A static down Vector2 for use by reference.
   *
   * This constant is meant for comparison operations and should not be modified directly.
   */
  static readonly DOWN = new Vector2(0, 1);

  /**
   * A static one Vector2 for use by reference.
   *
   * This constant is meant for comparison operations and should not be modified directly.
   */
  static readonly ONE = new Vector2(1, 1);
}
