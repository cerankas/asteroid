export class Timer {
  static time = 0;

  static reset() {
    this.time = 0;
  }

  static delta(time:number) {
    const dt = this.time ? time - this.time : 0;
    this.time = time;
    return dt;
  }
}