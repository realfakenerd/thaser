import {GetFastValue} from '../utils'
import Systems from './Systems';
/**
 * Builds an array of which plugins (not including physics plugins) should be activated for the given Scene.
 * @param sys The Scene Systems object to check for plugins.
 */
function GetScenePlugins(sys: Systems): any[] {
    const defaultPlugins = sys.plugins.getDefaultScenePlugins();
    const scenePlugins = GetFastValue(sys.settings, 'plugins', false);

    if(Array.isArray(scenePlugins)) return scenePlugins;
    else if (defaultPlugins) return defaultPlugins;
    else return [];
}
export default GetScenePlugins;