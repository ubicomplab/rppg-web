class TensorStore {
  constructor() {
    this.rawFrames = [];
    this.processedFrames = [];
  }

  getRawTensor() {
    if (this.rawFrames) {
      return this.rawFrames.shift();
    }
    return null;
  }

  addRawTensor(tensor) {
    this.rawFrames.push(tensor);
  }

  addProcessedFrame(processed) {
    this.processedFrames.push(processed);
  }

  getProcessedFrames() {
    if (this.processedFrames) {
      return this.processedFrames.shift();
    }
    return null;
  }
}

export default new TensorStore();
