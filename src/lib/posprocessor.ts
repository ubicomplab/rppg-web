import {
  serialization,
  loadLayersModel,
  cumsum,
  LayersModel,
  Tensor,
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
      const rppg = this.model.predict([normalizedBatch, rawBatch]);
      const rppgCumsum = cumsum(rppg).dataSync();
      this.tensorStore.addRppgPltData(rppgCumsum);
    }
    // for (let i = 0; i < BATCHSIZE; i += 1) {
    //   this.rppgData.addData(rppgCumsum[i]);
    //   this.respData.addData(respCumsum[i]);
    // }
    // const now = new Date();
    // this.constructGraphData(
    //   `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
    //   this.rppgData.getMovingAvg()
    // );
  };
}

export default Posprocessor;
