import Game from "@thaser/core/Game";
import AddToDOM from "./AddToDom";

/**
 * This function creates a DOM container element for a game using the provided configuration.
 * @param {Game} game - The game object that contains the configuration and state of the game.
 * @returns If either `config.parent` or `config.domCreateContainer` is falsy, nothing is returned.
 */
function CreateDOMContainer(game: Game) {
  const config = game.config;

  if (!config.parent || !config.domCreateContainer) return;

  //  DOM Element Container
  const div = document.createElement('div');

  div.style.cssText = [
    'display: block;',
    'width: ' + game.scale.width + 'px;',
    'height: ' + game.scale.height + 'px;',
    'padding: 0; margin: 0;',
    'position: absolute;',
    'overflow: hidden;',
    'pointer-events: ' + config.domPointerEvents + ';',
    'transform: scale(1);',
    'transform-origin: left top;'
  ].join(' ');

  game.domContainer = div;

  AddToDOM(div, config.parent);
}

export default CreateDOMContainer;