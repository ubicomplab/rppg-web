import * as tf from '@tensorflow/tfjs';

class PreProcess {
  constructor() {
    this.rawBatch = [];
    this.diffBatch = [];
    this.prevFrame = null;
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
        this.rawBatchData = tf.cast(Xsub, 'float32');
        this.diffBatchData = tf.cast(dXsub, 'float32');
      } else {
        this.rawBatch.concat(Xsub2);
        this.diffBatch.concat(dXsub);
      }
    }
    this.prevFrame = Xsub;
  }

  getRawBatch() {
    return this.rawBatch;
  }

  getDiffBatch() {
    return this.diffBatch;
  }
}

export default PreProcess;
