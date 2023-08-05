# harmonic-motion-symphony
A JavaScript and Canvas app, that combines simple pendulum physics with Sound.

It simulates the pendulum motion using a modified [SHM (Simple Harmonic Motion) model](https://en.wikipedia.org/wiki/Simple_harmonic_motion),
that includes  `weight` and `dumping` in the equation.

Each time the Pendulum crosses the middle point (aka the `x` coordinate of the origin) a note is played. This creates interesting possibilities
for music generation.

The goal of the project was to be as minimal as possible, 
hence the use of pure JavaScript with no dependencies, the Web Audio Api, and HTML5 Canvas.

In order to keep the code clean, I separated into es6-modules, which unfortunately means that I needed to add a `build` step, using
`rollup` and `swc`.

In order to run the app, download or `clone` the project, run the commands: 
```
npm install
npm run build
```
, and then, 
open up `index.html` with a web browser of your choice. (The audio might have some glitches when a note finishes on the FireFox browser)

## TODO
- [x] Create a functional prototype
- [ ] Implement a game menu
    - [ ] PLAY
    - [ ] PAUSE
    - [ ] RESET
    - [ ] SETTINGS
- [ ] Add user interactivity
    - [ ] Select a pendulum
    - [ ] Change properties of the pendulum
    - [ ] Add/Remove pendulums
    - [ ] Drag a pendulum while the simulation is running
- [x] Implement the `AudioSource` class:
      - host multiple oscillators,
      - add ADSR envelop
      - add detuning 
