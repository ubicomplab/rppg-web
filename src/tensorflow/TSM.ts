import { tidy, reshape, split, zeros, concat, layers } from '@tensorflow/tfjs';

class TSM extends layers.Layer {
  static className = 'TSM';

  call(inputs: any) {
    return tidy(() => {
      // Initialization
      let input = inputs[0];
      let out1;
      let out2;
      let out3;
      let empty;
      let out;
      const nt = input.shape[0]; // batch_size;
      const h = input.shape[1];
      const w = input.shape[2];
      const c = input.shape[3];

      const foldDiv = 3;
      const fold = Math.floor(c / foldDiv);
      const lastFold = c - (foldDiv - 1) * fold;
      input = reshape(input, [-1, nt, h, w, c]);
      [out1, out2, out3] = split(input, [fold, fold, lastFold], -1);

      // Shift left
      const padding1 = zeros([
        out1.shape[0],
        1,
        out1.shape[2],
        out1.shape[3],
        fold
      ]);
      [empty, out1] = split(out1, [1, nt - 1], 1);
      out1 = concat([out1, padding1], 1);

      // Shift right
      const padding2 = zeros([
        out2.shape[0],
        1,
        out2.shape[2],
        out2.shape[3],
        fold
      ]);

      [out2, empty] = split(out2, [nt - 1, 1], 1);
      out2 = concat([padding2, out2], 1);
      out = concat([out1, out2, out3], -1);
      out = reshape(out, [-1, h, w, c]);
      out3 = empty;
      return out;
    });
  }

  getConfig() {
    const config = super.getConfig();
    return config;
  }

  static getClassName() {
    return 'TSM';
  }
}

export default TSM;
