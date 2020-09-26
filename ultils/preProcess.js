import * as tf from '@tensorflow/tfjs';

class PreProcess {
  constructor() {
    // this.rawBatch stores the processed Batch based on the original frame
    this.rawBatch = [];
    // this.normalizedBatch stores the processed Batch based on the original fram
    this.normalizedBatch = [];
    this.prevFrame = null;
    this.counter = 0;
  }

  compute(origV) {
    const time = new Date();
    // expandOrigV takes original frame data and scale it to [0, 1], and expand dimension
    const expandOrigV = origV
      .asType('float32')
      .div(tf.scalar(255))
      .expandDims(0); // (1, 36, 36, 3)

    if (this.prevFrame != null) {
      // Normalized frame = (F[t+1] - F[t]) / (F[t+1] + F[t])
      let normalizedFrame = tf.div(
        tf.sub(expandOrigV, this.prevFrame),
        tf.add(expandOrigV, this.prevFrame)
      );

      // meanNormalize = F[t] - mean(F)
      let meanNormalize = tf.sub(expandOrigV, tf.mean(expandOrigV));

      // SUBTRACT MEAN OF IMG:
      normalizedFrame = tf.div(
        normalizedFrame,
        tf.moments(normalizedFrame).variance.sqrt()
      );
      meanNormalize = tf.div(
        meanNormalize,
        tf.moments(meanNormalize).variance.sqrt()
      );

      if (this.rawBatch.length === 0) {
        this.rawBatch = tf.cast(expandOrigV, 'float32');
        this.normalizedBatch = tf.cast(normalizedFrame, 'float32');
      } else {
        this.rawBatch = tf.concat([this.rawBatch, meanNormalize]);
        this.normalizedBatch = tf.concat([
          this.normalizedBatch,
          normalizedFrame
        ]);
      }
      this.counter += 1;
    }
    this.prevFrame = expandOrigV;
    console.log(new Date() - time);
  }

  getBatch() {
    return [this.normalizedBatch, this.rawBatch];
  }

  getCounter() {
    return this.counter;
  }

  clear() {
    this.rawBatch = [];
    this.normalizedBatch = [];
    this.counter = 0;
  }
}

export default PreProcess;
