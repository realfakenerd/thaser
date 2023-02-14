/**
 * Phaser Scale Manager constants for zoom modes.
 */
const enum Zoom {
  /**
   * The game canvas will not be zoomed by Phaser.
   */
  NO_ZOOM,
  /**
   * The game canvas will be 2x zoomed by Phaser.
   */
  ZOOM_2X,
  /**
   * The game canvas will be 4x zoomed by Phaser.
   */
  ZOOM_4X,
  /**
   * Calculate the zoom value based on the maximum multiplied game size that will
   * fit into the parent, or browser window if no parent is set.
   */
  MAX_ZOOM
}

export default Zoom;
