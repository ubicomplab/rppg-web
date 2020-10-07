import { dispose } from '@tensorflow/tfjs';
class TensorStore {
  constructor() {
    this.rawFrames = [];
    this.processedFrames = [];
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
  };

  getRawTensor = () => {
    if (this.rawFrames) {
      return this.rawFrames.shift();
    }
    return null;
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
