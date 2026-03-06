import { SpaceObject } from "./spaceObject";


export class Player extends SpaceObject {
  vx=0;
  vy=0;

  constructor({x=0, y=0, r=1, hue=0} = {}) {
    super({x, y, r, hue});
  }

  rescale(factor:number) {
    super.rescale(factor);
    this.vx *= factor;
    this.vy *= factor;
  }

  changeHue(delta:number) {
    this.hue += delta;
    while (this.hue > 360) this.hue -= 360;
    while (this.hue < 0) this.hue += 360;
  }

  move(dt:number, {fx=0, fy=0}) {
    this.vx += 100 * fx * dt;
    this.vy += 100 * fy * dt;

    this.x += this.vx * dt;
    this.y += this.vy * dt;

    this.vx -= this.vx * dt;
    this.vy -= this.vy * dt;
  }
}