<template>
	<div>
		<div id="WebCam">
			<video autodisplay="true" height="480" width="640" id="video"></video>
			<!--canvas id = "mycanvas" height = "480" width = "640"></canvas-->
			<!--canvas id = "canvasFrame" height = "680" width = "100%"></canvas-->
			
		</div>

		<div id="chart_rppg"></div>
		<div id="chart_resp"></div>
	</div>
</template>

<script>
	import run from './sketch.js'

	export default {
		name: 'WebCam',
		props: {
			msg: String
		},
		mounted() {
			
			run();
		},
		methods: {
			//getVideoDimensions(e) {
				//console.log(e.target.videoHeight)
				//console.log(e.target.videoWidth)
			//}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	#chart {

		top: 900;
		left: 900;

	}
</style>
