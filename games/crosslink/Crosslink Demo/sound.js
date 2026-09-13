// The noises. Everything is synthesised on the spot — no files, no fetches,
// nothing to go missing.
//
// Two families, and the difference matters. A *beep* is a square wave with a
// hard envelope, which is what a sound card of the period could do without a
// sample to load: it is the machine speaking, and it is pitched. A *click* is
// not a beep. Clicking a button in 1994 made no sound in software at all — the
// noise you remember came from the switch under your finger, and a switch has
// no pitch. It is a burst of broadband noise that dies in a hundredth of a
// second.
//
// This was wrong until 3.9: the click was a 1320Hz square, and a short pitched
// pop is exactly what a phone keyboard makes, which is why it sounded like one.
// Contact noises are noise now; verdicts stay beeps.
(function () {
  var CL = window.CROSSLINK = window.CROSSLINK || {};
  var ctx = null, on = true;

  // The context is built on the first click, because a browser will not let a
  // page make a noise before it has been touched.
  //
  // `latencyHint: "interactive"` asks for the smallest buffer the device will
  // give. It is the default, and it is written out anyway, because it is the
  // one thing in this file that decides how long after a key the sound arrives.
  function audio() {
    if (!on) return null;
    if (!ctx) {
      var A = window.AudioContext || window.webkitAudioContext;
      if (!A) return null;
      try { ctx = new A({ latencyHint: "interactive" }); }
      catch (e) { ctx = new A(); }
    }
    if (ctx.state === "suspended") { var p = ctx.resume(); if (p && p.catch) p.catch(function () {}); }
    return ctx;
  }

  // Wake the context on the first gesture of any kind, not on the first note.
  //
  // This is where the lag was. A suspended context has a stopped clock, so a
  // note scheduled at `currentTime` is scheduled against a time that is not
  // moving; `resume()` returns a promise, and by the time it settles the clock
  // has jumped past the moment the note was booked for. The first sound after
  // any suspension therefore arrived late, or not at all — and browsers suspend
  // on their own whenever a tab goes to the background.
  //
  // Priming on the first click or keypress means the clock is already running
  // before anything needs to be heard, and the visibility handler starts it
  // again after the tab has been away.
  function prime() {
    if (!on) return;
    audio();
    document.removeEventListener("pointerdown", prime, true);
    document.removeEventListener("keydown", prime, true);
  }
  document.addEventListener("pointerdown", prime, true);
  document.addEventListener("keydown", prime, true);
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden && ctx && ctx.state === "suspended") ctx.resume();
  });

  // One note: square wave, flat top, hard stop. `at` is seconds from now.
  // The envelope times are clamped, because the shortest sound here is 18ms and
  // a fresh context starts at currentTime 0 — where "20ms before the end" is a
  // negative number, and AudioParam will not have it.
  function note(freq, at, dur, level, shape) {
    var a = audio();
    if (!a) return;
    var t = a.currentTime + at;
    var rise = Math.min(0.004, dur / 4);
    var hold = Math.max(t + rise, t + dur - 0.02);
    var osc = a.createOscillator(), gain = a.createGain();
    osc.type = shape || "square";
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(level, t + rise);
    gain.gain.setValueAtTime(level, hold);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain); gain.connect(a.destination);
    osc.start(t); osc.stop(t + dur + 0.01);
    return osc;
  }

  // A tenth of a second of white noise, made once and re-pointed at for every
  // click. Building a fresh buffer per hit would be the same sound and a great
  // deal more garbage.
  var NOISE = null;
  function noise(a) {
    if (NOISE && NOISE.sampleRate === a.sampleRate) return NOISE;
    var n = Math.floor(a.sampleRate * 0.1);
    NOISE = a.createBuffer(1, n, a.sampleRate);
    var d = NOISE.getChannelData(0);
    for (var i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    return NOISE;
  }

  // One contact: noise through a bandpass, falling away at once. `freq` is
  // where the switch rings, `q` how tight that ring is — low Q is a dry tick,
  // high Q starts to find a pitch again and stops being a click. Nothing here
  // goes above Q 2.
  //
  // `spread` detunes the band a little each time, at random. Real switches are
  // not identical and a row of them is not a machine gun; without this, typing
  // eight letters plays the same eight-thousandth of a second eight times and
  // the ear hears a buzzer.
  function hit(freq, q, dur, level, spread) {
    var a = audio();
    if (!a) return;
    var t = a.currentTime;
    var src = a.createBufferSource(), bp = a.createBiquadFilter(), gain = a.createGain();
    src.buffer = noise(a);
    src.loop = true;
    bp.type = "bandpass";
    bp.frequency.setValueAtTime(freq * (1 + (Math.random() - 0.5) * (spread || 0)), t);
    bp.Q.setValueAtTime(q, t);
    gain.gain.setValueAtTime(level, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(bp); bp.connect(gain); gain.connect(a.destination);
    src.start(t); src.stop(t + dur + 0.01);
  }

  function slide(from, to, dur, level, shape) {
    var a = audio();
    if (!a) return;
    var t = a.currentTime;
    var osc = a.createOscillator(), gain = a.createGain();
    osc.type = shape || "square";
    osc.frequency.setValueAtTime(from, t);
    osc.frequency.exponentialRampToValueAtTime(to, t + dur);
    gain.gain.setValueAtTime(level, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain); gain.connect(a.destination);
    osc.start(t); osc.stop(t + dur + 0.01);
  }

  CL.sfx = {
    // A button going down: the loudest of the three, because it is a whole
    // control being pressed, and the lowest, because a big switch rings low.
    click:  function () { hit(1800, 1.1, 0.028, 0.30, 0.10); },
    // A square picked up. Lighter and brighter than a button — nothing has
    // been committed, something has only been chosen.
    tick:   function () { hit(3000, 1.4, 0.018, 0.20, 0.12); },
    // A letter set down. The quietest thing in the game, and the most repeated,
    // so it is given the widest spread: nine of these in a row is a hand
    // typing, not a device beeping.
    key:    function () { hit(2200, 0.9, 0.012, 0.16, 0.22); },
    // With error check off the board says nothing about whether a word is right,
    // and neither may the speakers. This is a question, not a verdict: two notes
    // a whole tone apart, the second quieter — the shape of "is that right?", not
    // the rising fifth of "well done", which is what it used to be and which read
    // as a small win every time a word went down.
    place:  function () { note(392, 0, 0.05, 0.04); note(440, 0.055, 0.06, 0.028); },
    good:   function () { note(659, 0, 0.06, 0.055); note(880, 0.06, 0.06, 0.055); note(1319, 0.12, 0.10, 0.05); },
    bad:    function () { note(180, 0, 0.10, 0.06, "sawtooth"); note(120, 0.11, 0.16, 0.06, "sawtooth"); },
    open:   function () { slide(300, 900, 0.10, 0.04); },        // a window opening
    shut:   function () { slide(900, 300, 0.10, 0.04); },        // and closing
    close:  function () {                                        // the board closes
      [523, 659, 784, 1047].forEach(function (f, i) { note(f, i * 0.09, 0.10, 0.05); });
      note(1568, 0.36, 0.22, 0.045);
    },
    giveup: function () { slide(440, 110, 0.42, 0.05, "triangle"); },
    on: function (v) {
      on = v;
      // The context is thrown away and rebuilt, so the noise goes with it: an
      // AudioBuffer outliving its context is a thing browsers have disagreed
      // about, and this costs a tenth of a second of Math.random to avoid.
      if (v) { ctx = null; NOISE = null; CL.sfx.click(); }
    },
    isOn: function () { return on; }
  };

  // One listener for the whole page: anything that behaves like a control makes
  // the control noise, so no handler anywhere else has to remember to.
  document.addEventListener("click", function (ev) {
    if (!on) return;
    var t = ev.target;
    if (t.closest && t.closest("#sound-toggle")) return;         // it speaks for itself
    if (t.closest && t.closest("button, a, .tile, .cell, .hero")) CL.sfx.click();
    else if (t.closest && t.closest(".noun")) CL.sfx.tick();
  }, true);
})();
