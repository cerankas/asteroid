import { Screen } from "./screen";
import { Timer } from "./timer";
import { Simulator } from "./simulator";
import { Control } from "./control";
import { Sound } from "./sound";


const simulator = new Simulator();
const control = new Control(simulator);


function animate(t:number) {
  requestAnimationFrame(animate);

  const ctx = Screen.ctx;
  if (!ctx) return;

  const player = simulator.player;
  const universe = simulator.universe;
  
  if (!control.paused) {
    const dt = Timer.delta(t/1000);
    universe.regenerate(Screen.getBoundingBox(), player.r);
    universe.animate(dt);
    simulator.simulate(dt);
    simulator.consume();
    simulator.playForceSounds();
  }
  else {
    Timer.reset();
  }

  Sound.terminateUnusedVoices();
  
  Screen.reframe(player);
  Screen.clear();

  universe.draw(ctx);
  player.draw(ctx);
  simulator.drawForces(ctx);
  simulator.drawSpectrumHorizontal(ctx);

  simulator.keepSafeScale();

  simulator.showScore();
  simulator.updateBestScore();

  control.updateFullscreenIcon();
}


requestAnimationFrame(animate);