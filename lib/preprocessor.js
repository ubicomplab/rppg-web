import {
  tidy,
  dispose,
  tensor,
  scalar,
  div,
  sub,
  add,
  moments,
  concat,
  cast,
  mean,
  clone
} from '@tensorflow/tfjs';
import { BATCHSIZE } from '../constant';

class Preprocessor {
  constructor(tensorStore) {
    this.tensorStore = tensorStore;
    this.previousFrame = null;
    this.isProcessing = false;

    this.rawBatch = tensor([]);
    this.normalizedBatch = tensor([]);
  }

  reset = () => {
    this.previousFrame = null;
    this.isProcessing = false;

    dispose(this.rawBatch);
    dispose(this.normalizedBatch);
    dispose(this.previousFrame);
    this.rawBatch = tensor([]);
    this.normalizedBatch = tensor([]);
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
        }, 30);
      } else {
        this.compute(this.previousFrame, frame);
        dispose(frame);
        this.process();
      }
    }
  };

  compute = (previousFrame, currentFrame) => {
    const [frame, nNormalize, mNoramlize] = tidy(() => {
      const expandOrigV = currentFrame
        .asType('float32')
        .div(scalar(255))
        .expandDims(0);
      if (previousFrame) {
        const tempNormalizedFrame = div(
          sub(expandOrigV, previousFrame),
          add(expandOrigV, previousFrame)
        );
        const normalizedFrame = div(
          tempNormalizedFrame,
          moments(tempNormalizedFrame).variance.sqrt()
        );

        const tempMeanNormalize = sub(expandOrigV, mean(expandOrigV));
        const meanNormalize = div(
          expandOrigV,
          moments(tempMeanNormalize).variance.sqrt()
        );
        dispose(this.previousFrame);
        return [expandOrigV, normalizedFrame, meanNormalize];
      }
      return [expandOrigV];
    });

    if (this.rawBatch.shape[0]) {
      const tempRawBath = tidy(() => concat([this.rawBatch, mNoramlize]));
      dispose(this.rawBatch);
      this.rawBatch = tempRawBath;

      const tempNormalizedBatch = tidy(() =>
        concat([this.normalizedBatch, nNormalize])
      );
      dispose(this.normalizedBatch);
      this.normalizedBatch = tempNormalizedBatch;
    } else if (nNormalize) {
      const tempRawBath = tidy(() => cast(mNoramlize, 'float32'));
      dispose(this.rawBatch);
      this.rawBatch = tempRawBath;

      const tempNormalized = tidy(() => cast(nNormalize, 'float32'));
      dispose(this.normalizedBatch);
      this.normalizedBatch = tempNormalized;
    }
    if (this.rawBatch.shape[0] === BATCHSIZE) {
      this.tensorStore.addProcessedFrame({
        normalizedBatch: clone(this.normalizedBatch),
        rawBatch: clone(this.rawBatch)
      });
      dispose(this.rawBatch);
      dispose(this.normalizedBatch);
      this.rawBatch = tensor([]);
      this.normalizedBatch = tensor([]);
    }
    dispose(nNormalize);
    dispose(mNoramlize);
    this.previousFrame = frame;
  };
}

export default Preprocessor;
