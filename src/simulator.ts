import type { Player } from "./player";
import type { Universe } from "./universe";

export class Simulator {
  time = 0;

  player:Player;
  universe:Universe;

  constructor(player:Player, universe:Universe) {
    this.player = player;
    this.universe = universe;
  }

  simulateFixedTimeStep(dt:number) {
    const forces = this.universe.forcesActingOnObject(this.player);
    const totalForce = {fx:0, fy:0};
    for (const [fx, fy] of forces) {
      totalForce.fx += fx;
      totalForce.fy += fy;
    }
    this.player.move(dt, totalForce)
  }

  simulate(dt:number) {
    const fixedTimeStep = .001;
    this.time += dt;

    while (this.time > 0) {
      this.time -= fixedTimeStep;
      this.simulateFixedTimeStep(fixedTimeStep);
    }
  }

  restrict() {
    for (const a of this.universe.asteroids) {
      const dx = this.player.x - a.x;
      const dy = this.player.y - a.y;
      const d = Math.hypot(dx,dy);
      const mind = a.r + this.player.r / 2;
      if (d > mind) continue;
      this.player.x = a.x + dx * mind / d;
      this.player.y = a.y + dy * mind / d;
    }
  }

  drawForces(ctx: CanvasRenderingContext2D) {
    const {x, y, r} = this.player;
    const rr = 1.33 * r;
    for (const a of this.universe.asteroids) {
      const [fx, fy] = a.forceActingOnObject(this.player);
      const magnitude = Math.hypot(fx, fy);
      const dx = fx / magnitude;
      const dy = fy / magnitude;
      const size = magnitude ** .5;
      const r2 = rr + size * r * 10;
      ctx.beginPath();
      ctx.lineWidth = size * r;
      ctx.strokeStyle = `hsl(${a.hue}, 100%, 50%)`;
      ctx.moveTo(x + dx * rr, y + dy * rr);
      ctx.lineTo(x + dx * r2, y + dy * r2);
      ctx.stroke();
    }
  }
}