export class Sound {
  static ctx:AudioContext|null = null;

  static voices:{[id:symbol]:Voice} = {};

  static updateTime = 0;

  static anyUserActionPerformed = false;

  static get voiceCount() { return Reflect.ownKeys(this.voices).length; }
  
  static initialize() {
    if (!this.anyUserActionPerformed) return;
    if (!this.ctx)
      this.ctx = new window.AudioContext();
  }

  static *voiceIDs() {
    for (const id of Reflect.ownKeys(this.voices)) {
      if (typeof(id) != 'symbol') throw Error;
      yield id;
    }
  }
  
  static playVoice({id=Symbol(), pitch=500, lfo=10, volume=1}) {
    this.initialize();
    if (!this.ctx) return;
    
    if (!(id in this.voices))
      this.voices[id] = new Voice();
    
    if (this.updateTime == 0)
      this.updateTime = this.ctx.currentTime;
    
    this.voices[id].updateTime = this.ctx.currentTime;
    this.voices[id].update({pitch, lfo, volume});
  }

  static terminateUnusedVoices() {
    if (this.updateTime == 0)
      this.terminateAllVoices();

    for (const id of this.voiceIDs())
      if (this.voices[id].updateTime < this.updateTime)
        this.terminateVoice(id);
    
    this.updateTime = 0;
  }

  static terminateAllVoices() {
    for (const id of this.voiceIDs())
      this.terminateVoice(id);
  }

  static terminateVoice(id:symbol) {
    this.voices[id].terminate();
    delete this.voices[id];
  }
}


class Voice {
  osc:OscillatorNode;
  oscGain:GainNode;
  lfo:OscillatorNode;
  lfoGain:GainNode;

  updateTime = 0;

  constructor() {
    Sound.initialize();
    if (!Sound.ctx) throw Error;

    this.osc = Sound.ctx.createOscillator();
    this.osc.type = "sine";
    
    this.oscGain = Sound.ctx.createGain();
    this.oscGain.gain.value = 0;
    
    this.lfo = Sound.ctx.createOscillator();
    this.lfo.type = "sine";
    this.lfo.frequency.value = 20;
    
    this.lfoGain = Sound.ctx.createGain();
    this.lfoGain.gain.value = 100;
    
    this.lfo.connect(this.lfoGain);
    this.lfoGain.connect(this.osc.frequency);
    
    this.osc.connect(this.oscGain);
    this.oscGain.connect(Sound.ctx.destination);
    
    this.osc.start();
    this.lfo.start();
  }
  
  update({pitch=500, lfo=10, volume=1}) {
    if (!Sound.ctx) throw Error;
    const now = Sound.ctx.currentTime;
    this.osc.frequency.exponentialRampToValueAtTime(Math.max(20, pitch), now + 0.05);
    this.lfo.frequency.exponentialRampToValueAtTime(Math.max(20, lfo), now + 0.05);
    this.oscGain.gain.linearRampToValueAtTime(Math.max(0, Math.min(1, volume)) * .5, now + 0.05);
  }
  
  terminate() {
    this.osc.stop();
    this.lfo.stop();

    this.osc.disconnect();
    this.oscGain.disconnect();
    this.lfo.disconnect();
    this.lfoGain.disconnect();
  }
}