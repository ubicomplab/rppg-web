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
  Rank,
  Tensor,
  Tensor3D
} from '@tensorflow/tfjs';
import { BATCHSIZE } from '../constant';
import { PosprocessorInteface } from './posprocessor';
import { TensorStoreInterface } from './tensorStore';

export interface PreprocessorInteface {
  startProcess(): void;
  stopProcess(): void;
}
class Preprocessor implements PreprocessorInteface {
  tensorStore: TensorStoreInterface;

  posprocessor: PosprocessorInteface;

  previousFrame: Tensor<Rank> | null;

  isProcessing: boolean;

  rawBatch: Tensor<Rank>;

  normalizedBatch: Tensor<Rank>;

  constructor(
    tensorStore: TensorStoreInterface,
    posprocessor: PosprocessorInteface
  ) {
    this.tensorStore = tensorStore;
    this.posprocessor = posprocessor;
    this.previousFrame = null;
    this.isProcessing = false;

    this.rawBatch = tensor([]);
    this.normalizedBatch = tensor([]);
  }

  reset = () => {
    dispose(this.rawBatch);
    dispose(this.normalizedBatch);
    if (this.previousFrame) {
      dispose(this.previousFrame);
    }
    this.previousFrame = null;
    this.isProcessing = false;
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
        // const tpre = new Date();
        this.compute(this.previousFrame, frame);
        // console.log('preprocess ', new Date() - tpre);
        dispose(frame);
        this.process();
      }
    }
  };

  compute = (previousFrame: Tensor<Rank> | null, currentFrame: Tensor3D) => {
    const [frame, nNormalize, mNoramlize] = tidy(() => {
      const expandOrigV = currentFrame
        .asType('float32')
        .div(scalar(255))
        .clipByValue(1 / 255, 1)
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
          tempMeanNormalize,
          moments(tempMeanNormalize).variance.sqrt()
        );
        dispose(previousFrame);
        return [expandOrigV, normalizedFrame, meanNormalize];
      }
      return [expandOrigV];
    });

    if (this.rawBatch.shape[0] && mNoramlize && nNormalize) {
      const tempRawBath = tidy(() => concat([this.rawBatch, mNoramlize]));
      dispose(this.rawBatch);
      this.rawBatch = tempRawBath;

      const tempNormalizedBatch = tidy(() =>
        concat([this.normalizedBatch, nNormalize])
      );
      dispose(this.normalizedBatch);
      this.normalizedBatch = tempNormalizedBatch;
    } else if (nNormalize && mNoramlize) {
      const tempRawBath = tidy(() => cast(mNoramlize, 'float32'));
      dispose(this.rawBatch);
      this.rawBatch = tempRawBath;

      const tempNormalized = tidy(() => cast(nNormalize, 'float32'));
      dispose(this.normalizedBatch);
      this.normalizedBatch = tempNormalized;
    }
    if (this.rawBatch.shape[0] === BATCHSIZE) {
      this.posprocessor.compute(this.normalizedBatch, this.rawBatch);
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
