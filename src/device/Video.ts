/**
 * Determines the video support of the browser running this Phaser Game instance.
 * These values are read-only and populated during the boot sequence of the game.
 * They are then referenced by internal game systems and are available for you to access
 * via `this.sys.game.device.video` from within any Scene.
 *
 * In Phaser 3.20 the properties were renamed to drop the 'Video' suffix.
 */
interface VideoDef {
  /**
   * Can this device play h264 mp4 video files?
   */
  h264: boolean;
  /**
   * Can this device play hls video files?
   */
  hls: boolean;
  /**
   * Can this device play h264 mp4 video files?
   */
  mp4: boolean;
  /**
   * Can this device play m4v (typically mp4) video files?
   */
  m4v: boolean;
  /**
   * Can this device play ogg video files?
   */
  ogg: boolean;
  /**
   * Can this device play vp9 video files?
   */
  vp9: boolean;
  /**
   * Can this device play webm video files?
   */
  webm: boolean;
}

const Video: VideoDef = {
  h264: false,
  hls: false,
  mp4: false,
  m4v: false,
  ogg: false,
  vp9: false,
  webm: false
};

function init() {
  if (typeof importScripts === 'function') return Video;

  let videoElement = document.createElement('video');
  let result = !!videoElement.canPlayType;
  let no = /^no$/;

  try {
    if (result) {
      if (
        videoElement.canPlayType('video/ogg; codecs="theora"').replace(no, '')
      ) {
        Video.ogg = true;
      }

      if (
        videoElement
          .canPlayType('video/mp4; codecs="avc1.42E01E"')
          .replace(no, '')
      ) {
        // Without QuickTime, this value will be `undefined`. github.com/Modernizr/Modernizr/issues/546
        Video.h264 = true;
        Video.mp4 = true;
      }

      if (videoElement.canPlayType('video/x-m4v').replace(no, '')) {
        Video.m4v = true;
      }

      if (
        videoElement
          .canPlayType('video/webm; codecs="vp8, vorbis"')
          .replace(no, '')
      ) {
        Video.webm = true;
      }

      if (
        videoElement.canPlayType('video/webm; codecs="vp9"').replace(no, '')
      ) {
        Video.vp9 = true;
      }

      if (
        videoElement
          .canPlayType('application/x-mpegURL; codecs="avc1.42E01E"')
          .replace(no, '')
      ) {
        Video.hls = true;
      }
    }
  } catch (e) {
    //  Nothing to do
  }

  return Video;
}

export default init();
