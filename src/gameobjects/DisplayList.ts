import { List } from "@thaser/structs";

/**
         * The Display List plugin.
         * 
         * Display Lists belong to a Scene and maintain the list of Game Objects to render every frame.
         * 
         * Some of these Game Objects may also be part of the Scene's [Update List]{@link Phaser.GameObjects.UpdateList}, for updating.
         */
export default class DisplayList extends List<GameObject> {
    /**
     * 
     * @param scene The Scene that this Display List belongs to.
     */
    constructor(scene: Phaser.Scene){}

    /**
     * The flag the determines whether Game Objects should be sorted when `depthSort()` is called.
     */
    sortChildrenFlag: boolean;

    /**
     * The Scene that this Display List belongs to.
     */
    scene: Phaser.Scene;

    /**
     * The Scene's Systems.
     */
    systems: Phaser.Scenes.Systems;

    /**
     * The Scene's Event Emitter.
     */
    events: Phaser.Events.EventEmitter;

    /**
     * Force a sort of the display list on the next call to depthSort.
     */
    queueDepthSort(): void;

    /**
     * Immediately sorts the display list if the flag is set.
     */
    depthSort(): void;

    /**
     * Compare the depth of two Game Objects.
     * @param childA The first Game Object.
     * @param childB The second Game Object.
     */
    sortByDepth(childA: Phaser.GameObjects.GameObject, childB: Phaser.GameObjects.GameObject): number;

    /**
     * Returns an array which contains all objects currently on the Display List.
     * This is a reference to the main list array, not a copy of it, so be careful not to modify it.
     */
    getChildren(): Phaser.GameObjects.GameObject[];

}
