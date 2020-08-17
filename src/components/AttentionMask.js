import * as tf from '@tensorflow/tfjs';

export class AttentionMask extends tf.layers.Layer {
	static className = 'AttentionMask';
	constructor(config) {
		super(config);
	}

	computeOutputShape(inputShape) {
		/* eslint-disable no-console */
		console.log(inputShape)
		console.log(this.name)
		this.inputShape = inputShape;
		return [inputShape[0], inputShape[1], inputShape[2], inputShape[3]];
	}

	// eslint-disable-next-line
	call(inputs, kwargs) {
		/* eslint-disable no-console */
		var input = inputs[0];
		console.log(inputs[0].shape);
		console.log(inputs[0].print(1));
		console.log(input);
		
		var inputSum = tf.sum(input, 1, 1);
		inputSum.print(1);
		inputSum.print(1);
		inputSum = tf.sum(inputSum, 2, 1);
		var out = input.div(inputSum).mul(0.5);
		
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
