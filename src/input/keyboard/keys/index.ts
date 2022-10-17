import Key from './Key';
import { KeyCodes } from './KeyCodes';

/**
 * Returns `true` if the Key was pressed down within the `duration` value given, based on the current
 * game clock time. Or `false` if it either isn't down, or was pressed down longer ago than the given duration.
 * @param key The Key object to test.
 * @param duration The duration, in ms, within which the key must have been pressed down. Default 50.
 */
function DownDuration(key: Key, duration = 50): boolean {
  const current = key.plugin.game.loop.time - key.timeDown;
  return key.isDown && current < duration;
}

/**
 * The justDown value allows you to test if this Key has just been pressed down or not.
 *
 * When you check this value it will return `true` if the Key is down, otherwise `false`.
 *
 * You can only call justDown once per key press. It will only return `true` once, until the Key is released and pressed down again.
 * This allows you to use it in situations where you want to check if this key is down without using an event, such as in a core game loop.
 * @param key The Key to check to see if it's just down or not.
 */
function JustDown(key: Key): boolean {
  if (key._justDown) {
    key._justDown = false;
    return true;
  } else return false;
}

/**
 * The justUp value allows you to test if this Key has just been released or not.
 *
 * When you check this value it will return `true` if the Key is up, otherwise `false`.
 *
 * You can only call JustUp once per key release. It will only return `true` once, until the Key is pressed down and released again.
 * This allows you to use it in situations where you want to check if this key is up without using an event, such as in a core game loop.
 * @param key The Key to check to see if it's just up or not.
 */
function JustUp(key: Key): boolean {
  if (key._justUp) {
    key._justUp = false;
    return true;
  } else {
    return false;
  }
}

/**
 * Returns `true` if the Key was released within the `duration` value given, based on the current
 * game clock time. Or returns `false` if it either isn't up, or was released longer ago than the given duration.
 * @param key The Key object to test.
 * @param duration The duration, in ms, within which the key must have been released. Default 50.
 */
function UpDuration(key: Key, duration = 50): boolean {
  const current = key.plugin.game.loop.time - key.timeUp;
  return key.isUp && current < duration;
}

const KeyMap: Record<any, any> = {};

for (const key in KeyCodes) {
  KeyMap[KeyCodes[key]] = key;
}

export { DownDuration, JustDown, JustUp, UpDuration, KeyCodes, KeyMap, Key };
