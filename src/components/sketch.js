import * as vis from 'vis-timeline/standalone';
import * as tf from '@tensorflow/tfjs';
//import * as tfn from '@tensorflow/tfjs-node';

export default function run() {

	let video = document.getElementById('video');
	var orig_v, Xsub, dXsub, prevFrame;
	var diffBatch, Batch;
	var delay = 30;
	var batch_size = 20;
	var batch_counter = 0;
	var dim = 36;
	var prediction;
	let model;

	//const handler = tfn.io.fileSystem("./model.json");
	var path = "./model.json";

	//processModel();

	loadModel();
	async function loadModel() {
		//const handler = tfn.io.fileSystem("./model.json");
		model = await tf.loadLayersModel(path);

	}
	async function processModel() {
		//const handler = tfn.io.fileSystem("./model.json");
		model = await tf.loadLayersModel(path);
	//	model = await tf.loadLayersModel(path);
		var result = model.predict(diffBatch, Batch);
		prediction = result;
	}
	//processModel();

	//const model = tf.loadLayersModel(path);


	//const model = await tf.loadLayersModel(path);

	//const model = tf.loadLayersModel('./model.json');

	var names = ["uniform"];
	var groups = new vis.DataSet();
	var container = document.getElementById("visualization");
	var dataset = new vis.DataSet();
	var now = vis.moment();
	//	var delay = 100;

	var options = {
		drawPoints: false,
		dataAxis: {
			visible: true,
			left: {
				title: {
					text: "Normalized Amplitude",
				}
			}
		},
		legend: false,
		start: vis.moment().add(-5, "seconds"), // display start,  end
		end: vis.moment().add(10, "seconds"),

	};

	// eslint-disable-next-line
	var graph2d = new vis.Graph2d(container, dataset, groups, options);

	// could delete the group , just use dataset
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
	//initialize_chart();

	function loop() {
		preprocess();
		//	result =
		//rppg(sample);
		setTimeout(loop, delay);
	}

	function preprocess() {
		orig_v = tf.browser.fromPixels(video);
		orig_v.print(true);

		Xsub = tf.image.resizeBilinear(orig_v, [dim, dim]);
		Xsub.print(true);

		Xsub = Xsub.asType('float32').div(tf.scalar(255));
		Xsub = Xsub.expandDims(0); // (1, 36, 36, 3)
		Xsub.print(true);


		if (prevFrame == null) {
			prevFrame = Xsub;
			/* eslint-disable no-console */
			console.log("initialize")
			//batch_counter++;
			//Batch = Xsub;
			//cumSum = 0;
		} else {
			//--------------------------------------
			// didn't get  only the 300, 300 , ie didn't crop		

			// FRAME DIFF:
			dXsub = tf.div(tf.sub(Xsub, prevFrame), tf.add(Xsub, prevFrame));

			// SUBTRACT MEAN OF IMG:
			dXsub = tf.div(dXsub, tf.moments(dXsub).variance.sqrt()); // (1, 36, 36, 3)
			Xsub = tf.sub(Xsub, tf.mean(Xsub));
			Xsub = tf.div(Xsub, tf.moments(Xsub).variance.sqrt()); // (1, 36, 36, 3)
			/* eslint-disable no-console */
			console.log("below is X before mean")
			console.log(Xsub.print(true));

			// -------------------------------------
			// get average frame here 
			//Xsub = tf.mean(Xsub, 0); // (1, 36, 36, 3)
			prevFrame = Xsub;
			if (batch_counter == 0) {
				Batch = tf.cast(Xsub, 'float32');
				diffBatch = dXsub;
				/* eslint-disable no-console */
				console.log("below is batch");
				console.log(Batch.print(true));
			} else {

				//Batch = tf.expandDims(Batch, 0);
				//Xsub = tf.expandDims(Xsub, 0);
				/* eslint-disable no-console */
				console.log("X in stack")
				console.log(Xsub.print(true));
				/* eslint-disable no-console */
				console.log("batch in stack")
				console.log(Batch.print(true));

				Batch = tf.concat([Batch, Xsub]) // note the xsub here is after 
				diffBatch = tf.concat([diffBatch, dXsub]);

			}
			batch_counter++;
		}

		if (batch_counter == batch_size) {

			// call update the chart

			Batch = tf.transpose(Batch, [2, 1, 3, 0]); // swap axis
			Batch = tf.expandDims(Batch, 0); // expand dimension

			diffBatch = tf.transpose(diffBatch, [2, 1, 3, 0]); // swap axis
			diffBatch = tf.expandDims(diffBatch, 0); // expand dimension

			(async () => {
				await processModel();
			})()
			addDataPoint();
			// initialization for the next iteration
			Batch = null;
			diffBatch = null;
			prevFrame = null;
			batch_counter = 0;

		}
	}

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

	// the chart
	function addDataPoint() {
		var now = vis.moment();
		//var yVal = 1 + Math.round(Math.random() * 10);

		console.log("inside prediction");
		console.log(prediction);
		dataset.add([{
			x: now,
			y: prediction,
			group: 0
		}])

		setTimeout(moveWindow, delay);
	}

	function moveWindow() {

		let strategy = 'static';
		var range = graph2d.getWindow();
		now = vis.moment();

		var interval = range.end - range.start;

		if (now > range.end) {
			graph2d.setWindow(now - 0.1 * interval, now + 0.9 * interval);
		}

		switch (strategy) {
			default: // 'static'
				// move the window 90% to the left when now is larger than the end of the window
				if (range > 10) {
					//		console.log("move window");
					graph2d.setWindow(now - 0.1 * interval, now + 0.9 * interval);
				}
				setTimeout(moveWindow, delay);
				break;
		}
	}
}
/*var names, groups, container, dataset, now, options, graph2d;

function initialize_chart() {
	var names = ["uniform"];
	var groups = new vis.DataSet();
	var container = document.getElementById("visualization");
	var dataset = new vis.DataSet();
	var now = vis.moment();
	//	var delay = 100;

	var options = {
		drawPoints: false,
		dataAxis: {
			visible: true,
			left: {
				title: {
					text: "Normalized Amplitude",
				}
			}
		},
		legend: false,
		start: vis.moment().add(-5, "seconds"), // display start,  end
		end: vis.moment().add(10, "seconds"),

	};

	// eslint-disable-next-line
	var graph2d = new vis.Graph2d(container, dataset, groups, options);

	// could delete the group , just use dataset
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
}*/
//import * as cv from 'opencv'
/*const cv = require('opencv4nodejs');



cv['onRuntimeInitialized']=()=>{
          let mat = new cv.Mat();
          console.log(mat.size());
          mat.delete();
};
	cv['onRuntimeInitialized'] = () => {
		var startTime = Date.now();
		//var dim = 36;
		let src = new cv.Mat(video.height, video.width, cv.CV_32FC3);
		let dst = new cv.Mat(video.height, video.width, cv.CV_32FC3);
		let cap = new cv.VideoCapture(video);
		//let zeroMat = new cv.Mat.zeros(dim, dim, cv.CV_32FC3);

		cap.read(src); // src stores the current frame , shape(480, 640, 3(type->float))

		let rect = new cv.Rect(160, 90, 300, 300);
		dst = src.roi(rect); // cropped data here
		console.log(dst.rows);
		
		while success:
		      t.append(vidObj.get(cv2.CAP_PROP_POS_MSEC))# current timestamp in milisecond 
		      vidLxL = cv2.resize(img_as_float(img[:, int(width/2) - int(height/2 + 1) : int(height/2) + int(width/2), :]), (L, L))
		      plt.imshow(cv2.rotate(vidLxL, cv2.ROTATE_90_CLOCKWISE))
		      vidLxL[vidLxL > 1] = 1
		      vidLxL[vidLxL < (1/255)] = 1/255
		      Xsub[i, :, :, :] = vidLxL
		      success, img = vidObj.read() # read the next one
		      i = i + 1
		


		const FPS = 30;

		preprocess();
		console.log("happy")
		let endTime = Date.now();
		console(endTime - startTime);

		function preprocess() {
			try {
				//if (!streaming) {
				// clean and stop.
				//		src.delete();
				//		dst.delete();
				//		return;
				//	}

				let begin = Date.now();
				// start processing.
				//	let vidLxL = cv2.resize(src, dst, )


				cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
				cv.imshow('canvasOutput', dst);
				// schedule the next one.
				let delay = 1000 / FPS - (Date.now() - begin);
				setTimeout(preprocess, delay);
			} catch (err) {
				//utils.printError(err);
			}
		}
		src.delete();
		dst.delete();
		cap.delete();
		rect.delete();

	};
*/
