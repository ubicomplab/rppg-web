<template>	
	<div>
		<section>
			<header>
					<a href="http://www.washington.edu/">
						<img src="whiteLogo2.png" alt="UW Logo" width="90" height="60" class="UW-logo">
					</a>
					<a href="http://www.washington.edu/">
						<img src="whiteLogo.png" alt="UW Logo" width="260" height="24" class="UW-text">
					</a>
			</header>
			<h3>Build by teams from</h3>
			<div class="flex-container">
				<div stype="flex-grow: 3" class="col-md-1"></div>
				<div style="flex-grow: 1">
					<a href="https://www.cs.washington.edu/">
						<img src="logo4.png" alt="Paul G.Allen School of Computer Science & Engineering" width="400" height="80">
					</a>
				</div>
				<div style="flex-grow: 1">
					<a href="https://scholar.google.com/citations?user=m7Jr-b4AAAAJ&hl=en">
						<img src='circle-cropped.png' alt="Dave McDuff" width="110" height="110">
					</a>
				</div>
				<div stype="flex-grow: 3" class="col-md-1"></div>
			</div>
		</section>
		<div id="WebCam">
			<video autodisplay="true" height="400" width="400" id="video" alighn="center"></video>
		</div>
		<div id="chart_rppg"></div>
		<div id="chart_resp"></div>
		<footer>
			<a href="http://www.washington.edu/">
				<img src="whiteLogo.png" alt="UW Logo" width="260" height="24">
				<p style="font-size:0.6875rem; color:white">© 2020 University of Washington | Seattle, WA</p>
			</a>
		</footer>
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
	header {
		background-color: #330066;
		padding: 40px;
		text-align: center;
		font-size: 55px;
	}
	
	footer {
		background-color: #330066;
		padding: 40px;
		text-align: center;
		font-size: 55px;
		color: white;
	}

	.UW-logo {
		position: absolute;
		left: 200px;
		top: 30px;
	}

	.UW-text {
		position: absolute;
		left: 300px;
		top: 50px;
	}
	
	.flex-container {
		display: flex;
		height: 150px;
		align-items: center;
		background-color: #FFFFFF;
	}

	.flex-container>div {
		background-color: #FFFFFF;
		width: 100px;
		margin: 10px;
		text-align: center;
		line-height: 75px;
		font-size: 30px;
	}

	.logo {
		float: left;
	}

	.images {
		display: inline-block;
		float: left;
		margin: 30px;
		padding: 0px;
	}

</style>
