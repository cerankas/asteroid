import { Icons } from "./icons";
import { Sound } from "./sound";
import type { Simulator } from "./simulator";


export class Control {
  simulator:Simulator;

  paused = false;
  keys:{[key:string]:boolean} = {};
  delta = 0;

  constructor(simulator:Simulator) {
    this.simulator = simulator;

    document.addEventListener('keydown', this.keydown.bind(this));
    document.addEventListener('keyup', this.keyup.bind(this));
    document.addEventListener('pointermove', this.pointermove.bind(this));

    document.addEventListener('contextmenu', (e) => e.preventDefault());

    Icons.pause.addEventListener('click', () => this.setPaused(true));
    Icons.play.addEventListener('click', () => this.setPaused(false));

    Icons.restart.addEventListener('click', () => this.simulator.restart());
    Icons.restart.addEventListener('mousedown', (e:MouseEvent) => { if (e.button==2) this.simulator.restart({best:true}); });

    Icons.speaker.addEventListener('click', () => this.setMuted(true));
    Icons.muted.addEventListener('click', () => this.setMuted(false));

    Icons.fullscreen.addEventListener('click', () => this.toggleFullscreen());
    Icons.windowed.addEventListener('click', () => this.toggleFullscreen());
  }

  setPaused(state:boolean) {
    this.paused = state;
    Icons.pause.style.display = showIf(!this.paused);
    Icons.play.style.display = showIf(this.paused);
  }

  setMuted(state:boolean) {
    Sound.muted = state;
    Icons.speaker.style.display = showIf(!Sound.muted);
    Icons.muted.style.display = showIf(Sound.muted);
  }

  toggleFullscreen() {
    const fullscreen = document.fullscreenElement != null;
    if (fullscreen) document.exitFullscreen(); else document.body.requestFullscreen({navigationUI: 'hide'});
    this.updateFullscreenIcon();
  }

  updateFullscreenIcon() {
    const fullscreen = document.fullscreenElement != null;
    Icons.fullscreen.style.display = showIf(!fullscreen);
    Icons.windowed.style.display = showIf(fullscreen);
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


function showIf(condition:boolean) {
  return condition ? 'inline' : 'none';
}