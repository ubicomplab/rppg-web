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

    tf.dispose(this.rawBatch);
    tf.dispose(this.normalizedBatch);
    tf.dispose(this.previousFrame);
    this.rawBatch = tf.tensor([]);
    this.normalizedBatch = tf.tensor([]);
  };

  startProcess = () => {
    this.isProcessing = true;
    this.process();
  };

  stopProcess = () => {
    this.isProcessing = false;
    this.reset();
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
    const [frame, nNormalize, mNoramlize] = tf.tidy(() => {
      const expandOrigV = currentFrame
        .asType('float32')
        .div(tf.scalar(255))
        .expandDims(0);
      if (previousFrame) {
        const tempNormalizedFrame = tf.div(
          tf.sub(expandOrigV, previousFrame),
          tf.add(expandOrigV, previousFrame)
        );
        const normalizedFrame = tf.div(
          tempNormalizedFrame,
          tf.moments(tempNormalizedFrame).variance.sqrt()
        );

        const tempMeanNormalize = tf.sub(expandOrigV, tf.mean(expandOrigV));
        const meanNormalize = tf.div(
          tempMeanNormalize,
          tf.moments(tempMeanNormalize).variance.sqrt()
        );
        tf.dispose(this.previousFrame);
        return [expandOrigV, normalizedFrame, meanNormalize];
      }
      return [expandOrigV];
    });

    if (this.rawBatch.shape[0]) {
      const tempRawBath = tf.tidy(() => tf.concat([this.rawBatch, mNoramlize]));
      tf.dispose(this.rawBatch);
      this.rawBatch = tempRawBath;

      // const tempNormalizedBatch = tf.tidy(() =>
      //   tf.concat([this.normalizedBatch, nNormalize])
      // );
      // tf.dispose(this.normalizedBatch);
      // this.normalizedBatch = tempNormalizedBatch;
    } else if (nNormalize) {
      const tempRawBath = tf.tidy(() => tf.cast(frame, 'float32'));
      tf.dispose(this.rawBatch);
      this.rawBatch = tempRawBath;

      const tempNormalized = tf.tidy(() =>
        tf.cast(tf.clone(nNormalize), 'float32')
      );
      tf.dispose(this.normalizedBatch);
      this.normalizedBatch = tempNormalized;
    }
    if (this.rawBatch.shape[0] === BATCHSIZE) {
      // this.tensorStore.addProcessedFrame({
      //   normalizedBatch: tf.clone(this.normalizedBatch),
      //   rawBatch: tf.clone(this.rawBatch)
      // });
      tf.dispose(this.rawBatch);
      tf.dispose(this.normalizedBatch);
      this.rawBatch = tf.tensor([]);
      this.normalizedBatch = tf.tensor([]);
    }
    tf.dispose(nNormalize);
    tf.dispose(mNoramlize);
    this.previousFrame = frame;
    console.log(tf.memory().numTensors);
  };
}

export default Preprocessor;
