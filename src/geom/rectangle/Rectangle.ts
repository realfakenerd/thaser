import GEOM_CONST from '../const';
import { Line } from '../lines';
import { Point } from '../point';
import Contains from './Contains';
import GetPoint from './GetPoint';
import GetPoints from './GetPoints';
import Random from './Random';
/**
 * Encapsulates a 2D rectangle defined by its corner point in the top-left and its extends in x (width) and y (height)
 */
export default class Rectangle {
  /**
   *
   * @param x The X coordinate of the top left corner of the Rectangle. Default 0.
   * @param y The Y coordinate of the top left corner of the Rectangle. Default 0.
   * @param width The width of the Rectangle. Default 0.
   * @param height The height of the Rectangle. Default 0.
   */
  constructor(x = 0, y = 0, width = 0, height = 0) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  /**
   * The geometry constant type of this object: `GEOM_CONST.RECTANGLE`.
   * Used for fast type comparisons.
   */
  readonly type: number = GEOM_CONST.RECTANGLE;

  /**
   * The X coordinate of the top left corner of the Rectangle.
   */
  x: number;

  /**
   * The Y coordinate of the top left corner of the Rectangle.
   */
  y: number;

  /**
   * The width of the Rectangle, i.e. the distance between its left side (defined by `x`) and its right side.
   */
  width: number;

  /**
   * The height of the Rectangle, i.e. the distance between its top side (defined by `y`) and its bottom side.
   */
  height: number;

  /**
   * Checks if the given point is inside the Rectangle's bounds.
   * @param x The X coordinate of the point to check.
   * @param y The Y coordinate of the point to check.
   */
  contains(x: number, y: number) {
    return Contains(this, x, y);
  }

  /**
   * Calculates the coordinates of a point at a certain `position` on the Rectangle's perimeter.
   *
   * The `position` is a fraction between 0 and 1 which defines how far into the perimeter the point is.
   *
   * A value of 0 or 1 returns the point at the top left corner of the rectangle, while a value of 0.5 returns the point at the bottom right corner of the rectangle. Values between 0 and 0.5 are on the top or the right side and values between 0.5 and 1 are on the bottom or the left side.
   * @param position The normalized distance into the Rectangle's perimeter to return.
   * @param output An object to update with the `x` and `y` coordinates of the point.
   */
  getPoint<O extends Point>(position: number, output?: O) {
    return GetPoint(this, position, output);
  }

  /**
   * Returns an array of points from the perimeter of the Rectangle, each spaced out based on the quantity or step required.
   * @param quantity The number of points to return. Set to `false` or 0 to return an arbitrary number of points (`perimeter / stepRate`) evenly spaced around the Rectangle based on the `stepRate`.
   * @param stepRate If `quantity` is 0, determines the normalized distance between each returned point.
   * @param output An array to which to append the points.
   */
  getPoints<O extends Point[]>(
    quantity: number,
    stepRate?: number,
    output?: O
  ) {
    return GetPoints(this, quantity, stepRate!, output);
  }

  /**
   * Returns a random point within the Rectangle's bounds.
   * @param point The object in which to store the `x` and `y` coordinates of the point.
   */
  getRandomPoint<O extends Point>(point?: O) {
    return Random(this, point);
  }

  /**
   * Sets the position, width, and height of the Rectangle.
   * @param x The X coordinate of the top left corner of the Rectangle.
   * @param y The Y coordinate of the top left corner of the Rectangle.
   * @param width The width of the Rectangle.
   * @param height The height of the Rectangle.
   */
  setTo(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    return this;
  }

  /**
   * Resets the position, width, and height of the Rectangle to 0.
   */
  setEmpty() {
    return this.setTo(0, 0, 0, 0);
  }

  /**
   * Sets the position of the Rectangle.
   * @param x The X coordinate of the top left corner of the Rectangle.
   * @param y The Y coordinate of the top left corner of the Rectangle. Default x.
   */
  setPosition(x: number, y = x) {
    this.x = x;
    this.y = y;

    return this;
  }

  /**
   * Sets the width and height of the Rectangle.
   * @param width The width to set the Rectangle to.
   * @param height The height to set the Rectangle to. Default width.
   */
  setSize(width: number, height = width) {
    this.width = width;
    this.height = height;

    return this;
  }

  /**
   * Determines if the Rectangle is empty. A Rectangle is empty if its width or height is less than or equal to 0.
   */
  isEmpty() {
    return this.width <= 0 || this.height <= 0;
  }

  /**
   * Returns a Line object that corresponds to the top of this Rectangle.
   * @param line A Line object to set the results in. If `undefined` a new Line will be created.
   */
  getLineA<O extends Line>(line = new Line() as O) {
    line.setTo(this.x, this.y, this.right, this.y);

    return line;
  }

  /**
   * Returns a Line object that corresponds to the right of this Rectangle.
   * @param line A Line object to set the results in. If `undefined` a new Line will be created.
   */
  getLineB<O extends Line>(line = new Line() as O) {
    line.setTo(this.right, this.y, this.right, this.bottom);
    return line;
  }

  /**
   * Returns a Line object that corresponds to the bottom of this Rectangle.
   * @param line A Line object to set the results in. If `undefined` a new Line will be created.
   */
  getLineC<O extends Line>(line = new Line() as O) {
    line.setTo(this.right, this.bottom, this.x, this.bottom);
    return line;
  }

  /**
   * Returns a Line object that corresponds to the left of this Rectangle.
   * @param line A Line object to set the results in. If `undefined` a new Line will be created.
   */
  getLineD<O extends Line>(line = new Line() as O) {
    line.setTo(this.x, this.bottom, this.x, this.y);
    return line;
  }

  /**
   * The x coordinate of the left of the Rectangle.
   * Changing the left property of a Rectangle object has no effect on the y and height properties. However it does affect the width property, whereas changing the x value does not affect the width property.
   */
  get left() {
    return this.x;
  }
  set left(value) {
    if (value >= this.right) this.width = 0;
    else this.width = this.right - value;
    this.x = value;
  }

  /**
   * The sum of the x and width properties.
   * Changing the right property of a Rectangle object has no effect on the x, y and height properties, however it does affect the width property.
   */
  get right() {
    return this.x + this.width;
  }
  set right(value) {
    if (value <= this.x) this.width = 0;
    else this.width = value - this.x;
  }

  /**
   * The y coordinate of the top of the Rectangle. Changing the top property of a Rectangle object has no effect on the x and width properties.
   * However it does affect the height property, whereas changing the y value does not affect the height property.
   */
  get top() {
    return this.y;
  }
  set top(value) {
    if (value >= this.bottom) this.height = 0;
    else this.height = this.bottom - value;
    this.y = value;
  }

  /**
   * The sum of the y and height properties.
   * Changing the bottom property of a Rectangle object has no effect on the x, y and width properties, but does change the height property.
   */
  get bottom() {
    return this.y + this.height;
  }
  set bottom(value) {
    if (value <= this.y) this.height = 0;
    else this.height = value - this.y;
  }

  /**
   * The x coordinate of the center of the Rectangle.
   */
  get centerX() {
    return this.x + this.width / 2;
  }
  set centerX(value) {
    this.x = value - this.width / 2;
  }

  /**
   * The y coordinate of the center of the Rectangle.
   */
  get centerY() {
    return this.y + this.height / 2;
  }
  set centerY(value) {
    this.y = value - this.height / 2;
  }
}
