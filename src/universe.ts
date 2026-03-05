import { Asteroid } from "./asteroid"
import { deleteArrayItem, distance, outsideBoundingBox, rnd } from "./utils";


export class Universe {
  asteroids:Array<Asteroid> = [];

  generationTimer = 0;

  addRandomAsteroid({minx=-1, maxx=1, miny=-1, maxy=1, minr=.5, maxr=2}, player={x:0,y:0,r:0}) {
    const x = rnd(minx, maxx);
    const y = rnd(miny, maxy);
    
    if (distance(player, {x, y}) < maxr + 5 * player.r) return;
    
    const nearbyAsteroids = filterAsteroids(this.asteroids, a => a.distance({x, y}) < maxr + 5 * player.r);
    const areas = smallerAndGreaterAsteroidAreas(nearbyAsteroids, player.r);
    
    if (areas.smaller < areas.greater) maxr = player.r;
    if (areas.smaller > areas.greater) minr = player.r;

    const r = rnd(minr, maxr);

    if (nearbyAsteroids.some(a => a.distance({x, y}) < 2 * (a.r + r))) return;
    
    const hue = rnd(0, 360);

    const asteroid = new Asteroid({ x, y, r, hue });
    asteroid.fadeIn();
    this.asteroids.push(asteroid);
  }

  regenerate({minx=0, maxx=0, miny=0, maxy=0}, player={x:0,y:0,r:0}, dt:number) {
    const [minr, maxr] = [player.r * .25, player.r * 4];

    for (const a of this.asteroids) 
      if (a.faded())
        deleteArrayItem(this.asteroids, a);

    for (const a of this.asteroids) 
      if (outsideBoundingBox(a, {minx, maxx, miny, maxy}, a.r) || a.r < minr || a.r > maxr)
        a.fadeOut();

    this.generationTimer += dt;

    while (this.generationTimer > 0) {
      this.generationTimer -= .01;
      this.addRandomAsteroid({minx, maxx, miny, maxy, minr, maxr}, player);
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


function smallerAndGreaterAsteroidAreas(asteroids:Asteroid[], r:number) {
  let [smaller, greater] = [0,0];
  for (const a of asteroids) {
    if (a.r < r) smaller += a.r**2;
    if (a.r > r) greater += a.r**2;
  }
  return {smaller, greater};
}


function filterAsteroids(asteroids:Asteroid[], condition:(a:Asteroid)=>boolean) {
  const result:Asteroid[] = [];
  for (const a of asteroids) {
    if (condition(a)) result.push(a);
  }
  return result;
}