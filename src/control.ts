import { Icons } from "./icons";
import { Sound } from "./sound";

export class Control {
  paused = false;
  keys:{[key:string]:boolean} = {};
  delta = 0;

  constructor() {
    document.addEventListener('keydown', this.keydown.bind(this));
    document.addEventListener('keyup', this.keyup.bind(this));
    document.addEventListener('pointermove', this.pointermove.bind(this));

    Icons.pause.addEventListener('click', () => this.setPaused(true));
    Icons.play.addEventListener('click', () => this.setPaused(false));

    Icons.speaker.addEventListener('click', () => this.setMuted(true));
    Icons.muted.addEventListener('click', () => this.setMuted(false));

    Icons.fullscreen.addEventListener('click', () => this.toggleFullscreen());
    Icons.windowed.addEventListener('click', () => this.toggleFullscreen());
  }

  setPaused(state:boolean) {
    this.paused = state;
    Icons.pause.style.display = this.paused ? 'none' : 'inline';
    Icons.play.style.display = this.paused ? 'inline' : 'none';
  }

  setMuted(state:boolean) {
    Sound.muted = state;
    Icons.speaker.style.display = Sound.muted ? 'none' : 'inline';
    Icons.muted.style.display = Sound.muted ? 'inline' : 'none';
  }

  toggleFullscreen() {
    const fullscreen = document.fullscreenElement != null;
    if (fullscreen) document.exitFullscreen(); else document.body.requestFullscreen({navigationUI: 'hide'});
    this.updateFullscreenIcon();
  }

  updateFullscreenIcon() {
    const fullscreen = document.fullscreenElement != null;
    Icons.fullscreen.style.display = fullscreen ? 'none' : 'inline';
    Icons.windowed.style.display = fullscreen ? 'inline' : 'none';
  }

  getDelta() {
    const tmp = -this.delta;
    this.delta = 0;
    return tmp;
  }

  keydown(e:KeyboardEvent) {
    if (e.key == ' ') this.setPaused(!this.paused);
    this.keys[e.key] = true;
    Sound.anyUserActionPerformed = true;
  }

  keyup(e:KeyboardEvent) {
    this.keys[e.key] = false;
  }

  pointermove(e:PointerEvent) {
    if (!e.buttons) return;
    this.delta += e.movementX / window.innerWidth * 2 * 361;
    Sound.anyUserActionPerformed = true;
  }
}