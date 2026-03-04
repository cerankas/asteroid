import { SpaceObject } from "./spaceObject";
import { makeColor } from "./utils";


export class Asteroid extends SpaceObject{  
  intensity=1;
  delta=0;
  
  id=Symbol();

  constructor({x=0, y=0, r=1, hue=0}) {
    super({x, y, r, hue});
  }

  animate(dt:number) {
    if (!this.delta) return;

    this.intensity += dt * this.delta;
    
    if (this.intensity >= 1) {
      this.intensity = 1;
      this.delta = 0;
    }

    if (this.intensity <= 0) {
      this.intensity = 0;
      this.delta = 0;
    }
  }

  forceActingOnObject({x, y, r, hue}: {x:number, y:number, r:number, hue:number}): [number, number] {
    const dx = x - this.x;
    const dy = y - this.y;
    const distance = this.distance({x, y}) + r/10;
    
    const forceMagnitude = r * this.r**2 / distance**2 * this.intensity;

    let hueDifference = hue - this.hue;
    while (hueDifference >  180) hueDifference -= 360;
    while (hueDifference < -180) hueDifference += 360;
    const hueFactor = Math.abs(hueDifference / 90) - 1;
    
    const fx = hueFactor * forceMagnitude * dx / distance;
    const fy = hueFactor * forceMagnitude * dy / distance;
    
    return [fx, fy];
  }

  fade(time=.5) {
    if (this.delta) return;
    this.intensity = 1;
    this.delta = -1 / time;
  }

  emerge(time=.5) {
    this.intensity = 0;
    this.delta = 1 / time;
  }

  draw(ctx:CanvasRenderingContext2D) {
    const hue = this.hue;
    const lightness = 50 * this.intensity;
    super.draw(ctx, makeColor({hue, lightness}));
  }
}