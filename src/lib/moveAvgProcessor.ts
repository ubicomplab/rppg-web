import { BATCHSIZE } from '../constant';
class MovingAvgProcessor {
  constructor() {
    this.sum = 0;
    this.MovingAvg = 0;
    this.dataSet = [];
  }

  reset = () => {
    this.sum = 0;
    this.MovingAvg = 0;
    this.dataSet = [];
  };

  getSum = () => this.sum;

  getMovingAvg = () => this.MovingAvg;

  addData = data => {
    if (this.dataSet.length === BATCHSIZE) {
      this.sum -= this.dataSet.shift();
    }
    this.sum += data;
    this.dataSet.push(data);
    this.MovingAvg = this.sum / this.dataSet.length;
  };
}

export default MovingAvgProcessor;
