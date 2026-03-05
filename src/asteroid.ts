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
    
    if (this.delta > 0 && this.intensity > 1) {
      this.intensity = 1;
      this.delta = 0;
    }

    if (this.delta < 0 && this.intensity < 0) {
      this.intensity = 0;
      this.delta = 0;
    }
  }

  forceActingOnObject({x, y, r, hue}: {x:number, y:number, r:number, hue:number}): [number, number] {
    const dx = x - this.x;
    const dy = y - this.y;
    const distance = this.distance({x, y}) + r/10;
    
    const pureGravity = r * this.r**2 / distance**2;

    let hueDifference = hue - this.hue;
    while (hueDifference >  180) hueDifference -= 360;
    while (hueDifference < -180) hueDifference += 360;
    const hueFactor = Math.abs(hueDifference / 90) - 1;

    const forceMagnitude = pureGravity * hueFactor * this.intensity;
    
    const fx = forceMagnitude * dx / distance;
    const fy = forceMagnitude * dy / distance;
    
    return [fx, fy];
  }

  fadeOut(period=3) {
    this.delta = -1 / period;
  }

  fadeIn(period=3) {
    this.intensity = 0;
    this.delta = 1 / period;
  }

  faded() {
    return this.intensity == 0 && this.delta == 0;
  }

  draw(ctx:CanvasRenderingContext2D) {
    const hue = this.hue;
    const lightness = 50 * this.intensity;
    super.draw(ctx, makeColor({hue, lightness}));
  }
}