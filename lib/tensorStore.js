import { dispose } from '@tensorflow/tfjs';
class TensorStore {
  constructor() {
    this.rawFrames = [];
    this.processedFrames = [];
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
    // console.log(this.rawFrames.length, 'In raw queue');
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
    // console.log(this.processedFrames.length, 'In Processed queue');
    if (this.processedFrames) {
      return this.processedFrames.shift();
    }
    return null;
  };

  getProcessedFrameCount = () => this.processedFrames.length;
}

export default new TensorStore();