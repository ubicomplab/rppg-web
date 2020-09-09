class TensorStore {
  constructor() {
    this.tensors = [];
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
}

export default TensorStore;
