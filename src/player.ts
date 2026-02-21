import { SpaceObject } from "./spaceObject";


export class Player extends SpaceObject {
  vx=0;
  vy=0;

  maxR:number;
  protectionTimer=0;

  constructor({x=0, y=0, r=1, hue=0}) {
    super({x, y, r, hue});
    this.maxR = r;
  }

  canBeReduced() {
    return super.canBeReduced() && this.r > this.maxR / 2 && !this.protectionTimer;
  }

  consume(o:SpaceObject) {
    super.consume(o);
    if (this.maxR < this.r) {
      this.maxR = this.r;
      this.protectionTimer = 0;
    }
  }

  changeHue(delta:number) {
    this.hue += delta;
    while (this.hue > 360) this.hue -= 360;
    while (this.hue < 0) this.hue += 360;
  }

  move(dt:number, {fx=0, fy=0}) {
    this.vx += 100 * fx * dt;
    this.vy += 100 * fy * dt;

    this.x += this.vx * dt;
    this.y += this.vy * dt;

    this.vx -= 1 * this.vx * dt;
    this.vy -= 1 * this.vy * dt;

    if (!this.canBeReduced() && !this.protectionTimer) {
      this.protectionTimer = 10;
      this.maxR = this.r;
    }

    if (this.protectionTimer) {
      this.protectionTimer -= dt;
      if (this.protectionTimer <= 0) {
        this.protectionTimer = 0;
      }
    }
  }

  draw(ctx:CanvasRenderingContext2D) {
    if (this.protectionTimer) {
      super.draw(ctx, 'white');
      super.draw(ctx, '', this.r * (1 - this.protectionTimer / 10));
    }
    else {
      super.draw(ctx);
    }
  }
}