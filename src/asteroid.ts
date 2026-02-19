export class Asteroid {
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

  distance(x:number, y:number) {
    return Math.hypot(this.x - x, this.y - y);
  }

  forceActingOnObject({x, y, r, hue}: {x:number, y:number, r:number, hue:number}): [number, number] {
    const dx = x - this.x;
    const dy = y - this.y;
    const distance = this.distance(x, y) + r;
    
    // if (distance > this.r * 100) return [0,0];

    const forceMagnitude = r * this.r**2 / distance**2;

    let hueDifference = hue - this.hue;
    while (hueDifference >  180) hueDifference -= 360;
    while (hueDifference < -180) hueDifference += 360;
    const hueFactor = Math.abs(hueDifference / 90) - 1;
    
    const fx = hueFactor * forceMagnitude * dx / distance;
    const fy = hueFactor * forceMagnitude * dy / distance;
    
    return [fx, fy];
  }

  draw(ctx:CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
    ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
    ctx.fill();
  }
}