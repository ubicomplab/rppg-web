import { dispose } from '@tensorflow/tfjs';
import { throttle } from 'lodash';
import CumsumProcessor from './moveAvgProcessor';
// import TSM from '../tensorflow/TSM';
// import AttentionMask from '../tensorflow/AttentionMask';
// import { BATCHSIZE } from '../constant';

// const path = '../public/model.json';

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

  startProcess = async () => {
    this.isProcessing = true;
    // if (this.model === null) {
    //   tf.serialization.registerClass(TSM);
    //   tf.serialization.registerClass(AttentionMask);
    //   await tf.loadLayersModel(path);
    // }
    this.process();
  };

  stopProcess = () => {
    this.isProcessing = false;
    this.reset();
  };

  process = async () => {
    if (this.isProcessing) {
      if (!this.tensorStore.getProcessedFrameCount()) {
        setTimeout(() => {
          this.process();
        }, 500);
      } else {
        await this.compute();
        this.process();
      }
    }
  };

  compute = throttle(async () => {
    const { normalizedBatch, rawBatch } = this.tensorStore.getProcessedFrames();
    // console.log(normalizedBatch, rawBatch);
    await new Promise(resolve => {
      setTimeout(() => resolve(), 30);
    });
    // const [rppg, resp] = await this.model.predict([normalizedBatch, rawBatch]);
    // const rppgCumsum = tf.cumsum(rppg).dataSync();
    // const respCumsum = tf.cumsum(resp).dataSync();
    // for (let i = 0; i < BATCHSIZE; i += 1) {
    //   this.rppgData.addData(rppgCumsum[i]);
    //   this.respData.addData(respCumsum[i]);
    // }
    dispose(normalizedBatch);
    dispose(rawBatch);
  }, 200);
}

export default Posprocessor;
