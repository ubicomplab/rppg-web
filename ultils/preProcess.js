import * as tf from '@tensorflow/tfjs';

class PreProcess {
  constructor() {
    this.rawBatch = [];
    this.diffBatch = [];
    this.prevFrame = null;
    this.counter = 0;
  }

  compute(origV) {
    let Xsub = origV.asType('float32').div(tf.scalar(255));
    Xsub = Xsub.expandDims(0); // (1, 36, 36, 3)

    if (this.prevFrame != null) {
      // FRAME DIFF:
      let dXsub = tf.div(
        tf.sub(Xsub, this.prevFrame),
        tf.add(Xsub, this.prevFrame)
      );
      let Xsub2 = tf.sub(Xsub, tf.mean(Xsub)); // Xsub = Xsub - Xsub.mean(axis = 0)

      // SUBTRACT MEAN OF IMG:
      dXsub = tf.div(dXsub, tf.moments(dXsub).variance.sqrt()); // dxsub / np.std(dxsub,ddof=1)
      Xsub2 = tf.div(Xsub2, tf.moments(Xsub2).variance.sqrt()); // Xsub = Xsub - Xsub.mean(axis = 0

      if (this.rawBatch.length === 0) {
        console.log('here cast');
        this.rawBatch = tf.cast(Xsub, 'float32');
        this.diffBatch = tf.cast(dXsub, 'float32');
      } else {
        this.rawBatch = tf.concat([this.rawBatch, Xsub2]);
        this.diffBatch = tf.concat([this.diffBatch, dXsub]);
      }
      this.counter += 1;
    }
    this.prevFrame = Xsub;
  }

  getBatch() {
    return [this.diffBatch, this.rawBatch];
  }

  getCounter() {
    return this.counter;
  }

  clear() {
    this.rawBatch = [];
    this.diffBatch = [];
    this.counter = 0;
  }
}

export default PreProcess;
