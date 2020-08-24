import * as tf from '@tensorflow/tfjs';

export class AttentionMask extends tf.layers.Layer {
	static className = 'AttentionMask';
	constructor(config) {
		super(config);
	}

	computeOutputShape(inputShape) {
		/* eslint-disable no-console */
		this.inputShape = inputShape;
		return [inputShape[0], inputShape[1], inputShape[2], inputShape[3]];
	}

	// eslint-disable-next-line
	call(inputs, kwargs) {
		/* eslint-disable no-console */
		var input = inputs[0];
		var inputSum = tf.sum(input, 1, true);

		inputSum = tf.sum(inputSum, 2, true);
		var out = input.div(inputSum).mul(input.shape[1]).mul(input.shape[2]).mul(0.5);
			
		return out;
	}

	getConfig() {
		const config = super.getConfig();
		return config;
	}

	static getClassName() {
		return 'AttentionMask';
	}
}

AttentionMask.className = 'AttentionMask'; // static variable
