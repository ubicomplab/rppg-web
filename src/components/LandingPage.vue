<template>
	<div>
		<div id="WebCam">
			<video autodisplay="true" height="400" width="400" id="video"></video>
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
		methods: {}
	}
	
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
