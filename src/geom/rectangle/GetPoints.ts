import { Point } from "../point";
import GetPoint from "./GetPoint";
import Perimeter from "./Perimiter";
import type Rectangle from "./Rectangle";

/**
 * Return an array of points from the perimeter of the rectangle, each spaced out based on the quantity or step required.
 * @param rectangle The Rectangle object to get the points from.
 * @param step Step between points. Used to calculate the number of points to return when quantity is falsey. Ignored if quantity is positive.
 * @param quantity The number of evenly spaced points from the rectangles perimeter to return. If falsey, step param will be used to calculate the number of points.
 * @param out An optional array to store the points in.
 */
function GetPoints<O extends Point[]>(
  rectangle: Rectangle,
  step: number,
  quantity: number,
  // @ts-ignore
  out: O = []
): O {
  if (!quantity && step > 0) quantity = Perimeter(rectangle) / step;

  let i = 0;
  for (i; i < quantity; i++) {
    const position = i / quantity;
    out.push(GetPoint(rectangle, position));
  }

  return out;
}

export default GetPoints;
