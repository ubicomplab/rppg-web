class TensorStore {
  constructor() {
    this.rawFrames = [];
    this.processedFrames = [];
  }

  getRawTensor() {
    if (this.rawFrames.length) {
      return this.rawFrames.shift();
    }
    return null;
  }

  addRawTensor(tensor) {
    this.rawFrames.push(tensor);
  }

  addProcessedFrame(processed) {
    this.processedFrames.push(processed);
    console.log(this.processedFrames);
  }

  // getProcessedFrames() {
  //   return this.buffer;
  // }
}

export default new TensorStore();
