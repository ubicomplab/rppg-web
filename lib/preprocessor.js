import * as tf from '@tensorflow/tfjs';
import { BATCHSIZE } from '../constant';

class Preprocessor {
  constructor(tensorStore) {
    this.tensorStore = tensorStore;
    this.previousFrame = null;
    this.isProcessing = false;

    this.rawBatch = tf.tensor([]);
    this.normalizedBatch = tf.tensor([]);
  }

  reset = () => {
    this.previousFrame = null;
    this.isProcessing = false;

    this.rawBatch = tf.tensor([]);
    this.normalizedBatch = tf.tensor([]);
  };

  startProcess = () => {
    this.isProcessing = true;
    this.process();
  };

  stopProcess = () => {
    this.isProcessing = false;
  };

  process = () => {
    if (this.isProcessing) {
      const frame = this.tensorStore.getRawTensor();
      if (!frame) {
        setTimeout(() => {
          this.process();
        }, 500);
      } else {
        this.compute(this.previousFrame, frame);
        this.process();
        tf.dispose(frame);
      }
    }
  };

  compute = (previousFrame, currentFrame) => {
    const expandOrigV = currentFrame
      .asType('float32')
      .div(tf.scalar(255))
      .expandDims(0);
    if (previousFrame) {
      let normalizedFrame = tf.div(
        tf.sub(expandOrigV, previousFrame),
        tf.add(expandOrigV, previousFrame)
      );
      let meanNormalize = tf.sub(expandOrigV, tf.mean(expandOrigV));
      normalizedFrame = tf.div(
        normalizedFrame,
        tf.moments(normalizedFrame).variance.sqrt()
      );
      meanNormalize = tf.div(
        meanNormalize,
        tf.moments(meanNormalize).variance.sqrt()
      );
      if (this.rawBatch.shape[0]) {
        this.rawBatch = tf.concat([this.rawBatch, meanNormalize]);
        this.normalizedBatch = tf.concat([
          this.normalizedBatch,
          normalizedFrame
        ]);
      } else {
        this.rawBatch = tf.cast(expandOrigV, 'float32');
        this.normalizedBatch = tf.cast(normalizedFrame, 'float32');
      }
      if (this.rawBatch.shape[0] === BATCHSIZE) {
        this.tensorStore.addProcessedFrame({
          normalizedBatch: tf.clone(this.normalizedBatch),
          rawBatch: tf.clone(this.rawBatch)
        });
        this.rawBatch = tf.tensor([]);
        this.normalizedBatch = tf.tensor([]);
      }
    }
    this.previousFrame = expandOrigV;
  };
}

export default Preprocessor;
