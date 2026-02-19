export class Screen {
  static canvas = <HTMLCanvasElement> document.getElementById('canvas');
  static ctx = this.canvas.getContext('2d');
  static zoom = 20;

  static {
    this.resize();

    document.addEventListener('wheel', this.wheel.bind(this));
    window.addEventListener('resize', this.resize.bind(this));
  }

  static resize() {
    this.canvas.width = this.canvas.parentElement!.clientWidth;
    this.canvas.height = this.canvas.parentElement!.clientHeight;
  }

  static wheel(e:WheelEvent) {
    const delta = 1.1;
    const min = 10;
    const max = 100;
    if (e.deltaY > 0) this.zoom *= delta;
    if (e.deltaY < 0) this.zoom /= delta;
    if (this.zoom < min) this.zoom = min;
    if (this.zoom > max) this.zoom = max;
  }

  static reframe({x=0, y=0, r=1}) {
    if (!this.ctx) return;
    this.ctx.resetTransform();
    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
    const scale = this.canvas.height / r / this.zoom;
    this.ctx.scale(scale, scale);
    this.ctx.translate(-x, -y);
  }

  static clear() {
    if (!this.ctx) return;
    this.ctx.save();
    this.ctx.resetTransform();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.restore();
  }
}