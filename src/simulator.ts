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

  drawForces(ctx:CanvasRenderingContext2D) {
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

  drawSpectrumSmallRing(ctx:CanvasRenderingContext2D) {
    const {x, y, r} = this.player;    
    const scale = ctx.getTransform().a;
    
    const r1 = 1.10 * r;
    const r2 = 1.23 * r;
    ctx.lineWidth = r/20;
  
    for (let hue = 0; hue < 360; hue++) {
      const angle = hue * Math.PI / 180;
      const s = Math.sin(angle);
      const c = Math.cos(angle);
      ctx.beginPath();
      ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
      ctx.moveTo(x + s * r1, y + c * r1);
      ctx.lineTo(x + s * r2, y + c * r2);
      ctx.stroke();
    }
    
    const angle = this.player.hue * Math.PI / 180;
    const s = Math.sin(angle);
    const c = Math.cos(angle);
    ctx.beginPath();
    ctx.lineWidth = 3 / scale;
    ctx.strokeStyle = 'black';
    const R = (r1 + r2) / 2;
    const rr = (r2 - r1) / 2;
    ctx.arc(x + s * R, y + c * R, rr, 0, 2*Math.PI);
    ctx.stroke();
  }

  drawSpectrumBigRing(ctx:CanvasRenderingContext2D) {
    const {x, y} = this.player;
    
    const scale = ctx.getTransform().a;
    const size = Math.min(ctx.canvas.width, ctx.canvas.height) / scale / 2;
    
    const r1 = size * .9;
    const r2 = size * .91;
    ctx.lineWidth = .5 / scale;

    for (let hue = 0; hue < 360; hue++) {
      const angle = hue * Math.PI / 180;
      const s = Math.sin(angle);
      const c = Math.cos(angle);
      ctx.beginPath();
      ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
      ctx.moveTo(x + s * r1, y + c * r1);
      ctx.lineTo(x + s * r2, y + c * r2);
      ctx.stroke();
    }
    
    const angle = this.player.hue * Math.PI / 180;
    const s = Math.sin(angle);
    const c = Math.cos(angle);
    ctx.beginPath();
    ctx.lineWidth = 3 / scale;
    ctx.strokeStyle = 'white';
    const R = (r1 + r2) / 2;
    const rr = (r2 - r1) / 2;
    ctx.arc(x + s * R, y + c * R, rr, 0, 2*Math.PI);
    ctx.stroke();
  }

  drawSpectrumVertical(ctx:CanvasRenderingContext2D) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    const margin = height * .02;
    const size = margin * 2;
    const tick = margin / 3;

    ctx.save();
    ctx.resetTransform();

    const hueToHeight = (hue:number) => margin + hue / 361 * (height - 2 * margin);
    
    ctx.lineWidth = height / 300;
    for (let hue = 0; hue < 361; hue++) {
      ctx.beginPath();
      ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
      ctx.moveTo(width - margin, hueToHeight(hue));
      ctx.lineTo(width - size, hueToHeight(hue));
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.strokeStyle = `hsl(${this.player.hue}, 100%, 50%)`;
    ctx.moveTo(width - margin + tick, hueToHeight(this.player.hue));
    ctx.lineTo(width - size - tick, hueToHeight(this.player.hue));
    ctx.stroke();

    ctx.restore();
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