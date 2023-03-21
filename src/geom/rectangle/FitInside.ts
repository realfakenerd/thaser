import GetAspectRatio from './GetApesctRatio';
import type Rectangle from './Rectangle';

/**
 * Adjusts the target rectangle, changing its width, height and position,
 * so that it fits inside the area of the source rectangle, while maintaining its original
 * aspect ratio.
 *
 * Unlike the `FitOutside` function, there may be some space inside the source area not covered.
 * @param target The target rectangle to adjust.
 * @param source The source rectangle to envelop the target in.
 */
function FitInside<O extends Rectangle>(target: O, source: Rectangle) {
  const ratio = GetAspectRatio(target);

  // Taller than wide
  if (ratio < GetAspectRatio(source))
    target.setSize(source.height * ratio, source.height);
  // Wide than tall
  else target.setSize(source.width, source.width / ratio);
  return target.setPosition(source.x, source.y);
}

export default FitInside;
