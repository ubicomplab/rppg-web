import * as vis from 'vis-timeline/standalone';
import * as tf from '@tensorflow/tfjs';
import {
	AttentionMask
} from './AttentionMask.js';
import {
	TSM
} from './TSM.js';

export default function run() {
	let video = document.getElementById('video');
	var path = "./model.json";
	var orig_v, prevFrame;
	var movingAvg_rppg = [];
	var movingAvg_resp = [];
	var buffer_rppg = [];
	var buffer_resp = [];
	var diffBatch, Batch;
	var delay = 10;
	const batch_size = 20;
	var batch_counter = 0;
	var dim = 36;
	var prediction;
	let model;
	let prediction_rppg, prediction_resp;
	var buffer_size = 2 * batch_size;

	// Register Cusomized Layers
	tf.serialization.registerClass(TSM);
	tf.serialization.registerClass(AttentionMask);

	// Load ML Model
	loadModel();
	startVideo();

	// Definition for the line chart 
	var container_rppg = document.getElementById("chart_rppg");
	var container_resp = document.getElementById("chart_resp");
	var dataset_rppg = new vis.DataSet();
	var dataset_resp = new vis.DataSet();
	var now = vis.moment();

	var options_rppg = {
		drawPoints: false,
		dataAxis: {
			visible: true,
			left: {
				title: {
					text: "Normalized  rppg",
				}
			}
		},
		rollingMode: {
			follow: true,
			offset: 0.75
		},
		start: vis.moment().add(-1, "seconds"), // display start,  end
		end: vis.moment().add(30, "seconds"),
	};

	var options_resp = {
		drawPoints: false,
		dataAxis: {
			visible: true,
			left: {
				title: {
					text: "Normalized resp",
				}
			}
		},
		rollingMode: {
			follow: true,
			offset: 0.75
		},
		start: vis.moment().add(-1, "seconds"), // display start,  end
		end: vis.moment().add(30, "seconds"),
	};

	// eslint-disable-next-line
	var graph2d_rppg = new vis.Graph2d(container_rppg, dataset_rppg, options_rppg);
	var graph2d_resp = new vis.Graph2d(container_resp, dataset_resp, options_resp);

	async function loadModel() {
		model = await tf.loadLayersModel(path);
		/* eslint-disable no-console */
		console.log("Successfully loaded ml model");
	}

	function loop() {
		orig_v = tf.browser.fromPixels(video); // update Frame
		preprocess();

		// Start ploting once 40 prediction results stored
		if (movingAvg_resp.length >= buffer_size) {

			addDataPoint(movingAvg_rppg[0], movingAvg_resp[0]);
			movingAvg_resp.shift();
			movingAvg_rppg.shift();
			buffer_size--;

			if (buffer_size <= 0) {
				buffer_size = movingAvg_resp.length;
			}
		}
	}

	// Preprocess a frame of video, and once Batch and diffBatch hit 20, 
	//   do prediction
	async function preprocess() {

		var Xsub = tf.image.resizeBilinear(orig_v, [dim, dim]);
		Xsub = Xsub.asType('float32').div(tf.scalar(255));
		Xsub = Xsub.expandDims(0); // (1, 36, 36, 3)

		if (prevFrame == null) {
			prevFrame = Xsub;
		} else {

			// FRAME DIFF:
			var dXsub = tf.div(tf.sub(Xsub, prevFrame), tf.add(Xsub, prevFrame));
			var Xsub2 = tf.sub(Xsub, tf.mean(Xsub)); // Xsub = Xsub - Xsub.mean(axis = 0)

			// SUBTRACT MEAN OF IMG:
			dXsub = tf.div(dXsub, tf.moments(dXsub).variance.sqrt()); // dxsub / np.std(dxsub,ddof=1)
			Xsub2 = tf.div(Xsub, tf.moments(Xsub2).variance.sqrt()); // Xsub = Xsub - Xsub.mean(axis = 0)

			prevFrame = Xsub;

			if (batch_counter == 0) {
				Batch = tf.cast(Xsub2, 'float32');
				diffBatch = dXsub;
			} else {
				Batch = tf.concat([Batch, Xsub2]);
				diffBatch = tf.concat([diffBatch, dXsub]);
			}

			batch_counter++;
		}

		if (batch_counter == batch_size) {

			// Prediction
			prediction = await model.predict([diffBatch, Batch]);

			// Post Process
			prediction_rppg = prediction[0].cumsum().arraySync(); // size 20
			prediction_resp = prediction[1].cumsum().arraySync(); // size 20		

			prediction_rppg = postProcess(prediction_rppg, buffer_rppg);
			prediction_resp = postProcess(prediction_resp, buffer_resp);

			// Update the array used to store result 
			movingAvg_resp = movingAvg_resp.concat(prediction_resp);
			movingAvg_rppg = movingAvg_rppg.concat(prediction_rppg);

			// initialization for the next iteration
			Batch = null;
			diffBatch = null;
			batch_counter = 0;

		}
	}

	// postProcess(array): takes an array and updates 
	// 		array[i] = array[i] - avg(Buffer) 
	// Buffer: always stores 20 cumsum values, update as new point added
	function postProcess(array, buffer) {
		var i = 0;
		const len = array.length;
		array = [].concat.apply([], array);
		while (i < len) {
			buffer.push(array[i]);
			if (buffer.length > batch_size) {
				buffer.shift();
			}
			const avg = buffer.reduce((a, b) => a + b) / buffer.length;
			array[i] -= avg;
			i += 1;
		}
		return array;
	}

	// Video initialization 
	function startVideo() {
		if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
			navigator.mediaDevices.getUserMedia({
				video: true
			}).then(function(stream) {
				video.srcObject = stream;
				video.addEventListener("loadedmetadata", function() { // used to have an e here
					video.play();
					console.log("Webcam video successfully loaded");
					setInterval(loop, 20);
				})
			});
		}
	}

	function addDataPoint(data_rppg, data_resp) {
		now = vis.moment();

		dataset_rppg.add([{
			x: now,
			y: data_rppg,
		}]);
		dataset_resp.add([{
			x: now,
			y: data_resp,
		}]);

		moveWindow();
	}

	function moveWindow() {

		let strategy = 'static';
		var range_rppg = graph2d_rppg.getWindow();
		var range_resp = graph2d_resp.getWindow();

		var interval_rppg = range_rppg.end - range_rppg.start;
		var interval_resp = range_resp.end - range_resp.start;

		if (now > range_rppg.end) {
			console.log("resize");
			graph2d_rppg.setWindow(now - (0.1 * interval_rppg), now + 0.9 * interval_rppg);
		}

		if (now > range_resp.end) {
			graph2d_resp.setWindow(now - 0.1 * interval_resp, now + 0.9 * interval_resp);
		}

		switch (strategy) {
			default: // 'static'
				// move the window 90% to the left when now is larger than the end of the window
				if (range_rppg > 10) {
					graph2d_rppg.setWindow(now - 0.1 * interval_rppg, now + 0.9 * interval_rppg);
				}

				if (range_resp > 10) {
					graph2d_resp.setWindow(now - 0.1 * interval_resp, now + 0.9 * interval_resp);
				}

				setTimeout(moveWindow, delay);
				break;
		}
	}
}
