import { cumsum } from '@tensorflow/tfjs';
import TensorStore from './tensorStore';

class PostProcess {
  constructor() {
    this.rppgData = new TensorStore();
    this.respData = new TensorStore();
    this.batchSize = 20;
  }

  getRppg() {
    return this.rppgData;
  }

  getResp() {
    return this.respData;
  }

  compute(prediction) {
    const rppgCumsum = cumsum(prediction[0]).dataSync(); // size 20
    const respCumsum = cumsum(prediction[1]).dataSync(); // size 20

    let i = 0;
    while (i < this.batchSize) {
      this.rppgData.addData(rppgCumsum[i]);
      this.respData.addData(respCumsum[i]);
      i += 1;
    }
  }
}

export default PostProcess;
