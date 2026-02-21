import { SpaceObject } from "./spaceObject";
import { makeColor } from "./utils";


export class Asteroid extends SpaceObject{  
  initR=0;
  targetR=0;
  deltaR=0;
  
  constructor({x=0, y=0, r=1, hue=0}) {
    super({x, y, r, hue});
  }

  animate(dt:number) {
    if (!this.deltaR) return;

    this.r += dt * this.deltaR;
    
    const finishedUp   = this.deltaR > 0 && this.r >= this.targetR;
    const finishedDown = this.deltaR < 0 && this.r <= this.targetR;
    
    if (finishedUp || finishedDown) {
      this.r = this.targetR;
      this.deltaR = 0;
    }
  }

  forceActingOnObject({x, y, r, hue}: {x:number, y:number, r:number, hue:number}): [number, number] {
    const dx = x - this.x;
    const dy = y - this.y;
    const distance = this.distance({x, y}) + r/10;
    
    const forceMagnitude = r * this.r / distance**2;

    let hueDifference = hue - this.hue;
    while (hueDifference >  180) hueDifference -= 360;
    while (hueDifference < -180) hueDifference += 360;
    const hueFactor = Math.abs(hueDifference / 90) - 1;
    
    const fx = hueFactor * forceMagnitude * dx / distance;
    const fy = hueFactor * forceMagnitude * dy / distance;
    
    return [fx, fy];
  }

  fade(time=.5) {
    if (this.deltaR) return;
    this.initR = this.r;
    this.targetR = 0;
    this.deltaR = -this.r / time;
  }

  emerge(time=.5) {
    this.initR = 0;
    this.targetR = this.r;
    this.deltaR = this.r / time;
    this.r = 0;
  }

  draw(ctx:CanvasRenderingContext2D) {
    if (this.deltaR < 0) {
      const hue = this.hue;
      const lightness = 50 * this.r / this.initR;
      super.draw(ctx, makeColor({hue, lightness}), this.initR)
    }
    else if (this.deltaR > 0) {
      const hue = this.hue;
      const lightness = 50 * this.r / this.targetR;
      super.draw(ctx, makeColor({hue, lightness}), this.targetR);
    }
    else {
      super.draw(ctx);
    }
  }
}