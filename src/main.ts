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
  
  if (!control.paused) {
    const dt = Timer.delta(t/1000);
    universe.regenerate(Screen.getBoundingBox(), player.r);
    universe.animate(dt);
    simulator.simulate(dt);
    simulator.consume();
  }
  else {
    Timer.reset();
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