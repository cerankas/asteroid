import { makeColor } from "./utils";


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

  distance({x, y}: {x:number, y:number}) {
    return Math.hypot(this.x - x, this.y - y);
  }

  isColliding(o:SpaceObject) {
    return this.distance(o) < this.r + o.r;
  }

  canBeReduced() {
    return this.r > 0;
  }

  consume(o:SpaceObject) {
    while (this.isColliding(o) && o.canBeReduced()) {
      const delta = .001 * this.r**2;
      
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