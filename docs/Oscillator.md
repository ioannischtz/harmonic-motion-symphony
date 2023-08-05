# Oscillator class

| properties                                                                                                                                                                              |             |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **public**                                                                                                                                                                              | **private** |
| <pre>gameCtx : { <br> canvasCtx,<br> audioCtx,<br> originPoint,<br> simCoeffs : { gAccel, dumping }<br> incrActiveSoundsCounterCallback<br> decrActiveSoundsCounterCallback<br>} </pre> | \_isStopped |
| <pre> oscillatorParams: {<br> type, gain, baseFreq, adsr: [a,d,s,r], detune<br> }                                                                                                       |             |
| oscNode                                                                                                                                                                                 |             |
| gainNode                                                                                                                                                                                |             |

| methods    |             |
| ---------- | ----------- |
| **public** | **private** |
| playNote   |             |
| stop       |             |
