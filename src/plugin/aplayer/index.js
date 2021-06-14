import 'aplayer/dist/APlayer.min.css';
import aplayer from 'aplayer';
var dynplayer;
var domElement;
export function createPlayer() {
  domElement = document.createElement("div");
  document.body.appendChild(domElement);
  dynplayer = new aplayer({
    container: domElement,
    fixed: true,
    loop: 'all',
    theme: '#e50914',
    preload: 'auto',
    volume: 0.7,
  })
}
export function globalPlayer(){
  if(dynplayer == undefined || dynplayer == "") return undefined
  return dynplayer;
}

export function destroyPlayer(){
  if(dynplayer){
    dynplayer.destroy();
    dynplayer = "";
    domElement.remove();
    domElement = "";
  }
}
