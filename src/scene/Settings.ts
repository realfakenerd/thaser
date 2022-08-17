import { SettingsConfig, SettingsObject } from '../types/scene';
import { GetValue, Merge } from '../utils';
import { CONST } from './const';
import InjectionMap from './InjectionMap';

export default class Settings {
  /**
   * Takes a Scene configuration object and returns a fully formed System Settings object.
   * @param config The Scene configuration object used to create this Scene Settings.
   */
  static create(
    config: string | SettingsConfig
  ): SettingsObject & { input: any } {
    if (typeof config === 'string') config = { key: config };
    else if (config === undefined) config = {};

    return {
      status: CONST.PENDING,

      key: GetValue(config, 'key', ''),
      active: GetValue(config, 'active', false),
      visible: GetValue(config, 'visible', true),

      isBooted: false,

      isTransition: false,
      transitionFrom: null,
      transitionDuration: 0,
      transitionAllowInput: true,

      //  Loader payload array

      data: {},

      pack: GetValue(config, 'pack', false),

      //  Cameras

      cameras: GetValue(config, 'cameras', null),

      //  Scene Property Injection Map

      map: GetValue(
        config,
        'map',
        Merge(InjectionMap, GetValue(config, 'mapAdd', {}))
      ),

      //  Physics

      physics: GetValue(config, 'physics', {}),

      //  Loader

      loader: GetValue(config, 'loader', {}),

      //  Plugins

      plugins: GetValue(config, 'plugins', false),

      //  Input

      input: GetValue(config, 'input', {})
    };
  }
}
