class TensorStore {
  constructor() {
    this.sum = 0;
    this.MovingAvg = 0;
    this.dataSet = [];
    this.tensors = [];
    this.batchSize = 20;
  }

  getTensor() {
    console.log(this.tensors.length, 'in the queue');
    if (this.tensors.length) {
      return this.tensors.shift();
    }
    return null;
  }

  addTensor(tensor) {
    this.tensors.push(tensor);
  }

  getSum() {
    return this.sum;
  }

  getData() {
    if (this.dataSet.length) {
      return this.dataSet.shift();
    }
    return null;
  }

  getMovingAvg() {
    return this.MovingAvg;
  }

  addData(data) {
    if (this.dataSet.length === this.batchSize) {
      this.sum -= this.getData();
    }
    this.sum += data;
    this.dataSet.push(data);
    this.MovingAvg = this.sum / this.dataSet.length;
  }
}

export default TensorStore;
