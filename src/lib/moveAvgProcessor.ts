import { BATCHSIZE } from '../constant';
export interface MovingAvgProcessorInteface {
  addData(data: number): void;
  getSum(): number;
  getMovingAvg(): number;
  reset(): void;
}

class MovingAvgProcessor implements MovingAvgProcessorInteface {
  sum: number;

  movingAvg: number;

  dataSet: number[];

  constructor() {
    this.sum = 0;
    this.movingAvg = 0;
    this.dataSet = [];
  }

  reset = () => {
    this.sum = 0;
    this.movingAvg = 0;
    this.dataSet = [];
  };

  getSum = () => this.sum;

  getMovingAvg = () => this.movingAvg;

  addData = (data: number) => {
    if (this.dataSet.length === BATCHSIZE) {
      this.sum -= this.dataSet.shift() || 0;
    }
    this.sum += data;
    this.dataSet.push(data);
    this.movingAvg = this.sum / this.dataSet.length;
  };
}

export default MovingAvgProcessor;
