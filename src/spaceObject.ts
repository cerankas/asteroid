import { distance, makeColor } from "./utils";


export class SpaceObject {
  x:number;
  y:number;
  r:number;
  hue:number;

  constructor({x=0, y=0, r=1, hue=0}) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.hue = hue;
  }

  rescale(factor:number) {
    this.x *= factor;
    this.y *= factor;
    this.r *= factor;
  }

  translate(dx:number, dy:number) {
    this.x += dx;
    this.y += dy;
  }

  distance({x, y}: {x:number, y:number}) {
    return distance(this, {x, y});
  }

  isColliding(o:SpaceObject) {
    return this.distance(o) < this.r + o.r;
  }

  canBeReduced() {
    return this.r > 0;
  }

  consume(o:SpaceObject) {
    const delta = .01 * o.r;
    while (this.isColliding(o) && o.canBeReduced()) {
      this.r += delta / this.r;
      o.r    -= delta / o.r;
    }
  }

  draw(ctx:CanvasRenderingContext2D, color='', r=0) {
    ctx.fillStyle = color ? color : makeColor(this);
    ctx.beginPath();
    ctx.arc(this.x, this.y, r ? r : this.r, 0, 2 * Math.PI);
    ctx.fill();
  }
}