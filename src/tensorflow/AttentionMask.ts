import * as tf from '@tensorflow/tfjs';
import { Shape } from '@tensorflow/tfjs';

class AttentionMask extends tf.layers.Layer {
  static className = 'AttentionMask';

  computeOutputShape(inputShape: Shape) {
    return [inputShape[0], inputShape[1], inputShape[2], inputShape[3]];
  }

  call(inputs: any) {
    return tf.tidy(() => {
      const input = inputs[0];
      let inputSum = tf.sum(input, 1, true);
      inputSum = tf.sum(inputSum, 2, true);
      const out = input
        .div(inputSum)
        .mul(input.shape[1])
        .mul(input.shape[2])
        .mul(0.5);

      return out;
    });
  }

  getConfig() {
    const config = super.getConfig();
    return config;
  }

  static getClassName() {
    return 'AttentionMask';
  }
}

export default AttentionMask;
