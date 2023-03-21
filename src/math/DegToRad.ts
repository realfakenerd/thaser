import { CONST } from '.';

/**
 * Convert the given angle from degrees, to the equivalent angle in radians.
 * @param degrees The angle (in degrees) to convert to radians.
 */
function DegToRad(degrees: number): number {
  return degrees * CONST.DEG_TO_RAD;
}

export default DegToRad;
