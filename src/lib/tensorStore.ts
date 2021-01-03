import { dispose, Tensor3D, TypedArray } from '@tensorflow/tfjs';

export interface TensorStoreInterface {
  reset(): void;
  getRawTensor(): Tensor3D | null;
  getPltData(): [number, number] | null;
  addRppgPltData(data: TypedArray): void;
  addRespPltData(data: TypedArray): void;
  addRawTensor(data: Tensor3D): void;
  addDebugData(normalizedBatch: number[], rawBatch: number[]): void;
  addDebugPredData(predBatch: number[], predCumsumBatch: number[]): void;
}

class TensorStore implements TensorStoreInterface {
  rawFrames: Tensor3D[];

  rppgPltData: number[];

  respPltData: number[];

  dumpData: number[][];

  dumpNormalizedData: number[][];

  dumpRawData: number[][];

  dumpPred: number[][];

  dumpPredCumsum: number[][];

  initialWait: boolean;

  constructor() {
    this.rawFrames = [];
    this.rppgPltData = [];
    this.respPltData = [];
    this.dumpData = [];
    this.dumpNormalizedData = [];
    this.dumpRawData = [];
    this.dumpPred = [];
    this.dumpPredCumsum = [];
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
      if (tensor) {
        this.dumpData.push(Array.from(tensor.dataSync()));
      }
      return tensor;
    }
    return null;
  };

  getPltData = () => {
    if (this.initialWait && this.rppgPltData.length < 20) {
      return null;
    }
    if (this.rppgPltData.length >= 20) {
      this.initialWait = false;
    }
    if (this.rppgPltData && this.respPltData) {
      const data: [number, number] = [
        this.rppgPltData.shift() as number,
        this.respPltData.shift() as number
      ];
      return data;
    }
    return null;
  };

  addRppgPltData = (data: TypedArray) => {
    this.rppgPltData = [...this.rppgPltData, ...data];
  };

  addRespPltData = (data: TypedArray) => {
    this.respPltData = [...this.respPltData, ...data];
  };

  addRawTensor = (tensor: Tensor3D) => {
    this.rawFrames.push(tensor);
  };

  addDebugData = (normalizedBatch: number[], rawBatch: number[]) => {
    this.dumpNormalizedData.push(normalizedBatch);
    this.dumpRawData.push(rawBatch);
  };

  addDebugPredData = (predBatch: number[], predCumsumBatch: number[]) => {
    this.dumpPred.push(predBatch);
    this.dumpPredCumsum.push(predCumsumBatch);
  };

}

export default new TensorStore();
