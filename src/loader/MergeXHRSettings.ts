import { XHRSettingsObject } from '../types/loader';
import { Extend } from '../utils';
import XHRSettings from './XHRSettings';

/**
 * Takes two XHRSettings Objects and creates a new XHRSettings object from them.
 *
 * The new object is seeded by the values given in the global settings, but any setting in
 * the local object overrides the global ones.
 * @param global The global XHRSettings object.
 * @param local The local XHRSettings object.
 */
function MergeXHRSettings(
  global: XHRSettingsObject,
  local: XHRSettingsObject
): XHRSettingsObject {
  const output = global === undefined ? XHRSettings() : Extend({}, global);
  if (local) {
    for (const setting in local) {
      if (local[setting as keyof XHRSettingsObject] !== undefined) {
        (output as any)[setting] = local[setting as keyof XHRSettingsObject];
      }
    }
  }
  return output as any;
}
export default MergeXHRSettings;