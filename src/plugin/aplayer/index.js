import 'aplayer/dist/APlayer.min.css';
import Aplayer from 'aplayer';

let dynplayer;
let domElement;
export function createPlayer() {
  domElement = document.createElement('div');
  document.body.appendChild(domElement);
  dynplayer = new Aplayer({
    container: domElement,
    fixed: true,
    loop: 'all',
    theme: '#e50914',
    preload: 'auto',
    volume: 0.7,
  });
}
export function globalPlayer() {
  if (dynplayer === undefined || dynplayer === '') return undefined;
  return dynplayer;
}

export function destroyPlayer() {
  if (dynplayer) {
    dynplayer.destroy();
    dynplayer = '';
    domElement.remove();
    domElement = '';
  }
}
