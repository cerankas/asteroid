import { Player } from "./player";
import { Universe } from "./universe";
import { Sound } from "./sound";
import { deleteArrayItem, makeColor } from "./utils";
import { Screen } from "./screen";


export class Simulator {
  time = 0;

  scoreOffset = 0;
  bestScore = parseInt(localStorage.getItem('bestScore') || '0');

  player = new Player();
  universe = new Universe();

  constructor() {
    this.showBestScore()
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

  restart({best}={best:false}) {
    this.scoreOffset = best ? (this.bestScore - this.bestScore % 500) : 0;
    this.player = new Player();
    this.universe = new Universe();
  }

  rescale(factor:number) {
    this.player.rescale(factor);
    for (const a of this.universe.asteroids)
      a.rescale(factor);
    Screen.reframe(this.player);
  }

  translate(dx:number, dy:number) {
    this.player.translate(dx, dy);
    for (const a of this.universe.asteroids)
      a.translate(dx, dy);
    Screen.reframe(this.player);
  }

  keepSafeScale() {
    if (this.player.r > 10) {
      this.rescale(.1);
      this.scoreOffset += 100;
    }

    if (this.player.r < .1) {
      this.rescale(10);
      this.scoreOffset -= 100;
    }

    const span = 10000;
    if (Math.abs(this.player.x) > span || Math.abs(this.player.y) > span) {
      this.translate(-this.player.x, -this.player.y);
    } 
  }

  score() {
    return this.scoreOffset + Math.log10(this.player.r)*100|0;
  }

  updateBestScore() {
    const score = this.score();
    if (this.bestScore < score) {
      this.bestScore = score;
      localStorage.setItem('bestScore', score.toString());
      this.showBestScore();
    }
  }

  showScore() {
    const div = <HTMLDivElement> document.getElementById('score');
    div.innerText = `Score: ${this.score()}`;
  }

  showBestScore() {
    const div = <HTMLDivElement> document.getElementById('best-score');
    div.innerText = `Best score: ${this.bestScore}`;
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
    const rays = [];
    for (const a of this.universe.asteroids) {
      const [afx, afy] = a.forceActingOnObject(this.player);
      const [fx, fy] = [afx / r, afy / r];
      const magnitude = Math.hypot(fx, fy);
      const dx = fx / magnitude;
      const dy = fy / magnitude;
      const size = magnitude ** .5;
      rays.push({a, dx, dy, size});
    }
    rays.sort((a,b) => (a.size > b.size) ? -1 : 1);
    for (const {a, dx, dy, size} of rays) {
      const r2 = rr + size * r * 10;
      const width = size * r;
      ctx.beginPath();
      ctx.lineWidth = width;
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