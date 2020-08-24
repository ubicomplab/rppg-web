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
	//Xsub, dXsub, prevFrame;
	var diffBatch, Batch;
	var delay = 10;
	var batch_size = 20;
	var batch_counter = 0;
	var dim = 36;
	var prediction;
	let model;
	let prediction_rppg, prediction_resp;
	var t_start, t_end;
	var orig_batch;

	// Register Cusomized Layers
	tf.serialization.registerClass(TSM);
	tf.serialization.registerClass(AttentionMask);

	// Load ML Model
	loadModel();

	async function loadModel() {
		
		model = await tf.loadLayersModel(path);
		/* eslint-disable no-console */
		console.log("Successfully loaded ml model");
		
	}

	// Definition for the line chart 
	var names = ["uniform"];
	var groups = new vis.DataSet();
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
					text: "cumsum  rppg",
				}
			}
		},
		legend: false,
		start: vis.moment().add(-5, "seconds"), // display start,  end
		end: vis.moment().add(10, "seconds"),
	};

	var options_resp = {
		drawPoints: false,
		dataAxis: {
			visible: true,
			left: {
				title: {
					text: "cumsum  resp",
				}
			}
		},
		legend: false,
		start: vis.moment().add(-5, "seconds"), // display start,  end
		end: vis.moment().add(10, "seconds"),
	};

	// eslint-disable-next-line
	var graph2d_rppg = new vis.Graph2d(container_rppg, dataset_rppg, groups, options_rppg);
	var graph2d_resp = new vis.Graph2d(container_resp, dataset_resp, groups, options_resp);

	// Note: could delete the group , just use dataset
	groups.add({
		id: 0,
		content: names[0],
		options: {
			drawPoints: false,
			interpolation: {
				parametrization: "uniform",
			},
		},
	});

	startVideo();

	async function loop() {
		
		orig_v = tf.browser.fromPixels(video); // update Frame
		await preprocess();
		setTimeout(loop, delay);
	}

	// Video data Preprocess
	async function preprocess() {

		var Xsub = tf.image.resizeBilinear(orig_v, [dim, dim]);
		Xsub = Xsub.asType('float32').div(tf.scalar(255));
		Xsub = Xsub.expandDims(0); // (1, 36, 36, 3)

		if (prevFrame == null) {
			
			prevFrame = Xsub;
			orig_batch = orig_v;
			/* eslint-disable no-console */
			console.log("new data initialize");
			
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
				orig_batch = tf.concat([orig_v, orig_batch]);
			
			}
			batch_counter++;
			
		}

		if (batch_counter == batch_size) {
			t_start = performance.now();
			prediction = await model.predict([diffBatch, Batch]);
			console.log(prediction[0].arraySync());
			console.log(prediction[1].arraySync());

			prediction_rppg = normalize_data(prediction[0].cumsum().arraySync());
			prediction_resp = normalize_data(prediction[1].cumsum().arraySync());

			console.log(prediction_rppg);
			t_end = performance.now();

			console.log("total time spend for one Batch " + (t_end - t_start));
			await addDataPoint();

			// initialization for the next iteration
			Batch = null;
			diffBatch = null;
			orig_batch = null;
			prevFrame = null;
			batch_counter = 0;

		}
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

	// normalize output function 
	function normalize_data(array) {
		//console.log(array);
		var merged = [].concat.apply([], array);
		const n = merged.length;
		const max = Math.max.apply(Math, array);
		const min = Math.min.apply(Math, array);
		const diff = max - min;
		var i = 0;
		while (i < n) {

			merged[i] = (merged[i] - min) / diff;
			i++;
		}
		console.log(merged)
		return merged;

	}

	// the chart
	function addDataPoint() {
		var i = 0;
		while (i < 20) {
			now = vis.moment();
			dataset_rppg.add([{
				x: now,
				y: prediction_rppg[i],
				group: 0
			}]);
			dataset_resp.add([{
				x: now,
				y: prediction_resp[i],
				group: 0
			}]);
			i++;
		}
		setTimeout(moveWindow, delay);
	}

	function moveWindow() {

		let strategy = 'static';
		var range = graph2d_rppg.getWindow();
		now = vis.moment();

		var interval = range.end - range.start;

		if (now > range.end) {
			graph2d_rppg.setWindow(now - 0.1 * interval, now + 0.9 * interval);
			graph2d_resp.setWindow(now - 0.1 * interval, now + 0.9 * interval);
		}

		switch (strategy) {
			default: // 'static'
				// move the window 90% to the left when now is larger than the end of the window
				if (range > 10) {
					graph2d_rppg.setWindow(now - 0.1 * interval, now + 0.9 * interval);
					graph2d_resp.setWindow(now - 0.1 * interval, now + 0.9 * interval);
				}
				setTimeout(moveWindow, delay);
				break;
		}
	}
}
