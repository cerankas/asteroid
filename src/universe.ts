import { Asteroid } from "./asteroid"
import { deleteArrayItem, outsideBoundingBox, rnd } from "./utils";


export class Universe {
  asteroids:Array<Asteroid> = [];

  addRandomAsteroid({minx=-1, maxx=1, miny=-1, maxy=1, minr=.5, maxr=2}, emergeTime=3) {
    const x = rnd(minx, maxx);
    const y = rnd(miny, maxy);
    const r = rnd(minr, maxr);
    const hue = rnd(0, 360);
    
    const isTooClose = (a:Asteroid) => a.distance({x, y}) < 2 * (a.r + r);

    if (this.asteroids.some(isTooClose)) return false;

    const asteroid = new Asteroid({ x, y, r, hue });
    asteroid.emerge(emergeTime);
    this.asteroids.push(asteroid);

    return true;
  }

  regenerate({minx=0, maxx=0, miny=0, maxy=0}, r=1) {
    const [minr, maxr] = [r * .5, r * 4];

    for (const a of this.asteroids) {
      if (outsideBoundingBox(a, {minx, maxx, miny, maxy}, a.r)) {
        deleteArrayItem(this.asteroids, a);
      }
    }

    for (const a of this.asteroids) {
      if (a.r < minr/2 || a.r > maxr*2) {
        a.fade(3);
      }
    }

    const half = r * 5; // half of inspection box side length
    const x0 = rnd(minx+half, maxx-half);
    const y0 = rnd(miny+half, maxy-half);
    
    {
      const minx = x0 - half;
      const maxx = x0 + half;
      const miny = y0 - half;
      const maxy = y0 + half;
      
      let smallerArea = 0;
      let greaterArea = 0;
      
      for (const a of this.asteroids) {
        if (outsideBoundingBox(a, {minx, maxx, miny, maxy})) continue;
        
        const area = (a.r / r)**2;
        
        if (a.r < r) smallerArea += area;
        else         greaterArea += area;
      }
      
      const desiredArea = .0001 * half**2;
      if (smallerArea < desiredArea) this.addRandomAsteroid({minx, maxx, miny, maxy, minr, maxr:r});
      if (greaterArea < desiredArea) this.addRandomAsteroid({minx, maxx, miny, maxy, minr:r, maxr});
    }
  }

  animate(dt:number) {
    for (const a of this.asteroids) a.animate(dt);
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