import { Screen } from "./screen";
import { Player } from "./player";
import { Universe } from "./universe";
import { Timer } from "./timer";
import { Simulator } from "./simulator";
import { Control } from "./control";
import { showScore } from "./utils";
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
  
  player.changeHue(control.getDelta());
  if (control.keys.r) player.hue = 0;
  if (control.keys.g) player.hue = 120;
  if (control.keys.b) player.hue = 240;
  if (control.keys.c) player.hue = 180;
  if (control.keys.m) player.hue = 300;
  if (control.keys.y) player.hue = 60;

  Screen.reframe(player);
  Screen.clear();

  universe.draw(ctx);
  player.draw(ctx);
  simulator.drawForces(ctx);
  simulator.drawSpectrumHorizontal(ctx);

  simulator.keepSafeScale();

  showScore(player.r);

  control.updateFullscreenIcon();
}


requestAnimationFrame(animate);