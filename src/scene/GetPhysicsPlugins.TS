import {GetFastValue, UppercaseFirst} from '../utils'
import Systems from './System'
/**
 * Builds an array of which physics plugins should be activated for the given Scene.
 * @param sys The scene system to get the physics systems of.
 */
function GetPhysicsPlugins(sys: Systems): any[] {
    const defaultSystem = sys.game.config.defaultPhysicsSystem;
    const sceneSystems = GetFastValue(sys.settings, 'physics', false);

    if(!defaultSystem && !sceneSystems) return undefined as any;

    const output: string[] = [];

    if(defaultSystem) {
        output.push(UppercaseFirst(defaultSystem + 'Physics'));
    }

    if(sceneSystems) {
        for(let key in sceneSystems) {
            key = UppercaseFirst(key.concat('Physics'));
            if(output.indexOf(key) === -1) {
                output.push(key);
            }
        }
    }

    return output;
}
export default GetPhysicsPlugins;