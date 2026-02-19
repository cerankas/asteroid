import { Screen } from "./screen";
import { Player } from "./player";
import { Universe } from "./universe";
import { Timer } from "./timer";
import { Simulator } from "./simulator";
import { Control } from "./control";

const player = new Player({});
const universe = new Universe();
const simulator = new Simulator(player, universe);

const control = new Control();

function animate(t:number) {
  requestAnimationFrame(animate);

  const ctx = Screen.ctx;
  if (!ctx) return;


  if (control.paused) Timer.reset();

  if (!control.paused) {
    const dt = Timer.delta(t/1000);
    simulator.simulate(dt);
    simulator.eatAndGrow();
  }

  if (control.keys.Shift) {
    if (control.keys.ArrowRight) player.x += .1;
    if (control.keys.ArrowLeft)  player.x -= .1;
    if (control.keys.ArrowUp)    player.y -= .1;
    if (control.keys.ArrowDown)  player.y += .1;
  }

  if (control.keys.Control) {
    if (control.keys.ArrowRight) player.vx += .1;
    if (control.keys.ArrowLeft)  player.vx -= .1;
    if (control.keys.ArrowUp)    player.vy -= .1;
    if (control.keys.ArrowDown)  player.vy += .1;
  }

  player.changeHue(control.getDelta());

  Screen.reframe(player);
  Screen.clear();

  universe.draw(ctx);
  player.draw(ctx);
  simulator.drawForces(ctx);
  // simulator.drawSpectrumSmallRing(ctx);
  // simulator.drawSpectrumBigRing(ctx);
  // simulator.drawSpectrumVertical(ctx);
  simulator.drawSpectrumHorizontal(ctx);
}

requestAnimationFrame(animate);