import {
  dispose,
  serialization,
  loadLayersModel,
  cumsum
} from '@tensorflow/tfjs';
import { throttle } from 'lodash';
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
    this.computeCb = null;

    this.labels = [];
    this.dataPoints = [];
  }

  reset = () => {
    this.rppgData = new CumsumProcessor();
    this.respData = new CumsumProcessor();
    this.labels = [];
    this.dataPoints = [];
    this.computeCb([], []);
    this.computeCb = null;
  };

  startProcess = async cb => {
    this.isProcessing = true;
    this.computeCb = cb;
    if (this.model === null) {
      serialization.registerClass(TSM);
      serialization.registerClass(AttentionMask);
      this.model = await loadLayersModel(path);
      console.log('model loaded succesfully');
    }
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
    const [rppg, resp] = await this.model.predict([normalizedBatch, rawBatch]);
    const rppgCumsum = cumsum(rppg).dataSync();
    const respCumsum = cumsum(resp).dataSync();
    for (let i = 0; i < BATCHSIZE; i += 1) {
      this.rppgData.addData(rppgCumsum[i]);
      this.respData.addData(respCumsum[i]);
    }
    dispose(normalizedBatch);
    dispose(rawBatch);
    const now = new Date();
    this.constructGraphData(
      `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
      Math.floor(Math.random() * 10) + 60
    );
  }, 200);

  constructGraphData = (label, data) => {
    const newLabels = [...this.labels, label];
    if (newLabels.length > 20) {
      newLabels.shift();
    }
    const newData = [...this.dataPoints, data];
    if (newData.length > 20) {
      newData.shift();
    }
    this.labels = newLabels;
    this.dataPoints = newData;
    if (this.computeCb) {
      this.computeCb(newLabels, newData);
    }
  };
}

export default Posprocessor;
