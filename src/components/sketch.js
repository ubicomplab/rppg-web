//var CanvasJS = require('./canvasjs.min.js');
import * as vis from 'vis-timeline/standalone';

export default function run() {

	// start the front-cam 
	var video = document.getElementById('video');

	startVideo();

	function startVideo() {
		if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
			navigator.mediaDevices.getUserMedia({
				video: true
			}).then(function(stream) {
				video.srcObject = stream;
				video.addEventListener("loadedmetadata", function() { // used to have an e here
					console.log("here");
					video.play();
				})
			});
		}
	}

	// the chart
	var names = ["uniform"];
	var groups = new vis.DataSet();
	var container = document.getElementById("visualization");
	var dataset = new vis.DataSet();
	var now = vis.moment();
	var delay = 100;
	
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


	function addDataPoint() {
		var now = vis.moment();
		var yVal = 1 + Math.round(Math.random() * 10);

		dataset.add([{
			x: now,
			y: yVal,
			group: 0
		}])
		setTimeout(addDataPoint, delay);

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
					console.log("move window");
					graph2d.setWindow(now - 0.1 * interval, now + 0.9 * interval);
				}
				setTimeout(moveWindow, delay);
				break;
		}
	}
	
	
	addDataPoint();
	moveWindow();
}
