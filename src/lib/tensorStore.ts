import { dispose, Tensor3D, TypedArray } from '@tensorflow/tfjs';

export interface TensorStoreInterface {
  reset(): void;
  getRawTensor(): Tensor3D | null;
  addRppgPltData(data: TypedArray): void;
  addRawTensor(data: Tensor3D): void;
}

class TensorStore implements TensorStoreInterface {
  rawFrames: Tensor3D[];

  rppgPltData: number[];

  initialWait: boolean;

  constructor() {
    this.rawFrames = [];
    this.rppgPltData = [];
    this.initialWait = true;
  }

  reset = () => {
    this.rawFrames.forEach(f => {
      dispose(f);
    });
    this.rawFrames = [];
    this.rppgPltData = [];
    this.initialWait = true;
  };

  getRawTensor = () => {
    if (this.rawFrames) {
      const tensor = this.rawFrames.shift() || null;
      return tensor;
    }
    return null;
  };

  addRppgPltData = (data: TypedArray) => {
    this.rppgPltData = [...this.rppgPltData, ...data];
  };

  addRawTensor = (tensor: Tensor3D) => {
    this.rawFrames.push(tensor);
  };
}

export default new TensorStore();
