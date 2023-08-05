# Game class

| properties                      |                     |
| ------------------------------- | ------------------- |
| **public**                      | **private**         |
| canvas                          | \_nActiveSounds     |
| canvasCtx                       | \_nActiveSoundsLock |
| canvasW                         |                     |
| canvasH                         |                     |
| audioCtx                        |                     |
| fpsCap                          |                     |
| pendulums                       |                     |
| selectedPendulum                |                     |
| simCoeffs = { gAccel, dumping } |                     |
| originPoint = { x, y }          |                     |

| methods        |                         |
| -------------- | ----------------------- |
| **public**     | **private**             |
| addPendulum    | \_update                |
| play           | \_render                |
| pause          | \_loop                  |
| reset          | \_incrementActiveSounds |
| settings       | \_decrementActiveSounds |
| selectPendulum |                         |
