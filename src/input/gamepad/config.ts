
/**
 * Tatar SNES USB Controller Gamepad Configuration.
 * USB Gamepad  (STANDARD GAMEPAD Vendor: 0079 Product: 0011)
 */
const enum SNES_USB {
    /**
     * D-Pad up
     */
    UP = 12,

    /**
     * D-Pad down
     */
    DOWN,

    /**
     * D-Pad left
     */
    LEFT,

    /**
     * D-Pad right
     */
    RIGHT,

    /**
     * Select button
     */
    SELECT = 8,

    /**
     * Start button
     */
    START,

    /**
     * B Button (Bottom)
     */
    B = 0,

    /**
     * A Button (Right)
     */
    A,

    /**
     * Y Button (Left)
     */
    Y,

    /**
     * X Button (Top)
     */
    X,

    /**
     * Left bumper
     */
    LEFT_SHOULDER,

    /**
     * Right bumper
     */
    RIGHT_SHOULDER,

}

/**
 * PlayStation DualShock 4 Gamepad Configuration.
 * Sony PlayStation DualShock 4 (v2) wireless controller
 */
const enum DUALSHOCK_4 {
    /**
     * D-Pad up
     */
    UP = 12,

    /**
     * D-Pad down
     */
    DOWN,

    /**
     * D-Pad left
     */
    LEFT,

    /**
     * D-Pad up
     */
    RIGHT,

    /**
     * Share button
     */
    SHARE = 8,

    /**
     * Options button
     */
    OPTIONS,

    /**
     * PlayStation logo button
     */
    PS=16,

    /**
     * Touchpad click
     */
    TOUCHBAR,

    /**
     * Cross button (Bottom)
     */
    X = 0,

    /**
     * Circle button (Right)
     */
    CIRCLE,

    /**
     * Square button (Left)
     */
    SQUARE,

    /**
     * Triangle button (Top)
     */
    TRIANGLE,

    /**
     * Left bumper (L1)
     */
    L1,

    /**
     * Right bumper (R1)
     */
    R1,

    /**
     * Left trigger (L2)
     */
    L2,

    /**
     * Right trigger (R2)
     */
    R2,

    /**
     * Left stick click (L3)
     */
    L3 = 10,

    /**
     * Right stick click (R3)
     */
    R3,

    /**
     * Left stick horizontal
     */
    LEFT_STICK_H = 0,

    /**
     * Left stick vertical
     */
    LEFT_STICK_V,

    /**
     * Right stick horizontal
     */
    RIGHT_STICK_H,

    /**
     * Right stick vertical
     */
    RIGHT_STICK_V,

}

/**
 * XBox 360 Gamepad Configuration.
 */
const enum XBOX_360 {
    /**
     * D-Pad up
     */
    UP = 12,

    /**
     * D-Pad down
     */
    DOWN,

    /**
     * D-Pad left
     */
    LEFT,

    /**
     * D-Pad right
     */
    RIGHT,

    /**
     * XBox menu button
     */
    MENU,

    /**
     * A button (Bottom)
     */
    A = 0,

    /**
     * B button (Right)
     */
    B,

    /**
     * X button (Left)
     */
    X,

    /**
     * Y button (Top)
     */
    Y,

    /**
     * Left Bumper
     */
    LB,

    /**
     * Right Bumper
     */
    RB,

    /**
     * Left Trigger
     */
    LT,

    /**
     * Right Trigger
     */
    RT,

    /**
     * Back / Change View button
     */
    BACK,

    /**
     * Start button
     */
    START,

    /**
     * Left Stick press
     */
    LS,

    /**
     * Right stick press
     */
    RS,

    /**
     * Left Stick horizontal
     */
    LEFT_STICK_H = 0,

    /**
     * Left Stick vertical
     */
    LEFT_STICK_V,

    /**
     * Right Stick horizontal
     */
    RIGHT_STICK_H,

    /**
     * Right Stick vertical
     */
    RIGHT_STICK_V,

}

export {
    SNES_USB,
    DUALSHOCK_4,
    XBOX_360
}