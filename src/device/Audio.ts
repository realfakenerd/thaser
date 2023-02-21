import Browser from './Browser';

/**
 * Determines the audio playback capabilities of the device running this Phaser Game instance.
 * These values are read-only and populated during the boot sequence of the game.
 * They are then referenced by internal game systems and are available for you to access
 * via `this.sys.game.device.audio` from within any Scene.
 */
interface AudioDef {
  /**
   * Can this device play HTML Audio tags?
   */
  audioData: boolean;
  /**
   * Can this device play EC-3 Dolby Digital Plus files?
   */
  dolby: boolean;
  /**
   * Can this device can play m4a files.
   */
  m4a: boolean;
  /**
   * Can this device can play aac files.
   */
  aac: boolean;
  /**
   * Can this device can play flac files.
   */
  flac: boolean;
  /**
   * Can this device play mp3 files?
   */
  mp3: boolean;
  /**
   * Can this device play ogg files?
   */
  ogg: boolean;
  /**
   * Can this device play opus files?
   */
  opus: boolean;
  /**
   * Can this device play wav files?
   */
  wav: boolean;
  /**
   * Does this device have the Web Audio API?
   */
  webAudio: boolean;
  /**
   * Can this device play webm files?
   */
  webm: boolean;
}

const Audio: AudioDef = {
  audioData: false,
  dolby: false,
  m4a: false,
  aac: false,
  flac: false,
  mp3: false,
  ogg: false,
  opus: false,
  wav: false,
  webAudio: false,
  webm: false
};

function init() {
  // @ts-ignore
  if (typeof importScripts === 'function') return Audio;
  
  Audio.audioData = !!window['Audio'];
  
  // @ts-ignore
  Audio.webAudio = !!(window['AudioContext'] || window['webkitAudioContext']);

  const audioElement = document.createElement('audio');
  const result = !!audioElement.canPlayType;

  try {
    if (result) {
      function CanPlay(type1: string, type2?: string) {
        const canPlayType1 = audioElement
          .canPlayType('audio/' + type1)
          .replace(/^no$/, '');

        if (type2)
          return Boolean(
            canPlayType1 ||
              audioElement.canPlayType('audio/' + type2).replace(/^no$/, '')
          );
        else return Boolean(canPlayType1);
      }

      //  wav Mimetypes accepted:
      //  developer.mozilla.org/En/Media_formats_supported_by_the_audio_and_video_elements

      Audio.ogg = CanPlay('ogg; codecs="vorbis"');
      Audio.opus = CanPlay('ogg; codecs="opus"', 'opus');
      Audio.mp3 = CanPlay('mpeg');
      Audio.wav = CanPlay('wav');
      Audio.m4a = CanPlay('x-m4a');
      Audio.aac = CanPlay('aac');
      Audio.flac = CanPlay('flac', 'x-flac');
      Audio.webm = CanPlay('webm; codecs="vorbis"');

      if (audioElement.canPlayType('audio/mp4; codecs="ec-3"') !== '') {
        if (Browser.edge) Audio.dolby = true;
        else if (Browser.safari && Browser.safariVersion >= 9) {
          if (/Mac OS X (\d+)_(\d+)/.test(navigator.userAgent)) {
            const major = parseInt(RegExp.$1, 10);
            const minor = parseInt(RegExp.$2, 10);

            if ((major === 10 && minor >= 11) || major > 10) {
              Audio.dolby = true;
            }
          }
        }
      }
    }
  } catch {}

  return Audio;
}

export default init();
