import { Asteroid } from "./asteroid"


function rnd(min:number, max:number|null=null) {
  if (max == null) {
    max = min;
    min = -min;
  }
  return min + Math.random() * (max - min);
}


export class Universe {
  asteroids:Array<Asteroid> = [];

  constructor() {
    const density = .05;
    const size = 50;
    const count = size**2 * density;
    console.log(count);
    while (this.asteroids.length < count) {
      const x = rnd(size);
      const y = rnd(size);
      const r = rnd(.5, 1.5);
      const hue = rnd(0, 360);
      
      const isTooClose = (a:Asteroid) => a.distance(x,y) < 2 * (a.r + r);

      if (this.asteroids.some(isTooClose)) continue;

      const asteroid = new Asteroid({ x, y, r, hue });
      this.asteroids.push(asteroid);
    }
  }

  forcesActingOnObject({x, y, r, hue}: {x:number, y:number, r:number, hue:number}): [number, number][] {
    const forces = []
    for (const a of this.asteroids) {
      forces.push(a.forceActingOnObject({x, y, r, hue}));
    }
    return forces;
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (const a of this.asteroids) a.draw(ctx);
  }
}