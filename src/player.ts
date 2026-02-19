export class Player {
  x:number;
  y:number;
  r:number;
  vx:number;
  vy:number;
  hue:number;

  constructor({x=0, y=0, r=1, hue=0}) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.vx = 0;
    this.vy = 0;
    this.hue = hue;
  }

  changeHue(delta:number) {
    this.hue += delta;
    while (this.hue > 360) this.hue -= 360;
    while (this.hue < 0) this.hue += 360;
  }

  move(dt:number, {fx=0, fy=0}) {
    this.vx += 10 * fx * dt;
    this.vy += 10 * fy * dt;

    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }

  draw(ctx:CanvasRenderingContext2D) {
    ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctx.fill();
  }
}