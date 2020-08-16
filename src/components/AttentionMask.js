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
		var k = inputShape.slice(0, 3);
		/* eslint-disable no-console */
		console.log(k[1], 1)
		return [k[0], k[1], k[2], 1];
	}

	// eslint-disable-next-line
	call(inputs, kwargs) {
		/* eslint-disable no-console */
	//	console.log(this.inputShape)
		console.log(this.name)
		console.log(inputs);
		var input = inputs;
		
		/* eslint-disable no-console */
		//this.invokeCallHook(inputs, kwargs);
		var inputSum = tf.sum(input, 1, 1);
		/* eslint-disable no-console */
		inputSum.print(1);
		inputSum = tf.sum(inputSum, 2, 1);
		/* eslint-disable no-console */
		console.log("inside call");
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
