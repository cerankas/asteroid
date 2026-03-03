import { Icons } from "./icons";
import { Sound } from "./sound";
import type { Simulator } from "./simulator";


export class Control {
  simulator:Simulator;

  paused = false;

  constructor(simulator:Simulator) {
    this.simulator = simulator;

    document.addEventListener('keydown', this.keydown.bind(this));
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

  keydown(e:KeyboardEvent) {
    const k = e.key;
    const player = this.simulator.player;
    
    if (k == ' ') this.setPaused(!this.paused);
    
    if (k == 'r' || k == '1') player.hue = 0;
    if (k == 'y' || k == '2') player.hue = 60;
    if (k == 'g' || k == '3') player.hue = 120;
    if (k == 'c' || k == '4') player.hue = 180;
    if (k == 'b' || k == '5') player.hue = 240;
    if (k == 'm' || k == '6') player.hue = 300;

    Sound.anyUserActionPerformed = true;
  }

  pointermove(e:PointerEvent) {
    if (!e.buttons) return;
    this.simulator.player.changeHue(-e.movementX / window.innerWidth * 2 * 360);
    Sound.anyUserActionPerformed = true;
  }
}


function showIf(condition:boolean) {
  return condition ? 'inline' : 'none';
}