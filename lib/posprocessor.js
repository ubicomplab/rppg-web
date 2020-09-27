import * as tf from '@tensorflow/tfjs';
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
  };

  process = async () => {
    if (this.isProcessing) {
      const result = this.tensorStore.getProcessedFrames();
      if (!result) {
        setTimeout(() => {
          this.process();
        }, 500);
      } else {
        await this.compute(result);
        this.process();
      }
    }
  };

  compute = throttle(async input => {
    const { normalizedBatch, rawBatch } = input;
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
    tf.dispose(normalizedBatch);
    tf.dispose(rawBatch);
  }, 200);
}

export default Posprocessor;
