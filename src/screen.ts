export class Screen {
  static canvas = <HTMLCanvasElement> document.getElementById('canvas');
  static ctx = this.canvas.getContext('2d');
  static span = 30;
  static minSpan = 15;
  static maxSpan = 60;

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
    if (e.deltaY > 0) this.span *= delta;
    if (e.deltaY < 0) this.span /= delta;
    if (this.span < this.minSpan) this.span = this.minSpan;
    if (this.span > this.maxSpan) this.span = this.maxSpan;
  }

  static getBoundingBox() {
    const width = this.canvas.width;
    const height = this.canvas.height;

    const {a:screenScale, e:screenDx, f:screenDy} = this.ctx!.getTransform();

    const x0 = (width/2 - screenDx) / screenScale;
    const y0 = (height/2 - screenDy) / screenScale;
    
    const adjustedScale = 2 * screenScale * this.span / this.maxSpan;
    
    const minx = x0 - width  / adjustedScale;
    const maxx = x0 + width  / adjustedScale;
    const miny = y0 - height / adjustedScale;
    const maxy = y0 + height / adjustedScale;

    return {minx, maxx, miny, maxy};
  }

  static reframe({x=0, y=0, r=1}) {
    if (!this.ctx) return;
    this.ctx.resetTransform();
    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
    const scale = Math.min(this.canvas.width, this.canvas.height) / r / this.span;
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