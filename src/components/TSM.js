import * as tf from '@tensorflow/tfjs';


export class TSM extends tf.layers.Layer {
	static className = 'TSM';

	constructor(config) {
		super(config);
	}

	computeOutputShape(inputShape) {
		return inputShape;
	}

	// eslint-disable-next-line
	call(input, n_frame, nb_filters, kernel_size, padding, activation) {
		return tf.tidy()(() => {
			/* eslint-disable no-console */
			console.log("TSM is started execution");
			/* eslint-disable no-console */
			console.log(input.shape);
			let nt, h, w, c;
			let out, out1, out2, out3, empty;
			let padding1, padding2;
			const fold_div = 3;
			const fold = Math.floor(c / fold_div);
			const last_fold = c - (fold_div - 1) * fold;
			nt, h, w, c = input.shape;
			input = tf.reshape(input, [n_frame, h, w, c]);
			input = tf.expandDims(input, 0);
			out1, out2, out3 = tf.split(input, [fold, fold, last_fold], -1)

			// Shift left
			padding1 = tf.zerosLike([-1, 1, h, w, fold])
			padding1 = tf.expandDims(padding1, 1)
			empty, out1 = tf.split(out1, [1, n_frame - 1], 1)
			out1 = tf.concat([out1, padding1], 1)

			// shift right
			padding2 = tf.zerosLike([-1, 1, h, w, fold])
			padding2 = tf.expandDims(padding2, 1)
			out2, empty = tf.split(out2, [n_frame - 1, 1], 1)
			out2 = tf.concat([padding2, out2], 1)

			out = tf.concat([out1, out2, out3], -1)
			out = tf.reshape(out, (-1, h, w, c))
			out = tf.layers.conv2D({
				filters: nb_filters,
				kernelSize: kernel_size,
				padding: padding,
				activation: activation
			}).apply(out)

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

TSM.className = 'TSM'; // static variable
