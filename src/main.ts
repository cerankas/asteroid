import { Screen } from "./screen";
import { Player } from "./player";
import { Universe } from "./universe";
import { Timer } from "./timer";
import { Simulator } from "./simulator";
import { Control } from "./control";
import { showScore } from "./utils";

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
    universe.regenerate(Screen.getBoundingBox(), player.r);
    universe.animate(dt);
    simulator.simulate(dt);
    simulator.consume();
  }
  
  const d = player.r * .1;
  
  if (control.keys.Shift) {
    if (control.keys.ArrowRight) player.x += d;
    if (control.keys.ArrowLeft)  player.x -= d;
    if (control.keys.ArrowUp)    player.y -= d;
    if (control.keys.ArrowDown)  player.y += d;
  }

  if (control.keys.Control) {
    if (control.keys.ArrowRight) player.vx += d;
    if (control.keys.ArrowLeft)  player.vx -= d;
    if (control.keys.ArrowUp)    player.vy -= d;
    if (control.keys.ArrowDown)  player.vy += d;
  }

  player.changeHue(control.getDelta());

  Screen.reframe(player);
  Screen.clear();

  universe.draw(ctx);
  player.draw(ctx);
  simulator.drawForces(ctx);
  simulator.drawSpectrumHorizontal(ctx);
  
  showScore(player.r);
}

requestAnimationFrame(animate);