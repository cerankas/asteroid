export class Control {
  paused = false;
  keys:{[key:string]:boolean} = {};
  delta = 0;

  constructor() {
    document.addEventListener('keydown', this.keydown.bind(this));
    document.addEventListener('keyup', this.keyup.bind(this));
    document.addEventListener('mousemove', this.mousemove.bind(this));
  }

  getDelta() {
    const tmp = this.delta;
    this.delta = 0;
    return tmp;
  }

  keydown(e:KeyboardEvent) {
    if (e.key == ' ') this.paused = !this.paused;
    this.keys[e.key] = true;
  }

  keyup(e:KeyboardEvent) {
    this.keys[e.key] = false;
  }

  mousemove(e:MouseEvent) {
    if (!e.buttons) return;
    this.delta += e.movementX / window.innerWidth * 2 * 361;
  }
}