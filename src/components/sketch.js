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
	let cumsum_end = 0;
	var diffBatch, Batch;
	var delay = 10;
	const batch_size = 20;
	var batch_counter = 0;
	var dim = 36;
	var prediction;
	let model;
	let prediction_rppg, prediction_resp;
	//const Delay = ms => new Promise(res => setTimeout(res, ms));

	// Register Cusomized Layers
	tf.serialization.registerClass(TSM);
	tf.serialization.registerClass(AttentionMask);

	// Load ML Model
	loadModel();
	startVideo();

	// Definition for the line chart 
	//var names = ["uniform"];
	//var groups = new vis.DataSet();
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
		legend: false,
		start: vis.moment().add(-1, "seconds"), // display start,  end
		end: vis.moment().add(10, "seconds"),
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
		legend: true,
		start: vis.moment().add(-1, "seconds"), // display start,  end
		end: vis.moment().add(10, "seconds"),
	};

	// eslint-disable-next-line
	var graph2d_rppg = new vis.Graph2d(container_rppg, dataset_rppg, options_rppg);
	var graph2d_resp = new vis.Graph2d(container_resp, dataset_resp, options_resp);


	//	var counter = 0;
	async function loadModel() {

		model = await tf.loadLayersModel(path);
		/* eslint-disable no-console */
		console.log("Successfully loaded ml model");
	}

	var current_tolerance = 2 * batch_size;
	async function loop() {
		orig_v = tf.browser.fromPixels(video); // update Frame
		var t1 = performance.now();
		preprocess();
		if (movingAvg_resp.length >= current_tolerance) {
			var t2 = performance.now();
			console.log("one process")
			console.log(t2 - t1);

			addDataPoint(movingAvg_rppg[0], movingAvg_resp[0]);
			movingAvg_resp.shift();
			movingAvg_rppg.shift();
			current_tolerance--;

			if (current_tolerance < 0) {
				current_tolerance = movingAvg_resp.length;
			}
		}
		setTimeout(loop, 10);
	}

	// Video data Preprocess
	async function preprocess() {
		var at2 = performance.now();

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
				Batch = tf.concat([Batch, Xsub2]) // note the xsub here is after 
				diffBatch = tf.concat([diffBatch, dXsub]);
			}
			batch_counter++;
			var at3 = performance.now();
			console.log("preprocess " + (at3 - at2));
		}
		
		if (batch_counter == batch_size) {

			var t4 = performance.now();
			prediction = await model.predict([diffBatch, Batch]);
			prediction_rppg = prediction[0].cumsum().arraySync(); // size 20
			prediction_resp = prediction[1].cumsum().arraySync(); // size 20		

			prediction_rppg = postProcess(prediction_rppg);
			prediction_resp = postProcess(prediction_resp);

			console.log(prediction_resp)
			//	await addDataPoint();

			movingAvg_resp = movingAvg_resp.concat(prediction_resp);
			console.log(movingAvg_resp);
			movingAvg_rppg = movingAvg_rppg.concat(prediction_rppg);


			// initialization for the next iteration
			Batch = null;
			diffBatch = null;
			batch_counter = 0;
			var t5 = performance.now();
			console.log("post process" + (t5 - t4));
		}
	}

	function postProcess(array) {
		var i = 1;
		const len = array.length;
		array[0] = parseFloat(array[0] - cumsum_end);
		while (i <= len) {
			var partArray = array.slice(0, i).map(Number);
			const avg = partArray.reduce((a, b) => a + b) / partArray.length;
			array[i] -= avg;
			i += 1;
		}
		array.pop();
		cumsum_end = array[len - 1];
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
					/* eslint-disable no-console */
					console.log("Webcam video successfully loaded");
					loop();
				})
			});
		}
	}

	async function addDataPoint(data_rppg, data_resp) {

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
		//	const time_now = vis.moment();

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
/*		movingAvg_rppg.push(cumsum_rppg);
			movingAvg_resp.push(cumsum_resp);

			if (movingAvg_rppg.length > 10) {
				movingAvg_rppg.shift();
				movingAvg_resp.shift();
			}

			const avg_rppg = movingAvg_rppg.reduce((a, b) => a + b) / movingAvg_rppg.length;
			const avg_resp = movingAvg_resp.reduce((a, b) => a + b) / movingAvg_resp.length;

			const data_rppg = cumsum_rppg - avg_rppg;
			const data_resp = cumsum_resp - avg_resp;

			mvAvg_len++;
			if (mvAvg_len > 10) {
				addDataPoint(data_rppg, data_resp);
				moveWindow();
			}*/
