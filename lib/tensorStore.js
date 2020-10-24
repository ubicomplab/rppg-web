import { dispose } from '@tensorflow/tfjs';
class TensorStore {
  constructor() {
    this.rawFrames = [];
    this.processedFrames = [];
    this.rppgPltData = [];
    this.initialWait = true;
  }

  reset = () => {
    this.rawFrames.forEach(f => {
      dispose(f);
    });
    this.processedFrames.forEach(f => {
      dispose(f);
    });
    this.rawFrames = [];
    this.processedFrames = [];
    this.rppgPltData = [];
  };

  getRawTensor = () => {
    if (this.rawFrames) {
      return this.rawFrames.shift();
    }
    return null;
  };

  getRppgPltData = () => {
    if (this.initialWait && this.rppgPltData.length < 20) {
      return null;
    }
    if (this.rppgPltData.length >= 20) {
      this.initialWait = false;
    }
    if (this.rppgPltData) {
      return this.rppgPltData.shift();
    }
    return null;
  };

  addRppgPltData = data => {
    this.rppgPltData = [...this.rppgPltData, ...data];
  };

  addRawTensor = tensor => {
    this.rawFrames.push(tensor);
  };

  addProcessedFrame(processed) {
    this.processedFrames.push(processed);
  }

  getProcessedFrames = () => {
    if (this.processedFrames.length !== 0) {
      return this.processedFrames.shift();
    }
    return null;
  };

  getProcessedFrameCount = () => this.processedFrames.length;
}

export default new TensorStore();
