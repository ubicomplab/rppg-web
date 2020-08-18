import * as tf from '@tensorflow/tfjs';

export class TSM extends tf.layers.Layer {

	constructor(config) {
		super(config);
	}

	computeOutputShape(inputShape) {
		/* eslint-disable no-console */
		console.log(inputShape);
		return inputShape;
	}

	// eslint-disable-next-line
	call(inputs) {

		var input = inputs[0];
		const n_frame = 20;
		input.print(1);
		/* eslint-disable no-console */
		//console.log(inputs);
		
		console.log("TSM is started execution");
		/* eslint-disable no-console */
		console.log(input.shape);
		let nt, h, w, c;
		let out, out1, out2, out3, empty;
		let padding1, padding2;
		nt = input.shape[0];
		h = input.shape[1];
		w = input.shape[2];
		c = input.shape[3];
		
		const fold_div = 3;
		const fold = Math.floor(c / fold_div);
		const last_fold = c - (fold_div - 1) * fold;
		console.log(fold)
		input = tf.reshape(input, [nt, h, w, c]);
		input = tf.expandDims(input, 0);
		[out1, out2, out3] = tf.split(input, [fold, fold, last_fold], -1)

		// Shift left
		padding1 = tf.zeros([out1.shape[0], 1, out1.shape[2], out1.shape[3], fold]);
		
		console.log(padding1);
		[empty, out1] = tf.split(out1, [1, n_frame - 1], 1);
		console.log(out1);
		console.log(empty);
		out1 = tf.concat([out1, padding1], 1);
		console.log(out1);

		// Shift right
		padding2 = tf.zeros([out2.shape[0], 1, out2.shape[2], out2.shape[3], fold]);
		[out2, empty] = tf.split(out2, [n_frame - 1, 1], 1);
		out2 = tf.concat([padding2, out2], 1);

		out = tf.concat([out1, out2, out3], -1);
		out = tf.reshape(out, [-1, h, w, c]);

		return out;
	}

	getConfig() {
		const config = super.getConfig();
		return config;
	}

	static getClassName() {
		return 'TSM';
	}
	
}

TSM.className = 'TSM'; // static variable
