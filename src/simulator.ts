import type { Player } from "./player";
import type { Universe } from "./universe";
import { Sound } from "./sound";
import { deleteArrayItem, makeColor } from "./utils";


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
      ctx.strokeStyle = makeColor({hue:a.hue});
      ctx.moveTo(x + dx * rr, y + dy * rr);
      ctx.lineTo(x + dx * r2, y + dy * r2);
      ctx.stroke();
    }
  }

  playForceSounds() {
    for (const a of this.universe.asteroids) {
      const [fx, fy] = a.forceActingOnObject(this.player);
      const f = Math.hypot(fx, fy) / this.player.r*2;
      const d = a.distance(this.player) / this.player.r;
      if (f < .0003) continue;
      Sound.playVoice({id:a.id, pitch:20*d, volume:f});
    }
  }

  drawSpectrumHorizontal(ctx:CanvasRenderingContext2D) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    const unit = height * .01;

    ctx.save();
    ctx.resetTransform();
    ctx.lineWidth = width / 1000;

    const drawSpectrumBar = (hue:number, size:number) => {
      const x = width/4 + width/2 * ((360 + 180 + hue - this.player.hue) % 360) / 360;
      const y = .97 * height;
      ctx.beginPath();
      ctx.strokeStyle = makeColor({hue});
      ctx.moveTo(x, y - size);
      ctx.lineTo(x, y + size);
      ctx.stroke();
    }

    const step = 5;
    const div = 30;
    for (let hue = 0; hue <= 360; hue += step ) {
      drawSpectrumBar(hue, (hue % div) ? unit : 2 * unit);
    }

    ctx.restore();
  }
}