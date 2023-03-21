import { Animation } from '@thaser/types/animations';
import { GetAdvancedValue } from '@thaser/utils';
import { Sprite } from './sprite';

/**
 * Adds an Animation component to a Sprite and populates it based on the given config.
 * @param sprite The sprite to add an Animation component to.
 * @param config The animation config.
 */
function BuildGameObjectAnimation(sprite: Sprite, config: object): Sprite {
  const animConfig = GetAdvancedValue(config, 'anims', null) as Animation;

  if (animConfig === null) return sprite;

  if (typeof animConfig === 'string') sprite.anims.play(animConfig);
  else if (typeof animConfig === 'object') {
    const anims = sprite.anims;
    const key = GetAdvancedValue(animConfig, 'key', undefined);

    if (key) {
      const startFrame = GetAdvancedValue(animConfig, 'startFrame', undefined);

      const delay = GetAdvancedValue(animConfig, 'delay', 0);
      const repeat = GetAdvancedValue(animConfig, 'repeat', 0);
      const repeatDelay = GetAdvancedValue(animConfig, 'repeatDelay', 0);
      const yoyo = GetAdvancedValue(animConfig, 'yoyo', false);

      const play = GetAdvancedValue(animConfig, 'play', false);
      const delayedPlay = GetAdvancedValue(animConfig, 'delayedPlay', 0);

      const playConfig = {
        key,
        delay,
        repeat,
        repeatDelay,
        yoyo,
        startFrame
      };

      if (play) anims.play(playConfig);
      else if (delayedPlay > 0) anims.playAfterDelay(playConfig, delayedPlay);
      else anims.load(playConfig);
    }
  }

  return sprite;
}
export default BuildGameObjectAnimation;
