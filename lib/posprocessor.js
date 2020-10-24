import { serialization, loadLayersModel, cumsum } from '@tensorflow/tfjs';
import CumsumProcessor from './moveAvgProcessor';
import TSM from '../tensorflow/TSM';
import AttentionMask from '../tensorflow/AttentionMask';
import { BATCHSIZE } from '../constant';

const path = 'model.json';

class Posprocessor {
  constructor(tensorStore) {
    this.tensorStore = tensorStore;
    this.rppgData = new CumsumProcessor();
    this.respData = new CumsumProcessor();
    this.model = null;
  }

  reset = () => {
    this.rppgData = new CumsumProcessor();
    this.respData = new CumsumProcessor();
  };

  loadModel = async () => {
    this.isProcessing = true;
    if (this.model === null) {
      serialization.registerClass(TSM);
      serialization.registerClass(AttentionMask);
      this.model = await loadLayersModel(path);
      console.log('model loaded succesfully');
    }
    return true;
  };

  compute = (normalizedBatch, rawBatch) => {
    const [rppg, resp] = this.model.predict([normalizedBatch, rawBatch]);
    const rppgCumsum = cumsum(rppg).dataSync();
    this.tensorStore.addRppgPltData(rppgCumsum);
    // const respCumsum = cumsum(resp).dataSync();
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
