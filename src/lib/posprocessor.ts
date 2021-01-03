import {
  serialization,
  loadLayersModel,
  cumsum,
  LayersModel,
  Tensor,
  mean,
  sub,
  reshape,
  Rank
} from '@tensorflow/tfjs';
import MovingAvgProcessor, {
  MovingAvgProcessorInteface
} from './moveAvgProcessor';
import TSM from '../tensorflow/TSM';
import AttentionMask from '../tensorflow/AttentionMask';
import { BATCHSIZE } from '../constant';
import { TensorStoreInterface } from './tensorStore';

const path = 'model.json';

export interface PosprocessorInteface {
  compute(normalizedBatch: Tensor<Rank>, rawBatch: Tensor<Rank>): void;
}

class Posprocessor implements PosprocessorInteface {
  tensorStore: TensorStoreInterface;

  rppgAvgProcessor: MovingAvgProcessorInteface;

  respAvgProcessor: MovingAvgProcessor;

  model: LayersModel | null;

  constructor(tensorStore: TensorStoreInterface) {
    this.tensorStore = tensorStore;
    this.rppgAvgProcessor = new MovingAvgProcessor();
    this.respAvgProcessor = new MovingAvgProcessor();
    this.model = null;
  }

  reset = () => {
    this.rppgAvgProcessor.reset();
    this.respAvgProcessor.reset();
  };

  loadModel = async () => {
    if (this.model === null) {
      serialization.registerClass(TSM);
      serialization.registerClass(AttentionMask);
      this.model = await loadLayersModel(path);
      console.log('model loaded succesfully');
    }
    return true;
  };

  compute = (normalizedBatch: Tensor<Rank>, rawBatch: Tensor<Rank>) => {
    if (this.model) {
      this.tensorStore.addDebugData(
        Array.from(normalizedBatch.dataSync()),
        Array.from(rawBatch.dataSync())
      );
      const rppg = this.model.predict([normalizedBatch, rawBatch]) as Tensor<
        Rank
      >;
      const rppgCumsum = cumsum(reshape(rppg,[-1, 1]), 0);
      // const rppgCumsum = cumsum(rppg);
      // const rppg_detrended = sub(rppgCumsum, mean(rppgCumsum)).dataSync();
      // const filerted_data = sub(rppg_detrended, mean(rppg_detrended)).dataSync();
      this.tensorStore.addRppgPltData(rppgCumsum.dataSync());
      this.tensorStore.addDebugPredData(
        Array.from(rppg.dataSync()),
        Array.from(rppgCumsum.dataSync())
      );
    }
  };
}

export default Posprocessor;
