import { SpaceObject } from "./spaceObject";


export class Asteroid extends SpaceObject{  
  constructor({x=0, y=0, r=1, hue=0}) {
    super({x, y, r, hue});
  }

  forceActingOnObject({x, y, r, hue}: {x:number, y:number, r:number, hue:number}): [number, number] {
    const dx = x - this.x;
    const dy = y - this.y;
    const distance = this.distance({x, y}) + r;
    
    const forceMagnitude = r * this.r**2 / distance**2;

    let hueDifference = hue - this.hue;
    while (hueDifference >  180) hueDifference -= 360;
    while (hueDifference < -180) hueDifference += 360;
    const hueFactor = Math.abs(hueDifference / 90) - 1;
    
    const fx = hueFactor * forceMagnitude * dx / distance;
    const fy = hueFactor * forceMagnitude * dy / distance;
    
    return [fx, fy];
  }
}