import GetAspectRatio from './GetApesctRatio';
import type Rectangle from './Rectangle';

/**
 * Adjusts the target rectangle, changing its width, height and position,
 * so that it fully covers the area of the source rectangle, while maintaining its original
 * aspect ratio.
 *
 * Unlike the `FitInside` function, the target rectangle may extend further out than the source.
 * @param target The target rectangle to adjust.
 * @param source The source rectangle to envelope the target in.
 */
function FitOutside<O extends Rectangle>(target: O, source: Rectangle) {
  const ratio = GetAspectRatio(target);
  if (ratio > GetAspectRatio(source))
    target.setSize(source.height * ratio, source.height);
  else target.setSize(source.width, source.width / ratio);
  return target.setPosition(
    source.centerX - target.width / 2,
    source.centerY - target.height / 2
  );
}

export default FitOutside;
