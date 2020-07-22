<template>
<div>	
  <div id = "WebCam">
	<video autodisplay="true" width="600" height="400" id="video"></video>
	<!--canvas id = "canvas" height = "680" width = "100%"></canvas-->
  </div>
  
  <div id = "visualization"></div>
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
