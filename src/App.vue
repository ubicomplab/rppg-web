<template>
	<div id="app">
		<WebCam msg="RPPG" />
	</div>
</template>

<script>
	import WebCam from './components/LandingPage.vue'
	
	export default {
		name: 'App',
		components: {
			WebCam
		}
	}
</script>

<style>
	#app {
		margin-top: -0px !important; 
		font-family: Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
		margin-top: 60px;
	}
</style>
