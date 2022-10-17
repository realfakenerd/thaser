import { GetAdvancedValue } from '@utils';
import { Scene } from '@thaser/scene';
import { BlendModes } from '@thaser/renderer';
import GameObject from './GameObject';
/**
 * Builds a Game Object using the provided configuration object.
 * @param scene A reference to the Scene.
 * @param gameObject The initial GameObject.
 * @param config The config to build the GameObject with.
 */
function BuildGameObject(
  scene: Scene,
  gameObject: GameObject,
  config: GameObjectConfig
): GameObject {
  gameObject.x = GetAdvancedValue(config, 'x', 0);
  gameObject.y = GetAdvancedValue(config, 'y', 0);
  gameObject.depth = GetAdvancedValue(config, 'depth', 0);

  gameObject.flipX = GetAdvancedValue(config, 'flipX', false);
  gameObject.flipY = GetAdvancedValue(config, 'flipY', false);

  const scale = GetAdvancedValue(config, 'scale', null);

  if (typeof scale === 'number') {
    gameObject.setScale(scale);
  } else if (scale !== null) {
    gameObject.scaleX = GetAdvancedValue(scale, 'x', 1);
    gameObject.scaleY = GetAdvancedValue(scale, 'y', 1);
  }

  const scrollFactor = GetAdvancedValue(config, 'scrollFactor', null);

  if (typeof scrollFactor === 'number') {
    gameObject.setScrollFactor(scrollFactor);
  } else if (scrollFactor !== null) {
    gameObject.scrollFactorX = GetAdvancedValue(scrollFactor, 'x', 1);
    gameObject.scrollFactorY = GetAdvancedValue(scrollFactor, 'y', 1);
  }

  gameObject.rotation = GetAdvancedValue(config, 'rotation', 0);

  const angle = GetAdvancedValue(config, 'angle', null);

  if (angle !== null) {
    gameObject.angle = angle;
  }

  gameObject.alpha = GetAdvancedValue(config, 'alpha', 1);

  const origin = GetAdvancedValue(config, 'origin', null);

  if (typeof origin === 'number') {
    gameObject.setOrigin(origin);
  } else if (origin !== null) {
    const ox = GetAdvancedValue(origin, 'x', 0.5);
    const oy = GetAdvancedValue(origin, 'y', 0.5);

    gameObject.setOrigin(ox, oy);
  }

  gameObject.blendMode = GetAdvancedValue(
    config,
    'blendMode',
    BlendModes.NORMAL
  );

  gameObject.visible = GetAdvancedValue(config, 'visible', true);

  const add = GetAdvancedValue(config, 'add', true);

  if (add) {
    scene.sys.displayList.add(gameObject);
  }

  if (gameObject.preUpdate) {
    scene.sys.updateList.add(gameObject);
  }

  return gameObject;
}
