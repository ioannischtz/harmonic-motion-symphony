# Pendulum class

| properties                                                                                                                                                                              |                   |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| **public**                                                                                                                                                                              | **private**       |
| <pre>gameCtx : { <br> canvasCtx,<br> audioCtx,<br> originPoint,<br> simCoeffs : { gAccel, dumping }<br> incrActiveSoundsCounterCallback<br> decrActiveSoundsCounterCallback<br>} </pre> | \_prevX           |
| coords = { x, y }                                                                                                                                                                       | \_angularVelocity |
| weight                                                                                                                                                                                  |                   |
| radius                                                                                                                                                                                  |                   |
| length                                                                                                                                                                                  |                   |
| angle                                                                                                                                                                                   |                   |
| audioSource                                                                                                                                                                             |                   |
| <pre>audioSourceParams = [<br> oscillatorParams: {<br> type, gain, baseFreq, adsr: [a,d,s,r], detune<br> } <br>]                                                                        |                   |

| methods    |                 |
| ---------- | --------------- |
| **public** | **private**     |
| update     |                 |
| render     |                 |
|            | \_calcLength    |
|            | \_calcInitAngle |
