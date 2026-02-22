import type { Player } from "./player";
import type { Universe } from "./universe";
import { deleteArrayItem } from "./utils";


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

  consume() {
    const player = this.player;
    for (const a of this.universe.asteroids) {
      if (!player.isColliding(a)) continue;
      const [consuming, consumed] = (player.r > a.r) ? [player, a] : [a, player];
      consuming.consume(consumed);

      if (a.r <= 0) deleteArrayItem(this.universe.asteroids, a);
    }
  }

  drawForces(ctx:CanvasRenderingContext2D) {
    const {x, y, r} = this.player;
    const rr = 1.33 * r;
    for (const a of this.universe.asteroids) {
      const [afx, afy] = a.forceActingOnObject(this.player);
      const [fx, fy] = [afx / r, afy / r];
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

  drawSpectrumHorizontal(ctx:CanvasRenderingContext2D) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    const unit = height * .01;
    const half = unit / 2;

    ctx.save();
    ctx.resetTransform();

    const hueToX = (hue:number) => width * (.25 + .5 * hue / 361);
    
    ctx.lineWidth = width / 2000;

    for (let hue = 0; hue <= 360; hue += 2 ) {
      ctx.beginPath();
      ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
      ctx.moveTo(hueToX(hue), height - 2 * unit);
      ctx.lineTo(hueToX(hue), height - 3 * unit);
      ctx.stroke();
    }

    {
      ctx.beginPath();
      ctx.strokeStyle = `hsl(${this.player.hue}, 100%, 50%)`;
      const x = hueToX(this.player.hue);
      const y = height - 3.7 * unit;
      ctx.moveTo(x, y - half);
      ctx.lineTo(x, y + half);
      ctx.moveTo(x - half, y);
      ctx.lineTo(x + half, y);
      ctx.stroke();
    }

    {
      ctx.beginPath();
      const hue = (this.player.hue + 180) % 360;
      ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
      const x = hueToX(hue);
      const y = height - 1.3 * unit;
      ctx.moveTo(x - half, y);
      ctx.lineTo(x + half, y);
      ctx.stroke();
    }

    ctx.restore();
  }
}