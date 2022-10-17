const enum INPUT_CONST {

    /**
     * The mouse pointer is being held down.
     */
    MOUSE_DOWN = 0,

    /**
     * The mouse pointer is being moved.
     */
    MOUSE_MOVE = 1,

    /**
     * The mouse pointer is released.
     */
    MOUSE_UP = 2,

    /**
     * A touch pointer has been started.
     */
    TOUCH_START = 3,

    /**
     * A touch pointer has been started.
     */
    TOUCH_MOVE = 4,

    /**
     * A touch pointer has been started.
     */
    TOUCH_END = 5,

    /**
     * The pointer lock has changed.
     */
    POINTER_LOCK_CHANGE = 6,

    /**
     * A touch pointer has been been cancelled by the browser.
     */
    TOUCH_CANCEL = 7,

    /**
     * The mouse wheel changes.
     */
    MOUSE_WHEEL = 8

};